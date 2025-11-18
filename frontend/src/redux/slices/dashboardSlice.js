import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const fetchDashboardStats = createAsyncThunk('dashboard/fetchStats', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.get('/api/dashboard/stats', getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export default dashboardSlice.reducer
