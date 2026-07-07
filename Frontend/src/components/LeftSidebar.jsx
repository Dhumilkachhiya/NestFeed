import {
  Heart,
  House,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  X,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar.tsx";
import React, { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setSearching(true);
      // Fetch all suggested users and filter locally
      const res = await axios.get("http://localhost:8000/api/v1/users/suggested", {
        withCredentials: true,
      });
      if (res.data.success) {
        const filtered = (res.data.data || []).filter((u) =>
          u.username.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSearching(false);
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
    } else if (textType === "Messages") {
      navigate("/messages");
    } else if (textType === "Search") {
      setShowSearch((prev) => !prev);
    }
  };

  const sidebarIcons = [
    { icon: <Home className="w-6 h-6" />, text: "Home", path: "/" },
    { icon: <Search className="w-6 h-6" />, text: "Search", path: "#" },
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
      path: "/profile",
    },
  ];

  return (
    <>
      <div className="w-20 md:w-64 h-screen border-r border-gray-200 bg-white sticky top-0 flex flex-col justify-between py-6 px-4 md:px-6 z-50">
        <div>
          <div
            className="mb-10 flex items-center justify-center md:justify-start cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="hidden md:block text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#2e42bf] to-[#d037a2]">
              NestFeed
            </span>
            <Home className="md:hidden w-8 h-8 text-[#d037a2]" />
          </div>
          <div className="flex flex-col space-y-2">
            {sidebarIcons.map((item, index) => {
              const isActive =
                location.pathname === item.path && item.path !== "#";
              const isSearchActive = item.text === "Search" && showSearch;
              return (
                <div
                  onClick={() => sidebarHandler(item.text)}
                  key={index}
                  className={`flex items-center md:justify-start justify-center gap-4 p-3 rounded-lg cursor-pointer transition-all duration-200 group
                    ${isActive || isSearchActive ? "font-bold bg-gray-100" : "hover:bg-gray-50 text-gray-700"}
                  `}
                >
                  <div
                    className={`${
                      isActive || isSearchActive
                        ? "text-black transition-transform group-hover:scale-105"
                        : "text-gray-700 transition-transform group-hover:scale-105"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`hidden md:block ${
                      isActive || isSearchActive ? "text-black" : "text-gray-700"
                    }`}
                  >
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
        {openListing && (
          <CreateListing open={openListing} setOpen={setOpenListing} />
        )}
      </div>

      {/* Search Panel */}
      {showSearch && (
        <div className="fixed left-20 md:left-64 top-0 h-screen w-80 bg-white border-r border-gray-200 shadow-xl z-40 flex flex-col">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Search</h2>
              <X
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                autoFocus
                className="w-full bg-gray-100 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-gray-200 transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {searching ? (
              <p className="text-center text-sm text-gray-400 mt-6">
                Searching...
              </p>
            ) : searchResults.length > 0 ? (
              searchResults.map((u) => (
                <Link
                  to={`/profile/${u._id}`}
                  key={u._id}
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                    setSearchResults([]);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                >
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={u.profilePicture} />
                    <AvatarFallback>{u.username?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">{u.username}</span>
                    <span className="text-xs text-gray-500">{u.bio || "NestFeed user"}</span>
                  </div>
                </Link>
              ))
            ) : searchQuery ? (
              <p className="text-center text-sm text-gray-400 mt-6">
                No users found for "{searchQuery}"
              </p>
            ) : (
              <p className="text-center text-sm text-gray-400 mt-6">
                Try searching for a person or username.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LeftSidebar;
