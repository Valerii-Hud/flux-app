import axios from 'axios';
const NODE_ENV = 'production';
const BASE_URL =
  NODE_ENV === 'production'
    ? 'https://flux-app-fvu2.onrender.com/signup'
    : 'http://localhost:5000/';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
export default axiosInstance;
