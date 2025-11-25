import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import front_overlay from '../assets/sprite/front_overlay.png'
import { formatString, getRandomItem } from '~/utility/utility_func';
import { PRIZES_STATIC } from '~/utility/prize_static';
import { SANTA_TABLE, STYLES } from '~/component/draw_gift/style_static_data';

let pre_background = "/images/03_opening_bg.jpg";
let after_background = "/images/04_giftresult_bg.jpg";

const gift_to_camera_desc = "跳轉至鏡頭中{0}s...";
const gift_open_gif = 'images/prizes/santa_傳統_black.png';
const gift_png_path_template = 'images/prizes/santa_{0}_{1}.png';

export default function DrawGiftPage() {
    const [is_gift_given, set_gift_given] = useState(false);  
    const [gift_title_text, set_title_text] = useState("");
    const navigate = useNavigate();

    const [gift_gif_path, set_gift_gif_path] = useState<string | undefined>(undefined);
    
    useEffect(() => {
        // Set up the timer
        let interval_timeout: any = null;
        let ahref_timeout: any = null;

        let time_remain = 5;

        let next_gift = getRandomItem(STYLES);

        let max_interval_len = 30;
        interval_timeout = setInterval(() => {
            max_interval_len -= 1;
            set_gift_gif_path(formatString(gift_png_path_template, [getRandomItem(STYLES), "black"]));

            if (max_interval_len <= 0) {
                let title_text = SANTA_TABLE.get(next_gift) || "";
                clearInterval(interval_timeout);

                set_gift_given(true);
                set_title_text(title_text);

                set_gift_gif_path(formatString(gift_png_path_template, [next_gift, "white"]));
                ahref_timeout = to_camera_page(next_gift, 3000);
            }
        }, 100);

        // const timer = setTimeout(() => {

        //     set_gift_given(true);
        //     set_title_text("恭喜獲得禮物!");
        //     set_gift_content_text(formatString(gift_to_camera_desc, [time_remain]));
        //     // set_gift_gif_path(`images/prizes/${next_gift}.png`);
        //     set_gift_gif_path(`images/prizes/santa_傳統_white.png`);

        //     interval_timeout = setInterval(() => {
        //       time_remain -= 1;

        //       if (time_remain <= 0) {
        //         clearInterval(interval_timeout);
        //         navigate('/ar_camera?gift=' + encodeURIComponent(next_gift));
        //       }
        //     }, 1000);

        // }, 2000);

        return () => {
            clearInterval(interval_timeout);
            if (ahref_timeout != null) {
                clearTimeout(ahref_timeout);
            }
        };
    }, []); 

    const to_camera_page = function(style: string, delay: number) {
        const timer = setTimeout(() => {
            navigate('/ar_camera?gift=' + encodeURIComponent(style));
        }, delay);

        return timer;
    }

    return (
<div 
    className="bg-size-[100%_100%] bg-no-repeat bg-center h-screen flex flex-col justify-center items-center py-8 relative"
    style={{ backgroundImage: `url('${is_gift_given ? after_background : pre_background}')` }}
>

    <section className='flex flex-col gap-1 h-20 relative top-6'>
      <p className="text-white text-center text-4xl font-bold px-4 whitespace-nowrap ">
           {gift_title_text}
      </p>
    </section>

    <img 
        src={gift_gif_path}
        alt="Gift"
        className={`z-1 relative top-4`}
    />

    <img 
        src={front_overlay}
        alt="Gift"
        className={`absolute bottom-0 z-2 w-full`}
    />
  </div>
  );
}