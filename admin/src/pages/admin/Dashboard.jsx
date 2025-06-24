import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Download, FileText, Folder, Book, School, 
  CreditCard, UserCog, UserRound, Building2, BarChart3,
  Activity, TrendingUp, Shield, RefreshCw, Plus,
  AlertCircle, CheckCircle, Clock, Eye, Settings,
  Wifi, WifiOff, Calendar, DollarSign, BookOpen
} from 'lucide-react';
import { 
  fetchResources, fetchUsers, fetchAdmins, fetchAuthors, 
  fetchCategories, fetchInstitutions, fetchSubscriptions 
} from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalResources: 0,
    totalUsers: 0,
    totalAdmins: 0,
    totalAuthors: 0,
    totalCategories: 0,
    totalInstitutions: 0,
    totalSubscriptions: 0,
    publishedResources: 0,
    premiumResources: 0,
    activeUsers: 0,
    activeInstitutions: 0
  });
  const [recentResources, setRecentResources] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    isOnline: true,
    lastUpdate: new Date()
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch all data in parallel
      const [
        resourcesData,
        usersData,
        adminsData,
        authorsData,
        categoriesData,
        institutionsData,
        subscriptionsData
      ] = await Promise.all([
        fetchResources({ page: 1, limit: 100 }),
        fetchUsers({ page: 1, limit: 100 }),
        fetchAdmins({ page: 1, limit: 100 }),
        fetchAuthors({ page: 1, limit: 100 }),
        fetchCategories({ page: 1, limit: 100 }),
        fetchInstitutions({ page: 1, limit: 100 }),
        fetchSubscriptions({ page: 1, limit: 100 })
      ]);

      // Calculate stats
      const totalResources = resourcesData.resources?.length || 0;
      const publishedResources = resourcesData.resources?.filter(r => r.status === 'published').length || 0;
      const premiumResources = resourcesData.resources?.filter(r => r.paid === 'premium').length || 0;
      
      const totalUsers = usersData.users?.length || 0;
      const activeUsers = usersData.users?.filter(u => u.sub_status === 'active').length || 0;
      
      const totalAdmins = adminsData.admins?.length || 0;
      const totalAuthors = authorsData.authors?.length || 0;
      const totalCategories = categoriesData.categories?.length || 0;
      const totalInstitutions = institutionsData.institutions?.length || 0;
      const activeInstitutions = institutionsData.institutions?.filter(i => i.sub_status === 'active').length || 0;
      const totalSubscriptions = subscriptionsData.subscriptions?.length || 0;

      setStats({
        totalResources,
        totalUsers,
        totalAdmins,
        totalAuthors,
        totalCategories,
        totalInstitutions,
        totalSubscriptions,
        publishedResources,
        premiumResources,
        activeUsers,
        activeInstitutions
      });

      // Get recent resources and users
      const recentRes = resourcesData.resources?.slice(0, 5) || [];
      const recentUsrs = usersData.users?.slice(0, 5) || [];
      
      setRecentResources(recentRes);
      setRecentUsers(recentUsrs);

      setSystemStatus({
        isOnline: true,
        lastUpdate: new Date()
      });

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setSystemStatus({
        isOnline: false,
        lastUpdate: new Date()
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Data for stat cards
  const statCards = [
    {
      title: "Total Resources",
      value: stats.totalResources,
      icon: BookOpen,
      description: `${stats.publishedResources} published`,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      route: "/admin/resources"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      description: `${stats.activeUsers} active subscriptions`,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      route: "/admin/users"
    },
    {
      title: "Institutions",
      value: stats.totalInstitutions,
      icon: School,
      description: `${stats.activeInstitutions} active subscriptions`,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      route: "/admin/institutions"
    },
    {
      title: "Premium Resources",
      value: stats.premiumResources,
      icon: DollarSign,
      description: `${Math.round((stats.premiumResources / stats.totalResources) * 100) || 0}% of total`,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      route: "/admin/resources"
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: Folder,
      description: "Resource categories",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      route: "/admin/categories"
    }
  ];

  // Data for navigation cards
  const navCards = [
    {
      title: "Resources",
      description: "Manage digital library resources",
      icon: BookOpen,
      link: "/admin/resources",
      color: "bg-blue-500/10",
      iconColor: "text-blue-500",
      count: stats.totalResources
    },
    {
      title: "Users",
      description: "Manage user accounts and subscriptions",
      icon: Users,
      link: "/admin/users",
      color: "bg-green-500/10",
      iconColor: "text-green-500",
      count: stats.totalUsers
    },
    {
      title: "Institutions",
      description: "Manage educational institutions",
      icon: School,
      link: "/admin/institutions",
      color: "bg-purple-500/10",
      iconColor: "text-purple-500",
      count: stats.totalInstitutions
    },
    {
      title: "Admins",
      description: "Manage admin accounts and permissions",
      icon: UserCog,
      link: "/admin/admins",
      color: "bg-red-500/10",
      iconColor: "text-red-500",
      count: stats.totalAdmins
    },
    {
      title: "Authors",
      description: "Manage resource authors",
      icon: UserRound,
      link: "/admin/authors",
      color: "bg-orange-500/10",
      iconColor: "text-orange-500",
      count: stats.totalAuthors
    },
    {
      title: "Subscriptions",
      description: "Manage subscription plans",
      icon: CreditCard,
      link: "/admin/subscriptions",
      color: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      count: stats.totalSubscriptions
    }
  ];

  // Helper functions for status badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Published</Badge>;
      case "unpublished":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Unpublished</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaidBadge = (paid) => {
    switch (paid) {
      case "premium":
        return <Badge variant="default" className="bg-amber-100 text-amber-800 hover:bg-amber-100">Premium</Badge>;
      case "free":
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Free</Badge>;
      default:
        return <Badge variant="outline">{paid}</Badge>;
    }
  };

  const getSubscriptionBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case "expired":
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      case "none":
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100">None</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          {systemStatus.isOnline ? (
            <span className="flex items-center text-xs text-green-600 dark:text-green-400">
              <Wifi className="h-3 w-3 mr-1" />
              System Online
            </span>
          ) : (
            <span className="flex items-center text-xs text-red-600 dark:text-red-400">
              <WifiOff className="h-3 w-3 mr-1" />
              System Offline
            </span>
          )}
          <Button onClick={fetchDashboardData} disabled={isLoading} variant="outline" size="sm">
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Welcome Card */}
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="bg-primary/10 p-3 rounded-full">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-xl font-medium">Welcome, {admin?.fullname || 'Administrator'}!</h3>
            <p className="text-muted-foreground">
              Welcome to the Somali Book Library Admin Dashboard. Here you can manage resources, users, institutions, and monitor system performance.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <Card key={card.title} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(card.route)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status and Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Resource Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Distribution</CardTitle>
            <CardDescription>Overview of resource status and types</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-500">{stats.publishedResources}</div>
                <div className="text-xs text-muted-foreground">Published</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-500">{stats.totalResources - stats.publishedResources}</div>
                <div className="text-xs text-muted-foreground">Unpublished</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Published Rate</span>
                <span>{Math.round((stats.publishedResources / stats.totalResources) * 100) || 0}%</span>
              </div>
              <Progress value={(stats.publishedResources / stats.totalResources) * 100 || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Subscription Status */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Overview</CardTitle>
            <CardDescription>Active subscriptions across the platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-500">{stats.activeUsers}</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-500">{stats.activeInstitutions}</div>
                <div className="text-xs text-muted-foreground">Active Institutions</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>User Engagement</span>
                <span>{Math.round((stats.activeUsers / stats.totalUsers) * 100) || 0}%</span>
              </div>
              <Progress value={(stats.activeUsers / stats.totalUsers) * 100 || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Resources */}
      <h3 className="text-xl font-semibold mt-6">Recent Resources</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-sm">Title</th>
              <th className="text-left p-3 font-medium text-sm">Type</th>
              <th className="text-left p-3 font-medium text-sm">Status</th>
              <th className="text-left p-3 font-medium text-sm">Access</th>
              <th className="text-left p-3 font-medium text-sm">Category</th>
              <th className="text-right p-3 font-medium text-sm">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentResources.length > 0 ? (
              recentResources.map((resource) => (
                <tr key={resource.id} className="hover:bg-muted/30">
                  <td className="p-3 max-w-[200px] truncate">{resource.title}</td>
                  <td className="p-3 capitalize">{resource.type}</td>
                  <td className="p-3">{getStatusBadge(resource.status)}</td>
                  <td className="p-3">{getPaidBadge(resource.paid)}</td>
                  <td className="p-3">{resource.category_name}</td>
                  <td className="p-3 text-right">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/admin/resources/${resource.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-muted-foreground">
                  {isLoading ? "Loading recent resources..." : "No recent resources found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="bg-muted/20 p-3 text-center">
          <Button variant="link" onClick={() => navigate('/admin/resources')}>
            View All Resources
          </Button>
        </div>
      </div>

      {/* Recent Users */}
      <h3 className="text-xl font-semibold mt-6">Recent Users</h3>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium text-sm">Name</th>
              <th className="text-left p-3 font-medium text-sm">Email</th>
              <th className="text-left p-3 font-medium text-sm">Role</th>
              <th className="text-left p-3 font-medium text-sm">Subscription</th>
              <th className="text-left p-3 font-medium text-sm">Institution</th>
              <th className="text-right p-3 font-medium text-sm">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-muted/30">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3">{getSubscriptionBadge(user.sub_status)}</td>
                  <td className="p-3">{user.institution_name || '-'}</td>
                  <td className="p-3 text-right">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/admin/users`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-muted-foreground">
                  {isLoading ? "Loading recent users..." : "No recent users found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        
        <div className="bg-muted/20 p-3 text-center">
          <Button variant="link" onClick={() => navigate('/admin/users')}>
            View All Users
          </Button>
        </div>
      </div>

      {/* Quick Access */}
      <h3 className="text-xl font-semibold mt-6">Quick Access</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {navCards.map((card, index) => (
          <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(card.link)}>
            <CardHeader className={`${card.color}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                  <CardTitle className="text-base">{card.title}</CardTitle>
                </div>
                <Badge variant="secondary">{card.count}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Info */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {systemStatus.isOnline ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">
                {systemStatus.isOnline ? 'All Systems Operational' : 'System Issues Detected'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(systemStatus.lastUpdate, "MMM d, h:mm a")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => navigate('/admin/resources/add')}>
                <Plus className="h-3 w-3 mr-1" />
                Add Resource
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate('/admin/users')}>
                <Users className="h-3 w-3 mr-1" />
                Manage Users
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;