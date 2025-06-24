import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  Building2,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/components/ui/use-toast';
import {
  fetchUserSubscriptions,
  fetchUserSubscriptionById,
  createUserSubscription,
  updateUserSubscription,
  deleteUserSubscription,
  getUserSubscriptionDropdownData,
} from '@/services/api';

const UserSubscriptions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownData, setDropdownData] = useState({
    subscriptions: [],
    users: [],
    institutions: [],
  });
  
  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(15);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    type: 'all',
    payment_method: 'all',
  });
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    user_id: '',
    institution_id: '',
    subscription_id: '',
    price: '',
    start_date: '',
    payment_method: 'manual',
    status: 'pending',
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [currentPage, filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load dropdown data if not already loaded
      if (dropdownData.subscriptions.length === 0) {
        const dropdown = await getUserSubscriptionDropdownData();
        setDropdownData(dropdown);
      }
      
      // Load user subscriptions
      const params = {
        page: currentPage,
        limit,
        ...filters,
      };
      
      const result = await fetchUserSubscriptions(params);
      setUserSubscriptions(result.userSubscriptions);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      type: 'all',
      payment_method: 'all',
    });
    setCurrentPage(1);
  };

  const openCreateModal = () => {
    setFormData({
      user_id: '',
      institution_id: '',
      subscription_id: '',
      price: '',
      start_date: new Date().toISOString().split('T')[0],
      payment_method: 'manual',
      status: 'pending',
    });
    setFormErrors({});
    setShowCreateModal(true);
  };

  const openEditModal = async (subscription) => {
    try {
      const fullData = await fetchUserSubscriptionById(subscription.user_sub_id);
      setFormData({
        user_id: fullData.user_id ? fullData.user_id.toString() : '',
        institution_id: fullData.institution_id ? fullData.institution_id.toString() : '',
        subscription_id: fullData.subscription_id ? fullData.subscription_id.toString() : '',
        price: fullData.price || '',
        start_date: fullData.start_date || '',
        payment_method: fullData.payment_method || 'manual',
        status: fullData.status || 'pending',
      });
      setSelectedSubscription(fullData);
      setFormErrors({});
      setShowEditModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load subscription details",
        variant: "destructive",
      });
    }
  };

  const openViewModal = async (subscription) => {
    try {
      const fullData = await fetchUserSubscriptionById(subscription.user_sub_id);
      setSelectedSubscription(fullData);
      setShowViewModal(true);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to load subscription details",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (subscription) => {
    setSelectedSubscription(subscription);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      const data = {
        ...formData,
        user_id: formData.user_id ? parseInt(formData.user_id) : null,
        institution_id: formData.institution_id ? parseInt(formData.institution_id) : null,
        subscription_id: parseInt(formData.subscription_id),
        price: formData.price ? parseFloat(formData.price) : undefined,
      };

      if (showCreateModal) {
        await createUserSubscription(data);
        toast({
          title: "Success",
          description: "User subscription created successfully",
        });
        setShowCreateModal(false);
      } else {
        await updateUserSubscription(selectedSubscription.user_sub_id, data);
        toast({
          title: "Success",
          description: "User subscription updated successfully",
        });
        setShowEditModal(false);
      }

      loadData();
    } catch (error) {
      if (error.validationErrors) {
        setFormErrors(error.validationErrors);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to save subscription",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUserSubscription(selectedSubscription.user_sub_id);
      toast({
        title: "Success",
        description: "User subscription deleted successfully",
      });
      setShowDeleteDialog(false);
      loadData();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete subscription",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "default",
      pending: "secondary",
      expired: "destructive",
    };
    
    const icons = {
      active: <CheckCircle className="h-3 w-3" />,
      pending: <Clock className="h-3 w-3" />,
      expired: <XCircle className="h-3 w-3" />,
    };

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method) => {
    return (
      <Badge variant="outline" className="text-xs">
        {method === 'api' ? 'API' : 'Manual'}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getSubscriptionTypeIcon = (type) => {
    return type === 'user' ? <User className="h-4 w-4" /> : <Building2 className="h-4 w-4" />;
  };

  // Add a helper function to get subscription type
  const getSelectedSubscriptionType = () => {
    if (!formData.subscription_id) return null;
    const subscription = dropdownData.subscriptions.find(s => s.subscription_id === parseInt(formData.subscription_id));
    return subscription?.type || null;
  };

  // Add a helper function to get filtered subscriptions
  const getFilteredSubscriptions = () => {
    return dropdownData.subscriptions.filter(s => {
      // If we have a selected subscription, always show it
      if (formData.subscription_id && s.subscription_id === parseInt(formData.subscription_id)) {
        return true;
      }
      
      // If we have a user selected, show only user subscriptions
      if (formData.user_id) {
        return s.type === 'user';
      }
      
      // If we have an institution selected, show only institution subscriptions
      if (formData.institution_id) {
        return s.type === 'institution';
      }
      
      // If no user/institution selected, show all
      return true;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Subscriptions</h1>
          <p className="text-muted-foreground">
            Manage user and institution subscriptions
          </p>
        </div>
        <Button onClick={openCreateModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Subscription
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {userSubscriptions.filter(s => s.status === 'active').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {userSubscriptions.filter(s => s.status === 'pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {userSubscriptions.filter(s => s.status === 'expired').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="institution">Institution</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.payment_method} onValueChange={(value) => handleFilterChange('payment_method', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Payment Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="api">API</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                Search
              </Button>
              <Button type="button" variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>User Subscriptions</CardTitle>
          <CardDescription>
            Showing {userSubscriptions.length} of {total} subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subscriber</TableHead>
                    <TableHead>Subscription</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userSubscriptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">No subscriptions found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    userSubscriptions.map((subscription) => (
                      <TableRow key={subscription.user_sub_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getSubscriptionTypeIcon(subscription.subscription_type)}
                            <div>
                              <p className="font-medium">
                                {subscription.user_name || subscription.institution_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {subscription.user_email || subscription.institution_email}
                              </p>
                              {subscription.user_role && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {subscription.user_role}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div>
                            <p className="font-medium">{subscription.subscription_name}</p>
                            <Badge variant="outline" className="text-xs">
                              {subscription.subscription_type}
                            </Badge>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <p className="font-medium">{formatPrice(subscription.price)}</p>
                        </TableCell>
                        
                        <TableCell>
                          {getStatusBadge(subscription.status)}
                        </TableCell>
                        
                        <TableCell>
                          {getPaymentMethodBadge(subscription.payment_method)}
                        </TableCell>
                        
                        <TableCell>
                          <div className="text-sm">
                            <p>Start: {formatDate(subscription.start_date)}</p>
                            <p>Expiry: {formatDate(subscription.expiry_date)}</p>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openViewModal(subscription)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditModal(subscription)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(subscription)}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} results
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal || showEditModal} onOpenChange={showCreateModal ? setShowCreateModal : setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {showCreateModal ? 'Create User Subscription' : 'Edit User Subscription'}
            </DialogTitle>
            <DialogDescription>
              {showCreateModal 
                ? 'Create a new subscription for a user or institution'
                : 'Update the subscription details'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subscription_type">Subscription Type</Label>
                <Select 
                  value={getSelectedSubscriptionType()} 
                  onValueChange={(value) => {
                    // Clear user/institution when type changes
                    setFormData(prev => ({
                      ...prev,
                      user_id: '',
                      institution_id: '',
                      subscription_id: '',
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User Subscription</SelectItem>
                    <SelectItem value="institution">Institution Subscription</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscription_id">Subscription Plan</Label>
                <Select 
                  value={formData.subscription_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredSubscriptions().map(subscription => (
                      <SelectItem key={subscription.subscription_id} value={subscription.subscription_id.toString()}>
                        {subscription.name} - ${subscription.price} ({subscription.duration_days} days)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.subscription_id && (
                  <p className="text-sm text-destructive">{formErrors.subscription_id}</p>
                )}
              </div>

              {formData.subscription_id && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="user_id">
                      {getSelectedSubscriptionType() === 'user' ? 'User' : 'Institution'}
                    </Label>
                    <Select 
                      value={formData.user_id || formData.institution_id || ''} 
                      onValueChange={(value) => {
                        const subscription = dropdownData.subscriptions.find(s => s.subscription_id === parseInt(formData.subscription_id));
                        if (subscription?.type === 'user') {
                          setFormData(prev => ({ ...prev, user_id: value, institution_id: '' }));
                        } else {
                          setFormData(prev => ({ ...prev, institution_id: value, user_id: '' }));
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${getSelectedSubscriptionType() === 'user' ? 'user' : 'institution'}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {getSelectedSubscriptionType() === 'user' 
                          ? dropdownData.users.map(user => (
                              <SelectItem key={user.user_id} value={user.user_id.toString()}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))
                          : dropdownData.institutions.map(institution => (
                              <SelectItem key={institution.institution_id} value={institution.institution_id.toString()}>
                                {institution.name} ({institution.email})
                              </SelectItem>
                            ))
                        }
                      </SelectContent>
                    </Select>
                    {(formErrors.user_id || formErrors.institution_id) && (
                      <p className="text-sm text-destructive">{formErrors.user_id || formErrors.institution_id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    />
                    {formErrors.price && (
                      <p className="text-sm text-destructive">{formErrors.price}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                    {formErrors.start_date && (
                      <p className="text-sm text-destructive">{formErrors.start_date}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment_method">Payment Method</Label>
                    <Select 
                      value={formData.payment_method} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.payment_method && (
                      <p className="text-sm text-destructive">{formErrors.payment_method}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.status && (
                      <p className="text-sm text-destructive">{formErrors.status}</p>
                    )}
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => showCreateModal ? setShowCreateModal(false) : setShowEditModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : (showCreateModal ? 'Create' : 'Update')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
            <DialogDescription>
              Detailed information about this subscription
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Subscriber</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubscription.user_name || selectedSubscription.institution_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubscription.user_email || selectedSubscription.institution_email}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Subscription Plan</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubscription.subscription_name}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {selectedSubscription.subscription_type}
                  </Badge>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Price</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(selectedSubscription.price)}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    {getStatusBadge(selectedSubscription.status)}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <div className="mt-1">
                    {getPaymentMethodBadge(selectedSubscription.payment_method)}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedSubscription.start_date)}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Expiry Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedSubscription.expiry_date)}
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Confirmed By</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubscription.confirmed_by_name || 'Not confirmed'}
                  </p>
                </div>
              </div>
              
              {selectedSubscription.features && selectedSubscription.features.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Features</Label>
                  <div className="mt-2 space-y-1">
                    {selectedSubscription.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subscription
              for {selectedSubscription?.user_name || selectedSubscription?.institution_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserSubscriptions; 