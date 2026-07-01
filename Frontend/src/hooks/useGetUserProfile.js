import { useEffect, useState } from "react";
import axios from "axios";

const useGetUserProfile = (userId) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/users/${userId}/profile`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setProfileData(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  return profileData;
};

export default useGetUserProfile;
