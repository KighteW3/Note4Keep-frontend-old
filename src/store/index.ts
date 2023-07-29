import { configureStore } from "@reduxjs/toolkit";
import refreshNotesReducer from "./refreshNotes";
import userInfoReducer from "./userInfo";

export const store = configureStore({
  reducer: {
    refreshNotes: refreshNotesReducer,
    userInfo: userInfoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
