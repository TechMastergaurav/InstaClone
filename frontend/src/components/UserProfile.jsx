import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Bookmark, Grid, User, Video } from 'lucide-react';

function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useSelector(store => store.auth);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://instaclone-5pre.onrender.com/api/v1/user/${id}/profile`, { withCredentials: true });
        if (res.data.success) {
          setProfile(res.data.user);
          setIsFollowing(res.data.user.followers.includes(currentUser?._id));
        }
      } catch (error) {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`https://instaclone-5pre.onrender.com/api/v1/post/user/${id}`, { withCredentials: true });
        if (res.data.success) {
          setPosts(res.data.posts);
        }
      } catch (error) {}
    };
    fetchProfile();
    fetchPosts();
  }, [id, currentUser?._id]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const res = await axios.post(`https://instaclone-5pre.onrender.com/api/v1/user/followorunfollow/${id}`, {}, { withCredentials: true });
      if (res.data.success) {
        setIsFollowing(prev => !prev);
        setProfile(prev => ({
          ...prev,
          followers: isFollowing
            ? prev.followers.filter(f => f !== currentUser._id)
            : [...prev.followers, currentUser._id],
        }));
      }
    } catch (error) {}
    finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-center">User not found.</div>;

  const isOwnProfile = currentUser && currentUser._id === profile._id;

  // Tab content logic
  let tabContent;
  if (activeTab === 'posts') {
    if (posts.length === 1) {
      tabContent = (
        <div className="flex flex-col items-center gap-8">
          <div className="w-full flex justify-center">
            <div className="w-[400px] h-[400px] bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              <img src={posts[0].image} alt="post" className="object-cover w-full h-full" />
            </div>
          </div>
        </div>
      );
    } else if (posts.length > 1) {
      tabContent = (
        <div className="grid grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post._id} className="aspect-square overflow-hidden rounded bg-gray-100 flex items-center justify-center">
              <img src={post.image} alt="post" className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      );
    } else {
      tabContent = (
        <div className="text-center text-gray-400 py-10">No posts yet.</div>
      );
    }
  } else {
    tabContent = (
      <div className="text-center text-gray-400 py-10">No content yet.</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Profile Card */}
      <div className="flex flex-col items-center gap-6 mb-10">
        <Avatar className="w-40 h-40 border-4 border-white shadow-lg">
          <AvatarImage src={profile.profilePicture} alt="profile" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-2xl">{profile.username}</h1>
            {isOwnProfile ? (
              <>
                <button className="px-4 py-1 rounded font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => navigate('/profile')}>Edit Profile</button>
                <button className="px-4 py-1 rounded font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300">View archive</button>
                <button className="px-4 py-1 rounded font-semibold text-sm bg-gray-200 text-gray-700 hover:bg-gray-300">Ad tools</button>
              </>
            ) : (
              <>
                <button
                  onClick={handleFollow}
                  disabled={followLoading}
                  className={`px-4 py-1 rounded font-semibold text-sm border transition
                    ${isFollowing
                      ? 'bg-white text-black border-[#dbdbdb] hover:bg-[#fafafa]'
                      : 'bg-[#0095F6] text-white border-[#0095F6] hover:bg-[#1877f2]'}
                    disabled:opacity-50`}
                  style={{ minWidth: 100 }}
                >
                  {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                </button>
                {isFollowing && (
                  <button className="px-4 py-1 rounded font-semibold text-sm bg-white text-black border border-[#dbdbdb] ml-2 hover:bg-[#fafafa] transition">Message</button>
                )}
              </>
            )}
          </div>
          <div className="flex gap-8 text-md mb-2">
            <span><b>{posts.length}</b> posts</span>
            <span><b>{profile.followers.length}</b> followers</span>
            <span><b>{profile.following.length}</b> following</span>
          </div>
          <div className="text-center text-gray-700 text-base mt-2">{profile.bio || 'Bio here...'}</div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-t border-gray-200 mb-6" />
      <div className="flex items-center justify-center gap-10 text-md mb-8">
        <span className={`flex items-center gap-2 py-3 cursor-pointer ${activeTab === 'posts' ? 'font-bold border-t-2 border-black' : 'text-gray-500'}`} onClick={() => setActiveTab('posts')}>
          <Grid size={18} /> POSTS
        </span>
        <span className={`flex items-center gap-2 py-3 cursor-pointer ${activeTab === 'saved' ? 'font-bold border-t-2 border-black' : 'text-gray-500'}`} onClick={() => setActiveTab('saved')}>
          <Bookmark size={18} /> SAVED
        </span>
        <span className={`flex items-center gap-2 py-3 cursor-pointer ${activeTab === 'tagged' ? 'font-bold border-t-2 border-black' : 'text-gray-500'}`} onClick={() => setActiveTab('tagged')}>
          <User size={18} /> TAGGED
        </span>
        <span className={`flex items-center gap-2 py-3 cursor-pointer ${activeTab === 'reels' ? 'font-bold border-t-2 border-black' : 'text-gray-500'}`} onClick={() => setActiveTab('reels')}>
          <Video size={18} /> REELS
        </span>
      </div>
      {/* Tab Content */}
      {tabContent}
    </div>
  );
}

export default UserProfile; 
