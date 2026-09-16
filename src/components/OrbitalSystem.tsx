import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { ORBITAL_SYSTEM_DEFAULTS, type OrbitalSystemTuning } from './orbitalSystemTuning';

export type { OrbitalSystemTuning };
export { ORBITAL_SYSTEM_DEFAULTS };

interface OrbitalSystemProps extends Partial<OrbitalSystemTuning> {
  accent: string;
  background: string;
  reducedMotion: boolean;
  // The DOM portrait: its screen position/size define the sun. The photo is
  // re-drawn inside the scene at the focus so planets can pass in front of it;
  // onReady fires once that in-scene portrait is visible.
  anchorRef: RefObject<HTMLElement | null>;
  portraitSrc: string;
  onReady?: () => void;
}

// Orbits: semi-major axis, eccentricity, inclination and periapsis angle
// (deg). Periapsis angles were solved numerically (scratch orbit-calc3.mjs,
// which also reports view-space Z) so that apoapsis - where Kepler's 2nd law
// makes planets linger - projects near/lower-right of the portrait, and
// periapsis (fast, rarely lingered on) sits far/upper-left, receding into the
// screen. Inclinations are large and varied on purpose (was +-2..4deg, now
// +-7..15deg) so the orbital planes visibly cross rather than reading as one
// flat disc.
// Scaled up ~1.6x from the solved geometry (peri/e are ratios, scale-invariant;
// only a and size grow) plus a closer FOCUS_DISTANCE, so the disc fills much
// more of the hero instead of sitting as a modest cluster around the portrait.
const ORBITS = [
  { a: 2.1, e: 0.4, inc: -3, peri: 65, size: 0.12, color: '#e8e2d6', ring: false, phase: 2.6 },
  { a: 2.8, e: 0.42, inc: 3, peri: 63, size: 0.15, color: '#5b8cff', ring: false, phase: 3.3 },
  { a: 3.5, e: 0.44, inc: -3, peri: 67, size: 0.18, color: '#9fe3d0', ring: false, phase: 2.2 },
  { a: 4.6, e: 0.46, inc: 4, peri: 62, size: 0.44, color: '#ffb86b', ring: true, phase: 3.05 },
  { a: 5.75, e: 0.46, inc: -4, peri: 65, size: 0.3, color: '#c8b6ff', ring: false, phase: 2.75 },
  { a: 6.9, e: 0.48, inc: 3, peri: 60, size: 0.23, color: '#7fd7ff', ring: false, phase: 3.5 },
] as const;

const softDot = () => {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.55)');
  grad.addColorStop(0.65, 'rgba(255,255,255,0.12)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
};

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aSeed;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vAlpha = 0.45 + 0.55 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0);
    gl_PointSize = aSize * uPixelRatio;
    gl_Position = projectionMatrix * mv;
  }
`;
const STAR_FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float a = texture2D(uMap, gl_PointCoord).a;
    gl_FragColor = vec4(vec3(0.85, 0.92, 1.0), a * uOpacity * vAlpha);
  }
`;

const orbitPoint = (a: number, e: number, theta: number, out: THREE.Vector3) => {
  const r = (a * (1 - e * e)) / (1 + e * Math.cos(theta));
  return out.set(r * Math.cos(theta), 0, r * Math.sin(theta));
};

