import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  User,
  Phone,
  Mail,
  FileText,
  Clock,
  CreditCard,
} from "lucide-react";

interface OrderDetailProps {
  order: {
    id: string;
    customer: string;
    customerEmail?: string;
    customerPhone?: string;
    service: string;
    serviceCategory?: string;
    date: string;
    amount: number;
    status: string;
    notes?: string;
    createdAt?: string;
  };
  onClose: () => void;
  onStatusChange?: (orderId: string, newStatus: string) => void;
}

const OrderDetail = ({ order, onClose, onStatusChange }: OrderDetailProps) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get badge color based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-blue-500";
      case "Pending":
        return "bg-amber-500";
      case "Confirmed":
        return "bg-green-500";
      case "Completed":
        return "bg-green-700";
      case "Cancelled":
        return "bg-destructive";
      default:
        return "bg-gray-500";
    }
  };

  // Get available next statuses based on current status
  const getAvailableNextStatuses = (currentStatus: string) => {
    switch (currentStatus) {
      case "Pending":
        return ["Processing", "Confirmed", "Cancelled"];
      case "Processing":
        return ["Confirmed", "Cancelled"];
      case "Confirmed":
        return ["Completed", "Cancelled"];
      default:
        return [];
    }
  };

  const nextStatuses = getAvailableNextStatuses(order.status);

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{order.id}</CardTitle>
            <CardDescription className="mt-1">
              Created on {order.createdAt || order.date}
            </CardDescription>
          </div>
          <Badge className={getStatusBadgeClass(order.status)}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <User className="h-4 w-4" /> Informasi Pelanggan
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Nama:</span>
                <span>{order.customer}</span>
              </div>
              {order.customerEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{order.customerEmail}</span>
                </div>
              )}
              {order.customerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{order.customerPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" /> Detail Layanan
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">Layanan:</span>
                <span>{order.service}</span>
              </div>
              {order.serviceCategory && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Kategori:</span>
                  <span>{order.serviceCategory}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>Tanggal Layanan: {order.date}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Informasi Pembayaran
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Jumlah:</span>
              <span className="text-lg font-bold">
                {formatCurrency(order.amount)}
              </span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Catatan Tambahan</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p>{order.notes}</p>
            </div>
          </div>
        )}

        {nextStatuses.length > 0 && onStatusChange && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" /> Perbarui Status
            </h3>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((status) => (
                <Button
                  key={status}
                  variant="outline"
                  onClick={() => onStatusChange(order.id, status)}
                  className={`
                    ${status === "Cancelled" ? "border-red-200 hover:bg-red-50" : ""}
                    ${status === "Completed" ? "border-green-200 hover:bg-green-50" : ""}
                    ${status === "Confirmed" ? "border-blue-200 hover:bg-blue-50" : ""}
                  `}
                >
                  Tandai sebagai {status}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onClose}>Tutup</Button>
      </CardFooter>
    </Card>
  );
};

export default OrderDetail;
