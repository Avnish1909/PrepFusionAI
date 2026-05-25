import React from 'react'
import { motion } from "motion/react"
import logo from "../assets/logo.png"
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'

function Footer() {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSignOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            navigate("/auth")

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}

            className='w-full mt-24
            border-t border-gray-800
            px-8 py-10 text-white'

            style={{ background: "rgba(10, 10, 15, 0.95)" }}
        >

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start max-w-7xl mx-auto'>

                <motion.div
                    whileHover={{ rotateX: 6, rotateY: -6 }}
                    className="flex flex-col gap-4 transform-gpu"
                    style={{ transformStyle: "preserve-3d" }}
                >

                    <div
                        className="flex items-center gap-3 cursor-pointer"
                        style={{ transform: "translateZ(20px)" }}
                    >

                       

                       <span
                        className="
                        text-lg font-semibold
                        text-[rgb(229,9,20)]
                        "
                        style={{
                            textShadow: "0 6px 18px rgba(0,0,0,0.4)"
                        }}
                    >
                        PrepFusion <span className="text-white">AI</span>
                    </span>

                    </div>

                    <p className="text-sm text-gray-300 max-w-sm">
                        PrepFusion AI helps students generate exam-focused notes,
                        doing real time collaborative coding and much more.
                    </p>

                </motion.div>

                {/* Quick Links */}
                <div className='text-center'>

                    <h1 className='text-sm font-semibold text-white mb-4'>
                        Quick Links
                    </h1>

                    <ul className='space-y-2 text-sm'>

                        <li
                            onClick={() => navigate("/notes")}
                            className='text-gray-300 hover:text-white transition-colors cursor-pointer'
                        >
                            Notes
                        </li>

                        <li
                            onClick={() => navigate("/history")}
                            className='text-gray-300 hover:text-white transition-colors cursor-pointer'
                        >
                            History
                        </li>

                        <li
                            onClick={() => navigate("/editor")}
                            className='text-gray-300 hover:text-white transition-colors cursor-pointer'
                        >
                            Coding
                        </li>

                    </ul>

                </div>

                {/* Support */}
                <div className='text-center'>

                    <h1 className='text-sm font-semibold text-white mb-4'>
                        Support & Account
                    </h1>

                    <ul className='space-y-2 text-sm'>

                        <li
                            onClick={handleSignOut}
                            className='text-red-400 hover:text-red-300 transition-colors cursor-pointer'
                        >
                            SignOut
                        </li>

                        <li className='text-gray-300 hover:text-white transition-colors'>
                            avnish1909@gmail.com
                        </li>

                    </ul>

                </div>

            </div>

            <div className="my-6 h-px bg-gray-800 max-w-7xl mx-auto" />

            <p className='text-center text-xs text-gray-500'>
                © {new Date().getFullYear()} ExamNotes AI. All rights reserved.
            </p>

        </motion.div>
    )
}

export default Footer