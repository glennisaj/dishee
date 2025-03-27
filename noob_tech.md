# Technology Stack Overview

## Core Technologies

### Next.js
- A React framework for building full-stack web applications
- Key features:
  - Server-side rendering (SSR) - makes pages load faster and improves SEO
  - File-based routing - create pages by adding files to the `pages` directory
  - API routes - build API endpoints easily within your Next.js app
  - Hot reloading - see changes instantly during development

### TypeScript
- A superset of JavaScript that adds static typing
- Benefits:
  - Catches errors before runtime
  - Better code completion and IntelliSense
  - Makes code more maintainable and self-documenting
- Example:
  ```typescript
  // JavaScript
  function add(a, b) {
    return a + b;
  }

  // TypeScript
  function add(a: number, b: number): number {
    return a + b;
  }
  ```

### Tailwind CSS
- A utility-first CSS framework
- Instead of writing traditional CSS, you use predefined classes
- Examples:
  ```html
  <!-- Traditional CSS -->
  <div class="card">
    Hello
  </div>
  <style>
    .card {
      padding: 1rem;
      margin: 1rem;
      border-radius: 0.5rem;
      background-color: white;
    }
  </style>

  <!-- Tailwind CSS -->
  <div class="p-4 m-4 rounded-lg bg-white">
    Hello
  </div>
  ```

## Project Structure




## Development Tools

### Git
- Version control system
- Common commands:
  - `git add .` - Stage all changes
  - `git commit -m "message"` - Commit changes
  - `git push` - Push to remote repository
  - `git pull` - Get latest changes

### npm (Node Package Manager)
- Manages project dependencies
- Common commands:
  - `npm install` - Install dependencies
  - `npm run dev` - Start development server
  - `npm run build` - Build for productiong