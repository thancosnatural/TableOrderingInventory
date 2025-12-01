import axios from 'axios';
import { getToken } from './cookieUtils';

export const API_BASE_URL = 'http://localhost:3000/api/v1';

// export const API_BASE_URL = 'https://thancosserver.thancosnatural.com/api/v1'

export const apiStatusConstants = {
    INITIAL: 'INITIAL',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    IN_PROGRESS: 'IN_PROGRESS',
};

// JSON client
export const apiClientJson = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Form data client
export const apiClientForm = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'multipart/form-data' },
});

// Default client
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to dynamically inject the token
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;