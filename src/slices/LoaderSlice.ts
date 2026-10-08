// src/slices/LoaderSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const LoaderSlice = createSlice({
  name: "LoaderSlice",
  initialState: {
    count: 0,
    isLoading: false,
  },
  reducers: {
    showLoader: (state) => {
      state.count += 1;
      state.isLoading = true;
    },
    hideLoader: (state) => {
      state.count = Math.max(0, state.count - 1);
      state.isLoading = state.count > 0;
    },
  },
});

export const { showLoader, hideLoader } = LoaderSlice.actions;
export default LoaderSlice.reducer;
