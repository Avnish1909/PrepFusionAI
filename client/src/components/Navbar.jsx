import React, { useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData } from '../redux/userSlice'
import { useNavigate, NavLink } from 'react-router-dom'

function Navbar() {

    const { userData } = useSelector((state) => state.user)
    const credits = userData?.credits || 0

    const [showCredits, setShowCredits] = useState(false)
    const [showProfile, setShowProfile] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleSignOut = async () => {
        try {

            await axios.get(
                serverUrl + "/api/auth/logout",
                { withCredentials: true }
            )

            dispatch(setUserData(null))
            navigate("/auth")

        } catch (error) {
            console.log(error)
        }
    }

    return (

        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}

            className='sticky top-0 z-50
            flex items-center justify-between
            px-6 md:px-10 py-4
            
            text-white'

            style={{ background: "rgb(0, 0, 0)" }}
        >

            {/* Logo */}

            <div
                onClick={() => navigate("/")}
                className='cursor-pointer'
            >

                <p
                className='
                text-2xl md:text-3xl
                font-extrabold
                tracking-wide
                bg-gradient-to-r
                from-[#8E0E00]
                to-[#1F1C18]
                bg-clip-text
                text-transparent
                inline-block
                '
                >
                PrepFusion <span className='text-white'>AI</span>
                </p>

            </div>

            {/* Desktop Menu */}

            <ul className='hidden md:flex items-center gap-8 text-sm font-medium'>

                <NavLink to="/">
                    {({ isActive }) => (
                        <li
                            className={`py-1 transition-all cursor-pointer text-[rgb(200,200,200)] font-bold
                            ${isActive
                                    ? 'border-b-2 border-white text-primary'
                                    : 'text-black-300 hover:text-white'
                                }`}
                        >
                            HOME
                        </li>
                    )}
                </NavLink>

                <NavLink to="/notes">
                    {({ isActive }) => (
                        <li
                            className={`py-1 transition-all cursor-pointer text-[rgb(200,200,200)] font-bold
                            ${isActive
                                    ? 'border-b-2 border-white text-primary'
                                    : 'text-black-300 hover:text-white'
                                }`}
                        >
                            NOTES
                        </li>
                    )}
                </NavLink>

                <NavLink to="/smart-lookup">
                    {({ isActive }) => (
                        <li
                            className={`py-1 transition-all cursor-pointer text-[rgb(200,200,200)] font-bold
                            ${isActive
                                    ? 'border-b-2 border-white text-primary'
                                    : 'text-black-300 hover:text-white'
                                }`}
                        >
                            SMART LOOKUP
                        </li>
                    )}
                </NavLink>

               
                
                <NavLink to="/editor">
                    {({ isActive }) => (
                        <li
                            className={`py-1 transition-all cursor-pointer font-bold
                            ${isActive
                                    ? 'border-b-2 border-white text-primary'
                                    : 'text-gray-300 hover:text-white'
                                }`}
                        >
                            CODE EDITOR
                        </li>
                    )}
                </NavLink>

                 <NavLink to="/history">
                    {({ isActive }) => (
                        <li
                            className={`py-1 transition-all cursor-pointer text-[rgb(200,200,200)] font-bold
                            ${isActive
                                    ? 'border-b-2 border-white text-primary'
                                    : 'text-black-300 hover:text-white'
                                }`}
                        >
                            HISTORY
                        </li>
                    )}
                </NavLink>

            </ul>

            {/* Right Side */}

            <div className='flex items-center gap-4'>

                {/* Credits */}

                <div className='relative hidden md:block'>

                    <div
                        onClick={() => {
                            setShowCredits(!showCredits)
                            setShowProfile(false)
                        }}

                        className='flex items-center gap-2
                        border border-gray-700
                        px-4 py-2 rounded-full
                        cursor-pointer
                        hover:border-primary transition-all'
                    >

                        <span>💠</span>

                        <span className='font-medium'>
                            {credits}
                        </span>

                        <span className='text-xs font-bold'>
                            ＋
                        </span>

                    </div>

                    <AnimatePresence>

                        {showCredits && (

                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 10, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}

                                className='absolute right-0 mt-3
                                w-64 bg-[#111]
                                border border-gray-800
                                rounded-2xl p-4 shadow-2xl'
                            >

                                <h4 className='font-semibold mb-1 text-white'>
                                    Buy Credits
                                </h4>

                                <p className='text-sm text-gray-400 mb-4'>
                                    Generate AI notes, diagrams & PDFs.
                                </p>

                                <button
                                    onClick={() => {
                                        setShowCredits(false)
                                        navigate("/pricing")
                                    }}

                                    className='w-full py-2 rounded-xl
                                    bg-primary text-black font-medium
                                    hover:opacity-90 transition-all'
                                >
                                    Buy More Credits
                                </button>

                            </motion.div>

                        )}

                    </AnimatePresence>

                </div>

                {/* Profile */}

                <div className='relative hidden md:block'>

                    <div
                        onClick={() => {
                            setShowProfile(!showProfile)
                            setShowCredits(false)
                        }}

                        className='w-10 h-10
                        flex items-center justify-center
                        rounded-full
                        bg-gray-800 border border-gray-700
                        cursor-pointer font-semibold
                        hover:border-primary transition-all'
                    >

                        {userData?.name?.slice(0, 1).toUpperCase()}

                    </div>

                    <AnimatePresence>

                        {showProfile && (

                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 10, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}

                                className='absolute right-0 mt-3
                                w-52 bg-[#111]
                                border border-gray-800
                                rounded-2xl p-2 shadow-2xl'
                            >

                                <MenuItem
                                    text="History"
                                    onClick={() => {
                                        setShowProfile(false)
                                        navigate("/history")
                                    }}
                                />

                                <MenuItem
                                    text="Pricing"
                                    onClick={() => {
                                        setShowProfile(false)
                                        navigate("/pricing")
                                    }}
                                />

                                <div className='h-px bg-gray-800 my-1' />

                                <MenuItem
                                    text="Sign Out"
                                    red
                                    onClick={handleSignOut}
                                />

                            </motion.div>

                        )}

                    </AnimatePresence>

                </div>

                {/* Mobile Menu Button */}

                <button
                    onClick={() => setShowMenu(true)}
                    className='md:hidden text-2xl'
                >
                    ☰
                </button>

                {/* Mobile Menu */}

                <div
                    className={`md:hidden fixed top-0 right-0 bottom-0
                    bg-[#0a0a0f] z-50 overflow-hidden transition-all duration-300
                    ${showMenu ? 'w-full' : 'w-0'}`}
                >

                    <div className='flex items-center justify-between px-6 py-6'>

                        <p className='text-2xl font-semibold text-[rgb(229,9,20)]'>
                            PerpFusion <span className='text-white'>AI</span>
                        </p>

                        <button
                            onClick={() => setShowMenu(false)}
                            className='text-3xl text-white'
                        >
                            ×
                        </button>

                    </div>

                    <ul className='flex flex-col gap-5 px-6 mt-10 text-lg font-medium'>

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/"
                        >
                            <p className='text-gray-300 hover:text-white'>
                                HOME
                            </p>
                        </NavLink>

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/notes"
                        >
                            <p className='text-gray-300 hover:text-white'>
                                NOTES
                            </p>
                        </NavLink>

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/smart-lookup"
                        >
                            <p className='text-gray-300 hover:text-white'>
                                SMART LOOKUP
                            </p>
                        </NavLink>
                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/editor"
                        >
                            <p className='text-gray-300 hover:text-white'>
                                CODE EDITOR
                            </p>
                        </NavLink>

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/history"
                        >
                            <p className='text-gray-300 hover:text-white'>
                                HISTORY
                            </p>
                        </NavLink>

                        <NavLink
                            onClick={() => setShowMenu(false)}
                            to="/pricing"
                        >
                            <p className='text-gray-300 hover:text-white'>
                                PRICING
                            </p>
                        </NavLink>

                        <p
                            onClick={handleSignOut}
                            className='text-red-400 cursor-pointer'
                        >
                            SIGN OUT
                        </p>

                    </ul>

                </div>

            </div>

        </motion.div>

    )
}

/* Menu Item */

function MenuItem({ onClick, text, red }) {

    return (

        <div
            onClick={onClick}

            className={`px-4 py-2 text-sm rounded-xl
            cursor-pointer transition-all
            ${red
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
        >

            {text}

        </div>

    )
}

export default Navbar