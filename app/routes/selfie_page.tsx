import { useEffect } from "react";
import { useARCameraStore } from "~/zustand/ar_camera_store";

import download_share_img from '../assets/sprite/07_btn_downloadshare.png'
import play_again_img from '../assets/sprite/07_btn_playagain.png'
import { Link } from "react-router";
import { downloadFromBase64 } from "~/utility/utility_func";

export default function SelfiePage() {
    const selfie_source = useARCameraStore(x=>x.selfie_source);

    useEffect(() => {

    }, [selfie_source])


    const save_image_to_device = () => {
        if (selfie_source == null) return;

        downloadFromBase64(selfie_source, 'my_chrismas_selfie.png');
    }

    return (
        <div className="bg-[url('/images/07_dlresult_bg.jpg')] bg-cover bg-center h-screen
        flex flex-col justify-end items-center py-8 gap-3">

        {selfie_source && (
            <img src={selfie_source} alt="Selfie" className="w-auto max-w-3xs md:max-w-sm" />
        )}

        <button onClick={save_image_to_device}
            className="w-64 px-8 py-3 bg-linear-to-b from-[#E78756] to-orange-600 text-white text-2xl font-bold rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg text-center"
        >下載並分享</button>

        <Link to='/ar_camera'
            className="w-64 px-8 py-3 bg-white text-orange-600 text-2xl font-bold rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg text-center"
        >再拍一次</Link>


        <Link to='/'
            className="text-2xl font-bold cursor-pointer hover:scale-105 transition-transform"
        >回首頁</Link>

        </div>
    )
}