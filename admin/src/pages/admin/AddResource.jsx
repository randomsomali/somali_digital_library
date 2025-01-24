import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import NotificationDialog from "@/components/ui/NotificationDialog";
import { fetchCategories, createResource } from "@/services/api";

const AddResource = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    abstract: "",
    year_of_publication: "",
    language: "",
    category_id: "",
    type: "",
    keywords: "",
    file: null,
  });

  // Validation state
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);

  // Notification states
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" });

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        showError("Failed to load categories");
      }
    };
    loadCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.author) newErrors.author = "Author is required";
    if (!formData.abstract) newErrors.abstract = "Abstract is required";
    if (!formData.year_of_publication) newErrors.year_of_publication = "Year of publication is required";
    if (!formData.language) newErrors.language = "Language is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.keywords) newErrors.keywords = "Keywords are required";
    if (!formData.file) newErrors.file = "File is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) return;

    // Prepare form data for upload
    const uploadData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        uploadData.append(key, formData[key]);
      }
    });

    try {
      setIsLoading(true);
      const response = await createResource(uploadData);

      // Show success dialog
      showSuccess("Resource created successfully!");
      navigate("/admin/resources"); // Redirect to resources page after success
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create resource";
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Notification helpers
  const showSuccess = (message) => {
    setSuccessDialog({ isOpen: true, message });
  };

  const showError = (message) => {
    setErrorDialog({ isOpen: true, message });
  };

  // Navigate to resources page after success dialog is closed
  const handleSuccessDialogClose = () => {
    setSuccessDialog({ ...successDialog, isOpen: false });
    navigate("/admin/resources");
  };

  return (
    <Card className="bg-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Add New Resource
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create a new resource with detailed information
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div className="grid gap-3">
            <Label>Category</Label>
            <Select
              name="category_id"
              value={formData.category_id}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
            >
              <SelectTrigger className={errors.category_id ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.category_id} value={category.category_id.toString()}>
                    {category.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category_id && (
              <p className="text-destructive text-sm mt-1">{errors.category_id}</p>
            )}
          </div>

          {/* Title */}
          <div className="grid gap-3">
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter resource title"
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-destructive text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Author */}
          <div className="grid gap-3">
            <Label>Author</Label>
            <Input
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              className={errors.author ? "border-destructive" : ""}
            />
            {errors.author && (
              <p className="text-destructive text-sm mt-1">{errors.author}</p>
            )}
          </div>

          {/* Abstract */}
          <div className="grid gap-3">
            <Label>Abstract</Label>
            <Textarea
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              placeholder="Enter resource abstract"
              className={errors.abstract ? "border-destructive" : ""}
            />
            {errors.abstract && (
              <p className="text-destructive text-sm mt-1">{errors.abstract}</p>
            )}
          </div>

          {/* Year of Publication */}
          <div className="grid gap-3">
            <Label>Year of Publication</Label>
            <Input
              name="year_of_publication"
              type="number"
              value={formData.year_of_publication}
              onChange={handleChange}
              placeholder="Enter year of publication"
              className={errors.year_of_publication ? "border-destructive" : ""}
            />
            {errors.year_of_publication && (
              <p className="text-destructive text-sm mt-1">{errors.year_of_publication}</p>
            )}
          </div>

          {/* Language */}
          <div className="grid gap-3">
            <Label>Language</Label>
            <Input
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Enter language"
              className={errors.language ? "border-destructive" : ""}
            />
            {errors.language && (
              <p className="text-destructive text-sm mt-1">{errors.language}</p>
            )}
          </div>
          

          {/* Type */}
          <div className="grid gap-3">
            <Label>Type</Label>
           <Select
              name="type"
              value={formData.type}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                <SelectValue placeholder="Select a Type of The resource" />
              </SelectTrigger>
  <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="journal">Journal</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="others">Others</SelectItem>
                </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-destructive text-sm mt-1">{errors.type}</p>
            )}
          </div>

          {/* Keywords */}
          <div className="grid gap-3">
            <Label>Keywords</Label>
            <Input
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Enter keywords"
              className={errors.keywords ? "border-destructive" : ""}
            />
            {errors.keywords && (
              <p className="text-destructive text-sm mt-1">{errors.keywords}</p>
            )}
          </div>

          {/* File Upload */}
          <div className="grid gap-3">
            <Label>File *</Label>
            <Input
              type="file"
              name="file"
              accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className={`${errors.file ? "border-destructive" : ""} file:text-sm file:mr-2`}
            />
            {errors.file && (
              <p className="text-destructive text-sm mt-1">{errors.file}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-4"
          >
            {isLoading ? "Creating..." : "Create Resource"}
          </Button>
        </form>
      </CardContent>

      {/* Success Notification Dialog */}
      <NotificationDialog
        isOpen={successDialog.isOpen}
        onClose={handleSuccessDialogClose}
        message={successDialog.message}
        type="success"
      />

      {/* Error Notification Dialog */}
      <NotificationDialog
        isOpen={errorDialog.isOpen}
        onClose={() => setErrorDialog({ ...errorDialog, isOpen: false })}
        message={errorDialog.message}
        type="error"
      />
    </Card>
  );
};

export default AddResource;