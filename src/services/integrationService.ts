import {
  Transaction,
  TransactionEntry,
  TransactionStatus,
} from "@/types/accounting";
import {
  AccountMapping,
  SalesTransaction,
  SyncResult,
} from "@/types/integration";
import { syncInventoryTransactionsToAccounting } from "./inventoryService";
import { supabase } from "@/lib/supabase";

// Default account mappings
const defaultAccountMappings: AccountMapping[] = [
  {
    salesType: "flight",
    revenueAccountCode: "4-1000", // Pendapatan Jasa
    receivableAccountCode: "1-1100", // Bank BCA
    description: "Pendapatan Penjualan Tiket Pesawat",
  },
  {
    salesType: "hotel",
    revenueAccountCode: "4-1000", // Pendapatan Jasa
    receivableAccountCode: "1-1100", // Bank BCA
    description: "Pendapatan Penjualan Kamar Hotel",
  },
  {
    salesType: "executive_lounge",
    revenueAccountCode: "4101", // Pendapatan Executive Lounge
    receivableAccountCode: "1-1100", // Bank BCA
    description: "Pendapatan Executive Lounge",
  },
  {
    salesType: "transportation",
    revenueAccountCode: "4102", // Pendapatan Transportation
    receivableAccountCode: "1-1100", // Bank BCA
    description: "Pendapatan Transportation",
  },
  {
    salesType: "sapphire_handling",
    revenueAccountCode: "4103", // Pendapatan Sapphire Handling
    receivableAccountCode: "1-1100", // Bank BCA
    description: "Pendapatan Sapphire Handling",
  },
  {
    salesType: "porter_service",
    revenueAccountCode: "4104", // Pendapatan Porter Service
    receivableAccountCode: "1-1100", // Bank BCA
    description: "Pendapatan Porter Service",
  },
  {
    salesType: "modem_rental",
    revenueAccountCode: "4105", // Pendapatan Modem Rental & Sim Card
    receivableAccountCode: "1-1100", // Bank BCA
    description: "Pendapatan Modem Rental & Sim Card",
  },
  {
    salesType: "sport_center",
    revenueAccountCode: "4106", // Pendapatan Sport Center
    receivableAccountCode: "1-1100", // Bank BCA
    description: "Pendapatan Sport Center",
  },
];

// Mock storage for sales transactions that need to be synced
let pendingSalesTransactions: SalesTransaction[] = [];

// Sync settings
let syncSettings = {
  syncFrequency: "manual", // manual, realtime, hourly, daily
  syncBehavior: "new-only", // new-only, all, modified
};

// Get sync settings
export const getSyncSettings = () => {
  return { ...syncSettings };
};

// Update sync settings
export const updateSyncSettings = (settings: {
  syncFrequency?: string;
  syncBehavior?: string;
}) => {
  syncSettings = { ...syncSettings, ...settings };
  return syncSettings;
};

// Add a sales transaction to the pending list and optionally sync immediately
export const addPendingSalesTransaction = (
  transaction: SalesTransaction,
  syncImmediately: boolean = false,
): void => {
  pendingSalesTransactions.push({
    ...transaction,
    syncedToAccounting: false,
  });

  // If auto-sync is enabled, sync immediately
  if (syncImmediately) {
    syncTransactions()
      .then((result) => {
        console.log("Auto-sync completed:", result);
      })
      .catch((error) => {
        console.error("Auto-sync failed:", error);
      });
  }
};

// Get all pending sales transactions
export const getPendingSalesTransactions = (): SalesTransaction[] => {
  return pendingSalesTransactions.filter((t) => !t.syncedToAccounting);
};

// Convert a sales transaction to an accounting transaction
export const convertSalesToAccounting = (
  salesTransaction: SalesTransaction,
): Transaction => {
  // Find the appropriate account mapping
  const mapping =
    defaultAccountMappings.find(
      (m) => m.salesType === salesTransaction.transactionType,
    ) || defaultAccountMappings[0];

  // Generate a transaction ID for accounting
  const transactionId = `ACC-${salesTransaction.id.split("-")[1]}-${Date.now().toString().slice(-6)}`;

  // Create transaction entries (double-entry accounting)
  const entries: TransactionEntry[] = [
    {
      id: `${transactionId}-1`,
      transactionId,
      accountId: mapping.receivableAccountCode,
      accountCode: mapping.receivableAccountCode,
      accountName:
        salesTransaction.transactionType === "flight" ? "Bank BCA" : "Bank BCA",
      description: `Penerimaan dari ${salesTransaction.productName}`,
      debit: salesTransaction.totalAmount,
      credit: 0,
    },
    {
      id: `${transactionId}-2`,
      transactionId,
      accountId: mapping.revenueAccountCode,
      accountCode: mapping.revenueAccountCode,
      accountName: "Pendapatan Jasa",
      description: mapping.description,
      debit: 0,
      credit: salesTransaction.totalAmount,
    },
  ];

  // Create the complete transaction
  return {
    id: transactionId,
    transactionId,
    date: salesTransaction.date,
    description: `${mapping.description}: ${salesTransaction.productName} untuk ${salesTransaction.customerName}`,
    reference: salesTransaction.reference || salesTransaction.id,
    entries,
    createdBy: "System Integration",
    createdAt: new Date(),
    updatedAt: new Date(),
    status: "Posted" as TransactionStatus,
  };
};

