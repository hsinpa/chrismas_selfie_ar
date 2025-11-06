import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/home";
import { ARCameraMain } from "~/component/ar_camera/ARCameraMain";
import xmastree_img from '../assets/sprite/05_xmastree_targetframe.png'
import camera_img from '../assets/sprite/btn_camera.png'
import { useARCameraStore } from "~/zustand/ar_camera_store";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chrismas AR App" },
    { name: "description", content: "Welcome to Chrismas AR App!" },
  ];
}

export default function ARCameraComp() {
    const canvasRef = useRef(null);
    const videoRef = useRef(null);
    const set_selfie = useARCameraStore(x=>x.set_selfie);
    const [ar_camera_main, set_ar_camera] = useState<ARCameraMain | null>(null);
    const navigate = useNavigate();

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

        <div className="flex items-center justify-center h-screen overflow-hidden">
            <div className="relative w-10/12 flex items-center justify-center">
                <img 
                    src={xmastree_img} 
                    className="max-h-[83.333333vh] max-w-full h-auto w-auto object-contain"
                ></img>

                <img 
                    onClick={async () => {
                        let capture_base64 = await ar_camera_main?.captureAsImage();
                        if (capture_base64 != null) {
                            set_selfie(capture_base64);
                            navigate("/selfie_page");
                        }
                    }}
                    src={camera_img} 
                    className="absolute left-1/2 -translate-x-1/2 cursor-pointer transition-transform hover:scale-110 w-5/12 md:w-48"
                    style={{bottom: '-3rem' }}
                ></img>
            </div>
        </div>


            <video ref={videoRef} style={{ display: 'none' }}></video>
        </div>
    )
}