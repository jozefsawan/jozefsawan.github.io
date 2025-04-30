console.log('Animation script starting...');

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { FontLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/geometries/TextGeometry.js';

console.log('Three.js modules imported successfully');

// Animation configuration
const config = {
  characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?",
  density: 40, // Number of characters
  fontSize: 0.8,
  fontDepth: 0.1,
  speed: 0.5,
  colorPalette: [
    new THREE.Color(0x5D3FD3), // Primary
    new THREE.Color(0x7B68EE), // Accent
    new THREE.Color(0x9370DB), // Light purple
    new THREE.Color(0x483D8B)  // Dark purple
  ]
};

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0a);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 15;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

// Character objects array
const characters = [];

// Add a simple cube to verify the scene is working
function addTestCube() {
  console.log('Adding test cube to scene');
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshNormalMaterial();
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(0, 0, 0);
  scene.add(cube);
  
  // Animate the cube
  function animateCube() {
    requestAnimationFrame(animateCube);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  
  animateCube();
}

// Font loader
console.log('Setting up font loader');
const fontLoader = new FontLoader();

// First try with a test cube to make sure rendering works
addTestCube();

console.log('Attempting to load font');
fontLoader.load(
  'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_regular.typeface.json',
  (font) => {
    console.log('✅ Font loaded successfully:', font);
    // Create characters once font is loaded
    createCharacters(font);
    // Start animation loop
    animate();
  },
  (progress) => {
    console.log('Font loading progress:', (progress.loaded / progress.total) * 100 + '%');
  },
  (error) => {
    console.error('❌ Error loading font:', error);
    // Try with local font as fallback
    console.log('Trying with local font as fallback');
    fontLoader.load(
      './fonts/helvetiker_regular.typeface.json',
      (font) => {
        console.log('✅ Local font loaded successfully');
        createCharacters(font);
        animate();
      },
      (progress) => {
        console.log('Local font loading progress:', (progress.loaded / progress.total) * 100 + '%');
      },
      (error) => {
        console.error('❌ Error loading local font:', error);
      }
    );
  }
);

function createCharacters(font) {
  // Create character meshes
  for (let i = 0; i < config.density; i++) {
    // Random character from our character set
    const charIndex = Math.floor(Math.random() * config.characters.length);
    const char = config.characters.charAt(charIndex);
    
    // Create text geometry
    const textGeometry = new TextGeometry(char, {
      font: font,
      size: config.fontSize,
      height: config.fontDepth,
      curveSegments: 4,
      bevelEnabled: false
    });
    
    // Center the geometry
    textGeometry.computeBoundingBox();
    textGeometry.center();
    
    // Random color from our palette
    const colorIndex = Math.floor(Math.random() * config.colorPalette.length);
    const material = new THREE.MeshStandardMaterial({
      color: config.colorPalette[colorIndex],
      emissive: config.colorPalette[colorIndex],
      emissiveIntensity: 0.3,
      metalness: 0.8,
      roughness: 0.2
    });
    
    // Create mesh
    const textMesh = new THREE.Mesh(textGeometry, material);
    
    // Random position
    textMesh.position.x = (Math.random() - 0.5) * 30;
    textMesh.position.y = (Math.random() - 0.5) * 30;
    textMesh.position.z = (Math.random() - 0.5) * 20;
    
    // Random rotation
    textMesh.rotation.x = Math.random() * Math.PI;
    textMesh.rotation.y = Math.random() * Math.PI;
    textMesh.rotation.z = Math.random() * Math.PI;
    
    // Add to scene and characters array
    scene.add(textMesh);
    characters.push({
      mesh: textMesh,
      initialPosition: textMesh.position.clone(),
      rotationSpeed: {
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01
      },
      movementSpeed: (Math.random() + 0.5) * config.speed * 0.01
    });
  }
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update character positions and rotations if we have characters
  if (characters.length > 0) {
    characters.forEach(char => {
      // Rotate the character
      char.mesh.rotation.x += char.rotationSpeed.x;
      char.mesh.rotation.y += char.rotationSpeed.y;
      char.mesh.rotation.z += char.rotationSpeed.z;
      
      // Move the character in a wave pattern
      const time = Date.now() * 0.001;
      char.mesh.position.x = char.initialPosition.x + Math.sin(time * char.movementSpeed) * 2;
      char.mesh.position.y = char.initialPosition.y + Math.cos(time * char.movementSpeed) * 2;
      
      // Slowly change color over time
      if (char.mesh.material) {
        const hue = (time * 0.05) % 1;
        char.mesh.material.emissiveIntensity = 0.3 + Math.sin(time) * 0.1;
      }
    });
    
    // Rotate the entire scene slightly for a more dynamic feel
    scene.rotation.y += 0.001;
  }
  
  // Always render the scene
  renderer.render(scene, camera);
  
  // Log once that animation is running
  if (!animate.hasRun) {
    console.log('Animation loop is running');
    animate.hasRun = true;
  }
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});