// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const login = async (username, password) => {
  const response = await api.post("/admins/login", { username, password }); // Adjusted to admin login
  return response.data;
};

export const logout = async () => {
  await api.post("/admins/logout"); // Adjusted to admin logout
};

export const getUploadsUrl = (cloudinaryUrl) => {
  return cloudinaryUrl; // Cloudinary URLs are already fully qualified
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put("/users/me", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to update profile");
  }
};

export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};
export const createUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
export const fetchFinancialData = async () => {
  const response = await api.get("/financial/monthly");
  return response.data;
};
export const fetchOrdersData = async () => {
  const response = await api.get("/financial/orders");
  return response.data;
};
export const fetchStatsData = async () => {
  const response = await api.get("/stats");
  return response.data;
};

// Client API functions
export const fetchClients = async () => {
  const response = await api.get("/clients");
  return response.data;
};

export const createClient = async (clientData) => {
  const response = await api.post("/clients", clientData);
  return response.data;
};

export const updateClient = async (id, clientData) => {
  const response = await api.put(`/clients/${id}`, clientData);
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};

export const getClientById = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return response.data;
};
// Categories API functions
export const fetchCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};
//fetch project api

export const fetchResources = async () => {
  try {
    const response = await api.get("/resources");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProjectById = async (id) => {
  const response = await api.get(`/resources/${id}`);
  return response.data;
};
export const updateProject = async (id, updatedProject) => {
  const response = await api.put(`/resources/${id}`, updatedProject);
  return response.data;
};
export const createResource = async (newProject) => {
  const response = await api.post(`/resources/`, newProject);
  return response.data;
};
export const deleteResource = async (id) => {
  try {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//CameraSetup
export const fetchCameraSetups = async () => {
  try {
    const response = await api.get("/camera-setups");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCameraSetupById = async (id) => {
  const response = await api.get(`/camera-setups/${id}`);
  return response.data;
};

export const updateCameraSetup = async (id, updatedCameraSetup) => {
  const response = await api.put(`/camera-setups/${id}`, updatedCameraSetup);
  return response.data;
};

export const createCameraSetup = async (newCameraSetup) => {
  const response = await api.post(`/camera-setups/`, newCameraSetup);
  return response.data;
};

export const deleteCameraSetup = async (id) => {
  try {
    const response = await api.delete(`/camera-setups/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//Service api

export const fetchServices = async () => {
  try {
    const response = await api.get("/services");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchCompletedServices = async () => {
  try {
    const response = await api.get("/services/completed");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServiceById = async (id) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};
export const updateService = async (id, updatedService) => {
  const response = await api.put(`/services/${id}`, updatedService);
  return response.data;
};
export const createService = async (newService) => {
  const response = await api.post(`/services/`, newService);
  return response.data;
};
export const deleteService = async (id) => {
  try {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//payments Api

export const fetchPayments = async () => {
  try {
    const response = await api.get("/payments");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchAccounts = async () => {
  try {
    const response = await api.get("/payments/accounts");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePayment = async (id) => {
  try {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// services/api.js
export const transferFunds = async (fromMethodId, toMethodId, amount) => {
  try {
    const response = await api.post("/payments/transfer", {
      fromMethodId,
      toMethodId,
      amount: parseFloat(amount),
    });
    return response.data;
  } catch (error) {
    // Extract error message and code from the response
    const errorMessage = error.response?.data?.message || "Transfer failed";
    const errorCode = error.response?.data?.code || "UNKNOWN_ERROR";

    // Create a custom error with additional information
    const customError = new Error(errorMessage);
    customError.code = errorCode;

    throw customError;
  }
};
//order APi
export const fetchServiceOrders = async () => {
  const response = await api.get("/orders/service");
  return response.data;
};

export const fetchProjectOrders = async () => {
  const response = await api.get("/orders/project");
  return response.data;
};

export const fetchCameraOrders = async () => {
  const response = await api.get("/orders/camera");
  return response.data;
};

// Get Order by ID
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// // Create a New Order
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders/add", orderData);
    return response.data;
  } catch (error) {
    // Return the error response in a consistent format
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.message ||
        "Failed to create order",
    };
  }
};

// // Update an Existing Order
export const updateOrder = async (id, orderData) => {
  const response = await api.put(`/orders/${id}`, orderData);
  try {
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to update order details");
  }
};
export const updateOrderStatus = async (id, orderData) => {
  const response = await api.put(`/orders/status/${id}`, orderData);
  return response.data;
};
export const updateOrderDates = async (updateData) => {
  try {
    const response = await api.post("/orders/details", updateData, {});
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to update order details");
  }
};

// Delete an Order with Validation
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
//apointments
export const fetchAppointments = async () => {
  try {
    const response = await api.get("/appointments");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createAppointment = async (appointmentData) => {
  try {
    const response = await api.post("/appointments", appointmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAppointment = async (id, appointmentData) => {
  try {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await api.delete(`/appointments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAvailableSlots = async (date) => {
  try {
    const response = await api.get(
      `/appointments/available-slots?date=${date}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
//reports
export const fetchReportData = async (reportType, filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const response = await api.get(`/reports/${reportType}?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

//user assigns
export const fetchUserAssigns = async () => {
  try {
    const response = await api.get("/userassigns");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createUserAssignment = async (assignmentData) => {
  try {
    const response = await api.post("/userassigns", assignmentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteUserAssign = async (assignId) => {
  try {
    const response = await api.delete(`/userassigns/${assignId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//Expenses assigns
export const fetchExpenses = async () => {
  try {
    const response = await api.get("/expenses");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createExpense = async (expenseData) => {
  try {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExpense = async (id, expenseData) => {
  try {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
//Staff APi
export const fetchStaffServices = async () => {
  try {
    const response = await api.get("/userassigns/services");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getStaffServiceById = async (id) => {
  const response = await api.get(`/userassigns/services/${id}`);
  return response.data;
};
export const fetchStaffStats = async () => {
  const response = await api.get(`/stats/staff/`);
  return response.data;
};
export const fetchStaffOrders = async () => {
  try {
    const response = await api.get("/userassigns/orders");
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getStaffOrderById = async (id) => {
  const response = await api.get(`/userassigns/orders/${id}`);
  return response.data;
};
export const UpdateOrderStaff = async (updateData) => {
  try {
    const response = await api.post("/orders/staff", updateData, {});
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to update order details");
  }
};
export const UpdateServiceResponse = async (updateData) => {
  try {
    const response = await api.put("/userassigns/update-response", updateData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || new Error("Failed to update service response")
    );
  }
};

export default api;
