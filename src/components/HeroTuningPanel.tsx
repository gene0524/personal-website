import { useState } from 'react';
import { Box, Typography, Slider, Button, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TuneIcon from '@mui/icons-material/Tune';
import { FONT_MONO } from '../themes';
import type { OrbitalSystemTuning } from './orbitalSystemTuning';

const COLLAPSED_KEY = 'heroTuningPanelCollapsed';
const readCollapsed = () => {
  try { return localStorage.getItem(COLLAPSED_KEY) === '1'; } catch { return false; }
};

// Dev-only. Every number here used to be a module-level constant that only I
// could change, requiring a round trip of "edit -> screenshot -> describe" to
// tune by feel. This drives the same values live so Gene can just drag a
// slider and watch the hero scene react in real time.
interface KnobDef {
  key: keyof OrbitalSystemTuning;
  label: string;
  min: number;
  max: number;
  step: number;
}

const KNOBS: KnobDef[] = [
  { key: 'elevationDeg', label: 'Elevation (deg)', min: 2, max: 45, step: 1 },
  { key: 'rollDeg', label: 'Roll (deg)', min: -90, max: 90, step: 1 },
  { key: 'focusDistance', label: 'Zoom (focus distance)', min: 3, max: 14, step: 0.1 },
  { key: 'fov', label: 'FOV', min: 25, max: 75, step: 1 },
  { key: 'offsetXRatio', label: 'Disc offset X', min: -0.5, max: 0.5, step: 0.01 },
  { key: 'offsetYRatio', label: 'Disc offset Y', min: -0.5, max: 0.5, step: 0.01 },
  { key: 'speedCoeff', label: 'Speed', min: 0.1, max: 4, step: 0.1 },
  { key: 'speedExp', label: 'Speed spread (inner vs outer)', min: 1, max: 3.5, step: 0.1 },
  { key: 'orbitScale', label: 'Orbit / planet size', min: 0.4, max: 2.5, step: 0.05 },
];

interface HeroTuningPanelProps {
  value: OrbitalSystemTuning;
  onChange: (next: OrbitalSystemTuning) => void;
  // The saved baseline for whichever profile is currently active - Reset goes
  // here, not to a hardcoded desktop default, so it does the right thing on
  // both profiles once mobile has its own saved overrides.
  resetValue: OrbitalSystemTuning;
  profile: 'desktop' | 'mobile';
}

const HeroTuningPanel: React.FC<HeroTuningPanelProps> = ({ value, onChange, resetValue, profile }) => {
  const [copied, setCopied] = useState(false);
  // Remembered across reloads (sessionStorage would also reset on tab close;
  // localStorage so it stays out of the way once you've tucked it away) -
  // wrapped in try/catch since private-mode/blocked storage should never
  // break the panel, just fall back to "expanded".
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const toggleCollapsed = () => {
    setCollapsed(prev => {
      const next = !prev;
      try { localStorage.setItem(COLLAPSED_KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  };

  const set = (key: keyof OrbitalSystemTuning) => (_: Event, raw: number | number[]) => {
    const v = Array.isArray(raw) ? raw[0] : raw;
    onChange({ ...value, [key]: v });
  };

  if (collapsed) {
    return (
      <IconButton
        onClick={toggleCollapsed}
        aria-label="Show hero scene tuning panel"
        title="Hero scene tuning"
        sx={{
          position: 'fixed',
          top: 88,
          right: 16,
          zIndex: 2000,
          width: 40,
          height: 40,
          color: 'primary.main',
          backgroundColor: 'rgba(7,9,15,0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.45)',
          '&:hover': { backgroundColor: 'rgba(7,9,15,0.98)' },
        }}
      >
        <TuneIcon fontSize="small" />
      </IconButton>
    );
  }

  const copyDefaults = async () => {
    const body = KNOBS.map(k => `  ${k.key}: ${value[k.key]},`).join('\n');
    const snippet = profile === 'mobile'
      ? `export const ORBITAL_SYSTEM_MOBILE_OVERRIDES: Partial<OrbitalSystemTuning> = {\n${body}\n};`
      : `export const ORBITAL_SYSTEM_DEFAULTS: OrbitalSystemTuning = {\n${body}\n};`;
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked (rare, e.g. insecure context) — value is still on screen to copy by hand
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 88,
        right: 16,
        zIndex: 2000,
        width: 280,
        maxHeight: 'calc(100vh - 104px)',
        overflowY: 'auto',
        p: 2,
        borderRadius: 2,
        backgroundColor: 'rgba(7,9,15,0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        fontFamily: FONT_MONO,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Box>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.75rem', letterSpacing: '0.06em', color: 'primary.main' }}>
            HERO SCENE (dev only)
          </Typography>
          <Typography sx={{ fontFamily: FONT_MONO, fontSize: '0.62rem', letterSpacing: '0.04em', color: 'text.secondary', mt: 0.25 }}>
            Editing: {profile === 'mobile' ? 'Mobile (<900px)' : 'Desktop (>=900px)'}
          </Typography>
        </Box>
        <IconButton
          size="small"
          onClick={toggleCollapsed}
          aria-label="Collapse hero scene tuning panel"
          title="Collapse"
          sx={{ color: 'text.secondary', p: 0.5 }}
        >
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>
      {KNOBS.map(k => (
        <Box key={k.key} sx={{ mb: 1.25 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'text.secondary', mb: 0.25 }}>
            <span>{k.label}</span>
            <span>{value[k.key]}</span>
          </Box>
          <Slider
            size="small"
            value={value[k.key]}
            min={k.min}
            max={k.max}
            step={k.step}
            onChange={set(k.key)}
            sx={{ color: 'primary.main', py: 0.5 }}
          />
        </Box>
      ))}
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onChange(resetValue)}
          sx={{ flex: 1, fontSize: '0.68rem', textTransform: 'none', borderColor: 'rgba(255,255,255,0.2)', color: 'text.secondary' }}
        >
          Reset
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={copyDefaults}
          sx={{ flex: 1, fontSize: '0.68rem', textTransform: 'none', backgroundColor: 'primary.main', color: 'background.default' }}
        >
          {copied ? 'Copied!' : 'Copy values'}
        </Button>
      </Box>
    </Box>
  );
};

export default HeroTuningPanel;
