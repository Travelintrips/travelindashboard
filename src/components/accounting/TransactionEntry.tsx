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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface TransactionEntryProps {
  userName?: string;
  userAvatar?: string;
}

interface Transaction {
  transactionId: string;
  date: Date;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  reference: string;
}

const generateTransactionId = () => {
  const prefix = "TRX";
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${randomNum}-${timestamp}`;
};

const TransactionEntry = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: TransactionEntryProps) => {
  const [activeTab, setActiveTab] = useState("entry");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Transaction form state
  const [transaction, setTransaction] = useState<Transaction>({
    transactionId: generateTransactionId(),
    date: new Date(),
    description: "",
    debitAccount: "",
    creditAccount: "",
    amount: 0,
    reference: "",
  });

  // Sample accounts for dropdown
  const accounts = [
    { code: "1-1000", name: "Kas" },
    { code: "1-1100", name: "Bank BCA" },
    { code: "1-1200", name: "Piutang Usaha" },
    { code: "1-2000", name: "Peralatan" },
    { code: "2-1000", name: "Hutang Usaha" },
    { code: "2-2000", name: "Hutang Bank" },
    { code: "3-1000", name: "Modal" },
    { code: "3-2000", name: "Laba Ditahan" },
    { code: "4-1000", name: "Pendapatan Jasa" },
    { code: "5-1000", name: "Beban Gaji" },
    { code: "5-2000", name: "Beban Sewa" },
    { code: "5-3000", name: "Beban Utilitas" },
  ];

  // Sample recent transactions
  const recentTransactions = [
    {
      id: "TRX-1234-567890",
      date: "2023-05-15",
      description: "Pembayaran Gaji Karyawan",
      debitAccount: "Beban Gaji",
      creditAccount: "Bank BCA",
      amount: 15000000,
    },
    {
      id: "TRX-5678-123456",
      date: "2023-05-14",
      description: "Pendapatan Jasa Konsultasi",
      debitAccount: "Bank BCA",
      creditAccount: "Pendapatan Jasa",
      amount: 25000000,
    },
    {
      id: "TRX-9012-345678",
      date: "2023-05-13",
      description: "Pembayaran Sewa Kantor",
      debitAccount: "Beban Sewa",
      creditAccount: "Kas",
      amount: 5000000,
    },
  ];

  const handleFormChange = (field: keyof Transaction, value: any) => {
    setTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transaction submitted:", transaction);

    // Here we would save the transaction to the database
    // In a real application, this would be connected to the same database
    // that the integration service uses

    // Reset form
    setTransaction({
      ...transaction,
      transactionId: generateTransactionId(),
      description: "",
      debitAccount: "",
      creditAccount: "",
      amount: 0,
      reference: "",
    });

    // Show success message
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Entri Transaksi"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Entri Transaksi</h2>
          <div className="flex gap-2">
            <Link to="/financial-reports">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Laporan Keuangan
              </Button>
            </Link>
            <Link to="/general-ledger">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Buku Besar
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="w-full bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Catat Transaksi Baru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="entry"
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value)}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                      value="entry"
                      className="flex items-center gap-2"
                    >
                      Entri Transaksi
                    </TabsTrigger>
                    <TabsTrigger
                      value="journal"
                      className="flex items-center gap-2"
                    >
                      Jurnal Umum
                    </TabsTrigger>
                  </TabsList>

                  {/* Transaction Entry Form */}
                  <TabsContent value="entry">
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
                                onSelect={(date) =>
                                  handleFormChange("date", date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="description">Deskripsi</Label>
                          <Input
                            id="description"
                            value={transaction.description}
                            onChange={(e) =>
                              handleFormChange("description", e.target.value)
                            }
                            placeholder="Masukkan deskripsi transaksi"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="debit-account">Akun Debit</Label>
                          <Select
                            value={transaction.debitAccount}
                            onValueChange={(value) =>
                              handleFormChange("debitAccount", value)
                            }
                          >
                            <SelectTrigger id="debit-account">
                              <SelectValue placeholder="Pilih akun debit" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((account) => (
                                <SelectItem
                                  key={account.code}
                                  value={account.code}
                                >
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="credit-account">Akun Kredit</Label>
                          <Select
                            value={transaction.creditAccount}
                            onValueChange={(value) =>
                              handleFormChange("creditAccount", value)
                            }
                          >
                            <SelectTrigger id="credit-account">
                              <SelectValue placeholder="Pilih akun kredit" />
                            </SelectTrigger>
                            <SelectContent>
                              {accounts.map((account) => (
                                <SelectItem
                                  key={account.code}
                                  value={account.code}
                                >
                                  {account.code} - {account.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="amount">Jumlah</Label>
                          <Input
                            id="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={transaction.amount || ""}
                            onChange={(e) =>
                              handleFormChange(
                                "amount",
                                parseFloat(e.target.value),
                              )
                            }
                            placeholder="Masukkan jumlah"
                            required
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
                      </div>

                      <Button type="submit" className="w-full mt-6">
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Transaksi
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Journal Entry View */}
                  <TabsContent value="journal">
                    <div className="border rounded-md p-4">
                      <h3 className="text-lg font-semibold mb-4">
                        Jurnal Umum
                      </h3>
                      <div className="space-y-4">
                        {transaction.debitAccount &&
                        transaction.creditAccount &&
                        transaction.amount > 0 ? (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center border-b pb-2">
                              <span className="font-medium">
                                Tanggal: {format(transaction.date, "PPP")}
                              </span>
                              <span className="text-sm text-gray-500">
                                ID: {transaction.transactionId}
                              </span>
                            </div>
                            <div className="pl-4">
                              <div className="flex justify-between items-center">
                                <span>
                                  {accounts.find(
                                    (a) => a.code === transaction.debitAccount,
                                  )?.name || transaction.debitAccount}
                                </span>
                                <span>
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                              <div className="flex justify-between items-center pl-8">
                                <span className="italic">
                                  {accounts.find(
                                    (a) => a.code === transaction.creditAccount,
                                  )?.name || transaction.creditAccount}
                                </span>
                                <span>
                                  {formatCurrency(transaction.amount)}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 mt-2">
                              {transaction.description ||
                                "(Tidak ada deskripsi)"}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            Isi formulir entri transaksi untuk melihat pratinjau
                            jurnal
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {formSubmitted && (
                  <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
                    Transaksi berhasil disimpan!
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
                        <span className="font-medium">{tx.description}</span>
                        <span className="text-sm text-gray-500">{tx.date}</span>
                      </div>
                      <div className="mt-1 text-sm">
                        <div className="flex justify-between">
                          <span>Debit: {tx.debitAccount}</span>
                          <span>Kredit: {tx.creditAccount}</span>
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

export default TransactionEntry;
