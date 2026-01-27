import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial, Stars, Icosahedron, TorusKnot, useTexture, MeshWobbleMaterial, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// --- DEEP SPACE NEBULA ---
function DeepSpaceNebula() {
    const groupRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        groupRef.current.rotation.y = time * 0.05;
        groupRef.current.rotation.z = time * 0.02;
    });

    return (
        <group ref={groupRef}>
            {[...Array(5)].map((_, i) => (
                <Float key={i} speed={1 + i} rotationIntensity={2} floatIntensity={2}>
                    <Sphere args={[15 + i * 5, 32, 32]} position={[0, 0, -20]}>
                        <MeshDistortMaterial
                            color={i % 2 === 0 ? "#1e1b4b" : "#312e81"}
                            transparent
                            opacity={0.1}
                            distort={0.4 + i * 0.1}
                            speed={2}
                            side={THREE.BackSide}
                        />
                    </Sphere>
                </Float>
            ))}
        </group>
    );
}

// --- QUANTUM DATA STREAMS ---
function QuantumDataStreams() {
    const count = 40;
    const streams = useMemo(() => {
        return [...Array(count)].map(() => ({
            x: (Math.random() - 0.5) * 100,
            z: (Math.random() - 0.5) * 50 - 20,
            y: Math.random() * 100 - 50,
            speed: 0.2 + Math.random() * 0.5,
            length: 5 + Math.random() * 15,
            opacity: 0.1 + Math.random() * 0.3
        }));
    }, []);

    const streamRefs = useRef([]);

    useFrame(() => {
        streams.forEach((s, i) => {
            s.y -= s.speed;
            if (s.y < -50) s.y = 50;
        });
    });

    return (
        <group>
            {streams.map((s, i) => (
                <mesh key={i} position={[s.x, s.y, s.z]}>
                    <capsuleGeometry args={[0.05, s.length, 4, 8]} />
                    <meshBasicMaterial
                        color="#6366f1"
                        transparent
                        opacity={s.opacity}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}

// --- ADVANCED TECH PLEXUS 2.0 ---
function AdvancedTechPlexus() {
    const pointsRef = useRef();
    const count = 60;

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 80,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 40 - 20
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05,
                    (Math.random() - 0.5) * 0.05
                )
            });
        }
        return temp;
    }, []);

    const lineRef = useRef();

    useFrame((state) => {
        const positions = new Float32Array(count * 3);
        const linePositions = [];
        const lineColors = [];

        particles.forEach((p, i) => {
            p.position.add(p.velocity);

            if (Math.abs(p.position.x) > 40) p.velocity.x *= -1;
            if (Math.abs(p.position.y) > 30) p.velocity.y *= -1;
            if (Math.abs(p.position.z + 20) > 20) p.velocity.z *= -1;

            positions[i * 3] = p.position.x;
            positions[i * 3 + 1] = p.position.y;
            positions[i * 3 + 2] = p.position.z;
        });

        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dist = particles[i].position.distanceTo(particles[j].position);
                if (dist < 18) {
                    linePositions.push(
                        particles[i].position.x, particles[i].position.y, particles[i].position.z,
                        particles[j].position.x, particles[j].position.y, particles[j].position.z
                    );
                    const opacity = 1 - (dist / 18);
                    const color = new THREE.Color(0.4, 0.4, 1);
                    lineColors.push(color.r * opacity, color.g * opacity, color.b * opacity);
                    lineColors.push(color.r * opacity, color.g * opacity, color.b * opacity);
                }
            }
        }

        if (pointsRef.current) {
            pointsRef.current.geometry.attributes.position.array.set(positions);
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }

        if (lineRef.current) {
            lineRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            lineRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));
        }
    });

    return (
        <group>
            <Points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={new Float32Array(count * 3)}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.8}
                    color="#818cf8"
                    transparent
                    opacity={0.8}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                />
            </Points>
            <lineSegments ref={lineRef}>
                <bufferGeometry />
                <lineBasicMaterial vertexColors transparent blending={THREE.AdditiveBlending} opacity={0.3} />
            </lineSegments>
        </group>
    );
}

// --- CRYSTALLINE ARTIFACTS ---
function CrystallineArtifacts() {
    return (
        <group>
            {[...Array(4)].map((_, i) => (
                <Float key={i} speed={2} rotationIntensity={1.5} floatIntensity={2} position={[(i - 1.5) * 25, 10, -30]}>
                    <Icosahedron args={[3, 0]}>
                        <meshPhysicalMaterial
                            color="#818cf8"
                            metalness={1}
                            roughness={0}
                            transparent
                            opacity={0.3}
                            transmission={0.5}
                            thickness={2}
                            envMapIntensity={2}
                        />
                    </Icosahedron>
                    <mesh scale={1.1}>
                        <Icosahedron args={[3, 0]}>
                            <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.1} />
                        </Icosahedron>
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

// --- CYBER GRID WITH ENERGY WAVES ---
function CyberGrid() {
    const gridRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        gridRef.current.position.z = (time * 5) % 40;
    });

    return (
        <group position={[0, -20, 0]}>
            <group ref={gridRef}>
                <gridHelper args={[200, 40, '#4338ca', '#1e1b4b']} />
                <gridHelper args={[200, 40, '#4338ca', '#1e1b4b']} position={[0, 0, -200]} />
            </group>

            {/* Horizontal Glow */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]}>
                <planeGeometry args={[200, 100]} />
                <meshBasicMaterial color="#000000" transparent opacity={0.8} />
            </mesh>
        </group>
    );
}

// --- ENERGY VORTEX (THE CORE) ---
function EnergyVortex() {
    const coreRef = useRef();
    const ringRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        coreRef.current.rotation.z = time * 0.5;
        ringRef.current.rotation.x = time * 0.3;
        ringRef.current.rotation.y = time * 0.2;
    });

    return (
        <group position={[0, 0, -40]}>
            <Sphere ref={coreRef} args={[5, 64, 64]}>
                <MeshDistortMaterial
                    color="#4f46e5"
                    speed={3}
                    distort={0.5}
                    radius={1}
                />
            </Sphere>

            {/* Inner Glow */}
            <pointLight intensity={30} color="#818cf8" distance={60} />

            <group ref={ringRef}>
                <TorusKnot args={[10, 0.2, 128, 16]}>
                    <meshBasicMaterial color="#6366f1" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
                </TorusKnot>
                <TorusKnot args={[12, 0.1, 128, 16]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshBasicMaterial color="#8b5cf6" transparent opacity={0.1} blending={THREE.AdditiveBlending} />
                </TorusKnot>
            </group>
        </group>
    );
}

