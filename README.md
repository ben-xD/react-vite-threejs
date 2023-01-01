# React + Vite + Three.js

- **Example:** https://react-vite-threejs.pages.dev/
- **Usage:** run `npx degit https://github.com/ben-xD/react-vite-threejs#main project-name` to create a folder with this template.
  - Pre-requisites: [install pnpm](https://pnpm.io/installation)
  - Install dependencies: run `pnpm install`
  - Start application: run `pnpm run dev`
  - Build for production: run `pnpm run build`
  - Deploy to Cloudflare Pages: run `wrangler pages publish dist --project-name=react-vite-threejs` (You need a Cloudflare Account, and that project name is taken by me!)
- Created by:
  - running `npm create vite@latest 10-debug-ui -- --template react-ts` 
  - installing useful dependencies (three.js, dat.gui, types for typescript, stats.js),
  - writing code to use those dependencies in a class, `World` in `world.ts`