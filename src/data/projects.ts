export const projects = [
  {
    title: 'Robust Time Series Causal Discovery',
    description: 'Master Thesis: A novel framework for improving causal discovery accuracy in Agent-Based Model validation',
    longDescription: 'Developed a Robust Cross-Validation (RCV) framework to enhance causal structure learning in complex systems. The framework introduces RCV-VarLiNGAM and RCV-PCMCI extensions that achieve more reliable results with high-dimensional, time-dependent data. Successfully validated the approach using both synthetic datasets and real-world fMRI data.',
    image: '/assets/images/projects/causal-discovery.png',
    technologies: ['Python', 'Machine Learning', 'Statistical Analysis', 'Data Visualization'],
    githubUrl: 'https://github.com/gene0524/Robust-Consensus-Driven-Causal-Discovery',
    paperUrl: 'https://arxiv.org/abs/2410.19412',
  },
  {
    title: 'FoodHub Web Application',
    description: 'Microservices-based recipe discovery platform with secure user management',
    longDescription: 'Architected a scalable web application using microservices on Azure and Supabase for database solutions. Implemented CI/CD pipelines to automate deployment processes across environments. Developed the core Food Finder feature with secure user onboarding and recipe discovery APIs, resulting in an intuitive and responsive user experience.',
    image: '/assets/images/projects/foodHub.png',
    technologies: ['Azure', 'Supabase', 'CI/CD', 'API Development', 'React', 'JavaScript'],
    githubUrl: 'https://github.com/jhteh2000/sse-team-project-2',
    demoUrl: 'https://www.youtube.com/watch?v=TE_hPw_ofTg'
  },
  {
    title: 'Little Lemon Restaurant',
    description: 'Responsive web application for restaurant information and table reservations',
    longDescription: 'Designed and developed a complete restaurant website with integrated reservation system as the capstone project for Meta Front-End Developer Specialization. Implemented user-friendly interfaces following accessibility best practices and responsive design principles. Features include menu browsing, table reservation with validation, and customer information management.',
    image: '/assets/images/projects/little-lemon.png',
    technologies: ['React', 'JavaScript', 'CSS', 'HTML', 'UI/UX Design', 'Figma'],
    githubUrl: 'https://github.com/gene0524/little-lemon-app',
    // demoUrl: 'https://little-lemon-app-gene0524.vercel.app/'
  },
  {
    title: 'Motion Analysis System',
    description: 'IMU-based trajectory reconstruction for sports movement analysis',
    longDescription: 'Led the design and implementation of a comprehensive motion analysis system utilizing Inertial Measurement Units (IMUs) for instep kicking motions. Developed algorithms to reconstruct the trajectory of football kicks with high accuracy, achieving low RMS errors in velocity and position analysis. Research published in the peer-reviewed journal Sensors.',
    image: '/assets/images/projects/motion-analysis.png',
    technologies: ['MATLAB', 'Signal Processing', 'IMU Sensors', 'Algorithm Design', 'Data Analysis'],
    paperUrl: 'https://www.mdpi.com/1424-8220/22/16/6244',
  },
  // {
  //   title: 'Personal Portfolio Website',
  //   description: 'A responsive developer portfolio showcasing my projects and experience',
  //   longDescription: 'Designed and developed a modern, responsive portfolio website to showcase my projects, skills, and experience. Implemented smooth animations, dark/light mode toggle, and interactive elements to create an engaging user experience. Built with performance and accessibility in mind using modern web technologies.',
  //   image: '/assets/images/projects/portfolio-website.jpg',
  //   technologies: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'Responsive Design'],
  //   githubUrl: 'https://github.com/yourusername/portfolio-website',
  //   liveUrl: 'https://yourdomainname.com',
  // },
];
