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
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice.js";
import CreatePost from "./CreatePost.jsx";
import CreateListing from "./CreateListing.jsx";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openListing, setOpenListing] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/users/logout", {
        withCredentials: true,
      });
      if (res.data?.success) {
        dispatch(setAuthUser(null));
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to logout");
    }
  };

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Trending") {
      navigate("/property");
    } else if (textType === "Add Listing") {
      setOpenListing(true);
    } else if (textType === "Profile") {
      navigate("/profile");
    } else if (textType === "Home") {
      navigate("/");
    }
  };

  const sidebarIcons = [
    { icon: <Home className="w-6 h-6" />, text: "Home", path: "/" },
    { icon: <Search className="w-6 h-6" />, text: "Search", path: "/search" },
    { icon: <TrendingUp className="w-6 h-6" />, text: "Trending", path: "/property" },
    { icon: <House className="w-6 h-6" />, text: "Add Listing", path: "#" },
    { icon: <MessageCircle className="w-6 h-6" />, text: "Messages", path: "/messages" },
    { icon: <Heart className="w-6 h-6" />, text: "Notification", path: "/notifications" },
    { icon: <PlusSquare className="w-6 h-6" />, text: "Create", path: "#" },
    {
      icon: (
        <Avatar className="w-7 h-7">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
      path: "/profile"
    },
  ];

  return (
    <div className="w-20 md:w-64 h-screen border-r border-gray-200 bg-white sticky top-0 flex flex-col justify-between py-6 px-4 md:px-6 z-50">
      <div>
        <div className="mb-10 flex items-center justify-center md:justify-start cursor-pointer" onClick={() => navigate("/")}>
          <span className="hidden md:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2e42bf] to-[#d037a2]">HomeBook</span>
          <Home className="md:hidden w-8 h-8 text-[#d037a2]" />
        </div>
        <div className="flex flex-col space-y-2">
          {sidebarIcons.map((item, index) => {
            const isActive = location.pathname === item.path && item.path !== "#";
            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className={`flex items-center md:justify-start justify-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 group
                  ${isActive ? "font-bold bg-gray-50" : "hover:bg-gray-50 text-gray-700"}
                `}
              >
                <div className={`${isActive ? "text-black transition-transform group-hover:scale-105" : "text-gray-700 transition-transform group-hover:scale-105"}`}>
                  {item.icon}
                </div>
                <span className={`hidden md:block ${isActive ? "text-black" : "text-gray-700"}`}>
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div
          onClick={() => sidebarHandler("Logout")}
          className="flex items-center md:justify-start justify-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 group hover:bg-red-50 text-red-500"
        >
          <LogOut className="w-6 h-6 transition-transform group-hover:scale-105" />
          <span className="hidden md:block font-medium">Logout</span>
        </div>
      </div>

      {open && <CreatePost open={open} setOpen={setOpen} />}
      {openListing && <CreateListing open={openListing} setOpen={setOpenListing} />}
    </div>
  );
};

export default LeftSidebar;
