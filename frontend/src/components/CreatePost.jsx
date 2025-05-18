import React, { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';

function  CreatePost ({ open, setOpen })  {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const{user} = useSelector(store=>store.auth)
  const{posts} = useSelector(store=>store.post)
  const dispatch = useDispatch();
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) { // Check if file is an image
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    } 
    
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if(imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/v1/post/addpost', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]))
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response.data.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 font-semibold text-xs'>Bio here...</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className='focus-visible:ring-transparent border-none'
          placeholder="Write a caption..."
        />
        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center'>
            <img src={imagePreview} alt='preview_img' className='object-cover h-full rounded-md' />
          </div>
        )}
        <Input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#0095F6] hover:bg-[#8ecaf2]'>
          Select from computer
        </Button>
        {imagePreview && (
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} type="submit" className="w-full">
              Post
            </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;


