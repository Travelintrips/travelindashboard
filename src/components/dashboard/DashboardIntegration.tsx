import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, RefreshCw, Check, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { SyncResult } from "@/types/integration";
import { syncTransactions } from "@/services/integrationService";

interface DashboardIntegrationProps {
  onSyncComplete?: (result: SyncResult) => void;
}

const DashboardIntegration = ({
  onSyncComplete,
}: DashboardIntegrationProps) => {
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncTransactions();
      setLastSyncResult(result);
      if (onSyncComplete) {
        onSyncComplete(result);
      }
    } catch (error) {
      console.error("Sync failed:", error);
      setLastSyncResult({
        success: false,
        syncedCount: 0,
        failedCount: 1,
        errors: [`Sync failed: ${error}`],
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Integrasi Sistem</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-medium">Status Integrasi</h3>
              <p className="text-sm text-gray-500">
                {lastSyncResult ? (
                  lastSyncResult.success ? (
                    <span className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      Terhubung
                    </span>
                  ) : (
                    <span className="flex items-center text-amber-600">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Terhubung Sebagian
                    </span>
                  )
                ) : (
                  "Belum Terhubung"
                )}
              </p>
            </div>
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2"
              size="sm"
            >
              <RefreshCw className="h-4 w-4" />
              {isSyncing ? "Menyinkronkan..." : "Sinkronkan"}
            </Button>
          </div>

          {lastSyncResult && (
            <div
              className={`p-3 rounded-md text-sm ${lastSyncResult.success ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}
            >
              <div className="flex items-center gap-2">
                {lastSyncResult.success ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                )}
                <span>
                  {lastSyncResult.syncedCount} transaksi berhasil disinkronkan
                  {lastSyncResult.failedCount > 0 &&
                    `, ${lastSyncResult.failedCount} gagal`}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link to="/integration" className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                size="sm"
              >
                Kelola Integrasi
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardIntegration;
