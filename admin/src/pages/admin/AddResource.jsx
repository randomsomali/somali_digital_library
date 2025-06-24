import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createResource, fetchCategories, fetchAuthors } from "@/services/api";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X, Loader2 } from "lucide-react";
import NotificationDialog from "@/components/ui/NotificationDialog";
import { cn } from "@/lib/utils";
import { z } from "zod";
import debounce from 'lodash/debounce';
import FileUpload from "@/components/fileUpload";

// Validation schema (matching backend)
const resourceSchema = z.object({
  title: z.string()
    .min(2, "Title must be at least 2 characters")
    .max(255, "Title cannot exceed 255 characters"),
  
  doi: z.string()
    .optional()
    .nullable()
    .transform(val => val === "" ? null : val)
    .refine(val => val === null || /^10.\d{4,9}\/[-._;()\/:A-Z0-9]+$/i.test(val), {
      message: "Invalid DOI format"
    }),
  
  abstract: z.string()
    .min(10, "Abstract must be at least 10 characters")
    .max(2000, "Abstract cannot exceed 2000 characters"),
  
  type: z.enum(["Thesis", "Journal", "Book", "Article", "Report", "Other"], {
    required_error: "Type is required"
  }),
  
  language: z.enum(["English", "Arabic", "Somali"], {
    required_error: "Language is required"
  }),
  
  category_id: z.string({
    required_error: "Category is required"
  }),
  
  publication_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  
  author_ids: z.array(z.number())
    .min(1, "At least one author is required"),
});

