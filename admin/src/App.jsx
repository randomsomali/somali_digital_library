// src/App.jsx
import { Navigate, RouterProvider } from 'react-router-dom';
import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import StaffDashboard from './pages/staff/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import Users from './pages/admin/Users';
import Admins from './pages/admin/Admins';
import Subscriptions from './pages/admin/Subscriptions';
import UserSubscriptions from './pages/admin/UserSubscriptions';
import Authors from './pages/admin/Authors';
import Institutions from './pages/admin/Institutions';
import InstitutionDetails from './pages/admin/InstitutionDetails';
import Resources from './pages/admin/Resources';
import NotFound from './components/NotFound';
import AddResource from './pages/admin/AddResource';
import ResourceDetails from './pages/admin/ResourceDetails';

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
      { path: 'categories', element: <Categories /> },
      { path: 'users', element: <Users /> },
      { path: 'admins', element: <Admins /> },
      { path: 'subscriptions', element: <Subscriptions /> },
      { path: 'user-subscriptions', element: <UserSubscriptions /> },
      { path: 'authors', element: <Authors /> },
      { path: 'institutions', element: <Institutions /> },
      { path: 'institutions/:id/details', element: <InstitutionDetails /> },
      { path: 'resources', element: <Resources /> },
      { path: 'resources/add', element: <AddResource /> },
      { path: 'resources/:id', element: <ResourceDetails /> },
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
