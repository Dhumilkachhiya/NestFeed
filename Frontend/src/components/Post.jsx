import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaRegHeart, FaHeart, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { setAuthUser } from "../redux/authSlice";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "../redux/postSlice";

const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes?.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes?.length || 0);
  const [comment, setComment] = useState(post.comments || []);
  const [saved, setSaved] = useState(user?.bookmarks?.includes(post?._id) || false);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedPost = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPost));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeorDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        const updatedPostData = posts.map((p) => {
          return p._id === post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
            : p;
        });
        dispatch(setPosts(updatedPostData));

        if (!liked) toast.success("Post liked");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
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
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post._id}/save`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const isSaved = user?.bookmarks?.includes(post._id);
        const newBookmarks = isSaved
          ? user.bookmarks.filter((id) => id !== post._id)
          : [...(user.bookmarks || []), post._id];
        
        dispatch(setAuthUser({ ...user, bookmarks: newBookmarks }));
        setSaved(!isSaved);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-6 w-full max-w-[470px] mx-auto border-b border-gray-200 pb-4">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border border-gray-200 p-[1px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600 rounded-full">
            <AvatarImage src={post.author?.profilePicture} className="rounded-full border-2 border-white object-cover w-full h-full" />
            <AvatarFallback className="rounded-full bg-gray-100">{post.author?.username?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h1 className="font-semibold text-sm hover:text-gray-500 cursor-pointer">
              {post.author?.username}
            </h1>
            <span className="text-xs text-gray-500">Real Estate</span>
          </div>
        </div>
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
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deletePostHandler}
                variant="ghost"
                className="w-full font-bold text-red-500 py-4 h-auto border-b border-gray-100 rounded-none hover:bg-gray-50"
              >
                Delete
              </Button>
            )}
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full py-4 h-auto rounded-none hover:bg-gray-50">
                    Cancel
                </Button>
            </DialogTrigger>
          </DialogContent>
        </Dialog>
      </div>

      <div 
        className="rounded border border-gray-100 overflow-hidden relative group cursor-pointer"
        onDoubleClick={likeorDislikeHandler}
      >
        <img
          className="w-full aspect-[4/5] object-cover"
          src={post.image}
          alt="post image"
        />
        {/* Double tap heart animation overlay can go here in the future */}
      </div>

      <div className="px-1 mt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            {liked ? (
              <FaHeart onClick={likeorDislikeHandler} size={24} className="text-red-500 hover:text-red-600 cursor-pointer transition-transform active:scale-110" />
            ) : (
              <FaRegHeart onClick={likeorDislikeHandler} size={24} className="hover:text-gray-500 cursor-pointer transition-transform active:scale-110" />
            )}

            <MessageCircle onClick={() => setOpen(true)} size={24} className="hover:text-gray-500 cursor-pointer transition-transform active:scale-110" />
            <Send size={24} className="hover:text-gray-500 cursor-pointer transition-transform active:scale-110" />
          </div>
          {saved ? (
            <FaBookmark onClick={bookmarkHandler} size={22} className="cursor-pointer transition-transform active:scale-110" />
          ) : (
            <FaRegBookmark onClick={bookmarkHandler} size={22} className="hover:text-gray-500 cursor-pointer transition-transform active:scale-110" />
          )}
        </div>

        <span className="font-semibold text-sm block mb-1">{postLike} likes</span>
        <div className="text-sm mb-1">
          <span className="font-semibold mr-2 hover:text-gray-500 cursor-pointer">{post.author?.username}</span>
          <span className="text-gray-900">{post.caption}</span>
        </div>
        
        {comment?.length > 0 && (
          <span
            onClick={() => setOpen(true)}
            className="cursor-pointer text-gray-500 text-sm hover:text-gray-400 block mb-1"
          >
            View all {comment?.length} comments
          </span>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <input
            type="text"
            value={text}
            onChange={changeEventHandler}
            placeholder="Add a comment..."
            className="outline-none text-sm w-full placeholder:text-gray-400"
          />
          {text && (
            <span
              className="text-blue-500 font-semibold text-sm hover:text-blue-700 cursor-pointer transition-colors"
              onClick={commentHandler}
            >
              Post
            </span>
          )}
        </div>
      </div>
      <CommentDialog open={open} setOpen={setOpen} post={post} comment={comment} setComment={setComment} />
    </div>
  );
};

export default Post