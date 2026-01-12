import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial, Stars, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// --- DARK MODE COMPONENTS (Performance Optimized) ---

function DarkProceduralNebula() {
    const points = useRef();
    const count = 1500; // Optimized count

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const color1 = new THREE.Color('#4f46e5');
        const color2 = new THREE.Color('#9333ea');

        for (let i = 0; i < count; i++) {
            const r = 25 + Math.random() * 40;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            const mixed = color1.clone().lerp(color2, Math.random());
            col[i * 3] = mixed.r; col[i * 3 + 1] = mixed.g; col[i * 3 + 2] = mixed.b;
        }
        return [pos, col];
    }, []);

    useFrame((state) => {
        points.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    });

    return (
        <Points ref={points} positions={positions} colors={colors}>
            <PointMaterial transparent vertexColors size={0.35} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.3} />
        </Points>
    );
}

function FloatingGeometry() {
    return (
        <group>
            {[...Array(5)].map((_, i) => (
                <Float key={i} speed={1.5} rotationIntensity={1} floatIntensity={1} position={[(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 20, -25]}>
                    <Icosahedron args={[1.2, 0]}>
                        <meshPhysicalMaterial
                            color="#818cf8"
                            roughness={0.1}
                            metalness={0.8}
                            transparent
                            opacity={0.4}
                            transmission={0.5}
                            thickness={1}
                        />
                    </Icosahedron>
                </Float>
            ))}
        </group>
    );
}

function DarkParticleWave() {
    const points = useRef();
    const count = 3500; // Optimized
    const accentColor = '#6366f1';

    const [positions, step] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const stp = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
            stp[i] = Math.random() * Math.PI * 2;
        }
        return [pos, stp];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const posAttr = points.current.geometry.attributes.position;
        const { pointer } = state;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = positions[i3];
            const z = positions[i3 + 2];

            let targetY = Math.sin(x * 0.1 + time + step[i]) * 2.5 + Math.cos(z * 0.15 + time * 0.5) * 1.5;

            const dx = x - (pointer.x * 50);
            const dz = z - (pointer.y * 25);
            const distSq = dx * dx + dz * dz;
            if (distSq < 144) {
                targetY += (12 - Math.sqrt(distSq)) * 1.2;
            }

            posAttr.array[i3 + 1] = THREE.MathUtils.lerp(posAttr.array[i3 + 1], targetY, 0.1);
        }
        posAttr.needsUpdate = true;
    });

    return (
        <Points ref={points} positions={positions}>
            <PointMaterial transparent color={accentColor} size={0.15} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.5} />
        </Points>
    );
}

function DarkCyberGrid() {
    return (
        <group position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <gridHelper args={[150, 40, '#4f46e5', '#1e1b4b']} />
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.2]}>
                <planeGeometry args={[150, 150]} />
                <meshStandardMaterial color="#000000" transparent opacity={0.9} />
            </mesh>
        </group>
    );
}

const DarkEnvironment = () => (
    <>
        <color attach="background" args={['#000000']} />
        <fogExp2 attach="fog" args={['#000000', 0.02]} />
        <Stars radius={120} depth={60} count={4000} factor={6} fade speed={1.5} />
        <ambientLight intensity={0.4} />
        <pointLight position={[0, 40, 0]} intensity={5} color="#6366f1" />
        <Suspense fallback={null}>
            <DarkProceduralNebula />
            <DarkParticleWave />
            <DarkCyberGrid />
            <FloatingGeometry />
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <Sphere position={[-28, 15, -25]} args={[8, 32, 32]}>
                    <MeshDistortMaterial color="#4f46e5" speed={2} distort={0.25} radius={1} transparent opacity={0.4} emissive="#4f46e5" emissiveIntensity={0.4} />
                </Sphere>
            </Float>
        </Suspense>
    </>
);

const LightEnvironment = () => (
    <>
        <color attach="background" args={['#f8fafc']} />
        <fog attach="fog" args={['#f8fafc', 40, 100]} />
        <ambientLight intensity={1.5} />
        <pointLight position={[30, 30, 30]} intensity={1} color="#6366f1" />
        <Stars radius={100} depth={50} count={800} factor={3} saturation={0} fade speed={1} />
        <Float speed={3} floatIntensity={0.4}>
            <Sphere position={[25, -12, -20]} args={[12, 24, 24]}>
                <MeshDistortMaterial color="#e0e7ff" speed={1.5} distort={0.2} transparent opacity={0.3} />
            </Sphere>
        </Float>
    </>
);

function Rig() {
    const { camera, pointer } = useThree();
    useFrame(() => {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 12, 0.03);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.y * 10 + 5, 0.03);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

const LayoutBackground = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`fixed inset-0 -z-50 w-full h-full pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-black' : 'bg-[#f8fafc]'}`}>
            <Canvas
                camera={{ position: [0, 5, 60], fov: 50 }}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 1.5]} // Performance optimized DPR
            >
                {isDarkMode ? <DarkEnvironment /> : <LightEnvironment />}
                <Rig />
            </Canvas>
        </div>
    );
};

export default LayoutBackground;
