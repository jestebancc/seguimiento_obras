import axios from 'axios';
import { refreshTokenSession } from '../services/auth';

let currentAuthContextData = null;
export const setAuthContextData = (data) => {
    currentAuthContextData = data;
};


export const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL: baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
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
                                // Update tokens
                                currentAuthContextData.access_token = refreshResponse.access_token;
                                if (refreshResponse.refresh_token) {
                                    currentAuthContextData.refresh_token = refreshResponse.refresh_token;
                                }

                                // Update header and retry request
                                //originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.access_token}`;
                                //return instance(originalRequest);
                            }
                        }
                    }
                } catch (e) {
                    console.log("Error refreshing token", e);
                }

                // If refresh fails or no refresh token, logout
                // Force a complete page reload to reset the React Context memory
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                } else {
                    window.location.reload();
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

const axiosInstance = createAxiosInstance();

export default axiosInstance;
