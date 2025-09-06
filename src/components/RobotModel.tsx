"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense } from "react";
import styles from "@/app/chat/page.module.css";

function Robot() {
  const { scene } = useGLTF("/models/robot.glb");
  return <primitive object={scene} scale={1.5} rotation={[0, 0.4, 0]} />;
}

export function RobotModel() {
  return (
    <div className={styles.robot}>
      <div className="h-40 w-40">
        <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
          <ambientLight intensity={2} />
          <directionalLight position={[5, 5, 5]} intensity={2.5} />
          <directionalLight position={[-5, 5, -5]} intensity={1.5} />
          <directionalLight position={[0, -5, 5]} intensity={1} />
          <pointLight position={[0, 3, 0]} intensity={1.2} />
          <pointLight position={[3, 0, 3]} intensity={0.8} />
          <pointLight position={[-3, 0, 3]} intensity={0.8} />
          <Suspense fallback={null}>
            <Robot />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/models/robot.glb");
