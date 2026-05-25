import React, { useState } from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TopicForm from '../components/TopicForm'
import Sidebar from '../components/Sidebar'
import FinalResult from '../components/FinalResult'
function Notes() {
  const navigate = useNavigate()
  const { userData } = useSelector((state) => state.user)
  const credits = userData.credits
  const [loading,setLoading]= useState(false)
  const [result , setResult] = useState(null)
  const [error,setError] = useState("")

  return (
    <div className='min-h-screen bg-black px-6 py-8'>
     


      <motion.div 
          className="mb-12">
        <TopicForm loading={loading} setResult={setResult} setLoading={setLoading} setError={setError}/>
      </motion.div>


      {loading && (
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="text-center text-black font-medium mb-6"
          >
            Generating exam-focused notes…
          </motion.div>
        )}

        {error && (
          <div className="mb-6 text-center text-red-600 font-medium">
            {error}
          </div>
        )}

    {!result && <motion.div whileHover={{ scale: 1.02 }}
            className="
              h-64
              rounded-2xl
              flex flex-col items-center justify-center
              bg-black/60 backdrop-blur-lg
              border border-dashed border-gray-300
              text-white-500
              shadow-inner
            ">
               <span className="text-4xl mb-3">📘</span>
            <p className="text-sm">
              Generated notes will appear here
            </p>

     </motion.div>}


    {result && <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
     className='flex flex-col
      lg:grid lg:grid-cols-4
      gap-6'>

        <div className='lg:col-span-1'>
          <Sidebar result={result}/>


        </div>

        <div className='lg:col-span-3
        rounded-2xl
        bg-white
        shadow-[0_15px_40px_rgba(0,0,0,0.15)]
        p-6'>
          <FinalResult result={result}/>

        </div>


    </motion.div>
}
    </div>
  )
}

export default Notes
