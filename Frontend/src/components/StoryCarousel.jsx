import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";

const StoryCarousel = ({ currentUser }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)
  const fileInputRef = useRef();

  // Fetch stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8000/api/v1/stories", {
          withCredentials: true,
        });
        console.log(res.data);

        // Check if the response is an array
        if (Array.isArray(res.data)) {
          setStories(res.data);
        } else if (res.data.stories && Array.isArray(res.data.stories)) {
          // If the stories are nested in an object
          setStories(res.data.stories);
        } else {
          // If the response is not in the expected format
          console.error("Unexpected API response format:", res.data);
          // Use sample data as fallback
          setError(
            "Could not load stories from API. Using sample data instead."
          );
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

    try {
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

      setStories((prev) => [tempStory, ...prev]);

      // Try to upload to API
      await axios.post("http://localhost:8000/api/v1/stories", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        }, withCredentials: true,
      });
      // Refresh stories after upload

      try {
        const res = await axios.get("http://localhost:8000/api/v1/stories", {
          withCredentials: true,
        });
        console.log("Refresh Response:", res.data);

        if (Array.isArray(res.data)) {
          setStories(res.data);
        } else if (res.data.stories && Array.isArray(res.data.stories)) {
          setStories(res.data.stories);
        } else {
          // Keep the uploaded story but remove the "uploading" state
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
        // Keep the uploaded story but remove the "uploading" state
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
      // Remove the temporary story
      setStories((prev) =>
        prev.filter((story) => story._id !== tempStory?._id)
      );
      alert("Failed to upload story. Please try again.");
    }
  };

  return (
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      {error && <div className="text-amber-500 text-xs px-4 mb-2">{error}</div>}
      <div className="flex gap-4 px-4">
        {/* Add Story Button */}
        <div className="flex flex-col items-center mx-2 cursor-pointer overflow-hidden" onClick={() => fileInputRef.current.click()}>
          <Avatar className="w-20 h-25 border-2 border-gray-300 rounded-lg overflow-hidden">
            <AvatarImage src={currentUser?.profilePicture || "/placeholder.svg?height=50&width=50"} />
            <AvatarFallback>{currentUser?.username?.charAt(0) || "+"}</AvatarFallback>
          </Avatar>
          <span className="text-xs mt-2 text-gray-600">Add Story</span>
          <input type="file" ref={fileInputRef} onChange={handleStoryUpload} hidden accept="image/*, video/*" />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center mx-2">
            <div className="w-20 h-25 rounded-lg bg-gray-200 animate-pulse"></div>
            <div className="w-12 h-3 rounded-lg mt-2 bg-gray-200 animate-pulse"></div>
          </div>
        )}

        {/* Other Users' Stories */}
        {!loading &&
          stories?.map((story) => (
            <div
              key={story._id}
              className="flex flex-col items-center mx-2 cursor-pointer"
              onClick={() => {
                /* Open story viewer modal */
              }}
            >
              <Avatar
                className={`w-20 h-25 rounded-lg ${story.isUploading
                    ? "ring-2 ring-amber-500"
                    : story.seenBy?.includes(currentUser?._id)
                      ? "opacity-75"
                      : "ring-2 ring-blue-500"
                  }`}
              >
                <AvatarImage src={story.user?.profilePicture || "/placeholder.svg?height=50&width=50"} />
                <AvatarFallback>{story.user?.username?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <span className="text-xs mt-2 text-gray-600">
                {story.isUploading ? "Uploading..." : story.user?.username}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

export default StoryCarousel