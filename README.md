# Gene Yu's Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Material-UI. This website showcases my professional experience, projects, and skills in an elegant and interactive way.

## Features

- 🎨 Modern UI with smooth animations
- 📱 Fully responsive design
- 🌙 Dark mode optimized
- ⚡ Fast performance
- 🔍 SEO optimized

## Tech Stack

- React
- TypeScript
- Material-UI
- Framer Motion
- Emotion

## Project Structure

```
src/
├── components/         # React components
├── data/              # Content data files
│   ├── personalInfo.ts    # Personal information
│   ├── experience.ts      # Work experience
│   ├── projects.ts        # Project showcase
│   └── skills.ts          # Skills and technologies
├── themes/            # Theme configuration
└── assets/           # Static assets
    └── images/
        ├── profile/      # Profile photos
        └── projects/     # Project screenshots
```

## Content Update Guide

### Personal Information
- Edit `src/data/personalInfo.ts` to update:
  - Name
  - Title
  - Description
  - About section content
  - Contact information

### Experience
- Edit `src/data/experience.ts` to update your work and education history

### Projects
- Edit `src/data/projects.ts` to update your project showcase
- Add project images to `public/assets/images/projects/`

### Profile Photo
- Replace your profile photo in `public/assets/images/profile/myPhoto.jpg`
- Make sure to keep the same file name or update the reference in the code

### Skills
- Edit `src/data/skills.ts` to update your technical skills and tools

## Development

1. Clone the repository
```bash
git clone https://github.com/yourusername/portfolio.git
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm start
```

4. Build for production
```bash
npm run build
```

## Deployment

The site is built to be deployed on any static hosting service. The production build will be in the `build` folder.

## License

MIT License - feel free to use this template for your own portfolio!

## Contact

Gene Yu - gene.yu.tw@gmail.com
