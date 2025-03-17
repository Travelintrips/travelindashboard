import React, { useState } from "react";
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
import { CalendarIcon, Plane, Building, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataEntryFormProps {
  onSubmit?: (data: FlightSale | HotelSale) => void;
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

const generateTransactionId = (type: string) => {
  const prefix = type === "flight" ? "FL" : "HT";
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${randomNum}-${timestamp}`;
};

const DataEntryForm = ({ onSubmit = () => {} }: DataEntryFormProps) => {
  const [activeTab, setActiveTab] = useState<"flight" | "hotel">("flight");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Flight form state
  const [flightForm, setFlightForm] = useState<FlightSale>({
    type: "flight",
    transactionId: generateTransactionId("flight"),
    bookingDate: new Date(),
    departureDate: new Date(),
    airline: "",
    passengerName: "",
    amount: 0,
    paymentStatus: "Pending",
  });

  // Hotel form state
  const [hotelForm, setHotelForm] = useState<HotelSale>({
    type: "hotel",
    transactionId: generateTransactionId("hotel"),
    bookingDate: new Date(),
    checkInDate: new Date(),
    checkOutDate: new Date(),
    hotelName: "",
    guestName: "",
    amount: 0,
    paymentStatus: "Pending",
  });

  const handleFlightFormChange = (field: keyof FlightSale, value: any) => {
    setFlightForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHotelFormChange = (field: keyof HotelSale, value: any) => {
    setHotelForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = activeTab === "flight" ? flightForm : hotelForm;
    onSubmit(formData);

    // Reset form
    if (activeTab === "flight") {
      setFlightForm({
        ...flightForm,
        transactionId: generateTransactionId("flight"),
        airline: "",
        passengerName: "",
        amount: 0,
        paymentStatus: "Pending",
      });
    } else {
      setHotelForm({
        ...hotelForm,
        transactionId: generateTransactionId("hotel"),
        hotelName: "",
        guestName: "",
        amount: 0,
        paymentStatus: "Pending",
      });
    }

    // Show success message
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Tambah Transaksi Baru
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="flight"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "flight" | "hotel")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="flight" className="flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Penjualan Penerbangan
            </TabsTrigger>
            <TabsTrigger value="hotel" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Penjualan Hotel
            </TabsTrigger>
          </TabsList>

          {/* Flight Sales Form */}
          <TabsContent value="flight">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="flight-transaction-id">ID Transaksi</Label>
                  <Input
                    id="flight-transaction-id"
                    value={flightForm.transactionId}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight-booking-date">Tanggal Pemesanan</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !flightForm.bookingDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {flightForm.bookingDate ? (
                          format(flightForm.bookingDate, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={flightForm.bookingDate}
                        onSelect={(date) =>
                          handleFlightFormChange("bookingDate", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight-departure-date">
                    Tanggal Keberangkatan
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !flightForm.departureDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {flightForm.departureDate ? (
                          format(flightForm.departureDate, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={flightForm.departureDate}
                        onSelect={(date) =>
                          handleFlightFormChange("departureDate", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight-airline">Maskapai</Label>
                  <Input
                    id="flight-airline"
                    value={flightForm.airline}
                    onChange={(e) =>
                      handleFlightFormChange("airline", e.target.value)
                    }
                    placeholder="Masukkan nama maskapai"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight-passenger">Nama Penumpang</Label>
                  <Input
                    id="flight-passenger"
                    value={flightForm.passengerName}
                    onChange={(e) =>
                      handleFlightFormChange("passengerName", e.target.value)
                    }
                    placeholder="Masukkan nama penumpang"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight-amount">Jumlah</Label>
                  <Input
                    id="flight-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={flightForm.amount || ""}
                    onChange={(e) =>
                      handleFlightFormChange(
                        "amount",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="Masukkan jumlah"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flight-status">Status Pembayaran</Label>
                  <Select
                    value={flightForm.paymentStatus}
                    onValueChange={(value) =>
                      handleFlightFormChange(
                        "paymentStatus",
                        value as "Paid" | "Pending" | "Refunded",
                      )
                    }
                  >
                    <SelectTrigger id="flight-status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Dibayar</SelectItem>
                      <SelectItem value="Pending">Tertunda</SelectItem>
                      <SelectItem value="Refunded">Dikembalikan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6">
                <Save className="mr-2 h-4 w-4" />
                Simpan Transaksi Penerbangan
              </Button>
            </form>
          </TabsContent>

          {/* Hotel Sales Form */}
          <TabsContent value="hotel">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotel-transaction-id">ID Transaksi</Label>
                  <Input
                    id="hotel-transaction-id"
                    value={hotelForm.transactionId}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-booking-date">Tanggal Pemesanan</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !hotelForm.bookingDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelForm.bookingDate ? (
                          format(hotelForm.bookingDate, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={hotelForm.bookingDate}
                        onSelect={(date) =>
                          handleHotelFormChange("bookingDate", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-checkin-date">Tanggal Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !hotelForm.checkInDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelForm.checkInDate ? (
                          format(hotelForm.checkInDate, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={hotelForm.checkInDate}
                        onSelect={(date) =>
                          handleHotelFormChange("checkInDate", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-checkout-date">Tanggal Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !hotelForm.checkOutDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {hotelForm.checkOutDate ? (
                          format(hotelForm.checkOutDate, "PPP")
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={hotelForm.checkOutDate}
                        onSelect={(date) =>
                          handleHotelFormChange("checkOutDate", date)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-name">Nama Hotel</Label>
                  <Input
                    id="hotel-name"
                    value={hotelForm.hotelName}
                    onChange={(e) =>
                      handleHotelFormChange("hotelName", e.target.value)
                    }
                    placeholder="Masukkan nama hotel"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-guest">Nama Tamu</Label>
                  <Input
                    id="hotel-guest"
                    value={hotelForm.guestName}
                    onChange={(e) =>
                      handleHotelFormChange("guestName", e.target.value)
                    }
                    placeholder="Masukkan nama tamu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-amount">Jumlah</Label>
                  <Input
                    id="hotel-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={hotelForm.amount || ""}
                    onChange={(e) =>
                      handleHotelFormChange(
                        "amount",
                        parseFloat(e.target.value),
                      )
                    }
                    placeholder="Masukkan jumlah"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-status">Status Pembayaran</Label>
                  <Select
                    value={hotelForm.paymentStatus}
                    onValueChange={(value) =>
                      handleHotelFormChange(
                        "paymentStatus",
                        value as "Paid" | "Pending" | "Refunded",
                      )
                    }
                  >
                    <SelectTrigger id="hotel-status">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Dibayar</SelectItem>
                      <SelectItem value="Pending">Tertunda</SelectItem>
                      <SelectItem value="Refunded">Dikembalikan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6">
                <Save className="mr-2 h-4 w-4" />
                Simpan Transaksi Hotel
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {formSubmitted && (
          <div className="mt-4 p-3 bg-green-50 text-green-800 rounded-md border border-green-200">
            Transaksi berhasil disimpan!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataEntryForm;
