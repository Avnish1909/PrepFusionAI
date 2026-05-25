import React from 'react'
import { motion } from "motion/react"
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from "axios"
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
function Auth() {
  const dispatch = useDispatch()

  const handleGoogleAuth = async () => {
    
    try {
      const response = await signInWithPopup(auth,provider)
      const User = response.user
      const name = User.displayName
      const email = User.email
      const result = await axios.post(serverUrl + "/api/auth/google" , {name , email},{
        withCredentials:true
      })
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='min-h-screen overflow-hidden bg-white text-black px-8'>
       

        <main className='max-w-7xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
        
        {/* LEFT CONTENT */}
        <motion.div 
         initial = {{opacity: 0 , x:-60}}
        animate = {{opacity:1 , x:0}}
        transition={{duration:0.7}}
        >
            <h1 className='text-5xl lg:text-6xl font-extrabold leading-tight
              bg-black
              bg-clip-text text-transparent'>
                Unlock Smart <br /> AI Notes
              </h1>
              <motion.button
              onClick={handleGoogleAuth}
              whileHover={{
                y:-10,
                rotateX:8,
                rotateY:-8,
                scale:1.07
              }}
              whileTap={{scale:0.97}}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
               className='mt-10 px-10 py-3 rounded-xl
              flex items-center gap-3
              bg-black
              border border-white/10
              text-white font-semibold text-lg
             '>
                <FcGoogle size={22}/>
                Continue with Google


              </motion.button>

              <p className=' mt-6 max-w-xl text-lg
              bg-gradient-to-br from-gray-700 via-gray-500/80 to-gray-700
              bg-clip-text text-transparent'>
                You get <span className="font-semibold">50 FREE credits</span> to create
            exam notes, project notes, charts, graphs and
            download clean PDFs — instantly using AI.
              </p>
              <p className='mt-4 text-sm text-gray-500'> Start with 50 free credits • Upgrade anytime for more credits • Instant access</p>

        </motion.div>

        {/* RIGHT CONTENT */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
            <Feature icon="" title="50 Free Credits" des="Start with 50 credits to generate notes without paying."/>
             <Feature icon="" title="Exam Notes" des="High-yield, revision-ready exam-oriented notes." />
          <Feature icon="" title="Project Notes" des="Well-structured documentation for assignments & projects." />
          <Feature icon="" title="Charts & Graphs" des="Auto-generated diagrams, charts and flow graphs." />
          <Feature icon="⬇" title="Free PDF Download" des="Download clean, printable PDFs instantly." />

        </div>


        </main>
      
    </div>
  )
}
function Feature({icon , title , des}){
    return(
        <motion.div 
        whileHover={{ y: -12, rotateX: 8, rotateY: -8, scale: 1.05 }}
       transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className='relative rounded-2xl p-6
        bg-black
        backdrop-blur-2xl
        border border-white/10
        
        text-white'
         style={{ transformStyle: "preserve-3d" }}
        >
         
            <div className='relative z-10' style={{ transform: "translateZ(30px)" }}>
                 <div className="text-4xl mb-3">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{des}</p>

            </div>
          


        </motion.div>
    )
}

export default Auth
