import { Heart, Home, LogOut, MessageCircle, PlusIcon, PlusSquare, Search, TrendingUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import axios from 'axios'
import CreatePost from './CreatePost'

import React, { useState } from 'react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import store from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'
import { setPosts, setSelectedPost } from '@/redux/postSlice'

function NotificationDropdown() {
  const { notifications } = useSelector(store => store.notification || { notifications: [], unreadCount: 0 });
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <Heart />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 font-bold border-b">Notifications</div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-400">No notifications</div>
          ) : (
            notifications.map((n, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border-b hover:bg-gray-50">
                <img src={n.from?.profilePicture} alt="avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <span className="font-semibold">{n.from?.username}</span>
                  {n.type === "like" && " liked your post"}
                  {n.type === "follow" && " started following you"}
                  {n.type === "message" && " sent you a message"}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function MessageDropdown() {
  // Mock data for demonstration; replace with real Redux state or props
  const recentMessages = [
    {
      from: { username: 'aryav_022', profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg' },
      text: 'Hey! How are you?',
      unread: true,
    },
    {
      from: { username: 'mishragaurav_03', profilePicture: 'https://randomuser.me/api/portraits/men/33.jpg' },
      text: 'Let\'s catch up soon!',
      unread: false,
    },
  ];
  const unreadCount = recentMessages.filter(m => m.unread).length;
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        <MessageCircle />
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-4 font-bold border-b">Messages</div>
          {recentMessages.length === 0 ? (
            <div className="p-4 text-gray-400">No messages</div>
          ) : (
            recentMessages.map((m, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border-b hover:bg-gray-50 cursor-pointer">
                <img src={m.from.profilePicture} alt="avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <span className="font-semibold">{m.from.username}</span>
                  <div className="text-xs text-gray-600">{m.text}</div>
                </div>
                {m.unread && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function LeftSidebar() {
    const navigate = useNavigate()
    const {user} = useSelector(store => store.auth)
    const dispatch = useDispatch()
    const[open,setOpen] = useState(false);
    const logoutHandler = async() => {
        try{
        const res = await axios.get('http://localhost:8000/api/v1/user/logout',{withCredentials:true});
        if(res.data.success){
          dispatch(setAuthUser(null))
          dispatch(setSelectedPost(null))
          dispatch(setPosts([]))
          navigate("/login");
          toast.success(res.data.message)
        }
        }catch(error){
            toast.error(error.response.data.message)
        }
    }
    const sidebarHandler = (textType) => {
        if(textType === 'Logout') {
          logoutHandler()
        }else if(textType === 'Create'){
           setOpen(true)
        }else if(textType === 'Profile') {
           if (user && user._id) {
             navigate(`/profile/${user._id}`);
           } else {
             navigate('/profile');
           }
        }else if(textType === 'Home') {
           navigate('/');
        }else if(textType === 'Messages'){
          navigate('/chat')
        }
    }
    // Mock notification/message counts for demo
    const unreadNotifications = 2;
    const unreadMessages = 1;
    const sidebarItems = [
      { icon: (
          <div className="relative">
            <Home className="w-7 h-7"/>
          </div>
        ), text: "Home" },
      { icon: <Search className="w-7 h-7"/>, text: "Search" },
      { icon: <TrendingUp className="w-7 h-7"/>, text: "Explore" },
      { icon: (
          <MessageDropdown />
        ), text: "Messages" },
      { icon: (
          <NotificationDropdown />
        ), text: "Notifications" },
      { icon: <PlusSquare className="w-7 h-7"/>, text: "Create" },
      { icon: (
          <Avatar className='w-7 h-7'>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ), text: "Profile" },
      { icon: <LogOut className="w-7 h-7"/>, text: "Logout" },
    ];
  return (
  <div className="fixed top-0 z-10 left-0 px-8 py-10 border-r border-gray-200 bg-white shadow-lg min-w-[260px] h-screen flex flex-col font-[Montserrat]">
    <div className="mb-12">
      <h1
        className="text-4xl font-extrabold italic tracking-wide bg-gradient-to-r from-[#fd5] via-[#f15] to-[#c13584] bg-clip-text text-transparent drop-shadow-md font-[Montserrat,sans-serif]"
        style={{ letterSpacing: '1.5px', padding: '0.5rem 0' }}
      >
        ChitChat
      </h1>
    </div>
    <div className="flex-1 flex flex-col gap-2">
      {sidebarItems.map((item,index)=>{
        return(
          <React.Fragment key={index}>
            <div onClick={()=>sidebarHandler(item.text)} className='flex items-center gap-5 px-4 py-3 rounded-xl cursor-pointer transition-all hover:bg-gradient-to-r hover:from-pink-50 hover:to-yellow-50 hover:shadow-md text-lg font-semibold text-gray-800' style={{fontFamily: 'Montserrat, sans-serif', fontWeight: 500}}>
                {item.icon}
                <span>{item.text}</span>
            </div>
            {(index === 2 || index === 4) && <hr className="my-2 border-gray-200" />}
          </React.Fragment>
        )
      })}
    </div>
    <CreatePost open={open} setOpen={setOpen} />
  </div>
  )
}

export default LeftSidebar