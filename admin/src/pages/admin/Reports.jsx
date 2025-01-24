// components/Reports.jsx
import React, { useState, useEffect } from "react";
import { Search, Download, FileText, FileSpreadsheet } from "lucide-react";
import { fetchReportData } from "@/services/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Utility functions for formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Initial filters configuration
const getInitialFiltersForType = (reportType) => {
  switch (reportType) {
    case 'clients':
      return {
        clientType: 'all',
        phone: ''
      };
    case 'services':
      return {
        status: 'all',
        search: '',
        clientType: 'all'
      };
    case 'orders':
      return {
        startDate: '',
        endDate: '',
        orderStatus: 'all',
        address: '',
        clientType: 'all'
      };
    case 'payments':
      return {
        paymentMethod: 'all',
        clientPhone: '',
        startDate: '',
        endDate: ''
      };
    default:
      return {};
  }
};

const Reports = () => {
  const [reportType, setReportType] = useState('clients');
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(() => getInitialFiltersForType('clients'));
  // Add new state for summary data
  const [summaryData, setSummaryData] = useState({
    totalCount: 0,
    totalAmount: 0,
    averageAmount: 0
  });

  useEffect(() => {
    setFilters(getInitialFiltersForType(reportType));
    loadReportData();
  }, [reportType]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError(null);

      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value && value !== 'all') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const data = await fetchReportData(reportType, activeFilters);
      setReportData(data);

      // Calculate summary data
      const count = data.length;
      let totalAmount = 0;
      let averageAmount = 0;

      if (reportType === 'orders') {
        totalAmount = data.reduce((sum, item) => sum + parseFloat(item.final_price), 0);
        averageAmount = totalAmount / count || 0;
      } else if (reportType === 'payments') {
        totalAmount = data.reduce((sum, item) => sum + parseFloat(item.amount), 0);
        averageAmount = totalAmount / count || 0;
      }

      setSummaryData({
        totalCount: count,
        totalAmount,
        averageAmount
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load report data");
      setReportData([]);
      setSummaryData({ totalCount: 0, totalAmount: 0, averageAmount: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleReportTypeChange = (value) => {
    setReportType(value);
  };
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
   const handleApplyFilters = () => {
    loadReportData();
  };
  // Enhanced CSV conversion with summary data
const convertToCSV = (data, reportType, summaryData) => {
  const getHeaders = () => {
    const headerMappings = {
      clients: ['ID', 'Name', 'Email', 'Phone', 'Address', 'Client Type'],
      services: ['ID', 'Service Name', 'Description', 'Price', 'Client', 'Date', 'Status'],
      orders: ['ID', 'Client', 'Type', 'Total Price', 'Final Price', 'Date', 'Status'],
      payments: ['ID', 'Order ID', 'Client', 'Amount', 'Payment Method', 'Date', 'Status']
    };
    return headerMappings[reportType] || Object.keys(data[0]);
  };

  const escapeCSV = (field) => {
    if (field === null || field === undefined) return '';
    const stringField = String(field);
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
      return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
  };

  // Create summary section
  const generateSummarySection = () => {
    const summaryLines = [
      ['Report Type', reportType.charAt(0).toUpperCase() + reportType.slice(1)],
      ['Generated Date', new Date().toLocaleString()],
      ['Total Records', summaryData.totalCount],
    ];

    if (reportType === 'orders' || reportType === 'payments') {
      summaryLines.push(
        ['Total Amount', formatCurrency(summaryData.totalAmount)],
      );
    }

    // Add a blank line between summary and data
    summaryLines.push([]);

    return summaryLines.map(line => line.map(escapeCSV).join(',')).join('\n');
  };

  const formatRow = (item) => {
    switch (reportType) {
      case 'clients':
        return [
          item.client_id,
          item.name,
          item.email,
          item.phone,
          item.address,
          item.client_type
        ].map(escapeCSV);
      case 'services':
        return [
          item.service_id,
          item.name,
          item.description,
          formatCurrency(item.price),
          `${item.client_name} (${item.client_phone})`,
          formatDate(item.service_date),
          item.status
        ].map(escapeCSV);
      case 'orders':
        return [
          item.order_id,
          `${item.client_name} (${item.client_phone})`,
          item.order_type,
          formatCurrency(item.total_price),
          formatCurrency(item.final_price),
          formatDate(item.order_date),
          item.status
        ].map(escapeCSV);
      case 'payments':
        return [
          item.payment_id,
          item.orderId,
          `${item.client_name} (${item.client_phone})`,
          formatCurrency(item.amount),
          item.payment_method,
          formatDate(item.payment_date),
          item.status
        ].map(escapeCSV);
      default:
        return Object.values(item).map(escapeCSV);
    }
  };

  const headers = getHeaders();
  const rows = data.map(formatRow);
  
  // Combine summary section, headers, and data
  return [
    generateSummarySection(),
    headers.join(','),
    ...rows
  ].join('\n');
};

  // Modify exportToPDF to include summary data
  const exportToPDF = (data, reportType) => {
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.setTextColor(44, 62, 80);
    doc.text("Tahqiiq Report", 20, 20);
    
    // Add report metadata and summary
    doc.setFontSize(12);
    doc.setTextColor(52, 73, 94);
    doc.text(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)}`, 20, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 37);
    doc.text(`Total Records: ${summaryData.totalCount}`, 20, 44);
    
    if (reportType === 'orders' || reportType === 'payments') {
      doc.text(`Total Amount: ${formatCurrency(summaryData.totalAmount)}`, 20, 51);
    }
  // Configure table headers and data
  const getColumnsAndData = () => {
    const baseStyles = {
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: 255,
        fontSize: 10
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250]
      }
    };

    switch (reportType) {
      case 'clients':
        return {
          columns: ['ID', 'Name', 'Email', 'Phone', 'Address', 'Type'],
          data: data.map(item => [
            item.client_id,
            item.name,
            item.email,
            item.phone,
            item.address,
            item.client_type
          ]),
          ...baseStyles
        };
      case 'services':
        return {
          columns: ['ID', 'Service', 'Price', 'Client', 'Date', 'Status'],
          data: data.map(item => [
            item.service_id,
            item.name,
            formatCurrency(item.price),
            `${item.client_name}\n(${item.client_phone})`,
            formatDate(item.service_date),
            item.status
          ]),
          ...baseStyles
        };
      case 'orders':
        return {
          columns: ['ID', 'Client', 'Type', 'Total', 'Final', 'Date', 'Status'],
          data: data.map(item => [
            item.order_id,
            `${item.client_name}\n(${item.client_phone})`,
            item.order_type,
            formatCurrency(item.total_price),
            formatCurrency(item.final_price),
            formatDate(item.order_date),
            item.status
          ]),
          ...baseStyles
        };
      case 'payments':
        return {
          columns: ['ID', 'Order', 'Client', 'Amount', 'Method', 'Date', 'Status'],
          data: data.map(item => [
            item.payment_id,
            item.orderId,
            `${item.client_name}\n(${item.client_phone})`,
            formatCurrency(item.amount),
            item.payment_method,
            formatDate(item.payment_date),
            item.status
          ]),
          ...baseStyles
        };
      default:
        return {
          columns: Object.keys(data[0]),
          data: data.map(item => Object.values(item)),
          ...baseStyles
        };
    }
  };

 const startY = (reportType === 'orders' || reportType === 'payments') ? 65 : 51;
    
    const { columns, data: tableData, ...styles } = getColumnsAndData();

    doc.autoTable({
      startY,
      columns: columns.map(title => ({ header: title })),
      body: tableData,
      ...styles,
      margin: { top: 45, right: 20, bottom: 20, left: 20 },
      didDrawPage: (data) => {
        doc.setFontSize(8);
        doc.text(
          `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }
    });

    return doc;
  };
 const handleExportCSV = () => {
    try {
      if (reportData.length === 0) {
        throw new Error("No data available for export.");
      }
      const csvData = convertToCSV(reportData, reportType, summaryData);
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleExportPDF = () => {
    try {
      if (reportData.length === 0) {
        throw new Error("No data available for export.");
      }
      const doc = exportToPDF(reportData, reportType);
      doc.save(`${reportType}_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      setError(error.message);
    }
  };

  const renderExportButtons = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[150px]">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
  // Add summary display component
  const renderSummary = () => {
    return (
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className=" p-2 rounded-md">
          <span className="font-semibold">Total Records:</span>{' '}
          {summaryData.totalCount}
        </div>
        
        {(reportType === 'orders' || reportType === 'payments') && (
          <>
            <div className=" p-2 rounded-md">
              <span className="font-semibold">Total Amount:</span>{' '}
              {formatCurrency(summaryData.totalAmount)}
            </div>
           
          </>
        )}
      </div>
    );
  };

  const renderFilters = () => {
    switch (reportType) {
      case 'clients':
        return (
          <div className="flex gap-4 flex-wrap">
            <Select
              value={filters.clientType}
              onValueChange={(value) => handleFilterChange('clientType', value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="graduate_student">Graduate Student</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search by phone"
              value={filters.phone || ''}
              onChange={(e) => handleFilterChange('phone', e.target.value)}
              className="w-[200px]"
            />
          </div>
        );

      case 'services':
        return (
          <div className="flex gap-4 flex-wrap">
            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.clientType}
              onValueChange={(value) => handleFilterChange('clientType', value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="graduate_student">Graduate Student</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search client name/phone"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-[250px]"
            />
          </div>
        );

      case 'orders':
        return (
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-[150px]"
              />
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-[150px]"
              />
            </div>
            <Select
              value={filters.orderStatus}
              onValueChange={(value) => handleFilterChange('orderStatus', value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.clientType}
              onValueChange={(value) => handleFilterChange('clientType', value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="graduate_student">Graduate Student</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search by address"
              value={filters.address || ''}
              onChange={(e) => handleFilterChange('address', e.target.value)}
              className="w-[200px]"
            />
          </div>
        );

      case 'payments':
        return (
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-4 sm:flex-row">
              <Input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-[150px]"
              />
              <Input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="w-[150px]"
              />
            </div>
            <Select
              value={filters.paymentMethod}
              onValueChange={(value) => handleFilterChange('paymentMethod', value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="EvcPlus">EvcPlus</SelectItem>
                <SelectItem value="Edahab">Edahab</SelectItem>
                <SelectItem value="Merchant">Merchant</SelectItem>
                <SelectItem value="SalaamAccount">Salaam Account</SelectItem>
                <SelectItem value="PremierWallet">Premier Wallet</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search by client phone"
              value={filters.clientPhone || ''}
              onChange={(e) => handleFilterChange('clientPhone', e.target.value)}
              className="w-[200px]"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const renderTableHeaders = () => {
    switch (reportType) {
      case 'clients':
        return (
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Client Type</TableHead>
          </TableRow>
        );

      case 'services':
        return (
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Service Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        );

      case 'orders':
        return (
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Final Price</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        );

      case 'payments':
        return (
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        );

      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return reportData.map((item) => {
          const uniqueKey = `${reportType}-${item.client_id || item.service_id || item.order_id || item.payment_id}`;
      switch (reportType) {
        case 'clients':
          return (
          <TableRow key={uniqueKey}>
              <TableCell>{item.client_id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.client_type}</TableCell>
            </TableRow>
          );

        case 'services':
          return (
          <TableRow key={uniqueKey}>
              <TableCell>{item.service_id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.description}</TableCell>
              <TableCell>${item.price}</TableCell>
              <TableCell>{item.client_name} ({item.client_phone})</TableCell>
              <TableCell>{new Date(item.service_date).toLocaleDateString()}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          );

        case 'orders':
          return (
          <TableRow key={uniqueKey}>
              <TableCell>{item.order_id}</TableCell>
              <TableCell>{item.client_name} ({item.client_phone})</TableCell>
              <TableCell>{item.order_type}</TableCell>
              <TableCell>${item.total_price}</TableCell>
              <TableCell>${item.final_price}</TableCell>
              <TableCell>{new Date(item.order_date).toLocaleDateString()}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          );

        case 'payments':
          return (
          <TableRow key={uniqueKey}>
              <TableCell>{item.payment_id}</TableCell>
              <TableCell>{item.orderId}</TableCell>
              <TableCell>{item.client_name} ({item.client_phone})</TableCell>
              <TableCell>${item.amount}</TableCell>
              <TableCell>{item.payment_method}</TableCell>
              <TableCell>{new Date(item.payment_date).toLocaleDateString()}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
          );

        default:
          return null;
      }
    });
  };

return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Reports Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-start">
            <div className="flex flex-col gap-4 w-full">
              <Select
                value={reportType}
                onValueChange={handleReportTypeChange}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clients">Clients Report</SelectItem>
                  <SelectItem value="services">Services Report</SelectItem>
                  <SelectItem value="orders">Orders Report</SelectItem>
                  <SelectItem value="payments">Payments Report</SelectItem>
                </SelectContent>
              </Select>

              {renderFilters()}
              <div className="flex gap-4 items-center">
                <Button 
                  onClick={handleApplyFilters}
                  className="w-[150px]"
                >
                  <Search className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
                {renderExportButtons()}
              </div>
            </div>
          </div>

          {/* Add summary display */}
          {!loading && !error && renderSummary()}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {renderTableHeaders()}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : reportData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  renderTableRows()
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Reports;