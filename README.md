
# 🚀 3D Interactive Portfolio - Ritesh Kumar

A modern, cutting-edge portfolio website built with React, Three.js, and advanced animation libraries. Features stunning 3D graphics, smooth animations, and an immersive user experience.

## ✨ Features

- **3D Particle Background**: Interactive particle system using React Three Fiber
- **Animated 3D Sphere**: Distorted sphere with metallic material in hero section
- **Smooth Animations**: Powered by Framer Motion with spring physics
- **Glassmorphism UI**: Modern glass-effect design throughout
- **Responsive Design**: Fully responsive across all devices
- **Scroll Progress Indicator**: Visual feedback for page scroll
- **Interactive Navigation**: Smooth scrolling with active section highlighting
- **Contact Form**: Animated form with validation
- **Loading Screen**: Beautiful loading animation

## 🛠️ Technologies Used

### Core
- **React 18.3** - UI library
- **Vite 5.4** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first CSS framework

### 3D & Animation
- **React Three Fiber 8.15** - React renderer for Three.js
- **@react-three/drei 9.92** - Useful helpers for R3F
- **Three.js 0.160** - 3D graphics library
- **Framer Motion 10.18** - Production-ready animation library
- **GSAP 3.12** - Professional-grade animation
- **React Spring 9.7** - Physics-based animations

### UI & Icons
- **React Icons 5.0** - Icon library
- **React Intersection Observer 9.5** - Viewport detection

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "Portfolio 2.0"
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

## 🏗️ Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 📁 Project Structure

```
Portfolio 2.0/
├── src/
│   ├── components/
│   │   ├── 3D/
│   │   │   └── ParticleBackground.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── Navbar.jsx
│   │   ├── Projects.jsx
│   │   ├── ScrollProgress.jsx
│   │   └── Skills.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   └── Profile Pic.jpg
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: { DEFAULT: '#667eea', dark: '#5a67d8' },
  secondary: { DEFAULT: '#f093fb', dark: '#f5576c' },
  accent: { DEFAULT: '#4facfe', light: '#00f2fe' },
}
```

### Content
- Update personal information in `src/components/Hero.jsx`
- Modify projects in `src/components/Projects.jsx`
- Change skills in `src/components/Skills.jsx`
- Update contact info in `src/components/Contact.jsx`

### 3D Elements
- Particle count and colors: `src/components/3D/ParticleBackground.jsx`
- Sphere properties: `src/components/Hero.jsx`

## 🌟 Key Features Explained

### 3D Particle System
- 2000 animated particles
- Color gradient from purple to blue
- Continuous rotation animation
- Additive blending for glow effect

### Animated Sphere
- Mesh distortion material
- Metallic and rough surface properties
- Auto-rotating orbit controls
- Interactive camera movement

### Framer Motion Animations
- Stagger children animations
- Spring physics for natural movement
- Scroll-triggered animations
- Hover and tap interactions

### Glassmorphism Design
- Backdrop blur effects
- Semi-transparent backgrounds
- Border highlights
- Layered depth

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Performance Optimizations

- Lazy loading for 3D components
- Intersection Observer for scroll animations
- Optimized particle count
- Efficient re-renders with React.memo
- Code splitting with Vite

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

**Ritesh Kumar**
- Portfolio: [Your Portfolio URL]
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourusername)

## 🙏 Acknowledgments

- Three.js community
- React Three Fiber team
- Framer Motion team
- Tailwind CSS team

---

Made with ❤️ and lots of ☕