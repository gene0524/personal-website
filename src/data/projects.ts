// Work catalogue. One entry per project; the section, dialog and screenshot
// pipeline all read from here.
//
// Framing rule: every entry answers "what is it, who is it for, what did I do,
// what came of it". The website/app is never the point; it is one of the tools.
//
//   org        who it was for / where it lives (shown as the eyebrow)
//   kind       plain-word categories, 1–3. The FIRST one is the primary category
//              and drives the filter row (keep it to the PRIMARY_KINDS list);
//              the rest are descriptors shown in the list view and dialog.
//   tagline    what it is, one line
//   role       my part, one line ("Co-founder · built the site and events system")
//   facts      2–3 short outcomes/metrics shown under the tile ("13 events")
//   about      2–4 sentences for the detail view: context and what it does
//   highlights bullets for the detail view: what I did / what came of it
//   tech       shown only in the detail view
//   image      derived from slug: /assets/images/projects/<slug>.webp
//              (source PNG in assets-src/projects/<slug>.png; `npm run shots`
//              captures live sites, `npm run optimize:images` makes the WebP).
//              null = no picture yet; the tile renders a generated cover.
//   status     live | wip | research | archived (affects order; wip gets a note)
//   featured   featured entries come first
//   order      optional manual pin (1, 2, 3 ...) that beats the automatic order

export type ProjectStatus = 'live' | 'wip' | 'research' | 'archived';
export type ProjectLinkKey = 'live' | 'repo' | 'npm' | 'paper' | 'demo';

export interface Project {
  slug: string;
  title: string;
  org: string;
  kind: string[];
  tagline: string;
  role: string;
  facts: string[];
  about: string;
  highlights?: string[];
  tech: string[];
  year: string;
  status: ProjectStatus;
  featured?: boolean;
  order?: number;
  image?: { width: number; height: number; position?: string } | null;
  links: Partial<Record<ProjectLinkKey, string>>;
}

export const projectImageUrl = (p: Project) =>
  p.image ? `/assets/images/projects/${p.slug}.webp` : null;

export const STATUS_NOTE: Partial<Record<ProjectStatus, string>> = {
  wip: 'in progress',
  archived: 'archive',
};

const STATUS_ORDER: Record<ProjectStatus, number> = { live: 0, research: 1, wip: 2, archived: 3 };

