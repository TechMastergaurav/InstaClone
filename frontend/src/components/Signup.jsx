import { Input } from './ui/input'
import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: "",
    })
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const signUpHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8000/api/v1/user/register", input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCrendentials: true
            })
            if (res.data.success) {
                navigate("/login")
                toast.success(res.data.message)
                setInput({
                    username: "",
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
        {/* Right: Signup Form */}
        <div className="flex-1 flex flex-col items-center justify-center bg-white">
          <form onSubmit={signUpHandler} className="w-full max-w-md shadow-xl rounded-xl p-8 flex flex-col gap-5">
            <div className="mb-4">
              <h1 className="text-center font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-2">ChitChat</h1>
              <p className="text-sm text-center text-gray-500">Signup to see photos and videos of your friends</p>
            </div>
            <div className='text-left'>
              <span className='font-medium'>Username</span>
              <Input
                type="text"
                name="username"
                value={input.username}
                onChange={changeEventHandler}
                className="focus-visible:ring-transparent my-2"
              />
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
                <button type="button" disabled className="w-full py-3 rounded font-semibold text-lg text-white bg-gradient-to-r from-[#f58529] via-[#dd2a7b] via-40% via-[#8134af] to-[#515bd4] shadow-lg opacity-80 cursor-not-allowed flex items-center justify-center">
                  <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                  Please wait
                </button>
              ):(
                <button type="submit" className="w-full py-3 rounded font-semibold text-lg text-white bg-gradient-to-r from-[#f58529] via-[#dd2a7b] via-40% via-[#8134af] to-[#515bd4] shadow-lg hover:brightness-110 transition">Signup</button>
              )
            }
            <span className="text-center">Already have an account? <Link to="/login" className="text-pink-500 font-semibold">Login</Link></span>
          </form>
        </div>
      </div>
    )
}

export default Signup