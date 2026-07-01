import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

const useGetAllMessage = (userId) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/message/get/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          // The API returns new ApiResponse(201,{messages:conversation?.messages},"")
          dispatch(setMessages(res.data.data.messages || []));
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      fetchAllMessages();
    }
  }, [userId, dispatch]);
};

export default useGetAllMessage;
