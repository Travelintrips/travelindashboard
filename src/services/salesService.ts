import { SalesTransaction } from "@/types/integration";
import { SalesData } from "@/types/accounting";

// In-memory storage for sales transactions
let salesTransactions: SalesTransaction[] = [];

// Sample sales data
let salesDataStore: SalesData[] = [
  {
    period: "Jan",
    flightSales: 45000,
    hotelSales: 32000,
    totalSales: 77000,
    transactionCount: 120,
    month: "Jan",
    flights: 45000,
    hotels: 32000,
    total: 77000,
  },
  {
    period: "Feb",
    flightSales: 52000,
    hotelSales: 38000,
    totalSales: 90000,
    transactionCount: 145,
    month: "Feb",
    flights: 52000,
    hotels: 38000,
    total: 90000,
  },
  {
    period: "Mar",
    flightSales: 48000,
    hotelSales: 41000,
    totalSales: 89000,
    transactionCount: 135,
    month: "Mar",
    flights: 48000,
    hotels: 41000,
    total: 89000,
  },
  {
    period: "Apr",
    flightSales: 61000,
    hotelSales: 45000,
    totalSales: 106000,
    transactionCount: 160,
    month: "Apr",
    flights: 61000,
    hotels: 45000,
    total: 106000,
  },
  {
    period: "May",
    flightSales: 58000,
    hotelSales: 52000,
    totalSales: 110000,
    transactionCount: 175,
    month: "May",
    flights: 58000,
    hotels: 52000,
    total: 110000,
  },
  {
    period: "Jun",
    flightSales: 65000,
    hotelSales: 58000,
    totalSales: 123000,
    transactionCount: 190,
    month: "Jun",
    flights: 65000,
    hotels: 58000,
    total: 123000,
  },
];

// Sample recent transactions
let recentTransactionsStore = [
  {
    id: "TX-1234",
    date: "2023-06-15",
    customer: "John Smith",
    type: "flight",
    amount: 459.99,
    status: "completed",
    action: "View",
    inventory: "Economy Seat",
    category: "International",
  },
  {
    id: "TX-1235",
    date: "2023-06-14",
    customer: "Sarah Johnson",
    type: "hotel",
    amount: 289.5,
    status: "completed",
    action: "View",
    inventory: "Standard Room",
    category: "Business",
  },
  {
    id: "TX-1236",
    date: "2023-06-14",
    customer: "Michael Brown",
    type: "flight",
    amount: 612.75,
    status: "pending",
    action: "View",
    inventory: "Business Seat",
    category: "Domestic",
  },
  {
    id: "TX-1237",
    date: "2023-06-13",
    customer: "Emily Davis",
    type: "hotel",
    amount: 425.0,
    status: "completed",
    action: "View",
    inventory: "Deluxe Room",
    category: "Leisure",
  },
  {
    id: "TX-1238",
    date: "2023-06-13",
    customer: "Robert Wilson",
    type: "flight",
    amount: 378.5,
    status: "completed",
    action: "View",
    inventory: "First Class",
    category: "International",
  },
];

// Add a new sales transaction
export const addSalesTransaction = (transaction: SalesTransaction) => {
  salesTransactions.push(transaction);

  // Update recent transactions list
  const newRecentTransaction = {
    id: transaction.id,
    date: transaction.date.toISOString().split("T")[0],
    customer: transaction.customerName,
    type: transaction.transactionType,
    amount: transaction.totalAmount,
    status: "completed",
    action: "View",
    inventory:
      transaction.transactionType === "flight"
        ? "Economy Seat"
        : "Standard Room",
    category:
      transaction.transactionType === "flight" ? "Domestic" : "Business",
  };

  // Add to recent transactions (at the beginning)
  recentTransactionsStore = [newRecentTransaction, ...recentTransactionsStore];

  // Update sales data for the current month
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("en-US", { month: "short" });

  // Find the current month in salesDataStore
  const monthIndex = salesDataStore.findIndex(
    (item) => item.period === currentMonth,
  );

  if (monthIndex !== -1) {
    // Update existing month data
    if (transaction.transactionType === "flight") {
      salesDataStore[monthIndex].flightSales += transaction.totalAmount;
      salesDataStore[monthIndex].flights += transaction.totalAmount;
    } else {
      salesDataStore[monthIndex].hotelSales += transaction.totalAmount;
      salesDataStore[monthIndex].hotels += transaction.totalAmount;
    }

    salesDataStore[monthIndex].totalSales += transaction.totalAmount;
    salesDataStore[monthIndex].total += transaction.totalAmount;
    salesDataStore[monthIndex].transactionCount += 1;
  } else {
    // Create new month entry if it doesn't exist
    const newMonthData: SalesData = {
      period: currentMonth,
      flightSales:
        transaction.transactionType === "flight" ? transaction.totalAmount : 0,
      hotelSales:
        transaction.transactionType === "hotel" ? transaction.totalAmount : 0,
      totalSales: transaction.totalAmount,
      transactionCount: 1,
      month: currentMonth,
      flights:
        transaction.transactionType === "flight" ? transaction.totalAmount : 0,
      hotels:
        transaction.transactionType === "hotel" ? transaction.totalAmount : 0,
      total: transaction.totalAmount,
    };

    salesDataStore.push(newMonthData);
  }

  return transaction;
};

// Get all sales transactions
export const getSalesTransactions = () => {
  return salesTransactions;
};

// Get sales data for charts
export const getSalesData = () => {
  return salesDataStore;
};

// Get recent transactions
export const getRecentTransactions = () => {
  return recentTransactionsStore;
};
