import axiosConstructor from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Создаём экземпляр axios для работы с FormData
const axiosFormData = axiosConstructor.create({
  baseURL: BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'multipart/form-data' // Устанавливаем тип контента по умолчанию
  }
});

// Перехватчик запросов: добавляем токен из localStorage
axiosFormData.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Перехватчик ответов: возвращаем только `response.data`
axiosFormData.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error)
);

export default axiosFormData;
