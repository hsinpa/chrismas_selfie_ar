import type { Route } from "./+types/home";
import start_btn_img from '../assets/sprite/01_btn_start.png'
import santa_gif from '../assets/sprite/santa.gif'

import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Chrismas AR App" },
    { name: "description", content: "Welcome to Chrismas AR App!" },
  ];
}

export default function Home() {

  return (
  <div className="bg-[url('/images/01_landing_bg.jpg')] bg-cover bg-center h-screen
  flex flex-col justify-end items-center py-8">

    <img className="w-auto max-w-xs md:max-w-sm" src={santa_gif}></img>

    <Link to='/intro_page'>
        <img src={start_btn_img}
        className="w-auto max-w-xs md:max-w-sm cursor-pointer hover:scale-105 transition-transform"
    ></img>
    </Link>
  </div>
  );


}
