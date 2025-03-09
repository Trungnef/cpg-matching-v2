
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
  type?: 'network' | 'particles' | 'waves';
}

const ThreeScene = ({ className = "", type = 'network' }: ThreeSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectsRef = useRef<(THREE.Mesh | THREE.Line | THREE.Points)[]>([]);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 15;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Create visualization based on type
    if (type === 'network') {
      createNetworkVisualization(scene, objectsRef);
    } else if (type === 'particles') {
      createParticleVisualization(scene, objectsRef);
    } else if (type === 'waves') {
      createWaveVisualization(scene, objectsRef);
    }

    // Animation function
    const animate = () => {
      const time = Date.now() * 0.001; // Convert to seconds

      // Slowly rotate the entire scene
      scene.rotation.y = time * 0.05;
      
      // Custom animations based on visualization type
      if (type === 'network') {
        animateNetwork(time, objectsRef);
      } else if (type === 'particles') {
        animateParticles(time, objectsRef);
      } else if (type === 'waves') {
        animateWaves(time, objectsRef);
      }

      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Clean up resources
      objectsRef.current.forEach(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        } else if (object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
    };
  }, [type]);

  return <div ref={mountRef} className={`h-full w-full ${className}`} />;
};

// Network visualization
const createNetworkVisualization = (
  scene: THREE.Scene, 
  objectsRef: React.MutableRefObject<(THREE.Mesh | THREE.Line | THREE.Points)[]>
) => {
  // Create nodes
  const nodeCount = 40; // Increased node count
  const nodeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  
  // Different materials for different types of nodes with glowing effect
  const materialA = new THREE.MeshPhongMaterial({ 
    color: 0x4c66ef,
    emissive: 0x1a2dbb,
    emissiveIntensity: 0.5,
    shininess: 90
  });
  const materialB = new THREE.MeshPhongMaterial({ 
    color: 0x8b5cf6, 
    emissive: 0x5927f0,
    emissiveIntensity: 0.5,
    shininess: 90
  });
  const materialC = new THREE.MeshPhongMaterial({ 
    color: 0xd946ef, 
    emissive: 0xb40ed2,
    emissiveIntensity: 0.5,
    shininess: 90
  });

  // Create nodes in a spherical pattern
  const nodes: THREE.Mesh[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const radius = 10 + Math.random() * 2; // Slightly randomize radius
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    // Choose material based on position (just for visual variety)
    const nodeMaterial = i % 3 === 0 ? materialA : i % 3 === 1 ? materialB : materialC;
    
    const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
    nodeMesh.position.set(x, y, z);
    nodeMesh.userData = { 
      type: i % 3 === 0 ? 'manufacturer' : i % 3 === 1 ? 'brand' : 'retailer',
      connections: [],
      originalPosition: new THREE.Vector3(x, y, z),
      pulseFactor: Math.random() * 0.5 + 0.5, // Random pulse factor
      size: Math.random() * 0.5 + 0.8 // Random size factor
    };
    
    // Randomize size for visual interest
    const scale = 0.7 + Math.random() * 1.3;
    nodeMesh.scale.set(scale, scale, scale);
    
    scene.add(nodeMesh);
    nodes.push(nodeMesh);
    objectsRef.current.push(nodeMesh);
  }

  // Create connections between nodes
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: 0xffffff,
    transparent: true,
    opacity: 0.2
  });

  // Connect some nodes (not all, to avoid too many lines)
  for (let i = 0; i < nodeCount; i++) {
    const sourceNode = nodes[i];
    
    // Connect to 2-5 random nodes
    const connectionCount = Math.floor(Math.random() * 4) + 2;
    
    for (let j = 0; j < connectionCount; j++) {
      const targetIndex = Math.floor(Math.random() * nodeCount);
      if (targetIndex !== i && !sourceNode.userData.connections.includes(targetIndex)) {
        const targetNode = nodes[targetIndex];
        
        const points = [
          sourceNode.position.clone(),
          targetNode.position.clone()
        ];
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        line.userData = {
          sourceIndex: i,
          targetIndex: targetIndex,
          originalOpacity: Math.random() * 0.2 + 0.1 // Randomize opacity
        };
        scene.add(line);
        objectsRef.current.push(line);
        
        // Store connection information
        sourceNode.userData.connections.push(targetIndex);
        targetNode.userData.connections.push(i);
      }
    }
  }
};

// Particle visualization for alternative 3D effect
const createParticleVisualization = (
  scene: THREE.Scene, 
  objectsRef: React.MutableRefObject<(THREE.Mesh | THREE.Line | THREE.Points)[]>
) => {
  // Create particle system
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const colorOptions = [
    new THREE.Color(0x4c66ef), // Blue
    new THREE.Color(0x8b5cf6), // Purple
    new THREE.Color(0xd946ef)  // Pink
  ];

  for (let i = 0; i < particleCount; i++) {
    // Position in sphere
    const radius = 15 * Math.pow(Math.random(), 0.5); // Distribute more towards center
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);     // x
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
    positions[i * 3 + 2] = radius * Math.cos(phi);                   // z
    
    // Random color from our palette
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
    
    // Random size
    sizes[i] = Math.random() * 0.5 + 0.1;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
  objectsRef.current.push(particleSystem);
};

