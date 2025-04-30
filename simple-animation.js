console.log('Simple animation script starting...');

// Create a simple Three.js scene with colored cubes
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

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

// Create cubes with different colors
const cubes = [];
const colors = [
  0x5D3FD3, // Primary purple
  0x7B68EE, // Accent purple
  0x9370DB, // Light purple
  0x483D8B  // Dark purple
];

// Create 40 cubes
for (let i = 0; i < 40; i++) {
  const size = Math.random() * 0.5 + 0.5;
  const geometry = new THREE.BoxGeometry(size, size, size);
  
  // Random color from our palette
  const colorIndex = Math.floor(Math.random() * colors.length);
  const material = new THREE.MeshStandardMaterial({
    color: colors[colorIndex],
    emissive: colors[colorIndex],
    emissiveIntensity: 0.3,
    metalness: 0.8,
    roughness: 0.2
  });
  
  // Create mesh
  const cube = new THREE.Mesh(geometry, material);
  
  // Random position
  cube.position.x = (Math.random() - 0.5) * 30;
  cube.position.y = (Math.random() - 0.5) * 30;
  cube.position.z = (Math.random() - 0.5) * 20;
  
  // Random rotation
  cube.rotation.x = Math.random() * Math.PI;
  cube.rotation.y = Math.random() * Math.PI;
  cube.rotation.z = Math.random() * Math.PI;
  
  // Add to scene and cubes array
  scene.add(cube);
  cubes.push({
    mesh: cube,
    initialPosition: cube.position.clone(),
    rotationSpeed: {
      x: (Math.random() - 0.5) * 0.01,
      y: (Math.random() - 0.5) * 0.01,
      z: (Math.random() - 0.5) * 0.01
    },
    movementSpeed: (Math.random() + 0.5) * 0.01
  });
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update cube positions and rotations
  cubes.forEach(cube => {
    // Rotate the cube
    cube.mesh.rotation.x += cube.rotationSpeed.x;
    cube.mesh.rotation.y += cube.rotationSpeed.y;
    cube.mesh.rotation.z += cube.rotationSpeed.z;
    
    // Move the cube in a wave pattern
    const time = Date.now() * 0.001;
    cube.mesh.position.x = cube.initialPosition.x + Math.sin(time * cube.movementSpeed) * 2;
    cube.mesh.position.y = cube.initialPosition.y + Math.cos(time * cube.movementSpeed) * 2;
    
    // Slowly change emissive intensity over time
    cube.mesh.material.emissiveIntensity = 0.3 + Math.sin(time) * 0.1;
  });
  
  // Rotate the entire scene slightly for a more dynamic feel
  scene.rotation.y += 0.001;
  
  renderer.render(scene, camera);
}

// Start animation
console.log('Starting animation loop');
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});