import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface AirportServiceProductManagementProps {
  userName?: string;
  userAvatar?: string;
}

interface AirportService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
}

const AirportServiceProductManagement = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: AirportServiceProductManagementProps) => {
  const [activeTab, setActiveTab] = useState("services");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newService, setNewService] = useState<Partial<AirportService>>({
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    isActive: true,
  });

  // Sample service categories based on PRD
  const serviceCategories = [
    { id: "lounge", name: "Executive Lounge" },
    { id: "transport", name: "Transportation" },
    { id: "sapphire", name: "Sapphire Handling" },
    { id: "porter", name: "Porter Service" },
    { id: "modem", name: "Modem Rental & Sim Card" },
    { id: "sport", name: "Sport Center" },
  ];

  // Sample services data
  const [services, setServices] = useState<AirportService[]>([
    {
      id: "S001",
      name: "Executive Lounge Access - 3 Hours",
      description: "Access to premium lounge with refreshments for 3 hours",
      price: 750000,
      category: "Executive Lounge",
      isActive: true,
    },
    {
      id: "S002",
      name: "Airport Transfer - Sedan",
      description: "Comfortable sedan transfer to/from airport",
      price: 1200000,
      category: "Transportation",
      isActive: true,
    },
    {
      id: "S003",
      name: "Sapphire Handling - Premium",
      description: "Premium handling service with dedicated staff",
      price: 2500000,
      category: "Sapphire Handling",
      isActive: true,
    },
    {
      id: "S004",
      name: "Porter Service - 2 Bags",
      description: "Assistance with carrying luggage (up to 2 bags)",
      price: 350000,
      category: "Porter Service",
      isActive: true,
    },
    {
      id: "S005",
      name: "Modem Rental - 7 Days",
      description: "High-speed internet modem rental for 7 days",
      price: 200000,
      category: "Modem Rental & Sim Card",
      isActive: true,
    },
    {
      id: "S006",
      name: "Sport Center Access - Day Pass",
      description: "Full day access to airport sport facilities",
      price: 500000,
      category: "Sport Center",
      isActive: true,
    },
  ]);

  // Fetch services from Supabase
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category", "airport_service");

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedServices = data.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || "",
          price: item.selling_price,
          category: item.unit || "",
          isActive: item.is_active || true,
        }));
        setServices(formattedServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on search term and category
  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof AirportService,
  ) => {
    const value =
      field === "price" ? parseFloat(e.target.value) : e.target.value;

    setNewService({ ...newService, [field]: value });
  };

  // Handle category selection change
  const handleCategoryChange = (value: string) => {
    setNewService({ ...newService, category: value });
  };

  // Generate a new service ID
  const generateServiceId = () => {
    const lastId =
      services.length > 0 ? services[services.length - 1].id : "S000";
    const numericPart = parseInt(lastId.substring(1));
    return `S${(numericPart + 1).toString().padStart(3, "0")}`;
  };

  // Handle add service form submission
  const handleAddService = async () => {
    try {
      const serviceId = generateServiceId();
      const newServiceWithId = {
        ...newService,
        id: serviceId,
        isActive: true,
      } as AirportService;

      // Add to Supabase
      const { error } = await supabase.from("products").insert({
        id: serviceId,
        name: newServiceWithId.name,
        description: newServiceWithId.description,
        selling_price: newServiceWithId.price,
        purchase_price: newServiceWithId.price * 0.7, // Assuming cost is 70% of selling price
        category: "airport_service",
        unit: newServiceWithId.category,
        code: serviceId,
        is_active: true,
        stock_quantity: 999, // Services don't have traditional inventory
      });

      if (error) throw error;

      // Update local state
      setServices([...services, newServiceWithId]);
      setNewService({
        id: "",
        name: "",
        description: "",
        price: 0,
        category: "",
        isActive: true,
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding service:", error);
    }
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
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold mb-6">
        Manajemen Produk Layanan Bandara
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kelola Layanan Bandara</h2>
          <p className="text-gray-500">
            Tambah, ubah, dan kelola produk layanan bandara
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Layanan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Tambah Layanan Bandara Baru</DialogTitle>
                <DialogDescription>
                  Masukkan detail layanan bandara baru di bawah ini.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Nama Layanan</Label>
                  <Input
                    id="service-name"
                    value={newService.name}
                    onChange={(e) => handleInputChange(e, "name")}
                    placeholder="Nama layanan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-category">Kategori</Label>
                  <Select
                    value={newService.category}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="service-category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-description">Deskripsi</Label>
                  <Textarea
                    id="service-description"
                    value={newService.description}
                    onChange={(e) => handleInputChange(e, "description")}
                    placeholder="Deskripsi layanan"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-price">Harga (IDR)</Label>
                  <Input
                    id="service-price"
                    type="number"
                    min="0"
                    value={newService.price}
                    onChange={(e) => handleInputChange(e, "price")}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddService}
                  disabled={
                    !newService.name ||
                    !newService.category ||
                    !newService.description ||
                    !newService.price
                  }
                >
                  Simpan Layanan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="services">Daftar Layanan</TabsTrigger>
          <TabsTrigger value="categories">Kategori</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <CardTitle>Layanan Bandara</CardTitle>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Cari layanan..."
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
                        {serviceCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-4">Memuat layanan...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nama Layanan</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Harga</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Tindakan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredServices.length > 0 ? (
                      filteredServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">
                            {service.id}
                          </TableCell>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{service.category}</Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {service.description}
                          </TableCell>
                          <TableCell>{formatCurrency(service.price)}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                service.isActive
                                  ? "bg-green-500"
                                  : "bg-gray-500"
                              }
                            >
                              {service.isActive ? "Aktif" : "Tidak Aktif"}
                            </Badge>
                          </TableCell>
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
                          colSpan={7}
                          className="text-center py-6 text-gray-500"
                        >
                          Tidak ada layanan ditemukan
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Kategori Layanan</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nama Kategori</TableHead>
                    <TableHead>Jumlah Layanan</TableHead>
                    <TableHead>Akun Pendapatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceCategories.map((category) => {
                    const serviceCount = services.filter(
                      (s) => s.category === category.name,
                    ).length;
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          {category.id}
                        </TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>{serviceCount}</TableCell>
                        <TableCell>
                          {category.id === "lounge" &&
                            "4101 - Pendapatan Executive Lounge"}
                          {category.id === "transport" &&
                            "4102 - Pendapatan Transportation"}
                          {category.id === "sapphire" &&
                            "4103 - Pendapatan Saphire Handling"}
                          {category.id === "porter" &&
                            "4104 - Pendapatan Porter Service"}
                          {category.id === "modem" &&
                            "4105 - Pendapatan Modem Rental & Sim Card"}
                          {category.id === "sport" &&
                            "4106 - Pendapatan Sport Center"}
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
    </div>
  );
};

export default AirportServiceProductManagement;