// Sync all pending sales transactions to accounting
export const syncTransactions = async (): Promise<SyncResult> => {
  try {
    const pendingTransactions = getPendingSalesTransactions();

    if (pendingTransactions.length === 0) {
      return {
        success: true,
        syncedCount: 0,
        failedCount: 0,
        errors: [],
        syncedTransactions: [],
      };
    }

    const accountingTransactions: Transaction[] = [];
    const errors: string[] = [];

    // Convert each pending transaction to an accounting transaction
    pendingTransactions.forEach((salesTx, index) => {
      try {
        const accountingTx = convertSalesToAccounting(salesTx);
        accountingTransactions.push(accountingTx);

        // Mark as synced
        pendingSalesTransactions[
          pendingSalesTransactions.findIndex((t) => t.id === salesTx.id)
        ].syncedToAccounting = true;
      } catch (error) {
        errors.push(`Failed to sync transaction ${salesTx.id}: ${error}`);
      }
    });

    // In a real application, you would save these transactions to your database
    // For this demo, we'll just return the result

    return {
      success: errors.length === 0,
      syncedCount: accountingTransactions.length,
      failedCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      syncedTransactions: accountingTransactions,
    };
  } catch (error) {
    return {
      success: false,
      syncedCount: 0,
      failedCount: 1,
      errors: [`Sync failed: ${error}`],
    };
  }
};

// Get account mappings
export const getAccountMappings = (): AccountMapping[] => {
  return [...defaultAccountMappings];
};

// Update account mappings
export const updateAccountMapping = (mapping: AccountMapping): void => {
  const index = defaultAccountMappings.findIndex(
    (m) => m.salesType === mapping.salesType,
  );
  if (index >= 0) {
    defaultAccountMappings[index] = mapping;
  } else {
    defaultAccountMappings.push(mapping);
  }
};

// Sync all pending transactions (both sales and inventory)
export const syncAllTransactions = async (): Promise<{
  sales: SyncResult;
  inventory: {
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors?: string[];
  };
}> => {
  const salesResult = await syncTransactions();
  const inventoryResult = await syncInventoryTransactionsToAccounting();

  return {
    sales: salesResult,
    inventory: inventoryResult,
  };
};

// Get integration status
export const getIntegrationStatus = async (): Promise<{
  pendingSalesTransactions: number;
  pendingInventoryTransactions: number;
  lastSyncTime: string;
  syncErrors: number;
}> => {
  // In a real implementation, this would query the database
  // For now, return mock data
  return {
    pendingSalesTransactions: pendingSalesTransactions.filter(
      (t) => !t.syncedToAccounting,
    ).length,
    pendingInventoryTransactions: 3, // This would come from the inventory service
    lastSyncTime: new Date().toISOString(),
    syncErrors: 0,
  };
};

// Log integration error
export const logIntegrationError = async (
  error: any,
  source: string,
): Promise<void> => {
  try {
    console.error(`Integration error from ${source}:`, error);

    // In a real implementation, this would insert into the database
    // const { data, error: insertError } = await supabase
    //   .from("integration_logs")
    //   .insert([{
    //     source,
    //     error_message: error instanceof Error ? error.message : String(error),
    //     created_at: new Date().toISOString(),
    //   }]);

    // if (insertError) throw insertError;

    // Send notification for critical errors
    await sendErrorNotification(error, source);
  } catch (logError) {
    console.error("Error logging integration error:", logError);
  }
};

// Send error notification
const sendErrorNotification = async (
  error: any,
  source: string,
): Promise<void> => {
  try {
    console.log(`Sending notification: Integration error from ${source}`);
    // In a real implementation, this would call an edge function
    // const { data, error: invokeError } = await supabase.functions.invoke("send-notification", {
    //   body: {
    //     type: "Sync Error Alert",
    //     message: `Transaction failed to post to General Ledger. Please check system logs.`,
    //     source,
    //     error: error instanceof Error ? error.message : String(error),
    //     recipient: "admin@company.com",
    //   },
    // });

    // if (invokeError) throw invokeError;
  } catch (notifyError) {
    console.error("Error sending notification:", notifyError);
  }
};

// Function to fetch integration data
export const fetchIntegrationData = async () => {
  // Simulate API call with a delay
  return new Promise<SalesTransaction[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "S001",
          date: new Date(),
          customerName: "John Doe",
          customerEmail: "john@example.com",
          transactionType: "flight",
          productId: "F001",
          productName: "Jakarta - Bali",
          quantity: 2,
          unitPrice: 1500000,
          totalAmount: 3000000,
          paymentMethod: "Credit Card",
          reference: "INV-001",
          syncedToAccounting: false,
        },
        {
          id: "S002",
          date: new Date(),
          customerName: "Jane Smith",
          customerEmail: "jane@example.com",
          transactionType: "hotel",
          productId: "H001",
          productName: "Grand Hyatt Bali",
          quantity: 3,
          unitPrice: 2000000,
          totalAmount: 6000000,
          paymentMethod: "Bank Transfer",
          reference: "INV-002",
          syncedToAccounting: false,
        },
      ]);
    }, 1000);
  });
};
