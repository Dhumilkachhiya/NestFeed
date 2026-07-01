import React from "react";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar.tsx";
import { Grid3X3, Bookmark, Settings, Heart, MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import EditProfile from "./EditProfile";
import { useState } from "react";

const Profile = () => {
  const { id } = useParams();
  const { user: authUser } = useSelector((store) => store.auth);
  const [openEdit, setOpenEdit] = useState(false);
  
  // If id is provided, fetch that user, otherwise use authUser
  const fetchedUser = useGetUserProfile(id);
  const user = id ? fetchedUser : authUser;
  
  const posts = useSelector((store) => store.post?.posts ?? []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Loading profile...
      </div>
    );
  }

  const userPosts = posts.filter(
    (p) => p.author?._id === user._id || p.author === user._id
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 md:px-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-24 mb-14">
        <Avatar className="w-32 h-32 md:w-40 md:h-40 border border-gray-200 p-1">
          <AvatarImage src={user.profilePicture} className="rounded-full object-cover" />
          <AvatarFallback className="text-4xl rounded-full bg-gray-100 text-gray-400">
            {user.username?.[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 flex flex-col items-center md:items-start">
          {/* Username & Actions */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              {user.username}
            </h2>
            {authUser?._id === user._id ? (
              <button
                className="px-4 py-1.5 text-sm font-semibold bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                onClick={() => setOpenEdit(true)}
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <button
                className="px-6 py-1.5 text-sm font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {authUser?.following?.includes(user._id) ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-6">
            <div className="text-center md:text-left text-base">
              <span className="font-semibold text-gray-900 mr-1">{userPosts.length}</span>
              <span className="text-gray-900">posts</span>
            </div>
            <div className="text-center md:text-left text-base cursor-pointer">
              <span className="font-semibold text-gray-900 mr-1">
                {user.followers?.length ?? 0}
              </span>
              <span className="text-gray-900">followers</span>
            </div>
            <div className="text-center md:text-left text-base cursor-pointer">
              <span className="font-semibold text-gray-900 mr-1">
                {user.following?.length ?? 0}
              </span>
              <span className="text-gray-900">following</span>
            </div>
          </div>

          {/* Bio */}
          <div className="text-center md:text-left">
            <p className="font-semibold text-gray-900">{user.email}</p>
            {user.bio && (
              <p className="text-gray-900 mt-1 whitespace-pre-wrap">{user.bio}</p>
            )}
            <p className="text-blue-900 font-semibold mt-1 text-sm cursor-pointer hover:underline">Real Estate Agent</p>
          </div>
        </div>
      </div>

      {/* Divider with tabs */}
      <div className="border-t border-gray-200">
        <div className="flex justify-center gap-12 mt-0">
          <button className="flex items-center gap-2 py-4 text-xs font-semibold tracking-widest text-gray-900 border-t-2 border-gray-900 -mt-[1px] uppercase">
            <Grid3X3 className="w-4 h-4" />
            Posts
          </button>
          <button className="flex items-center gap-2 py-4 text-xs font-semibold tracking-widest text-gray-500 uppercase hover:text-gray-900 transition-colors">
            <Bookmark className="w-4 h-4" />
            Saved
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {userPosts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Grid3X3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-2xl font-bold text-gray-900 mb-2">No Posts Yet</p>
          <p className="text-sm">When you share photos, they'll appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1 md:gap-2 mt-2">
          {userPosts.map((post) => (
            <div
              key={post._id}
              className="aspect-square overflow-hidden cursor-pointer group relative"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:brightness-75 transition-all"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 transition-opacity duration-200 text-white font-bold">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-white" />
                  <span>{post.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 fill-white" />
                  <span>{post.comments?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <EditProfile open={openEdit} setOpen={setOpenEdit} />
    </div>
  );
};

export default Profile;