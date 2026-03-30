// src/service/api.ts
import axios from 'axios';

const API = axios.create({
    baseURL: "https://simasn.pontianak.go.id/api/",
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor untuk request
API.interceptors.request.use(
    (config) => {
        // Tambahkan token jika diperlukan
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor untuk response
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.log('Unauthorized, redirect to login');
        }
        return Promise.reject(error);
    }
);

export default API;