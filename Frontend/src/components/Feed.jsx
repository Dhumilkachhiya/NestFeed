import React from 'react'
import Posts from './Posts'
import StoryCarousel from './StoryCarousel'
import useGetFeaturedProperties from '../hooks/useGetFeaturedProperties.js'


const Feed = () => {
  return (
    <div className="flex-1 my-8 flex flex-col items-center pl-[20%]">
      <StoryCarousel 
        useGetFeaturedProperties={useGetFeaturedProperties}
        className="border-2 border-[#2e42bf]/10 rounded-xl p-2"
      />
      <Posts />
    </div>
  );
};

export default Feed