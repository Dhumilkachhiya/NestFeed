import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

import { Link } from "react-router-dom";
import React, { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "../redux/postSlice";

const CommentDialog = ({ open, setOpen, post, comment, setComment }) => {
    const [text, setText] = useState("");
    const { posts } = useSelector((store) => store.post);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText)
        }else{
            setText("")
        }
    }

    const sendMessegeHandler = async () => {
        try {
            const res = await axios.post(
              `http://localhost:8000/api/v1/post/${post._id}/comment`,
              { text },
              {
                headers: {
                  "Content-Type": "application/json",
                },
                withCredentials: true,
              }
            );
            if (res.data.success) {
              const newComment = res.data.data.comment;
              const updatedCommentData = [...comment, newComment];
              setComment(updatedCommentData);
      
              const updatedPostData = posts.map((p) => {
                return p._id === post._id
                  ? {
                    ...p,
                    comments: updatedCommentData,
                  }
                  : p;
              });
              dispatch(setPosts(updatedPostData));
              toast.success("Comment added");
              setText("");
            }
          } catch (error) {
            console.log(error);
          }
    }

   return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-0 rounded-lg w-full max-w-4xl h-[600px] flex flex-col z-50 border-none shadow-2xl"
      >
        <div className="flex flex-1 overflow-hidden h-full">
          {/* Image */}
          <div className="w-1/2 bg-black flex items-center justify-center">
            <img
              src={post?.image}
              alt="post_image"
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>

          {/* Comment Section */}
          <div className="w-1/2 flex flex-col h-full bg-white rounded-r-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={post?.author?.profilePicture} />
                    <AvatarFallback>{post?.author?.username?.[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-sm">{post?.author?.username}</Link>
                </div>
              </div>

              {/* More menu */}
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer hover:text-gray-500" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center p-0 rounded-xl overflow-hidden w-[400px]">
                  <Button variant="ghost" className="w-full font-bold text-red-500 py-4 h-auto border-b border-gray-100 rounded-none hover:bg-gray-50">
                    Unfollow
                  </Button>
                  <Button variant="ghost" className="w-full py-4 h-auto border-b border-gray-100 rounded-none hover:bg-gray-50">
                    Add to favorites
                  </Button>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="w-full py-4 h-auto rounded-none hover:bg-gray-50">
                      Cancel
                    </Button>
                  </DialogTrigger>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {comment?.map((cmt, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={cmt?.author?.profilePicture} />
                            <AvatarFallback>{cmt?.author?.username?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="font-semibold text-sm mr-2">{cmt?.author?.username}</span>
                            <span className="text-sm">{cmt?.text}</span>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="w-full outline-none text-sm placeholder:text-gray-400"
                />
                <Button disabled={!text.trim()} onClick={sendMessegeHandler} variant="ghost" className="text-blue-500 font-semibold hover:text-blue-600 hover:bg-transparent">Post</Button>
                </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
