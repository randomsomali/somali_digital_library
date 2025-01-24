// lib/api.ts
import axios from 'axios';
import { Client } from './auth';
import { ResourceType } from '@/types/dictionary';
export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    withCredentials: true, // Important for sending cookies
});

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
}; export const logout = async (): Promise<void> => {
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
}; interface ResourceFilters {
    category_id?: number;
    type?: string;
    year_of_publication?: number;
    language?: string;
    search?: string;
}

export const getResources = async (filters?: ResourceFilters): Promise<ResourceType[]> => {
    try {
        const queryParams = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value.toString());
            });
        }

        const { data } = await api.get(`/resources/filter?${queryParams.toString()}`);
        return data;
    } catch (error) {
        console.error('Error fetching resources:', error);
        throw new ApiError('Failed to fetch resources');
    }
};

export const getResourceById = async (id: string): Promise<ResourceType> => {
    try {
        const { data } = await api.get(`/resources/${id}`);
        return data;
    } catch (error) {
        console.error('Error fetching resource:', error);
        throw new ApiError('Failed to fetch resource');
    }
};

export default api;