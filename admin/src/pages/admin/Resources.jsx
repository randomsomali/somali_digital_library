import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { fetchResources, deleteResource, updateResourceStatus, updateResourcePaidStatus } from "@/services/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotificationDialog from "@/components/ui/NotificationDialog";

const Resources = () => {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paidFilter, setPaidFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, message: "" });
  const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: "" });

  // Fetch resources
  useEffect(() => {
    fetchResourcesData();
  }, [currentPage, searchQuery, typeFilter, statusFilter, paidFilter]);

  const fetchResourcesData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchResources({
        page: currentPage,
        search: searchQuery,
        type: typeFilter,
        status: statusFilter,
        paid: paidFilter,
      });
      setResources(data.resources);
      setTotalPages(data.totalPages);
    } catch (error) {
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resource deletion
  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      showSuccess("Resource deleted successfully");
      fetchResourcesData();
    } catch (error) {
      showError(error.message);
    }
  };

  // Handle status update
  const handleStatusChange = async (id, status) => {
    try {
      await updateResourceStatus(id, status);
      showSuccess("Resource status updated successfully");
      fetchResourcesData();
    } catch (error) {
      showError(error.message);
    }
  };

  // Handle paid status update
  const handlePaidStatusChange = async (id, paid) => {
    try {
      await updateResourcePaidStatus(id, paid);
      showSuccess("Resource paid status updated successfully");
      fetchResourcesData();
    } catch (error) {
      showError(error.message);
    }
  };

  // Notification helpers
  const showSuccess = (message) => {
    setSuccessDialog({ isOpen: true, message });
  };

  const showError = (message) => {
    setErrorDialog({ isOpen: true, message });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Resources</CardTitle>
        <Button onClick={() => navigate("/admin/resources/add")}>
          <Plus className="w-4 h-4 mr-2" /> Add Resource
        </Button>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="journal">Journal</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
           <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Puplished</SelectItem>
              <SelectItem value="unpublished">UnPuplished</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paidFilter} onValueChange={setPaidFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Free or premium" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          {/* Add more filters as needed */}
        </div>

        {/* Resources Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell>{resource.title}</TableCell>
                <TableCell>{resource.type}</TableCell>
                <TableCell>{resource.category_name}</TableCell>
                <TableCell>
                  <Select 
                    value={resource.status} 
                    onValueChange={(value) => handleStatusChange(resource.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="unpublished">Unpublished</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select 
                    value={resource.paid} 
                    onValueChange={(value) => handlePaidStatusChange(resource.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/admin/resources/${resource.id}`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(resource.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

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

export default Resources;