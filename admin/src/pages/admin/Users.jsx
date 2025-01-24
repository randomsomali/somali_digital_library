import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye, EyeOff, X, User } from "lucide-react";
import { fetchUsers, createUser, updateUser, deleteUser } from "@/services/api";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import NotificationDialog from "@/components/ui/NotificationDialog";

const validateForm = (formData, isUpdate = false) => {
  const errors = {};
  
  if (!formData.full_name.trim()) {
    errors.full_name = "Full name is required";
  }
  
  if (!formData.username.trim()) {
    errors.username = "Username is required";
  }
  
  if (!formData.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!/^(\d{3}-\d{3}-\d{4}|\d{12})$/.test(formData.phone)) {
    errors.phone = "Phone format should be XXX-XXX-XXXX or 2526XXXXXXXX";
  }
  
  if (!formData.role) {
    errors.role = "Role is required";
  }
  
  if (!formData.category.trim()) {
    errors.category = "Category is required";
  }
  
  if (!isUpdate && !formData.password) {
    errors.password = "Password is required";
  }
  
  return errors;
};

const UserForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState(initialData ? {
    user_id: initialData.user_id,
    full_name: initialData.full_name,
    username: initialData.username,
    phone: initialData.phone,
    role: initialData.role,
    category: initialData.category,
    password: "",
  } : {
    full_name: "",
    username: "",
    phone: "",
    role: "",
    category: "",
    password: "Setsom123",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const validationErrors = validateForm(formData, !!initialData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const dataToSubmit = { ...formData };
      if (initialData && !dataToSubmit.password) {
        delete dataToSubmit.password;
      }
      
      await onSubmit(dataToSubmit);
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message || "An error occurred while saving" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className={errors.full_name ? "border-red-500" : ""}
          />
          {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className={errors.username ? "border-red-500" : ""}
          />
          {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className={errors.phone ? "border-red-500" : ""}
            placeholder="XXX-XXX-XXXX"
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value })}
          >
            <SelectTrigger className={errors.role ? "border-red-500" : ""}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
        </div>

      
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={initialData ? "Leave blank to keep existing password" : "Enter password"}
              className="pr-10"
            /> <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save User"}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser , setSelectedUser ] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" });

  const itemsPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser  = async (newUser ) => {
    try {
      await createUser (newUser );
      await loadUsers();
      setIsAddModalOpen(false);
      showSuccess("User  added successfully!");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to add user");
    }
  };

  const handleUpdateUser  = async (updatedUser ) => {
    try {
      await updateUser (updatedUser .user_id, updatedUser );
      await loadUsers();
      setIsEditModalOpen(false);
      setSelectedUser (null);
      showSuccess("User  updated successfully!");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser  = async (id) => {
    try {
      await deleteUser (id);
      await loadUsers();
      showSuccess("User  deleted successfully!");
    } catch (error) {
      showError(error.response?.data?.message || "Failed to delete user");
    }
  };

  const showSuccess = (message) => {
    setSuccessDialog({ isOpen: true, message });
  };

  const showError = (message) => {
    setErrorDialog({ isOpen: true, message });
  };

  if (loading) {
    return (
      <Card className="bg-background">
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading Users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-background">
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const filteredUsers = users.filter(
    (user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search) ||
      user.username.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <Card className="bg -background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Users</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage Users
            </CardDescription>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-background border-input"
            />
          </div>
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">Full Name</TableHead>
                <TableHead className="font-bold">Username</TableHead>
                <TableHead className="font-bold">Phone</TableHead>
                <TableHead className="font-bold">Role</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.user_id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <TableCell>{user.user_id}</TableCell>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.category}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser (user);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this user? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser (user.user_id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredUsers.length)} of {filteredUsers.length} entries
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border-input hover:bg-accent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border-input hover:bg-accent"
            >
              <ChevronRight className ="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Add User Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the user details below
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={handleAddUser }
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit User</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update user details below
            </DialogDescription>
          </DialogHeader>
          <UserForm
            initialData={selectedUser }
            onSubmit={handleUpdateUser }
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <NotificationDialog
        isOpen={successDialog.isOpen}
        onClose={() => setSuccessDialog({ ...successDialog, isOpen: false })}
        message={successDialog.message}
        type="success"
      />
      <NotificationDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        message={errorDialog.message}
        type="error"
      />
    </Card>
  );
};

export default Users;