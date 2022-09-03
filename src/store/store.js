import { createSlice, configureStore } from '@reduxjs/toolkit'

const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    access: "",
    refresh: ""
  },
  reducers: {
    setToken: (state, value) => {
        state = value
    },
    getToken: state => state
  }
})

export const { setToken, getToken } = tokenSlice.actions

const store = configureStore({
  reducer: tokenSlice.reducer
})
