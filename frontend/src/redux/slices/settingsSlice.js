import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.get('/api/settings', getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export const updateSettings = createAsyncThunk('settings/update', async (settingsData, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.put('/api/settings', settingsData, {
      headers: {
        Authorization: `Bearer ${auth.user.token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false
        state.settings = action.payload
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settings = action.payload
      })
  },
})

export default settingsSlice.reducer
