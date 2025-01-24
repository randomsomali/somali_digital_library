// src/App.jsx
import { Navigate, RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Clients from './pages/admin/Clients';
import Resources from './pages/admin/Resources';
import ProjectDetails from './pages/admin/projectdetails';
import Categories from './pages/admin/Categories';

import Users from './pages/admin/Users';

import Reports from './pages/admin/Reports';
import StaffDashboard from './pages/staff/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import NewResource from './pages/admin/AddResource';

import NotFound from './components/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />, // Add this as the first route
  },
  {
    path: '/admin',
   element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
  children: [
    { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'clients', element: <Clients /> },
      { path: 'categories', element: <Categories /> },
      { path: 'resources', element: <Resources /> },
      { path: 'projects/:id', element: <ProjectDetails /> },  // Dynamic route for project details
      { path: 'resources/add', element: <NewResource /> },  // Dynamic route for project details

      { path: 'users', element: <Users /> },
      { path: 'reports', element: <Reports /> },
    ],
  },
  {
    path: '/staff',
     element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
  children: [
    { index: true, element: <Navigate to="/staff/dashboard" replace /> },
    {
        path: 'dashboard',
        element: <StaffDashboard />,
      },

    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*', // Wildcard route
    element: <NotFound />,
  },

]);

const App = () => {
  return <RouterProvider  router={router} />;
};

export default App;