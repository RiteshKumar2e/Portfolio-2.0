import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial, Stars, Icosahedron, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// --- DARK MODE COMPONENTS (Advanced & Futuristic) ---

function DarkProceduralNebula() {
    const points = useRef();
    const count = 3500;

    const [positions, scales, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const sc = new Float32Array(count);
        const col = new Float32Array(count * 3);
        const color1 = new THREE.Color('#4f46e5');
        const color2 = new THREE.Color('#9333ea');

        for (let i = 0; i < count; i++) {
            const r = 25 + Math.random() * 45;
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            sc[i] = Math.random();

            const mixed = color1.clone().lerp(color2, Math.random());
            col[i * 3] = mixed.r; col[i * 3 + 1] = mixed.g; col[i * 3 + 2] = mixed.b;
        }
        return [pos, sc, col];
    }, []);

    useFrame((state) => {
        points.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        points.current.rotation.z = state.clock.getElapsedTime() * 0.03;
    });

    return (
        <Points ref={points} positions={positions} colors={colors}>
            <PointMaterial transparent vertexColors size={0.3} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.4} />
        </Points>
    );
}

function FloatingGeometry() {
    return (
        <group>
            {[...Array(8)].map((_, i) => (
                <Float key={i} speed={2 + i * 0.5} rotationIntensity={2} floatIntensity={2} position={[(Math.random() - 0.5) * 60, (Math.random() - 0.5) * 30, -30]}>
                    <Icosahedron args={[1, 0]}>
                        <MeshTransmissionMaterial
                            backside thickness={0.5} roughness={0} transmission={1}
                            ior={1.2} chromaticAberration={0.02} anisotropy={0.1}
                            distortion={0.1} distortionScale={0.3} temporalDistortion={0.5}
                            color="#818cf8"
                        />
                    </Icosahedron>
                </Float>
            ))}
        </group>
    );
}

function DarkParticleWave() {
    const points = useRef();
    const count = 8000;
    const accentColor = '#6366f1';
    const secondaryColor = '#8b5cf6';

    const [positions, step] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const step = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            step[i] = Math.random() * Math.PI * 2;
        }
        return [positions, step];
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const { pointer } = state;
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            const x = positions[i3];
            const z = positions[i3 + 2];
            let targetY = Math.sin(x * 0.08 + time + step[i]) * 4 + Math.cos(z * 0.1 + time * 0.5) * 3;

            const dx = x - (pointer.x * 50);
            const dz = z - (pointer.y * 25);
            const dist = Math.sqrt(dx * dx + dz * dz);
            if (dist < 12) targetY += (12 - dist) * 1.5;

            positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], targetY, 0.05);
        }
        points.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <Points ref={points} positions={positions}>
            <PointMaterial transparent color={accentColor} size={0.15} sizeAttenuation={true} depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.6} />
        </Points>
    );
}

function DarkCyberGrid() {
    return (
        <group position={[0, -20, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <gridHelper args={[150, 60, '#4f46e5', '#1e1b4b']} />
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.2]}>
                <planeGeometry args={[150, 150]} />
                <meshStandardMaterial color="#000000" transparent opacity={0.95} />
            </mesh>
        </group>
    );
}

function CinematicLight() {
    const lightRef = useRef();
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        lightRef.current.position.set(Math.cos(t * 0.5) * 30, 20, Math.sin(t * 0.5) * 30);
    });
    return <pointLight ref={lightRef} intensity={15} color="#818cf8" distance={100} />;
}

const DarkEnvironment = () => (
    <>
        <color attach="background" args={['#000000']} />
        <fogExp2 attach="fog" args={['#000000', 0.022]} />
        <Stars radius={120} depth={60} count={9000} factor={7} fade speed={2} />
        <ambientLight intensity={0.2} />
        <spotLight position={[0, 40, 0]} angle={0.5} penumbra={1} intensity={10} color="#6366f1" castShadow />
        <CinematicLight />
        <Suspense fallback={null}>
            <DarkProceduralNebula />
            <DarkParticleWave />
            <DarkCyberGrid />
            <FloatingGeometry />
            <Float speed={4} rotationIntensity={1} floatIntensity={2}>
                <Sphere position={[-28, 15, -25]} args={[8, 64, 64]}>
                    <MeshDistortMaterial color="#4f46e5" speed={3} distort={0.45} radius={1} transparent opacity={0.4} emissive="#4f46e5" emissiveIntensity={0.8} />
                </Sphere>
            </Float>
        </Suspense>
    </>
);

// --- LIGHT MODE (Snappy & Clean) ---

function LightEnvironment() {
    return (
        <>
            <color attach="background" args={['#f8fafc']} />
            <fog attach="fog" args={['#f8fafc', 40, 100]} />
            <ambientLight intensity={1.8} />
            <pointLight position={[30, 30, 30]} intensity={1.5} color="#6366f1" />
            <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
            <Float speed={5} floatIntensity={0.5}>
                <Sphere position={[25, -12, -20]} args={[12, 32, 32]}>
                    <MeshDistortMaterial color="#e0e7ff" speed={2} distort={0.25} transparent opacity={0.4} />
                </Sphere>
            </Float>
        </>
    );
}

function Rig() {
    const { camera, pointer } = useThree();
    useFrame(() => {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 15, 0.035);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.y * 12 + 5, 0.035);
        camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, pointer.x * 0.05, 0.035);
        camera.lookAt(0, 0, 0);
    });
    return null;
}

const LayoutBackground = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`fixed inset-0 -z-50 w-full h-full pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-black' : 'bg-[#f8fafc]'}`}>
            <Canvas
                shadows
                camera={{ position: [0, 5, 60], fov: 50 }}
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
