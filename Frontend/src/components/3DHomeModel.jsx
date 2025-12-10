import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text3D, Center, Environment } from '@react-three/drei';

const HouseModel = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={1} />
      <pointLight position={[10, 10, 10]} />
      <Center>
        {/* Main House */}
        <Box args={[2, 1.5, 1.5]} position={[0, 0.75, 0]}>
          <meshStandardMaterial color="#4f46e5" />
        </Box>
        {/* Roof */}
        <Box args={[2.2, 0.2, 1.7]} position={[0, 1.6, 0]} rotation={[0, 0, 0]}>
          <meshStandardMaterial color="#ef4444" />
        </Box>
        {/* Door */}
        <Box args={[0.4, 0.8, 0.1]} position={[0, 0.4, 0.75]}>
          <meshStandardMaterial color="#f59e0b" />
        </Box>
      </Center>
      <OrbitControls enableZoom={false} autoRotate />
      <Environment preset="sunset" />
    </Canvas>
  );
};

export default HouseModel;