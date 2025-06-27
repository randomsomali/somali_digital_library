// Define the structure of the user (client) object
export interface User {
    id: string;
    email: string;
    name: string;
    type: "user" | "student" | "institution";
    role: string;
    sub_status: string;
    institution_id?: string | null;
    username?: string; // Keep for backward compatibility
    phone?: string; // Keep for backward compatibility
}

// Define the structure of the authentication context
export interface AuthContextType {
    user: User | null; // The current authenticated user or null if not authenticated
    login: (email: string, password: string, userType?: "user" | "student" | "institution", institutionId?: string) => Promise<void>; // Login function
    logout: () => Promise<void>; // Logout function
    register: (userData: { name: string; email: string; password: string; }) => Promise<void>; // Registration function
    loading: boolean; // Loading state
    isAuthenticated: boolean; // Whether the user is authenticated
    initializeAuth: () => Promise<void>; // Initialize auth state
    initialized: boolean; // Whether auth has been initialized
}