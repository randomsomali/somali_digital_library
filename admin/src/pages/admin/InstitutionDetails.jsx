import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { 
  fetchInstitutionStudents, 
  createUser, 
  updateUser, 
  deleteUser,
  fetchInstitutions
} from "@/services/api";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationDialog from "@/components/ui/NotificationDialog";
import { UserForm } from "./Users";  // Changed from "../admin/Users"

const InstitutionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" });
  const [selectedSubStatus, setSelectedSubStatus] = useState("all");
  const [institution, setInstitution] = useState(null);
  const limit = 10;

  useEffect(() => {
    loadInstitution();
    loadStudents();
  }, [id, currentPage, search, selectedSubStatus]);

  const loadInstitution = async () => {
    try {
      const response = await fetchInstitutions({ id });
      if (response.institutions?.length > 0) {
        setInstitution(response.institutions[0]);
      }
    } catch (err) {
      showError(err.message);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit,
        search: search || undefined,
        sub_status: selectedSubStatus !== "all" ? selectedSubStatus : undefined,
      };
      
      const result = await fetchInstitutionStudents(id, params);
      setStudents(result.users);
      setTotalPages(result.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (formData) => {
    try {
      await createUser({
        ...formData,
        role: "student",
        institution_id: parseInt(id),
      });
      await loadStudents();
      setIsAddModalOpen(false);
      showSuccess("Student added successfully!");
    } catch (error) {
      showError(error.message);
    }
  };

  const handleUpdateStudent = async (formData) => {
    try {
      await updateUser(selectedUser.user_id, {
        ...formData,
        role: "student",
        institution_id: parseInt(id),
      });
      await loadStudents();
      setIsEditModalOpen(false);
      setSelectedUser(null);
      showSuccess("Student updated successfully!");
    } catch (error) {
      showError(error.message);
    }
  };

  const handleDeleteStudent = async (userId) => {
    try {
      await deleteUser(userId);
      await loadStudents();
      showSuccess("Student deleted successfully!");
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

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  if (loading && students.length === 0) {
    return (
      <Card className="bg-background">
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading students...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/institutions')}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Institutions
            </Button>
            <CardTitle className="text-2xl font-bold text-foreground">
              {institution?.name || 'Institution'} - Students
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage students for this institution
            </CardDescription>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Student
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 bg-background border-input"
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
              <SelectValue placeholder="Filter by subscription" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="none">No Subscription</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Name</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Subscription</TableHead>
                <TableHead className="font-bold">Created At</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.user_id}>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      student.sub_status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : student.sub_status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {student.sub_status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(student.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedUser(student);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Student</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this student? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteStudent(student.user_id)}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, students.length)} of {students.length} entries
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

      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Student</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Fill in the student details below
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            onSubmit={handleAddStudent} 
            onCancel={() => setIsAddModalOpen(false)}
            initialData={{ 
              name: "",
              email: "",
              password: "",
              role: "student",
              institution_id: parseInt(id),
              sub_status: "none"
            }}
            disableFields={{
              role: true,
              institution_id: true
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-background">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Student</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Update student details below
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              onSubmit={handleUpdateStudent}
              initialData={{
                ...selectedUser,
                password: "", // Clear password when editing
                role: "student",
                institution_id: parseInt(id)
              }}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
              disableFields={{
                role: true,
                institution_id: true
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

export default InstitutionDetails; 