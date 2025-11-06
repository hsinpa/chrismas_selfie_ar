import { Link } from 'react-router';
import { useState } from 'react';
import btn_camera from '../assets/sprite/btn_camera.png'

let pre_background = "/images/03_opening_bg.jpg";
let after_background = "/images/04_giftresult_bg.jpg";

export default function DrawGiftPage() {
    const [is_gift_given, set_gift_given] = useState(false);   

    return (
  <div 
        className="bg-cover bg-center h-screen flex flex-col items-center py-8 relative"
          style={{ backgroundImage: `url('${is_gift_given ? after_background : pre_background}')` }}
  >


    {/* Center image with auto margins */}
    <img 
        src={btn_camera}
        alt="Gift"
          className="w-1/2 md:w-1/3 my-auto"
    />

        <p className="absolute bottom-20 text-white text-center text-lg md:text-2xl font-bold px-4"
           style={{
     textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000'
   }}        >
          Your text here
        </p>


  </div>
  );
}