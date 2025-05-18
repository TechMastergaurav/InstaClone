import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode, Send } from 'lucide-react';
import Messages from './Messages';
import { setMessages } from '@/redux/chatSlice';
import axios from 'axios';

function ChatPage() {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const sendMessageHandler = async (recieverId) => {
    try {
      const res = await axios.post(
        `https://instaclone-5pre.onrender.com//api/v1/message/send/${recieverId}`,
        { textMessage },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...(messages || []), res.data.newMessage]));
        setTextMessage("");
        inputRef.current?.focus();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    dispatch(setSelectedUser(null));
  }, [dispatch]);

  return (
    <div className="flex ml-[16%] h-screen bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef]">
      {/* Classy Sidebar */}
      <section className="w-[320px] border-r border-gray-200 bg-white/90 shadow-lg flex flex-col rounded-r-3xl">
        <h1 className="font-bold text-2xl px-6 py-6 mb-2 text-gray-800 tracking-tight">{user?.username}</h1>
        <hr className="mb-2 border-gray-200" />
        <div className="flex-1 overflow-y-auto flex flex-col gap-1 px-2 pb-4">
          {suggestedUsers?.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser._id);
            const isSelected = selectedUser?._id === suggestedUser._id;
            return (
              <div
                key={suggestedUser._id}
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
                className={`flex gap-3 items-center p-4 cursor-pointer transition rounded-xl mb-1 hover:bg-blue-50/80 border border-transparent ${isSelected ? 'border-blue-400 bg-blue-100/80 shadow' : ''}`}
                style={{ minHeight: 64 }}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 border-2 border-gray-200">
                    <AvatarImage src={suggestedUser?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-lg text-gray-800">{suggestedUser?.username}</span>
                  <span className={`text-xs font-bold ${isOnline ? 'text-green-600' : 'text-red-500'}`}>{isOnline ? 'online' : 'offline'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Chat Area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col h-full min-h-0 relative bg-gradient-to-br from-white to-blue-50">
          <div className="flex gap-4 items-center px-6 py-4 border-b border-gray-200 sticky top-0 bg-white/90 z-10 shadow-sm rounded-t-3xl">
            <Avatar className="w-12 h-12">
              <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-gray-800">{selectedUser?.username}</span>
              <span className={`text-xs font-bold ${onlineUsers.includes(selectedUser._id) ? 'text-green-600' : 'text-red-500'}`}>{onlineUsers.includes(selectedUser._id) ? 'online' : 'offline'}</span>
            </div>
            <button
              className="ml-auto px-4 py-2 text-sm text-gray-500 hover:text-black border border-gray-300 rounded transition-colors bg-white/80"
              onClick={() => dispatch(setSelectedUser(null))}
            >
              Close Chat
            </button>
          </div>

          <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-blue-50 to-white">
            <Messages selectedUser={selectedUser} />
          </div>

          <div className="flex items-center border-t border-t-gray-200 px-6 py-4 bg-white/90 rounded-b-3xl shadow-inner">
            <Input
              ref={inputRef}
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-3 focus-visible:ring-blue-200 rounded-full px-5 py-3 text-base bg-blue-50 border border-blue-100"
              placeholder="Type your message..."
              onKeyDown={e => {
                if (e.key === 'Enter' && textMessage.trim()) {
                  sendMessageHandler(selectedUser._id);
                }
              }}
            />
            <Button
              className="rounded-full bg-blue-500 hover:bg-blue-600 text-white p-3 shadow-md"
              onClick={() => sendMessageHandler(selectedUser._id)}
              disabled={!textMessage.trim()}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
          <MessageCircleCode className="w-32 h-32 my-4 text-blue-200" />
          <h1 className="text-2xl font-semibold text-gray-500">Your Messages</h1>
          <span className="text-md text-gray-400">Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
}

export default ChatPage;