const catalogue: Project[] = [
  {
    slug: 'britween',
    title: 'Britween',
    org: 'Non-profit · London',
    kind: ['Community', 'Non-profit'],
    tagline: 'A community for Taiwanese students and professionals in the UK, built around real gatherings rather than a group chat.',
    role: 'Co-founder · built the site and the events system the team runs on',
    facts: ['13 events since Aug 2025', '445 attendees', 'Networking · festivals · workshops · study-abroad talks'],
    about:
      'Britween exists so that people arriving from Taiwan have somewhere to land: monthly networking afternoons, a Mid-Autumn barbecue, hotpot-and-karaoke nights, craft workshops, "how to actually live in the UK" talks hosted at LSE, and application seminars for those still deciding whether to come. It is run by a small volunteer team and funded by ticket sales.',
    highlights: [
      'Co-founded the organisation and shaped the two tracks: community life and study-abroad guidance',
      'Designed and built britween.com: event listings with status, capacity and registration, an admin panel so the team can publish events without touching code, analytics consent',
      'Handled the operational side of the web presence: domain, hosting, analytics',
    ],
    tech: ['React', 'TypeScript', 'Vite', 'Radix UI', 'Tailwind', 'Vercel'],
    year: '2025 – present',
    status: 'live',
    featured: true,
    image: { width: 1440, height: 900 },
    links: {
      live: 'https://britween.com',
    },
  },
  {
    slug: 'cosmogram',
    title: 'Cosmogram',
    org: 'Open source · npm',
    kind: ['Open source', 'Developer tool', 'AI agents'],
    tagline: 'A lockfile, runtime trace and blame tool for the skills and configs that make up a Claude Code agent.',
    role: 'Sole author · design, core, CLI, UI, Claude Code adapter',
    facts: ['npm: cosmogram v0.3', 'Apache-2.0', 'CI on every push'],
    about:
      'As you automate more of your work with AI agents you accumulate skills, prompt fragments and configs scattered across runtime folders, with no record of which version of what an agent was assembled from, and no way to attribute a bad run to a specific change. Cosmogram pins every skill by content hash into a registry, writes a lockfile-style manifest per agent, traces what was actually invoked in a session, and ranks suspects when a run goes wrong. The UI draws the ecosystem as bodies on a sphere with dependencies as the lines between them.',
    highlights: [
      'Merkle-style content hashing: a change to any file changes the skill identity, so drift is visible',
      'Declared-vs-actual gap between manifest and runtime trace is the attribution mechanism',
      'Runtime-agnostic core with adapters at the edge; first adapter targets Claude Code',
      'Published as a pnpm monorepo: core, CLI, UI and adapter packages',
    ],
    tech: ['TypeScript', 'Node.js', 'pnpm', 'Claude Code'],
    year: '2026',
    status: 'live',
    featured: true,
    image: { width: 1440, height: 900, position: 'center 40%' },
    links: {
      npm: 'https://www.npmjs.com/package/cosmogram',
      repo: 'https://github.com/gene0524/Cosmogram',
    },
  },
  {
    slug: 'vcdf',
    title: 'VCDF',
    org: 'Imperial College London · PAKDD 2026',
    kind: ['Research', 'Publication'],
    tagline: 'A validation layer that makes time-series causal discovery trustworthy enough to act on.',
    role: 'First author · method, experiments, paper',
    facts: ['Peer-reviewed, PAKDD 2026', '+0.08 – 0.12 F1 on VAR-LiNGAM', 'fMRI and IT-monitoring benchmarks'],
    about:
      'Causal discovery algorithms give you a graph, but not a reason to believe it. VCDF (Validated Consensus-Driven Framework) sits on top of existing methods and evaluates the temporal stability of the causal structures they find, so that only edges that survive validation are kept. It started as my MSc thesis on validating agent-based models and grew into a general framework tested on synthetic, neuroscience and IT-operations data.',
    highlights: [
      'Yu, G., Guo, C., & Luk, W. — "VCDF: A Validated Consensus-Driven Framework for Time Series Causal Discovery", Proceedings of PAKDD 2026',
      'Method-agnostic: wraps VAR-LiNGAM and PCMCI without changing them',
      'Thesis: "Robust Time Series Causal Discovery for Agent-Based Model Validation", MSc Computing, Distinction',
    ],
    tech: ['Python', 'Causal discovery', 'Time series'],
    year: '2024 – 2025',
    status: 'research',
    featured: true,
    image: { width: 635, height: 380 },
    links: {
      paper: 'https://arxiv.org/abs/2410.19412',
      repo: 'https://github.com/gene0524/Robust-Consensus-Driven-Causal-Discovery',
    },
  },
  {
    slug: 'aoquant',
    title: 'AO Quant',
    org: 'Personal · trading systems',
    kind: ['Trading', 'Infrastructure', 'Quant research'],
    tagline: 'An always-on trading service where nothing trades until it survives a statistical validation gauntlet.',
    role: 'Sole author · architecture, validation gauntlet, risk cage, adapters, cockpit',
    facts: ['6 candidates tested, 0 passed (by design)', 'IG adapter live-verified on demo', 'ruff · mypy --strict · pytest'],
    about:
      'A book of strategies runs behind one Controller: stable sleeves around the clock, tactical plays that fire on a trigger signal. Every candidate must pass causality checks, in-sample and walk-forward Monte Carlo permutation tests, deflated Sharpe, PBO and FDR before it may touch an order. A deterministic risk cage guarantees survival, backtest and live share the same code path, and LLM components are kept away from the order path entirely. The public page is a static snapshot of the read-only cockpit.',
    highlights: [
      'Only the terminal execution adapter differs between backtest and live (Paper / Replay / IG / MT5)',
      'Risk cage with quadrature stress and a drawdown governor; fsync\'d audit trail; STOP / FLATTEN / PAUSE control seams',
      'Honest status on the cockpit: the gauntlet has rejected every strategy so far, so the system trades nothing',
    ],
    tech: ['Python', 'IG API', 'Docker', 'Vercel'],
    year: '2026',
    status: 'live',
    image: { width: 1440, height: 900 },
    links: {
      live: 'https://aoquant.mvpui.com',
      repo: 'https://github.com/gene0524/aoquant',
    },
  },
  {
    slug: 'agro-cert',
    title: 'Agro-Tourism Certification System',
    org: 'Client · national non-profit association, Taiwan',
    kind: ['Client work', 'Non-profit', 'Web application'],
    tagline: 'The online application and review system behind a national certification for farm-tourism sites.',
    role: 'Developer · requirements, build, hand-over, ongoing changes',
    facts: ['NT$750k commissioned build', '3 certification tracks', '4-step wizard with autosave'],
    about:
      'Commissioned by a national agricultural-tourism association to move a paper-based certification programme online. Farm and tourism operators apply through a guided four-step process: site details, self-assessment checklists for the Basic, Plus Sustainability and Plus Food & Agriculture tracks, document uploads and declarations. Drafts autosave, applicants track their status, and reviewers manage the queue, request amendments and issue decisions from an admin area with transactional email and PDF export.',
    highlights: [
      'Regional review workflow: reviewers scoped to North / Central / South regions via Postgres row-level security',
      'Report pipeline: DOCX/PDF certification reports generated server-side, cached in Postgres, downloaded via signed URLs',
      'Migrated transactional email to Resend with a subdomain-isolated DNS setup (SPF/DKIM/DMARC), so the switch never touched the client\'s existing mailbox reputation',
    ],
    tech: ['React', 'TypeScript', 'Supabase', 'Vercel Functions', 'Resend'],
    year: '2026',
    status: 'live',
    image: { width: 2880, height: 1800, position: 'top' },
    links: {},
  },
  {
    slug: 'mvpui',
    title: 'mvpui.com',
    org: 'Personal · domain and demo host',
    kind: ['Product', 'Infrastructure'],
    tagline: 'A domain I run demos from, and the landing page for how I take on fixed-scope front-end builds.',
    role: 'Owner · design, copy, build — and the DNS other projects\' public demos run on',
    facts: ['Fixed scope · fixed price · 14 days', 'Hosts subdomains for other projects (e.g. aoquant.mvpui.com)'],
    about:
      'mvpui.com doubles as a domain I control for demos — AO Quant\'s public showcase runs on a subdomain of it, and the agro-tourism certification project borrowed one for transitional transactional email — and as the landing page for the kind of fixed-scope, fixed-price front-end work behind that certification project: a founder or small team gets something real to put in front of users, on a fixed timeline, without an open-ended engagement.',
    highlights: [
      'Wrote the offer and the page from scratch, designed for one decision rather than a tour',
      'Next.js 16 App Router, static, no client JS beyond hydration',
    ],
    tech: ['Next.js 16', 'React 19', 'Tailwind 4', 'Vercel'],
    year: '2026',
    status: 'live',
    image: { width: 1440, height: 900 },
    links: {
      live: 'https://mvpui.com',
    },
  },
  {
    slug: 'motion-analysis',
    title: 'IMU football-kick analysis',
    org: 'NTHU Reliable Computing Lab · Sensors 2022',
    kind: ['Research', 'Publication', 'Hardware'],
    tagline: 'Reconstructing the trajectory of a football kick from a single 6-axis IMU on the foot.',
    role: 'Lead · sensor pipeline, reconstruction algorithm, paper',
    facts: ['Peer-reviewed, Sensors 2022', 'Low RMS error in velocity and position'],
    about:
      'Motion capture for sport is expensive and confined to a lab. This system uses one inertial measurement unit to reconstruct instep-kick trajectories with low RMS error in velocity and position, making kick analysis possible on a pitch. Published as Yu, C., Huang, T. Y., Ma, H. P., "Motion Analysis of Football Kick Based on an IMU Sensor", Sensors 2022, 22, 6244.',
    tech: ['MATLAB', 'Signal processing', 'IMU'],
    year: '2021 – 2022',
    status: 'research',
    image: { width: 890, height: 573 },
    links: {
      paper: 'https://www.mdpi.com/1424-8220/22/16/6244',
    },
  },
  {
    slug: 'signallab',
    title: 'SignalLab',
    org: 'Personal · Taiwan equities + FX/metals',
    kind: ['Trading', 'AI', 'Data pipeline'],
    tagline: 'A daily scanner that translates technical indicators into plain language, plus a strategy planner and backtester that run in the browser.',
    role: 'Sole author · full-stack architecture, strategy engine, bilingual pipeline, demo deployment',
    facts: ['4 strategies × 2 markets (TW equities + FX/metals)', 'Fully bilingual, computed once per language at scan time', '65 tests, zero-database demo'],
    about:
      'Trading tools like TradingView or a broker app are powerful but hand a beginner a wall of numbers with no explanation. SignalLab scans every Taiwan-listed stock and a set of FX/metals pairs after each close, scores four strategies (bullish MA alignment, RSI overbought/oversold, MA cross, MACD momentum), and attaches a plain-language explanation to every signal — "RSI 71.8, a bit overbought, watch for a pullback" — instead of a bare number. A strategy planner takes a sentence of intent ("gold, low risk, small swings") and turns it into a concrete, back-testable strategy.',
    highlights: [
      'One strategy interface shared across two structurally different markets: a new strategy is one file and one registry line, no per-market rewrites',
      'Bilingual end to end — explanations, AI-generated strategy rationale and backtest conclusions are computed once per language at scan time and picked by request, not recomputed live',
      'Strategy planner calls Claude to turn one sentence of intent into a strategy, with a deterministic rule-based fallback when no API key is set, so behaviour never breaks',
      'Public demo runs with no database at all: a full dataset is precomputed offline, and the planner and backtester execute the real logic in the browser rather than replaying canned screenshots — the showcase can\'t be killed by a free-tier DB going to sleep',
    ],
    tech: ['TypeScript', 'React', 'Express', 'Prisma', 'pnpm workspaces', 'Claude API'],
    year: '2026',
    status: 'live',
    image: { width: 1440, height: 900 },
    links: {
      live: 'https://signallab.mvpui.com',
    },
  },
  {
    slug: 'personal-website',
    title: 'This site',
    org: 'Personal',
    kind: ['Open source', 'Web'],
    tagline: 'Where all of the above lives, with an interactive globe of the 43 countries so far.',
    role: 'Design and build',
    facts: ['Lighthouse 100 accessibility / SEO', 'Screenshots captured by script'],
    about:
      'Built from scratch: the globe loads only when you scroll near it, images are compressed at build time, project screenshots are captured automatically with headless Chrome, and the page carries structured data for search engines.',
    tech: ['React', 'TypeScript', 'Vite', 'Three.js'],
    year: '2025 – 2026',
    status: 'live',
    image: { width: 1440, height: 900 },
    links: {
      repo: 'https://github.com/gene0524/personal-website',
    },
  },
  {
    slug: 'foodhub',
    title: 'FoodHub',
    org: 'Imperial College London · team project',
    kind: ['Coursework', 'Web application'],
    tagline: 'Recipe discovery platform built as a microservices system for the Software Systems Engineering module.',
    role: 'Team of 4 · Food Finder service, CI/CD, Azure deployment',
    facts: ['Microservices on Azure', 'Supabase database'],
    about:
      'A team project for the Imperial Software Systems Engineering module. I owned the Food Finder feature with secure user onboarding and recipe discovery APIs, and set up the CI/CD pipelines that deployed each environment to Azure.',
    tech: ['Azure', 'Supabase', 'CI/CD', 'JavaScript'],
    year: '2023',
    status: 'archived',
    image: { width: 1600, height: 860 },
    links: {
      repo: 'https://github.com/jhteh2000/sse-team-project-2',
      demo: 'https://www.youtube.com/watch?v=TE_hPw_ofTg',
    },
  },
  {
    slug: 'little-lemon',
    title: 'Little Lemon',
    org: 'Meta Front-End Developer capstone',
    kind: ['Coursework', 'Web'],
    tagline: 'Restaurant site with a table-reservation flow, built to accessibility guidelines.',
    role: 'Solo',
    facts: ['Meta Front-End Developer certificate'],
    about:
      'Capstone for the Meta Front-End Developer Specialization: menu browsing, table reservation with validation and customer information management, designed in Figma first.',
    tech: ['React', 'JavaScript', 'CSS', 'Figma'],
    year: '2023',
    status: 'archived',
    image: { width: 1428, height: 1174 },
    links: {
      repo: 'https://github.com/gene0524/little-lemon-app',
    },
  },
];

// Manual `order` first, then featured, then status, then year (newest first).
export const projects: Project[] = [...catalogue].sort((a, b) => {
  const ao = a.order ?? Infinity, bo = b.order ?? Infinity;
  if (ao !== bo) return ao - bo;
  if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
  if (STATUS_ORDER[a.status] !== STATUS_ORDER[b.status]) return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
  const yr = (y: string) => (y.match(/\d{4}/g) ?? ['0']).pop()!;
  return yr(b.year).localeCompare(yr(a.year));
});

// Primary categories for the filter row, in display order. A project's
// kind[0] must be one of these; anything else is ignored by the filter.
export const PRIMARY_KINDS = ['Community', 'Open source', 'Research', 'Trading', 'Client work', 'Product', 'Coursework'] as const;
export const projectKinds: string[] = PRIMARY_KINDS.filter(k => projects.some(p => p.kind[0] === k));
