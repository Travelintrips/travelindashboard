import { Transaction } from "./accounting";

// Integration types for connecting sales and accounting systems
export interface SalesAccountingIntegration {
  // Maps sales transaction types to accounting account codes
  accountMappings: AccountMapping[];
  // Function to convert a sales transaction to an accounting transaction
  convertSalesToAccounting: (salesTransaction: SalesTransaction) => Transaction;
  // Function to sync all pending sales transactions to accounting
  syncTransactions: () => Promise<SyncResult>;
}

export interface AccountMapping {
  salesType: "flight" | "hotel";
  revenueAccountCode: string;
  receivableAccountCode: string;
  description: string;
}

export interface SalesTransaction {
  id: string;
  date: Date;
  customerName: string;
  customerEmail?: string;
  transactionType: "flight" | "hotel";
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  reference?: string;
  notes?: string;
  syncedToAccounting?: boolean;
}

export interface SyncResult {
  success: boolean;
  syncedCount: number;
  failedCount: number;
  errors?: string[];
  syncedTransactions?: Transaction[];
}
