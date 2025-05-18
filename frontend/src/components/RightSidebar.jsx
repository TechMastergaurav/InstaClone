import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setSuggestedUsers } from '@/redux/authSlice'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Link } from 'react-router-dom'

function RightSidebar() {
  const dispatch = useDispatch();
  const { suggestedUsers = [], user } = useSelector(store => store.auth);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get('https://instaclone-5pre.onrender.com/api/v1/user/suggested', { withCredentials: true });
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.error('Error fetching suggested users:', error);
        dispatch(setSuggestedUsers([]));
      }
    };
    fetchSuggestedUsers();
  }, [dispatch]);

  // Show only 5 users unless 'View all' is clicked
  const usersToShow = showAll ? suggestedUsers : (suggestedUsers || []).slice(0, 5);

  return (
    <div className="w-80 p-4 border-l border-gray-200 min-h-screen bg-white">
      {/* Current User Profile */}
      {user && (
        <Link to="/profile" className="flex items-center gap-2 mb-8 hover:bg-gray-50 rounded p-2 transition">
          <Avatar>
            <AvatarImage src={user.profilePicture} alt="post_image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-sm">{user.username}</h1>
            <span className="text-gray-600 text-sm">{user.bio || 'Bio here...'}</span>
          </div>
        </Link>
      )}

      <h2 className="font-bold text-lg mb-4">Suggested for you</h2>
      <div className="flex flex-col gap-4">
        {usersToShow && usersToShow.length > 0 ? (
          usersToShow.map(user => (
            <div key={user._id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
              <Link to={`/profile/${user._id}`} className="flex items-center gap-3 hover:underline">
                <Avatar>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <span className="font-medium text-sm">{user.username}</span>
                  <div className="text-xs text-gray-500">{user.bio || 'Bio here...'}</div>
                </div>
              </Link>
              <button className="text-xs font-semibold text-blue-500 hover:underline">Follow</button>
            </div>
          ))
        ) : (
          <span className="text-gray-400 text-sm">No suggestions available</span>
        )}
        {/* View all link/button */}
        {suggestedUsers && suggestedUsers.length > 5 && !showAll && (
          <button
            className="text-xs text-blue-500 font-semibold hover:underline self-start mt-2"
            onClick={() => setShowAll(true)}
          >
            View all
          </button>
        )}
      </div>
    </div>
  )
}

export default RightSidebar