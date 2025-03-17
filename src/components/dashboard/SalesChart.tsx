import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SalesDataPoint {
  month: string;
  flights: number;
  hotels: number;
  total: number;
}

interface SalesChartProps {
  data?: SalesDataPoint[];
  title?: string;
  subtitle?: string;
  onDrillDown?: (month: string) => void;
  onFilterByMonth?: (month: string) => void;
}

const defaultData: SalesDataPoint[] = [
  { month: "Jan", flights: 4000, hotels: 2400, total: 6400 },
  { month: "Feb", flights: 3000, hotels: 1398, total: 4398 },
  { month: "Mar", flights: 2000, hotels: 9800, total: 11800 },
  { month: "Apr", flights: 2780, hotels: 3908, total: 6688 },
  { month: "May", flights: 1890, hotels: 4800, total: 6690 },
  { month: "Jun", flights: 2390, hotels: 3800, total: 6190 },
  { month: "Jul", flights: 3490, hotels: 4300, total: 7790 },
  { month: "Aug", flights: 4000, hotels: 2400, total: 6400 },
  { month: "Sep", flights: 3000, hotels: 1398, total: 4398 },
  { month: "Oct", flights: 2000, hotels: 9800, total: 11800 },
  { month: "Nov", flights: 2780, hotels: 3908, total: 6688 },
  { month: "Dec", flights: 1890, hotels: 4800, total: 6690 },
];

const SalesChart = ({
  data = defaultData,
  title = "Ikhtisar Penjualan Bulanan",
  subtitle = "Perbandingan pendapatan pemesanan penerbangan dan hotel",
  onDrillDown = () => {},
  onFilterByMonth = () => {},
}: SalesChartProps) => {
  const [chartType, setChartType] = useState("bar");
  const [timeRange, setTimeRange] = useState("year");

  // Calculate total sales and growth
  const totalSales = data.reduce((sum, item) => sum + item.total, 0);
  const previousPeriodSales = totalSales * 0.85; // Mock previous period data
  const growthRate =
    ((totalSales - previousPeriodSales) / previousPeriodSales) * 100;
  const isPositiveGrowth = growthRate > 0;

  // Handle bar/month click for drill down
  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const month = data.activePayload[0].payload.month;
      onDrillDown(month);
      // Show a visual feedback for the click
      const message = `Melihat detail untuk ${month}`;
      console.log(message);
      alert(`Melihat detail untuk bulan ${month}`);
    }
  };

  // Handle filter by month
  const handleFilterByMonth = (month: string) => {
    onFilterByMonth(month);
    console.log(`Applying filter 'Date Range' for ${month}`);
  };

  // Get current month
  const getCurrentMonth = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentDate = new Date();
    return months[currentDate.getMonth()];
  };

  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            {isPositiveGrowth ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${isPositiveGrowth ? "text-green-500" : "text-red-500"}`}
            >
              {growthRate.toFixed(1)}%
            </span>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Rentang Waktu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Bulan Ini</SelectItem>
              <SelectItem value="quarter">Kuartal Ini</SelectItem>
              <SelectItem value="year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">Semua Penjualan</TabsTrigger>
              <TabsTrigger value="flights">Penerbangan</TabsTrigger>
              <TabsTrigger value="hotels">Hotel</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-8"
                onClick={() => handleFilterByMonth(getCurrentMonth())}
              >
                <Filter className="h-4 w-4" />
                Filter by Month
              </Button>
              <button
                onClick={() => setChartType("bar")}
                className={`p-1 rounded ${chartType === "bar" ? "bg-gray-200" : ""}`}
              >
                <TrendingUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType("line")}
                className={`p-1 rounded ${chartType === "line" ? "bg-gray-200" : ""}`}
              >
                <TrendingUp className="h-4 w-4" />
              </button>
            </div>
          </div>

          <TabsContent value="all" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={data} onClick={handleBarClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="flights"
                      name="Penerbangan"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="hotels"
                      name="Hotel"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={data} onClick={handleBarClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="flights"
                      name="Penerbangan"
                      stroke="#4f46e5"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="hotels"
                      name="Hotel"
                      stroke="#06b6d4"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total"
                      stroke="#10b981"
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="flights" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={data} onClick={handleBarClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="flights"
                      name="Penerbangan"
                      fill="#4f46e5"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={data} onClick={handleBarClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="flights"
                      name="Penerbangan"
                      stroke="#4f46e5"
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="hotels" className="mt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "bar" ? (
                  <BarChart data={data} onClick={handleBarClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="hotels"
                      name="Hotel"
                      fill="#06b6d4"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                ) : (
                  <LineChart data={data} onClick={handleBarClick}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="hotels"
                      name="Hotel"
                      stroke="#06b6d4"
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
