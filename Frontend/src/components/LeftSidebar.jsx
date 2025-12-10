import {
  Heart,
  House,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar.tsx";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice.js";
import CreatePost from "./CreatePost.jsx";
import CreateListing from "./CreateListing.jsx";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openListing, setOpenListing] = useState(false);

  const logoutHandler = async () => {
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/v1/users/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      if (res.data?.success) {
        dispatch(setAuthUser(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidebarHandler = (textType) => {
    console.log("Clicked on:", textType);
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Trending") {
      navigate("/property");
    } else if (textType === "Add Listing") {
      setOpenListing(true);
    }
  };

  const sidebarIcons = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Trending" },
    { icon: <House />, text: "Add Listing" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notification" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-[20%] bg-black p-4">
      <div className="text-2xl font-bold text-white mb-8">HomeBook</div>
        <div className="space-y-4"> 
          {sidebarIcons.map((item, index) => {
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 p-2 text-white hover:bg-[#d037a2]/20 rounded-lg transition-colors"
          >
                {item.icon}
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      {open && <CreatePost open={open} setOpen={setOpen} />}
      {openListing && <CreateListing open={openListing} setOpen={setOpenListing} />}
    </div>
  );
};

export default LeftSidebar;
