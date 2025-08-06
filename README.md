# Three.js Portfolio Template

A modern, interactive portfolio website built with Three.js, featuring 3D graphics, smooth animations, and responsive design.

## Features

- 🎯 Interactive 3D background with floating geometries
- ✨ Particle system animation
- 📱 Fully responsive design
- 🎨 Smooth GSAP animations
- 🚀 Fast loading with Vite
- 📧 Contact section
- 💼 Project showcase
- 🎭 Modern UI/UX design

## Technologies Used

- **Three.js** - 3D graphics and WebGL
- **GSAP** - Animation library
- **Vite** - Fast build tool
- **Vanilla JavaScript** - Core functionality
- **CSS3** - Modern styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The portfolio will be available at `http://localhost:3000`

### Build for Production

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Customization

### Personal Information

1. **Update HTML content** in `index.html`:
   - Change "Your Name" to your actual name
   - Update the hero description
   - Modify the about section
   - Add your actual projects
   - Update contact information

2. **Update CSS variables** in `src/styles/style.css`:
   - Modify color scheme in `:root` section
   - Adjust spacing and typography

3. **Customize 3D elements** in `src/main.js`:
   - Change particle colors and count
   - Modify floating geometry shapes
   - Adjust animation speeds and effects

### Adding Projects

Replace the placeholder projects in the projects section:

```html
<div class="project-card" data-project="0">
    <div class="project-image">
        <div class="project-overlay">
            <h3>Your Project Name</h3>
            <p>Project description</p>
            <div class="project-links">
                <a href="your-live-url" class="project-link">View Live</a>
                <a href="your-github-url" class="project-link">GitHub</a>
            </div>
        </div>
    </div>
</div>
```

### Color Scheme

The portfolio uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #64ffda;    /* Cyan accent */
    --secondary-color: #f57c00;  /* Orange accent */
    --bg-color: #0a0a0a;         /* Dark background */
    --text-color: #ffffff;       /* White text */
    --text-secondary: #8892b0;   /* Gray text */
}
```

### Performance Optimization

- The particle count can be reduced in `createParticles()` for better performance on mobile devices
- WebGL context is optimized with `antialias` and `alpha` settings
- Assets are optimized for fast loading

## Browser Support

- Chrome 51+
- Firefox 53+
- Safari 10+
- Edge 79+

WebGL support is required for 3D features.

## License

This project is open source and available under the [MIT License](LICENSE).

## Credits

- Three.js community for excellent documentation
- GSAP for smooth animations
- Inspiration from various creative developer portfolios

---

Feel free to customize this template to match your personal brand and showcase your work!
