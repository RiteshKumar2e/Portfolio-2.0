import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial, Stars, Icosahedron, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// --- DARK THEME: COSMIC HUB (Matches Quickfix Image Perfectly) ---

function CosmicStars({ count = 12000 }) {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 350;
            p[i * 3 + 1] = (Math.random() - 0.5) * 200;
            p[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;
        }
        return p;
    }, [count]);

    const sRef = useRef();
    useFrame((state) => {
        sRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
    });

    return (
        <Points ref={sRef} positions={points}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.15}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.8}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

function NebulaVibe() {
    return (
        <group position={[0, 0, -80]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={4}>
                <Sphere args={[60, 64, 64]} position={[-30, 20, 0]}>
                    <MeshDistortMaterial
                        color="#1e1b4b"
                        speed={2}
                        distort={0.4}
                        transparent
                        opacity={0.3}
                        side={THREE.BackSide}
                    />
                </Sphere>
            </Float>
            <Float speed={3} rotationIntensity={0.5} floatIntensity={5}>
                <Sphere args={[50, 64, 64]} position={[40, -20, -10]}>
                    <MeshDistortMaterial
                        color="#312e81"
                        speed={1.5}
                        distort={0.5}
                        transparent
                        opacity={0.2}
                        side={THREE.BackSide}
                    />
                </Sphere>
            </Float>
            {/* Pink Accent Glow */}
            <mesh position={[-60, -30, 10]}>
                <sphereGeometry args={[40, 32, 32]} />
                <meshBasicMaterial color="#db2777" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
            </mesh>
        </group>
    );
}

function ImageWireframeGlobes() {
    return (
        <group opacity={0.5}>
            {[
                { pos: [-40, 25, -45], scale: 1.8, color: "#6366f1" },
                { pos: [45, -30, -50], scale: 2.2, color: "#a855f7" },
                { pos: [30, 40, -60], scale: 1.2, color: "#4f46e5" },
                { pos: [-50, -20, -55], scale: 1.5, color: "#818cf8" }
            ].map((orb, i) => (
                <Float key={i} speed={1.5} rotationIntensity={1} floatIntensity={2} position={orb.pos}>
                    <Icosahedron args={[10, 1]} scale={orb.scale}>
                        <meshBasicMaterial
                            color={orb.color}
                            wireframe
                            transparent
                            opacity={0.15}
                            blending={THREE.AdditiveBlending}
                        />
                    </Icosahedron>
                </Float>
            ))}
        </group>
    );
}

const DarkCosmosFinal = () => (
    <>
        <color attach="background" args={['#050510']} />
        <fogExp2 attach="fog" args={['#050510', 0.015]} />

        <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
        <CosmicStars count={8000} />

        <Suspense fallback={null}>
            <NebulaVibe />
            <ImageWireframeGlobes />
            <pointLight position={[50, 50, -20]} intensity={3} color="#818cf8" />
            <pointLight position={[-50, -50, -20]} intensity={2} color="#db2777" />
        </Suspense>

        <ambientLight intensity={0.5} />
    </>
);

// --- LIGHT THEME: THE ORIGINAL UNIQUE LOOK ---

function LiquidCrystal() {
    const meshRef = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.05;
        meshRef.current.rotation.y = time * 0.08;
    });

    return (
        <group position={[20, 10, -40]}>
            <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
                <mesh ref={meshRef}>
                    <torusKnotGeometry args={[10, 3, 64, 16]} />
                    <MeshDistortMaterial
                        color="#818cf8"
                        speed={2}
                        distort={0.3}
                        radius={1}
                        metalness={0.8}
                        roughness={0.2}
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            </Float>
        </group>
    );
}

function CyberHorizon() {
    const gridRef = useRef();
    useFrame((state) => {
        gridRef.current.position.z = (state.clock.getElapsedTime() * 5) % 50;
    });

    return (
        <group position={[0, -25, 0]}>
            <group ref={gridRef}>
                <gridHelper args={[200, 20, "#e2e8f0", "#cbd5e1"]} />
                <gridHelper args={[200, 20, "#e2e8f0", "#cbd5e1"]} position={[0, 0, -200]} />
            </group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -100]}>
                <planeGeometry args={[200, 100]} />
                <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </mesh>
        </group>
    );
}

const LightFuturismFinal = () => (
    <>
        <color attach="background" args={['#ffffff']} />
        <fog attach="fog" args={['#ffffff', 30, 100]} />
        <Suspense fallback={null}>
            <LiquidCrystal />
            <CyberHorizon />
            <directionalLight position={[5, 10, 5]} intensity={1.2} color="#ffffff" />
            <pointLight position={[-10, 10, -10]} intensity={0.8} color="#c7d2fe" />
        </Suspense>
        <ambientLight intensity={1} />
    </>
);

// --- CAMERA & LAYOUT ---

function Rig() {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();
    return useFrame(() => {
        // Optimized lerp for better performance
        camera.position.lerp(vec.set(mouse.x * 8, mouse.y * 8, 60), 0.05);
        camera.lookAt(0, 0, -10);
    });
}

const LayoutBackground = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`fixed inset-0 -z-30 w-screen h-screen pointer-events-none transition-all duration-1000 ${isDarkMode ? 'bg-[#050510]' : 'bg-[#ffffff]'}`}>
            <Canvas
                shadows
                camera={{ position: [0, 0, 60], fov: 60 }}
                style={{ width: '100vw', height: '100vh' }}
                gl={{
                    antialias: false, // Turn off for performance boost
                    alpha: true,
                    powerPreference: 'high-performance',
                    precision: 'lowp', // Reduced precision for background elements
                }}
                dpr={[1, 1.5]}
            >
                {isDarkMode ? <DarkCosmosFinal /> : <LightFuturismFinal />}
                <Rig />
            </Canvas>
        </div>
    );
};

export default LayoutBackground;
