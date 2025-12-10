import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaRegHeart } from "react-icons/fa";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Bookmark,
  Ghost,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
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
  // const [liked,setLiked] = useState(post.likes.includes(user?._id) || false)
  // const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
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
          p._id === post._id
            ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== user._id)
                : [...p.likes, user._id],
            }
            : p;
        });
        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
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
        const updatedCommentData = [...comment, res.data.message];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) => {
          p._id === post._id
            ? {
              ...p,
              comments: updatedCommentData,
            }
            : p;
        });
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback className="bg-gradient-to-r from-[#2e42bf] to-[#d037a2] text-white">
              {post.author?.username[0]}
            </AvatarFallback>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="font-medium text-[#2e42bf]">
            {post.author?.username}
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm text-center">
            <Button variant={Ghost} className="cursor-pointer w-fit font-bold">
              Unfollow
            </Button>
            <Button variant={Ghost} className="cursor-pointer w-fit font-bold">
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deletePostHandler}
                variant={Ghost}
                className="cursor-pointer w-fit font-bold"
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-lg my-2 w-full aspect-square object-cover border-2 border-[#2e42bf]/10"
        src={post.image}
      />

      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          <FaRegHeart className="text-[#d037a2] hover:text-[#d037a2]/80 cursor-pointer" />

          <MessageCircle className="text-[#2e42bf] hover:text-[#2e42bf]/80 cursor-pointer" />
          <Send className="text-[#2e42bf] hover:text-[#2e42bf]/80 cursor-pointer" />
        </div>
        <Bookmark className="text-[#9142ca] hover:text-[#9142ca]/80 cursor-pointer" />
      </div>

      <span className="font-medium block mb-2"> likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post.caption}
      </p>
      <span
        onClick={() => setOpen(true)}
        className="cursor-pointer text-gray-500 text-sm"
      >
        View all {comment?.lenght} comments
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center justify-between mt-4">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full border-b-2 focus:border-[#9142ca] transition-colors"
        />
        {text && (
          <span
            className="text-[#d037a2] font-medium hover:text-[#d037a2]/80 cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post