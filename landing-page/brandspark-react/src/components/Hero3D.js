import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Dodecahedron } from '@react-three/drei';

const SpinningDodecahedron = () => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01));

  return (
    <Dodecahedron ref={ref} args={[1, 0]}>
      <meshStandardMaterial color="#00A896" />
    </Dodecahedron>
  );
};

const Hero3D = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <SpinningDodecahedron />
    </Canvas>
  );
};

export default Hero3D;
