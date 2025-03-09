import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.31.14:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (email: string, password: string) => {
    try {
        const response = await api.post('/register', { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await api.post('/login', { email, password });
        return response.data;
    } catch (error: any) {
        throw error.response?.data?.message || 'Login failed';
    }
};

export default api;