import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ModelViewerProps {
  modelPath?: string;
  modelName?: string;
  className?: string;
}

function Model({ url }: { url: string }) {
  try {
    const { scene } = useGLTF(url);
    return <primitive object={scene} scale={[1, 1, 1]} />;
  } catch (error) {
    console.error('Error loading model:', error);
    return null;
  }
}

export const ModelViewer = ({ modelPath, modelName = "Sample Model", className }: ModelViewerProps) => {
  const getModelUrl = (path: string) => {
    const { data } = supabase.storage.from('models').getPublicUrl(path);
    return data.publicUrl;
  };

  return (
    <div className={`relative w-full h-96 bg-gradient-to-br from-shop-surface to-shop-surface-elevated rounded-lg overflow-hidden border border-border ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          {modelPath ? (
            <Model url={getModelUrl(modelPath)} />
          ) : (
            // Default shapes when no model is selected
            <>
              <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color="#6366f1" />
              </mesh>
              <mesh position={[2, 0, 0]}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="#ec4899" />
              </mesh>
              <mesh position={[-2, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
                <meshStandardMaterial color="#10b981" />
              </mesh>
            </>
          )}
          
          <Environment preset="studio" />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
        </Suspense>
      </Canvas>

      {/* Model info overlay */}
      <div className="absolute bottom-4 left-4 bg-shop-surface-elevated/90 backdrop-blur-sm rounded-lg p-3 border border-border">
        <span className="text-sm font-medium text-shop-text-primary">{modelName}</span>
      </div>
    </div>
  );
};