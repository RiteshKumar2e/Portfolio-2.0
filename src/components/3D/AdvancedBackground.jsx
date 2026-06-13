import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

/* -------------------------------------------------------------------------- */
/*  A calm, professional ambient backdrop — soft floating forms + faint dust.  */
/*  No cosmic starfields, neon, or cyber grids: quiet depth that never         */
/*  competes with the content.                                                 */
/* -------------------------------------------------------------------------- */

function FaintDust({ count = 1400, color = '#ffffff', opacity = 0.35 }) {
    const positions = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 220;
            p[i * 3 + 1] = (Math.random() - 0.5) * 140;
            p[i * 3 + 2] = (Math.random() - 0.5) * 120 - 40;
        }
        return p;
    }, [count]);

    const ref = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.012;
        }
    });

    return (
        <Points ref={ref} positions={positions}>
            <PointMaterial
                transparent
                color={color}
                size={0.12}
                sizeAttenuation
                depthWrite={false}
                opacity={opacity}
            />
        </Points>
    );
}

function SoftOrb({ position, scale, color, speed = 1, opacity = 0.18, distort = 0.3 }) {
    return (
        <Float speed={speed} rotationIntensity={0.4} floatIntensity={1.5} position={position}>
            <Sphere args={[10, 64, 64]} scale={scale}>
                <MeshDistortMaterial
                    color={color}
                    speed={1.2}
                    distort={distort}
                    transparent
                    opacity={opacity}
                    roughness={0.6}
                    metalness={0.1}
                />
            </Sphere>
        </Float>
    );
}

/* ----------------------------------- Dark ----------------------------------- */

const DarkAmbient = () => (
    <>
        <color attach="background" args={['#0a0e1a']} />
        <fogExp2 attach="fog" args={['#0a0e1a', 0.012]} />

        <FaintDust count={1600} color="#c7d2fe" opacity={0.28} />

        <Suspense fallback={null}>
            <SoftOrb position={[-34, 16, -55]} scale={2.4} color="#4f46e5" opacity={0.16} speed={0.8} />
            <SoftOrb position={[40, -22, -65]} scale={3.0} color="#3730a3" opacity={0.12} speed={0.6} />
            <SoftOrb position={[18, 30, -75]} scale={1.6} color="#6366f1" opacity={0.14} speed={1} />
        </Suspense>

        <pointLight position={[40, 40, -20]} intensity={1.4} color="#818cf8" />
        <pointLight position={[-45, -30, -25]} intensity={0.9} color="#4f46e5" />
        <ambientLight intensity={0.45} />
    </>
);

/* ----------------------------------- Light ---------------------------------- */

const LightAmbient = () => (
    <>
        <color attach="background" args={['#fafbfc']} />
        <fog attach="fog" args={['#fafbfc', 40, 130]} />

        <Suspense fallback={null}>
            <SoftOrb position={[-32, 18, -55]} scale={2.6} color="#c7d2fe" opacity={0.5} speed={0.7} distort={0.25} />
            <SoftOrb position={[38, -20, -62]} scale={3.2} color="#dbeafe" opacity={0.45} speed={0.6} distort={0.2} />
            <SoftOrb position={[14, 28, -72]} scale={1.6} color="#e0e7ff" opacity={0.55} speed={0.9} distort={0.3} />
        </Suspense>

        <directionalLight position={[6, 12, 6]} intensity={1.1} color="#ffffff" />
        <pointLight position={[-12, 10, -10]} intensity={0.6} color="#c7d2fe" />
        <ambientLight intensity={1} />
    </>
);

/* --------------------------------- Camera ----------------------------------- */

function Rig() {
    const { camera, mouse } = useThree();
    const vec = useMemo(() => new THREE.Vector3(), []);
    return useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 5, mouse.y * 5, 60), 0.04);
        camera.lookAt(0, 0, -10);
    });
}

const LayoutBackground = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`fixed inset-0 -z-30 w-screen h-screen pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-[#0a0e1a]' : 'bg-[#fafbfc]'}`}>
            <Canvas
                camera={{ position: [0, 0, 60], fov: 60 }}
                style={{ width: '100vw', height: '100vh' }}
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                dpr={[1, 1.5]}
            >
                {isDarkMode ? <DarkAmbient /> : <LightAmbient />}
                <Rig />
            </Canvas>
        </div>
    );
};

export default LayoutBackground;
