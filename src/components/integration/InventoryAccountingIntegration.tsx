import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getPendingInventoryTransactions } from "@/services/inventoryService";
import { syncInventoryTransactionsToAccounting } from "@/services/integrationService";
import { InventoryTransaction } from "@/types/inventory";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

export default function InventoryAccountingIntegration() {
  const [pendingTransactions, setPendingTransactions] = useState<
    InventoryTransaction[]
  >([]);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  useEffect(() => {
    loadPendingTransactions();
  }, []);

  const loadPendingTransactions = async () => {
    try {
      const transactions = getPendingInventoryTransactions();
      setPendingTransactions(transactions);
    } catch (error) {
      console.error("Error loading pending transactions:", error);
      setErrorMessage("Failed to load pending transactions");
      setSyncStatus("error");
    }
  };

  const handleSync = async () => {
    try {
      setSyncStatus("syncing");
      setErrorMessage("");

      const result = await syncInventoryTransactionsToAccounting();

      setLastSyncTime(new Date());
      setSyncStatus("success");
      loadPendingTransactions(); // Refresh the list after sync
    } catch (error) {
      console.error("Sync error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unknown error during synchronization",
      );
      setSyncStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory to Accounting Integration</CardTitle>
              <CardDescription>
                Synchronize inventory transactions with the general ledger
              </CardDescription>
            </div>
            <Badge
              variant={
                syncStatus === "error"
                  ? "destructive"
                  : syncStatus === "success"
                    ? "success"
                    : "outline"
              }
            >
              {syncStatus === "idle" && "Ready to Sync"}
              {syncStatus === "syncing" && "Syncing..."}
              {syncStatus === "success" && "Sync Successful"}
              {syncStatus === "error" && "Sync Failed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending Transactions</TabsTrigger>
              <TabsTrigger value="mapping">Account Mapping</TabsTrigger>
              <TabsTrigger value="logs">Sync Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {pendingTransactions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.transactionId}</TableCell>
                        <TableCell>
                          {new Date(transaction.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.productName}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              transaction.transactionType === "Purchase"
                                ? "outline"
                                : transaction.transactionType === "Sale"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {transaction.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>
                          Rp {transaction.totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex items-center justify-center p-6 text-center">
                  <div>
                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium">
                      All Transactions Synced
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      There are no pending inventory transactions to synchronize
                      with accounting.
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="mapping">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Debit Account</TableHead>
                    <TableHead>Credit Account</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Purchase</TableCell>
                    <TableCell>1101 - Persediaan Barang Dagang</TableCell>
                    <TableCell>1100 - Kas/Bank</TableCell>
                    <TableCell>Pembelian persediaan barang dagang</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sale (Revenue)</TableCell>
                    <TableCell>1100 - Kas/Bank</TableCell>
                    <TableCell>4101 - Pendapatan Penjualan</TableCell>
                    <TableCell>Penjualan barang dagang</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sale (COGS)</TableCell>
                    <TableCell>5101 - Harga Pokok Penjualan</TableCell>
                    <TableCell>1101 - Persediaan Barang Dagang</TableCell>
                    <TableCell>Harga pokok penjualan</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Adjustment</TableCell>
                    <TableCell>1101 - Persediaan Barang Dagang</TableCell>
                    <TableCell>5102 - Penyesuaian Persediaan</TableCell>
                    <TableCell>Penyesuaian persediaan barang dagang</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="logs">
              <div className="space-y-4">
                {lastSyncTime && (
                  <div className="text-sm text-muted-foreground">
                    Last synchronized: {lastSyncTime.toLocaleString()}
                  </div>
                )}

                {/* This would typically show sync logs from a database */}
                <div className="text-sm">
                  Sync logs will appear here after synchronization operations.
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {syncStatus === "error" && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sync Error</AlertTitle>
              <AlertDescription>
                {errorMessage ||
                  "An error occurred during synchronization. Please try again."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={loadPendingTransactions}
            disabled={syncStatus === "syncing"}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            onClick={handleSync}
            disabled={
              pendingTransactions.length === 0 || syncStatus === "syncing"
            }
          >
            {syncStatus === "syncing" ? "Syncing..." : "Sync to Accounting"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
