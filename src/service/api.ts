// src/service/api.ts
import axios from 'axios';

const API = axios.create({
    baseURL: "https://simasn.pontianak.go.id",
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Tambahkan interceptor untuk logging
API.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('❌ Request Timeout:', error.config?.url);
        }
        return Promise.reject(error);
    }
);

export default API;