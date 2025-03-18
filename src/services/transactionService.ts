import { supabase } from "@/lib/supabase";

interface Transaction {
  type: string;
  transactionId: string;
  bookingDate: Date;
  amount: number;
  paymentStatus: string;
  [key: string]: any; // For other properties specific to flight or hotel
}

export const transactionService = {
  // Save a transaction to the database
  async saveTransaction(transaction: Transaction) {
    try {
      // Format the transaction for database storage
      const formattedTransaction = {
        ...transaction,
        bookingDate: transaction.bookingDate.toISOString(),
        // Format other dates if present
        departureDate: transaction.departureDate
          ? transaction.departureDate.toISOString()
          : null,
        checkInDate: transaction.checkInDate
          ? transaction.checkInDate.toISOString()
          : null,
        checkOutDate: transaction.checkOutDate
          ? transaction.checkOutDate.toISOString()
          : null,
        created_at: new Date().toISOString(),
      };

      // In a real implementation, you would save to your Supabase table
      // const { data, error } = await supabase
      //   .from('transactions')
      //   .insert(formattedTransaction);

      // if (error) throw error;
      // return data;

      // For now, just log and return the transaction
      console.log("Would save transaction to database:", formattedTransaction);
      return formattedTransaction;
    } catch (error) {
      console.error("Error saving transaction:", error);
      throw error;
    }
  },

  // Get all transactions
  async getTransactions() {
    try {
      // In a real implementation, you would fetch from your Supabase table
      // const { data, error } = await supabase
      //   .from('transactions')
      //   .select('*')
      //   .order('created_at', { ascending: false });

      // if (error) throw error;
      // return data;

      // For now, just return an empty array
      return [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  },

  // Get transaction summary
  async getTransactionSummary() {
    try {
      // In a real implementation, you would calculate this from your database
      // For now, return placeholder data
      return {
        flight: {
          totalCount: 0,
          totalAmount: 0,
          paidCount: 0,
          pendingCount: 0,
          refundedCount: 0,
          recentTransactions: [],
        },
        hotel: {
          totalCount: 0,
          totalAmount: 0,
          paidCount: 0,
          pendingCount: 0,
          refundedCount: 0,
          recentTransactions: [],
        },
      };
    } catch (error) {
      console.error("Error getting transaction summary:", error);
      throw error;
    }
  },

  // Send transaction to accounting system
  async sendToAccounting(transaction: Transaction) {
    try {
      // In a real implementation, you would integrate with your accounting system
      // For now, just log the action
      console.log("Would send transaction to accounting system:", transaction);
      return true;
    } catch (error) {
      console.error("Error sending to accounting:", error);
      throw error;
    }
  },
};
