import React from 'react'
import Posts from './Posts'
import StoryCarousel from './StoryCarousel'
import { useSelector } from 'react-redux'
import RightSidebar from './RightSidebar'

const Feed = () => {
  const { user } = useSelector(store => store.auth);

  return (
    <div className="flex w-full justify-center gap-12 py-8 px-4">
      <div className="flex flex-col w-full max-w-xl">
        <StoryCarousel currentUser={user} />
        <Posts />
      </div>
      <div className="hidden lg:block w-80">
        <RightSidebar />
      </div>
    </div>
  );
};

export default Feed