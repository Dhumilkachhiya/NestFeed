import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Post from './Post'

const Posts = () => {

  const [loading,isLoading] = useState(false);
  const {posts} = useSelector(store=>store.post);
  return (
    <div className="space-y-6">
      {/* Loading State */}
      {isLoading && (
        <div className="text-center p-8">
          <span className="loading loading-spinner loading-lg text-[#2e42bf]"></span>
          <p className="mt-4 text-[#9142ca]">Loading posts...</p>
        </div>
      )}

      {/* Empty State */}
      {!posts.length && (
        <div className="text-center p-8 bg-gradient-to-r from-[#2e42bf]/5 to-[#d037a2]/5 rounded-lg">
          <p className="text-[#9142ca]">No posts available yet...</p>
        </div>
      )}

      {/* Posts */}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
};
export default Posts