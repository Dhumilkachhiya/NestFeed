import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
  },
  reducers: {
    setSocket: (state, action) => {
      // We cannot store the actual socket connection inside redux because it's non-serializable.
      // However, for this project we'll just ignore the serializable warning.
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setSocket, setOnlineUsers } = socketSlice.actions;
export default socketSlice.reducer;
