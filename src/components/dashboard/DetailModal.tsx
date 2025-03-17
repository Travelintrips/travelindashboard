import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  customer: string;
  type: "flight" | "hotel";
  amount: number;
  status: "completed" | "pending" | "failed";
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "revenue" | "transactions" | "average" | "customers" | "transaction";
  data?: any;
}

const DetailModal = ({ isOpen, onClose, type, data }: DetailModalProps) => {
  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Type badge color mapping
  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-800";
      case "hotel":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderContent = () => {
    switch (type) {
      case "revenue":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Detail Pendapatan</DialogTitle>
              <DialogDescription>
                Rincian pendapatan dan perbandingan dengan periode sebelumnya
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">
                      Pendapatan Bulan Ini
                    </h3>
                    <p className="text-3xl font-bold">
                      ${data?.totalRevenue?.toLocaleString() || "124,350.75"}
                    </p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">12.5%</span>
                      <span className="text-sm text-gray-500 ml-1">
                        dari bulan lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">
                      Pendapatan Tahun Ini
                    </h3>
                    <p className="text-3xl font-bold">$1,458,932.50</p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">8.3%</span>
                      <span className="text-sm text-gray-500 ml-1">
                        dari tahun lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Distribusi Pendapatan
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span>Penerbangan</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>Hotel</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        );
      case "transactions":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Detail Transaksi</DialogTitle>
              <DialogDescription>
                Analisis transaksi dan tren pembelian
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">
                      Total Transaksi
                    </h3>
                    <p className="text-3xl font-bold">
                      {data?.transactionCount?.toLocaleString() || "1,243"}
                    </p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">8.2%</span>
                      <span className="text-sm text-gray-500 ml-1">
                        dari bulan lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">
                      Rata-rata Harian
                    </h3>
                    <p className="text-3xl font-bold">41.4</p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">5.7%</span>
                      <span className="text-sm text-gray-500 ml-1">
                        dari bulan lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Status Transaksi</h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Selesai</span>
                  </div>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span>Tertunda</span>
                  </div>
                  <span className="font-medium">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Gagal</span>
                  </div>
                  <span className="font-medium">7%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-red-500 h-2.5 rounded-full"
                    style={{ width: "7%" }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        );
      case "average":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Detail Nilai Rata-rata</DialogTitle>
              <DialogDescription>
                Analisis nilai transaksi rata-rata
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">
                      Nilai Rata-rata
                    </h3>
                    <p className="text-3xl font-bold">
                      ${data?.averageValue?.toFixed(2) || "100.04"}
                    </p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">4.3%</span>
                      <span className="text-sm text-gray-500 ml-1">
                        dari bulan lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">Nilai Median</h3>
                    <p className="text-3xl font-bold">$89.50</p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">3.1%</span>
                      <span className="text-sm text-gray-500 ml-1">
                        dari bulan lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Distribusi Nilai Transaksi
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span>$0 - $100</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "45%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>$101 - $300</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "30%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>$301 - $500</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "15%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>$501+</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "10%" }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        );
      case "customers":
        return (
          <>
            <DialogHeader>
              <DialogTitle>Detail Pelanggan</DialogTitle>
              <DialogDescription>
                Analisis pelanggan aktif dan perilaku pembelian
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">
                      Pelanggan Aktif
                    </h3>
                    <p className="text-3xl font-bold">842</p>
                    <div className="flex items-center mt-2">
                      <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-sm text-red-500">1.8%</span>
                      <span className="text-sm text-gray-500 ml-1">
                        dari bulan lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium mb-2">Pelanggan Baru</h3>
                    <p className="text-3xl font-bold">124</p>
                    <div className="flex items-center mt-2">
                      <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">5.1%</span>
                      <span className="text-sm text-gray-500 ml-1">
                        dari bulan lalu
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Segmentasi Pelanggan
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span>Pelanggan Baru (1 transaksi)</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-amber-600 h-2.5 rounded-full"
                    style={{ width: "35%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>Pelanggan Berulang (2-5 transaksi)</span>
                  <span className="font-medium">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-amber-600 h-2.5 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span>Pelanggan Loyal (6+ transaksi)</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-amber-600 h-2.5 rounded-full"
                    style={{ width: "25%" }}
                  ></div>
                </div>
              </div>
            </div>
          </>
        );
      case "transaction":
        if (!data) return <p>Tidak ada data transaksi</p>;
        return (
          <>
            <DialogHeader>
              <DialogTitle>Detail Transaksi {data.id}</DialogTitle>
              <DialogDescription>
                Informasi lengkap tentang transaksi
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">ID Transaksi</p>
                  <p className="font-medium">{data.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tanggal</p>
                  <p className="font-medium">{data.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pelanggan</p>
                  <p className="font-medium">{data.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jenis</p>
                  <Badge variant="outline" className={getTypeColor(data.type)}>
                    {data.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jumlah</p>
                  <p className="font-medium">${data.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    variant="outline"
                    className={getStatusColor(data.status)}
                  >
                    {data.status}
                  </Badge>
                </div>
              </div>

              {data.type === "flight" && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-2">
                    Detail Penerbangan
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Maskapai</p>
                      <p className="font-medium">Garuda Indonesia</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Nomor Penerbangan</p>
                      <p className="font-medium">GA-421</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dari</p>
                      <p className="font-medium">Jakarta (CGK)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ke</p>
                      <p className="font-medium">Bali (DPS)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Berangkat</p>
                      <p className="font-medium">2023-06-15</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Kembali</p>
                      <p className="font-medium">2023-06-22</p>
                    </div>
                  </div>
                </div>
              )}

              {data.type === "hotel" && (
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h3 className="text-lg font-medium mb-2">Detail Hotel</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Nama Hotel</p>
                      <p className="font-medium">Grand Hyatt Bali</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lokasi</p>
                      <p className="font-medium">Bali, Indonesia</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">2023-06-15</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">2023-06-22</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipe Kamar</p>
                      <p className="font-medium">Deluxe Ocean View</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jumlah Tamu</p>
                      <p className="font-medium">2 Dewasa</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Detail Pembayaran</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Metode Pembayaran</p>
                    <p className="font-medium">Kartu Kredit</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Pembayaran</p>
                    <p className="font-medium">{data.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="font-medium">
                      ${(data.amount * 0.9).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pajak</p>
                    <p className="font-medium">
                      ${(data.amount * 0.1).toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="font-bold text-lg">
                      ${data.amount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return <p>Tidak ada data yang tersedia</p>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        {renderContent()}
        <DialogFooter>
          <Button onClick={onClose}>Tutup</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailModal;
