import { Input } from './ui/input'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const logInHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("https://instaclone-5pre.onrender.com/api/v1/user/login", input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/")
                toast.success(res.data.message)
                setInput({
                    email: "",
                    password: "",
                })
            }
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }
    return (
      <div className="flex min-h-screen">
        {/* Left: Image or gradient */}
        <div className="flex-1 bg-gradient-to-br from-pink-200 to-blue-200 flex items-center justify-center">
          <img
            src="https://www.instagram.com/static/images/homepage/home-phones.png/43cc71bb1b43.png"
            alt="App preview"
            className="max-h-[600px] w-auto"
          />
        </div>
        {/* Right: Login Form */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <form onSubmit={logInHandler} className="w-full max-w-md shadow-xl rounded-xl p-8 flex flex-col gap-5">
            <div className="mb-4">
              <h1 className="text-center font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-2">ChitChat</h1>
              <p className="text-sm text-center text-gray-500">Login to see photos and videos of your friends</p>
            </div>
            <div className='text-left'>
              <span className='font-medium'>Email</span>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
              />
              <span className='font-medium'>Password</span>
              <Input
                type="password"
                name="password"
                value={input.password}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
              />
            </div>
            {
              loading?(
                <button type="button" disabled className="w-full py-3 rounded font-semibold text-lg text-[#dd2a7b] border border-[#dd2a7b] bg-white opacity-80 cursor-not-allowed flex items-center justify-center">
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                  Please wait
                </button>
              ):(
                <button type="submit" className="w-full py-3 rounded font-semibold text-lg text-[#dd2a7b] border border-[#dd2a7b] bg-white hover:bg-[#fbeaf5] transition">Login</button>
              )
            }
            <span className="text-center">Don't have an account? <Link to="/signup" className="text-pink-500 font-semibold">Signup</Link></span>
          </form>
        </div>
      </div>
    )
}

export default Login