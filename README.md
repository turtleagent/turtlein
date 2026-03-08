# TurtleIn

TurtleIn is a professional networking web app built with React and Convex.

## Overview
- Feed with posts, reactions, comments, reposts, hashtags, polls, and bookmarks
- Profiles with onboarding, experience, education, and skills
- Connections/follows and notifications
- Messaging and company pages

## Tech Stack
- Frontend: React 18, Material-UI v4, react-router-dom
- Backend: Convex + Convex Auth
- Testing: Playwright + React Testing Library
- Deployment: Vercel (frontend) + Convex Cloud (backend)

## Getting Started
1. Install dependencies:
```bash
npm install
```
2. Configure environment in `.env.local`:
```bash
REACT_APP_CONVEX_URL=...
REACT_APP_CONVEX_SITE_URL=...
```
3. Start dev server:
```bash
npm start
```

## Build and Test
- Production build:
```bash
npm run build
```
- Unit tests:
```bash
npm test -- --watch=false
```
- E2E tests:
```bash
npm run test:e2e
```

## Deployment
- Deploy Convex backend:
```bash
npx convex deploy
```
- Deploy frontend to Vercel:
```bash
npx vercel --prod
```

## Screenshots
Screenshots will be added here.

## Notes
- This repository no longer tracks legacy clone metadata or upstream personal links.
- Keep secrets in local environment files (`.env.local`) and never commit them.
