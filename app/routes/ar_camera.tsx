import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/home";
import { ARCameraMain } from "~/component/ar_camera/ARCameraMain";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chrismas AR App" },
    { name: "description", content: "Welcome to Chrismas AR App!" },
  ];
}

export default function ARCameraComp() {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);

    const [ar_camera_main, set_ar_camera] = useState<ARCameraMain | null>(null);
    
    useEffect(() => {
        const canvas_holder_dom = canvasRef.current;
        const video_dom = videoRef.current;

        if (!canvas_holder_dom || !video_dom) return;
        
        let temp_ar_camera_main = new ARCameraMain(canvas_holder_dom, video_dom);
        set_ar_camera(temp_ar_camera_main);
    }, []);


    return (
        <div>
            <div 
                ref={canvasRef} 
            />
            <video ref={videoRef} style={{ display: 'none' }}></video>
        </div>
    )
}