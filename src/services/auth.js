import api from '../helper/axiosHelper';
import axios from 'axios';

//Manda a generar codigo de autenticación en dos pasos.
export const generateAuthCode = async (phone) => {
    try {
        const response = await api.post(`${import.meta.env.VITE_AUTH_API_URL}auth/get-code`, { user: phone });
        return response.data;
    } catch (error) {
        throw error;
    }
}

//Verifica el codigo de autenticación en dos pasos.
export const verifyAuthCode = async (phone, code) => {
    try {
        const response = await api.post(`${import.meta.env.VITE_AUTH_API_URL}auth/verify`, { user: phone, code: code });
        return response.data;
    } catch (error) {
        throw error;
    }
}

//
export const refreshTokenSession = async (refreshToken) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_KEYCLOAK_API_URL}/${import.meta.env.VITE_KEYCLOAK_REALM}/${import.meta.env.VITE_KEYCLOAK_CLIENT_ID}/validate-session`, { refreshToken: refreshToken });
        return response.data;
    } catch (error) {
        throw error;
    }
}