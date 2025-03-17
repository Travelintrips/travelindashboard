import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, AlertTriangle } from "lucide-react";
import { SalesTransaction, SyncResult } from "@/types/integration";
import {
  getPendingSalesTransactions,
  syncTransactions,
} from "@/services/integrationService";

interface SyncTransactionsProps {
  onSyncComplete?: (result: SyncResult) => void;
}

const SyncTransactions = ({ onSyncComplete }: SyncTransactionsProps) => {
  const [pendingTransactions, setPendingTransactions] = useState<
    SalesTransaction[]
  >([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null);

  useEffect(() => {
    // Load pending transactions
    loadPendingTransactions();
  }, []);

  const loadPendingTransactions = () => {
    const transactions = getPendingSalesTransactions();
    setPendingTransactions(transactions);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncResult(null);

    try {
      // Perform sync
      const result = await syncTransactions();
      setSyncResult(result);

      // Refresh pending transactions
      loadPendingTransactions();

      // Notify parent component
      if (onSyncComplete) {
        onSyncComplete(result);
      }
    } catch (error) {
      setSyncResult({
        success: false,
        syncedCount: 0,
        failedCount: 1,
        errors: [`Sync failed: ${error}`],
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Sinkronisasi Transaksi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">
                Transaksi Menunggu Sinkronisasi
              </h3>
              <p className="text-sm text-gray-500">
                {pendingTransactions.length} transaksi perlu disinkronkan ke
                sistem akuntansi
              </p>
            </div>
            <Button
              onClick={handleSync}
              disabled={isSyncing || pendingTransactions.length === 0}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {isSyncing ? "Menyinkronkan..." : "Sinkronkan Sekarang"}
            </Button>
          </div>

          {syncResult && (
            <div
              className={`p-4 rounded-md ${syncResult.success ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}
            >
              <div className="flex items-center gap-2">
                {syncResult.success ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                )}
                <span
                  className={`font-medium ${syncResult.success ? "text-green-800" : "text-amber-800"}`}
                >
                  {syncResult.success
                    ? "Sinkronisasi Berhasil"
                    : "Sinkronisasi Sebagian Gagal"}
                </span>
              </div>
              <div className="mt-2 text-sm">
                <p>{syncResult.syncedCount} transaksi berhasil disinkronkan</p>
                {syncResult.failedCount > 0 && (
                  <p>{syncResult.failedCount} transaksi gagal disinkronkan</p>
                )}
              </div>
              {syncResult.errors && syncResult.errors.length > 0 && (
                <div className="mt-2 text-sm text-amber-800">
                  <p className="font-medium">Error:</p>
                  <ul className="list-disc pl-5">
                    {syncResult.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {pendingTransactions.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Transaksi
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pelanggan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produk
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jumlah
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.transactionType === "flight"
                          ? "Tiket Pesawat"
                          : "Hotel"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(transaction.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border rounded-md">
              Tidak ada transaksi yang menunggu sinkronisasi
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SyncTransactions;
