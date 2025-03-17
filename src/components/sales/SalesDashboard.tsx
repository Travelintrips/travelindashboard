import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "../dashboard/DashboardHeader";
import RevenueSummary from "../dashboard/RevenueSummary";
import SalesChart from "../dashboard/SalesChart";
import TransactionsTable from "../dashboard/TransactionsTable";
import FilterBar from "../dashboard/FilterBar";
import { Button } from "@/components/ui/button";
import { PlusCircle, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import DatePickerWithRange from "../ui/date-picker-with-range";
import ExportOptions from "../dashboard/ExportOptions";
import { SalesData } from "@/types/accounting";
import { DateRange } from "react-day-picker";
import {
  addMonths,
  format,
  isWithinInterval,
  parse,
  parseISO,
  startOfMonth,
} from "date-fns";
import { getSalesData, getRecentTransactions } from "@/services/salesService";

interface SalesDashboardProps {
  userName?: string;
  userAvatar?: string;
}

const SalesDashboard = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: SalesDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addMonths(new Date(), -6),
    to: new Date(),
  });
  const [filteredSalesData, setFilteredSalesData] = useState<SalesData[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);

  // Get sales data from service
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  // Load sales data
  useEffect(() => {
    setSalesData(getSalesData());
  }, []);

  // Get recent transactions from service
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);

  // Load recent transactions
  useEffect(() => {
    setRecentTransactions(getRecentTransactions());
  }, []);

  // Filter data based on date range
  useEffect(() => {
    if (!dateRange?.from || !dateRange?.to) {
      setFilteredSalesData(salesData);
      setFilteredTransactions(recentTransactions);
      return;
    }

    // Filter sales data
    const filtered = salesData.filter((item) => {
      // Convert period (e.g., "Jan") to a date in the current year
      const currentYear = new Date().getFullYear();
      const monthDate = parse(item.period, "MMM", new Date());
      const itemDate = new Date(currentYear, monthDate.getMonth(), 1);

      return isWithinInterval(itemDate, {
        start: startOfMonth(dateRange.from),
        end: dateRange.to,
      });
    });
    setFilteredSalesData(filtered);

    // Filter transactions
    const filteredTx = recentTransactions.filter((tx) => {
      const txDate = parseISO(tx.date);
      return isWithinInterval(txDate, {
        start: dateRange.from,
        end: dateRange.to,
      });
    });
    setFilteredTransactions(filteredTx);
  }, [dateRange, salesData, recentTransactions]);

  // Calculate totals from filtered data
  const totalFlightSales = filteredSalesData.reduce(
    (sum, item) => sum + item.flightSales,
    0,
  );
  const totalHotelSales = filteredSalesData.reduce(
    (sum, item) => sum + item.hotelSales,
    0,
  );
  const totalSales = filteredSalesData.reduce(
    (sum, item) => sum + item.totalSales,
    0,
  );
  const totalTransactions = filteredSalesData.reduce(
    (sum, item) => sum + item.transactionCount,
    0,
  );
  const averageTransactionValue =
    totalTransactions > 0 ? totalSales / totalTransactions : 0;

  const handleExport = (format: string) => {
    setIsExporting(true);
    console.log(`Exporting dashboard data in ${format} format`);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Export completed`);
    }, 2000);
  };

  const handleInventoryClick = (inventory: string) => {
    console.log(`Navigating to inventory details for: ${inventory}`);
    // In a real app, this would navigate to inventory details page
  };

  const handleCategoryClick = (category: string) => {
    console.log(`Navigating to category details for: ${category}`);
    // In a real app, this would navigate to category details page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Sales Dashboard"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sales Dashboard</h2>
          <div className="flex gap-2">
            <Link to="/sales-transaction-entry">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Transaction
              </Button>
            </Link>
            <Link to="/sales-reports">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Sales Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="mb-6">
          <DatePickerWithRange
            className=""
            date={dateRange}
            onDateChange={setDateRange}
          />
        </div>

        {/* Filter Bar */}
        <FilterBar
          onFilterChange={(filters) => {
            console.log("Filters applied:", filters);
          }}
          onSearch={(query) => {
            console.log("Search query:", query);
          }}
          onRefresh={() => {
            console.log("Refreshing data...");
            setSalesData(getSalesData());
            setRecentTransactions(getRecentTransactions());
          }}
          autoRefresh={false}
        />

        {/* Export Options */}
        <div className="mb-6">
          <ExportOptions onExport={handleExport} disabled={isExporting} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flights">Flight Sales</TabsTrigger>
            <TabsTrigger value="hotels">Hotel Sales</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Summary Cards */}
            <RevenueSummary
              totalRevenue={totalSales}
              transactionCount={totalTransactions}
              averageValue={averageTransactionValue}
              growthRate={12.5}
              onCardClick={(cardType) =>
                console.log(`Clicked ${cardType} card`)
              }
            />

            {/* Sales Chart */}
            <SalesChart
              title="Sales Overview"
              subtitle={`Monthly flight and hotel sales comparison (${dateRange?.from ? format(dateRange.from, "MMM yyyy") : ""} - ${dateRange?.to ? format(dateRange.to, "MMM yyyy") : ""})`}
              data={filteredSalesData}
              onDrillDown={(month) =>
                console.log(`Drilling down to ${month} data`)
              }
            />

            {/* Transactions Table */}
            <TransactionsTable
              transactions={filteredTransactions}
              onRowClick={(transaction) =>
                console.log(`Viewing details for transaction ${transaction.id}`)
              }
              onExport={() => handleExport("csv")}
              onInventoryClick={handleInventoryClick}
              onCategoryClick={handleCategoryClick}
            />
          </TabsContent>

          <TabsContent value="flights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Flight Sales Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Monthly Flight Sales
                      </h3>
                      <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                        Flight Sales Chart Placeholder
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Flight Sales by Destination
                      </h3>
                      <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                        Destination Chart Placeholder
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Flight Sales</span>
                      <span className="text-blue-600">
                        ${totalFlightSales.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hotel Sales Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Monthly Hotel Sales
                      </h3>
                      <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                        Hotel Sales Chart Placeholder
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Hotel Sales by Property
                      </h3>
                      <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
                        Property Chart Placeholder
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Hotel Sales</span>
                      <span className="text-green-600">
                        ${totalHotelSales.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
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

export default SalesDashboard;
