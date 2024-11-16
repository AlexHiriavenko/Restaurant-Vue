import axiosConstructor from 'axios';

const axios = axiosConstructor.create({
  baseURL: 'http://localhost:8080/api/',
  timeout: 6000
  // headers: {
  //   'Content-Type': 'application/json',
  //   authorization:
  // }
});

axios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Централизованная обработка ошибок
    if (error.response) {
      console.error(
        'Ошибка на сервере:',
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error('Сервер не отвечает:', error.request);
    } else {
      console.error('Ошибка при настройке запроса:', error.message);
    }

    // можно передавать ошибку дальше, если нужно
    return Promise.reject(error);
  }
);

export default axios;
