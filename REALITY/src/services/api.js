import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Interceptor to attach token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('aiauto_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('aiauto_token', response.data.token);
            localStorage.setItem('aiauto_user', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('aiauto_token');
        localStorage.removeItem('aiauto_user');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('aiauto_user');
        return user ? JSON.parse(user) : null;
    }
};

export const signupService = {
    signup: async (userData) => {
        const response = await api.post('/signup', userData);
        if (response.data._id) {
            localStorage.setItem('userId', response.data._id);
            localStorage.setItem('userName', response.data.name);
        }
        return response.data;
    },
    getUserId: () => {
        return localStorage.getItem('userId');
    },
    getUserName: () => {
        return localStorage.getItem('userName');
    }
};

export const dashboardService = {
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },
};

export const leadService = {
    getAll: async () => {
        const response = await api.get('/lead');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/lead', data);
        return response.data;
    },
    getAnalytics: async (filters) => {
        const response = await api.get('/lead/analytics', { params: filters });
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/lead/${id}`, data);
        return response.data;
    },
};

export const taskService = {
    getAll: async () => {
        const response = await api.get('/tasks');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/tasks', data);
        return response.data;
    }
};

export const materialService = {
    getAll: async () => {
        const response = await api.get('/materials');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/materials', data);
        return response.data;
    }
};

export const attendanceService = {
    getAll: async () => {
        const response = await api.get('/attendance');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/attendance', data);
        return response.data;
    }
};

export const expenseService = {
    getAll: async () => {
        const response = await api.get('/expenses');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/expenses', data);
        return response.data;
    }
};

export const projectService = {
    getAll: async () => {
        const response = await api.get('/projects');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/projects', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/projects/${id}`, data);
        return response.data;
    }
};

export const visitService = {
    getAll: async () => {
        const response = await api.get('/site-visits');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/site-visits', data);
        return response.data;
    },
    updateStatus: async (id, status) => {
        const response = await api.patch(`/site-visits/${id}`, { status });
        return response.data;
    }
};

export const chatService = {
    sendMessage: async (messageData) => {
        const response = await api.post('/chat', messageData);
        return response.data;
    },
};

export const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/users', data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.patch(`/users/${id}`, data);
        return response.data;
    }
};

export const paymentService = {
    getAll: async () => {
        const response = await api.get('/payments');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/payments', data);
        return response.data;
    }
};

export const milestoneService = {
    getAll: async () => {
        const response = await api.get('/milestones');
        return response.data;
    },
    create: async (data) => {
        const response = await api.post('/milestones', data);
        return response.data;
    }
};

export default api;
