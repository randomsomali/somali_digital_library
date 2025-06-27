// lib/api.ts 
import axios, { AxiosError } from 'axios';
import { User } from './auth';
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

// Helper function to extract error message from backend response
const extractErrorMessage = (error: AxiosError): string => {
    if (error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
        return (error.response.data as { error: string }).error;
    }
    if (error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        return (error.response.data as { message: string }).message;
    }
    if (error.message) {
        return error.message;
    }
    return 'An unexpected error occurred';
};

// Registration function
export const registerUser = async (userData: {
    name: string;
    email: string;
    password: string;
}): Promise<void> => {
    try {
        await api.post('/auth/register/user', userData);
    } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = extractErrorMessage(axiosError);
        throw new ApiError(errorMessage, axiosError.response?.status);
    }
};

// Login functions for different user types
export const loginUser = async (email: string, password: string): Promise<void> => {
    try {
        await api.post('/auth/login/user', { email, password });
    } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = extractErrorMessage(axiosError);
        throw new ApiError(errorMessage, axiosError.response?.status);
    }
};

export const loginStudent = async (email: string, password: string, institutionId: string): Promise<void> => {
    try {
        await api.post('/auth/login/user', {
            email,
            password,
            institution_id: institutionId
        });
    } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = extractErrorMessage(axiosError);
        throw new ApiError(errorMessage, axiosError.response?.status);
    }
};

export const loginInstitution = async (email: string, password: string): Promise<void> => {
    try {
        await api.post('/auth/login/institution', { email, password });
    } catch (error) {
        const axiosError = error as AxiosError;
        const errorMessage = extractErrorMessage(axiosError);
        throw new ApiError(errorMessage, axiosError.response?.status);
    }
};

export const logout = async (): Promise<void> => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Logout error:', error);
        const errorMessage = extractErrorMessage(axiosError);
        throw new ApiError(errorMessage, axiosError.response?.status);
    }
};

// Get current user based on type
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data } = await api.get('/auth/me/user');
        return data.user;
    } catch (error) {
        // Don't call logout here, let AuthContext handle it
        // Just return null for any error
        return null;
    }
};

export const getCurrentInstitution = async (): Promise<User | null> => {
    try {
        const { data } = await api.get('/auth/me/institution');
        return data.institution;
    } catch (error) {
        // Don't call logout here, let AuthContext handle it
        // Just return null for any error
        return null;
    }
};

// Define interface for institution response
interface InstitutionResponse {
    institution_id: string;
    name: string;
}

// Get institutions list for student registration
export const getInstitutions = async (): Promise<Array<{ id: string; name: string }>> => {
    try {
        const { data } = await api.get<{ data: InstitutionResponse[] }>('/admin/institutions/public');
        return data.data.map((inst: InstitutionResponse) => ({
            id: inst.institution_id,
            name: inst.name
        }));
    } catch (error) {
        console.error('Failed to fetch institutions:', error);
        return [];
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

// Download resource with subscription check
export async function downloadResource(id: string): Promise<{ download_url: string; message: string }> {
    try {
        const response = await api.post<{ success: boolean; data: { download_url: string; message: string } }>(`/resources/${id}/download`);
        if (!response.data.success) {
            throw new Error('Download failed');
        }
        return response.data.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
            throw new Error('Authentication required');
        }
        if (axiosError.response?.status === 403) {
            const errorData = axiosError.response.data as { error?: string };
            throw new Error(errorData?.error || 'Subscription required');
        }
        throw new Error('Download failed');
    }
}

// Define interface for subscription plan response
interface SubscriptionPlanResponse {
    subscription_id: number;
    name: string;
    type: string;
    price: number;
    duration_days: number;
}

// Get subscription plans for pricing page
export async function getSubscriptionPlans(): Promise<Array<{ subscription_id: number; name: string; type: string; price: number; duration_days: number }>> {
    try {
        const response = await api.get<{ success: boolean; data: SubscriptionPlanResponse[] }>('/resources/subscriptions/plans');
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch subscription plans:', error);
        return [];
    }
}

// Check if user has active subscription
export async function checkUserActiveSubscription(userId: string): Promise<boolean> {
    try {
        const response = await api.get<{ success: boolean; active: boolean }>(`/admin/user-subscriptions/user/${userId}/active`);
        return response.data.active;
    } catch {
        return false;
    }
}

// Check if institution has active subscription
export async function checkInstitutionActiveSubscription(institutionId: string): Promise<boolean> {
    try {
        const response = await api.get<{ success: boolean; active: boolean }>(`/admin/user-subscriptions/institution/${institutionId}/active`);
        return response.data.active;
    } catch {
        return false;
    }
}

export default api;