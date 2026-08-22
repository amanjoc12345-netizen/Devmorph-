import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || 'https://devmorphs.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export default api;
