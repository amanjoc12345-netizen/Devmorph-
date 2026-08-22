import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASEURL || 'https://devmorph-4.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true
});

export default api;
