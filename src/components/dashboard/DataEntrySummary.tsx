import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plane,
  Building,
  Calendar,
  CreditCard,
  User,
  Clock,
} from "lucide-react";

interface DataEntrySummaryProps {
  flightTransactions?: FlightSummary;
  hotelTransactions?: HotelSummary;
}

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

const DataEntrySummary = ({
  flightTransactions = {
    totalCount: 156,
    totalAmount: 78500.25,
    paidCount: 120,
    pendingCount: 30,
    refundedCount: 6,
    recentTransactions: [
      {
        transactionId: "FL-1234-567890",
        airline: "Garuda Indonesia",
        passengerName: "Budi Santoso",
        amount: 1250.0,
        paymentStatus: "Paid",
        date: "2023-06-15",
      },
      {
        transactionId: "FL-2345-678901",
        airline: "Lion Air",
        passengerName: "Siti Rahayu",
        amount: 850.5,
        paymentStatus: "Pending",
        date: "2023-06-14",
      },
      {
        transactionId: "FL-3456-789012",
        airline: "Batik Air",
        passengerName: "Ahmad Hidayat",
        amount: 1100.75,
        paymentStatus: "Paid",
        date: "2023-06-13",
      },
    ],
  },
  hotelTransactions = {
    totalCount: 98,
    totalAmount: 45850.5,
    paidCount: 75,
    pendingCount: 18,
    refundedCount: 5,
    recentTransactions: [
      {
        transactionId: "HT-7890-123456",
        hotelName: "Grand Hyatt Jakarta",
        guestName: "Dewi Lestari",
        amount: 2500.0,
        paymentStatus: "Paid",
        date: "2023-06-15",
      },
      {
        transactionId: "HT-8901-234567",
        hotelName: "Sheraton Surabaya",
        guestName: "Rudi Hartono",
        amount: 1800.25,
        paymentStatus: "Paid",
        date: "2023-06-14",
      },
      {
        transactionId: "HT-9012-345678",
        hotelName: "Aston Bandung",
        guestName: "Nina Wijaya",
        amount: 950.5,
        paymentStatus: "Pending",
        date: "2023-06-13",
      },
    ],
  },
}: DataEntrySummaryProps) => {
  return (
    <Card className="w-full bg-white shadow-sm mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Ringkasan Entri Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="flight">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="flight" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Ringkasan Penerbangan
            </TabsTrigger>
            <TabsTrigger value="hotel" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Ringkasan Hotel
            </TabsTrigger>
          </TabsList>

          {/* Flight Summary */}
          <TabsContent value="flight">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Total Transaksi
                      </p>
                      <h3 className="text-2xl font-bold text-blue-900">
                        {flightTransactions.totalCount}
                      </h3>
                    </div>
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Total Pendapatan
                      </p>
                      <h3 className="text-2xl font-bold text-green-900">
                        ${flightTransactions.totalAmount.toLocaleString()}
                      </h3>
                    </div>
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Status Pembayaran
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm font-medium text-green-600">
                          {flightTransactions.paidCount} Dibayar
                        </span>
                        <span className="text-sm font-medium text-amber-600">
                          {flightTransactions.pendingCount} Tertunda
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {flightTransactions.refundedCount} Dikembalikan
                        </span>
                      </div>
                    </div>
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold mb-3">
                  Transaksi Terbaru
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Maskapai
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Penumpang
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {flightTransactions.recentTransactions.map(
                        (transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {transaction.transactionId}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {transaction.airline}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {transaction.passengerName}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium">
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.paymentStatus === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.paymentStatus === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transaction.paymentStatus === "Paid"
                                  ? "Dibayar"
                                  : transaction.paymentStatus === "Pending"
                                    ? "Tertunda"
                                    : "Dikembalikan"}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {transaction.date}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Hotel Summary */}
          <TabsContent value="hotel">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Total Transaksi
                      </p>
                      <h3 className="text-2xl font-bold text-blue-900">
                        {hotelTransactions.totalCount}
                      </h3>
                    </div>
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Total Pendapatan
                      </p>
                      <h3 className="text-2xl font-bold text-green-900">
                        ${hotelTransactions.totalAmount.toLocaleString()}
                      </h3>
                    </div>
                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Status Pembayaran
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-sm font-medium text-green-600">
                          {hotelTransactions.paidCount} Dibayar
                        </span>
                        <span className="text-sm font-medium text-amber-600">
                          {hotelTransactions.pendingCount} Tertunda
                        </span>
                        <span className="text-sm font-medium text-red-600">
                          {hotelTransactions.refundedCount} Dikembalikan
                        </span>
                      </div>
                    </div>
                    <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-md font-semibold mb-3">
                  Transaksi Terbaru
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hotel
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tamu
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Jumlah
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tanggal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {hotelTransactions.recentTransactions.map(
                        (transaction, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {transaction.transactionId}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {transaction.hotelName}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {transaction.guestName}
                            </td>
                            <td className="px-4 py-2 text-sm font-medium">
                              ${transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  transaction.paymentStatus === "Paid"
                                    ? "bg-green-100 text-green-800"
                                    : transaction.paymentStatus === "Pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {transaction.paymentStatus === "Paid"
                                  ? "Dibayar"
                                  : transaction.paymentStatus === "Pending"
                                    ? "Tertunda"
                                    : "Dikembalikan"}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-500">
                              {transaction.date}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataEntrySummary;
