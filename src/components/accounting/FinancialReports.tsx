import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  Printer,
  BarChart3,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardHeader from "../dashboard/DashboardHeader";
import { Link } from "react-router-dom";

interface FinancialReportsProps {
  userName?: string;
  userAvatar?: string;
}

const FinancialReports = ({
  userName = "Admin User",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
}: FinancialReportsProps) => {
  const [activeTab, setActiveTab] = useState("balance-sheet");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date(),
  });

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  // Financial data from database
  const [balanceSheetData, setBalanceSheetData] = useState<any>(null);
  const [incomeStatementData, setIncomeStatementData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch financial data when date range changes
  useEffect(() => {
    const fetchFinancialData = async () => {
      setLoading(true);
      try {
        if (activeTab === "balance-sheet" || !balanceSheetData) {
          // Fetch balance sheet data
          const { data, error } = await supabase.functions.invoke(
            "supabase-functions-accounting-functions",
            {
              body: {
                action: "getBalanceSheet",
                data: {
                  startDate: dateRange.from.toISOString(),
                  endDate: dateRange.to.toISOString(),
                },
              },
            },
          );

          if (error) throw error;
          setBalanceSheetData(data);
        }

        if (activeTab === "income-statement" || !incomeStatementData) {
          // Fetch income statement data
          const { data, error } = await supabase.functions.invoke(
            "supabase-functions-accounting-functions",
            {
              body: {
                action: "getIncomeStatement",
                data: {
                  startDate: dateRange.from.toISOString(),
                  endDate: dateRange.to.toISOString(),
                },
              },
            },
          );

          if (error) throw error;
          setIncomeStatementData(data);
        }
      } catch (error) {
        console.error("Error fetching financial data:", error);
        // We'll keep the UI as is if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, [activeTab, dateRange]);

  const handleExport = (format: string) => {
    console.log(`Exporting ${activeTab} in ${format} format`);
    alert(
      `Laporan ${activeTab === "balance-sheet" ? "Neraca" : "Laba Rugi"} akan diekspor dalam format ${format}`,
    );
  };

  const handlePrint = () => {
    console.log(`Printing ${activeTab}`);
    alert(
      `Laporan ${activeTab === "balance-sheet" ? "Neraca" : "Laba Rugi"} akan dicetak`,
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Laporan Keuangan"
        userName={userName}
        userAvatar={userAvatar}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Laporan Keuangan</h2>
          <div className="flex gap-2">
            <Link to="/transaction-entry">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                Tambah Transaksi
              </Button>
            </Link>
            <Link to="/general-ledger">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Buku Besar
              </Button>
            </Link>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Periode:</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground",
                  )}
                >
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "PPP")} -{" "}
                        {format(dateRange.to, "PPP")}
                      </>
                    ) : (
                      format(dateRange.from, "PPP")
                    )
                  ) : (
                    <span>Pilih rentang tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={{
                    from: dateRange?.from,
                    to: dateRange?.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("pdf")}>
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("excel")}>
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Cetak
            </Button>
          </div>
        </div>

        {/* Report Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="balance-sheet">Neraca</TabsTrigger>
            <TabsTrigger value="income-statement">
              Laporan Laba Rugi
            </TabsTrigger>
          </TabsList>

          {/* Balance Sheet */}
          <TabsContent value="balance-sheet" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">
                    Neraca Keuangan
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Periode: {format(dateRange.from, "PPP")} -{" "}
                    {format(dateRange.to, "PPP")}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Assets */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-1">
                      ASET
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Aset Lancar</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between">
                            <span>Kas</span>
                            <span>{formatCurrency(5000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bank</span>
                            <span>{formatCurrency(15000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Piutang Usaha</span>
                            <span>{formatCurrency(7500000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Persediaan</span>
                            <span>{formatCurrency(3000000)}</span>
                          </div>
                          <div className="flex justify-between font-medium pt-1 border-t">
                            <span>Total Aset Lancar</span>
                            <span>{formatCurrency(30500000)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Aset Tetap</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between">
                            <span>Peralatan</span>
                            <span>{formatCurrency(10000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Kendaraan</span>
                            <span>{formatCurrency(50000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Bangunan</span>
                            <span>{formatCurrency(100000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Akumulasi Penyusutan</span>
                            <span>({formatCurrency(15000000)})</span>
                          </div>
                          <div className="flex justify-between font-medium pt-1 border-t">
                            <span>Total Aset Tetap</span>
                            <span>{formatCurrency(145000000)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between font-bold pt-2 border-t-2 border-gray-300">
                        <span>TOTAL ASET</span>
                        <span>{formatCurrency(175500000)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Liabilities and Equity */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-1">
                      KEWAJIBAN & EKUITAS
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Kewajiban</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between">
                            <span>Hutang Usaha</span>
                            <span>{formatCurrency(3000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hutang Bank</span>
                            <span>{formatCurrency(20000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hutang Pajak</span>
                            <span>{formatCurrency(2500000)}</span>
                          </div>
                          <div className="flex justify-between font-medium pt-1 border-t">
                            <span>Total Kewajiban</span>
                            <span>{formatCurrency(25500000)}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Ekuitas</h4>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between">
                            <span>Modal Disetor</span>
                            <span>{formatCurrency(100000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Laba Ditahan</span>
                            <span>{formatCurrency(25000000)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Laba Tahun Berjalan</span>
                            <span>{formatCurrency(25000000)}</span>
                          </div>
                          <div className="flex justify-between font-medium pt-1 border-t">
                            <span>Total Ekuitas</span>
                            <span>{formatCurrency(150000000)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between font-bold pt-2 border-t-2 border-gray-300">
                        <span>TOTAL KEWAJIBAN & EKUITAS</span>
                        <span>{formatCurrency(175500000)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Income Statement */}
          <TabsContent value="income-statement" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl font-bold">
                    Laporan Laba Rugi
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Periode: {format(dateRange.from, "PPP")} -{" "}
                    {format(dateRange.to, "PPP")}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Revenue */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-1">
                      PENDAPATAN
                    </h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between">
                        <span>Pendapatan Jasa</span>
                        <span>{formatCurrency(75000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pendapatan Lain-lain</span>
                        <span>{formatCurrency(5000000)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total Pendapatan</span>
                        <span>{formatCurrency(80000000)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expenses */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-1">
                      BEBAN
                    </h3>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between">
                        <span>Beban Gaji</span>
                        <span>{formatCurrency(25000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beban Sewa</span>
                        <span>{formatCurrency(10000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beban Utilitas</span>
                        <span>{formatCurrency(5000000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beban Penyusutan</span>
                        <span>{formatCurrency(2500000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Beban Operasional Lainnya</span>
                        <span>{formatCurrency(7500000)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total Beban</span>
                        <span>{formatCurrency(50000000)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Income */}
                  <div className="pt-2 border-t-2 border-gray-300">
                    <div className="flex justify-between font-bold">
                      <span>LABA SEBELUM PAJAK</span>
                      <span>{formatCurrency(30000000)}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>Beban Pajak (15%)</span>
                      <span>{formatCurrency(4500000)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t-2 border-gray-300">
                      <span>LABA BERSIH</span>
                      <span className="text-green-600">
                        {formatCurrency(25500000)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Sistem Akuntansi Indonesia.
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

export default FinancialReports;
