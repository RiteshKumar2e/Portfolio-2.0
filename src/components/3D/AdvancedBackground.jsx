import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Points, PointMaterial, Stars, Icosahedron, TorusKnot, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// --- ADVANCED VOLUMETRIC SMOKE PARTICLES ---
function VolumetricSmoke() {
    const smokeRef = useRef();
    const count = 300;

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 80,
                    (Math.random() - 0.5) * 60,
                    (Math.random() - 0.5) * 60
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    Math.random() * 0.03 + 0.01,
                    (Math.random() - 0.5) * 0.02
                ),
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.4 + 0.1
            });
        }
        return temp;
    }, []);

    useFrame((state) => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const opacities = new Float32Array(count);

        particles.forEach((p, i) => {
            p.position.add(p.velocity);

            // Reset particles that drift too far
            if (p.position.y > 30) {
                p.position.y = -30;
                p.position.x = (Math.random() - 0.5) * 80;
                p.position.z = (Math.random() - 0.5) * 60;
            }

            // Gentle swirling motion
            const time = state.clock.getElapsedTime();
            p.position.x += Math.sin(time * 0.2 + i) * 0.01;
            p.position.z += Math.cos(time * 0.2 + i) * 0.01;

            positions[i * 3] = p.position.x;
            positions[i * 3 + 1] = p.position.y;
            positions[i * 3 + 2] = p.position.z;
            sizes[i] = p.size;
            opacities[i] = p.opacity;
        });

        if (smokeRef.current) {
            smokeRef.current.geometry.attributes.position.array.set(positions);
            smokeRef.current.geometry.attributes.position.needsUpdate = true;
            smokeRef.current.geometry.attributes.size.array.set(sizes);
            smokeRef.current.geometry.attributes.size.needsUpdate = true;
        }
    });

    return (
        <Points ref={smokeRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={new Float32Array(count * 3)}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={new Float32Array(count)}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                size={2}
                color="#1e1b4b"
                transparent
                opacity={0.3}
                sizeAttenuation={true}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </Points>
    );
}

// --- ENHANCED TECH PLEXUS WITH GLOW ---
function AdvancedTechPlexus() {
    const pointsRef = useRef();
    const count = 150;

    const [particles, connections] = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 70,
                    (Math.random() - 0.5) * 50,
                    (Math.random() - 0.5) * 50
                ),
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.04,
                    (Math.random() - 0.5) * 0.04,
                    (Math.random() - 0.5) * 0.04
                ),
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
        return [temp, []];
    }, []);

    const lineRef = useRef();
    const glowPointsRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const linePositions = [];
        const lineColors = [];

        particles.forEach((p, i) => {
            p.position.add(p.velocity);

            // Bounce boundaries
            if (Math.abs(p.position.x) > 35) p.velocity.x *= -1;
            if (Math.abs(p.position.y) > 25) p.velocity.y *= -1;
            if (Math.abs(p.position.z) > 25) p.velocity.z *= -1;

            // Pulsing effect
            const pulse = Math.sin(time * 2 + p.pulsePhase) * 0.5 + 0.5;

            positions[i * 3] = p.position.x;
            positions[i * 3 + 1] = p.position.y;
            positions[i * 3 + 2] = p.position.z;

            // Color gradient based on position
            const color = new THREE.Color();
            color.setHSL(0.65 + pulse * 0.1, 0.8, 0.5 + pulse * 0.2);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        });

        // Enhanced connections with distance-based opacity
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dist = particles[i].position.distanceTo(particles[j].position);
                if (dist < 15) {
                    linePositions.push(
                        particles[i].position.x, particles[i].position.y, particles[i].position.z,
                        particles[j].position.x, particles[j].position.y, particles[j].position.z
                    );

                    const opacity = 1 - (dist / 15);
                    const lineColor = new THREE.Color(0.4 + opacity * 0.3, 0.3 + opacity * 0.4, 0.9);
                    lineColors.push(lineColor.r, lineColor.g, lineColor.b);
                    lineColors.push(lineColor.r, lineColor.g, lineColor.b);
                }
            }
        }

        if (pointsRef.current) {
            pointsRef.current.geometry.attributes.position.array.set(positions);
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
            pointsRef.current.geometry.attributes.color.array.set(colors);
            pointsRef.current.geometry.attributes.color.needsUpdate = true;
        }

        if (lineRef.current && linePositions.length > 0) {
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
                    <bufferAttribute
                        attach="attributes-color"
                        count={count}
                        array={new Float32Array(count * 3)}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.6}
                    vertexColors
                    transparent
                    opacity={0.8}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            {/* Glow effect for points */}
            <Points ref={glowPointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={new Float32Array(count * 3)}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={1.5}
                    color="#6366f1"
                    transparent
                    opacity={0.2}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </Points>

            <lineSegments ref={lineRef}>
                <bufferGeometry />
                <lineBasicMaterial
                    vertexColors
                    transparent
                    opacity={0.25}
                    blending={THREE.AdditiveBlending}
                />
            </lineSegments>
        </group>
    );
}

