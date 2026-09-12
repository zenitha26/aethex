"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

export default function ShoeModel() {
  const meshRef = useRef<THREE.Group>(null);
  
  // To use a real model, uncomment the following line and import useGLTF from '@react-three/drei'
  // const { scene } = useGLTF('/models/shoe.glb');
  // useEffect(() => {
  //   if (scene) {
  //     scene.traverse((node) => {
  //       if ((node as THREE.Mesh).isMesh) {
  //         node.castShadow = true;
  //         node.receiveShadow = true;
  //       }
  //     });
  //   }
  // }, [scene]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Smooth, heavy inertia for rotation
    const targetX = (state.pointer.x * Math.PI) / 6;
    const targetY = (state.pointer.y * Math.PI) / 8;

    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetX, 0.03);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -targetY, 0.03);
  });

  return (
    <>
      <group ref={meshRef} position={[0, 0, 0]}>
        {/* Uncomment to use actual model: */}
        {/* <primitive object={scene} scale={2} /> */}
        
        {/* Cinematic Wireframe Mesh Placeholder */}
        <mesh castShadow receiveShadow scale={1.5} rotation={[0.2, -0.4, 0]}>
          <boxGeometry args={[1, 0.5, 2]} />
          <meshStandardMaterial 
            color="#050505" 
            wireframe={false} 
            roughness={0.2}
            metalness={0.8}
            envMapIntensity={1}
          />
        </mesh>
        
        {/* Wireframe overlay to keep the tech/editorial feel while demonstrating PBR */}
        <mesh scale={1.501} rotation={[0.2, -0.4, 0]}>
          <boxGeometry args={[1, 0.5, 2]} />
          <meshBasicMaterial 
            color="#ffffff" 
            wireframe={true} 
            transparent
            opacity={0.05}
          />
        </mesh>
      </group>

      {/* Volumetric Spotlight from Top-Right */}
      <SpotLight
        position={[4, 6, 4]}
        angle={0.3}
        penumbra={1}
        intensity={8}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Delicate Ambient Rim Light from Bottom-Left-Back */}
      <pointLight 
        position={[-4, -2, -4]} 
        intensity={6} 
        color="#ffffff" 
        distance={10} 
      />

      {/* Very subtle fill light */}
      <ambientLight intensity={0.2} />

      {/* Realistic Soft Contact Shadows */}
      <ContactShadows 
        position={[0, -1.5, 0]} 
        opacity={0.8} 
        scale={10} 
        blur={2.5} 
        far={4} 
        resolution={1024}
        color="#000000" 
      />
    </>
  );
}
