import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

export const host = 'localhost';

export const setToken = (token) => {
  if (token) {
    api.defaults.headers.Authorization = token;
  } else {
    delete api.defaults.headers.Authorization;
  }
};

export default api;
