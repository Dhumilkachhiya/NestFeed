import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Dialog from "@radix-ui/react-dialog";
import { DialogHeader } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addListing } from '../redux/listingSlice.js';
import { Loader2 } from 'lucide-react';
import { toast } from "sonner";

const CreateListing = ({ open, setOpen}) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    description: '',
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const {user} = useSelector(store=>store.auth)
  const {listings} = useSelector(store=>store.listing)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const dispatch  = useDispatch()

  const fileChangeHandler = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...previewUrls]);
  
      setFormData((prevState) => ({
        ...prevState,
        images: [...prevState.images, ...files],
      }));
    }
  };
  
  const createListingHandler = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData(); // Avoid name conflict
  
  formDataToSend.append("title", formData.title);
  formDataToSend.append("price", formData.price);
  formDataToSend.append("location", formData.location);
  formDataToSend.append("area", formData.area);
  formDataToSend.append("description", formData.description);
  formData.images.forEach((image) => formDataToSend.append("images", image));

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/property/addproperty",
        formDataToSend,
        {
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(addListing([res.data.listing, ...listings]));
        toast.success(res.data?.message);
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

  if (!open) return null; // Don't render if modal is closed

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />

        <Dialog.Content className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[40%] relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <DialogHeader className="text-center font-semibold mb-4">
              Create Property Listing
            </DialogHeader>

            <div className="flex gap-3 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.profilePicture} alt="img" />
                <AvatarFallback className="bg-gray-200 text-black font-semibold">
                  CN
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-semibold text-sm">{user?.username}</h1>
                <span className="text-gray-600 text-xs">Listing a property</span>
              </div>
            </div>

            <form className="grid gap-3 mt-4" onSubmit={createListingHandler}>
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                placeholder="Area (sqft)"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-24"
              />

              {previewImages && (
                <div className="flex gap-2">
                {previewImages.map((img, index) => (
                  <img key={index} src={img} alt={`preview-${index}`} className="w-32 h-32 object-cover rounded-md" />
                ))}
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
                Upload Property Image
              </Button>

              {previewImages &&
                (loading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit" className="w-full mt-3">
                    Post Listing
                  </Button>
                ))}
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateListing;