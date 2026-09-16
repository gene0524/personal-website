// Mirrors the "Technical Skills" block of the CV (assets-src/resume/CV_ChunYu.pdf).
export const skills = [
  {
    category: 'Languages',
    // Trimmed from 7 to match the other three cards (4 items) - Java, Verilog
    // and MATLAB dropped as the least central to current work; still on the CV.
    items: ['Python', 'TypeScript', 'C++', 'SQL'],
    icon: 'CodeIcon',
  },
  {
    category: 'Cloud & DevOps',
    // Trimmed from 5 to 4; "AWS (EC2, S3, Lambda)" shortened to "AWS" - the
    // parenthetical was the main source of visual crowding in the small card.
    items: ['AWS', 'Azure', 'Docker', 'CI/CD'],
    icon: 'CloudIcon',
  },
  {
    category: 'Backend & Data',
    items: ['Node.js', 'REST APIs', 'FIX protocol', 'Time-series analysis'],
    icon: 'StorageIcon',
  },
  {
    category: 'AI-Assisted Dev',
    items: ['Claude & agents', 'MCP / tool use', 'Prompt design', 'React front-ends'],
    icon: 'SmartToyIcon',
  },
];

export const certificates = [
  'AWS DevOps Specialization',
  'Meta Front-End Developer (Coursera)',
];
