import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Create the axios instance
const api = axios.create({
    baseURL: BASE_URL
    // REMOVED: 'Content-Type': 'application/json' 
    // Now Axios will automatically set the correct Content-Type for JSON (for PUT/POST) 
    // OR Multipart (for FormData) automatically.
});

// Interceptor: Automatically attaches token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If you are sending JSON, Axios usually sets the header for you.
    // If you ever need to force a header for a specific call, you can do it in the method itself.
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 1. Get Profile
export const getUserProfile = () => api.get('/profile/me');

// 2. Update Portfolio Details
export const updateProfile = (profileData) => api.put('/profile/details', profileData);

// 3. Upload Resume
// This will now work because 'Content-Type' is not forced to 'application/json'
export const uploadResume = (formData) => api.post('/profile/upload-resume', formData);

// 4. Change Password
export const changePassword = (currentPassword, newPassword) => 
    api.put('/profile/password', { currentPassword, newPassword });

export default api;