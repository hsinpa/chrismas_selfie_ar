import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/home";
import { ARCameraMain } from "~/component/ar_camera/ARCameraMain";
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

    const cameraVideoRef = useRef(null);
    const screenVideoRef = useRef(null);

    const set_selfie = useARCameraStore(x=>x.set_selfie);
    const [ar_camera_main, set_ar_camera] = useState<ARCameraMain | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const canvas_holder_dom = canvasRef.current;
        const camera_video_dom = cameraVideoRef.current;
        const screen_video_dom = screenVideoRef.current;

        if (!canvas_holder_dom || !camera_video_dom || !screen_video_dom) return;
        
        let temp_ar_camera_main = new ARCameraMain(canvas_holder_dom, camera_video_dom, screen_video_dom);
        set_ar_camera(temp_ar_camera_main);
        
        return () => {
            temp_ar_camera_main.dispose();
        }
    }, []);


    return (
        <div>
            <div 
                ref={canvasRef} 
                className="relative z-0"
            />

        <div className="flex items-center justify-center h-screen overflow-hidden">
            <img 

                className="absolute bottom-0 left-0 w-full h-1/3 opacity-0 cursor-pointer"

                onClick={async () => {
                    let capture_base64 = await ar_camera_main?.captureAsImage();
                    if (capture_base64 != null) {
                        set_selfie(capture_base64);
                        navigate("/selfie_page");
                    }
                }}
                src={camera_img} 
            ></img>
        </div>

            <video ref={cameraVideoRef} style={{ display: 'none' }}></video>

            <video ref={screenVideoRef} style={{ display: 'none' }} autoPlay={true} loop={true} playsInline={true} muted={true} preload="auto">
                {/* <source src='./screen_frames/screen_frame_hevc.mov' type='video/mp4; codecs="hvc1"'></source>
                <source src='./screen_frames/screen_frame_vp9.webm' type='video/webm; codecs="vp9"'></source> */}
                {/* Your browser does not support the video tag. */}
            </video>
            
            {/* <img ref={screenVideoRef} style={{ display: 'none' }} src="./screen_frames/screen_frame_temp.png" ></img> */}
        </div>
    )
}