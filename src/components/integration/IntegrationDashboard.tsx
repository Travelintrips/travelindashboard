import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "../dashboard/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, BarChart3, Settings, RefreshCw } from "lucide-react";
import IntegrationSettings from "./IntegrationSettings";
import SyncTransactions from "./SyncTransactions";
import { SyncResult } from "@/types/integration";
import { syncTransactions } from "@/services/integrationService";

interface IntegrationDashboardProps {
  userName?: string;
  userAvatar?: string;
}

const IntegrationDashboard = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: IntegrationDashboardProps) => {
  const [activeTab, setActiveTab] = useState("sync");
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [syncFrequency, setSyncFrequency] = useState("manual");
  const [syncInterval, setSyncInterval] = useState<number | null>(null);

  const handleSyncComplete = (result: SyncResult) => {
    setLastSyncResult(result);
    console.log("Sync completed:", result);

    // Refresh the page to show updated data
    loadPendingTransactions();
  };

  const handleSyncSettingsChange = (frequency: string) => {
    setSyncFrequency(frequency);

    // Clear existing interval if any
    if (syncInterval) {
      window.clearInterval(syncInterval);
      setSyncInterval(null);
    }

    // Set up new interval based on frequency
    if (frequency === "hourly") {
      // For demo purposes, we'll use a shorter interval (1 minute instead of 1 hour)
      const interval = window.setInterval(() => {
        syncTransactions().then(handleSyncComplete);
      }, 60 * 1000); // 1 minute
      setSyncInterval(interval);
    } else if (frequency === "daily") {
      // For demo purposes, we'll use a shorter interval (5 minutes instead of 24 hours)
      const interval = window.setInterval(
        () => {
          syncTransactions().then(handleSyncComplete);
        },
        5 * 60 * 1000,
      ); // 5 minutes
      setSyncInterval(interval);
    }

    // Note: "realtime" sync is handled in the SalesTransactionEntry component
    // and "manual" means no automatic sync
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (syncInterval) {
        window.clearInterval(syncInterval);
      }
    };
  }, [syncInterval]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Integrasi Sistem"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Integrasi Penjualan & Akuntansi
          </h2>
          <div className="flex gap-2">
            <Link to="/sales-dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard Penjualan
              </Button>
            </Link>
            <Link to="/accounting">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Dashboard Akuntansi
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                Status Integrasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-md p-4">
                  <div className="text-sm text-gray-500">Status Koneksi</div>
                  <div className="text-lg font-medium flex items-center mt-1">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                    Terhubung
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-gray-500">
                    Sinkronisasi Terakhir
                  </div>
                  <div className="text-lg font-medium mt-1">
                    {lastSyncResult
                      ? new Date().toLocaleString("id-ID")
                      : "Belum Pernah"}
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <div className="text-sm text-gray-500">
                    Status Sinkronisasi
                  </div>
                  <div className="text-lg font-medium flex items-center mt-1">
                    {lastSyncResult ? (
                      lastSyncResult.success ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          Sukses ({lastSyncResult.syncedCount} transaksi)
                        </>
                      ) : (
                        <>
                          <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                          Sebagian Gagal ({lastSyncResult.syncedCount}/
                          {lastSyncResult.syncedCount +
                            lastSyncResult.failedCount}
                          )
                        </>
                      )
                    ) : (
                      <>
                        <span className="h-2 w-2 rounded-full bg-gray-300 mr-2"></span>
                        Belum Disinkronkan
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="sync" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Sinkronisasi Transaksi
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Pengaturan Integrasi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sync">
              <SyncTransactions onSyncComplete={handleSyncComplete} />
            </TabsContent>

            <TabsContent value="settings">
              <IntegrationSettings
                onSyncSettingsChange={handleSyncSettingsChange}
              />
            </TabsContent>
          </Tabs>
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

export default IntegrationDashboard;