// Wave visualization for fluid 3D effect
const createWaveVisualization = (
  scene: THREE.Scene, 
  objectsRef: React.MutableRefObject<(THREE.Mesh | THREE.Line | THREE.Points)[]>
) => {
  // Create wave plane
  const planeGeometry = new THREE.PlaneGeometry(30, 30, 100, 100);
  const material = new THREE.MeshPhongMaterial({
    color: 0x4c66ef,
    emissive: 0x1a2dbb,
    emissiveIntensity: 0.2,
    shininess: 90,
    wireframe: true
  });
  
  const plane = new THREE.Mesh(planeGeometry, material);
  plane.rotation.x = -Math.PI / 2; // Rotate to horizontal
  scene.add(plane);
  objectsRef.current.push(plane);
  
  // Store original vertex positions
  const positions = planeGeometry.attributes.position;
  const originalPositions = new Float32Array(positions.count * 3);
  for (let i = 0; i < positions.count; i++) {
    originalPositions[i * 3] = positions.getX(i);
    originalPositions[i * 3 + 1] = positions.getY(i);
    originalPositions[i * 3 + 2] = positions.getZ(i);
  }
  plane.userData.originalPositions = originalPositions;
};

// Animation functions
const animateNetwork = (
  time: number, 
  objectsRef: React.MutableRefObject<(THREE.Mesh | THREE.Line | THREE.Points)[]>
) => {
  // Find all nodes and lines
  const nodes = objectsRef.current.filter(obj => 
    obj instanceof THREE.Mesh && obj.userData.type
  ) as THREE.Mesh[];
  
  const lines = objectsRef.current.filter(obj => 
    obj instanceof THREE.Line && obj.userData.sourceIndex !== undefined
  ) as THREE.Line[];

  // Animate nodes
  nodes.forEach((node, index) => {
    // Gentle floating movement
    const originalPos = node.userData.originalPosition as THREE.Vector3;
    const pulseFactor = node.userData.pulseFactor || 1;
    
    node.position.x = originalPos.x + Math.sin(time * 0.5 + index * 0.2) * 0.1;
    node.position.y = originalPos.y + Math.sin(time * 0.3 + index * 0.2) * 0.1;
    node.position.z = originalPos.z + Math.cos(time * 0.4 + index * 0.2) * 0.1;
    
    // Pulsing scale
    const size = node.userData.size || 1;
    const scale = size + Math.sin(time * pulseFactor) * 0.05;
    node.scale.set(scale, scale, scale);
  });
  
  // Update line positions to match connected nodes
  lines.forEach(line => {
    const sourceNode = nodes[line.userData.sourceIndex];
    const targetNode = nodes[line.userData.targetIndex];
    
    if (sourceNode && targetNode) {
      const positions = line.geometry.attributes.position as THREE.BufferAttribute;
      positions.setXYZ(0, sourceNode.position.x, sourceNode.position.y, sourceNode.position.z);
      positions.setXYZ(1, targetNode.position.x, targetNode.position.y, targetNode.position.z);
      positions.needsUpdate = true;
      
      // Pulsing opacity
      const originalOpacity = line.userData.originalOpacity || 0.2;
      (line.material as THREE.LineBasicMaterial).opacity = 
        originalOpacity + Math.sin(time * 2) * 0.05;
    }
  });
};

const animateParticles = (
  time: number, 
  objectsRef: React.MutableRefObject<(THREE.Mesh | THREE.Line | THREE.Points)[]>
) => {
  const particles = objectsRef.current.find(obj => 
    obj instanceof THREE.Points
  ) as THREE.Points | undefined;
  
  if (particles) {
    const positions = particles.geometry.attributes.position as THREE.BufferAttribute;
    const sizes = particles.geometry.attributes.size as THREE.BufferAttribute;
    
    for (let i = 0; i < positions.count; i++) {
      // Gentle swirl movement
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      const distance = Math.sqrt(x * x + y * y + z * z);
      const angle = Math.atan2(y, x) + (0.05 / distance) * Math.sin(time * 0.2);
      
      const newX = distance * Math.cos(angle);
      const newY = distance * Math.sin(angle);
      
      positions.setXYZ(i, newX, newY, z + Math.sin(time * 0.2 + distance) * 0.05);
      
      // Pulsing size
      const size = Math.max(0.1, Math.sin(time * 0.5 + i * 0.01) * 0.2 + 0.3);
      sizes.setX(i, size);
    }
    
    positions.needsUpdate = true;
    sizes.needsUpdate = true;
  }
};

const animateWaves = (
  time: number, 
  objectsRef: React.MutableRefObject<(THREE.Mesh | THREE.Line | THREE.Points)[]>
) => {
  const wavePlane = objectsRef.current.find(obj => 
    obj instanceof THREE.Mesh && obj.userData.originalPositions
  ) as THREE.Mesh | undefined;
  
  if (wavePlane) {
    const positions = wavePlane.geometry.attributes.position as THREE.BufferAttribute;
    const originalPositions = wavePlane.userData.originalPositions as Float32Array;
    
    for (let i = 0; i < positions.count; i++) {
      const originalX = originalPositions[i * 3];
      const originalY = originalPositions[i * 3 + 1];
      const originalZ = originalPositions[i * 3 + 2];
      
      // Create wave effect
      const waveX = Math.sin(time * 0.5 + originalX * 0.5) * 0.5;
      const waveY = Math.cos(time * 0.5 + originalY * 0.5) * 0.5;
      
      positions.setZ(i, originalZ + waveX + waveY);
    }
    
    positions.needsUpdate = true;
    
    // Slowly change color
    if (wavePlane.material instanceof THREE.MeshPhongMaterial) {
      const hue = (time * 0.05) % 1;
      const color = new THREE.Color().setHSL(hue, 0.7, 0.5);
      wavePlane.material.color = color;
      wavePlane.material.emissive = color.clone().multiplyScalar(0.3);
    }
  }
};

export default ThreeScene;
