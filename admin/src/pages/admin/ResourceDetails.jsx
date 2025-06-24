import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResourceDetails, updateResource, fetchCategories } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import NotificationDialog from "@/components/ui/NotificationDialog";
import { z } from "zod";

// Validation schema (same as AddResource)
const resourceSchema = z.object({
  title: z.string()
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title cannot exceed 255 characters"),
  
  doi: z.string()
    .optional()
    .transform(val => val === "" ? undefined : val),
  
  abstract: z.string()
    .min(10, "Abstract must be at least 10 characters")
    .max(2000, "Abstract cannot exceed 2000 characters"),
  
  type: z.enum(["book", "journal", "research", "article", "others"], {
    required_error: "Type is required"
  }),
  
  language: z.string()
    .min(2, "Language must be at least 2 characters")
    .max(50, "Language cannot exceed 50 characters"),
  
  category_id: z.string({
    required_error: "Category is required"
  }),
  
  publication_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

// Resource Form Component
const ResourceForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState(initialData);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data.categories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    loadCategories();
  }, []);

  const validateForm = () => {
    try {
      resourceSchema.parse(formData);
      return {};
    } catch (error) {
      return error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined && key !== 'file_url') {
          formDataToSubmit.append(key, formData[key]);
        }
      });

      // Add file if selected
      if (formData.file) {
        formDataToSubmit.append('file', formData.file);
      }

      await onSubmit(formDataToSubmit);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields similar to AddResource.jsx */}
      {/* ... Title, DOI, Abstract, Type, Category, Language, Publication Date ... */}
      
      {/* File Upload (optional for update) */}
      <div className="grid gap-2">
        <Label htmlFor="file">Update File (Optional)</Label>
        <Input
          id="file"
          name="file"
          type="file"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.txt,.rtf"
          className={errors.file ? "border-destructive" : ""}
        />
        {errors.file && (
          <p className="text-destructive text-sm">{errors.file}</p>
        )}
        {initialData.file_url && (
          <p className="text-sm text-muted-foreground">
            Current file: {initialData.file_url.split('/').pop()}
          </p>
        )}
      </div>

      {/* Submit and Cancel buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Resource"}
        </Button>
      </div>
    </form>
  );
};

// Main ResourceDetails Component
const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resource, setResource] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    fetchResourceDetails();
  }, [id]);

  const fetchResourceDetails = async () => {
    try {
      const data = await getResourceDetails(id);
      setResource(data);
    } catch (error) {
      showError(error.message);
    }
  };

  const handleUpdateResource = async (formData) => {
    try {
      await updateResource(id, formData);
      showSuccess("Resource updated successfully");
      setIsEditModalOpen(false);
      fetchResourceDetails();
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

  if (!resource) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resource Details</CardTitle>
        <Button onClick={() => setIsEditModalOpen(true)}>
          Edit Resource
        </Button>
      </CardHeader>
      <CardContent>
        {/* Resource Details Display */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Title</h3>
            <p>{resource.title}</p>
          </div>

          {resource.doi && (
            <div>
              <h3 className="text-lg font-semibold">DOI</h3>
              <p>{resource.doi}</p>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold">Abstract</h3>
            <p className="whitespace-pre-line">{resource.abstract}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Type</h3>
              <p className="capitalize">{resource.type}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Category</h3>
              <p>{resource.category_name}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Language</h3>
              <p>{resource.language}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Publication Date</h3>
              <p>{new Date(resource.publication_date).toLocaleDateString()}</p>
            </div>
          </div>

          {resource.download_url && (
            <div>
              <h3 className="text-lg font-semibold">Download</h3>
              <Button
                variant="outline"
                onClick={() => window.open(resource.download_url, '_blank')}
              >
                Download File
              </Button>
            </div>
          )}
        </div>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Resource</DialogTitle>
              <DialogDescription>
                Update the resource details below
              </DialogDescription>
            </DialogHeader>
            <ResourceForm
              initialData={resource}
              onSubmit={handleUpdateResource}
              onCancel={() => setIsEditModalOpen(false)}
            />
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
      </CardContent>
    </Card>
  );
};

export default ResourceDetails; 