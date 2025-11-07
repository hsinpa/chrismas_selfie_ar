import { Link } from 'react-router';
import next_btn_img from '../assets/sprite/02_btn_next.png'
import label_png from '../assets/sprite/02_label.png'

export default function IntroPage() {
    return (
  <div className="bg-[url('/images/02_intro_bg.jpg')] bg-cover bg-center h-screen
  flex flex-col justify-end items-center py-8">

    <div className="relative w-11/12 sm:w-1/2 mb-4">
      <img 
        src={label_png}
        className="w-full"
        alt="Label"
      />
      
      {/* Text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-yellow-200 text-center text-base font-bold px-8">
          今年聖誕節, 聖誕老人再次搭上高鐵來台灣送禮啦!展開一場充滿人情味的旅程,
          準備把滿滿的台灣為紀念品帶回家<br></br><br></br>

          邀你一起在高鐵站仇為聖誕老人的旅伴, 在聖誕樹前數位開箱, 看看他挑選了哪些獨特的台灣紀念品!
          還能獲得一張專屬的數位卡片, 讓你的祝福先出發, 傳遞到想念的人身邊.
        </p>
      </div>
    </div>

    <Link to='/draw_gift'>
      <img src={next_btn_img}
          className="w-auto max-w-xs md:max-w-sm cursor-pointer hover:scale-105 transition-transform"
      ></img>
    </Link>

  </div>
  );
}