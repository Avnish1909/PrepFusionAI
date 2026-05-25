import React from 'react'
import Navbar from '../components/Navbar'
import { motion } from "motion/react"
import img from "../assets/img1.png"
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'
import graph from "../assets/graph.svg"
import diagram from "../assets/diagram.svg"
import notes from "../assets/notes.svg"
import project from "../assets/project.svg"

function Home() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen overflow-hidden bg-white text-black' style={{background: "rgb(0, 0, 0)"}}>
     
      {/* top */}
      <section className='max-w-7xl mx-auto px-6 md:px-8 pt-24'>

  <div
    className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center
rounded-[10px]
px-8 md:px-12 lg:px-20
py-16
bg-gradient-to-r from-[#8E0E00] to-[#1F1C18]
overflow-hidden'


  >

    {/* Left Side */}

    <div>

      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}

        whileHover={{ rotateX: 6, rotateY: -6 }}

        className="transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >

        <motion.h1

          className="text-5xl lg:text-6xl
          font-extrabold leading-tight
          text-white"

          whileHover={{ y: -4 }}

          style={{
            transform: "translateZ(40px)",
          }}
        >

          Create Code<br /> Conquer

        </motion.h1>

        <motion.p

          whileHover={{ y: -2 }}

          className='mt-6 max-w-xl
          text-lg text-blue-100 leading-relaxed'

          style={{
            transform: "translateZ(40px)",
          }}
        >

          Genereate exam-focused notes, Study using specific Files using RAG,do real time collaborative coding and much more with PrepFusion AI.

        </motion.p>

      </motion.div>

      <motion.button

        onClick={() => navigate("/notes")}

        whileHover={{
          scale: 1.07
        }}

        whileTap={{ scale: 0.97 }}

        className='mt-10 px-10 py-3 rounded-full
        flex items-center gap-3
        bg-white text-blue-700
        font-semibold text-lg
        shadow-lg'

      >

        Get Started

      </motion.button>

    </div>

    {/* Right Side */}

    <motion.div

      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}

      whileHover={{
        y: -12,
        rotateX: 8,
        rotateY: -8,
        scale: 1.05,
      }}

      className="transform-gpu"

      style={{ transformStyle: "preserve-3d" }}
    >

      <div className='overflow-hidden'>

        <img
          src={img}
          alt="img"
          className='w-full max-w-xl mx-auto rounded-[10px]'
          style={{ transform: "translateZ(35px)" }}
        />

      </div>

    </motion.div>

  </div>

</section>

      {/* bottom */}
      <section className='max-w-6xl mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-4 gap-10'>

  <Feature
    image={notes}
    title="Exam Notes"
    
  />

  <Feature
    image={project}
    title="Coding"
   
  />

  <Feature
    image={diagram}
    title="Diagrams"
    
  />

  <Feature
    image={graph}
    title="PDF Download"
    
  />

</section>
      <Footer/>

    </div>
  )
}

function Feature({ image, title, des }) {

    return (

        <motion.div
            whileHover={{ y: -12, rotateX: 8, rotateY: -8, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}

            className='relative rounded-2xl p-6
            border border-white/10
            text-white'

            style={{ transformStyle: "preserve-3d" }}
        >

            <div
                className='relative z-10 flex flex-col items-center text-center'
                style={{ transform: "translateZ(30px)" }}
            >

                <img
                    src={image}
                    alt={title}
                    className='w-16 h-16 mb-5 object-contain brightness-0 invert'
                />

                <h3 className="text-lg font-semibold mb-2">
                    {title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">
                    {des}
                </p>

            </div>

        </motion.div>

    )
}
export default Home
