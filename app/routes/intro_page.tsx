import { Link } from 'react-router';
import next_btn_img from '../assets/sprite/02_btn_next.png'
import label_png from '../assets/sprite/02_label_with_text.png'
import kv_title_v2 from '../assets/sprite/kv_title_v2.png'

export default function IntroPage() {
    return (
<div className="bg-[url('/images/02_intro_bg.jpg')] bg-size-[100%_100%] bg-no-repeat bg-center h-screen
      relative flex flex-col justify-center items-center">

      <img 
        src={kv_title_v2}
        className="mb-2" 
        alt="Title"
      />

      <img 
        src={label_png}
        className="relative w-11/12 sm:w-1/2 mb-4" 
        alt="Label"
      />

      <Link to='/draw_gift' className="w-auto">
        <img 
            src={next_btn_img}
            className="max-w-xs md:max-w-sm cursor-pointer hover:scale-105 transition-transform"
        />
      </Link>

    </div>  );
}