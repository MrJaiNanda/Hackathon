import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom'

const LoginPage = () => {
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");


  return (
    <>    
    <main className='h-screen relative bg-red-50'>
      {/* Login and Register Toggle */}
    <div id='LoginToggle' className='h-150 w-4xl bg-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg justify-around text-white font-Anton'>
        <div className='h-30 w-full flex items-center justify-center'>
         <Link to ="/login" relative='route' className='text-5xl h-30 w-1/2 flex items-center justify-center bg-white text-red-600'>LOGIN </Link>   
          <Link to ="/register" relative='route' className='text-5xl w-1/2 h-30 flex items-center justify-center border-b-2 border-white'>SIGN UP </Link>
        </div>
        {/* Login Form */}
        <div id='LoginForm' className="h-30">
          <input type="text" name="email" id="email" placeholder="Email Address" className="w-full h-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input type="password" name="password" id="password" placeholder="Password" className="w-full h-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div className='flex items-center justify-center relative'>
          <button className='absolute top-67 bg-white text-red-600 px-6 py-2 rounded-md hover:bg-red-300 transition duration-300' type="submit">Login</button>
        </div>
    </div>
    </main> 
      </>
    )
  }

export default LoginPage
