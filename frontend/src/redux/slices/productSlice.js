import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.get('/api/products', getConfig(auth.user.token))
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

export const createProduct = createAsyncThunk('products/create', async (productData, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.post('/api/products', productData, {
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

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    const { data } = await axios.put(`/api/products/${id}`, productData, {
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

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState()
    await axios.delete(`/api/products/${id}`, getConfig(auth.user.token))
    return id
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message)
  }
})

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p._id === action.payload._id)
        if (index !== -1) {
          state.products[index] = action.payload
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p._id !== action.payload)
      })
  },
})

export default productSlice.reducer