// --- FLOATING SMOKE CLOUDS ---
function FloatingSmokeCloud({ position }) {
    const meshRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.y = time * 0.05;
        meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
        meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 2;
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[8, 32, 32]} />
            <meshStandardMaterial
                color="#0f0a1f"
                transparent
                opacity={0.15}
                roughness={1}
                metalness={0}
                emissive="#1e1b4b"
                emissiveIntensity={0.1}
            />
        </mesh>
    );
}

// --- ENHANCED INFINITE GRID WITH SHADOWS ---
function EnhancedInfiniteGrid() {
    const gridRef = useRef();
    const shadowPlaneRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        gridRef.current.position.z = (time * 10) % 20;

        // Animate shadow intensity
        if (shadowPlaneRef.current) {
            shadowPlaneRef.current.material.opacity = 0.8 + Math.sin(time * 0.5) * 0.2;
        }
    });

    return (
        <group position={[0, -18, 0]}>
            <group ref={gridRef}>
                <gridHelper args={[250, 60, '#3730a3', '#1e1b4b']} rotation={[0, 0, 0]} />
                <gridHelper args={[250, 60, '#3730a3', '#1e1b4b']} rotation={[0, 0, 0]} position={[0, 0, -250]} />
            </group>

            {/* Shadow plane */}
            <mesh ref={shadowPlaneRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, -50]} receiveShadow>
                <planeGeometry args={[250, 150]} />
                <shadowMaterial transparent opacity={0.8} color="#000000" />
            </mesh>

            {/* Horizon glow with gradient */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
                <planeGeometry args={[250, 120]} />
                <meshBasicMaterial color="#000000" transparent opacity={1} />
            </mesh>

            {/* Multiple light sources for depth */}
            <pointLight position={[0, 8, -50]} intensity={15} color="#6366f1" distance={120} castShadow />
            <pointLight position={[-30, 5, -40]} intensity={8} color="#8b5cf6" distance={80} />
            <pointLight position={[30, 5, -40]} intensity={8} color="#3b82f6" distance={80} />
        </group>
    );
}

// --- ADVANCED FLOATING ARTIFACTS WITH SHADOWS ---
function AdvancedFloatingArtifacts() {
    return (
        <group>
            {[...Array(5)].map((_, i) => (
                <Float
                    key={i}
                    speed={1.5 + Math.random()}
                    rotationIntensity={2}
                    floatIntensity={3}
                    position={[(Math.random() - 0.5) * 50, (Math.random() - 0.5) * 25, -20 - Math.random() * 20]}
                >
                    <TorusKnot args={[1.2, 0.3, 128, 16]} castShadow>
                        <meshPhysicalMaterial
                            color={i % 2 === 0 ? "#818cf8" : "#a78bfa"}
                            roughness={0.1}
                            metalness={0.9}
                            transparent
                            opacity={0.4}
                            wireframe
                            emissive={i % 2 === 0 ? "#6366f1" : "#8b5cf6"}
                            emissiveIntensity={0.3}
                        />
                    </TorusKnot>
                </Float>
            ))}

            <Float speed={1} rotationIntensity={0.5} floatIntensity={2} position={[20, 12, -25]}>
                <Icosahedron args={[3.5, 1]} castShadow>
                    <meshPhysicalMaterial
                        color="#c084fc"
                        roughness={0.05}
                        metalness={0.95}
                        transparent
                        opacity={0.3}
                        transmission={0.9}
                        thickness={3}
                        emissive="#a855f7"
                        emissiveIntensity={0.2}
                    />
                </Icosahedron>
            </Float>

            <Float speed={1.2} rotationIntensity={0.8} floatIntensity={2.5} position={[-20, 8, -30]}>
                <Sphere args={[2, 32, 32]} castShadow>
                    <MeshDistortMaterial
                        color="#6366f1"
                        transparent
                        opacity={0.25}
                        distort={0.6}
                        speed={3}
                        roughness={0.2}
                        metalness={0.8}
                        emissive="#4f46e5"
                        emissiveIntensity={0.4}
                    />
                </Sphere>
            </Float>
        </group>
    );
}

