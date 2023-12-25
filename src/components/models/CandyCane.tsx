import * as THREE from 'three';
import React, { useRef, forwardRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Candy_Cane: THREE.Mesh;
  };
  materials: {
    Mat: THREE.MeshStandardMaterial;
  };
};

export const CandyCane = forwardRef<
  THREE.Group,
  JSX.IntrinsicElements['group']
>((props, ref) => {
  const { nodes, materials } = useGLTF('/models/Candy cane.glb') as GLTFResult;
  return (
    <group
      {...props}
      ref={ref}
      dispose={null}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Candy_Cane.geometry}
        material={materials.Mat}
      />
    </group>
  );
});

useGLTF.preload('/models/Candy cane.glb');
