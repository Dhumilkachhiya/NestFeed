import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      console.log("Payload received:", action.payload);
      
      if (typeof action.payload === "function") {
        console.error("Non-serializable data detected in 'setAuthUser'!");
        return; // Prevent non-serializable data from being stored
      }

      state.user = action.payload;
    },
  },
});

export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;