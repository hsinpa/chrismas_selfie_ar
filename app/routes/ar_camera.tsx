import { useEffect, useRef, useState } from "react";
import type { Route } from "./+types/home";
import { ARCameraMain } from "~/component/ar_camera/ARCameraMain";
import camera_img from '../assets/sprite/btn_camera.png'
import { useARCameraStore } from "~/zustand/ar_camera_store";
import { useNavigate, useSearchParams } from "react-router";

export default function ARCameraComp() {
  const [searchParams] = useSearchParams();
    const canvasRef = useRef(null);

    const cameraVideoRef = useRef(null);
    const screenVideoRef = useRef(null);

    const set_selfie = useARCameraStore(x=>x.set_selfie);
    const [ar_camera_main, set_ar_camera] = useState<ARCameraMain | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const gift_item = searchParams.get('gift') || "傳統";
        const canvas_holder_dom = canvasRef.current;
        const camera_video_dom = cameraVideoRef.current;
        const screen_video_dom = screenVideoRef.current;

        if (!canvas_holder_dom || !camera_video_dom || !screen_video_dom) return;
        
        let temp_ar_camera_main = new ARCameraMain(canvas_holder_dom, camera_video_dom, screen_video_dom, gift_item);
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

            <img 
            
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 cursor-pointer z-20"

                onClick={async () => {
                    let capture_base64 = await ar_camera_main?.captureAsImage();
                    if (capture_base64 != null) {
                        set_selfie(capture_base64);
                        navigate("/selfie_page");
                    }
                }}
                src={camera_img} 
            ></img>

            <video ref={cameraVideoRef} style={{ display: 'none' }}></video>

            <video ref={screenVideoRef} style={{ display: 'none' }} autoPlay={true} loop={true} playsInline={true} muted={true} preload="auto">
                {/* <source src='./screen_frames/screen_frame_hevc.mov' type='video/mp4; codecs="hvc1"'></source>
                <source src='./screen_frames/screen_frame_vp9.webm' type='video/webm; codecs="vp9"'></source> */}
                {/* Your browser does not support the video tag. */}
            </video>
        </div>
    )
}