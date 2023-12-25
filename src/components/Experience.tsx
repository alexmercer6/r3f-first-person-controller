import { Environment, RandomizedLight } from '@react-three/drei';
import { Floor } from './Floor';
import { ExamplePhysicsObject } from './ExamplePhysicsObject';
import { CameraControls } from './controls/CameraControls';
import { CandyCane } from './models/CandyCane';

const Experience = () => {
  return (
    <>
      <Environment
        preset="sunset"
        background
        blur={0.8}
      />
      <CameraControls />
      <RandomizedLight
        castShadow
        amount={8}
        frames={100}
        position={[5, 5, -10]}
      />
      <ambientLight />

      <Floor />
      <mesh
        position={[10, 0, 0]}
        castShadow
      >
        <boxBufferGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </>
  );
};

export default Experience;
