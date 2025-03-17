import React, { useState, useEffect } from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import FilterBar from "./dashboard/FilterBar";
import RevenueSummary from "./dashboard/RevenueSummary";
import SalesChart from "./dashboard/SalesChart";
import TransactionsTable from "./dashboard/TransactionsTable";
import ExportOptions from "./dashboard/ExportOptions";
import DataEntryForm from "./dashboard/DataEntryForm";
import DetailModal from "./dashboard/DetailModal";
import DashboardIntegration from "./dashboard/DashboardIntegration";
import { Button } from "./ui/button";
import {
  PlusCircle,
  UserCog,
  Settings,
  Calculator,
  FileText,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getPendingSalesTransactions } from "@/services/integrationService";
import { SyncResult } from "@/types/integration";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
}

const Home = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: HomeProps) => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalType, setDetailModalType] = useState<
    "revenue" | "transactions" | "average" | "customers" | "transaction"
  >("revenue");
  const [detailModalData, setDetailModalData] = useState<any>(null);
  const [pendingTransactions, setPendingTransactions] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [transactions, setTransactions] = useState<any[]>([
    {
      id: "TX-1234",
      date: "2023-05-15",
      customer: "John Smith",
      type: "flight",
      amount: 459.99,
      status: "completed",
    },
    {
      id: "TX-1235",
      date: "2023-05-14",
      customer: "Sarah Johnson",
      type: "hotel",
      amount: 289.5,
      status: "completed",
    },
    {
      id: "TX-1236",
      date: "2023-05-14",
      customer: "Michael Brown",
      type: "flight",
      amount: 612.75,
      status: "pending",
    },
    {
      id: "TX-1237",
      date: "2023-05-13",
      customer: "Emily Davis",
      type: "hotel",
      amount: 345.0,
      status: "completed",
    },
    {
      id: "TX-1238",
      date: "2023-05-12",
      customer: "Robert Wilson",
      type: "flight",
      amount: 528.25,
      status: "failed",
    },
  ]);

  // Handle drill down from chart to detailed transactions
  const handleDrillDown = (month: string) => {
    setSelectedMonth(month);
    // In a real app, this would filter transactions to the selected month
    console.log(`Drilling down to ${month} data`);
  };

  // Handle export functionality
  const handleExport = (format: string) => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      console.log(`Exporting data in ${format} format`);
      setIsExporting(false);
    }, 1500);
  };

  // Handle transaction row click
  const handleTransactionClick = (transaction: any) => {
    console.log("Transaction clicked:", transaction);
    setDetailModalType("transaction");
    setDetailModalData(transaction);
    setDetailModalOpen(true);
  };

  // Handle new transaction submission
  const handleNewTransaction = (data: any) => {
    console.log("New transaction submitted:", data);

    // Convert the form data to match the transactions table format
    const newTransaction = {
      id: data.transactionId,
      date: data.bookingDate.toISOString().split("T")[0],
      customer: data.type === "flight" ? data.passengerName : data.guestName,
      type: data.type,
      amount: data.amount,
      status: data.paymentStatus.toLowerCase(),
    };

    // Add to transactions list
    setTransactions([newTransaction, ...transactions]);

    // Update pending transactions count
    refreshPendingTransactions();
  };

  // Refresh pending transactions count
  const refreshPendingTransactions = () => {
    const pendingTxs = getPendingSalesTransactions();
    setPendingTransactions(pendingTxs.length);
  };

  // Handle sync completion
  const handleSyncComplete = (result: SyncResult) => {
    setLastSyncTime(new Date());
    refreshPendingTransactions();
  };

  // Load pending transactions on component mount
  useEffect(() => {
    refreshPendingTransactions();
  }, []);

  // Handle card click in RevenueSummary
  const handleCardClick = (cardType: string) => {
    console.log(`Viewing detailed ${cardType} information`);
    setDetailModalType(cardType as any);

    if (cardType === "inventory") {
      // Navigate to inventory dashboard
      window.location.href = "/inventory-dashboard";
      return;
    }

    if (cardType === "categories") {
      // Navigate to product management page with categories tab active
      window.location.href = "/products";
      return;
    }

    setDetailModalData({
      totalRevenue: 124350.75,
      transactionCount: 1243,
      averageValue: 100.04,
    });
    setDetailModalOpen(true);
  };

  // Handle link click with prevention of default behavior
  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    // For development/demo purposes, prevent navigation if path doesn't exist
    if (!path || path === "#") {
      e.preventDefault();
      console.log(`Navigation to ${path} prevented - route not implemented`);
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Dashboard Penjualan"
        userName={userName}
        userAvatar={userAvatar}
      />
      {/* Main Content */}
      <main className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard Penjualan</h2>
          <div className="flex gap-2">
            <Link
              to="/transaction-entry"
              onClick={(e) => handleLinkClick(e, "/transaction-entry")}
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Sistem Akuntansi
              </Button>
            </Link>
            <Link
              to="/integration"
              onClick={(e) => handleLinkClick(e, "/integration")}
            >
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Integrasi
              </Button>
            </Link>
            <Link
              to="/inventory-dashboard"
              onClick={(e) => handleLinkClick(e, "/inventory-dashboard")}
            >
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Inventaris
              </Button>
            </Link>
            <Link
              to="/user-management"
              onClick={(e) => handleLinkClick(e, "/user-management")}
            >
              <Button variant="outline" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" />
                Kelola Pengguna
              </Button>
            </Link>
            <Link
              to="/role-management"
              onClick={(e) => handleLinkClick(e, "/role-management")}
            >
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Kelola Peran
              </Button>
            </Link>
            <Link
              to="/data-entry"
              onClick={(e) => handleLinkClick(e, "/data-entry")}
            >
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Tambah Transaksi
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          onFilterChange={(filters) => {
            console.log("Filters applied:", filters);
            // In a real app, this would filter the data
            alert(
              `Filter diterapkan: ${filters.transactionType || "semua"} transaksi${filters.dateRange ? " dengan rentang tanggal tertentu" : ""}`,
            );
          }}
          onSearch={(query) => {
            console.log("Search query:", query);
            // In a real app, this would search the data
            if (query) alert(`Mencari: "${query}"`);
          }}
          onRefresh={() => {
            console.log("Refreshing data...");
            // In a real app, this would refresh the data
            alert("Data diperbarui");
          }}
          autoRefresh={true}
        />

        {/* Revenue Summary Cards */}
        <div className="mt-6">
          <RevenueSummary
            totalRevenue={124350.75}
            transactionCount={1243}
            averageValue={100.04}
            growthRate={12.5}
            onCardClick={handleCardClick}
          />
        </div>

        {/* Selected Month Indicator (shows when a month is selected from chart) */}
        {selectedMonth && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h2 className="text-lg font-medium text-blue-800">
              Melihat data untuk {selectedMonth}
              <button
                className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setSelectedMonth(null)}
                type="button"
              >
                Hapus Pilihan
              </button>
            </h2>
          </div>
        )}

        {/* Sales Chart */}
        <div className="mt-6">
          <SalesChart
            title={
              selectedMonth
                ? `Rincian Penjualan ${selectedMonth}`
                : "Ikhtisar Penjualan Bulanan"
            }
            subtitle="Perbandingan pendapatan pemesanan penerbangan dan hotel"
            onDrillDown={handleDrillDown}
          />
        </div>

        {/* Export Options and Data Entry Link */}
        <div>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col top-48 left-48 container">
                <h2 className="text-xl font-bold mb-4">Akses Cepat</h2>
                <p className="mb-4">
                  Gunakan tautan di bawah ini untuk mengakses fitur utama
                  sistem.
                </p>
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/data-entry"
                    onClick={(e) => handleLinkClick(e, "/data-entry")}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-fit"
                  >
                    Buka Formulir Entri Data
                  </Link>
                  <Link
                    to="/transaction-entry"
                    onClick={(e) => handleLinkClick(e, "/transaction-entry")}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors w-fit"
                  >
                    Akses Sistem Akuntansi
                  </Link>
                  <Link
                    to="/integration"
                    onClick={(e) => handleLinkClick(e, "/integration")}
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors w-fit"
                  >
                    Integrasi Penjualan & Akuntansi
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-4">
              <ExportOptions onExport={handleExport} disabled={isExporting} />
              <DashboardIntegration onSyncComplete={handleSyncComplete} />
              {pendingTransactions > 0 && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-amber-800">
                      {pendingTransactions} transaksi belum disinkronkan
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1 h-7"
                      onClick={refreshPendingTransactions}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Refresh
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="mt-6">
          <TransactionsTable
            transactions={transactions}
            onRowClick={handleTransactionClick}
            onExport={() => handleExport("csv")}
          />
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Sistem Pemesanan Perjalanan.
              Seluruh hak cipta dilindungi.
            </p>
            <p className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        type={detailModalType}
        data={detailModalData}
      />
    </div>
  );
};

export default Home;
