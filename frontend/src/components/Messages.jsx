import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useGetAllMessages } from '@/hooks/useGetAllMessages';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

const Messages = ({ selectedUser }) => {
  useGetAllMessages();
  const { messages } = useSelector(store => store.chat);
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMessage = async (messageId) => {
    try {
      setIsDeleting(true);
      const res = await axios.delete(
        `http://localhost:8000/api/v1/message/delete/${messageId}`,
        { withCredentials: true }
      );
      
      if (res.data.success) {
        // Update messages in Redux store
        const updatedMessages = messages.filter(msg => msg._id !== messageId);
        dispatch(setMessages(updatedMessages));
        toast.success('Message deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(error.response?.data?.message || 'Error deleting message');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='overflow-y-auto flex-1 p-4'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
          <Avatar>
            <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className='h-8 my-2' variant='secondary'>View profile</Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        {messages && messages.map((msg) => {
          const isSentByUser = msg.senderId === user?._id;
          return (
            <div
              key={msg._id}
              className={`flex ${isSentByUser ? 'justify-end' : 'justify-start'} items-center group`}
              style={isSentByUser ? { marginRight: '40px' } : {}}
            >
              {isSentByUser && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-full bg-white shadow-sm"
                    >
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Message</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this message? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                      <Button variant="outline" onClick={() => document.querySelector('[role="dialog"] button[aria-label="Close"]').click()}>
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          deleteMessage(msg._id);
                          document.querySelector('[role="dialog"] button[aria-label="Close"]').click();
                        }}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              <div className={`relative max-w-[70%] p-3 rounded-lg ${
                isSentByUser 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;