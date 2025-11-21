import start_btn_img from '../assets/sprite/01_btn_start.png'
// import santa_gif from '../assets/sprite/santa.gif'

import { Link } from "react-router";

export default function Home() {
  return (
 <div className="bg-[url('/images/01_landing_bg.jpg')] bg-size-[100%_100%] bg-no-repeat w-screen h-screen flex flex-col justify-end items-center py-8">
    {/* <img className="w-auto max-w-xs md:max-w-sm" src={santa_gif}></img> */}

    <Link to='/intro_page'>
        <img src={start_btn_img}
        className="w-auto max-w-xs md:max-w-sm cursor-pointer hover:scale-105 transition-transform"
    ></img>
    </Link>
  </div>
  );
}