// --- DYNAMIC ENERGY FIELD WITH ENHANCED DISTORTION ---
function EnhancedEnergyField() {
    const mesh = useRef();
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        mesh.current.rotation.x = time * 0.08;
        mesh.current.rotation.y = time * 0.12;
    });

    return (
        <Sphere ref={mesh} args={[45, 128, 128]} scale={[-1, 1, 1]}>
            <MeshDistortMaterial
                color="#050314"
                transparent
                opacity={0.9}
                distort={0.5}
                speed={2.5}
                side={THREE.BackSide}
                roughness={0.8}
            />
        </Sphere>
    );
}

// --- CENTRAL ENERGY CORE ---
function EnergyCoreGlow() {
    const coreRef = useRef();
    const glowRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const pulse = Math.sin(time * 2) * 0.3 + 0.7;

        if (coreRef.current) {
            coreRef.current.scale.setScalar(pulse);
        }
        if (glowRef.current) {
            glowRef.current.scale.setScalar(pulse * 1.5);
        }
    });

    return (
        <group position={[0, 0, -15]}>
            {/* Core */}
            <Sphere ref={coreRef} args={[1.5, 32, 32]}>
                <meshBasicMaterial color="#6366f1" transparent opacity={0.8} />
            </Sphere>

            {/* Glow layers */}
            <Sphere ref={glowRef} args={[2, 32, 32]}>
                <meshBasicMaterial
                    color="#818cf8"
                    transparent
                    opacity={0.2}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>

            <Sphere args={[3, 32, 32]}>
                <meshBasicMaterial
                    color="#a78bfa"
                    transparent
                    opacity={0.1}
                    blending={THREE.AdditiveBlending}
                />
            </Sphere>

            {/* Point light from core */}
            <pointLight intensity={20} color="#6366f1" distance={50} />
        </group>
    );
}

// --- DARK ENVIRONMENT WITH ALL ENHANCEMENTS ---
const DarkEnvironment = () => (
    <>
        <color attach="background" args={['#000000']} />
        <fogExp2 attach="fog" args={['#0a0118', 0.018]} />

        {/* Enhanced star field */}
        <Stars radius={200} depth={80} count={8000} factor={5} fade speed={1.5} />

        {/* Ambient and directional lighting */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 20, 10]} intensity={1} color="#818cf8" castShadow />

        {/* Accent lights */}
        <pointLight position={[15, 15, 15]} intensity={3} color="#a78bfa" />
        <pointLight position={[-15, 10, 10]} intensity={2.5} color="#6366f1" />
        <spotLight
            position={[0, 60, 0]}
            angle={0.4}
            penumbra={1}
            intensity={3}
            castShadow
            color="#4f46e5"
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        />

        <Suspense fallback={null}>
            <VolumetricSmoke />
            <AdvancedTechPlexus />
            <EnhancedInfiniteGrid />
            <AdvancedFloatingArtifacts />
            <EnhancedEnergyField />
            <EnergyCoreGlow />

            {/* Floating smoke clouds */}
            <FloatingSmokeCloud position={[-25, 5, -30]} />
            <FloatingSmokeCloud position={[25, 8, -35]} />
            <FloatingSmokeCloud position={[0, 15, -40]} />
        </Suspense>
    </>
);

// --- LIGHT ENVIRONMENT (UNCHANGED) ---
const LightEnvironment = () => (
    <>
        <color attach="background" args={['#f8fafc']} />
        <fog attach="fog" args={['#f8fafc', 30, 90]} />
        <ambientLight intensity={1} />
        <pointLight position={[20, 20, 20]} intensity={0.5} color="#6366f1" />
        <Stars radius={100} depth={50} count={1000} factor={2} saturation={0} fade speed={0.5} />
        <Float speed={2} floatIntensity={0.5}>
            <Sphere position={[20, -10, -25]} args={[10, 32, 32]}>
                <MeshDistortMaterial color="#f1f5f9" speed={1} distort={0.2} transparent opacity={0.4} />
            </Sphere>
        </Float>
        <gridHelper args={[100, 30, '#cbd5e1', '#f1f5f9']} position={[0, -15, 0]} />
    </>
);

// --- ENHANCED CAMERA RIG ---
function Rig() {
    const { camera, pointer } = useThree();
    useFrame(() => {
        camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 18, 0.03);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.y * 15 + 8, 0.03);
        camera.lookAt(0, 0, -25);
    });
    return null;
}

const LayoutBackground = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`fixed inset-0 -z-50 w-full h-full pointer-events-none transition-all duration-1000 ${isDarkMode ? 'bg-[#000000]' : 'bg-[#f8fafc]'}`}>
            <Canvas
                shadows
                camera={{ position: [0, 8, 55], fov: 50 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                    toneMapping: THREE.ACESFilmicToneMapping,
                    toneMappingExposure: 1.2
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
