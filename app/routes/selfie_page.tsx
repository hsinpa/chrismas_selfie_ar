import { useEffect } from "react";
import { useARCameraStore } from "~/zustand/ar_camera_store";
import { Link } from "react-router";
import { downloadFromBase64 } from "~/utility/utility_func";
import play_again_btn_img from '../assets/sprite/play_again.png'
import share_and_lottery_img from '../assets/sprite/share_and_lottery.png'
import kv_title_v3 from '../assets/sprite/kv_title_v3.png'

export default function SelfiePage() {
    const selfie_source = useARCameraStore(x=>x.selfie_source);

    useEffect(() => {

    }, [selfie_source])


    const save_image_to_device = () => {
        if (selfie_source == null) return;

        downloadFromBase64(selfie_source, 'my_chrismas_selfie.png');
    }

    const share_image_to_device = () => {
        window.open("https://www.facebook.com/thsrco/posts/pfbid0TNHN49uSNLT8gVA6rAzRRroxLxenFyEFTuupAKcNCc5LbVq83UoN7UD8dZUb5pDpl");
    }

    return (
        <div className="bg-[url('/images/07_dlresult_bg.jpg')] bg-size-[100%_100%] bg-no-repeat bg-center h-screen
        flex flex-col justify-center items-center py-8">

        <img 
            src={kv_title_v3} 
            className="max-w-24"
        />

        <p className="text-white text-center text-2xl md:text-2xl font-bold py-4">
            收藏你的照片吧!
        </p>        

        {selfie_source && (


        <div className="flex flex-col items-center gap-4 mb-2">
          <div className="group relative">
            {/* <img src={selfie_source} alt="Selfie" className="w-auto max-w-3xs md:max-w-sm" /> */}
            <img 
              src={selfie_source} 
              alt="Profile Clean" 
              className="max-w-3xs md:max-w-sm h-80 object-cover rounded-3xl border-3 border-white shadow-lg"
              onClick={save_image_to_device}
            />


          </div>

        <span className="block text-white text-sm font-semibold">點擊可下載圖片</span>
        </div>
        )}

        <img onClick={share_image_to_device}
        className="w-auto max-w-xs md:max-w-sm cursor-pointer hover:scale-105 transition-transform"
        src={share_and_lottery_img}></img>

        <Link to='/'
            className="w-auto max-w-xs md:max-w-sm cursor-pointer hover:scale-105 transition-transform"
        >
            <img src={play_again_btn_img}></img>
        </Link>



        </div>
    )
}