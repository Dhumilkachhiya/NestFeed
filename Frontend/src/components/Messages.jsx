import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { MessageCircle, Send } from "lucide-react";
import axios from "axios";
import { setMessages } from "../redux/chatSlice";
import useGetAllMessage from "../hooks/useGetAllMessage";
import useGetRTM from "../hooks/useGetRTM";

const Messages = () => {
  const { user } = useSelector((store) => store.auth);
  const { messages } = useSelector((store) => store.chat);
  const { onlineUsers } = useSelector((store) => store.socketio);
  const dispatch = useDispatch();
  
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [text, setText] = useState("");

  useGetAllMessage(selectedUser?._id);
  useGetRTM();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/users/suggested",
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setSuggestedUsers(res.data.data || []);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
    
    return () => {
      dispatch(setMessages([]));
    }
  }, [dispatch]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/message/send/${selectedUser?._id}`,
        { message: text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.data]));
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex w-full h-screen border-l border-gray-200">
      <div className="w-1/3 border-r border-gray-200 h-full flex flex-col">
        <div className="p-5 font-bold text-xl border-b border-gray-200 sticky top-0 bg-white">
          {user?.username}
        </div>
        <div className="overflow-y-auto flex-1">
          {suggestedUsers.map((u) => {
            const isOnline = onlineUsers.includes(u._id);
            return (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`flex gap-3 items-center p-4 cursor-pointer hover:bg-gray-50 transition ${
                  selectedUser?._id === u._id ? "bg-gray-100" : ""
                }`}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={u.profilePicture} />
                    <AvatarFallback>{u.username?.[0]}</AvatarFallback>
                  </Avatar>
                  {isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{u.username}</span>
                  <span className={`text-xs ${isOnline ? "text-green-500" : "text-gray-400"}`}>
                    {isOnline ? "Active now" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-2/3 h-full flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex items-center gap-3 p-4 border-b border-gray-200">
              <Avatar className="w-10 h-10">
                <AvatarImage src={selectedUser.profilePicture} />
                <AvatarFallback>{selectedUser.username?.[0]}</AvatarFallback>
              </Avatar>
              <div className="font-semibold">{selectedUser.username}</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.senderId === user?._id ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl ${
                      msg.senderId === user?._id
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={sendMessageHandler}
              className="p-4 border-t border-gray-200 flex gap-2 items-center bg-white"
            >
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Message..."
                className="flex-1 p-2 border border-gray-300 rounded-full outline-none focus:border-gray-500 px-4"
              />
              <Button
                type="submit"
                disabled={!text.trim()}
                className="bg-blue-500 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center hover:bg-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageCircle className="w-24 h-24 mb-4 text-gray-300" />
            <h1 className="text-xl font-semibold mb-2">Your Messages</h1>
            <p className="text-sm">Send private photos and messages to a friend or group.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
