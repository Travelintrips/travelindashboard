import React, { useState, useEffect } from "react";
import DataEntryForm from "../dashboard/DataEntryForm";
import DataEntrySummary from "../dashboard/DataEntrySummary";
import DashboardHeader from "../dashboard/DashboardHeader";
import { format } from "date-fns";

interface DataEntryPageProps {
  userName?: string;
  userAvatar?: string;
}

interface FlightSale {
  type: "flight";
  transactionId: string;
  bookingDate: Date;
  departureDate: Date;
  airline: string;
  passengerName: string;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Refunded";
}

interface HotelSale {
  type: "hotel";
  transactionId: string;
  bookingDate: Date;
  checkInDate: Date;
  checkOutDate: Date;
  hotelName: string;
  guestName: string;
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Refunded";
}

type Transaction = FlightSale | HotelSale;

interface FlightSummary {
  totalCount: number;
  totalAmount: number;
  paidCount: number;
  pendingCount: number;
  refundedCount: number;
  recentTransactions: {
    transactionId: string;
    airline: string;
    passengerName: string;
    amount: number;
    paymentStatus: string;
    date: string;
  }[];
}

interface HotelSummary {
  totalCount: number;
  totalAmount: number;
  paidCount: number;
  pendingCount: number;
  refundedCount: number;
  recentTransactions: {
    transactionId: string;
    hotelName: string;
    guestName: string;
    amount: number;
    paymentStatus: string;
    date: string;
  }[];
}

const DataEntryPage = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: DataEntryPageProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [flightSummary, setFlightSummary] = useState<FlightSummary>({
    totalCount: 0,
    totalAmount: 0,
    paidCount: 0,
    pendingCount: 0,
    refundedCount: 0,
    recentTransactions: [],
  });
  const [hotelSummary, setHotelSummary] = useState<HotelSummary>({
    totalCount: 0,
    totalAmount: 0,
    paidCount: 0,
    pendingCount: 0,
    refundedCount: 0,
    recentTransactions: [],
  });

  // Update summaries when transactions change
  useEffect(() => {
    // Process flight transactions
    const flightTransactions = transactions.filter(
      (t) => t.type === "flight",
    ) as FlightSale[];

    const flightSummary = {
      totalCount: flightTransactions.length,
      totalAmount: flightTransactions.reduce((sum, t) => sum + t.amount, 0),
      paidCount: flightTransactions.filter((t) => t.paymentStatus === "Paid")
        .length,
      pendingCount: flightTransactions.filter(
        (t) => t.paymentStatus === "Pending",
      ).length,
      refundedCount: flightTransactions.filter(
        (t) => t.paymentStatus === "Refunded",
      ).length,
      recentTransactions: flightTransactions.slice(0, 5).map((t) => ({
        transactionId: t.transactionId,
        airline: t.airline,
        passengerName: t.passengerName,
        amount: t.amount,
        paymentStatus: t.paymentStatus,
        date: format(t.bookingDate, "yyyy-MM-dd"),
      })),
    };

    // Process hotel transactions
    const hotelTransactions = transactions.filter(
      (t) => t.type === "hotel",
    ) as HotelSale[];

    const hotelSummary = {
      totalCount: hotelTransactions.length,
      totalAmount: hotelTransactions.reduce((sum, t) => sum + t.amount, 0),
      paidCount: hotelTransactions.filter((t) => t.paymentStatus === "Paid")
        .length,
      pendingCount: hotelTransactions.filter(
        (t) => t.paymentStatus === "Pending",
      ).length,
      refundedCount: hotelTransactions.filter(
        (t) => t.paymentStatus === "Refunded",
      ).length,
      recentTransactions: hotelTransactions.slice(0, 5).map((t) => ({
        transactionId: t.transactionId,
        hotelName: t.hotelName,
        guestName: t.guestName,
        amount: t.amount,
        paymentStatus: t.paymentStatus,
        date: format(t.bookingDate, "yyyy-MM-dd"),
      })),
    };

    setFlightSummary(flightSummary);
    setHotelSummary(hotelSummary);

    // In a real app, you would also send this data to your accounting system
    // For example: accountingService.recordTransaction(data);
    console.log("Updated summaries with new transactions", {
      flightSummary,
      hotelSummary,
    });
  }, [transactions]);

  const handleNewTransaction = (data: Transaction) => {
    console.log("New transaction submitted:", data);
    // Add the new transaction to our state
    setTransactions([data, ...transactions]);

    // In a real app, this would save the transaction to a database
    // For example: api.saveTransaction(data).then(() => fetchLatestTransactions());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Formulir Entri Data"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Summary Section */}
          <DataEntrySummary
            flightTransactions={flightSummary}
            hotelTransactions={hotelSummary}
          />

          {/* Data Entry Form */}
          <DataEntryForm onSubmit={handleNewTransaction} />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Sistem Pemesanan Perjalanan.
              Seluruh hak cipta dilindungi.
            </p>
            <p className="text-sm text-gray-500">
              Terakhir diperbarui: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataEntryPage;
