import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const fetchBills = createAsyncThunk('bills/fetchAll', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.get('/api/bills', getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export const createBill = createAsyncThunk('bills/create', async (billData, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.post('/api/bills', billData, getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const billSlice = createSlice({
  name: 'bills',
  initialState: {
    bills: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false
        state.bills = action.payload
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.bills.unshift(action.payload)
      })
  },
})

export default billSlice.reducer
