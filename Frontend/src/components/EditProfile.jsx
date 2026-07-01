import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "../redux/authSlice";

const EditProfile = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [bio, setBio] = useState(user?.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    if (profilePhoto) {
      formData.append("profilePicture", profilePhoto);
    }
    
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:8000/api/v1/users/profile/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(res.data.data));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] p-0 rounded-2xl overflow-hidden border-none shadow-xl bg-white">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <span className="font-semibold text-lg">Edit Profile</span>
        </div>

        <form onSubmit={submitHandler} className="p-4 flex flex-col gap-6">
          <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-xl items-center">
            <Avatar className="w-20 h-20 border border-gray-300">
              <AvatarImage src={profilePhoto ? URL.createObjectURL(profilePhoto) : user?.profilePicture} />
              <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
            </Avatar>
            <label htmlFor="photo" className="text-blue-500 font-semibold text-sm cursor-pointer mt-2 hover:text-blue-700">
              Change Profile Photo
            </label>
            <input type="file" id="photo" accept="image/*" className="hidden" onChange={fileChangeHandler} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-sm text-gray-800">Bio</label>
            <textarea
              className="resize-none border border-gray-300 rounded-lg p-3 outline-none focus:border-gray-500"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-xl py-6 font-bold">
            {loading ? "Saving..." : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
