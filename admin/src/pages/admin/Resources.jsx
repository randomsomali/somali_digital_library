import { useState, useEffect } from "react";
import { Search, Plus, Eye, Trash2, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchResources, deleteResource } from "@/services/api"; // Adjust the import based on your API service
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import NotificationDialog from "@/components/ui/NotificationDialog";

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" });

  const navigate = useNavigate();
  const itemsPerPage = 10;

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await fetchResources(); // Fetch resources from your API
      setResources(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load resources");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    try {
      await deleteResource(id);
      await loadResources(); // Reload the full list
      showSuccess("Resource deleted successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete resource";
      showError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const showSuccess = (message) => {
    setSuccessDialog({ isOpen: true, message });
  };

  const showError = (message) => {
    setErrorDialog({ isOpen: true, message });
  };

  // Loading state
  if (loading) {
    return (
      <Card className="bg-background">
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4">Loading resources...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
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

  // Filter and pagination logic
  const filteredResources = resources.filter(
    (resource) =>
      resource.title?.toLowerCase().includes(search.toLowerCase()) ||
      resource.category_name?.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResources = filteredResources.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

  return (
    <Card className="bg -background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">Resources</CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage Your Resources
            </CardDescription>
          </div>
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => navigate("/admin/resources/add")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or category..."
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
                <TableHead className="font-bold">Tittle</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Type</TableHead>
                <TableHead className="font-bold">Year of Publication</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResources.map((resource) => (
                <TableRow key={resource.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <TableCell>{resource.id}</TableCell>
                  <TableCell>{resource.title}</TableCell>
                  <TableCell>{resource.category_name}</TableCell>
                  <TableCell>{resource.type}</TableCell>
                  <TableCell>{resource.year_of_publication}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/resources/${resource.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this resource? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteResource(resource.id)}
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
            Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredResources.length)} of {filteredResources.length} entries
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

      {/* Success and Error Notification Dialog {/* Success and Error Notification Dialogs */}
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

export default Resources;