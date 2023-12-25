import { useState, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  PointerLockControls,
  PointerLockControlsProps,
  useTexture,
} from '@react-three/drei';
import {
  Euler,
  Group,
  Material,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Quaternion,
  Raycaster,
  SphereGeometry,
  TextureLoader,
  Vector3,
} from 'three';
import { jumpVelocity, playerMovementSpeed } from './constants';
import { collisionDistance, gravity } from '../../global/constants';
import { handleMovementKeys } from './helpers/handleMovementKeys';
import { isColliding } from './helpers/isColliding';
import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry';

const bullet = new Mesh();
const material = new MeshStandardMaterial({ color: 'red' });
const sphere = new SphereGeometry(0.1, 64, 64);
bullet.material = material;
bullet.geometry = sphere;

const loader = new TextureLoader();
const texture = loader.load('/textures/decal.png');

const decalMaterial = new MeshStandardMaterial({
  map: texture,
  color: 'red',
  transparent: true,
  depthTest: true,
  depthWrite: false,
  polygonOffset: true,
  polygonOffsetFactor: -10,
});

const decal = new Mesh();
decal.material = decalMaterial;
export const CameraControls = ({ ...props }: PointerLockControlsProps) => {
  const velocity = useRef<number>(0);
  const isJumping = useRef<boolean>(false);
  const shakeObject = useRef<Mesh | null>(null);
  const bulletRef = useRef<Mesh | null>(null);
  const exampleRef = useRef<Mesh | null>(null);

  //TODO: Fix type
  const controls = useRef<any>(null);

  const raycaster = new Raycaster();
  const direction = new Vector3();
  const backward = new Vector3();
  const left = new Vector3();
  const right = new Vector3();
  const up = new Vector3(0, 1, 0);
  const downward = new Vector3(0, -1, 0);
  const pos = new Vector3();

  const bulletDirection = useRef<Vector3>(new Vector3());

  const { camera, scene } = useThree();

  const keysDown = useRef<KeysDown>({});

  useEffect(() => {
    const onLeftClick = (event: MouseEvent) => {
      camera.getWorldDirection(bulletDirection.current);
      camera.getWorldPosition(pos);

      bulletRef.current = bullet;
      bulletRef.current.position.set(pos.x, pos.y, pos.z);

      scene.add(bulletRef.current);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        keysDown.current[event.code] = true;
        isJumping.current = true;
        velocity.current = jumpVelocity; // Initial jump velocity
      }

      if (event.code === 'KeyW' || event.code === 'KeyS') {
        keysDown.current[event.code] = true;
      }
      if (event.code === 'KeyQ' || event.code === 'KeyE') {
        keysDown.current[event.code] = true;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysDown.current[event.code] = false;
    };

    window.addEventListener('click', onLeftClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keyup', onKeyDown);
      window.removeEventListener('click', onLeftClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [camera.position.y, camera.position.x, camera.position.z]);

  useFrame((state, delta) => {
    camera.getWorldDirection(direction);
    backward.copy(direction).negate();
    left.crossVectors(direction, up).negate();
    right.crossVectors(direction, up);

    const canMoveForward = !isColliding({
      direction,
      raycaster,
      rayStartPosition: camera.position,
      scene,
      collisionDistance,
      intersectObjects: scene.children,
    });
    const canMoveBackward = !isColliding({
      direction: backward,
      raycaster,
      rayStartPosition: camera.position,
      scene,
      collisionDistance,
      intersectObjects: scene.children,
    });
    const canMoveLeft = !isColliding({
      direction: left,
      raycaster,
      rayStartPosition: camera.position,
      scene,
      collisionDistance,
      intersectObjects: scene.children,
    });
    const canMoveRight = !isColliding({
      direction: right,
      raycaster,
      rayStartPosition: camera.position,
      scene,
      collisionDistance,
      intersectObjects: scene.children,
    });
    const isOnGround = isColliding({
      direction: downward,
      raycaster,
      rayStartPosition: camera.position,
      scene,
      collisionDistance,
      intersectObjects: scene.children,
    });

    if (!isOnGround) {
      // Update velocity and position for gravity
      const newVelocity = velocity.current - gravity * 0.02; // Gravity effect
      camera.position.y += newVelocity * 0.02; // Update position
      velocity.current = newVelocity;
    }

    if (canMoveForward) {
      if (keysDown.current['KeyW']) {
        handleMovementKeys('KeyW', controls, playerMovementSpeed);
      }
    }
    if (canMoveBackward) {
      if (keysDown.current['KeyS']) {
        handleMovementKeys('KeyS', controls, playerMovementSpeed);
      }
    }
    if (canMoveLeft) {
      if (keysDown.current['KeyQ']) {
        handleMovementKeys('KeyQ', controls, playerMovementSpeed);
      }
    }
    if (canMoveRight) {
      if (keysDown.current['KeyE']) {
        handleMovementKeys('KeyE', controls, playerMovementSpeed);
      }
    }

    if (isJumping.current) {
      // Update velocity and position for gravity
      const newVelocity = velocity.current - gravity * 0.02; // Gravity effect
      camera.position.y += newVelocity * 0.02; // Update position

      // Ground contact
      if (isOnGround) {
        isJumping.current = false;
      }

      velocity.current = newVelocity;
    }

    if (bulletRef.current) {
      bulletRef.current.translateOnAxis(bulletDirection.current, 1);

      const hit = isColliding({
        direction: bulletDirection.current,
        raycaster,
        rayStartPosition: bulletRef.current.position,
        scene,
        collisionDistance,
        intersectObjects: scene.children.filter((e) => e.userData.enemy),
      });

      if (hit) {
        shakeObject.current = hit.object as Mesh;
        scene.remove(bulletRef.current);

        const position = hit.point.clone();
        const eye = position.clone();
        eye.add(hit.face?.normal ?? new Vector3());

        const rotation = new Matrix4();
        rotation.lookAt(eye, position, Object3D.DEFAULT_UP);
        const euler = new Euler();
        euler.setFromRotationMatrix(rotation);

        const decalGeometry = new DecalGeometry(
          hit.object as Mesh,
          hit.point,
          euler,
          new Vector3(0.5, 0.5, 0.5)
        );

        decal.geometry = decalGeometry;
        scene.add(decal);
        console.log(scene.children);
      }
    }
  });

  return (
    <>
      <PointerLockControls
        ref={controls}
        makeDefault
        {...props}
      />
      <mesh
        ref={exampleRef}
        position={[-10, 0, 0]}
        castShadow
        userData={{ enemy: true }}
      >
        <boxBufferGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* <CandyCane
        ref={weaponRef}
        scale={0.01}
      /> */}
    </>
  );
};
