import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Save, FileText, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardHeader from "../dashboard/DashboardHeader";
import { Link, useNavigate } from "react-router-dom";
import {
  addPendingSalesTransaction,
  getSyncSettings,
  syncTransactions,
} from "@/services/integrationService";
import { addSalesTransaction } from "@/services/salesService";
import { SalesTransaction } from "@/types/integration";

interface SalesTransactionEntryProps {
  userName?: string;
  userAvatar?: string;
}

interface TransactionFormData {
  transactionId: string;
  date: Date;
  customerName: string;
  customerEmail: string;
  transactionType: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: string;
  reference: string;
  notes: string;
}

const generateTransactionId = () => {
  const prefix = "SALE";
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${randomNum}-${timestamp}`;
};

const SalesTransactionEntry = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: SalesTransactionEntryProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flight");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [syncOnSave, setSyncOnSave] = useState(false);

  // Transaction form state
  const [transaction, setTransaction] = useState<TransactionFormData>({
    transactionId: generateTransactionId(),
    date: new Date(),
    customerName: "",
    customerEmail: "",
    transactionType: "flight",
    productId: "",
    productName: "",
    quantity: 1,
    unitPrice: 0,
    totalAmount: 0,
    paymentMethod: "",
    reference: "",
    notes: "",
  });

  // Sample flight options
  const flightOptions = [
    { id: "FL001", name: "Jakarta to Bali", price: 120 },
    { id: "FL002", name: "Jakarta to Surabaya", price: 90 },
    { id: "FL003", name: "Jakarta to Yogyakarta", price: 85 },
    { id: "FL004", name: "Bali to Jakarta", price: 125 },
    { id: "FL005", name: "Surabaya to Jakarta", price: 95 },
  ];

  // Sample hotel options
  const hotelOptions = [
    { id: "HT001", name: "Grand Hyatt Jakarta", price: 200 },
    { id: "HT002", name: "Mulia Resort Bali", price: 250 },
    { id: "HT003", name: "Sheraton Surabaya", price: 180 },
    { id: "HT004", name: "Ayana Resort Bali", price: 300 },
    { id: "HT005", name: "JW Marriott Jakarta", price: 220 },
  ];

  // Sample payment methods
  const paymentMethods = [
    { id: "CC", name: "Credit Card" },
    { id: "DC", name: "Debit Card" },
    { id: "BT", name: "Bank Transfer" },
    { id: "PP", name: "PayPal" },
    { id: "CA", name: "Cash" },
  ];

  // Recent transactions state
  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: "SALE-1234-567890",
      date: "2023-06-15",
      customer: "John Smith",
      type: "Flight",
      product: "Jakarta to Bali",
      amount: 120.0,
    },
    {
      id: "SALE-5678-123456",
      date: "2023-06-14",
      customer: "Sarah Johnson",
      type: "Hotel",
      product: "Mulia Resort Bali",
      amount: 750.0,
    },
    {
      id: "SALE-9012-345678",
      date: "2023-06-13",
      customer: "Michael Brown",
      type: "Flight",
      product: "Surabaya to Jakarta",
      amount: 95.0,
    },
  ]);

  const handleFormChange = (field: keyof TransactionFormData, value: any) => {
    setTransaction((prev) => {
      const updated = { ...prev, [field]: value };

      // Update product details if product is selected
      if (field === "productId" && activeTab === "flight") {
        const selectedFlight = flightOptions.find((f) => f.id === value);
        if (selectedFlight) {
          updated.productName = selectedFlight.name;
          updated.unitPrice = selectedFlight.price;
          updated.totalAmount = selectedFlight.price * updated.quantity;
        }
      } else if (field === "productId" && activeTab === "hotel") {
        const selectedHotel = hotelOptions.find((h) => h.id === value);
        if (selectedHotel) {
          updated.productName = selectedHotel.name;
          updated.unitPrice = selectedHotel.price;
          updated.totalAmount = selectedHotel.price * updated.quantity;
        }
      }

      // Update total amount if quantity changes
      if (field === "quantity") {
        updated.totalAmount = updated.unitPrice * value;
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transaction submitted:", transaction);

    try {
      // Get the current sync settings
      const syncSettings = getSyncSettings();

      // Create a proper SalesTransaction object
      const salesTransaction: SalesTransaction = {
        id: transaction.transactionId,
        date: transaction.date,
        customerName: transaction.customerName,
        customerEmail: transaction.customerEmail,
        transactionType: transaction.transactionType as "flight" | "hotel",
        productId: transaction.productId,
        productName: transaction.productName,
        quantity: transaction.quantity,
        unitPrice: transaction.unitPrice,
        totalAmount: transaction.totalAmount,
        paymentMethod: transaction.paymentMethod,
        reference: transaction.reference,
        notes: transaction.notes,
        syncedToAccounting: false,
      };

      // Save the transaction to the sales service
      addSalesTransaction(salesTransaction);

      // Add to pending transactions for accounting integration
      // If sync frequency is set to realtime or syncOnSave is true, sync immediately
      const shouldSyncNow =
        syncSettings.syncFrequency === "realtime" || syncOnSave;
      addPendingSalesTransaction(salesTransaction, shouldSyncNow);

      // If syncOnSave is true, navigate to integration dashboard after sync
      if (syncOnSave) {
        setTimeout(() => {
          navigate("/integration");
        }, 2000);
      }

      // Update recent transactions list
      const newTransaction = {
        id: transaction.transactionId,
        date: format(transaction.date, "yyyy-MM-dd"),
        customer: transaction.customerName,
        type: transaction.transactionType === "flight" ? "Flight" : "Hotel",
        product: transaction.productName,
        amount: transaction.totalAmount,
      };

      // Add the new transaction to the top of the list and keep only the most recent ones
      setRecentTransactions((prev) => [newTransaction, ...prev.slice(0, 2)]);

      // Reset form
      setTransaction({
        ...transaction,
        transactionId: generateTransactionId(),
        customerName: "",
        customerEmail: "",
        productId: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
        paymentMethod: "",
        reference: "",
        notes: "",
      });

      // Show success message
      setFormSubmitted(true);
      setTimeout(() => setFormSubmitted(false), 3000);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Sales Transaction Entry"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sales Transaction Entry</h2>
          <div className="flex gap-2">
            <Link to="/sales-reports">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Sales Reports
              </Button>
            </Link>
            <Link to="/sales-dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="w-full bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  New Sales Transaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="flight"
                  value={activeTab}
                  onValueChange={(value) => {
                    setActiveTab(value);
                    setTransaction((prev) => ({
                      ...prev,
                      transactionType: value,
                      productId: "",
                      productName: "",
                      unitPrice: 0,
                      totalAmount: 0,
                    }));
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger
                      value="flight"
                      className="flex items-center gap-2"
                    >
                      Flight Booking
                    </TabsTrigger>
                    <TabsTrigger
                      value="hotel"
                      className="flex items-center gap-2"
                    >
                      Hotel Booking
                    </TabsTrigger>
                  </TabsList>

                  {/* Transaction Entry Form */}
                  <TabsContent value="flight">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="transaction-id">Transaction ID</Label>
                          <Input
                            id="transaction-id"
                            value={transaction.transactionId}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="transaction-date">
                            Transaction Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !transaction.date && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {transaction.date ? (
                                  format(transaction.date, "PPP")
                                ) : (
                                  <span>Select date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={transaction.date}
                                onSelect={(date) =>
                                  handleFormChange("date", date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customer-name">Customer Name</Label>
                          <Input
                            id="customer-name"
                            value={transaction.customerName}
                            onChange={(e) =>
                              handleFormChange("customerName", e.target.value)
                            }
                            placeholder="Enter customer name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customer-email">Customer Email</Label>
                          <Input
                            id="customer-email"
                            type="email"
                            value={transaction.customerEmail}
                            onChange={(e) =>
                              handleFormChange("customerEmail", e.target.value)
                            }
                            placeholder="Enter customer email"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="flight">Select Flight</Label>
                          <Select
                            value={transaction.productId}
                            onValueChange={(value) =>
                              handleFormChange("productId", value)
                            }
                          >
                            <SelectTrigger id="flight">
                              <SelectValue placeholder="Select a flight" />
                            </SelectTrigger>
                            <SelectContent>
                              {flightOptions.map((flight) => (
                                <SelectItem key={flight.id} value={flight.id}>
                                  {flight.name} - ${flight.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity">Number of Passengers</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={transaction.quantity}
                            onChange={(e) =>
                              handleFormChange(
                                "quantity",
                                parseInt(e.target.value),
                              )
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-method">Payment Method</Label>
                          <Select
                            value={transaction.paymentMethod}
                            onValueChange={(value) =>
                              handleFormChange("paymentMethod", value)
                            }
                          >
                            <SelectTrigger id="payment-method">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id}>
                                  {method.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="total-amount">Total Amount</Label>
                          <Input
                            id="total-amount"
                            value={formatCurrency(transaction.totalAmount)}
                            disabled
                            className="bg-gray-50 font-medium"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Input
                            id="notes"
                            value={transaction.notes}
                            onChange={(e) =>
                              handleFormChange("notes", e.target.value)
                            }
                            placeholder="Additional notes (optional)"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 mt-6">
                        <Button type="submit" className="w-full">
                          <Save className="mr-2 h-4 w-4" />
                          Save Transaction
                        </Button>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={syncOnSave}
                              onChange={(e) => setSyncOnSave(e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span>Sync to accounting after save</span>
                          </label>
                          <Link
                            to="/integration"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Go to Integration
                          </Link>
                        </div>
                      </div>
                    </form>
                  </TabsContent>

                  {/* Hotel Booking Form */}
                  <TabsContent value="hotel">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="transaction-id-hotel">
                            Transaction ID
                          </Label>
                          <Input
                            id="transaction-id-hotel"
                            value={transaction.transactionId}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="transaction-date-hotel">
                            Transaction Date
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !transaction.date && "text-muted-foreground",
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {transaction.date ? (
                                  format(transaction.date, "PPP")
                                ) : (
                                  <span>Select date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={transaction.date}
                                onSelect={(date) =>
                                  handleFormChange("date", date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customer-name-hotel">
                            Customer Name
                          </Label>
                          <Input
                            id="customer-name-hotel"
                            value={transaction.customerName}
                            onChange={(e) =>
                              handleFormChange("customerName", e.target.value)
                            }
                            placeholder="Enter customer name"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="customer-email-hotel">
                            Customer Email
                          </Label>
                          <Input
                            id="customer-email-hotel"
                            type="email"
                            value={transaction.customerEmail}
                            onChange={(e) =>
                              handleFormChange("customerEmail", e.target.value)
                            }
                            placeholder="Enter customer email"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="hotel">Select Hotel</Label>
                          <Select
                            value={transaction.productId}
                            onValueChange={(value) =>
                              handleFormChange("productId", value)
                            }
                          >
                            <SelectTrigger id="hotel">
                              <SelectValue placeholder="Select a hotel" />
                            </SelectTrigger>
                            <SelectContent>
                              {hotelOptions.map((hotel) => (
                                <SelectItem key={hotel.id} value={hotel.id}>
                                  {hotel.name} - ${hotel.price}/night
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="quantity-hotel">
                            Number of Nights
                          </Label>
                          <Input
                            id="quantity-hotel"
                            type="number"
                            min="1"
                            value={transaction.quantity}
                            onChange={(e) =>
                              handleFormChange(
                                "quantity",
                                parseInt(e.target.value),
                              )
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="payment-method-hotel">
                            Payment Method
                          </Label>
                          <Select
                            value={transaction.paymentMethod}
                            onValueChange={(value) =>
                              handleFormChange("paymentMethod", value)
                            }
                          >
                            <SelectTrigger id="payment-method-hotel">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method.id} value={method.id}>
                                  {method.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="total-amount-hotel">
                            Total Amount
                          </Label>
                          <Input
                            id="total-amount-hotel"
                            value={formatCurrency(transaction.totalAmount)}
                            disabled
                            className="bg-gray-50 font-medium"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="notes-hotel">Notes</Label>
                          <Input
                            id="notes-hotel"
                            value={transaction.notes}
                            onChange={(e) =>
                              handleFormChange("notes", e.target.value)
                            }
                            placeholder="Additional notes (optional)"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 mt-6">
                        <Button type="submit" className="w-full">
                          <Save className="mr-2 h-4 w-4" />
                          Save Transaction
                        </Button>
                        <div className="flex items-center justify-between">
                          <label className="flex items-center space-x-2 text-sm">
                            <input
                              type="checkbox"
                              checked={syncOnSave}
                              onChange={(e) => setSyncOnSave(e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span>Sync to accounting after save</span>
                          </label>
                          <Link
                            to="/integration"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            Go to Integration
                          </Link>
                        </div>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>

                {formSubmitted && (
                  <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
                    Transaction successfully saved!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="w-full bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="border-b pb-3 last:border-0">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{tx.product}</span>
                        <span className="text-sm text-gray-500">{tx.date}</span>
                      </div>
                      <div className="mt-1 text-sm">
                        <div className="flex justify-between">
                          <span>Customer: {tx.customer}</span>
                          <span>Type: {tx.type}</span>
                        </div>
                        <div className="font-medium mt-1">
                          {formatCurrency(tx.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Travel Booking System. All
              rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesTransactionEntry;
