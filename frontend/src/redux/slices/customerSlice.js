import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.get('/api/customers', getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export const createCustomer = createAsyncThunk('customers/create', async (customerData, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.post('/api/customers', customerData, getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false
        state.customers = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload)
      })
  },
})

export default customerSlice.reducer
