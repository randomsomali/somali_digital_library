// src/pages/admin/Clients.jsx
import { useState ,useEffect} from "react"
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, CheckCircle, XCircle, Eye, EyeOff, X, XCircleIcon } from "lucide-react"
import { fetchClients, createClient, updateClient, deleteClient } from "@/services/api";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"//
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import NotificationDialog from "@/components/ui/NotificationDialog"; // Import the new NotificationDialog component

const validateForm = (formData, isUpdate = false) => {
  const errors = {}
  
  if (!formData.name.trim()) {
    errors.name = "Name is required"
  }
  
  if (!formData.email.trim()) {
    errors.email = "Email is required"
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Invalid email format"
  }
  
  if (!formData.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!/^(\d{3}-\d{3}-\d{4}|\d{12})$/.test(formData.phone)) {
    errors.phone = "Phone format should be XXX-XXX-XXXX or 2526XXXXXXXX";
  }
  
  if (!formData.client_type) {
    errors.client_type = "Client type is required"
  }
  
  if (!formData.address.trim()) {
    errors.address = "Address is required"
  }
  
  // Only validate password for new clients
  if (!isUpdate && !formData.password) {
    errors.password = "Password is required"
  }
  
  return errors
}

const ClientForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState(initialData ? {
        client_id: initialData.client_id, // Add this line to include client_id

    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    client_type: initialData.client_type,
    address: initialData.address,
    password: "", // Leave empty for updates
  } : {
    name: "",
    email: "",
    phone: "",
    client_type: "",
    address: "",
    password: "Setsom123", // Default password for new clients
  });
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate form - pass isUpdate flag based on whether we have initialData
    const validationErrors = validateForm(formData, !!initialData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setIsSubmitting(false)
      return
    }
    
    try {
      // If updating and password is empty, remove it from the submission
      const dataToSubmit = { ...formData }
      if (initialData && !dataToSubmit.password) {
        delete dataToSubmit.password
      }
      
      await onSubmit(dataToSubmit)
      setErrors({})
    } catch (error) {
      setErrors({ submit: error.message || "An error occurred while saving" })
    } finally {
      setIsSubmitting(false)
  }
}

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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
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
          <Label htmlFor="client_type">Client Type</Label>
          <Select
            value={formData.client_type}
            onValueChange={(value) => setFormData({ ...formData, client_type: value })}
          >
            <SelectTrigger className={errors.client_type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="graduate_student">Graduate Student</SelectItem>
                            <SelectItem value="others">Others</SelectItem>

            </SelectContent>
          </Select>
          {errors.client_type && <p className="text-sm text-red-500">{errors.client_type}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>
                <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Leave blank to keep existing password"
              className="pr-10"
            />
            <button
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
          {isSubmitting ? "Saving..." : "Save Client"}
        </Button>
      </DialogFooter>
    </form>
  )
}


const Clients = () => {
 const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  const [search, setSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" })
    const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" });
console.log(selectedClient)
  const itemsPerPage = 10
 useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await fetchClients();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load clients");
    } finally {
      setLoading(false);
    }
  };
  const handleAddClient = async (newClient) => {
    try {
      const response = await createClient(newClient);
      await loadClients(); // Reload the full list
      setIsAddModalOpen(false);
      showSuccess("Client added successfully!");
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add client");
    }
  };

  const handleUpdateClient = async (updatedClient) => {
    try {
      await updateClient(updatedClient.client_id, updatedClient);
      await loadClients(); // Reload the full list
      setIsEditModalOpen(false);
      setSelectedClient(null);
      showSuccess("Client updated successfully!");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update client");
    }
  };

  const handleDeleteClient = async (id) => {
    try {
      await deleteClient(id);
      await loadClients(); // Reload the full list
      showSuccess("Client deleted successfully!");
    } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to delete client";
    // Show error message to user
      showError(errorMessage);
    // Or use your existing error handling system
    throw new Error(errorMessage);
  }
};
   const showSuccess = (message) => {
    setSuccessDialog({ isOpen: true, message });
  };

  const showError = (message) => {
    setErrorDialog({ isOpen: true, message });
  };

    // Add loading and error states to the render
  if (loading) {
    return (
      <Card className="bg-background">
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading clients...</p>
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
  // Filter and pagination logic remains the same
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.phone.includes(search)
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentClients = filteredClients.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage)

  return (
   <Card className="bg-background">
  <CardHeader>
    <div className="flex items-center justify-between">
      <div>
        <CardTitle className="text-2xl font-bold text-foreground">Clients</CardTitle>
        <CardDescription className="text-muted-foreground">
          Manage your client database
        </CardDescription>
      </div>
      <Button
        className="bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => setIsAddModalOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Client
      </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search input remains the same */}
        <div className="mb-4">
         <div className="relative">
  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
  <Input
    placeholder="Search by name or phone..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="pl-8 bg-background border-input"
  />
</div>

{/* Loading spinner */}
{loading && (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    <p className="ml-2 text-foreground">Loading clients...</p>
  </div>
)}
        </div>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Phone</TableHead>
                <TableHead className="font-bold">Client Type</TableHead>
                <TableHead className="font-bold">Address</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentClients.map((client) => (
                 <TableRow key={client.client_id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <TableCell>{client.client_id}</TableCell>

                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.client_type}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedClient(client)
                          setIsEditModalOpen(true)
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
                            <AlertDialogTitle>Delete Client</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this client? This
                              action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteClient(client.client_id)}
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

        {/* Pagination remains the same */}
     <div className="flex items-center justify-between mt-4">
  <p className="text-sm text-muted-foreground">
    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredClients.length)} of {filteredClients.length} entries
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
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
</div>
      </CardContent>

      {/* Add Client Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
<DialogContent className="bg-background">
  <DialogHeader>
    <DialogTitle className="text-foreground">Add New Client</DialogTitle>
    <DialogDescription className="text-muted-foreground">
              Fill in the client details below
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            onSubmit={handleAddClient}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Client Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-background">
  <DialogHeader>
    <DialogTitle className="text-foreground">Edit Client</DialogTitle>
    <DialogDescription className="text-muted-foreground">
              Update client details below
            </DialogDescription>
          </DialogHeader>
          <ClientForm
            initialData={selectedClient}
            onSubmit={handleUpdateClient}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
 {/* Use NotificationDialog for success and error messages */}
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
  )
}

export default Clients