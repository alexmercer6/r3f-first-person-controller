import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import { Crosshair } from './components/Crosshair';

function App() {
  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 20], fov: 50, far: 2000, near: 0.001 }}
      >
        <color
          attach="background"
          args={['black']}
        />
        <Experience />
      </Canvas>
      <Crosshair />
    </>
  );
}

export default App;
