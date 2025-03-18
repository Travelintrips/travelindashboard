// Data model for accounting system

// Chart of Accounts
export interface Account {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  balance: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AccountCategory =
  | "Asset"
  | "Liability"
  | "Equity"
  | "Revenue"
  | "Expense";

// Transactions
export interface Transaction {
  id: string;
  transactionId: string;
  date: Date;
  description: string;
  reference?: string;
  entries: TransactionEntry[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: TransactionStatus;
}

export type TransactionStatus = "Draft" | "Posted" | "Voided";

export interface TransactionEntry {
  id: string;
  transactionId: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description?: string;
  debit: number;
  credit: number;
}

// Financial Reports
export interface FinancialReportOptions {
  startDate: Date;
  endDate: Date;
  reportType: ReportType;
  compareWithPreviousPeriod?: boolean;
  includeSubaccounts?: boolean;
}

export type ReportType =
  | "BalanceSheet"
  | "IncomeStatement"
  | "CashFlow"
  | "GeneralLedger";

// Dashboard
export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  cashBalance: number;
}

export interface TransactionSummary {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  recentTransactions: Transaction[];
}

// Sales Reporting
export interface SalesData {
  period: string; // e.g., "2023-05"
  flightSales: number;
  hotelSales: number;
  totalSales: number;
  transactionCount: number;
  // Properties for SalesChart compatibility
  month: string;
  flights: number;
  hotels: number;
  total: number;
}

export interface SalesReport {
  startDate: Date;
  endDate: Date;
  data: SalesData[];
  summary: {
    totalFlightSales: number;
    totalHotelSales: number;
    totalSales: number;
    totalTransactions: number;
    averageTransactionValue: number;
  };
}

// Integration with Inventory
export interface InventoryAccountingIntegration {
  // Function to convert an inventory transaction to an accounting transaction
  convertToAccountingTransaction: (inventoryTransaction: any) => Transaction;
  // Function to sync all pending inventory transactions to accounting
  syncTransactions: () => Promise<{
    success: boolean;
    syncedCount: number;
    failedCount: number;
    errors?: string[];
  }>;
}
