import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'auth_token'

const client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {}
  return config
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      SecureStore.deleteItemAsync(TOKEN_KEY)
    }
    return Promise.reject(error)
  },
)

export default client
