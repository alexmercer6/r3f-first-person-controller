import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Mesh, Raycaster, Vector3 } from 'three';
import { isColliding } from './controls/helpers/isColliding';
import { collisionDistance, gravity } from '../global/constants';

export const ExamplePhysicsObject = () => {
  const meshRef = useRef<Mesh>(null);
  const [position, setPosition] = useState(new Vector3(0, 20, 0)); // Starting position
  // const [velocity, setVelocity] = useState(new Vector3(0, 0, 0)); // Starting velocity
  const [velocity, setVelocity] = useState<number>(0);
  const pos = new Vector3();
  const vel = new Vector3();
  const floorPos = new Vector3(0, -10, 0);
  const downward = new Vector3(0, -1, 0);
  const { camera, scene } = useThree();

  const raycaster = new Raycaster();

  useFrame(() => {
    const isOnGround = isColliding({
      direction: downward,
      raycaster,
      rayStartPosition: meshRef.current?.position ?? pos,

      collisionDistance,
      intersectObjects: scene.children,
    });

    if (!isOnGround && meshRef.current) {
      // Update velocity and position for gravity
      const newVelocity = velocity - gravity * 0.02; // Gravity effect
      meshRef.current.position.y += newVelocity * 0.02; // Update position

      setVelocity(newVelocity);
    }

    if (meshRef.current) {
      if (
        meshRef.current.position.distanceTo(camera.position) < 10 &&
        meshRef.current.position.distanceTo(camera.position) > 2
      ) {
        const cameraDirection = camera.position
          .clone()
          .sub(meshRef.current.position)
          .normalize();

        meshRef.current.lookAt(camera.position);
        meshRef.current.translateOnAxis(cameraDirection, 0.1);
      }
    }

    // Basic gravity simulation
    // let newVelocity = vel.set(velocity.x, velocity.y - 9.81 * 0.01, velocity.z); // Gravity effect
    // let newPosition = pos.set(
    //   position.x,
    //   position.y + newVelocity.y * 0.01,
    //   position.z
    // ); // Update position

    // // Collision detection with the floor
    // if (newPosition.y < 0) {
    //   newPosition.y = 0;
    //   newVelocity.y = 0; // Stop moving after collision
    // }

    // setPosition(newPosition);
    // setVelocity(newVelocity);

    // if (meshRef.current) {
    //   meshRef.current.position.set(newPosition.x, newPosition.y, newPosition.z);
    // }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        position={position}
        castShadow
        userData={{ enemy: true }}
      >
        <boxBufferGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>
      {/* <Bullets
        player1={meshRef.current}
        player2={null}
      /> */}
    </>
  );
};
