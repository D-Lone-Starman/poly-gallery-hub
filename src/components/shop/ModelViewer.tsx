import { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stage, Grid, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ZoomIn, ZoomOut, RotateCcw, Eye } from "lucide-react";

interface ModelViewerProps {
  modelName?: string;
  className?: string;
}

// Placeholder 3D model component
const PlaceholderModel = () => {
  const meshRef = useRef<any>();

  return (
    <group ref={meshRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color="#00d4ff" 
          metalness={0.7}
          roughness={0.2}
          emissive="#001122"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[3, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#8b5cf6" 
          metalness={0.8}
          roughness={0.1}
          emissive="#220044"
          emissiveIntensity={0.1}
        />
      </mesh>
      <mesh position={[-3, 0, 0]}>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial 
          color="#ff6b6b" 
          metalness={0.6}
          roughness={0.3}
          emissive="#440011"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-full bg-shop-surface">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

export const ModelViewer = ({ modelName = "Sample Models", className = "" }: ModelViewerProps) => {
  const [cameraPosition, setCameraPosition] = useState([5, 5, 5]);
  const controlsRef = useRef<any>();

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <Card className={`bg-shop-surface border-border overflow-hidden ${className}`}>
      <div className="relative w-full h-96 bg-gradient-to-br from-shop-surface to-shop-surface-elevated">
        <Canvas
          camera={{ position: cameraPosition as any, fov: 50 }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <Environment preset="city" />
            <Stage shadows={false}>
              <PlaceholderModel />
            </Stage>
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={20}
              maxPolarAngle={Math.PI / 2}
            />
            <Grid 
              args={[20, 20]} 
              cellColor="#333"
              sectionColor="#555"
              fadeDistance={15}
              fadeStrength={1}
            />
          </Suspense>
        </Canvas>
        
        {/* Loading overlay */}
        <Suspense fallback={<LoadingFallback />}>
          <div />
        </Suspense>

        {/* Controls overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleReset}
            className="bg-shop-surface-elevated/80 backdrop-blur-sm hover:bg-shop-surface-elevated"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Model info overlay */}
        <div className="absolute bottom-4 left-4 bg-shop-surface-elevated/90 backdrop-blur-sm rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-shop-text-primary">{modelName}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};