const AddResource = () => {
  const navigate = useNavigate();
  
  // State for categories and authors with pagination
  const [categoriesData, setCategoriesData] = useState({
    categories: [],
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 15
  });
  const [authorsData, setAuthorsData] = useState({
    authors: [],
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 15
  });

  const [isLoading, setIsLoading] = useState(false);
  // Search and pagination states
  const [authorSearchTerm, setAuthorSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const [authorPage, setAuthorPage] = useState(1);
  const [categoryPage, setCategoryPage] = useState(1);

  // Loading states
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [authorSearchOpen, setAuthorSearchOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" }); 


   const [formData, setFormData] = useState({
    title: "",
    doi: "",
    abstract: "",
    type: "",
    language: "",
    category_id: "",
    publication_date: "",
    author_ids: [],
    file: null,
  });


  // Debounced author search
  const debouncedAuthorSearch = useCallback(
    debounce(async (searchTerm, page = 1) => {
      setIsLoadingAuthors(true);
      try {
        const result = await fetchAuthors({ 
          search: searchTerm, 
          page, 
          limit: 15 
        });
        
        // If it's a new search, reset page and data
        if (page === 1) {
          setAuthorsData(result);
        } else {
          // For pagination, append new results
          setAuthorsData(prev => ({
            ...result,
            authors: [...prev.authors, ...result.authors]
          }));
        }
      } catch (error) {
        console.error('Author search error:', error);
      } finally {
        setIsLoadingAuthors(false);
      }
    }, 300),
    []
  );

  // Debounced category search
  const debouncedCategorySearch = useCallback(
    debounce(async (searchTerm, page = 1) => {
      setIsLoadingCategories(true);
      try {
        const result = await fetchCategories({ 
          search: searchTerm, 
          page, 
          limit: 15 
        });
        
        // If it's a new search, reset page and data
        if (page === 1) {
          setCategoriesData(result);
        } else {
          // For pagination, append new results
          setCategoriesData(prev => ({
            ...result,
            categories: [...prev.categories, ...result.categories]
          }));
        }
      } catch (error) {
        console.error('Category search error:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }, 300),
    []
  );

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [categoriesResult, authorsResult] = await Promise.all([
          fetchCategories({ page: 1, limit: 15 }),
          fetchAuthors({ page: 1, limit: 15 })
        ]);
        setCategoriesData(categoriesResult);
        setAuthorsData(authorsResult);
      } catch (error) {
        console.error('Initial data fetch error:', error);
      }
    };
    loadInitialData();
  }, []);

  // Trigger search when search term or page changes
  useEffect(() => {
    if (authorSearchTerm) {
      debouncedAuthorSearch(authorSearchTerm, authorPage);
    }
  }, [authorSearchTerm, authorPage, debouncedAuthorSearch]);

  // Trigger category search when search term or page changes
  useEffect(() => {
    if (categorySearchTerm) {
      debouncedCategorySearch(categorySearchTerm, categoryPage);
    }
  }, [categorySearchTerm, categoryPage, debouncedCategorySearch]);

  // Handle author selection
  const handleAuthorSelect = (author) => {
    if (!selectedAuthors.find(a => a.author_id === author.author_id)) {
      setSelectedAuthors(prev => [...prev, author]);
    }
    setAuthorSearchOpen(false);
  };

  // Handle author search input change
  const handleAuthorSearchChange = (value) => {
    setAuthorSearchTerm(value);
    setAuthorPage(1); // Reset to first page on new search
  };

  // Handle category search input change
  const handleCategorySearchChange = (value) => {
    setCategorySearchTerm(value);
    setCategoryPage(1); // Reset to first page on new search
  };

  // Render authors search popover
  const renderAuthorPopover = () => (
    <Popover open={authorSearchOpen} onOpenChange={setAuthorSearchOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={authorSearchOpen}
          className={cn(
            "w-full justify-between",
            errors.author_ids ? "border-destructive" : ""
          )}
        >
          Select authors...
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput 
            placeholder="Search authors..." 
            value={authorSearchTerm}
            onValueChange={handleAuthorSearchChange}
          />
          <CommandList>
            <CommandEmpty>No authors found.</CommandEmpty>
            <CommandGroup>
              {authorsData.authors.map((author) => (
                <CommandItem
                  key={author.author_id}
                  value={author.name}
                  onSelect={() => handleAuthorSelect(author)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedAuthors.find(a => a.author_id === author.author_id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {author.name}
                </CommandItem>
              ))}
            </CommandGroup>
            {isLoadingAuthors && (
              <div className="flex justify-center p-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
            {authorsData.page < authorsData.totalPages && (
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setAuthorPage(prev => prev + 1)}
                disabled={isLoadingAuthors}
              >
                Load More
              </Button>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );

  // Render categories select with search
  const renderCategorySelect = () => (
    <Select
      value={formData.category_id}
      onValueChange={(value) => {
        setFormData(prev => ({ ...prev, category_id: value }));
        // Clear any previous category-related errors
        if (errors.category_id) {
          setErrors(prev => ({ ...prev, category_id: undefined }));
        }
      }}
    >
      <SelectTrigger className={errors.category_id ? "border-destructive" : ""}>
        <SelectValue placeholder="Select category" />
      </SelectTrigger>
      <SelectContent>
        <div className="p-1">
          <Input 
            placeholder="Search categories..." 
            value={categorySearchTerm}
            onChange={(e) => handleCategorySearchChange(e.target.value)}
            className="mb-2"
          />
          {categoriesData.categories.map((category) => (
            <SelectItem 
              key={category.id} 
              value={category.id.toString()}
            >
              {category.name}
            </SelectItem>
          ))}
          {isLoadingCategories && (
            <div className="flex justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
          {categoriesData.page < categoriesData.totalPages && (
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() => setCategoryPage(prev => prev + 1)}
              disabled={isLoadingCategories}
            >
              Load More
            </Button>
          )}
        </div>
      </SelectContent>
    </Select>
  );

  const validateForm = () => {
    try {
      const dataToValidate = {
        ...formData,
        author_ids: selectedAuthors.map(author => author.author_id)
      };
      resourceSchema.parse(dataToValidate);
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
    setIsLoading(true);

    try {
      // Validate form data
      const validatedData = resourceSchema.parse({
        ...formData,
        category_id: formData.category_id,
        author_ids: selectedAuthors.map(author => author.author_id)
      });

      // Create FormData object
      const formDataToSend = new FormData();

      // Add all fields except file and author_ids
      Object.keys(validatedData).forEach(key => {
        if (key !== 'file' && key !== 'author_ids') {
          formDataToSend.append(key, validatedData[key]);
        }
      });
      
      // Add author_ids as JSON string
      formDataToSend.append('author_ids', JSON.stringify(
        selectedAuthors.map(author => author.author_id)
      ));

      // Add file if exists
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      await createResource(formDataToSend);
      showSuccess("Resource created successfully");
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

 

  const removeAuthor = (authorId) => {
    setSelectedAuthors(prev => prev.filter(a => a.author_id !== authorId));
  };

  const showSuccess = (message) => {
    setSuccessDialog({ isOpen: true, message });
  };

  const showError = (message) => {
    setErrorDialog({ isOpen: true, message });
  };
  const handleSuccessDialogClose = () => {
    setSuccessDialog({ ...successDialog, isOpen: false });
    navigate("/admin/resources");
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Resource</CardTitle>
        <CardDescription>Create a new resource with the form below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-destructive text-sm">{errors.title}</p>
            )}
          </div>

          {/* DOI */}
          <div className="grid gap-2">
            <Label htmlFor="doi">DOI</Label>
            <Input
              id="doi"
              name="doi"
              value={formData.doi}
              onChange={handleChange}
              className={errors.doi ? "border-destructive" : ""}
            />
            {errors.doi && (
              <p className="text-destructive text-sm">{errors.doi}</p>
            )}
          </div>

          {/* Abstract */}
          <div className="grid gap-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              className={errors.abstract ? "border-destructive" : ""}
            />
            {errors.abstract && (
              <p className="text-destructive text-sm">{errors.abstract}</p>
            )}
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <Label>Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {["Thesis", "Journal", "Book", "Article", "Report", "Other"].map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-destructive text-sm">{errors.type}</p>
            )}
          </div>

          {/* Language */}
          <div className="grid gap-2">
            <Label>Language *</Label>
            <Select
              value={formData.language}
              onValueChange={(value) => handleSelectChange("language", value)}
            >
              <SelectTrigger className={errors.language ? "border-destructive" : ""}>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {["English", "Arabic", "Somali"].map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.language && (
              <p className="text-destructive text-sm">{errors.language}</p>
            )}
          </div>

          {/* Category */}
            <div className="grid gap-2">
            <Label>Category *</Label>
            {renderCategorySelect()}
            {errors.category_id && (
              <p className="text-destructive text-sm">{errors.category_id}</p>
            )}
          </div>

                  {/* Authors Selection */}
          <div className="grid gap-2">
            <Label>Authors *</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedAuthors.map((author) => (
                <Badge key={author.author_id} variant="secondary">
                  {author.name}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAuthors(prev => 
                        prev.filter(a => a.author_id !== author.author_id)
                      );
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {renderAuthorPopover()}
            {errors.author_ids && (
              <p className="text-destructive text-sm">{errors.author_ids}</p>
            )}
          </div>


          {/* Publication Date */}
          <div className="grid gap-2">
            <Label htmlFor="publication_date">Publication Date *</Label>
            <Input
              id="publication_date"
              name="publication_date"
              type="date"
              value={formData.publication_date}
              onChange={handleChange}
              className={errors.publication_date ? "border-destructive" : ""}
            />
            {errors.publication_date && (
              <p className="text-destructive text-sm">{errors.publication_date}</p>
            )}
          </div>

            <FileUpload 
              onChange={handleChange}
              error={errors.file}
              accept=".pdf,.doc,.docx,.txt,.rtf"
            />
          {/* Submit Buttons */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/resources")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Resource"}
            </Button>
          </div>
        </form>

        {/* Notification Dialogs */}
        <NotificationDialog
          isOpen={successDialog.isOpen}
          onClose={handleSuccessDialogClose}
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

export default AddResource;