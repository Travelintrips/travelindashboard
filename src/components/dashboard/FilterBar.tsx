import React from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DatePickerWithRange from "@/components/ui/date-picker-with-range";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FilterBarProps {
  onFilterChange?: (filters: FilterOptions) => void;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  autoRefresh?: boolean;
}

interface FilterOptions {
  dateRange?: { from: Date; to: Date };
  transactionType?: string;
  status?: string;
}

const FilterBar = ({
  onFilterChange = () => {},
  onSearch = () => {},
  onRefresh = () => {},
  autoRefresh = false,
}: FilterBarProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isAutoRefreshEnabled, setIsAutoRefreshEnabled] =
    React.useState(autoRefresh);

  // Auto-refresh functionality
  React.useEffect(() => {
    let intervalId: number | undefined;

    if (isAutoRefreshEnabled) {
      intervalId = window.setInterval(() => {
        console.log("Auto-refreshing data...");
        onRefresh();
      }, 60000); // Refresh every minute
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoRefreshEnabled, onRefresh]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const toggleAutoRefresh = () => {
    setIsAutoRefreshEnabled(!isAutoRefreshEnabled);
  };

  return (
    <div className="w-full bg-background p-4 border-b border-border flex flex-col sm:flex-row items-center gap-4 justify-between">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <form onSubmit={handleSearch} className="flex w-full sm:w-auto">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Cari transaksi..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="ghost" className="ml-1 sm:ml-2">
            Cari
          </Button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
        <DatePickerWithRange className="w-full sm:w-auto" />

        <div className="flex items-center gap-2">
          <Select
            onValueChange={(value) =>
              onFilterChange({ transactionType: value })
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Jenis Transaksi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="flight">Penerbangan</SelectItem>
              <SelectItem value="hotel">Hotel</SelectItem>
              <SelectItem value="package">Paket</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => onFilterChange({ status: value })}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="completed">Selesai</SelectItem>
              <SelectItem value="pending">Tertunda</SelectItem>
              <SelectItem value="cancelled">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={onRefresh}
                  title="Segarkan data"
                  className="relative"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isAutoRefreshEnabled ? "text-green-500" : ""}`}
                  />
                  {isAutoRefreshEnabled && (
                    <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full"></span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Segarkan data</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isAutoRefreshEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={toggleAutoRefresh}
                  className="gap-1"
                >
                  <Filter className="h-4 w-4" />
                  {isAutoRefreshEnabled ? "Auto On" : "Filter Lainnya"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isAutoRefreshEnabled ? "Nonaktifkan" : "Aktifkan"} penyegaran
                  otomatis
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
