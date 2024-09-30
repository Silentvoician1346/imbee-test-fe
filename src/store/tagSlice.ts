import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TagState {
  selectedTag: string;
}

const initialState: TagState = {
  selectedTag: "",
};

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    setSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload;
    },
  },
});

export const { setSelectedTag } = tagSlice.actions;
export default tagSlice.reducer;
