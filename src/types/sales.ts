export interface Sale {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerId?: string;
  date: string;
  totalAmount: number;
  paymentStatus: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: SaleItem[];
}

export interface SaleItem {
  id: string;
  saleId: string;
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  taxPercent?: number;
  subtotal: number;
  createdAt: string;
}

export interface SalesReport {
  date: string;
  totalSales: number;
  totalItems: number;
  sales: Sale[];
}
