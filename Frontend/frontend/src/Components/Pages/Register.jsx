import { set } from 'mongoose';
import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom'

const RegisterPage = () => {
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
}

  const handleRegister =() => {
    // Handle registration logic here
    fetch("http://localhost:3001/register"), {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password
    })

  }
  return (
    <>    
    <main className='h-screen relative'>
      {/* Login and Register Toggle */}
    <div id='RegisterToggle' className='h-150 w-4xl bg-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-lg justify-around text-white font-Anton'>
        <div id='RegisterToggle' className='h-30 w-full flex items-center justify-center'>
          <Link to ="/login" className='text-5xl border-b-2 border-white h-30 w-1/2 flex items-center justify-center'>LOGIN </Link>
         <Link to ="/register" className='text-5xl h-30 w-1/2 flex items-center justify-center bg-white text-red-600'>SIGN UP</Link>
        </div>
        {/* Register Form */}
          <div id='RegisterForm' className="h-30">
            <input onChange={(e)=>{
              setName(e.target.value)
            }} value={data?.name} type="text" name="name" id="name" placeholder="UserName" className="w-full h-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input onChange={(e)=>{

          }} value={data?.email} type="text" name="email" id="email" placeholder="Email Address" className="w-full h-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
          <input onChange={(e)=>{
            setPassword(e.target.value)
          }} value={data?.password} type="password" name="password" id="password" placeholder="Password" className="w-full h-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        {/* Register Button */}
        <div className='flex items-center justify-center relative'>
          <button className='absolute top-67 bg-white text-red-600 px-6 py-2 rounded-md hover:bg-red-300 transition duration-300' type="submit">Register</button>
        </div>
    </div>
    </main>
    </>
  )
}

export default RegisterPage
