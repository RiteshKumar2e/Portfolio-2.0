import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// --- DARK MODE COMPONENTS (Advanced & Cinematic) ---

function DarkParticleWave() {
    const points = useRef();
    const count = 7000;
    const accentColor = '#818cf8';
    const secondaryColor = '#c084fc';

    const [positions, step, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const step = new Float32Array(count);
        const colors = new Float32Array(count * 3);
        const c1 = new THREE.Color(accentColor);
        const c2 = new THREE.Color(secondaryColor);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 85;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
            step[i] = Math.random() * Math.PI * 2;
            const mixed = c1.clone().lerp(c2, Math.random());
            colors[i * 3] = mixed.r; colors[i * 3 + 1] = mixed.g; colors[i * 3 + 2] = mixed.b;
        }
        return [positions, step, colors];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const { pointer } = state;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = positions[i3];
            const z = positions[i3 + 2];
            let targetY = Math.sin(x * 0.1 + time + step[i]) * 3 + Math.cos(z * 0.12 + time * 0.6) * 2;

            // Mouse Disturbance
            const dx = x - (pointer.x * 40);
            const dz = z - (pointer.y * 20);
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 10) targetY += (10 - dist) * 0.6;

            positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY, 0.1);
        }
        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <Points ref={points} positions={positions} colors={colors}>
            <PointMaterial transparent vertexColors size={0.18} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
        </Points>
    );
}

function DarkKineticCubes() {
    const meshRef = useRef();
    const count = 40;
    const particles = useMemo(() => Array.from({ length: count }, () => ({
        t: Math.random() * 100,
        speed: 0.004 + Math.random() / 250,
        radius: 12 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2
    })), []);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        particles.forEach((p, i) => {
            const t = (p.t += p.speed);
            dummy.position.set(Math.cos(t + p.phase) * p.radius, Math.sin(t * 0.4) * 8, Math.sin(t + p.phase) * p.radius);
            dummy.scale.setScalar((Math.sin(t * 1.5) + 1.6) * 0.45);
            dummy.rotation.set(t, t * 0.4, t);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <boxGeometry args={[0.6, 0.6, 0.6]} />
            <meshStandardMaterial color="#c084fc" transparent opacity={0.5} emissive="#c084fc" emissiveIntensity={1.2} />
        </instancedMesh>
    );
}

function DarkCyberGrid() {
    return (
        <group position={[0, -18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <gridHelper args={[120, 50, '#4f46e5', '#1e1b4b']} position={[0, 0, 0]} />
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.1]}>
                <planeGeometry args={[120, 120]} />
                <meshStandardMaterial color="#000000" transparent opacity={0.9} />
            </mesh>
        </group>
    );
}

const DarkEnvironment = () => (
    <>
        <color attach="background" args={['#000000']} />
        <fogExp2 attach="fog" args={['#000000', 0.025]} />
        <Stars radius={100} depth={50} count={7000} factor={6} fade speed={1.8} />
        <ambientLight intensity={0.1} />
        <pointLight position={[40, 40, 40]} intensity={8} color="#4f46e5" />
        <pointLight position={[-40, -40, -40]} intensity={6} color="#7c3aed" />
        <Suspense fallback={null}>
            <DarkParticleWave />
            <DarkKineticCubes />
            <DarkCyberGrid />
            <Float speed={3} rotationIntensity={2} floatIntensity={4}>
                <Sphere position={[-25, 12, -20]} args={[7, 64, 64]}>
                    <MeshDistortMaterial color="#4f46e5" speed={4} distort={0.5} radius={1} transparent opacity={0.3} emissive="#4f46e5" emissiveIntensity={0.6} />
                </Sphere>
            </Float>
            <Float speed={4} rotationIntensity={2.5} floatIntensity={3}>
                <Sphere position={[25, -12, -15]} args={[5, 64, 64]}>
                    <MeshDistortMaterial color="#7c3aed" speed={5} distort={0.6} radius={1} transparent opacity={0.3} emissive="#7c3aed" emissiveIntensity={0.6} />
                </Sphere>
            </Float>
        </Suspense>
    </>
);

// --- LIGHT MODE COMPONENTS (Minimalist & SNAPPY) ---

function LightParticleGrid() {
    const points = useRef();
    const count = 1200;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 90;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 45;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 45;
        }
        return pos;
    }, []);

    useFrame((state) => {
        points.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    });

    return (
        <Points ref={points} positions={positions}>
            <PointMaterial transparent color="#6366f1" size={0.12} sizeAttenuation={true} depthWrite={false} opacity={0.25} />
        </Points>
    );
}

const LightEnvironment = () => (
    <>
        <color attach="background" args={['#f8fafc']} />
        <fog attach="fog" args={['#f8fafc', 30, 95]} />
        <ambientLight intensity={1.5} />
        <pointLight position={[25, 25, 25]} intensity={1.2} color="#6366f1" />
        <Suspense fallback={null}>
            <LightParticleGrid />
            <Float speed={4} floatIntensity={0.6}>
                <Sphere position={[20, -10, -15]} args={[10, 32, 32]}>
                    <MeshDistortMaterial color="#e0e7ff" speed={2.5} distort={0.2} transparent opacity={0.35} />
                </Sphere>
            </Float>
        </Suspense>
    </>
);

// --- PERFORMANCE RIG ---

function Rig() {
    const { camera, pointer } = useThree();
    useFrame(() => {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 12, 0.04);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.y * 10, 0.04);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

// --- MAIN EXPORT ---

const LayoutBackground = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`fixed inset-0 -z-50 w-full h-full pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-black' : 'bg-[#f8fafc]'}`}>
            <Canvas
                camera={{ position: [0, 5, 55], fov: 55 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
            >
                {isDarkMode ? <DarkEnvironment /> : <LightEnvironment />}
                <Rig />
            </Canvas>
        </div>
    );
};

export default LayoutBackground;
