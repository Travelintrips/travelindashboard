import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "../dashboard/DashboardHeader";
import FilterBar from "../dashboard/FilterBar";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, BarChart3, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import DatePickerWithRange from "../ui/date-picker-with-range";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface InventoryDashboardProps {
  userName?: string;
  userAvatar?: string;
}

const InventoryDashboard = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: InventoryDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);

  // Sample product categories data
  const categoryData = [
    { name: "Elektronik", value: 120, color: "#8884d8" },
    { name: "Pakaian", value: 85, color: "#83a6ed" },
    { name: "Makanan", value: 65, color: "#8dd1e1" },
    { name: "Minuman", value: 45, color: "#82ca9d" },
    { name: "Alat Tulis", value: 30, color: "#a4de6c" },
  ];

  // Sample product stock data
  const stockData = [
    { name: "Elektronik", stock: 120 },
    { name: "Pakaian", stock: 85 },
    { name: "Makanan", stock: 65 },
    { name: "Minuman", stock: 45 },
    { name: "Alat Tulis", stock: 30 },
  ];

  // Sample recent transactions
  const recentTransactions = [
    {
      id: "INV-1234",
      date: "2023-06-15",
      product: "Laptop Asus",
      type: "Purchase",
      quantity: 10,
      totalCost: 45000000,
    },
    {
      id: "INV-1235",
      date: "2023-06-14",
      product: "Kemeja Putih",
      type: "Sale",
      quantity: 5,
      totalCost: 750000,
    },
    {
      id: "INV-1236",
      date: "2023-06-14",
      product: "Mie Instan",
      type: "Purchase",
      quantity: 100,
      totalCost: 500000,
    },
    {
      id: "INV-1237",
      date: "2023-06-13",
      product: "Air Mineral",
      type: "Sale",
      quantity: 50,
      totalCost: 250000,
    },
    {
      id: "INV-1238",
      date: "2023-06-12",
      product: "Pulpen",
      type: "Adjustment",
      quantity: -5,
      totalCost: -25000,
    },
  ];

  // Sample low stock products
  const lowStockProducts = [
    {
      id: "P001",
      name: "Laptop Asus",
      category: "Elektronik",
      stock: 5,
      reorderLevel: 10,
    },
    {
      id: "P005",
      name: "Mie Instan",
      category: "Makanan",
      stock: 20,
      reorderLevel: 50,
    },
    {
      id: "P008",
      name: "Air Mineral",
      category: "Minuman",
      stock: 15,
      reorderLevel: 30,
    },
  ];

  // Calculate total stock value
  const totalStockValue = 345750000; // In a real app, this would be calculated from actual data

  // Handle export functionality
  const handleExport = (format: string) => {
    setIsExporting(true);
    console.log(`Exporting inventory data in ${format} format`);

    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log(`Export completed`);
    }, 2000);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Manajemen Persediaan"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard Persediaan</h2>
          <div className="flex gap-2">
            <Link to="/inventory-transaction-entry">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Transaksi Baru
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Daftar Produk
              </Button>
            </Link>
            <Link to="/accounting">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Akuntansi
              </Button>
            </Link>
            <Link to="/transaction-entry">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Transaksi
              </Button>
            </Link>
            <Link to="/chart-of-accounts">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Bagan Akun
              </Button>
            </Link>
          </div>
        </div>

        {/* Date Range Picker */}
        <div className="mb-6">
          <DatePickerWithRange className="" />
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
          }}
          autoRefresh={false}
        />

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-amber-800">
                Peringatan Stok Rendah
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3 bg-white border border-amber-100 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      Kategori: {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-600 font-bold">{product.stock}</p>
                    <p className="text-xs text-gray-500">
                      Min: {product.reorderLevel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
            <TabsTrigger value="products">Produk</TabsTrigger>
            <TabsTrigger value="transactions">Transaksi</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Nilai Persediaan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(totalStockValue)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Berdasarkan harga pokok
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Produk
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">345</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Dalam 5 kategori
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Transaksi Bulan Ini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">87</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    +12% dari bulan lalu
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Stok Berdasarkan Kategori</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stockData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="stock"
                          name="Jumlah Stok"
                          fill="#8884d8"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Distribusi Kategori Produk</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={(entry) => entry.name}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Transaksi Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Transaksi</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Produk</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Kuantitas</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.product}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              transaction.type === "Purchase"
                                ? "bg-blue-100 text-blue-800"
                                : transaction.type === "Sale"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-amber-100 text-amber-800"
                            }
                          >
                            {transaction.type === "Purchase"
                              ? "Pembelian"
                              : transaction.type === "Sale"
                                ? "Penjualan"
                                : "Penyesuaian"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.type === "Adjustment" &&
                          transaction.quantity < 0
                            ? transaction.quantity
                            : "+" + transaction.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(transaction.totalCost)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Daftar Produk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">
                  Daftar produk akan ditampilkan di sini
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Riwayat Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10 text-muted-foreground">
                  Riwayat transaksi akan ditampilkan di sini
                </p>
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
              &copy; {new Date().getFullYear()} Sistem Akuntansi Indonesia.
              Seluruh hak cipta dilindungi.
            </p>
            <p className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default InventoryDashboard;
