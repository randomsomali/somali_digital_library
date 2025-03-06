// lib/api.ts
import axios from 'axios';
import { Client } from './auth';
import { Resource, ResourceFilters, PaginatedResponse, Category } from '@/types/resource';



const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api/v1',
    timeout: 30000, //30 seconds timeout 
    withCredentials: true, // Important for sending cookies
});

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
        });
        return Promise.reject(error);
    }
);

export class ApiError extends Error {
    constructor(message: string, public statusCode?: number, public errors?: unknown[]) {
        super(message);
        this.name = 'ApiError';
    }
}

export const registerClient = async (clientData: {
    username: string;
    password: string;
    phone: string;
}): Promise<void> => {
    try {
        await api.post('/users/register', clientData);
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Registration failed. Please try again.');
    }
};

export const login = async (username: string, password: string): Promise<void> => {
    try {
        await api.post('/users/login', {
            username,
            password,
        });
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError('Login failed. Please try again.');
    }
};

export const logout = async (): Promise<void> => {
    try {
        await api.post('/clients/logout');
    } catch (error) {
        console.error('Logout error:', error);
        throw new ApiError('Logout failed. Please try again.');
    }
};

export const getCurrentUser = async (): Promise<Client | null> => {
    try {
        const { data } = await api.get('/clients/me');
        return data;
    } catch {
        return null;
    }
};

export async function getResources(filters?: ResourceFilters & { page?: number; limit?: number }): Promise<PaginatedResponse<Resource>> {
    try {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== "all" && value !== "") {
                    params.append(key, value.toString());
                }
            });
        }

        const response = await api.get<PaginatedResponse<Resource>>(`/resources${params.toString() ? `?${params.toString()}` : ''}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch resources:', error);
        return {
            success: false,
            data: [],
            total: 0,
            totalPages: 0,
            page: 1,
            limit: 15
        };
    }
}
//get resource by id
export async function getResourceById(id: string): Promise<Resource> {
    try {
        const response = await api.get<{ success: boolean; data: Resource }>(`/resources/${id}`);
        if (!response.data.success || !response.data.data) {
            throw new Error('Resource not found');
        }
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch resource by id:', error);
        throw new Error('Resource not found');
    }
}

// Add category API call
export async function getCategories(): Promise<Category[]> {
    try {
        const response = await api.get<{ success: boolean; data: Category[] }>('/categories');
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export default api;