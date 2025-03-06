// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Update the interceptor to handle errors consistently
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page and it's not a login request
      if (
        window.location.pathname !== "/login" &&
        !error.config.url.includes("/login")
      ) {
        window.location.href = "/login";
      }
    }

    // Format error message
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    const formattedError = new Error(errorMessage);
    formattedError.status = error.response?.status;
    formattedError.data = error.response?.data;
    formattedError.response = error.response;

    // Add validation errors if present
    if (error.response?.data?.errors) {
      formattedError.validationErrors = error.response.data.errors;
    }

    return Promise.reject(formattedError);
  }
);

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login/admin", { email, password });
    if (!response.data.success) {
      throw new Error(response.data.error || "Login failed");
    }
    return {
      admin: response.data.admin,
      message: response.data.message,
    };
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    if (!response.data.success) {
      throw new Error(response.data.error || "Logout failed");
    }
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const getUploadsUrl = (cloudinaryUrl) => {
  return cloudinaryUrl; // Cloudinary URLs are already fully qualified
};

//generate code to connect to the backend api of get current admin
export const getCurrentAdmin = async () => {
  try {
    const response = await api.get("/auth/me/admin");
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to get admin data");
    }
    return {
      admin: response.data.admin,
      message: response.data.message,
    };
  } catch (error) {
    throw error;
  }
};

export const updateAdminProfile = async (data) => {
  try {
    const response = await api.put("/auth/admin/profile", data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update profile");
    }
    return {
      admin: response.data.admin,
      message: response.data.message,
    };
  } catch (error) {
    // Add validation error handling
    if (error.response?.data?.errors) {
      error.validationErrors = error.response.data.errors;
    }
    throw error;
  }
};

// Category Management API Methods
export const fetchCategories = async (params = {}) => {
  try {
    const response = await api.get("/admin/categories", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch categories");
    }
    return {
      categories: response.data.data,
      total: response.data.total,
      totalPages: response.data.totalPages,
      page: response.data.page,
      limit: response.data.limit,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchCategoryById = async (id) => {
  try {
    const response = await api.get(`/admin/categories/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch category");
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createCategory = async (data) => {
  try {
    const response = await api.post("/admin/categories", data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create category");
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateCategory = async (id, data) => {
  try {
    const response = await api.put(`/admin/categories/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update category");
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    const response = await api.delete(`/admin/categories/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete category");
    }
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

// User Management API Methods
export const fetchUsers = async (params = {}) => {
  try {
    const response = await api.get("/admin/users", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch users");
    }
    return {
      users: response.data.data,
      total: response.data.total,
      totalPages: response.data.totalPages,
      page: response.data.page,
      limit: response.data.limit,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchUserById = async (id) => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch user");
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (data) => {
  try {
    const response = await api.post("/admin/users", data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create user");
    }
    return response.data.data;
  } catch (error) {
    // Add validation error handling
    if (error.response?.data?.errors) {
      error.validationErrors = error.response.data.errors;
    }
    throw error;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/admin/users/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update user");
    }
    return response.data.data;
  } catch (error) {
    // Add validation error handling
    if (error.response?.data?.errors) {
      error.validationErrors = error.response.data.errors;
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/admin/users/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete user");
    }
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

// Admin Management API Methods
export const fetchAdmins = async (params = {}) => {
  try {
    const response = await api.get("/admin/admins", { params });
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch admins");
    }
    return {
      admins: response.data.data,
      total: response.data.total,
      totalPages: response.data.totalPages,
      page: response.data.page,
      limit: response.data.limit,
    };
  } catch (error) {
    throw error;
  }
};

export const fetchAdminById = async (id) => {
  try {
    const response = await api.get(`/admin/admins/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to fetch admin");
    }
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createAdmin = async (data) => {
  try {
    const response = await api.post("/admin/admins", data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to create admin");
    }
    return response.data.data;
  } catch (error) {
    // Add validation error handling
    if (error.response?.data?.errors) {
      error.validationErrors = error.response.data.errors;
    }
    throw error;
  }
};

export const updateAdmin = async (id, data) => {
  try {
    const response = await api.put(`/admin/admins/${id}`, data);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to update admin");
    }
    return response.data.data;
  } catch (error) {
    // Add validation error handling
    if (error.response?.data?.errors) {
      error.validationErrors = error.response.data.errors;
    }
    throw error;
  }
};

export const deleteAdmin = async (id) => {
  try {
    const response = await api.delete(`/admin/admins/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.error || "Failed to delete admin");
    }
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export default api;