// --- DARK ENVIRONMENT ---
const DarkEnvironment = () => (
    <>
        <color attach="background" args={['#020617']} />
        <fogExp2 attach="fog" args={['#020617', 0.015]} />

        <Stars radius={150} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#818cf8" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#6366f1" />

        <Suspense fallback={null}>
            <DeepSpaceNebula />
            <QuantumDataStreams />
            <AdvancedTechPlexus />
            <CrystallineArtifacts />
            <CyberGrid />
            <EnergyVortex />
        </Suspense>
    </>
);

// --- FROSTED GLASS GEOMETRY ---
function FrostedGlassGeometry() {
    return (
        <group>
            {[...Array(5)].map((_, i) => (
                <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={1} position={[(i - 2) * 20, Math.sin(i) * 10, -30]}>
                    <Sphere args={[4, 32, 32]}>
                        <meshPhysicalMaterial
                            color="#ffffff"
                            transmission={0.9}
                            thickness={2}
                            roughness={0.1}
                            transparent
                            opacity={0.3}
                            envMapIntensity={1}
                        />
                    </Sphere>
                    <mesh scale={1.05}>
                        <Sphere args={[4, 16, 16]}>
                            <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.05} />
                        </Sphere>
                    </mesh>
                </Float>
            ))}
        </group>
    );
}

// --- SOFT LIGHT STREAMS ---
function SoftLightStreams() {
    const count = 25;
    const streams = useMemo(() => {
        return [...Array(count)].map(() => ({
            x: (Math.random() - 0.5) * 80,
            z: (Math.random() - 0.5) * 40 - 15,
            y: Math.random() * 80 - 40,
            speed: 0.1 + Math.random() * 0.2,
            length: 10 + Math.random() * 10,
            opacity: 0.2 + Math.random() * 0.3
        }));
    }, []);

    useFrame(() => {
        streams.forEach((s) => {
            s.y += s.speed;
            if (s.y > 40) s.y = -40;
        });
    });

    return (
        <group>
            {streams.map((s, i) => (
                <mesh key={i} position={[s.x, s.y, s.z]}>
                    <capsuleGeometry args={[0.08, s.length, 4, 8]} />
                    <meshBasicMaterial
                        color="#818cf8"
                        transparent
                        opacity={s.opacity}
                        blending={THREE.NormalBlending}
                    />
                </mesh>
            ))}
        </group>
    );
}

// --- LIGHT ENVIRONMENT ---
const LightEnvironment = () => (
    <>
        <color attach="background" args={['#f1f5f9']} />
        <fog attach="fog" args={['#f1f5f9', 20, 100]} />

        <ambientLight intensity={1.5} />
        <pointLight position={[20, 20, 20]} intensity={2} color="#6366f1" />
        <pointLight position={[-20, 10, -10]} intensity={1} color="#94a3b8" />

        <Suspense fallback={null}>
            <FrostedGlassGeometry />
            <SoftLightStreams />

            {/* Soft Distorted Horizon */}
            <Float speed={1.5} floatIntensity={0.5}>
                <Sphere args={[25, 64, 64]} position={[0, -10, -50]}>
                    <MeshDistortMaterial
                        color="#cbd5e1"
                        speed={1}
                        distort={0.3}
                        transparent
                        opacity={0.3}
                        roughness={1}
                    />
                </Sphere>
            </Float>

            {/* Premium Light Grid */}
            <group position={[0, -18, 0]}>
                <gridHelper args={[150, 30, '#94a3b8', '#e2e8f0']} />
                {/* Glow plane for grid */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -20]}>
                    <planeGeometry args={[150, 100]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
                </mesh>
            </group>

            <Stars radius={100} depth={50} count={800} factor={3} saturation={0} fade speed={0.5} />
        </Suspense>
    </>
);

// --- CAMERA RIG ---
function Rig() {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();

    return useFrame(() => {
        camera.position.lerp(vec.set(mouse.x * 10, mouse.y * 10, 50), 0.05);
        camera.lookAt(0, 0, -20);
    });
}

const LayoutBackground = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`fixed inset-0 -z-50 w-full h-full pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-[#020617]' : 'bg-[#f8fafc]'}`}>
            <Canvas
                shadows
                camera={{ position: [0, 0, 50], fov: 60 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.5
                }}
                dpr={[1, 2]}
            >
                {isDarkMode ? <DarkEnvironment /> : <LightEnvironment />}
                <Rig />
            </Canvas>
        </div>
    );
};

export default LayoutBackground;

