import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/home";
import { ARCameraMain } from "~/component/ar_camera/ARCameraMain";
import xmastree_img from '../assets/sprite/05_xmastree_targetframe.png'
import camera_img from '../assets/sprite/btn_camera.png'

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
                className="relative z-0"
            />

    <div className="flex items-center justify-center min-h-screen">
        <div className="relative w-10/12">
            <img src={xmastree_img} className="w-full"></img>

            <img 
                src={camera_img} 
                className="absolute left-1/2 -translate-x-1/2 cursor-pointer transition-transform hover:scale-110"
                style={{ width: '40%', bottom: '-2.5rem' }}
            ></img>
        </div>
    </div>

            <video ref={videoRef} style={{ display: 'none' }}></video>
        </div>
    )
}