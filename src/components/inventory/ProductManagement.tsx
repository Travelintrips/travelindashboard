import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import DashboardHeader from "../dashboard/DashboardHeader";
import { Link } from "react-router-dom";

interface ProductManagementProps {
  userName?: string;
  userAvatar?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  reorderLevel: number;
}

const ProductManagement = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: ProductManagementProps) => {
  const [activeTab, setActiveTab] = useState("products");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLowStock, setShowLowStock] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    id: "",
    name: "",
    category: "",
    stockQuantity: 0,
    unitPrice: 0,
    costPrice: 0,
    supplier: "",
    reorderLevel: 0,
  });

  // Sample product categories
  const categories = [
    { id: "cat1", name: "Elektronik" },
    { id: "cat2", name: "Pakaian" },
    { id: "cat3", name: "Makanan" },
    { id: "cat4", name: "Minuman" },
    { id: "cat5", name: "Alat Tulis" },
  ];

  // Sample products data
  const [products, setProducts] = useState<Product[]>([
    {
      id: "P001",
      name: "Laptop Asus",
      category: "Elektronik",
      stockQuantity: 5,
      unitPrice: 9000000,
      costPrice: 8000000,
      supplier: "PT Asus Indonesia",
      reorderLevel: 10,
    },
    {
      id: "P002",
      name: "Kemeja Putih",
      category: "Pakaian",
      stockQuantity: 50,
      unitPrice: 150000,
      costPrice: 100000,
      supplier: "PT Fashion Indonesia",
      reorderLevel: 20,
    },
    {
      id: "P003",
      name: "Mie Instan",
      category: "Makanan",
      stockQuantity: 20,
      unitPrice: 5000,
      costPrice: 4000,
      supplier: "PT Indofood",
      reorderLevel: 50,
    },
    {
      id: "P004",
      name: "Air Mineral",
      category: "Minuman",
      stockQuantity: 15,
      unitPrice: 5000,
      costPrice: 3000,
      supplier: "PT Aqua",
      reorderLevel: 30,
    },
    {
      id: "P005",
      name: "Pulpen",
      category: "Alat Tulis",
      stockQuantity: 100,
      unitPrice: 5000,
      costPrice: 3000,
      supplier: "PT Stationery",
      reorderLevel: 50,
    },
  ]);

  // Filter products based on search term, category, and low stock
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesLowStock = showLowStock
      ? product.stockQuantity < product.reorderLevel
      : true;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Product,
  ) => {
    const value =
      field === "stockQuantity" ||
      field === "unitPrice" ||
      field === "costPrice" ||
      field === "reorderLevel"
        ? parseFloat(e.target.value)
        : e.target.value;

    setNewProduct({ ...newProduct, [field]: value });
  };

  // Handle category selection change
  const handleCategoryChange = (value: string) => {
    setNewProduct({ ...newProduct, category: value });
  };

  // Generate a new product ID
  const generateProductId = () => {
    const lastId =
      products.length > 0 ? products[products.length - 1].id : "P000";
    const numericPart = parseInt(lastId.substring(1));
    return `P${(numericPart + 1).toString().padStart(3, "0")}`;
  };

  // Handle add product form submission
  const handleAddProduct = () => {
    const productId = generateProductId();
    const newProductWithId = { ...newProduct, id: productId } as Product;
    setProducts([...products, newProductWithId]);
    setNewProduct({
      id: "",
      name: "",
      category: "",
      stockQuantity: 0,
      unitPrice: 0,
      costPrice: 0,
      supplier: "",
      reorderLevel: 0,
    });
    setIsAddDialogOpen(false);
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
        title="Manajemen Produk"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manajemen Produk</h2>
          <div className="flex gap-2">
            <Link to="/inventory-dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                Kembali ke Dashboard
              </Button>
            </Link>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Produk
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Tambah Produk Baru</DialogTitle>
                  <DialogDescription>
                    Masukkan informasi produk baru di bawah ini.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Nama Produk</Label>
                      <Input
                        id="product-name"
                        value={newProduct.name}
                        onChange={(e) => handleInputChange(e, "name")}
                        placeholder="Nama produk"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Kategori</Label>
                      <Select
                        value={newProduct.category}
                        onValueChange={handleCategoryChange}
                      >
                        <SelectTrigger id="product-category">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock-quantity">Jumlah Stok</Label>
                      <Input
                        id="stock-quantity"
                        type="number"
                        min="0"
                        value={newProduct.stockQuantity}
                        onChange={(e) => handleInputChange(e, "stockQuantity")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reorder-level">
                        Level Pemesanan Ulang
                      </Label>
                      <Input
                        id="reorder-level"
                        type="number"
                        min="0"
                        value={newProduct.reorderLevel}
                        onChange={(e) => handleInputChange(e, "reorderLevel")}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="unit-price">Harga Jual</Label>
                      <Input
                        id="unit-price"
                        type="number"
                        min="0"
                        value={newProduct.unitPrice}
                        onChange={(e) => handleInputChange(e, "unitPrice")}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cost-price">Harga Pokok</Label>
                      <Input
                        id="cost-price"
                        type="number"
                        min="0"
                        value={newProduct.costPrice}
                        onChange={(e) => handleInputChange(e, "costPrice")}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Pemasok</Label>
                    <Input
                      id="supplier"
                      value={newProduct.supplier}
                      onChange={(e) => handleInputChange(e, "supplier")}
                      placeholder="Nama pemasok"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleAddProduct}
                    disabled={
                      !newProduct.name ||
                      !newProduct.category ||
                      !newProduct.supplier
                    }
                  >
                    Simpan Produk
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="products">Daftar Produk</TabsTrigger>
            <TabsTrigger value="categories">Kategori</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle>Daftar Produk</CardTitle>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Cari produk..."
                        className="pl-8 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="w-full md:w-40">
                          <SelectValue placeholder="Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Kategori</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant={showLowStock ? "default" : "outline"}
                        className="flex items-center gap-2"
                        onClick={() => setShowLowStock(!showLowStock)}
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Stok Rendah
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama Produk</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Stok</TableHead>
                      <TableHead>Harga Jual</TableHead>
                      <TableHead>Harga Pokok</TableHead>
                      <TableHead>Pemasok</TableHead>
                      <TableHead className="text-right">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.id}
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`font-medium ${product.stockQuantity < product.reorderLevel ? "text-red-600" : ""}`}
                            >
                              {product.stockQuantity}
                            </span>
                            {product.stockQuantity < product.reorderLevel && (
                              <span className="ml-2 text-xs text-red-600">
                                (Min: {product.reorderLevel})
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(product.unitPrice)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(product.costPrice)}
                          </TableCell>
                          <TableCell>{product.supplier}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-6 text-gray-500"
                        >
                          Tidak ada produk ditemukan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Kategori Produk</CardTitle>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Tambah Kategori
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama Kategori</TableHead>
                      <TableHead>Jumlah Produk</TableHead>
                      <TableHead className="text-right">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => {
                      const productCount = products.filter(
                        (p) => p.category === category.name,
                      ).length;
                      return (
                        <TableRow key={category.id}>
                          <TableCell className="font-medium">
                            {category.id}
                          </TableCell>
                          <TableCell>{category.name}</TableCell>
                          <TableCell>{productCount}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

export default ProductManagement;
