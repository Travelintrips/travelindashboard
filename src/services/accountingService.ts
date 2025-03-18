import { supabase } from "@/lib/supabase";
import type {
  Account,
  Transaction,
  TransactionEntry,
} from "@/types/accounting";

// Accounts
export const getAccounts = async () => {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .order("code");

  if (error) throw error;
  return data;
};

export const getAccountById = async (id: string) => {
  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createAccount = async (
  account: Omit<Account, "id" | "createdAt" | "updatedAt">,
) => {
  const { data, error } = await supabase
    .from("accounts")
    .insert([
      {
        code: account.code,
        name: account.name,
        category: account.category,
        balance: account.balance,
        is_active: account.isActive,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateAccount = async (id: string, account: Partial<Account>) => {
  const { data, error } = await supabase
    .from("accounts")
    .update({
      code: account.code,
      name: account.name,
      category: account.category,
      balance: account.balance,
      is_active: account.isActive,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAccount = async (id: string) => {
  const { error } = await supabase.from("accounts").delete().eq("id", id);

  if (error) throw error;
  return true;
};

// Transactions
export const getTransactions = async () => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
};

export const getTransactionById = async (id: string) => {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, transaction_entries(*)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
};

export const createTransaction = async (
  transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  entries: Omit<TransactionEntry, "id" | "createdAt">[],
) => {
  // Start a transaction
  const { data, error } = await supabase.rpc("create_transaction", {
    transaction_data: {
      transaction_id: transaction.transactionId,
      date: transaction.date,
      description: transaction.description,
      reference: transaction.reference,
      created_by: transaction.createdBy,
      status: transaction.status,
    },
    entries_data: entries.map((entry) => ({
      account_id: entry.accountId,
      account_code: entry.accountCode,
      account_name: entry.accountName,
      description: entry.description,
      debit: entry.debit,
      credit: entry.credit,
    })),
  });

  if (error) throw error;
  return data;
};

// Fallback method if RPC is not available
export const createTransactionManual = async (
  transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  entries: Omit<TransactionEntry, "id" | "createdAt">[],
) => {
  // Start a Supabase transaction
  const { data: transactionData, error: transactionError } = await supabase
    .from("transactions")
    .insert([
      {
        transaction_id: transaction.transactionId,
        date: transaction.date,
        description: transaction.description,
        reference: transaction.reference,
        created_by: transaction.createdBy,
        status: transaction.status,
      },
    ])
    .select()
    .single();

  if (transactionError) throw transactionError;

  // Insert entries
  const entriesWithTransactionId = entries.map((entry) => ({
    transaction_id: transactionData.id,
    account_id: entry.accountId,
    account_code: entry.accountCode,
    account_name: entry.accountName,
    description: entry.description,
    debit: entry.debit,
    credit: entry.credit,
  }));

  const { data: entriesData, error: entriesError } = await supabase
    .from("transaction_entries")
    .insert(entriesWithTransactionId)
    .select();

  if (entriesError) throw entriesError;

  return { transaction: transactionData, entries: entriesData };
};

// Financial Reports
export const getBalanceSheet = async (startDate: Date, endDate: Date) => {
  const { data, error } = await supabase.rpc("get_balance_sheet", {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  });

  if (error) throw error;
  return data;
};

export const getIncomeStatement = async (startDate: Date, endDate: Date) => {
  const { data, error } = await supabase.rpc("get_income_statement", {
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
  });

  if (error) throw error;
  return data;
};

export const getGeneralLedger = async (
  startDate: Date,
  endDate: Date,
  accountId?: string,
) => {
  let query = supabase
    .from("transaction_entries")
    .select(
      `
      id,
      transaction_id,
      account_id,
      account_code,
      account_name,
      description,
      debit,
      credit,
      created_at,
      transactions(id, transaction_id, date, description, reference)
    `,
    )
    .gte("transactions.date", startDate.toISOString())
    .lte("transactions.date", endDate.toISOString())
    .order("transactions.date", { ascending: true });

  if (accountId) {
    query = query.eq("account_id", accountId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data;
};

// Integration with Inventory
export const createInventoryTransaction = async (
  transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">,
  entries: Omit<TransactionEntry, "id" | "createdAt">[],
) => {
  try {
    // Try to use the RPC function first
    return await createTransaction(transaction, entries);
  } catch (error) {
    console.error("Error using RPC for transaction creation:", error);
    // Fall back to manual method
    return await createTransactionManual(transaction, entries);
  }
};

// Log integration activity
export const logIntegrationActivity = async (activity: {
  transactionId: string;
  source: string;
  action: string;
  status: string;
  details?: string;
}) => {
  const { data, error } = await supabase.from("integration_logs").insert([
    {
      transaction_id: activity.transactionId,
      source: activity.source,
      action: activity.action,
      status: activity.status,
      details: activity.details,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error logging integration activity:", error);
    throw error;
  }

  return data;
};
