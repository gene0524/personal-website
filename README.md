# Gene Yu's Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Vite. Showcases my professional experience, projects, and skills with a custom-designed dark UI and interactive animations.

Live: [geneyu.me](https://geneyu.me)

## Features

- Animated hero with typewriter effect (respects prefers-reduced-motion)
- Particle network background
- Scroll progress indicator with keyboard-accessible section navigation
- Flip cards for experience and projects
- Section-based scroll snapping
- Fully responsive (mobile / tablet / desktop)
- Dark-mode optimized colour palette
- Open Graph + Twitter Card metadata, JSON-LD Person schema, sitemap
- Self-hosted fonts (Inter, Poppins, Space Mono) via @fontsource
- Contact form posts to `VITE_CONTACT_ENDPOINT` if set, otherwise falls back to a pre-filled mailto

## Tech Stack

- **Build**: Vite + TypeScript
- **UI**: React, Material-UI, Emotion
- **Animation**: Framer Motion
- **Deployment**: Vercel

## Project Structure

```
src/
├── components/
│   ├── Layout.tsx
│   ├── ParticleNetwork.tsx
│   ├── ScrollIndicator.tsx
│   ├── SectionHeading.tsx
│   ├── SocialLinks.tsx
│   └── sections/
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── ExperienceSection.tsx
│       ├── ProjectsSection.tsx
│       ├── TravelSection.tsx
│       └── ContactSection.tsx
├── data/                   # Content data files
│   ├── personalInfo.ts
│   ├── experience.ts
│   ├── projects.ts
│   ├── skills.ts
│   ├── contactInfo.ts    # derived from personalInfo
│   └── travel.ts
├── hooks/                  # Custom React hooks
└── themes/                 # Theme configuration

public/
├── og-image.png            # Open Graph preview image
├── og-image.svg            # OG image source (regenerate via rsvg-convert)
├── favicon.svg / apple-touch-icon.png / icon-*.png
├── manifest.json / sitemap.xml / robots.txt
├── globe/                  # world atlas + earth texture (WebP)
└── assets/
    └── images/
        ├── profile/        # Profile photos
        └── projects/       # Project screenshots
```

## Content Update Guide

| What to change          | File                                |
| ----------------------- | ----------------------------------- |
| Name / title / about / email / socials | `src/data/personalInfo.ts` |
| Work + education        | `src/data/experience.ts`            |
| Project showcase        | `src/data/projects.ts`              |
| Skills                  | `src/data/skills.ts`                |
| Travel map data         | `src/data/travel.ts`                |
| Profile photo           | `assets-src/profile/myPhoto.jpg` (WebP generated) |
| Resume PDF              | `assets-src/resume/CV_ChunYu.pdf` → copy to `public/assets/files/resume.pdf` |
| Project screenshots     | `public/assets/images/projects/`    |

## Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Type-check + production build (output: dist/)
npm run build

# Preview production build locally
npm run preview
```

## Deployment

Deployed to Vercel. The repo includes a `vercel.json` that sets the output directory to `dist/`. Pushing to `main` triggers a production build.

## License

All Rights Reserved © Gene Yu.

The source code in this repository is published for portfolio and reference purposes only. You may not copy, redistribute, or reuse this code or its design without prior written permission.

## Contact

Gene Yu — gene.yu.tw@gmail.com
