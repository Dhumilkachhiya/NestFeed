import React, { useState, useEffect } from "react";
import axios from "axios";
import PropertyCard from "./PropertyCard";

const DisplayProp = () => {
    const [properties, setProperties] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/v1/property/getproperty")
            .then(res => {
                console.log("Fetched properties:", res.data); // Log data
                setProperties(res.data);
            })
            .catch(error => console.error("Error fetching properties:", error));
    }, []);

    return (
        <div className="property-grid">
            {properties.length > 0 ? (
                properties.map(property => (
                    <PropertyCard key={property._id} property={property} />
                ))
            ) : (
                <p>No data available</p>
            )}
        </div>
    );
};

export default DisplayProp;
