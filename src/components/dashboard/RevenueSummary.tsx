import React from "react";
import { Card, CardContent } from "../ui/card";
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";

interface RevenueSummaryProps {
  totalRevenue?: number;
  transactionCount?: number;
  averageValue?: number;
  growthRate?: number;
  onCardClick?: (cardType: string) => void;
}

const RevenueSummary = ({
  totalRevenue = 124350.75,
  transactionCount = 1243,
  averageValue = 100.04,
  growthRate = 12.5,
  onCardClick = (cardType) => console.log(`Clicked ${cardType} card`),
}: RevenueSummaryProps) => {
  return (
    <div className="w-full bg-background p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue Card */}
        <Card
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCardClick("revenue")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Pendapatan
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  ${totalRevenue.toLocaleString()}
                </h3>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-xs font-medium flex items-center ${growthRate >= 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {growthRate >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(growthRate)}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    dari bulan lalu
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Count Card */}
        <Card
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCardClick("transactions")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Transaksi
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {transactionCount.toLocaleString()}
                </h3>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    8.2%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    dari bulan lalu
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Average Value Card */}
        <Card
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCardClick("average")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nilai Rata-rata
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  ${averageValue.toFixed(2)}
                </h3>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium flex items-center text-green-500">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    4.3%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    dari bulan lalu
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Customers Card */}
        <Card
          className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCardClick("customers")}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pelanggan Aktif
                </p>
                <h3 className="text-2xl font-bold mt-1">842</h3>
                <div className="flex items-center mt-2">
                  <span className="text-xs font-medium flex items-center text-red-500">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    1.8%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    dari bulan lalu
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RevenueSummary;
