import * as Dialog from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { DialogHeader } from "./ui/dialog";
import { Loader2, X } from "lucide-react"; // Import close icon
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import readFileAsDataURL from "../lib/utils";
import { toast } from "sonner";
import axios from "axios";
import Cookies from "js-cookie"; // Import the package
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice";


const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const {user} = useSelector(store=>store.auth)
  const {posts} = useSelector(store=>store.post)
  const dispatch = useDispatch()

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataURL = await readFileAsDataURL(file);
      setImagePreview(dataURL);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault(); // Prevent page reload
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(setPosts([res.data.data.post, ...posts]))
        toast.success(res.data.message);
        setOpen(false);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        {/* Background Overlay */}
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        {/* Centered Modal */}
        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] relative">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            {/* Dialog Header */}
            <DialogHeader className="text-center font-semibold mb-4">
              Create New Post
            </DialogHeader>

            {/* User Info Section (Moved Inside the Main Container) */}
            <div className="flex gap-3 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profilePicture} alt="img" />
                <AvatarFallback className="bg-gray-200 text-black font-semibold">
                  CN
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-sm">{user?.username}</h1>
                <span className="text-gray-600 text-xs">Bio here...</span>
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full resize-none border border-gray-300 rounded-md mt-1 p-2 focus:ring-0 focus:outline-none"
                placeholder="Write a caption"
              />
            </div>
            {imagePreview && (
              <div className="w-full h-64 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="preview_img"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
            )}
            <input
              ref={imageRef}
              type="file"
              className="hidden"
              onChange={fileChangeHandler}
            />
            <Button
              onClick={() => imageRef.current.click()}
              className="w-fit mx-auto bg-blue-400 hover:bg-blue-500 flex text-center mt-3"
            >
              Select from computer
            </Button>
            {imagePreview &&
              (loading ? (
                <Button>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button
                  onClick={createPostHandler}
                  type="submit"
                  className="w-full mt-5"
                >
                  Post
                </Button>
              ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreatePost;
