import axios from 'axios';
const BASE_URL = 'http://localhost:5000/';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
export default axiosInstance;
