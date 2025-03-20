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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardHeader from "../dashboard/DashboardHeader";
import { Link } from "react-router-dom";

interface InventoryTransactionEntryProps {
  userName?: string;
  userAvatar?: string;
}

interface TransactionFormData {
  transactionId: string;
  date: Date;
  productId: string;
  productName: string;
  transactionType: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  reference: string;
  notes: string;
}

const generateTransactionId = () => {
  const prefix = "INV";
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${randomNum}-${timestamp}`;
};

const InventoryTransactionEntry = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: InventoryTransactionEntryProps) => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Transaction form state
  const [transaction, setTransaction] = useState<TransactionFormData>({
    transactionId: generateTransactionId(),
    date: new Date(),
    productId: "",
    productName: "",
    transactionType: "Purchase",
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0,
    reference: "",
    notes: "",
  });

  // Sample product options
  const productOptions = [
    { id: "P001", name: "Laptop Asus", price: 9000000 },
    { id: "P002", name: "Kemeja Putih", price: 150000 },
    { id: "P003", name: "Mie Instan", price: 5000 },
    { id: "P004", name: "Air Mineral", price: 5000 },
    { id: "P005", name: "Pulpen", price: 5000 },
    { id: "P006", name: "Buku", price: 7000 },
  ];

  // Recent transactions state
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: "INV-1234-567890",
      date: "2023-06-15",
      product: "Laptop Asus",
      type: "Purchase",
      quantity: 10,
      amount: 90000000,
    },
    {
      id: "INV-5678-123456",
      date: "2023-06-14",
      product: "Kemeja Putih",
      type: "Sale",
      quantity: 5,
      amount: 750000,
    },
    {
      id: "INV-9012-345678",
      date: "2023-06-13",
      product: "Mie Instan",
      type: "Adjustment",
      quantity: -10,
      amount: -50000,
    },
  ]);

  const handleFormChange = (field: keyof TransactionFormData, value: any) => {
    setTransaction((prev) => {
      const updated = { ...prev, [field]: value };

      // Update product details if product is selected
      if (field === "productId") {
        const selectedProduct = productOptions.find((p) => p.id === value);
        if (selectedProduct) {
          updated.productName = selectedProduct.name;
          updated.unitPrice = selectedProduct.price;
          updated.totalAmount = selectedProduct.price * updated.quantity;
        }
      }

      // Update total amount if quantity changes
      if (field === "quantity" || field === "unitPrice") {
        updated.totalAmount = updated.unitPrice * updated.quantity;
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transaction submitted:", transaction);

    try {
      // In a real app, this would save to the database and post to the general ledger
      console.log("Posting to general ledger...");

      // Add to recent transactions list
      const newTransaction = {
        id: transaction.transactionId,
        date: format(transaction.date, "yyyy-MM-dd"),
        product: transaction.productName,
        type: transaction.transactionType,
        quantity: transaction.quantity,
        amount: transaction.totalAmount,
      };

      // Add the new transaction to the top of the list and keep only the most recent ones
      setRecentTransactions((prev) => [newTransaction, ...prev.slice(0, 2)]);

      // Reset form
      setTransaction({
        ...transaction,
        transactionId: generateTransactionId(),
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
        reference: "",
        notes: "",
      });

      // Show success message
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 3000);
    } catch (error) {
      console.error("Error saving transaction:", error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Entri Transaksi Persediaan"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Entri Transaksi Persediaan</h2>
          <div className="flex gap-2">
            <Link to="/inventory-dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link to="/accounting">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="w-full bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Transaksi Persediaan Baru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="transaction-id">ID Transaksi</Label>
                      <Input
                        id="transaction-id"
                        value={transaction.transactionId}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction-date">
                        Tanggal Transaksi
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !transaction.date && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {transaction.date ? (
                              format(transaction.date, "PPP")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={transaction.date}
                            onSelect={(date) => handleFormChange("date", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transaction-type">Jenis Transaksi</Label>
                      <Select
                        value={transaction.transactionType}
                        onValueChange={(value) =>
                          handleFormChange("transactionType", value)
                        }
                      >
                        <SelectTrigger id="transaction-type">
                          <SelectValue placeholder="Pilih jenis transaksi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Purchase">Pembelian</SelectItem>
                          <SelectItem value="Sale">Penjualan</SelectItem>
                          <SelectItem value="Adjustment">
                            Penyesuaian
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="product">Pilih Produk</Label>
                      <Select
                        value={transaction.productId}
                        onValueChange={(value) =>
                          handleFormChange("productId", value)
                        }
                      >
                        <SelectTrigger id="product">
                          <SelectValue placeholder="Pilih produk" />
                        </SelectTrigger>
                        <SelectContent>
                          {productOptions.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - {formatCurrency(product.price)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity">Kuantitas</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={transaction.quantity}
                        onChange={(e) =>
                          handleFormChange("quantity", parseInt(e.target.value))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unit-price">Harga Satuan</Label>
                      <Input
                        id="unit-price"
                        type="number"
                        min="0"
                        value={transaction.unitPrice}
                        onChange={(e) =>
                          handleFormChange(
                            "unitPrice",
                            parseFloat(e.target.value),
                          )
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="total-amount">Total</Label>
                      <Input
                        id="total-amount"
                        value={formatCurrency(transaction.totalAmount)}
                        disabled
                        className="bg-gray-50 font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reference">Referensi</Label>
                      <Input
                        id="reference"
                        value={transaction.reference}
                        onChange={(e) =>
                          handleFormChange("reference", e.target.value)
                        }
                        placeholder="Nomor referensi (opsional)"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Catatan</Label>
                      <Input
                        id="notes"
                        value={transaction.notes}
                        onChange={(e) =>
                          handleFormChange("notes", e.target.value)
                        }
                        placeholder="Catatan tambahan (opsional)"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 mt-6">
                    <Button type="submit" className="w-full">
                      <Save className="mr-2 h-4 w-4" />
                      Simpan Transaksi
                    </Button>
                  </div>
                </form>

                {formSubmitted && (
                  <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
                    Transaksi berhasil disimpan dan diposting ke buku besar!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="w-full bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Transaksi Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{tx.product}</span>
                        <span className="text-sm text-gray-500">{tx.date}</span>
                      </div>
                      <div className="mt-1 text-sm">
                        <div className="flex justify-between">
                          <span>
                            Jenis:{" "}
                            <span
                              className={
                                tx.type === "Purchase"
                                  ? "text-blue-600"
                                  : tx.type === "Sale"
                                    ? "text-green-600"
                                    : "text-amber-600"
                              }
                            >
                              {tx.type === "Purchase"
                                ? "Pembelian"
                                : tx.type === "Sale"
                                  ? "Penjualan"
                                  : "Penyesuaian"}
                            </span>
                          </span>
                          <span>Qty: {tx.quantity}</span>
                        </div>
                        <div className="font-medium mt-1">
                          {formatCurrency(tx.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full bg-white shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Posting Otomatis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Pembelian</h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Debit:</span> Persediaan
                        Barang Dagang
                      </p>
                      <p>
                        <span className="font-medium">Credit:</span> Kas/Bank
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Penjualan</h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Debit:</span> Kas/Bank
                      </p>
                      <p>
                        <span className="font-medium">Credit:</span> Pendapatan
                        Penjualan
                      </p>
                      <div className="border-t border-gray-200 my-2 pt-2">
                        <p>
                          <span className="font-medium">Debit:</span> Harga
                          Pokok Penjualan
                        </p>
                        <p>
                          <span className="font-medium">Credit:</span>{" "}
                          Persediaan Barang Dagang
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Penyesuaian</h3>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Debit/Credit:</span>{" "}
                        Persediaan Barang Dagang
                      </p>
                      <p>
                        <span className="font-medium">Credit/Debit:</span>{" "}
                        Penyesuaian Persediaan
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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

export default InventoryTransactionEntry;
