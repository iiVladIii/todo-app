import axios from 'axios';

export const $api = axios.create({
    baseURL: __API__,
    headers: {
        'Content-Type': 'application/json',
    },
});

$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || undefined;
    if (config.headers) {
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
