import axiosConstructor from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axios = axiosConstructor.create({
  baseURL: BASE_URL,
  timeout: 6000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Перехватчик запросов: добавляем токен из localStorage
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Перехватчик ответов: возвращаем только `response.data`
axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;
