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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardHeader from "../dashboard/DashboardHeader";
import FilterBar from "../dashboard/FilterBar";
import { Search, Download, Filter, ArrowUpDown } from "lucide-react";

interface Account {
  code: string;
  name: string;
  category: string;
  balance: number;
  debit: number;
  credit: number;
}

interface GeneralLedgerProps {
  userName?: string;
  userAvatar?: string;
}

const GeneralLedger = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: GeneralLedgerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Accounts data from database
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch accounts and their transaction totals
  useEffect(() => {
    const fetchAccountsWithTotals = async () => {
      try {
        // First get all accounts
        const { data: accountsData, error: accountsError } = await supabase
          .from("accounts")
          .select("*")
          .order("code");

        if (accountsError) throw accountsError;

        // Then get transaction totals for each account
        const { data: totalsData, error: totalsError } = await supabase
          .from("transaction_entries")
          .select(
            "account_id, account_code, sum(debit) as total_debit, sum(credit) as total_credit",
          )
          .group("account_id, account_code");

        if (totalsError) throw totalsError;

        // Combine the data
        const combinedData = accountsData.map((account) => {
          const totals = totalsData.find(
            (t) => t.account_code === account.code,
          ) || { total_debit: 0, total_credit: 0 };

          return {
            code: account.code,
            name: account.name,
            category: account.category,
            balance: account.balance,
            debit: parseFloat(totals.total_debit) || 0,
            credit: parseFloat(totals.total_credit) || 0,
          };
        });

        setAccounts(combinedData);
      } catch (error) {
        console.error("Error fetching accounts with totals:", error);
        // Fallback to sample data
        setAccounts([
          {
            code: "1-1000",
            name: "Kas",
            category: "Aset",
            balance: 5000000,
            debit: 7500000,
            credit: 2500000,
          },
          {
            code: "1-1100",
            name: "Bank BCA",
            category: "Aset",
            balance: 15000000,
            debit: 20000000,
            credit: 5000000,
          },
          // Add more sample accounts as needed
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountsWithTotals();

    // Subscribe to changes
    const subscription = supabase
      .channel("ledger-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transaction_entries" },
        (payload) => {
          fetchAccountsWithTotals();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedCategory]);

  // Filter accounts based on search term and category
  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || account.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate totals
  const totals = filteredAccounts.reduce(
    (acc, account) => {
      return {
        balance: acc.balance + account.balance,
        debit: acc.debit + account.debit,
        credit: acc.credit + account.credit,
      };
    },
    { balance: 0, debit: 0, credit: 0 },
  );

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
        title="Buku Besar"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Buku Besar</h2>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Ekspor Data
          </Button>
        </div>

        {/* Filter Bar */}
        <FilterBar
          onFilterChange={(filters) => {
            console.log("Filters applied:", filters);
          }}
          onSearch={(query) => {
            setSearchTerm(query);
          }}
          onRefresh={() => {
            console.log("Refreshing data...");
          }}
          autoRefresh={false}
        />

        {/* Category Filter */}
        <div className="flex items-center gap-4 mb-6 mt-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filter Kategori:</span>
          </div>
          <Select
            value={selectedCategory || ""}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Aset">Aset</SelectItem>
              <SelectItem value="Kewajiban">Kewajiban</SelectItem>
              <SelectItem value="Ekuitas">Ekuitas</SelectItem>
              <SelectItem value="Pendapatan">Pendapatan</SelectItem>
              <SelectItem value="Beban">Beban</SelectItem>
            </SelectContent>
          </Select>
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
                      Debit
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      Kredit
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">
                    <div className="flex items-center justify-end">
                      Saldo
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
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
                      {formatCurrency(account.debit)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(account.credit)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(account.balance)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50 font-bold">
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.debit)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.credit)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(totals.balance)}
                  </TableCell>
                </TableRow>
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

export default GeneralLedger;
