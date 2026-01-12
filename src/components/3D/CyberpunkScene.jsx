import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function CodeRain() {
    const groupRef = useRef();
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = 30;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops.push({
            x: (i - columns / 2) * 0.5,
            y: Math.random() * 10,
            speed: 0.02 + Math.random() * 0.03,
            char: characters[Math.floor(Math.random() * characters.length)]
        });
    }

    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.001;
        }
    });

    return (
        <group ref={groupRef}>
            {drops.map((drop, i) => (
                <Float key={i} speed={drop.speed} rotationIntensity={0.1} floatIntensity={0.5}>
                    <Text
                        position={[drop.x, drop.y, -5]}
                        fontSize={0.3}
                        color="#00ff00"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {drop.char}
                    </Text>
                </Float>
            ))}
        </group>
    );
}

function HolographicSphere() {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2;
        meshRef.current.rotation.y = time * 0.3;
    });

    return (
        <mesh ref={meshRef}>
            <Sphere args={[1.5, 64, 64]}>
                <MeshDistortMaterial
                    color="#4facfe"
                    attach="material"
                    distort={0.6}
                    speed={3}
                    roughness={0}
                    metalness={1}
                    transparent
                    opacity={0.6}
                />
            </Sphere>
        </mesh>
    );
}

function CyberpunkScene() {
    return (
        <div className="fixed top-0 right-0 w-1/3 h-screen -z-10 opacity-40 hidden lg:block">
            <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
                <color attach="background" args={['#000000']} />

                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ff00" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00ff" />

                <CodeRain />
                <HolographicSphere />
            </Canvas>
        </div>
    );
}

export default CyberpunkScene;
