import axios from 'axios';

type NodeEnv = 'production' | 'development';

const NODE_ENV: NodeEnv = 'production';
const BASE_URL =
  NODE_ENV === 'development'
    ? 'https://flux-app-fvu2.onrender.com/'
    : 'http://localhost:5000/';
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
export default axiosInstance;
