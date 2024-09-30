import { configureStore } from "@reduxjs/toolkit";
import tagReducer from "./tagSlice";

const store = configureStore({
  reducer: {
    tags: tagReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
