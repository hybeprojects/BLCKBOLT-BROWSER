import React from 'react'
import { motion } from 'framer-motion'

export default function SplashScreen(){
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-bgDark to-gray-900">
      <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{duration:1}} className="text-center">
        <img src="/logo.png" alt="BLCKBOLT" className="mx-auto w-28 mb-4" />
        <h1 className="text-2xl tracking-wide">BLCKBOLT</h1>
      </motion.div>
    </div>
  )
}
