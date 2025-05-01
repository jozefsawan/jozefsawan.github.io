// Background effects for the main content sections
document.addEventListener('DOMContentLoaded', function() {
  console.log('Background effects initialized');
  
  // Create background canvas for main content
  const mainContent = document.querySelector('.main-content');
  const backgroundCanvas = document.createElement('canvas');
  backgroundCanvas.classList.add('background-canvas');
  backgroundCanvas.style.position = 'fixed';
  backgroundCanvas.style.top = '0';
  backgroundCanvas.style.left = '0';
  backgroundCanvas.style.width = '100%';
  backgroundCanvas.style.height = '100%';
  backgroundCanvas.style.zIndex = '-1';
  backgroundCanvas.style.opacity = '0.15'; // Start with low opacity
  backgroundCanvas.style.transition = 'opacity 0.5s ease';
  
  // Insert canvas before the first child of main content
  document.body.insertBefore(backgroundCanvas, document.body.firstChild);
  
  // Set canvas size
  backgroundCanvas.width = window.innerWidth;
  backgroundCanvas.height = window.innerHeight;
  
  // Get canvas context
  const ctx = backgroundCanvas.getContext('2d');
  
  // Configuration for particles - make it globally accessible for theme switching
  window.particlesConfig = {
    particleCount: window.innerWidth < 768 ? 40 : 80, // Reduce count on mobile
    particleColor: '#5C6BC0', // Accent blue
    lineColor: 'rgba(93, 107, 192, 0.15)', // Lighter blue with transparency
    particleRadius: 1.5,
    lineWidth: 1,
    maxDistance: window.innerWidth < 768 ? 150 : 200, // Reduce distance on mobile
    animationSpeed: 0.02,
    responsive: true
  };
  
  // Create a local reference for easier access
  const config = window.particlesConfig;
  
  // Particles array
  let particles = [];
  
  // Create particles
  function createParticles() {
    particles = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push({
        x: Math.random() * backgroundCanvas.width,
        y: Math.random() * backgroundCanvas.height,
        vx: (Math.random() - 0.5) * config.animationSpeed,
        vy: (Math.random() - 0.5) * config.animationSpeed,
        radius: Math.random() * config.particleRadius + 1
      });
    }
  }
  
  // Draw particles and connect them with lines
  function drawParticles() {
    // Clear canvas
    ctx.clearRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
    
    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      
      // Move particles
      p.x += p.vx;
      p.y += p.vy;
      
      // Bounce off edges
      if (p.x < 0 || p.x > backgroundCanvas.width) p.vx = -p.vx;
      if (p.y < 0 || p.y > backgroundCanvas.height) p.vy = -p.vy;
      
      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = config.particleColor;
      ctx.fill();
      
      // Connect particles with lines if they're close enough
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.maxDistance) {
          // Opacity based on distance
          const opacity = 1 - (distance / config.maxDistance);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = config.lineColor;
          ctx.lineWidth = config.lineWidth;
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    drawParticles();
    requestAnimationFrame(animate);
  }
  
  // Initialize particles
  createParticles();
  
  // Start animation
  animate();
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (config.responsive) {
      backgroundCanvas.width = window.innerWidth;
      backgroundCanvas.height = window.innerHeight;
      
      // Adjust particle count based on screen size
      config.particleCount = window.innerWidth < 768 ? 40 : 80;
      config.maxDistance = window.innerWidth < 768 ? 150 : 200;
      
      createParticles();
    }
  });
  
  // Control background opacity based on scroll position
  window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    const heroHeight = document.querySelector('.hero-section').offsetHeight;
    
    // When scrolling past hero section, show background effect
    if (scrollPosition > heroHeight * 0.8) {
      // Reduce opacity on mobile for better performance
      if (window.innerWidth < 768) {
        backgroundCanvas.style.opacity = '0.08';
      } else {
        backgroundCanvas.style.opacity = '0.15';
      }
    } else {
      backgroundCanvas.style.opacity = '0'; // Hide when in hero section
    }
    
    // Create a parallax effect for particles based on scroll
    // Reduce effect on mobile for better performance
    const parallaxValue = scrollPosition * (window.innerWidth < 768 ? 0.02 : 0.05);
    
    // Only apply parallax to a subset of particles on mobile for better performance
    const updateFrequency = window.innerWidth < 768 ? 3 : 1; // Update every 3rd particle on mobile
    
    particles.forEach((p, index) => {
      if (window.innerWidth >= 768 || index % updateFrequency === 0) {
        p.y += Math.sin(p.x / 100 + parallaxValue * 0.01) * 0.2;
      }
    });
  });
  
  // Add floating elements to specific sections
  const sections = document.querySelectorAll('section.section-padding');
  
  // Only add floating elements if not on a small mobile device
  if (window.innerWidth > 576) {
    sections.forEach((section, index) => {
      // Skip the first section (about) as it already has content
      if (index > 0) {
        // Create floating elements container
        const floatingElements = document.createElement('div');
        floatingElements.classList.add('floating-elements');
        
        // Add different shapes based on section
        // Reduce shape count on smaller screens
        const shapeCount = window.innerWidth < 768 ? 
          (3 + Math.floor(Math.random() * 3)) : // 3-5 shapes on tablets
          (5 + Math.floor(Math.random() * 5));  // 5-10 shapes on desktop
        
        for (let i = 0; i < shapeCount; i++) {
          const shape = document.createElement('div');
          shape.classList.add('floating-shape');
          
          // Randomize shape type
          const shapeType = Math.floor(Math.random() * 4);
          if (shapeType === 0) shape.classList.add('circle');
          else if (shapeType === 1) shape.classList.add('square');
          else if (shapeType === 2) shape.classList.add('triangle');
          else shape.classList.add('plus');
          
          // Randomize position
          shape.style.left = `${Math.random() * 100}%`;
          shape.style.top = `${Math.random() * 100}%`;
          
          // Randomize size - smaller on tablets
          const size = window.innerWidth < 768 ? 
            (8 + Math.random() * 12) : // 8-20px on tablets
            (10 + Math.random() * 20); // 10-30px on desktop
          
          shape.style.width = `${size}px`;
          shape.style.height = `${size}px`;
          
          // Randomize animation
          shape.style.animationDuration = `${15 + Math.random() * 15}s`; // 15-30s
          shape.style.animationDelay = `${Math.random() * 5}s`; // 0-5s delay
          
          floatingElements.appendChild(shape);
        }
        
        // Add to section
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        section.appendChild(floatingElements);
      }
    });
  }
  
  // Re-evaluate floating elements on resize
  window.addEventListener('resize', function() {
    // Remove all floating elements if screen becomes too small
    if (window.innerWidth <= 576) {
      document.querySelectorAll('.floating-elements').forEach(el => {
        el.style.display = 'none';
      });
    } else {
      document.querySelectorAll('.floating-elements').forEach(el => {
        el.style.display = 'block';
      });
    }
  });
});