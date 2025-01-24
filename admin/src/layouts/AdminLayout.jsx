//layouts/AdminLayout.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, ChevronDown, Home, Users, 
  Settings, LogOut,
  Book,
  Folder,
  User,
  FileText,

} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import logiImage from '../assets/tahqiq.png';
import UpdateUserModal from '@/components/updateProfile';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { admin, logout } = useAuth();
  const location = useLocation();
  const profileRef = useRef(null);
  const sidebarRef = useRef(null);
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = () => {
    setIsLogoutDialogOpen(false);
    logout();
  };

  // Function to handle window resize
  const handleResize = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  };

  // Initialize sidebar state based on screen size and handle resize
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (window.innerWidth < 1024 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: <Home size={24} />, label: 'Dashboard' },
    { path: '/admin/clients', icon: <Users size={24} />, label: 'Clients' },
    { path: '/admin/categories', icon: <Book size={24} />, label: 'Categories' },
    { path: '/admin/resources', icon: <Folder size={24} />, label: 'Resources' },
    { path: '/admin/users', icon: <User size={24} />, label: 'Users' },
    { path: '/admin/reports', icon: <FileText size={24} />, label: 'Reports' },
  ];

  const staffMenuItems = [
    { path: '/staff/dashboard', icon: <Home size={24} />, label: 'Dashboard' },
  ];

  const menuItems = admin?.role === 'admin' ? adminMenuItems : staffMenuItems;

 return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Overlay */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

     {/* Sidebar */}
<aside
  ref={sidebarRef}
  className={`
    fixed top-0 left-0 z-50 h-screen
    w-full max-w-[280px] sm:max-w-[260px]
    transform transition-transform duration-200 ease-in-out
    bg-background border-r
    lg:sticky lg:translate-x-0
    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
  `}
>
  {/* Logo Section */}
  <div className="flex items-center justify-between h-20 px-4 lg:px-6 border-b">
    {/* <img src={logiImage} alt="App Logo" className="h-12 sm:h-14 lg:h-16" /> */}
    <h1 className='text-xl'>SBL</h1>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsSidebarOpen(false)}
      className="lg:hidden"
    >
      <X className="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>
  </div>

  {/* Navigation */}
  <nav className="space-y-1 px-2 sm:px-3 py-2 sm:py-3 overflow-y-auto h-[calc(100vh-5rem)]">
    {menuItems.map((item) => (
      <div key={item.path}>
        {item.submenu ? (
          <div>
            <button
              onClick={() => setOpenSubmenu(!openSubmenu)}
              className={`
                w-full flex items-center 
                px-3 sm:px-4 lg:px-6 
                py-2 sm:py-3 lg:py-4 
                rounded-lg
                transition-colors duration-200
                group relative text-sm sm:text-base lg:text-lg
                ${location.pathname.startsWith(item.path)
                  ? 'bg-red-50 text-red-700'
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              <span className="inline-flex items-center justify-center">
                {React.cloneElement(item.icon, {
                  size: window.innerWidth < 640 ? 18 : window.innerWidth < 1024 ? 20 : 24,
                })}
              </span>
              <span className="ml-2 sm:ml-3 lg:ml-4 font-medium">{item.label}</span>
              <ChevronDown
                className={`ml-auto transition-transform duration-200 ${
                  openSubmenu ? 'transform rotate-180' : ''
                }`}
                size={window.innerWidth < 640 ? 16 : 20}
              />
            </button>
            <div
              className={`
                overflow-hidden transition-all duration-300 ease-in-out
                ${openSubmenu ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`
                    flex items-center 
                    px-3 sm:px-4 lg:px-6 
                    py-2 sm:py-2.5 lg:py-3
                    rounded-lg ml-3 sm:ml-4
                    transition-colors duration-200
                    text-sm sm:text-base lg:text-lg font-medium
                    ${location.pathname === subItem.path
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  <span className="inline-flex items-center justify-center">
                    {React.cloneElement(subItem.icon, {
                      size: window.innerWidth < 640 ? 16 : window.innerWidth < 1024 ? 18 : 20,
                    })}
                  </span>
                  <span className="ml-2 sm:ml-3 lg:ml-4">{subItem.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <Link
            to={item.path}
            className={`
              flex items-center 
              px-3 sm:px-4 lg:px-6 
              py-2 sm:py-3 lg:py-4
              rounded-lg
              transition-colors duration-200
              group relative text-sm sm:text-base lg:text-lg
              ${location.pathname === item.path
                ? 'bg-red-50 text-red-700'
                : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            <span className="inline-flex items-center justify-center">
              {React.cloneElement(item.icon, {
                size: window.innerWidth < 640 ? 18 : window.innerWidth < 1024 ? 20 : 24,
              })}
            </span>
            <span className="ml-2 sm:ml-3 lg:ml-4 font-medium">{item.label}</span>
          </Link>
        )}
      </div>
    ))}
  </nav>
</aside>


      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 sm:h-18 lg:h-20 items-center px-4 lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="ml-auto flex items-center gap-2 sm:gap-3 lg:gap-4">
              <ThemeToggle />
              <Separator orientation="vertical" className="h-6 sm:h-7 lg:h-8" />
              
              

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-xs sm:text-sm">
                        {admin?.username?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{admin?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {admin?.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={(e) => {
  e.preventDefault();
  setShowProfileModal(true);
}}>
  <Settings className="mr-2 h-4 w-4" />
  <span>Profile</span>
</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
  <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
    <AlertDialogTrigger asChild>
      <DropdownMenuItem
        onSelect={(e) => {
          e.preventDefault();
        }}
        className="text-destructive"
      >
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
        <AlertDialogDescription>
          You will be returned to the login screen.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleLogout}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          Log out
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-muted/50">
          <div className="p-3 sm:p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
{showProfileModal && (
  <UpdateUserModal
    user={admin}
    onClose={() => setShowProfileModal(false)}
    onUserUpdated={(updatedUser) => {
      // Update the user context or state here
      setShowProfileModal(false);
    }}
  />
)}
    </div>
    
  );
  
};

export default AdminLayout;