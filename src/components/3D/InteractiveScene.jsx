import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function DNA() {
    const groupRef = useRef();
    const helixCount = 50;
    const radius = 2;

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        groupRef.current.rotation.y = time * 0.3;
    });

    const spheres = [];
    for (let i = 0; i < helixCount; i++) {
        const angle = (i / helixCount) * Math.PI * 4;
        const y = (i / helixCount) * 10 - 5;

        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;

        spheres.push(
            <mesh key={`sphere1-${i}`} position={[x1, y, z1]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#667eea" emissive="#667eea" emissiveIntensity={0.5} />
            </mesh>
        );

        spheres.push(
            <mesh key={`sphere2-${i}`} position={[x2, y, z2]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial color="#f093fb" emissive="#f093fb" emissiveIntensity={0.5} />
            </mesh>
        );

        // Connecting lines
        if (i % 3 === 0) {
            const points = [
                new THREE.Vector3(x1, y, z1),
                new THREE.Vector3(x2, y, z2)
            ];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);

            spheres.push(
                <line key={`line-${i}`} geometry={geometry}>
                    <lineBasicMaterial color="#4facfe" opacity={0.3} transparent />
                </line>
            );
        }
    }

    return <group ref={groupRef}>{spheres}</group>;
}

function RotatingCube() {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.5;
        meshRef.current.rotation.y = time * 0.3;
    });

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <boxGeometry args={[3, 3, 3]} />
            <meshStandardMaterial
                color="#667eea"
                wireframe
                transparent
                opacity={0.3}
            />
        </mesh>
    );
}

function InteractiveScene() {
    return (
        <div className="w-full h-[500px] rounded-2xl overflow-hidden">
            <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
                <color attach="background" args={['#0a0a1a']} />

                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#667eea" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#f093fb" />

                <DNA />
                <RotatingCube />

                <OrbitControls
                    enableZoom={true}
                    autoRotate
                    autoRotateSpeed={0.5}
                    minDistance={10}
                    maxDistance={30}
                />
            </Canvas>
        </div>
    );
}

export default InteractiveScene;
