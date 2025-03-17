import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Package,
  Tags,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Transaction {
  id: string;
  date: string;
  customer: string;
  type: "flight" | "hotel";
  amount: number;
  status: "completed" | "pending" | "failed";
  action?: string;
  inventory?: string;
  category?: string;
}

interface TransactionsTableProps {
  transactions?: Transaction[];
  onRowClick?: (transaction: Transaction) => void;
  onExport?: () => void;
  onInventoryClick?: (inventory: string) => void;
  onCategoryClick?: (category: string) => void;
}

const TransactionsTable = ({
  transactions = [
    {
      id: "TX-1234",
      date: "2023-05-15",
      customer: "John Smith",
      type: "flight",
      amount: 459.99,
      status: "completed",
      inventory: "Economy Seat",
      category: "International",
    },
    {
      id: "TX-1235",
      date: "2023-05-14",
      customer: "Sarah Johnson",
      type: "hotel",
      amount: 289.5,
      status: "completed",
      inventory: "Standard Room",
      category: "Business",
    },
    {
      id: "TX-1236",
      date: "2023-05-14",
      customer: "Michael Brown",
      type: "flight",
      amount: 612.75,
      status: "pending",
      inventory: "Business Seat",
      category: "Domestic",
    },
    {
      id: "TX-1237",
      date: "2023-05-13",
      customer: "Emily Davis",
      type: "hotel",
      amount: 345.0,
      status: "completed",
      inventory: "Deluxe Room",
      category: "Leisure",
    },
    {
      id: "TX-1238",
      date: "2023-05-12",
      customer: "Robert Wilson",
      type: "flight",
      amount: 528.25,
      status: "failed",
      inventory: "First Class",
      category: "International",
    },
  ],
  onRowClick = (transaction) => {
    console.log(`Viewing details for transaction ${transaction.id}`);
    // In a real app, this would open a detailed view
  },
  onExport = () => {},
  onInventoryClick = (inventory) => {
    console.log(`Viewing inventory details for ${inventory}`);
  },
  onCategoryClick = (category) => {
    console.log(`Viewing category details for ${category}`);
  },
}: TransactionsTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Type badge color mapping
  const getTypeColor = (type: string) => {
    switch (type) {
      case "flight":
        return "bg-blue-100 text-blue-800";
      case "hotel":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Transaksi Terbaru</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari transaksi..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Ekspor
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <div className="flex items-center">
                  ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Jumlah
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <div className="flex items-center">
                  Inventaris
                  <Package className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Kategori
                  <Tags className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Tindakan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="cursor-pointer"
                  onClick={() => onRowClick(transaction)}
                >
                  <TableCell className="font-medium">
                    {transaction.id}
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getTypeColor(transaction.type)}
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(transaction.status)}
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto font-normal text-blue-600 hover:text-blue-800 hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInventoryClick(transaction.inventory || "");
                      }}
                    >
                      {transaction.inventory || "-"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-auto font-normal text-indigo-600 hover:text-indigo-800 hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCategoryClick(transaction.category || "");
                      }}
                    >
                      {transaction.category || "-"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log(
                            `Viewing details for transaction ${transaction.id}`,
                          );
                        }}
                      >
                        {transaction.action || "Lihat"}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(
                                `Viewing details for transaction ${transaction.id}`,
                              );
                            }}
                          >
                            Lihat detail
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(
                                `Editing transaction ${transaction.id}`,
                              );
                            }}
                          >
                            Edit transaksi
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log(
                                `Deleting transaction ${transaction.id}`,
                              );
                              // Add confirmation dialog in a real app
                            }}
                          >
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center py-6 text-gray-500"
                >
                  Tidak ada transaksi ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={9} className="text-right">
                Menampilkan {filteredTransactions.length} dari{" "}
                {transactions.length} transaksi
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">Halaman 1 dari 1</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Sebelumnya
          </Button>
          <Button variant="outline" size="sm" disabled>
            Berikutnya
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;
