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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
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
      case "createSale":
        result = await createSale(supabaseClient, data.sale, data.items);
        break;
      case "getSalesReport":
        result = await getSalesReport(
          supabaseClient,
          data.startDate,
          data.endDate,
          data.groupBy,
        );
        break;
      case "getInventoryReport":
        result = await getInventoryReport(supabaseClient, data.filters);
        break;
      case "createInventoryTransaction":
        result = await createInventoryTransaction(
          supabaseClient,
          data.transaction,
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
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function createSale(supabaseClient, sale, items) {
  // Insert sale
  const { data: saleData, error: saleError } = await supabaseClient
    .from("sales")
    .insert([
      {
        invoice_number: sale.invoiceNumber,
        customer_name: sale.customerName,
        customer_id: sale.customerId,
        date: sale.date,
        total_amount: sale.totalAmount,
        payment_status: sale.paymentStatus || "Pending",
        notes: sale.notes,
      },
    ])
    .select()
    .single();

  if (saleError) throw saleError;

  // Insert sale items
  const itemsWithSaleId = items.map((item) => ({
    sale_id: saleData.id,
    product_id: item.productId,
    product_code: item.productCode,
    product_name: item.productName,
    quantity: item.quantity,
    unit_price: item.unitPrice,
    discount_percent: item.discountPercent || 0,
    tax_percent: item.taxPercent || 0,
    subtotal: item.subtotal,
  }));

  const { data: itemsData, error: itemsError } = await supabaseClient
    .from("sales_items")
    .insert(itemsWithSaleId)
    .select();

  if (itemsError) throw itemsError;

  return { sale: saleData, items: itemsData };
}

async function getSalesReport(
  supabaseClient,
  startDate,
  endDate,
  groupBy = "day",
) {
  let query = supabaseClient
    .from("sales")
    .select("*, sales_items(*)")
    .gte("date", startDate)
    .lte("date", endDate);

  const { data, error } = await query;

  if (error) throw error;

  // Process data based on groupBy parameter
  let groupedData = {};

  if (groupBy === "day") {
    data.forEach((sale) => {
      const day = sale.date.split("T")[0];
      if (!groupedData[day]) {
        groupedData[day] = {
          date: day,
          totalSales: 0,
          totalItems: 0,
          sales: [],
        };
      }
      groupedData[day].totalSales += parseFloat(sale.total_amount);
      groupedData[day].totalItems += sale.sales_items.length;
      groupedData[day].sales.push(sale);
    });
  } else if (groupBy === "month") {
    data.forEach((sale) => {
      const month = sale.date.substring(0, 7); // YYYY-MM
      if (!groupedData[month]) {
        groupedData[month] = {
          date: month,
          totalSales: 0,
          totalItems: 0,
          sales: [],
        };
      }
      groupedData[month].totalSales += parseFloat(sale.total_amount);
      groupedData[month].totalItems += sale.sales_items.length;
      groupedData[month].sales.push(sale);
    });
  }

  return Object.values(groupedData);
}

async function getInventoryReport(supabaseClient, filters = {}) {
  let query = supabaseClient.from("products").select("*");

  // Apply filters if provided
  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.lowStock) {
    query = query.lt("stock_quantity", "min_stock_level");
  }

  if (filters.isActive !== undefined) {
    query = query.eq("is_active", filters.isActive);
  }

  const { data, error } = await query;

  if (error) throw error;

  // Get recent transactions for each product
  const productIds = data.map((product) => product.id);
  const { data: transactions, error: transactionsError } = await supabaseClient
    .from("inventory_transactions")
    .select("*")
    .in("product_id", productIds)
    .order("date", { ascending: false });

  if (transactionsError) throw transactionsError;

  // Group transactions by product
  const transactionsByProduct = {};
  transactions.forEach((transaction) => {
    if (!transactionsByProduct[transaction.product_id]) {
      transactionsByProduct[transaction.product_id] = [];
    }
    transactionsByProduct[transaction.product_id].push(transaction);
  });

  // Add transactions to products
  const productsWithTransactions = data.map((product) => ({
    ...product,
    recentTransactions: transactionsByProduct[product.id] || [],
    stockValue:
      parseFloat(product.stock_quantity) * parseFloat(product.purchase_price),
  }));

  return productsWithTransactions;
}

async function createInventoryTransaction(supabaseClient, transaction) {
  const { data, error } = await supabaseClient
    .from("inventory_transactions")
    .insert([
      {
        transaction_type: transaction.transactionType,
        product_id: transaction.productId,
        quantity: transaction.quantity,
        unit_price: transaction.unitPrice,
        reference_id: transaction.referenceId,
        notes: transaction.notes,
        date: transaction.date || new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}
