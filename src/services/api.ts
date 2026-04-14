import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.API_BASE_URL,
  timeout: parseInt(Constants.expoConfig?.extra?.API_TIMEOUT || '30000', 10),
  headers: {
    'Content-Type': 'application/json',
  },
});
// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token (implement token refresh logic in your backend)
        const response = await axios.post(`${Constants.expoConfig?.extra?.API_BASE_URL}/auth/refresh`);
        const { token } = response.data.data;

        await AsyncStorage.setItem('authToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        await AsyncStorage.removeItem('authToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
