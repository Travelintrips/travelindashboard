import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardHeader from "../dashboard/DashboardHeader";
import {
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown,
} from "lucide-react";

interface Account {
  code: string;
  name: string;
  category: string;
  balance: number;
  isActive: boolean;
}

interface ChartOfAccountsProps {
  userName?: string;
  userAvatar?: string;
}

const ChartOfAccounts = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: ChartOfAccountsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // New account form state
  const [newAccount, setNewAccount] = useState<Account>({
    code: "",
    name: "",
    category: "",
    balance: 0,
    isActive: true,
  });

  // Sample accounts data
  const [accounts, setAccounts] = useState<Account[]>([
    {
      code: "1-1000",
      name: "Kas",
      category: "Aset",
      balance: 5000000,
      isActive: true,
    },
    {
      code: "1-1100",
      name: "Bank BCA",
      category: "Aset",
      balance: 15000000,
      isActive: true,
    },
    {
      code: "1-1200",
      name: "Piutang Usaha",
      category: "Aset",
      balance: 7500000,
      isActive: true,
    },
    {
      code: "1-2000",
      name: "Peralatan",
      category: "Aset",
      balance: 10000000,
      isActive: true,
    },
    {
      code: "2-1000",
      name: "Hutang Usaha",
      category: "Kewajiban",
      balance: 3000000,
      isActive: true,
    },
    {
      code: "2-2000",
      name: "Hutang Bank",
      category: "Kewajiban",
      balance: 20000000,
      isActive: true,
    },
    {
      code: "3-1000",
      name: "Modal",
      category: "Ekuitas",
      balance: 10000000,
      isActive: true,
    },
    {
      code: "3-2000",
      name: "Laba Ditahan",
      category: "Ekuitas",
      balance: 4500000,
      isActive: true,
    },
    {
      code: "4-1000",
      name: "Pendapatan Jasa",
      category: "Pendapatan",
      balance: 15000000,
      isActive: true,
    },
    {
      code: "5-1000",
      name: "Beban Gaji",
      category: "Beban",
      balance: 7500000,
      isActive: true,
    },
    {
      code: "5-2000",
      name: "Beban Sewa",
      category: "Beban",
      balance: 3500000,
      isActive: true,
    },
    {
      code: "5-3000",
      name: "Beban Utilitas",
      category: "Beban",
      balance: 1500000,
      isActive: true,
    },
  ]);

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter((account) => {
    return (
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Handle add new account
  const handleAddAccount = () => {
    setAccounts([...accounts, newAccount]);
    setNewAccount({
      code: "",
      name: "",
      category: "",
      balance: 0,
      isActive: true,
    });
    setIsAddDialogOpen(false);
  };

  // Handle edit account
  const handleEditAccount = () => {
    if (selectedAccount) {
      setAccounts(
        accounts.map((account) =>
          account.code === selectedAccount.code ? selectedAccount : account,
        ),
      );
      setSelectedAccount(null);
      setIsEditDialogOpen(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = (code: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      setAccounts(accounts.filter((account) => account.code !== code));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Bagan Akun"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Bagan Akun</h2>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Ekspor Data
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Akun
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Akun Baru</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="code" className="text-right">
                      Kode Akun
                    </Label>
                    <Input
                      id="code"
                      value={newAccount.code}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, code: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Contoh: 1-1000"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nama Akun
                    </Label>
                    <Input
                      id="name"
                      value={newAccount.name}
                      onChange={(e) =>
                        setNewAccount({ ...newAccount, name: e.target.value })
                      }
                      className="col-span-3"
                      placeholder="Contoh: Kas"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Kategori
                    </Label>
                    <Select
                      value={newAccount.category}
                      onValueChange={(value) =>
                        setNewAccount({ ...newAccount, category: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aset">Aset</SelectItem>
                        <SelectItem value="Kewajiban">Kewajiban</SelectItem>
                        <SelectItem value="Ekuitas">Ekuitas</SelectItem>
                        <SelectItem value="Pendapatan">Pendapatan</SelectItem>
                        <SelectItem value="Beban">Beban</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="balance" className="text-right">
                      Saldo Awal
                    </Label>
                    <Input
                      id="balance"
                      type="number"
                      value={newAccount.balance}
                      onChange={(e) =>
                        setNewAccount({
                          ...newAccount,
                          balance: parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                      placeholder="0"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={handleAddAccount}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Cari akun..."
            className="pl-10 h-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Accounts Table */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Daftar Akun</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center">
                      Kode Akun
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Nama Akun
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Kategori
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      Saldo
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Tindakan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.code}>
                    <TableCell className="font-medium">
                      {account.code}
                    </TableCell>
                    <TableCell>{account.name}</TableCell>
                    <TableCell>{account.category}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(account.balance)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog
                          open={
                            isEditDialogOpen &&
                            selectedAccount?.code === account.code
                          }
                          onOpenChange={(open) => {
                            setIsEditDialogOpen(open);
                            if (!open) setSelectedAccount(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedAccount(account)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Akun</DialogTitle>
                            </DialogHeader>
                            {selectedAccount && (
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-code"
                                    className="text-right"
                                  >
                                    Kode Akun
                                  </Label>
                                  <Input
                                    id="edit-code"
                                    value={selectedAccount.code}
                                    onChange={(e) =>
                                      setSelectedAccount({
                                        ...selectedAccount,
                                        code: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                    disabled
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-name"
                                    className="text-right"
                                  >
                                    Nama Akun
                                  </Label>
                                  <Input
                                    id="edit-name"
                                    value={selectedAccount.name}
                                    onChange={(e) =>
                                      setSelectedAccount({
                                        ...selectedAccount,
                                        name: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-category"
                                    className="text-right"
                                  >
                                    Kategori
                                  </Label>
                                  <Select
                                    value={selectedAccount.category}
                                    onValueChange={(value) =>
                                      setSelectedAccount({
                                        ...selectedAccount,
                                        category: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Aset">Aset</SelectItem>
                                      <SelectItem value="Kewajiban">
                                        Kewajiban
                                      </SelectItem>
                                      <SelectItem value="Ekuitas">
                                        Ekuitas
                                      </SelectItem>
                                      <SelectItem value="Pendapatan">
                                        Pendapatan
                                      </SelectItem>
                                      <SelectItem value="Beban">
                                        Beban
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-balance"
                                    className="text-right"
                                  >
                                    Saldo
                                  </Label>
                                  <Input
                                    id="edit-balance"
                                    type="number"
                                    value={selectedAccount.balance}
                                    onChange={(e) =>
                                      setSelectedAccount({
                                        ...selectedAccount,
                                        balance: parseFloat(e.target.value),
                                      })
                                    }
                                    className="col-span-3"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-status"
                                    className="text-right"
                                  >
                                    Status
                                  </Label>
                                  <Select
                                    value={
                                      selectedAccount.isActive
                                        ? "active"
                                        : "inactive"
                                    }
                                    onValueChange={(value) =>
                                      setSelectedAccount({
                                        ...selectedAccount,
                                        isActive: value === "active",
                                      })
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Pilih status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">
                                        Aktif
                                      </SelectItem>
                                      <SelectItem value="inactive">
                                        Tidak Aktif
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setIsEditDialogOpen(false)}
                              >
                                Batal
                              </Button>
                              <Button onClick={handleEditAccount}>
                                Simpan
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAccount(account.code)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAccounts.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-6 text-gray-500"
                    >
                      Tidak ada akun yang ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
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

export default ChartOfAccounts;
