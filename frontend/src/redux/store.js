import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import themeReducer from './slices/themeSlice'
import productReducer from './slices/productSlice'
import billReducer from './slices/billSlice'
import customerReducer from './slices/customerSlice'
import creditReducer from './slices/creditSlice'
import settingsReducer from './slices/settingsSlice'
import dashboardReducer from './slices/dashboardSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    products: productReducer,
    bills: billReducer,
    customers: customerReducer,
    credits: creditReducer,
    settings: settingsReducer,
    dashboard: dashboardReducer,
  },
})
