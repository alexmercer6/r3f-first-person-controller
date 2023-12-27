import { useLoader } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { Vector2 } from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
// import { TextureLoader } from "three";

export const Floor = () => {
  const texture = useLoader(TextureLoader, '/textures/checkerboard.png');

  return (
    <mesh
      rotation={[Math.PI / 2, 0, 0]}
      receiveShadow
      position={[0, -10, 0]}
    >
      <boxGeometry args={[1000, 1000, 10]} />
      <meshStandardMaterial
        color="limegreen"
        map={texture}
      />
    </mesh>
  );
};
