import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.6";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const { action, data } = await req.json();

    let result;
    switch (action) {
      case "getBalanceSheet":
        result = await getBalanceSheet(
          supabaseClient,
          data.startDate,
          data.endDate,
        );
        break;
      case "getIncomeStatement":
        result = await getIncomeStatement(
          supabaseClient,
          data.startDate,
          data.endDate,
        );
        break;
      case "postTransaction":
        result = await postTransaction(
          supabaseClient,
          data.transaction,
          data.entries,
        );
        break;
      default:
        throw new Error(`Unsupported action: ${action}`);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in edge function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function getBalanceSheet(supabaseClient, startDate, endDate) {
  // Get all accounts
  const { data: accounts, error: accountsError } = await supabaseClient
    .from("accounts")
    .select("*")
    .in("category", ["Asset", "Liability", "Equity"]);

  if (accountsError) throw accountsError;

  // Get all transaction entries for the period
  const { data: entries, error: entriesError } = await supabaseClient
    .from("transaction_entries")
    .select("*, transactions!inner(*)")
    .gte("transactions.date", startDate)
    .lte("transactions.date", endDate);

  if (entriesError) throw entriesError;

  // Process the data to create a balance sheet
  const assets = accounts.filter((a) => a.category === "Asset");
  const liabilities = accounts.filter((a) => a.category === "Liability");
  const equity = accounts.filter((a) => a.category === "Equity");

  // Calculate balances based on entries
  const accountBalances = {};
  for (const entry of entries) {
    if (!accountBalances[entry.account_id]) {
      accountBalances[entry.account_id] = 0;
    }
    accountBalances[entry.account_id] += entry.debit - entry.credit;
  }

  // Add balances to accounts
  const processedAccounts = accounts.map((account) => ({
    ...account,
    calculatedBalance:
      (account.balance || 0) + (accountBalances[account.id] || 0),
  }));

  return {
    assets: processedAccounts.filter((a) => a.category === "Asset"),
    liabilities: processedAccounts.filter((a) => a.category === "Liability"),
    equity: processedAccounts.filter((a) => a.category === "Equity"),
    totalAssets: processedAccounts
      .filter((a) => a.category === "Asset")
      .reduce((sum, a) => sum + a.calculatedBalance, 0),
    totalLiabilities: processedAccounts
      .filter((a) => a.category === "Liability")
      .reduce((sum, a) => sum + a.calculatedBalance, 0),
    totalEquity: processedAccounts
      .filter((a) => a.category === "Equity")
      .reduce((sum, a) => sum + a.calculatedBalance, 0),
  };
}

async function getIncomeStatement(supabaseClient, startDate, endDate) {
  // Get all accounts
  const { data: accounts, error: accountsError } = await supabaseClient
    .from("accounts")
    .select("*")
    .in("category", ["Revenue", "Expense"]);

  if (accountsError) throw accountsError;

  // Get all transaction entries for the period
  const { data: entries, error: entriesError } = await supabaseClient
    .from("transaction_entries")
    .select("*, transactions!inner(*)")
    .gte("transactions.date", startDate)
    .lte("transactions.date", endDate);

  if (entriesError) throw entriesError;

  // Process the data to create an income statement
  const revenues = accounts.filter((a) => a.category === "Revenue");
  const expenses = accounts.filter((a) => a.category === "Expense");

  // Calculate balances based on entries
  const accountBalances = {};
  for (const entry of entries) {
    if (!accountBalances[entry.account_id]) {
      accountBalances[entry.account_id] = 0;
    }
    accountBalances[entry.account_id] += entry.credit - entry.debit;
  }

  // Add balances to accounts
  const processedAccounts = accounts.map((account) => ({
    ...account,
    calculatedBalance: accountBalances[account.id] || 0,
  }));

  const totalRevenue = processedAccounts
    .filter((a) => a.category === "Revenue")
    .reduce((sum, a) => sum + a.calculatedBalance, 0);

  const totalExpenses = processedAccounts
    .filter((a) => a.category === "Expense")
    .reduce((sum, a) => sum + a.calculatedBalance, 0);

  return {
    revenues: processedAccounts.filter((a) => a.category === "Revenue"),
    expenses: processedAccounts.filter((a) => a.category === "Expense"),
    totalRevenue,
    totalExpenses,
    netIncome: totalRevenue - totalExpenses,
  };
}

async function postTransaction(supabaseClient, transaction, entries) {
  console.log("Posting transaction:", transaction);
  console.log("With entries:", entries);

  // Insert transaction
  const { data: transactionData, error: transactionError } =
    await supabaseClient
      .from("transactions")
      .insert([
        {
          transaction_id: transaction.transactionId,
          date: transaction.date,
          description: transaction.description,
          reference: transaction.reference,
          created_by: transaction.createdBy,
          status: transaction.status || "Posted",
        },
      ])
      .select()
      .single();

  if (transactionError) {
    console.error("Transaction insert error:", transactionError);
    throw transactionError;
  }

  console.log("Transaction inserted:", transactionData);

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

  const { data: entriesData, error: entriesError } = await supabaseClient
    .from("transaction_entries")
    .insert(entriesWithTransactionId)
    .select();

  if (entriesError) {
    console.error("Entries insert error:", entriesError);
    throw entriesError;
  }

  console.log("Entries inserted:", entriesData);

  // Update account balances
  for (const entry of entries) {
    const { error: updateError } = await supabaseClient.rpc(
      "update_account_balance",
      {
        p_account_id: entry.accountId,
        p_debit: entry.debit,
        p_credit: entry.credit,
      },
    );

    if (updateError) {
      console.error("Account balance update error:", updateError);
      throw updateError;
    }
  }

  return { transaction: transactionData, entries: entriesData };
}
