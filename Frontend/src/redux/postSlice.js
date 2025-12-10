import { createSlice } from "@reduxjs/toolkit";
const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    featuredProperties: [], // Add this
    // ... other existing state fields
    selectedPost: null,
  },
  reducers: {
    //actions
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
    setFeaturedProperties: (state, action) => {
      state.featuredProperties = action.payload;
    },
  },
});
export const { setPosts, setSelectedPost, setFeaturedProperties } = postSlice.actions;
export default postSlice.reducer;
