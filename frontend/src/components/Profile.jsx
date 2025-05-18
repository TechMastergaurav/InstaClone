import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import axios from 'axios'
import { setAuthUser } from '@/redux/authSlice'
import { useNavigate } from 'react-router-dom'

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth);
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(user?.profilePicture || '');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('bio', bio);
      if (file) formData.append('profilePicture', file);
      const res = await axios.post('http://localhost:8000/api/v1/user/profile/edit', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        setSuccess(true);
        navigate(`/profile/${user._id}`);
      }
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-8">Please log in to view your profile.</div>;

  return (
    <div className="max-w-md mx-auto mt-12 bg-white border border-gray-200 rounded-xl p-8">
      <div className="flex flex-col items-center gap-4 mb-6">
        <label htmlFor="profilePicInput" className="cursor-pointer">
          <Avatar className="w-24 h-24 border border-gray-200">
            <AvatarImage src={imagePreview} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="text-xs text-blue-500 mt-1 text-center">Change Photo</div>
        </label>
        <div className="text-center">
          <h1 className="font-bold text-2xl">{user.username}</h1>
          <span className="text-gray-500 text-sm">{user.email}</span>
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1">Bio</label>
        <textarea
          className="w-full border border-gray-300 rounded p-2 text-base focus:outline-none focus:ring"
          rows={3}
          value={bio}
          onChange={e => setBio(e.target.value)}
          placeholder="Write something about yourself..."
        />
      </div>
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Bio'}
      </button>
      {success && <div className="text-green-600 mt-4 text-center text-base font-semibold">Bio updated!</div>}
    </div>
  )
}

export default Profile