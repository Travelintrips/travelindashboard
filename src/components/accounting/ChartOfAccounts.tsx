import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
  standardCode?: string;
  accountType?: string;
  parentCode?: string;
  level?: number;
  hasChildren?: boolean;
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
    standardCode: "",
    accountType: "Detail",
    parentCode: "",
  });

  // Accounts data from database
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch accounts from database
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data, error } = await supabase
          .from("accounts")
          .select("*")
          .order("code");

        if (error) throw error;

        // Transform data to match Account interface
        const transformedData = data.map((account) => ({
          code: account.code,
          name: account.name,
          category: account.category,
          balance: account.balance,
          isActive: account.is_active,
          standardCode: account.standard_code,
          accountType: account.account_type,
          parentCode: account.parent_code,
        }));

        // Calculate levels and hasChildren properties
        const accountsWithLevels = transformedData.map((account) => {
          // Calculate level based on code structure (e.g., 1-0000 is level 1, 1-1000 is level 2)
          const level = account.code.split("-")[1]
            ? (account.code.split("-")[1].match(/0/g) || []).length / 2 + 1
            : 1;

          // Check if this account has children
          const hasChildren = transformedData.some(
            (a) => a.parentCode === account.code,
          );

          return {
            ...account,
            level,
            hasChildren,
          };
        });

        setAccounts(accountsWithLevels);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        // Fallback to sample data if fetch fails
        setAccounts([
          {
            code: "1-0000",
            name: "Aset",
            category: "Aset",
            balance: 20000000,
            isActive: true,
            standardCode: "1",
            accountType: "Header",
            level: 1,
            hasChildren: true,
          },
          {
            code: "1-1000",
            name: "Aset Lancar",
            category: "Aset",
            balance: 20000000,
            isActive: true,
            standardCode: "11",
            accountType: "Header",
            parentCode: "1-0000",
            level: 2,
            hasChildren: true,
          },
          {
            code: "1-1100",
            name: "Kas",
            category: "Aset",
            balance: 5000000,
            isActive: true,
            standardCode: "111",
            accountType: "Detail",
            parentCode: "1-1000",
            level: 3,
            hasChildren: false,
          },
          {
            code: "1-1200",
            name: "Bank",
            category: "Aset",
            balance: 15000000,
            isActive: true,
            standardCode: "112",
            accountType: "Header",
            parentCode: "1-1000",
            level: 3,
            hasChildren: true,
          },
          {
            code: "1-1201",
            name: "Bank BCA",
            category: "Aset",
            balance: 10000000,
            isActive: true,
            standardCode: "11201",
            accountType: "Detail",
            parentCode: "1-1200",
            level: 4,
            hasChildren: false,
          },
          {
            code: "1-1202",
            name: "Bank Mandiri",
            category: "Aset",
            balance: 5000000,
            isActive: true,
            standardCode: "11202",
            accountType: "Detail",
            parentCode: "1-1200",
            level: 4,
            hasChildren: false,
          },
          {
            code: "4-0000",
            name: "Pendapatan",
            category: "Pendapatan",
            balance: 25000000,
            isActive: true,
            standardCode: "4",
            accountType: "Header",
            level: 1,
            hasChildren: true,
          },
          {
            code: "4-1100",
            name: "Pendapatan Penjualan",
            category: "Pendapatan",
            balance: 25000000,
            isActive: true,
            standardCode: "411",
            accountType: "Header",
            parentCode: "4-0000",
            level: 3,
            hasChildren: true,
          },
          {
            code: "4-1110",
            name: "Penjualan Tiket Pesawat",
            category: "Pendapatan",
            balance: 15000000,
            isActive: true,
            standardCode: "4111",
            accountType: "Detail",
            parentCode: "4-1100",
            level: 4,
            hasChildren: false,
          },
          {
            code: "4-1120",
            name: "Penjualan Hotel",
            category: "Pendapatan",
            balance: 10000000,
            isActive: true,
            standardCode: "4112",
            accountType: "Detail",
            parentCode: "4-1100",
            level: 4,
            hasChildren: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();

    // Subscribe to changes
    const subscription = supabase
      .channel("accounts-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "accounts" },
        (payload) => {
          fetchAccounts();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filter accounts based on search term
  const filteredAccounts = accounts.filter((account) => {
    return (
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (account.standardCode &&
        account.standardCode.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Sort accounts by code for hierarchical display
  const sortedAccounts = [...filteredAccounts].sort((a, b) =>
    a.code.localeCompare(b.code),
  );

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Handle add new account
  const handleAddAccount = async () => {
    try {
      const { data, error } = await supabase
        .from("accounts")
        .insert([
          {
            code: newAccount.code,
            name: newAccount.name,
            category: newAccount.category,
            balance: newAccount.balance,
            is_active: newAccount.isActive,
            standard_code: newAccount.standardCode,
            account_type: newAccount.accountType,
            parent_code: newAccount.parentCode || null,
          },
        ])
        .select();

      if (error) throw error;

      // Add the new account to the local state
      setAccounts([...accounts, newAccount]);
      setNewAccount({
        code: "",
        name: "",
        category: "",
        balance: 0,
        isActive: true,
        standardCode: "",
        accountType: "Detail",
        parentCode: "",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding account:", error);
      alert("Failed to add account. Please try again.");
    }
  };

  // Handle edit account
  const handleEditAccount = async () => {
    if (selectedAccount) {
      try {
        const { data, error } = await supabase
          .from("accounts")
          .update({
            name: selectedAccount.name,
            category: selectedAccount.category,
            balance: selectedAccount.balance,
            is_active: selectedAccount.isActive,
            standard_code: selectedAccount.standardCode,
            account_type: selectedAccount.accountType,
            parent_code: selectedAccount.parentCode || null,
          })
          .eq("code", selectedAccount.code)
          .select();

        if (error) throw error;

        // Update the account in local state
        setAccounts(
          accounts.map((account) =>
            account.code === selectedAccount.code ? selectedAccount : account,
          ),
        );
        setSelectedAccount(null);
        setIsEditDialogOpen(false);
      } catch (error) {
        console.error("Error updating account:", error);
        alert("Failed to update account. Please try again.");
      }
    }
  };

  // Handle delete account
  const handleDeleteAccount = async (code: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus akun ini?")) {
      try {
        const { error } = await supabase
          .from("accounts")
          .delete()
          .eq("code", code);

        if (error) throw error;

        // Remove the account from local state
        setAccounts(accounts.filter((account) => account.code !== code));
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
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
                    <Label htmlFor="standardCode" className="text-right">
                      Kode Standar
                    </Label>
                    <Input
                      id="standardCode"
                      value={newAccount.standardCode}
                      onChange={(e) =>
                        setNewAccount({
                          ...newAccount,
                          standardCode: e.target.value,
                        })
                      }
                      className="col-span-3"
                      placeholder="Contoh: 111"
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
                    <Label htmlFor="accountType" className="text-right">
                      Tipe Akun
                    </Label>
                    <Select
                      value={newAccount.accountType}
                      onValueChange={(value) =>
                        setNewAccount({ ...newAccount, accountType: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih tipe akun" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Header">Header</SelectItem>
                        <SelectItem value="Detail">Detail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="parentCode" className="text-right">
                      Akun Induk
                    </Label>
                    <Select
                      value={newAccount.parentCode || ""}
                      onValueChange={(value) =>
                        setNewAccount({ ...newAccount, parentCode: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Pilih akun induk (opsional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Tidak Ada</SelectItem>
                        {accounts
                          .filter((a) => a.accountType === "Header")
                          .map((account) => (
                            <SelectItem key={account.code} value={account.code}>
                              {account.code} - {account.name}
                            </SelectItem>
                          ))}
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
                  <TableHead className="w-[100px]">
                    <div className="flex items-center">
                      Kode Standar
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
                  <TableHead>
                    <div className="flex items-center">
                      Tipe
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
                {sortedAccounts.map((account) => (
                  <TableRow
                    key={account.code}
                    className={
                      account.accountType === "Header" ? "bg-gray-50" : ""
                    }
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <span className="ml-[{account.level ? (account.level - 1) * 12 : 0}px]">
                          {account.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{account.standardCode || "-"}</TableCell>
                    <TableCell>
                      <div
                        style={{
                          paddingLeft: account.level
                            ? (account.level - 1) * 16
                            : 0,
                        }}
                      >
                        {account.name}
                      </div>
                    </TableCell>
                    <TableCell>{account.category}</TableCell>
                    <TableCell>
                      <span
                        className={
                          account.accountType === "Header"
                            ? "text-blue-600 font-medium"
                            : ""
                        }
                      >
                        {account.accountType || "Detail"}
                      </span>
                    </TableCell>
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
                                    htmlFor="edit-standard-code"
                                    className="text-right"
                                  >
                                    Kode Standar
                                  </Label>
                                  <Input
                                    id="edit-standard-code"
                                    value={selectedAccount.standardCode || ""}
                                    onChange={(e) =>
                                      setSelectedAccount({
                                        ...selectedAccount,
                                        standardCode: e.target.value,
                                      })
                                    }
                                    className="col-span-3"
                                    placeholder="Contoh: 111"
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
                                    htmlFor="edit-account-type"
                                    className="text-right"
                                  >
                                    Tipe Akun
                                  </Label>
                                  <Select
                                    value={
                                      selectedAccount.accountType || "Detail"
                                    }
                                    onValueChange={(value) =>
                                      setSelectedAccount({
                                        ...selectedAccount,
                                        accountType: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Pilih tipe akun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Header">
                                        Header
                                      </SelectItem>
                                      <SelectItem value="Detail">
                                        Detail
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label
                                    htmlFor="edit-parent-code"
                                    className="text-right"
                                  >
                                    Akun Induk
                                  </Label>
                                  <Select
                                    value={selectedAccount.parentCode || ""}
                                    onValueChange={(value) =>
                                      setSelectedAccount({
                                        ...selectedAccount,
                                        parentCode: value || null,
                                      })
                                    }
                                  >
                                    <SelectTrigger className="col-span-3">
                                      <SelectValue placeholder="Pilih akun induk (opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="">
                                        Tidak Ada
                                      </SelectItem>
                                      {accounts
                                        .filter(
                                          (a) =>
                                            a.accountType === "Header" &&
                                            a.code !== selectedAccount.code,
                                        )
                                        .map((account) => (
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
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ChartOfAccounts;
