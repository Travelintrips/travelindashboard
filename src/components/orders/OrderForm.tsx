import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";

interface OrderFormProps {
  onSubmit: (orderData: any) => void;
  onCancel: () => void;
}

interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
}

const OrderForm = ({ onSubmit, onCancel }: OrderFormProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: "",
    quantity: 1,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Fetch services from Supabase
  const fetchServices = async () => {
    try {
      setIsLoading(true);
      // This would be replaced with actual Supabase query
      // const { data, error } = await supabase.from('products').select('*').eq('category', 'airport_service');

      // For now, we'll use sample data
      const sampleServices = [
        {
          id: "S001",
          name: "Executive Lounge Access - 3 Hours",
          price: 750000,
          category: "Executive Lounge",
        },
        {
          id: "S002",
          name: "Airport Transfer - Sedan",
          price: 1200000,
          category: "Transportation",
        },
        {
          id: "S003",
          name: "Sapphire Handling - Premium",
          price: 2500000,
          category: "Sapphire Handling",
        },
        {
          id: "S004",
          name: "Porter Service - 2 Bags",
          price: 350000,
          category: "Porter Service",
        },
        {
          id: "S005",
          name: "Modem Rental - 7 Days",
          price: 200000,
          category: "Modem Rental & Sim Card",
        },
      ];
      setServices(sampleServices);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (serviceId: string) => {
    setFormData({ ...formData, serviceId });
    const service = services.find((s) => s.id === serviceId) || null;
    setSelectedService(service);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const orderData = {
      ...formData,
      serviceName: selectedService.name,
      serviceCategory: selectedService.category,
      amount: selectedService.price * formData.quantity,
      status: "Pending",
      orderId: `ORD-${new Date().getFullYear()}-${Math.floor(
        Math.random() * 1000,
      )
        .toString()
        .padStart(3, "0")}`,
    };

    onSubmit(orderData);
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Informasi Pelanggan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Nama Pelanggan</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customerPhone">Nomor Telepon</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Surel</Label>
          <Input
            id="customerEmail"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Detail Layanan</h3>
        <div className="space-y-2">
          <Label htmlFor="serviceId">Pilih Layanan</Label>
          <Select
            value={formData.serviceId}
            onValueChange={handleServiceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih layanan" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - {formatCurrency(service.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedService && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Jumlah</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Layanan</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
        )}

        {selectedService && (
          <div className="bg-gray-50 p-4 rounded-md mt-4">
            <h4 className="font-medium mb-2">Ringkasan Pesanan</h4>
            <div className="flex justify-between">
              <span>Layanan:</span>
              <span>{selectedService.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Kategori:</span>
              <span>{selectedService.category}</span>
            </div>
            <div className="flex justify-between">
              <span>Harga per unit:</span>
              <span>{formatCurrency(selectedService.price)}</span>
            </div>
            <div className="flex justify-between">
              <span>Jumlah:</span>
              <span>{formData.quantity}</span>
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Total Jumlah:</span>
              <span>
                {formatCurrency(selectedService.price * formData.quantity)}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button
          type="submit"
          disabled={!selectedService || !formData.customerName}
        >
          Buat Pesanan
        </Button>
      </div>
    </form>
  );
};

export default OrderForm;
