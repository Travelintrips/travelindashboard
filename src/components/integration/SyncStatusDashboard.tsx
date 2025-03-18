import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getIntegrationStatus } from "@/services/integrationService";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function SyncStatusDashboard() {
  const [status, setStatus] = useState({
    pendingTransactions: 0,
    lastSyncTime: null as string | null,
    syncErrors: 0,
    isLoading: true,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getIntegrationStatus();
        setStatus({
          ...data,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error fetching integration status:", error);
        setStatus((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  const formatLastSyncTime = (timestamp: string | null) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Transactions
          </CardTitle>
          <CardDescription>Transactions waiting to be synced</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">
                {status.pendingTransactions}
              </span>
            </div>
            <Progress
              value={status.pendingTransactions > 0 ? 100 : 0}
              className="w-1/2"
              indicatorColor={
                status.pendingTransactions > 10
                  ? "bg-amber-500"
                  : "bg-green-500"
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
          <CardDescription>
            Most recent successful synchronization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="text-lg">
              {formatLastSyncTime(status.lastSyncTime)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sync Errors</CardTitle>
          <CardDescription>Errors in the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle
                className={`h-5 w-5 ${status.syncErrors > 0 ? "text-red-500" : "text-green-500"} mr-2`}
              />
              <span className="text-2xl font-bold">{status.syncErrors}</span>
            </div>
            {status.syncErrors > 0 && (
              <span className="text-sm text-red-500">Attention required</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
