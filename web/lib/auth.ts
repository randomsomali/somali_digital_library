// Define the structure of the user (client) object
export interface Client {
    id: number; // or whatever type your user ID is
    username: string;
    phone: string;
    // Add any other user properties you need
}

// Define the structure of the authentication context
export interface AuthContextType {
    client: Client | null; // The current authenticated user or null if not authenticated
    login: (username: string, password: string) => Promise<void>; // Login function
    logout: () => Promise<void>; // Logout function
    // register: (clientData: { username: string; password: string; phone: string; }) => Promise<void>; // Registration function
    loading: boolean; // Loading state
    isAuthenticated: boolean; // Whether the user is authenticated
}