const OrbitalSystem = (props: OrbitalSystemProps) => {
  const { accent, background, reducedMotion, anchorRef, portraitSrc, onReady } = props;
  // Individual primitive values (not the merged object, which is a fresh
  // reference every render) so the effect below only rebuilds the scene when
  // a tuning number actually changes, not on every unrelated re-render.
  const {
    elevationDeg, rollDeg, focusDistance, fov, offsetXRatio, offsetYRatio, speedCoeff, speedExp, orbitScale,
  }: OrbitalSystemTuning = { ...ORBITAL_SYSTEM_DEFAULTS, ...props };
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    // The whole scene used to get built in one synchronous block - Lighthouse
    // traced ~1.4s of "Script Evaluation" to exactly this moment, delaying
    // even plain text paint elsewhere on the page (LCP 3.3s -> 5.2s). Setup is
    // now staged across a few macrotask yields (cheap scene first, then
    // orbits, then stars), with renderer.compile() called after each stage so
    // shader compilation - the actual expensive part, normally deferred to
    // the first render() call - gets spread out too instead of happening as
    // one lump when the scene finally renders.
    let cancelled = false;
    const yieldToMain = () =>
      new Promise<void>(resolve => {
        const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
        if (ric) ric(() => resolve(), { timeout: 50 });
        else setTimeout(resolve, 0);
      });

    const FOCUS_DISTANCE = focusDistance;
    const FOV = fov;
    const ELEVATION = THREE.MathUtils.degToRad(elevationDeg);
    const ROLL = THREE.MathUtils.degToRad(rollDeg);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const scene = new THREE.Scene();
    // Fog toward the page background reads as atmospheric depth on a transparent canvas
    scene.fog = new THREE.Fog(new THREE.Color(background), FOCUS_DISTANCE + 1.5, FOCUS_DISTANCE + 9);

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
    camera.position.set(0, FOCUS_DISTANCE * Math.sin(ELEVATION), FOCUS_DISTANCE * Math.cos(ELEVATION));
    camera.lookAt(0, 0, 0);
    camera.rotateZ(ROLL);
    camera.updateMatrixWorld();

    const accentColor = new THREE.Color(accent);
    const disposables: { dispose: () => void }[] = [];
    const dotTexture = softDot();
    disposables.push(dotTexture);

    // Everything orbits this root; it is moved so the focus sits on the portrait
    const root = new THREE.Group();
    scene.add(root);

    // Eccentric orbits bulge their visual mass toward apoapsis (the far/bulk
    // side), so with the maths as-is the portrait reads as sitting at the EDGE
    // of the cluster, not its centre. discRoot carries only the orbit frames -
    // never the sun/corona/light, which must stay exactly on the portrait -
    // offset a fixed screen-space amount up-left so the cluster's visual
    // centre lands back on the portrait. Angles/eccentricity/roll untouched.
    const discRoot = new THREE.Group();
    root.add(discRoot);

    // Sun: the portrait itself, drawn at the focus so depth testing lets near
    // planets and arcs pass in front of it, plus a corona and the light every
    // planet is lit by. A Sprite always faces the camera exactly (same math as
    // matching the camera's quaternion by hand, but native and can't drift) -
    // it renders upright regardless of the camera's roll/elevation, with no
    // per-frame orientation code needed.
    const coronaMaterial = new THREE.SpriteMaterial({ map: dotTexture, color: accentColor, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false });
    const corona = new THREE.Sprite(coronaMaterial);
    corona.renderOrder = -1;
    root.add(corona);
    disposables.push(coronaMaterial);

    // alphaTest discards the transparent corners of the sprite's square so they
    // don't write depth - otherwise a planet passing behind a corner (outside
    // the visible circle) would be incorrectly occluded by invisible pixels.
    const portraitMaterial = new THREE.SpriteMaterial({ transparent: true, opacity: 0, alphaTest: 0.5, depthWrite: true, depthTest: true, toneMapped: false });
    const portraitSprite = new THREE.Sprite(portraitMaterial);
    scene.add(portraitSprite);
    disposables.push(portraitMaterial);
    let portraitReady = false;
    new THREE.TextureLoader().load(portraitSrc, loaded => {
      // Mask the square photo into a circle once, on a canvas, instead of
      // shipping a separate ring mesh to fake the edge.
      const image = loaded.image as HTMLImageElement;
      const size = 512;
      const c = document.createElement('canvas');
      c.width = c.height = size;
      const g = c.getContext('2d')!;
      g.save();
      g.beginPath();
      g.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      g.clip();
      const cover = Math.max(size / image.width, size / image.height);
      const w = image.width * cover;
      const h = image.height * cover;
      g.drawImage(image, (size - w) / 2, (size - h) / 2, w, h);
      g.restore();
      const masked = new THREE.CanvasTexture(c);
      masked.colorSpace = THREE.SRGBColorSpace;
      portraitMaterial.map = masked;
      portraitMaterial.opacity = 1;
      portraitMaterial.needsUpdate = true;
      loaded.dispose();
      disposables.push(masked);
      portraitReady = true;
    });
    const sun = new THREE.PointLight(accentColor.clone().lerp(new THREE.Color('#ffffff'), 0.7), 110, 0, 2);
    root.add(sun);
    scene.add(new THREE.AmbientLight('#8fb3ff', 0.6));

    // Orbits + planets and the star field are built in later stages (below);
    // these are populated then, `render`/`tick` close over the `let`s so an
    // empty array here just means "nothing to draw yet" for the one or two
    // frames before that happens - never actually visible since the host div
    // stays opacity:0 until onReady fires anyway.
    const tmp = new THREE.Vector3();
    let bodies: { a: number; e: number; planet: THREE.Mesh; theta: number; speed: number }[] = [];
    let starMaterial: THREE.ShaderMaterial | null = null;

    const halfHeight = FOCUS_DISTANCE * Math.tan((FOV / 2) * (Math.PI / 180));
    const syncAnchor = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const h = host.getBoundingClientRect();
      const an = anchor.getBoundingClientRect();
      const unit = halfHeight / (h.height / 2);
      const cx = (an.left + an.width / 2 - (h.left + h.width / 2)) * unit;
      const cy = -(an.top + an.height / 2 - (h.top + h.height / 2)) * unit;
      // World point that projects onto the portrait centre at the focus distance
      root.position.copy(camera.localToWorld(new THREE.Vector3(cx, cy, -FOCUS_DISTANCE)));
      const radius = (an.width / 2) * unit;
      corona.scale.setScalar(radius * 2 * 2.6);
      portraitSprite.scale.setScalar(radius * 2);
      portraitSprite.position.copy(root.position);

      // Same projection, offset by a fraction of the portrait's own size, minus
      // root's own position -> a pure local delta to apply to discRoot (root
      // carries no persistent rotation, only tiny pointer-parallax jitter, so
      // world delta ~= local delta).
      const offsetPxX = offsetXRatio * an.width;
      const offsetPxY = offsetYRatio * an.width;
      const ocx = (an.left + an.width / 2 + offsetPxX - (h.left + h.width / 2)) * unit;
      const ocy = -(an.top + an.height / 2 + offsetPxY - (h.top + h.height / 2)) * unit;
      discRoot.position.copy(
        camera.localToWorld(new THREE.Vector3(ocx, ocy, -FOCUS_DISTANCE)).sub(root.position),
      );
    };

    let frame = 0;
    let visible = true;
    let time = 0;
    let last = 0;
    let targetX = 0;
    let targetY = 0;
    let parallaxX = 0;
    let parallaxY = 0;
    let announced = false;
    let frameCount = 0;

    const render = () => {
      parallaxX += (targetX - parallaxX) * 0.04;
      parallaxY += (targetY - parallaxY) * 0.04;
      root.rotation.x = parallaxX;
      root.rotation.y = parallaxY;
      if (starMaterial) starMaterial.uniforms.uTime.value = time;
      bodies.forEach(b => {
        orbitPoint(b.a, b.e, b.theta, tmp);
        b.planet.position.copy(tmp);
        b.planet.rotation.y = time * 0.2;
      });
      coronaMaterial.opacity = 0.46 + 0.05 * Math.sin(time * 0.5);
      renderer.render(scene, camera);
      if (portraitReady && !announced) {
        announced = true;
        onReady?.();
      }
    };
    const tick = (now: number) => {
      if (!visible || document.hidden) { frame = 0; last = 0; return; }
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      time += dt;
      // The portrait animates in and the layout can shift; keep the sun on it
      if (++frameCount % 20 === 0) syncAnchor();
      bodies.forEach(b => {
        const k = 1 + b.e * Math.cos(b.theta);
        b.theta = (b.theta + dt * b.speed * k * k) % (Math.PI * 2);
      });
      render();
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      if (reducedMotion) { render(); return; }
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const stop = () => { if (frame) cancelAnimationFrame(frame); frame = 0; last = 0; };

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(Math.max(1, width), Math.max(1, height), false);
      camera.aspect = width / Math.max(1, height);
      camera.updateProjectionMatrix();
      syncAnchor();
      render();
    };
    const onPointerMove = (e: PointerEvent) => {
      if (reducedMotion) return;
      targetY = (e.clientX / window.innerWidth - 0.5) * 0.1;
      targetX = (e.clientY / window.innerHeight - 0.5) * 0.06;
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    let wired = false;
    let ro: ResizeObserver | null = null;
    let io: IntersectionObserver | null = null;

    // renderer.compile() forces shader compilation for whatever materials
    // exist in the scene right now, instead of letting it happen implicitly
    // (and all at once) on the first renderer.render() call - called again
    // after each stage below adds more materials, so that cost gets spread
    // across yields too, not just the JS object construction.
    renderer.compile(scene, camera);

    (async () => {
      await yieldToMain();
      if (cancelled) return;

      // Stage: orbits + planets
      const lineColor = accentColor.clone().lerp(new THREE.Color('#ffffff'), 0.55);
      bodies = ORBITS.map(o => {
        const a = o.a * orbitScale;
        const size = o.size * orbitScale;
        const frame = new THREE.Group();
        frame.rotation.y = THREE.MathUtils.degToRad(o.peri);
        frame.rotation.x = THREE.MathUtils.degToRad(o.inc);
        discRoot.add(frame);

        const segments = 256;
        const pts: number[] = [];
        for (let s = 0; s <= segments; s++) {
          orbitPoint(a, o.e, (s / segments) * Math.PI * 2, tmp);
          pts.push(tmp.x, tmp.y, tmp.z);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: lineColor, transparent: true, opacity: 0.3, fog: true });
        frame.add(new THREE.Line(geometry, lineMaterial));
        disposables.push(geometry, lineMaterial);

        const planetGeometry = new THREE.SphereGeometry(size, 40, 40);
        const planetMaterial = new THREE.MeshStandardMaterial({ color: o.color, roughness: 0.7, metalness: 0, emissive: new THREE.Color(o.color), emissiveIntensity: 0.14, fog: true });
        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        frame.add(planet);
        disposables.push(planetGeometry, planetMaterial);

        if (o.ring) {
          const ringGeometry = new THREE.RingGeometry(size * 1.45, size * 2.3, 96);
          const ringMaterial = new THREE.MeshStandardMaterial({ color: '#f3d7a8', roughness: 0.9, transparent: true, opacity: 0.55, side: THREE.DoubleSide, fog: true });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.rotation.x = THREE.MathUtils.degToRad(72);
          ring.rotation.y = THREE.MathUtils.degToRad(-18);
          planet.add(ring);
          disposables.push(ringGeometry, ringMaterial);
        }

        // Exaggerated past real Kepler's-3rd-law scaling (a^-1.5) so the
        // innermost/outermost planets read as obviously different speeds, not a
        // subtle ratio you'd need to time with a stopwatch to notice.
        return { a, e: o.e, planet, theta: o.phase as number, speed: speedCoeff * Math.pow(a, -speedExp) };
      });
      if (cancelled) return;
      renderer.compile(scene, camera);

      await yieldToMain();
      if (cancelled) return;

      // Stage: star field, far behind the plane
      const starCount = 320;
      const starPos: number[] = [];
      const starSize: number[] = [];
      const starSeed: number[] = [];
      let seed = 5;
      const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      for (let i = 0; i < starCount; i++) {
        starPos.push((rand() - 0.5) * 40, (rand() - 0.2) * 22, -6 - rand() * 14);
        starSize.push(1.2 + rand() * 2.4);
        starSeed.push(rand());
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
      starGeometry.setAttribute('aSize', new THREE.Float32BufferAttribute(starSize, 1));
      starGeometry.setAttribute('aSeed', new THREE.Float32BufferAttribute(starSeed, 1));
      starMaterial = new THREE.ShaderMaterial({
        uniforms: { uMap: { value: dotTexture }, uOpacity: { value: 0.55 }, uTime: { value: 0 }, uPixelRatio: { value: pixelRatio } },
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      scene.add(new THREE.Points(starGeometry, starMaterial));
      disposables.push(starGeometry, starMaterial);
      if (cancelled) return;
      renderer.compile(scene, camera);

      // Wire up observers/listeners and actually start rendering - only now,
      // with everything built and pre-compiled, is the first real render()
      // call cheap.
      ro = new ResizeObserver(resize);
      io = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible) start(); else stop();
      });
      ro.observe(host);
      io.observe(host);
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      wired = true;
      resize();
      start();
      host.style.opacity = '1';
    })();

    return () => {
      cancelled = true;
      stop();
      if (wired) {
        ro?.disconnect();
        io?.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('visibilitychange', onVisibility);
      }
      disposables.forEach(d => d.dispose());
      renderer.dispose();
    };
    // Any tuning-value change tears down and rebuilds the whole scene - fine
    // for a dev-only slider panel, would be wasteful driven every frame.
  }, [accent, background, reducedMotion, anchorRef, portraitSrc, onReady,
    elevationDeg, rollDeg, focusDistance, fov, offsetXRatio, offsetYRatio, speedCoeff, speedExp, orbitScale]);

  return (
    <div ref={hostRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity 1.6s ease' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default OrbitalSystem;
