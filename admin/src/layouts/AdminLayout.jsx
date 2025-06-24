import React, { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Menu, X, ChevronDown, ChevronRight, Home, Users, 
  Settings, LogOut, Search, Bell,
  Book, Folder, UserRound, User, FileText,
  Building2, CreditCard, UserCog, School, BarChart, Activity,
  Command, Calendar, HelpCircle, PanelLeft, Shield, UserCircle,
  Zap, Star, TrendingUp, Database, Globe, ShieldCheck, Download
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
} from "@/components/ui/alert-dialog";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import UpdateAdminModal from '@/components/admin/UpdateAdminModal';
import NotificationDropdown from '@/components/notificationDropdown';
import { useToast } from '@/components/ui/use-toast';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [submenuPosition, setSubmenuPosition] = useState({});
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { toast } = useToast();

  const handleLogout = () => {
    setIsLogoutDialogOpen(false);
    logout();
  };

  // Handle coming soon features
  const handleComingSoon = (featureName) => {
    toast({
      title: "Coming Soon! 🚀",
      description: `${featureName} is currently under development and will be available soon.`,
      variant: "default",
    });
  };

  // Enhanced submenu toggle with position calculation
  const toggleSubmenu = (id, event) => {
    if (isSidebarCollapsed && event) {
      // Calculate the correct position for the submenu popup
      const buttonRect = event.currentTarget.getBoundingClientRect();
      setSubmenuPosition({
        id,
        top: buttonRect.top,
        left: buttonRect.right + 8 // 8px spacing from the main menu
      });
    }
    
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
      setIsSidebarCollapsed(false);
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
    // Close any open submenus when route changes
    setActiveSubmenu(null);
  }, [location.pathname]);

  // Close submenus when collapsing the sidebar
  useEffect(() => {
    if (isSidebarCollapsed) {
      setActiveSubmenu(null);
    }
  }, [isSidebarCollapsed]);

  const adminMenuItems = [
    { 
      id: 'dashboard', 
      path: '/admin/dashboard', 
      icon: <Home size={22} />, 
      label: 'Dashboard',
      badge: null
    },
    {
      id: 'content',
      icon: <Folder size={22} />,
      label: 'Content Management',
      submenu: [
        { path: '/admin/resources', icon: <FileText size={20} />, label: 'Resources' },
        { path: '/admin/categories', icon: <Book size={20} />, label: 'Categories' },
      ]
    },
    {
      id: 'users',
      icon: <Users size={22} />,
      label: 'User Management',
      submenu: [
        { path: '/admin/users', icon: <User size={20} />, label: 'Users' },
        { path: '/admin/authors', icon: <UserRound size={20} />, label: 'Authors' },
        { path: '/admin/admins', icon: <UserCog size={20} />, label: 'Admins' },
      ]
    },
    { 
      id: 'institutions', 
      path: '/admin/institutions', 
      icon: <Building2 size={22} />, 
      label: 'Institutions',
      badge: null
    },
    { 
      id: 'subscriptions', 
      path: '/admin/subscriptions', 
      icon: <CreditCard size={22} />, 
      label: 'Subscription Plans',
      badge: null
    },
    { 
      id: 'user-subscriptions', 
      path: '/admin/user-subscriptions', 
      icon: <Activity size={22} />, 
      label: 'User Subscriptions',
      badge: null
    },
    { 
      id: 'reports', 
    //   path: '/admin/reports', 
      icon: <BarChart size={22} />, 
      label: 'Reports & Analytics',
      badge: null,
      comingSoon: true
    },
  ];

  const staffMenuItems = [
    { id: 'dashboard', path: '/staff/dashboard', icon: <Home size={22} />, label: 'Dashboard' },
  ];

  const menuItems = admin?.role === 'admin' ? adminMenuItems : staffMenuItems;

  // Utility navigation items
  const utilityItems = [
    { id: 'settings', path: '/admin/settings', icon: <Settings size={22} />, label: 'Settings' },
    { id: 'help', path: '/admin/help', icon: <HelpCircle size={22} />, label: 'Help & Support' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleMenuClick = (item, subItem = null) => {
    const targetItem = subItem || item;
    
    if (targetItem.comingSoon) {
      handleComingSoon(targetItem.label);
      return;
    }
    
    if (targetItem.path && targetItem.path !== '#') {
      navigate(targetItem.path);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && windowWidth < 1024 && (
        <div
          className="fixed inset-0 bg-foreground/50 lg:hidden z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-card border-r transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-20" : "w-64",
          "lg:transform-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn(
          "flex h-16 items-center px-4 border-b",
          isSidebarCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-lg font-bold text-foreground">SBL Admin</h1>
            </div>
          )}
          
          {isSidebarCollapsed && (
            <Shield className="h-8 w-8 text-primary" />
          )}

          <div className="flex items-center">
            {/* Collapse toggle (desktop only) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex"
            >
              <PanelLeft className="h-5 w-5" />
            </Button>

            {/* Close button (mobile only) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-4 flex flex-col h-[calc(100%-4rem)] justify-between">
          <TooltipProvider delayDuration={isSidebarCollapsed ? 0 : 700}>
            <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
              {menuItems.map((item) => (
                <div key={item.id} className="py-1 relative">
                  {item.submenu ? (
                    <div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => toggleSubmenu(item.id, e)}
                            className={cn(
                              "w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors duration-200 group relative text-sm font-medium",
                              location.pathname.startsWith(`/admin/${item.id.toLowerCase()}`)
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted",
                              isSidebarCollapsed ? "justify-center" : ""
                            )}
                          >
                            <div className={cn("flex items-center", isSidebarCollapsed ? "justify-center w-full" : "")}>
                              <span className="inline-flex items-center justify-center">
                                {item.icon}
                              </span>
                              {!isSidebarCollapsed && (
                                <span className="ml-3 font-medium">{item.label}</span>
                              )}
                            </div>
                            
                            {!isSidebarCollapsed && (
                              <ChevronDown
                                className={cn("transition-transform duration-200", {
                                  "transform rotate-180": activeSubmenu === item.id
                                })}
                                size={18}
                              />
                            )}
                          </button>
                        </TooltipTrigger>
                        {isSidebarCollapsed && (
                          <TooltipContent side="right">
                            <p className="font-medium">{item.label}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>

                      {/* Submenu items - Positioned correctly in collapsed mode */}
                      {activeSubmenu === item.id && (
                        <div
                          className={cn(
                            "overflow-hidden transition-all duration-200 ease-in-out",
                            isSidebarCollapsed 
                              ? "absolute left-full top-0 ml-2 w-56 rounded-md border bg-popover shadow-md z-50" 
                              : "pl-4 mt-1"
                          )}
                          style={isSidebarCollapsed && submenuPosition.id === item.id ? {
                            top: `${submenuPosition.top}px`,
                            left: `${submenuPosition.left}px`,
                            position: 'fixed'
                          } : {}}
                        >
                          <div className={isSidebarCollapsed ? "p-2" : ""}>
                            {item.submenu.map((subItem) => (
                              <button
                                key={subItem.path}
                                onClick={() => handleMenuClick(item, subItem)}
                                className={cn(
                                  "w-full flex items-center px-3 py-2.5 rounded-md transition-colors duration-200 text-sm font-medium text-left",
                                  location.pathname === subItem.path
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                  subItem.comingSoon && "opacity-60 cursor-not-allowed"
                                )}
                                disabled={subItem.comingSoon}
                              >
                                <span className="inline-flex items-center justify-center">
                                  {subItem.icon}
                                </span>
                                <div className="ml-3 flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span>{subItem.label}</span>
                                    {subItem.comingSoon && (
                                      <Badge variant="secondary" className="text-xs">
                                        Soon
                                      </Badge>
                                    )}
                                  </div>
                                  {subItem.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {subItem.description}
                                    </p>
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleMenuClick(item)}
                          className={cn(
                            "w-full flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 group text-sm font-medium",
                            location.pathname === item.path
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted",
                            isSidebarCollapsed ? "justify-center" : ""
                          )}
                        >
                          <span className="inline-flex items-center justify-center">
                            {item.icon}
                          </span>
                          
                          {!isSidebarCollapsed && (
                            <>
                              <span className="ml-3 font-medium">{item.label}</span>
                              {item.badge && (
                                <Badge variant={item.badge.variant} className="ml-auto">
                                  {item.badge.text}
                                </Badge>
                              )}
                            </>
                          )}
                          
                          {/* Show badge in collapsed mode as a dot indicator */}
                          {isSidebarCollapsed && item.badge && (
                            <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full"></span>
                          )}
                        </button>
                      </TooltipTrigger>
                      {isSidebarCollapsed && (
                        <TooltipContent side="right">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{item.label}</p>
                            {item.badge && (
                              <Badge variant={item.badge.variant} className="text-xs">
                                {item.badge.text}
                              </Badge>
                            )}
                          </div>
                        </TooltipContent>
                      )}
                    </Tooltip>
                  )}
                </div>
              ))}
            </nav>
          </TooltipProvider>

          {/* User Profile Section at bottom */}
          <div className="px-3 mt-auto">
            {!isSidebarCollapsed ? (
              <div className="p-3 border-t">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(admin?.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 overflow-hidden">
                      <p className="text-sm font-medium truncate">{admin?.fullname}</p>
                      <p className="text-xs text-muted-foreground truncate">{admin?.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 border-t flex justify-center">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="h-10 w-10 cursor-pointer" onClick={() => navigate('/admin/profile')}>
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(admin?.fullname)}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div>
                        <p className="font-medium">{admin?.fullname}</p>
                        <p className="text-xs text-muted-foreground">{admin?.email}</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link
              to="/admin/dashboard"
              className="flex items-center gap-2 font-semibold hover:opacity-80"
            >
              <Shield className="h-6 w-6 text-primary" />
              <span className="hidden md:inline-block text-lg">
                SBL Admin Portal
              </span>
            </Link>

          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationDropdown />

            <ThemeToggle />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-label="User menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={admin?.avatar} alt={admin?.fullname} />
                    <AvatarFallback>{getInitials(admin?.fullname)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{admin?.fullname}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {admin?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {admin?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    setShowProfileModal(true);
                  }}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                      }}
                      className="text-destructive focus:text-destructive"
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
        </header>

        {/* Page Title & Breadcrumb Area */}
        <div className="bg-card/40 border-b px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              {/* Dynamic title based on current route */}
              {location.pathname.split('/').pop().charAt(0).toUpperCase() + 
               location.pathname.split('/').pop().slice(1)}
            </h1>

            {/* Optional breadcrumbs */}
            <nav className="flex items-center text-sm text-muted-foreground">
              <Link to="/admin/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <ChevronRight className="mx-1 h-4 w-4" />
              <span className="font-medium text-foreground capitalize">
                {location.pathname.split('/').pop()}
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
        
        {/* Footer */}
        <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SBL Admin Portal. All rights reserved.</p>
        </footer>
      </div>

      {/* Update Profile Modal */}
      <UpdateAdminModal
        admin={admin}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};

export default AdminLayout;