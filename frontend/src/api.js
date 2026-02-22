import axios from 'axios';

const API_URL = 'https://ludie-unstabilized-bernice.ngrok-free.dev/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return api(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            return new Promise(function (resolve, reject) {
                axios.post(API_URL + '/auth/refreshtoken', { refreshToken })
                    .then(({ data }) => {
                        localStorage.setItem('token', data.accessToken);
                        localStorage.setItem('refreshToken', data.refreshToken);
                        api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
                        originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
                        processQueue(null, data.accessToken);
                        resolve(api(originalRequest));
                    })
                    .catch((err) => {
                        processQueue(err, null);
                        localStorage.removeItem('token');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                        reject(err);
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    verifyAdminLogin: (data) => api.post('/auth/verify-admin-login', data),
    requestAdminAccess: (data) => api.post('/auth/request-admin-access', data),
    generateAdminOtp: (data) => api.post('/auth/root/generate-admin-otp', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const assessmentAPI = {
    getQuestions: () => api.get('/assessment/questions'),
    submitAssessment: (answers) => api.post('/assessment/submit', answers),
    getMyResults: () => api.get('/assessment/my-results'),
};

export const adminAPI = {
    createQuestion: (data) => api.post('/admin/questions', data),
    addOption: (questionId, data) => api.post(`/admin/questions/${questionId}/options`, data),
    deleteQuestion: (questionId) => api.delete(`/admin/questions/${questionId}`),
    getStats: () => api.get('/admin/stats'),
    getStudents: () => api.get('/admin/students'),
    deleteStudent: (userId) => api.delete(`/admin/students/${userId}`),
    // Mentorship
    assignStudent: (studentId) => api.post(`/admin/assign-student/${studentId}`),
    unassignStudent: (studentId) => api.post(`/admin/unassign-student/${studentId}`),
    sendMentorEmail: (studentId) => api.post(`/admin/send-mentor-email/${studentId}`),
    sendTask: (studentId, data) => api.post(`/admin/send-task/${studentId}`, data),
    getMyStudents: () => api.get('/admin/my-students'),
};

export const studentAPI = {
    getMyTasks: () => api.get('/student/my-tasks'),
    getMyMentor: () => api.get('/student/my-mentor'),
};

export default api;
