import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Dialog from "@radix-ui/react-dialog";
import { DialogHeader } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { X, Loader2, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { addListing } from '../redux/listingSlice.js';
import { toast } from "sonner";
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const libraries = ['places'];

const CreateListing = ({ open, setOpen }) => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    latitude: '',
    longitude: '',
    bedrooms: 1,
    bathrooms: 1,
    area: '',
    description: '',
    status: 'For Sale',
    propertyType: 'Apartment',
    furnished: 'Unfurnished',
    parking: false,
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const { user } = useSelector(store => store.auth);
  const { listings } = useSelector(store => store.listing);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef(null);
  const dispatch = useDispatch();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });
  
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setFormData(prev => ({
          ...prev,
          location: place.formatted_address || place.name,
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng()
        }));
      }
    }
  };

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
    const formDataToSend = new FormData(); 
  
    formDataToSend.append("title", formData.title);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("location", formData.location);
    if (formData.latitude) formDataToSend.append("latitude", formData.latitude);
    if (formData.longitude) formDataToSend.append("longitude", formData.longitude);
    formDataToSend.append("bedrooms", formData.bedrooms);
    formDataToSend.append("bathrooms", formData.bathrooms);
    formDataToSend.append("area", formData.area);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("propertyType", formData.propertyType);
    formDataToSend.append("furnished", formData.furnished);
    formDataToSend.append("parking", formData.parking);
    
    formData.images.forEach((image) => formDataToSend.append("images", image));

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/property/addproperty",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        dispatch(addListing([res.data.data, ...(listings || [])]));
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

  if (!open) return null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />

        <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-gray-100 p-2 rounded-full cursor-pointer"
            >
              <X size={20} />
            </button>

            <DialogHeader className="text-xl text-center font-bold text-gray-900 mb-6">
              Create New Listing
            </DialogHeader>

            <div className="flex gap-3 items-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                <AvatarImage src={user?.profilePicture} alt="img" className="w-full h-full object-cover" />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-bold flex items-center justify-center w-full h-full">
                  {user?.username?.substring(0, 2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-bold text-gray-900">{user?.username}</h1>
                <span className="text-gray-500 text-sm">Listing a property as {user?.role}</span>
              </div>
            </div>

            <form className="space-y-4" onSubmit={createListingHandler}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Property Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Modern Apartment in City Center"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 5000000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Location (Google Maps Autocomplete)</label>
                {isLoaded ? (
                  <Autocomplete
                    onLoad={ref => autocompleteRef.current = ref}
                    onPlaceChanged={handlePlaceChanged}
                  >
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Start typing an address or landmark..."
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value, latitude: '', longitude: '' })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                        required
                      />
                    </div>
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                    required
                  />
                )}
                {formData.latitude && formData.longitude && (
                  <p className="text-xs text-green-600 font-medium">✓ Coordinates captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</p>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Bathrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Area (sqft)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Plot">Plot</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="Rent">Rent</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-600">Furnishing</label>
                  <select
                    value={formData.furnished}
                    onChange={(e) => setFormData({ ...formData, furnished: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  >
                    <option value="Unfurnished">Unfurnished</option>
                    <option value="Semi-Furnished">Semi-Furnished</option>
                    <option value="Furnished">Furnished</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <input
                    type="checkbox"
                    id="parking"
                    checked={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="parking" className="text-sm font-semibold text-gray-700 cursor-pointer">
                    Parking Available
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600">Description</label>
                <Textarea
                  placeholder="Describe your property..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="h-24 resize-none border-gray-200 focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">Images</label>
                  <Button
                    type="button"
                    onClick={() => imageRef.current.click()}
                    variant="outline"
                    className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                  >
                    + Add Images
                  </Button>
                </div>
                <input
                  ref={imageRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={fileChangeHandler}
                />
                
                {previewImages.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {previewImages.map((img, index) => (
                      <div key={index} className="relative min-w-[100px] h-[100px] rounded-lg overflow-hidden border border-gray-200">
                        <img src={img} alt={`preview-${index}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                {previewImages.length > 0 ? (
                   <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all cursor-pointer"
                    disabled={loading}
                   >
                     {loading ? (
                       <>
                         <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                         Publishing Listing...
                       </>
                     ) : (
                       "Publish Property Listing"
                     )}
                   </Button>
                ) : (
                  <p className="text-center text-sm text-red-500 font-medium">Please upload at least one image to post.</p>
                )}
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CreateListing;