import axios from "axios";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5258';

const axiosInstance = axios.create({
    baseURL: SERVER_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;