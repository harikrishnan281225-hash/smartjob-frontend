import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request Interceptor: Attach Token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle Unauthorized access
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error("Auth error detected, redirecting to login.");
            localStorage.clear(); 
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// --- JOB MANAGEMENT ---
export const getAllJobs = () => api.get('/jobs/all'); 
export const getAssignedJobs = () => api.get('/jobs/assigned');
export const postNewJob = (jobData) => api.post('/admin/post-job', jobData);
export const assignJob = (assignmentData) => api.post('/admin/assign-job', assignmentData);
export const updateJobStatus = (jobId, status) => api.put(`/jobs/${jobId}/status`, { status });

export const applyForJob = (jobData) => api.post('/jobs/add', jobData);

// --- ADMIN USER MANAGEMENT ---
export const getAllUsers = () => api.get('/admin/users'); 
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const getUserById = (userId) => api.get(`/admin/user-profile-stats/${userId}`); // Updated to match AdminController

// --- MESSAGING & BROADCAST ---
// FIXED: Path updated to /messages/admin/broadcast to match MessageController
export const sendBroadcast = (broadcastData) => api.post('/messages/admin/broadcast', broadcastData);
export const getAllMessagesForAdmin = () => api.get('/messages/admin/all-messages');
export const getMyMessages = () => api.get('/messages/inbox');
export const markMessageAsRead = (id) => api.put(`/messages/mark-as-read/${id}`);
export const sendMessage = (messageData) => api.post('/messages/admin/send', messageData);

// --- DASHBOARD ---
export const getAdminStats = () => api.get('/admin/dashboard-stats');

export default api;