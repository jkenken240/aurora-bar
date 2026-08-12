"use client";

import { Environment, Float } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  void main() {
    vUv = uv;
    vec3 p = position;
    float ripple = sin(distance(uv, uPointer) * 28.0 - uTime * 3.0) * 0.06;
    ripple *= smoothstep(0.55, 0.0, distance(uv, uPointer));
    p.z += sin(p.x * 0.7 + uTime * 0.35) * 0.12;
    p.z += cos(p.y * 1.2 - uTime * 0.28) * 0.08 + ripple;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uPointer;
  void main() {
    float a = sin(vUv.y * 12.0 + vUv.x * 3.0 + uTime * 0.32) * 0.5 + 0.5;
    float b = sin(vUv.y * 18.0 - vUv.x * 5.0 - uTime * 0.24) * 0.5 + 0.5;
    float veil = smoothstep(0.56, 0.96, a * 0.62 + b * 0.38);
    float halo = smoothstep(0.32, 0.0, distance(vUv, uPointer)) * 0.28;
    vec3 color = mix(vec3(0.47, 0.30, 0.94), vec3(0.18, 0.82, 0.72), vUv.x + sin(uTime * 0.2) * 0.08);
    float edge = smoothstep(0.0, 0.18, vUv.x) * smoothstep(0.0, 0.18, 1.0 - vUv.x);
    edge *= smoothstep(0.0, 0.14, vUv.y) * smoothstep(0.0, 0.18, 1.0 - vUv.y);
    gl_FragColor = vec4(color, (veil * 0.13 + halo) * edge);
  }
`;

function Veil() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();
  const pointerTarget = useMemo(() => new THREE.Vector2(), []);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
  }), []);

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    pointerTarget.set(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    material.current.uniforms.uPointer.value.lerp(pointerTarget, 0.06);
  });

  return (
    <mesh position={[0, 0.2, -2.6]} rotation={[-0.08, 0, -0.06]}>
      <planeGeometry args={[13, 8, 36, 36]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function Orbit() {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.z += delta * 0.045;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.12, 0.035);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.18, 0.035);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.08;
  });

  return (
    <group ref={group} rotation={[0.26, -0.2, -0.15]}>
      <Float speed={0.65} rotationIntensity={0.12} floatIntensity={0.25}>
        <mesh scale={1.65}><torusGeometry args={[1.28, 0.018, 10, 72]} /><meshPhysicalMaterial color="#98fff0" roughness={0.15} metalness={0.45} transparent opacity={0.45} /></mesh>
        <mesh scale={2.05} rotation={[0.45, 0.2, 1.35]}><torusGeometry args={[1.28, 0.012, 10, 72]} /><meshPhysicalMaterial color="#b596ff" roughness={0.2} metalness={0.25} transparent opacity={0.28} /></mesh>
        <mesh scale={2.7} rotation={[-0.34, 1.02, 0.1]}><torusGeometry args={[1.04, 0.007, 8, 72]} /><meshBasicMaterial color="#d99b5c" transparent opacity={0.18} /></mesh>
      </Float>
    </group>
  );
}

export default function AuroraScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 3]} intensity={1.2} color="#ffd1a3" />
      <Veil />
      <Orbit />
      <Environment preset="night" />
    </Canvas>
  );
}
