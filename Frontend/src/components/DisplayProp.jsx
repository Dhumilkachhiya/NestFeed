import React, { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";
import { Loader2 } from "lucide-react";

const DisplayProp = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("http://localhost:8000/api/v1/property/getproperty")
            .then(res => {
                if (res.data.success && Array.isArray(res.data.data)) {
                  setProperties(res.data.data);
                } else if (Array.isArray(res.data)) {
                  setProperties(res.data);
                }
            })
            .catch(error => console.error("Error fetching properties:", error))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Trending Properties</h1>
                <p className="text-gray-500 mt-2">Discover the most sought-after real estate in your area.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map(property => (
                        <PropertyCard key={property._id} property={property} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-500 text-lg">No properties available at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default DisplayProp;
