import axios from 'axios';
import { refreshTokenSession } from '../services/auth';

let currentAuthContextData = null;
export const setAuthContextData = (data) => {
    currentAuthContextData = data;
};


export const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL: baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config) => {
            debugger;
            const token = currentAuthContextData?.access_token;
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            console.log("Error");
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            debugger;
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const userData = currentAuthContextData;
                    if (userData) {
                        const refreshToken = userData.refresh_token || userData.refreshToken;

                        if (refreshToken) {
                            const refreshResponse = await refreshTokenSession(refreshToken);

                            if (refreshResponse && refreshResponse.access_token) {
                                currentAuthContextData.access_token = refreshResponse.access_token;
                                if (refreshResponse.refresh_token) {
                                    currentAuthContextData.refresh_token = refreshResponse.refresh_token;
                                }
                            }
                        }
                    }
                } catch (e) {
                    console.log("Error refreshing token", e);
                }
                window.location.reload();
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
