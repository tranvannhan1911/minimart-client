import { createSlice, configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

const drawerPlacement = createSlice({
  name: 'drawerPlacement',
  initialState: "right",
  reducers: {
    setPlacement: (state, value) => {
        state = value
    },
    getPlacement: state => state
  }
})

// export const { setToken, getToken } = tokenSlice.actions

const rootReducer = combineReducers({
  drawerPlacement,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer
})

export default store;
