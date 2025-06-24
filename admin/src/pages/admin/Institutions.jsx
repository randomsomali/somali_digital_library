import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { fetchInstitutions, createInstitution, updateInstitution, deleteInstitution } from "@/services/api";
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
  DialogHeader,
  DialogTitle,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationDialog from "@/components/ui/NotificationDialog";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

// Zod schema for institution validation
const institutionSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name cannot exceed 255 characters")
    .regex(/^[a-zA-Z0-9\s\-'.]+$/, "Name can only contain letters, numbers, spaces, hyphens, apostrophes, and periods"),
  
  email: z.string()
    .email("Invalid email format")
    .max(100, "Email cannot exceed 100 characters"),
  
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password cannot exceed 100 characters")
    .optional()
    .transform(val => val === "" ? undefined : val),
  
  sub_status: z.enum(["none", "active", "expired"])
    .default("none"),
});

const validateForm = (formData, isUpdate = false) => {
  try {
    const schema = isUpdate
      ? institutionSchema.partial({ password: true })
      : institutionSchema;
    
    // Remove password if it's empty on update
    const dataToValidate = isUpdate && !formData.password
      ? { ...formData, password: undefined }
      : formData;

    schema.parse(dataToValidate);
    return {};
  } catch (error) {
    return error.errors.reduce((acc, curr) => {
      acc[curr.path[0]] = curr.message;
      return acc;
    }, {});
  }
};

const InstitutionForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: "",
    email: "",
    password: "",
    sub_status: "none",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await onSubmit(formData);
      setErrors({});
    } catch (error) {
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Institution Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password {initialData && "(Leave blank to keep current)"}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          error={errors.password}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      {initialData && (
        <div className="space-y-2">
          <Label htmlFor="sub_status">Subscription Status</Label>
          <Select
            value={formData.sub_status}
            onValueChange={(value) => setFormData({ ...formData, sub_status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

const Institutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" });
  const [selectedSubStatus, setSelectedSubStatus] = useState("all");
  const limit = 10;
  const navigate = useNavigate();

  useEffect(() => {
    loadInstitutions();
  }, [currentPage, search, selectedSubStatus]);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        search: search || undefined,
        sub_status: selectedSubStatus !== "all" ? selectedSubStatus : undefined,
      };
      
      const result = await fetchInstitutions(params);
      setInstitutions(result.institutions);
      setTotalPages(result.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load institutions");
      showError(err.message || "Failed to load institutions");
    } finally {
      setLoading(false);
    }
  };

  // ... pagination helper methods (same as in other components) ...

  const handleAddInstitution = async (formData) => {
    try {
      await createInstitution(formData);
      await loadInstitutions();
      setIsAddModalOpen(false);
      showSuccess("Institution created successfully!");
    } catch (error) {
      showError(error.message);
    }
  };

  const handleUpdateInstitution = async (formData) => {
    try {
      await updateInstitution(selectedInstitution.institution_id, formData);
      await loadInstitutions();
      setIsEditModalOpen(false);
      setSelectedInstitution(null);
      showSuccess("Institution updated successfully!");
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDeleteInstitution = async (id) => {
    try {
      await deleteInstitution(id);
      await loadInstitutions();
      showSuccess("Institution deleted successfully!");
    } catch (error) {
      showError(error.message);
    }
  };

  const showSuccess = (message) => {
    setSuccessDialog({ isOpen: true, message });
  };

  const showError = (message) => {
    setErrorDialog({ isOpen: true, message });
  };

  if (loading && institutions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Institutions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search institutions..."
              className="pl-8"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Select
            value={selectedSubStatus}
            onValueChange={(value) => {
              setSelectedSubStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="none">No Subscription</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Institution
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Users</TableHead>
                <TableHead className="font-bold">Subscription</TableHead>
                <TableHead className="font-bold">Expiry Date</TableHead>
                <TableHead className="font-bold">Created At</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {institutions.map((institution) => (
                <TableRow key={institution.institution_id}>
                  <TableCell>{institution.name}</TableCell>
                  <TableCell>{institution.email}</TableCell>
                  <TableCell>{institution.user_count}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      institution.sub_status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : institution.sub_status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {institution.sub_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {institution.expiry_date 
                      ? new Date(institution.expiry_date).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {new Date(institution.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedInstitution(institution);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/institutions/${institution.institution_id}/details`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Institution</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this institution? This action cannot be undone.
                              {institution.user_count > 0 && (
                                <p className="mt-2 text-red-500">
                                  Warning: This institution has {institution.user_count} associated users.
                                </p>
                              )}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteInstitution(institution.institution_id)}
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

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, institutions.length)} of {institutions.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-input hover:bg-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {getPageNumbers().map((pageNum, index) => (
                <Button
                  key={index}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => pageNum !== '...' && setCurrentPage(pageNum)}
                  disabled={pageNum === '...'}
                  className={`min-w-[2.5rem] ${
                    pageNum === currentPage ? 'bg-primary text-primary-foreground' : 'border-input hover:bg-accent'
                  }`}
                >
                  {pageNum}
                </Button>
              ))}

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
        )}
      </CardContent>

      {/* Add Institution Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Institution</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the institution details below
            </DialogDescription>
          </DialogHeader>
          <InstitutionForm 
            onSubmit={handleAddInstitution} 
            onCancel={() => setIsAddModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Institution Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Institution</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update institution details below
            </DialogDescription>
          </DialogHeader>
          {selectedInstitution && (
            <InstitutionForm
              onSubmit={handleUpdateInstitution}
              initialData={selectedInstitution}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedInstitution(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Notification Dialogs */}
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

export default Institutions; 