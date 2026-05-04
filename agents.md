# Project: InAmigosFoundation

## Stack
- React + Vite
- Tailwind CSS
- React Router for navigation

## File structure
- src/components/ — all UI components
- src/pages/ — page-level components  
- src/styles/ — global styles
- public/ — static assets

## Agent roles
- **Planner**: reads spec.md, breaks work into tasks, writes task list to tasks.md
- **UI Agent**: builds all components in src/components/
- **Pages Agent**: builds page layouts in src/pages/ using components
- **Styles Agent**: handles Tailwind config, global styles, responsive design

## Rules
- Never modify files outside your assigned scope
- Write clean, commented code
- All components must be functional components with TypeScript