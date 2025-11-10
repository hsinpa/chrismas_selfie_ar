import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import btn_camera from '../assets/sprite/btn_camera.png'
import { formatString, getRandomItem } from '~/utility/utility_func';
import { PRIZES_STATIC } from '~/utility/prize_static';

let pre_background = "/images/03_opening_bg.jpg";
let after_background = "/images/04_giftresult_bg.jpg";

const gift_to_camera_desc = "跳轉至鏡頭中{0}s...";

export default function DrawGiftPage() {
    const [is_gift_given, set_gift_given] = useState(false);  
    const [gift_title_text, set_title_text] = useState("");
    const [gift_content_text, set_gift_content_text] = useState("開箱中...");
    const navigate = useNavigate();

    const [gift_gif_path, set_gift_gif_path] = useState("images/gift_open.gif");
    
    useEffect(() => {
        // Set up the timer
        let interval_timeout: any = null;
        let time_remain = 5;

        let next_gift = getRandomItem(PRIZES_STATIC);

        const timer = setTimeout(() => {
            console.log(`images/prizes/${next_gift}.gif`)
            set_gift_given(true);
            set_title_text("恭喜獲得禮物!");
            set_gift_content_text(formatString(gift_to_camera_desc, [time_remain]));
            set_gift_gif_path(`images/prizes/${next_gift}.png`);

            interval_timeout = setInterval(() => {
              time_remain -= 1;
              set_gift_content_text(formatString(gift_to_camera_desc, [time_remain]));

              if (time_remain <= 0) {
                clearInterval(interval_timeout);
                navigate('/ar_camera?gift=' + encodeURIComponent(next_gift));
              }
            }, 1000);

        }, 5000); // 5 seconds

        return () => {
            clearTimeout(timer);
            if (interval_timeout != null) {
                clearInterval(interval_timeout);
            }
        };
    }, []); 

    return (
<div 
    className="bg-cover bg-center h-screen flex flex-col justify-center items-center py-8 relative gap-8"
    style={{ backgroundImage: `url('${is_gift_given ? after_background : pre_background}')` }}
>

    <img 
        src={gift_gif_path}
        alt="Gift"
        className="w-1/2 md:w-1/3"
    />


      <section className='flex flex-col gap-4'>
        <h4 className="text-yellow-300 text-center text-4xl md:text-2xl font-bold px-4"
           style={{textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'}}>
          {gift_title_text}
        </h4>

        <p className=" text-white text-center text-2xl md:text-2xl font-bold px-4"
          style={{textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'}}>
          {gift_content_text}
        </p>
      </section>
  </div>
  );
}