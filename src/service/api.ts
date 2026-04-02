import axios from 'axios';

// const API = axios.create({
//     baseURL: "https://simasn.pontianak.go.id",
//     timeout: 60000,
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//     }
// });

const API = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Tambahkan interceptor untuk logging
API.interceptors.request.use(
    (config) => {
        console.log(`📤 [${config.method?.toUpperCase()}] ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => {
        console.log(`📥 [${response.status}] ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('❌ Request Timeout:', error.config?.url);
        }
        console.error('❌ Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default API;