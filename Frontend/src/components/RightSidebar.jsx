import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector, useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const RightSidebar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/users/suggested', {
          withCredentials: true,
        });
        if (res.data.success) {
          setSuggestedUsers(res.data.data || []);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user) fetchSuggestedUsers();
  }, [user]);

  const followHandler = async (id) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/v1/users/followOrUnfollow/${id}`, {}, {
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message);
        const isFollowing = user?.following?.includes(id);
        const newFollowing = isFollowing
          ? user.following.filter(userId => userId !== id)
          : [...(user.following || []), id];
        
        dispatch(setAuthUser({ ...user, following: newFollowing }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="w-full">
      {/* Current User Profile Snippet */}
      {user && (
        <div className="flex items-center justify-between mb-8 mt-2">
          <div className="flex items-center gap-3">
            <Link to="/profile">
              <Avatar className="w-11 h-11 border border-gray-200">
                <AvatarImage src={user.profilePicture} />
                <AvatarFallback>{user.username?.[0]}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col">
              <Link to="/profile" className="font-semibold text-sm hover:text-gray-500">
                {user.username}
              </Link>
              <span className="text-gray-500 text-sm">{user.bio || 'Real Estate Enthusiast'}</span>
            </div>
          </div>
          <span className="text-blue-500 text-xs font-bold cursor-pointer hover:text-white hover:bg-blue-500 rounded px-2 py-1 transition-all">
            Switch
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-500 text-sm">Suggested for you</span>
        <span className="text-black text-xs font-bold cursor-pointer hover:text-gray-500">See All</span>
      </div>

      <div className="flex flex-col gap-4">
        {suggestedUsers?.length > 0 ? (
          suggestedUsers.map((u) => (
            <div key={u._id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link to={`/profile/${u._id}`}>
                  <Avatar className="w-10 h-10 border border-gray-100">
                    <AvatarImage src={u.profilePicture} />
                    <AvatarFallback>{u.username?.[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex flex-col">
                  <Link to={`/profile/${u._id}`} className="font-semibold text-sm hover:text-gray-500">
                    {u.username}
                  </Link>
                  <span className="text-gray-500 text-xs">Suggested for you</span>
                </div>
              </div>
              {user?.following?.includes(u._id) ? (
                <button
                  onClick={() => followHandler(u._id)}
                  className="text-gray-500 text-xs font-bold hover:text-gray-700"
                >
                  Following
                </button>
              ) : (
                <button
                  onClick={() => followHandler(u._id)}
                  className="text-blue-500 text-xs font-bold hover:text-blue-700"
                >
                  Follow
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">No suggestions right now</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;