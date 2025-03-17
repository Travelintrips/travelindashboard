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
