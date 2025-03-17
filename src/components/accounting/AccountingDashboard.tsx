import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "../dashboard/DashboardHeader";
import RevenueSummary from "../dashboard/RevenueSummary";
import SalesChart from "../dashboard/SalesChart";
import TransactionsTable from "../dashboard/TransactionsTable";
import FilterBar from "../dashboard/FilterBar";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getPendingSalesTransactions,
  syncTransactions,
} from "@/services/integrationService";

interface AccountingDashboardProps {
  userName?: string;
  userAvatar?: string;
}

const AccountingDashboard = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: AccountingDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingTransactions, setPendingTransactions] = useState(0);

  // Check for pending transactions on component mount
  React.useEffect(() => {
    const pendingTxs = getPendingSalesTransactions();
    setPendingTransactions(pendingTxs.length);
  }, []);

  // Handle sync button click
  const handleSync = async () => {
    await syncTransactions();
    const pendingTxs = getPendingSalesTransactions();
    setPendingTransactions(pendingTxs.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Dashboard Akuntansi"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dashboard Akuntansi</h2>
          {pendingTransactions > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-md px-3 py-1 text-sm text-amber-800 flex items-center">
              {pendingTransactions} transaksi menunggu sinkronisasi
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-7 px-2 text-amber-800 hover:text-amber-900 hover:bg-amber-100"
                onClick={handleSync}
              >
                Sinkronkan Sekarang
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Link to="/transaction-entry">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Tambah Transaksi
              </Button>
            </Link>
            <Link to="/financial-reports">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Laporan Keuangan
              </Button>
            </Link>
            <Link to="/integration">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Integrasi
              </Button>
            </Link>
            <Link to="/inventory">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Inventaris
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          onFilterChange={(filters) => {
            console.log("Filters applied:", filters);
          }}
          onSearch={(query) => {
            console.log("Search query:", query);
          }}
          onRefresh={() => {
            console.log("Refreshing data...");
          }}
          autoRefresh={false}
        />

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Ikhtisar</TabsTrigger>
            <TabsTrigger value="profit-loss">Laba Rugi</TabsTrigger>
            <TabsTrigger value="balance">Neraca</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Summary Cards */}
            <RevenueSummary
              totalRevenue={124350.75}
              transactionCount={1243}
              averageValue={100.04}
              growthRate={12.5}
              onCardClick={(cardType) =>
                console.log(`Clicked ${cardType} card`)
              }
            />

            {/* Sales Chart */}
            <SalesChart
              title="Pendapatan vs Pengeluaran"
              subtitle="Perbandingan pendapatan dan pengeluaran bulanan"
              onDrillDown={(month) =>
                console.log(`Drilling down to ${month} data`)
              }
            />

            {/* Transactions Table */}
            <TransactionsTable
              transactions={[
                {
                  id: "TX-1234",
                  date: "2023-05-15",
                  customer: "PT Maju Jaya",
                  type: "flight",
                  amount: 459.99,
                  status: "completed",
                },
                {
                  id: "TX-1235",
                  date: "2023-05-14",
                  customer: "CV Sentosa",
                  type: "hotel",
                  amount: 289.5,
                  status: "completed",
                },
                {
                  id: "TX-1236",
                  date: "2023-05-14",
                  customer: "PT Abadi",
                  type: "flight",
                  amount: 612.75,
                  status: "pending",
                },
              ]}
              onRowClick={(transaction) =>
                console.log(`Viewing details for transaction ${transaction.id}`)
              }
              onExport={() => console.log("Exporting data")}
            />
          </TabsContent>

          <TabsContent value="profit-loss" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Laporan Laba Rugi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Pendapatan</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Penjualan</span>
                          <span>Rp 1,250,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pendapatan Lain</span>
                          <span>Rp 75,000,000</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total Pendapatan</span>
                          <span>Rp 1,325,000,000</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Pengeluaran
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Biaya Operasional</span>
                          <span>Rp 450,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Gaji Karyawan</span>
                          <span>Rp 350,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Biaya Pemasaran</span>
                          <span>Rp 125,000,000</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total Pengeluaran</span>
                          <span>Rp 925,000,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Laba Bersih</span>
                      <span className="text-green-600">Rp 400,000,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Neraca Keuangan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Aset</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Kas & Setara Kas</span>
                          <span>Rp 750,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Piutang Usaha</span>
                          <span>Rp 350,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Persediaan</span>
                          <span>Rp 200,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aset Tetap</span>
                          <span>Rp 1,200,000,000</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total Aset</span>
                          <span>Rp 2,500,000,000</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Liabilitas & Ekuitas
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Hutang Usaha</span>
                          <span>Rp 300,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Hutang Bank</span>
                          <span>Rp 500,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Modal Disetor</span>
                          <span>Rp 1,300,000,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Laba Ditahan</span>
                          <span>Rp 400,000,000</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total Liabilitas & Ekuitas</span>
                          <span>Rp 2,500,000,000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
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

export default AccountingDashboard;
