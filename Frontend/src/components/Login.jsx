import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
    const [state, setState] = useState('Login')
    const {setMount, backendUrl, setToken, setUser} = useContext(AppContext)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async(e) =>{
      e.preventDefault();
      try{
        if(state == 'Login'){
          const {data} = await axios.post(backendUrl+'/api/user/login', {
            email, password
          })

          if(data.success){
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem('token', data.token)
            setMount(false)
          }else{
            toast.error(data.message)
          }
        }else{
          const {data} = await axios.post(backendUrl+'/api/user/signUp', {
            name, email, password
          })

          if(data.success){
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem('token', data.token)
            setMount(false)
          }else{
            toast.error(data.message)
          }
        }
      }catch(error){
        toast.error(error.message)
      }
    }

    useEffect(()=>{
        document.body.style.overflow = 'hidden';

        return()=>{
            document.body.style.overflow = 'unset';
        }
    },[])
    
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
      
      <motion.form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'
      initial={{opacity:0.2, y:50}}
      transition={{duration:0.3}}
      whileInView= {{opacity:1, y:0}}
      viewport={{once:true}}
      >
        <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
        <p className='text-sm text-center mt-2'>Welcome! Please Sign in to continue.</p>

        {(state!='Login')?
        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-5'>
            <img className='h-4' src={assets.profile_icon}/>
            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='FullName' required/>
        </div>
        :''}
        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
            <img src={assets.email_icon}/>
            <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='Email Id' required/>
        </div>
        <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
            <img src={assets.lock_icon}/>
            <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' required/>
        </div>

        <p className='ml-2 text-sm text-blue-600 my-5 cursor-pointer'>Forgot Password?</p>

        <button className='bg-gray-800 w-full text-white py-2 rounded-full'>{state == 'Login'? 'Login': 'Create Account'}</button>
        {(state == 'Login')?
        <p onClick={()=> setState('Sign Up')} className='mt-5 text-center'>Don't have an account? <span className='text-blue-600 cursor-pointer'>Sign Up</span></p>
        :
        <p onClick={()=> setState('Login')} className='mt-5 text-center'>Already have an account? <span className='text-blue-600 cursor-pointer'>Login</span></p>
        }
        <img onClick={()=>setMount(false)} src={assets.cross_icon} className='absolute top-5 right-5 cursor-pointer'/>
      </motion.form>
    </div>
  )
}

export default Login
