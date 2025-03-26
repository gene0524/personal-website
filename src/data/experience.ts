import { ReactNode } from 'react';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';

export const experiences = [
    {
      title: 'MSc in Computing, with Distinction',
      company: 'Imperial College London',
      period: '2023 - 2024',
      description: 'Specialized in Software Systems Engineering, Machine Learning, Computational Finance, and Distributed Systems. Completed master thesis on "Robust Time Series Causal Discovery for Agent-Based Model Validation".',
      icon: SchoolIcon,
    },
    {
      title: 'Summer Research Intern',
      company: 'Academia Sinica - Natural Language Processing Lab',
      period: 'Jul. - Aug. 2022',
      description: 'Served as a research assistant in the Natural Language Processing and Sentiment Analysis Lab, supporting the development of an AI-Automated Training System for Figure Skating. Assisted in improving temporal video alignment through posture feature integration.',
      icon: ScienceIcon,
    },
    {
      title: 'Exchange Student',
      company: 'Tel Aviv University',
      period: 'Feb. - Jun. 2022',
      description: 'Participated in international academic exchange. Conceptualized a pedestrian safety route app at 2022 Ignites International Hackathon.',
      icon: SchoolIcon,
    },
    {
      title: 'BSc in Interdisciplinary Program of Engineering',
      company: 'National Tsing Hua University',
      period: '2018 - 2022',
      description: 'Specialized in Electrical Engineering and Power Mechanical Engineering with a focus on Electrical Control. Achieved top 4% of class and Dean\'s List 2x. Won 2nd Place in College of EECS Project Competition.',
      icon: SchoolIcon,
    },
  ];