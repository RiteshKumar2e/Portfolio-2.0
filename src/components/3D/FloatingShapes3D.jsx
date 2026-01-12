import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingGeometry({ position, color, geometry = 'sphere' }) {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.3;
        meshRef.current.rotation.y = time * 0.2;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef} position={position}>
                {geometry === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
                {geometry === 'box' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
                {geometry === 'torus' && <torusGeometry args={[1, 0.4, 16, 100]} />}
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
}

function AnimatedRing() {
    const ringRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        ringRef.current.rotation.x = time * 0.5;
        ringRef.current.rotation.z = time * 0.3;
    });

    return (
        <mesh ref={ringRef}>
            <torusGeometry args={[3, 0.1, 16, 100]} />
            <meshStandardMaterial
                color="#667eea"
                emissive="#667eea"
                emissiveIntensity={0.5}
                metalness={0.8}
                roughness={0.2}
            />
        </mesh>
    );
}

function FloatingShapes3D() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-30">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#f093fb" />
                <pointLight position={[10, 10, 10]} intensity={0.5} color="#4facfe" />

                {/* Floating Geometries */}
                <FloatingGeometry position={[-4, 2, 0]} color="#667eea" geometry="sphere" />
                <FloatingGeometry position={[4, -2, 0]} color="#f093fb" geometry="box" />
                <FloatingGeometry position={[0, 3, -2]} color="#4facfe" geometry="torus" />
                <FloatingGeometry position={[-3, -3, -1]} color="#764ba2" geometry="sphere" />

                {/* Animated Ring */}
                <AnimatedRing />

                <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    enablePan={false}
                />
            </Canvas>
        </div>
    );
}

export default FloatingShapes3D;
