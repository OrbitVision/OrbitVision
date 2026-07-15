import axios from "axios";

const SERVER_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5258';

const axiosInstance = axios.create({
    baseURL: SERVER_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes("/login") && error.response.status == 401) {
            return Promise.reject(error);
        }

        if (error.response.status == 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log("Trying to refresh token")
            try {
                await axiosInstance.post("/api/auth/refresh");
                //console.log("Refreshed token");
                return axiosInstance(originalRequest);
            } catch (err) {
                //const logoutEvent = new CustomEvent("force-logout")
                //window.dispatchEvent(logoutEvent)
                return Promise.reject(err)
            }
        }
        return Promise.reject(error)
    }
)

export default axiosInstance;