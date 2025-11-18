import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const fetchCredits = createAsyncThunk('credits/fetchAll', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.get('/api/credits', getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export const markAsPaid = createAsyncThunk('credits/markPaid', async (id, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.put(`/api/credits/${id}`, { isPaid: true }, getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const creditSlice = createSlice({
  name: 'credits',
  initialState: {
    credits: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCredits.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCredits.fulfilled, (state, action) => {
        state.loading = false
        state.credits = action.payload
      })
      .addCase(fetchCredits.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(markAsPaid.fulfilled, (state, action) => {
        const index = state.credits.findIndex(c => c._id === action.payload._id)
        if (index !== -1) {
          state.credits[index] = action.payload
        }
      })
  },
})

export default creditSlice.reducer
