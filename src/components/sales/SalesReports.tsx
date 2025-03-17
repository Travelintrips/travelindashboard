import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  Printer,
  BarChart3,
  PlusCircle,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardHeader from "../dashboard/DashboardHeader";
import { Link } from "react-router-dom";
import ExportOptions from "../dashboard/ExportOptions";
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

interface SalesReportsProps {
  userName?: string;
  userAvatar?: string;
}

const SalesReports = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: SalesReportsProps) => {
  const [activeTab, setActiveTab] = useState("monthly");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date(),
  });
  const [selectedTransactionType, setSelectedTransactionType] =
    useState<string>("all");
  const [isExporting, setIsExporting] = useState(false);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleExport = (format: string) => {
    setIsExporting(true);
    console.log(`Exporting ${activeTab} report in ${format} format`);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Export completed`);
    }, 2000);
  };

  // Sample monthly sales data
  const monthlySalesData = [
    {
      month: "January",
      flightSales: 45000,
      hotelSales: 32000,
      totalSales: 77000,
      transactionCount: 120,
    },
    {
      month: "February",
      flightSales: 52000,
      hotelSales: 38000,
      totalSales: 90000,
      transactionCount: 145,
    },
    {
      month: "March",
      flightSales: 48000,
      hotelSales: 41000,
      totalSales: 89000,
      transactionCount: 135,
    },
    {
      month: "April",
      flightSales: 61000,
      hotelSales: 45000,
      totalSales: 106000,
      transactionCount: 160,
    },
    {
      month: "May",
      flightSales: 58000,
      hotelSales: 52000,
      totalSales: 110000,
      transactionCount: 175,
    },
    {
      month: "June",
      flightSales: 65000,
      hotelSales: 58000,
      totalSales: 123000,
      transactionCount: 190,
    },
  ];

  // Sample detailed transactions
  const detailedTransactions = [
    {
      id: "TX-1234",
      date: "2023-06-15",
      customer: "John Smith",
      type: "Flight",
      product: "Jakarta to Bali",
      amount: 120.0,
    },
    {
      id: "TX-1235",
      date: "2023-06-14",
      customer: "Sarah Johnson",
      type: "Hotel",
      product: "Mulia Resort Bali",
      amount: 750.0,
    },
    {
      id: "TX-1236",
      date: "2023-06-14",
      customer: "Michael Brown",
      type: "Flight",
      product: "Surabaya to Jakarta",
      amount: 95.0,
    },
    {
      id: "TX-1237",
      date: "2023-06-13",
      customer: "Emily Davis",
      type: "Hotel",
      product: "Grand Hyatt Jakarta",
      amount: 600.0,
    },
    {
      id: "TX-1238",
      date: "2023-06-13",
      customer: "Robert Wilson",
      type: "Flight",
      product: "Jakarta to Yogyakarta",
      amount: 85.0,
    },
    {
      id: "TX-1239",
      date: "2023-06-12",
      customer: "Jennifer Lee",
      type: "Hotel",
      product: "Sheraton Surabaya",
      amount: 540.0,
    },
    {
      id: "TX-1240",
      date: "2023-06-12",
      customer: "David Miller",
      type: "Flight",
      product: "Bali to Jakarta",
      amount: 125.0,
    },
    {
      id: "TX-1241",
      date: "2023-06-11",
      customer: "Lisa Anderson",
      type: "Hotel",
      product: "Ayana Resort Bali",
      amount: 900.0,
    },
    {
      id: "TX-1242",
      date: "2023-06-11",
      customer: "James Taylor",
      type: "Flight",
      product: "Jakarta to Surabaya",
      amount: 90.0,
    },
    {
      id: "TX-1243",
      date: "2023-06-10",
      customer: "Patricia Moore",
      type: "Hotel",
      product: "JW Marriott Jakarta",
      amount: 660.0,
    },
  ];

  // Filter transactions based on selected type
  const filteredTransactions = detailedTransactions.filter((transaction) => {
    return (
      selectedTransactionType === "all" ||
      (selectedTransactionType === "flight" && transaction.type === "Flight") ||
      (selectedTransactionType === "hotel" && transaction.type === "Hotel")
    );
  });

  // Calculate totals for filtered transactions
  const totalAmount = filteredTransactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0,
  );
  const transactionCount = filteredTransactions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Sales Reports"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sales Reports</h2>
          <div className="flex gap-2">
            <Link to="/transaction-entry">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Transaction
              </Button>
            </Link>
            <Link to="/sales-dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Period:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "PPP")} -{" "}
                        {format(dateRange.to, "PPP")}
                      </>
                    ) : (
                      format(dateRange.from, "PPP")
                    )
                  ) : (
                    <span>Select date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <DatePickerWithRange className="" />
              </PopoverContent>
            </Popover>
          </div>

          {/* Export Options */}
          <ExportOptions onExport={handleExport} disabled={isExporting} />
        </div>

        {/* Report Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="monthly">Monthly Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Transactions</TabsTrigger>
          </TabsList>

          {/* Monthly Summary */}
          <TabsContent value="monthly" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">
                    Monthly Sales Summary
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Period: January 2023 - June 2023
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Flight Sales</TableHead>
                      <TableHead className="text-right">Hotel Sales</TableHead>
                      <TableHead className="text-right">Total Sales</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthlySalesData.map((data) => (
                      <TableRow key={data.month}>
                        <TableCell className="font-medium">
                          {data.month}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(data.flightSales)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(data.hotelSales)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(data.totalSales)}
                        </TableCell>
                        <TableCell className="text-right">
                          {data.transactionCount}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-gray-50 font-bold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          monthlySalesData.reduce(
                            (sum, data) => sum + data.flightSales,
                            0,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          monthlySalesData.reduce(
                            (sum, data) => sum + data.hotelSales,
                            0,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          monthlySalesData.reduce(
                            (sum, data) => sum + data.totalSales,
                            0,
                          ),
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {monthlySalesData.reduce(
                          (sum, data) => sum + data.transactionCount,
                          0,
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Transactions */}
          <TabsContent value="detailed" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">
                    Detailed Transaction Report
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Period: June 10, 2023 - June 15, 2023
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {/* Transaction Type Filter */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Filter by Type:</span>
                  </div>
                  <Select
                    value={selectedTransactionType}
                    onValueChange={setSelectedTransactionType}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="flight">Flight Only</SelectItem>
                      <SelectItem value="hotel">Hotel Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.customer}</TableCell>
                        <TableCell>{transaction.type}</TableCell>
                        <TableCell>{transaction.product}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-gray-50 font-bold">
                      <TableCell colSpan={5}>
                        Total ({transactionCount} transactions)
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalAmount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Travel Booking System. All
              rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesReports;
