/* eslint-disable react-hooks/purity */
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
attribute vec3 customColor;
varying vec3 vColor;

void main() {
    vColor = customColor;
    
    vec3 animatedPosition = position;
    
    // Calculate distance from center
    float dist = length(animatedPosition);
    
    // Wave effect radiating from center
    float wave = sin(dist * 2.0 - uTime * 3.0) * 0.1;
    
    animatedPosition += (animatedPosition / dist) * wave;

    // Optional mouse interaction skew (simplified for shader)
    animatedPosition.x += uMouse.x * 0.5 * sin(uTime + dist);
    animatedPosition.y += uMouse.y * 0.5 * cos(uTime + dist);

    vec4 mvPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    
    gl_PointSize = (40.0 / -mvPosition.z); // Increased size slightly to make glowing pronounced
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
    // Create a circular glowing particle
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 0.05 / distanceToCenter - 0.1;
    
    if(distanceToCenter > 0.5) discard;

    gl_FragColor = vec4(vColor, alpha);
}
`;

const ChakraParticles = ({ count = 4000 }) => {
    const pointsRef = useRef();
    const materialRef = useRef();
    const { mouse, viewport } = useThree();

    // Create particles
    // eslint-disable-next-line react-hooks/purity
    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);

        const color1 = new THREE.Color('#22D3EE'); // accentLight
        const color2 = new THREE.Color('#F59E0B'); // accentWarm
        const color3 = new THREE.Color('#FFFFFF');

        for (let i = 0; i < count; i++) {
            // Distribute particles in a spherical/spiral pattern (Chakra shape)
            const r = Math.random() * 4 + 0.5;
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(Math.random() * 2 - 1);

            // Apply some flattening to make it disc-like
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = (r * Math.sin(phi) * Math.sin(theta)) * 0.3; // Flattened Y
            const z = r * Math.cos(phi) * 0.5;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Mix colors
            const mixRatio = Math.random();
            const mixedColor = mixRatio > 0.6 ? color1 : (mixRatio > 0.3 ? color2 : color3);

            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }

        return [positions, colors];
    }, [count]);

    // Animation loop (GPU Offloaded)
    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (pointsRef.current) {
            // Base rotation wrapper
            pointsRef.current.rotation.y = time * 0.2;
            pointsRef.current.rotation.z = time * 0.1;

            // Gently tilt the entire system based on mouse
            pointsRef.current.rotation.x = THREE.MathUtils.lerp(
                pointsRef.current.rotation.x,
                ((mouse.y * viewport.height) / 2 * Math.PI) / 10,
                0.05
            );

            pointsRef.current.rotation.y += THREE.MathUtils.lerp(
                0,
                ((mouse.x * viewport.width) / 2 * Math.PI) / 10,
                0.05
            );
        }

        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = time;
            materialRef.current.uniforms.uMouse.value.set(
                (mouse.x * viewport.width) / 2,
                (mouse.y * viewport.height) / 2
            );
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-customColor"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <shaderMaterial
                ref={materialRef}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                transparent={true}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTime: { value: 0 },
                    uMouse: { value: new THREE.Vector2() }
                }}
            />
        </points>
    );
};

export default ChakraParticles;
