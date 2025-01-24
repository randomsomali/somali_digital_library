import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/services/api";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import NotificationDialog from "@/components/ui/NotificationDialog";

const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.category_name.trim()) {
    errors.category_name = "Category name is required";
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required";
  }

  return errors;
};

const CategoryForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    category_name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      await onSubmit(formData);
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
          <Label htmlFor="category_name">Category Name</Label>
          <Input
            id="category_name"
            value={formData.category_name}
            onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
            className={errors.category_name ? "border-red-500" : ""}
          />
          {errors.category_name && <p className="text-sm text-red-500">{errors.category_name}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Category"}
        </Button>
      </DialogFooter>
    </form>
  );
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const itemsPerPage = 10;

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      await createCategory(newCategory);
      await loadCategories();
      setIsAddModalOpen(false);
      showSuccess("Category added successfully!");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to add category");
    }
  };

  const handleUpdateCategory = async (updatedCategory) => {
    try {
      await updateCategory(selectedCategory.id, updatedCategory);
      await loadCategories();
      setIsEditModalOpen(false);
      setSelectedCategory(null);
      showSuccess("Category updated successfully!");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      await loadCategories();
      showSuccess("Category deleted successfully!");
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete category");
    }
  };

  const showSuccess = (message) => {
    setSuccessDialog({ isOpen: true, message });
  };

  if (loading) {
    return (
      <Card className="bg-background">
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading categories...</p>
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

  const filteredCategories = categories.filter((category) =>
    category.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  return (
    <Card className="bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Categories</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your category database
            </CardDescription>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="mr-2" /> Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <Input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mr-2"
          />
          <Button onClick={() => setCurrentPage(1)}>Search</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.category_name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>
 <div className="flex">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Pencil className="mr-2" /> Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="mr-2" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between mt-4">
          <Button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </CardContent>

      {/* Add Category Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Category</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <CategoryForm onSubmit={handleAddCategory} onCancel={() => setIsAddModalOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Category Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Edit Category</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <CategoryForm
              onSubmit={handleUpdateCategory}
              initialData={selectedCategory}
              onCancel={() => {
                setIsEditModalOpen(false);
                setSelectedCategory(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      {successDialog.isOpen && (
        <Dialog open={successDialog.isOpen} onOpenChange={() => setSuccessDialog({ isOpen: false })}>
          <DialogContent>
            <Alert variant="success">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successDialog.message}</AlertDescription>
            </Alert>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default Categories;