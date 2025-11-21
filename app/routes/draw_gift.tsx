import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import front_overlay from '../assets/sprite/front_overlay.png'
import { formatString, getRandomItem } from '~/utility/utility_func';
import { PRIZES_STATIC } from '~/utility/prize_static';

let pre_background = "/images/03_opening_bg.jpg";
let after_background = "/images/04_giftresult_bg.jpg";

const gift_to_camera_desc = "跳轉至鏡頭中{0}s...";
const gift_open_gif = 'images/prizes/santa_4_hide.png';

export default function DrawGiftPage() {
    const [is_gift_given, set_gift_given] = useState(false);  
    const [gift_title_text, set_title_text] = useState("");
    const [gift_content_text, set_gift_content_text] = useState("開箱中...");
    const navigate = useNavigate();

    const [gift_gif_path, set_gift_gif_path] = useState(gift_open_gif);
    
    useEffect(() => {
        // Set up the timer
        let interval_timeout: any = null;
        let time_remain = 5;

        let next_gift = getRandomItem(PRIZES_STATIC);
        // set_gift_gif_path(`images/prizes/${next_gift}.png`);

        const timer = setTimeout(() => {

            set_gift_given(true);
            set_title_text("恭喜獲得禮物!");
            set_gift_content_text(formatString(gift_to_camera_desc, [time_remain]));
            // set_gift_gif_path(`images/prizes/${next_gift}.png`);
            set_gift_gif_path(`images/prizes/santa_4_visible.png`);

            interval_timeout = setInterval(() => {
              time_remain -= 1;

              if (time_remain <= 0) {
                clearInterval(interval_timeout);
                navigate('/ar_camera?gift=' + encodeURIComponent(next_gift));
              }
            }, 1000);

        }, 2000);

        return () => {
            clearTimeout(timer);
            if (interval_timeout != null) {
                clearInterval(interval_timeout);
            }
        };
    }, []); 

    return (
<div 
    className="bg-cover bg-center h-screen flex flex-col justify-center items-center py-8 relative"
    style={{ backgroundImage: `url('${is_gift_given ? after_background : pre_background}')` }}
>

    <section className='flex flex-col gap-1 h-20'>
      <p className=" text-white text-center text-2xl md:text-2xl font-bold px-4"
        style={{textShadow: '2px 2px 0 #498B62, -2px -2px 0 #498B62, 2px -2px 0 #498B62, -2px 2px 0 #498B62'}}>
          登登登
      </p>

      <p className="text-white text-center text-4xl md:text-2xl font-bold px-4"
          style={{textShadow: '2px 2px 0 #498B62, -2px -2px 0 #498B62, 2px -2px 0 #498B62, -2px 2px 0 #498B62'}}>
           山系森誕老公公
      </p>        
    </section>

    <img 
        src={gift_gif_path}
        alt="Gift"
        className={`relative z-1 `}
    />

    <img 
        src={front_overlay}
        alt="Gift"
        className={`absolute bottom-0 z-2 w-full`}
    />
    <p className="text-xs absolute bottom-8 z-20">Copyright @Taiwan High Speed Rail  Corporation</p>
  </div>
  );
}