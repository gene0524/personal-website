import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';

export const experiences = [
  {
    title: 'Software Engineer — Trading Systems',
    company: 'Syphonix · London',
    period: 'Apr. 2025 – Present',
    description:
      'Build trading-support and observability tooling for a high-volume trading platform (~$1B daily), including automated FIX log analysis for fast incident diagnosis, and contribute backend components to low-latency trading services. Own DevOps and cloud operations across CI/CD pipelines, multi-environment releases and infrastructure automation, with proactive monitoring for high availability. Design and ship AI-powered internal tools with trading operations, accelerating the move toward AI-native engineering.',
    icon: WorkIcon,
  },
  {
    title: 'MSc in Computing, with Distinction',
    company: 'Imperial College London',
    period: '2023 – 2024',
    description:
      'Coursework in Software Systems Engineering, Machine Learning, Computational Finance and Distributed Systems. Master thesis "Robust Time Series Causal Discovery for Agent-Based Model Validation", later developed into VCDF and published at PAKDD 2026.',
    icon: SchoolIcon,
  },
  {
    title: 'Summer Research Intern',
    company: 'Academia Sinica · NLP & Sentiment Analysis Lab',
    period: 'Jul. – Aug. 2022',
    description:
      'Worked with the research team on an AI-automated training system for figure skating, improving temporal video alignment by incorporating posture features.',
    icon: ScienceIcon,
  },
  {
    title: 'Exchange Student',
    company: 'Tel Aviv University',
    period: 'Feb. – Jun. 2022',
    description:
      'International exchange semester. Conceptualised a pedestrian safety route app at the 2022 Ignites International Hackathon.',
    icon: SchoolIcon,
  },
  {
    title: 'BS in Interdisciplinary Program of Engineering',
    company: 'National Tsing Hua University',
    period: '2018 – 2022',
    description:
      "Specialised in Electrical Engineering and Power Mechanical Engineering with a focus on electrical control. Top 4% of class, Dean's List twice, 2nd place in the College of EECS Project Competition.",
    icon: SchoolIcon,
  },
];
