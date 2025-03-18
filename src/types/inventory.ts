// Data model for inventory management system

// Product Categories
export interface ProductCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Products
export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  stockQuantity: number;
  unitPrice: number;
  costPrice: number;
  supplier: string;
  reorderLevel: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Inventory Transactions
export interface InventoryTransaction {
  id: string;
  transactionId: string;
  date: Date;
  productId: string;
  productName: string;
  transactionType: InventoryTransactionType;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  reference?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  syncedToAccounting: boolean;
}

export type InventoryTransactionType = "Purchase" | "Sale" | "Adjustment";

// Stock Movement
export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  date: Date;
  quantity: number;
  balanceAfter: number;
  transactionId: string;
  transactionType: InventoryTransactionType;
  notes?: string;
}

// Inventory Reports
export interface InventoryReportOptions {
  startDate: Date;
  endDate: Date;
  reportType: InventoryReportType;
  categoryId?: string;
  productId?: string;
}

export type InventoryReportType =
  | "StockSummary"
  | "StockMovement"
  | "PurchaseSummary"
  | "SaleSummary";

// Dashboard
export interface InventorySummary {
  totalProducts: number;
  totalCategories: number;
  totalStockValue: number;
  lowStockItems: number;
  transactionsThisMonth: number;
}

export interface CategorySummary {
  categoryName: string;
  productCount: number;
  stockValue: number;
}

export interface StockAlert {
  productId: string;
  productName: string;
  categoryName: string;
  currentStock: number;
  reorderLevel: number;
  supplier: string;
}

// Integration with Accounting
export interface InventoryAccountingIntegration {
  // Maps inventory transaction types to accounting account codes
  accountMappings: InventoryAccountMapping[];
  // Function to convert an inventory transaction to an accounting transaction
  convertToAccountingTransaction: (
    inventoryTransaction: InventoryTransaction,
  ) => any;
  // Function to sync all pending inventory transactions to accounting
  syncTransactions: () => Promise<any>;
}

export interface InventoryAccountMapping {
  transactionType: InventoryTransactionType;
  // For Purchase
  inventoryAccountCode?: string; // Debit for Purchase
  cashAccountCode?: string; // Credit for Purchase
  // For Sale
  revenueAccountCode?: string; // Credit for Sale
  receivableAccountCode?: string; // Debit for Sale
  costOfGoodsAccountCode?: string; // Debit for Sale (COGS)
  // For Adjustment
  adjustmentAccountCode?: string; // Credit/Debit for Adjustment
  description: string;
}

// Integration Logs
export interface IntegrationLog {
  id: string;
  transactionId: string;
  integrationType: string; // e.g., "inventory_to_accounting"
  status: "success" | "error";
  errorMessage?: string;
  createdAt: Date;
  createdBy: string;
}

// Sync Status
export interface SyncStatus {
  pendingTransactions: number;
  lastSyncTime: Date | null;
  syncErrors: number;
  lastErrorMessage?: string;
}
