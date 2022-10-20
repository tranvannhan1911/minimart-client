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

const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setUser: (state, value) => {
      state.info = value.payload
    },
    getUser: state => state
  }
})

export const { setUser, getUser } = userSlice.actions

const rootReducer = combineReducers({
  drawerPlacement: drawerPlacement.reducer, 
  user: userSlice.reducer
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
