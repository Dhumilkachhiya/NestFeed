import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { X, Trash2, Plus } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const StoryCarousel = ({ currentUser }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const fileInputRef = useRef();

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/v1/stories", {
          withCredentials: true,
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          setStories(res.data.data);
        } else if (Array.isArray(res.data)) {
          setStories(res.data);
        } else if (res.data.stories && Array.isArray(res.data.stories)) {
          setStories(res.data.stories);
        } else {
          setError("Could not load stories from API.");
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  // Handle story upload
  const handleStoryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);

    // Show a temporary "uploading" story
    const tempStory = {
      _id: "temp-" + Date.now(),
      user: {
        _id: currentUser?._id || "current",
        username: currentUser?.username || "You",
        profilePicture: URL.createObjectURL(file),
      },
      seenBy: [],
      isUploading: true,
    };

    try {
      setStories((prev) => [tempStory, ...prev]);

      // Try to upload to API
      await axios.post("http://localhost:8000/api/v1/stories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      try {
        const res = await axios.get("http://localhost:8000/api/v1/stories", {
          withCredentials: true,
        });

        if (res.data.success && Array.isArray(res.data.data)) {
          setStories(res.data.data);
        } else if (Array.isArray(res.data)) {
          setStories(res.data);
        } else if (res.data.stories && Array.isArray(res.data.stories)) {
          setStories(res.data.stories);
        } else {
          setStories((prev) =>
            prev.map((story) =>
              story._id === tempStory._id
                ? { ...story, isUploading: false }
                : story
            )
          );
        }
      } catch (refreshError) {
        console.error("Error refreshing stories:", refreshError);
        setStories((prev) =>
          prev.map((story) =>
            story._id === tempStory._id
              ? { ...story, isUploading: false }
              : story
          )
        );
      }
    } catch (error) {
      console.error("Story upload failed:", error);
      setStories((prev) =>
        prev.filter((story) => story._id !== tempStory?._id)
      );
      toast.error("Failed to upload story.");
    }
  };

  const handleDeleteStory = async (storyId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/stories/${storyId}`, {
        withCredentials: true,
      });
      setStories((prev) => prev.filter((story) => story._id !== storyId));
      setSelectedStory(null);
    } catch (error) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story.");
    }
  };

  return (
    <div className="w-full mb-8 bg-white border border-gray-200 rounded-xl pt-4 pb-3">
      {error && <div className="text-red-500 text-xs px-4 mb-2">{error}</div>}
      <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide">
        
        {/* Add Story Button (Current User) */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer" onClick={() => fileInputRef.current.click()}>
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-gray-100 rounded-full p-[2px]">
              <AvatarImage src={currentUser?.profilePicture} className="rounded-full object-cover" />
              <AvatarFallback className="rounded-full bg-gray-100">{currentUser?.username?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              <Plus size={12} className="text-white font-bold" />
            </div>
          </div>
          <span className="text-xs mt-2 text-gray-500 truncate w-16 text-center">Your Story</span>
          <input type="file" ref={fileInputRef} onChange={handleStoryUpload} hidden accept="image/*, video/*" />
        </div>

        {/* Loading State */}
        {loading && (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="w-12 h-2 mt-2 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))
        )}

        {/* Other Users' Stories */}
        {!loading &&
          stories?.map((story) => (
            <div
              key={story._id}
              className="flex flex-col items-center flex-shrink-0 cursor-pointer"
              onClick={() => setSelectedStory(story)}
            >
              <div className={`rounded-full p-[2px] ${story.isUploading
                  ? "bg-amber-400"
                  : story.seenBy?.includes(currentUser?._id)
                    ? "bg-gray-200"
                    : "bg-gradient-to-tr from-yellow-400 to-fuchsia-600"
                }`}>
                <Avatar className="w-[60px] h-[60px] border-2 border-white rounded-full">
                  <AvatarImage src={story.user?.profilePicture} className="rounded-full object-cover" />
                  <AvatarFallback className="rounded-full bg-gray-100">{story.user?.username?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </div>
              <span className="text-xs mt-2 text-gray-700 truncate w-16 text-center">
                {story.isUploading ? "Uploading..." : story.user?.username}
              </span>
            </div>
          ))}
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
            onClick={() => setSelectedStory(null)}
          >
            <X className="w-6 h-6" />
          </Button>

          <div className="relative max-w-sm w-full h-[85vh] sm:h-[90vh] bg-black sm:rounded-xl overflow-hidden flex flex-col items-center justify-center shadow-2xl">
            {/* Story Header */}
            <div className="absolute top-0 w-full p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent z-10">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8 border border-white/20 rounded-full">
                  <AvatarImage src={selectedStory.user?.profilePicture} className="rounded-full object-cover" />
                  <AvatarFallback className="rounded-full">{selectedStory.user?.username?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="text-white font-semibold text-sm drop-shadow-md">
                  {selectedStory.user?.username}
                </span>
                <span className="text-white/60 text-xs font-semibold drop-shadow-md">
                   {/* Replace with actual relative time if available */}
                   1h
                </span>
              </div>
              
              {/* Delete Button for current user */}
              {currentUser?._id === selectedStory.user?._id && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => handleDeleteStory(selectedStory._id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              )}
            </div>

            {/* Story Media */}
            {selectedStory.content?.endsWith(".mp4") || selectedStory.content?.endsWith(".mov") || selectedStory.content?.endsWith(".webm") ? (
              <video 
                src={selectedStory.content} 
                autoPlay 
                playsInline 
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img 
                src={selectedStory.content} 
                alt="Story" 
                className="w-full h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StoryCarousel