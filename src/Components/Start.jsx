import { useAuth0 } from "@auth0/auth0-react";
import './Start.css';
import Typewriter from "./Typewriter";
 //import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Start = ()=> {
    const {loginWithRedirect } = useAuth0();
  return (
    <div className="flex flex-col h-screen  items-center justify-center">
    <h1 className=" text-6xl text-center font-bold mb-6 lg:w-50 w-full p-3 whitespace-nowrap   border-black ">Welcome to <div className='text-red-800'> <Typewriter  text="SAFAR" delay={200} /></div></h1>
     <img src="start.png" alt="website image" className="w-64 h-64 mb-6 object-contain " /> 
    {/* <DotLottieReact
   src="https://lottiefiles.com/free-animation/car-animation-WOCF0Majhm"
    loop
    autoplay
  /> */}
    <p className="text-lg text-center mb-4 lg:w-50 w-full p-3">No more waiting for taxis or public transport. Start as ride with us.</p>
    <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600" onClick={() => loginWithRedirect()}>Get Started</button>
  </div>
  )
}

export default Start