import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

class Portfolio {
    constructor() {
        this.canvas = document.querySelector('#webgl');
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.geometry = null;
        this.material = null;
        this.mesh = null;
        this.mouse = new THREE.Vector2();
        this.clock = new THREE.Clock();
        this.currentSection = 0;
        
        this.init();
        this.setupEventListeners();
        this.animate();
        this.setupScrollAnimation();
    }

    init() {
        // Sizes
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.sizes.width / this.sizes.height,
            0.1,
            1000
        );
        this.camera.position.z = 3;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create particles
        this.createParticles();
        
        // Create floating geometries
        this.createFloatingGeometries();

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x64ffda, 1, 100);
        pointLight.position.set(10, 10, 10);
        this.scene.add(pointLight);
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 800;
        
        const positions = new Float32Array(particlesCount * 3);
        const colors = new Float32Array(particlesCount * 3);
        
        const colorPalette = [
            new THREE.Color(0x64ffda), // Cyan
            new THREE.Color(0xf57c00), // Orange
            new THREE.Color(0xffffff)  // White
        ];
        
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            
            // Positions
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 10;
            
            // Colors
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }

    createFloatingGeometries() {
        this.geometries = [];
        
        // Create different geometric shapes
        const shapes = [
            new THREE.IcosahedronGeometry(0.3, 0),
            new THREE.OctahedronGeometry(0.3, 0),
            new THREE.TetrahedronGeometry(0.3, 0),
            new THREE.BoxGeometry(0.5, 0.5, 0.5),
        ];
        
        const materials = [
            new THREE.MeshPhongMaterial({ 
                color: 0x64ffda, 
                transparent: true, 
                opacity: 0.7,
                wireframe: true 
            }),
            new THREE.MeshPhongMaterial({ 
                color: 0xf57c00, 
                transparent: true, 
                opacity: 0.7,
                wireframe: true 
            }),
        ];
        
        for (let i = 0; i < 8; i++) {
            const geometry = shapes[Math.floor(Math.random() * shapes.length)];
            const material = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geometry, material);
            
            mesh.position.x = (Math.random() - 0.5) * 15;
            mesh.position.y = (Math.random() - 0.5) * 15;
            mesh.position.z = (Math.random() - 0.5) * 8;
            
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            
            // Store initial position for animation
            mesh.userData = {
                initialPosition: mesh.position.clone(),
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                }
            };
            
            this.geometries.push(mesh);
            this.scene.add(mesh);
        }
    }

    setupEventListeners() {
        // Resize
        window.addEventListener('resize', () => {
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;
            
            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();
            
            this.renderer.setSize(this.sizes.width, this.sizes.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
            this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
        });

        // Navigation
        const navLinks = document.querySelectorAll('[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.navigateToSection(section);
            });
        });

        // Project cards interaction
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.animateGeometryFocus(index);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetGeometryFocus();
            });
        });
    }

    navigateToSection(sectionName) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => section.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    animateGeometryFocus(index) {
        if (this.geometries[index]) {
            gsap.to(this.geometries[index].scale, {
                x: 1.5,
                y: 1.5,
                z: 1.5,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }

    resetGeometryFocus() {
        this.geometries.forEach(geometry => {
            gsap.to(geometry.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    setupScrollAnimation() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach((section, index) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    this.currentSection = index;
                    section.classList.add('active');
                    this.animateSection(index);
                },
                onLeave: () => {
                    section.classList.remove('active');
                },
                onEnterBack: () => {
                    this.currentSection = index;
                    section.classList.add('active');
                },
                onLeaveBack: () => {
                    section.classList.remove('active');
                }
            });
        });
    }

    animateSection(index) {
        // Camera animation based on section
        const targetPosition = {
            x: 0,
            y: index * 2,
            z: 3 - index * 0.5
        };
        
        gsap.to(this.camera.position, {
            ...targetPosition,
            duration: 1.5,
            ease: "power2.inOut"
        });

        // Animate geometries based on section
        this.geometries.forEach((geometry, i) => {
            const delay = i * 0.1;
            const offset = index * 5;
            
            gsap.to(geometry.position, {
                y: geometry.userData.initialPosition.y + offset,
                duration: 1.5,
                delay: delay,
                ease: "power2.inOut"
            });
        });
    }

    animate() {
        const elapsedTime = this.clock.getElapsedTime();
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y = elapsedTime * 0.1;
            this.particles.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
        }
        
        // Animate floating geometries
        this.geometries.forEach((geometry) => {
            // Continuous rotation
            geometry.rotation.x += geometry.userData.rotationSpeed.x;
            geometry.rotation.y += geometry.userData.rotationSpeed.y;
            geometry.rotation.z += geometry.userData.rotationSpeed.z;
            
            // Floating motion
            geometry.position.y += Math.sin(elapsedTime + geometry.position.x) * 0.002;
        });
        
        // Camera mouse interaction
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        // Render
        this.renderer.render(this.scene, this.camera);
        
        // Call animate again on the next frame
        window.requestAnimationFrame(() => this.animate());
    }
}

// Loading manager
const loadingManager = new THREE.LoadingManager();
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.querySelector('.loader-progress');

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    progressBar.style.width = `${progress}%`;
};

loadingManager.onLoad = () => {
    setTimeout(() => {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
                // Start the portfolio
                new Portfolio();
            }
        });
    }, 500);
};

// Initialize loading
setTimeout(() => {
    loadingManager.onLoad();
}, 1000);
