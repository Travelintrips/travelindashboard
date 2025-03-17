import {
  Product,
  ProductCategory,
  InventoryTransaction,
  InventoryTransactionType,
  StockMovement,
  InventoryAccountMapping,
  StockAlert,
  InventorySummary,
  CategorySummary,
} from "@/types/inventory";
import { Transaction } from "@/types/accounting";

// Mock data for product categories
let productCategories: ProductCategory[] = [
  {
    id: "cat1",
    name: "Elektronik",
    description: "Produk elektronik dan gadget",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat2",
    name: "Pakaian",
    description: "Berbagai jenis pakaian",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat3",
    name: "Makanan",
    description: "Produk makanan",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat4",
    name: "Minuman",
    description: "Produk minuman",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "cat5",
    name: "Alat Tulis",
    description: "Perlengkapan kantor dan alat tulis",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock data for products
let products: Product[] = [
  {
    id: "P001",
    name: "Laptop Asus",
    categoryId: "cat1",
    categoryName: "Elektronik",
    stockQuantity: 5,
    unitPrice: 9000000,
    costPrice: 8000000,
    supplier: "PT Asus Indonesia",
    reorderLevel: 10,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "P002",
    name: "Kemeja Putih",
    categoryId: "cat2",
    categoryName: "Pakaian",
    stockQuantity: 50,
    unitPrice: 150000,
    costPrice: 100000,
    supplier: "PT Fashion Indonesia",
    reorderLevel: 20,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "P003",
    name: "Mie Instan",
    categoryId: "cat3",
    categoryName: "Makanan",
    stockQuantity: 20,
    unitPrice: 5000,
    costPrice: 4000,
    supplier: "PT Indofood",
    reorderLevel: 50,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "P004",
    name: "Air Mineral",
    categoryId: "cat4",
    categoryName: "Minuman",
    stockQuantity: 15,
    unitPrice: 5000,
    costPrice: 3000,
    supplier: "PT Aqua",
    reorderLevel: 30,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "P005",
    name: "Pulpen",
    categoryId: "cat5",
    categoryName: "Alat Tulis",
    stockQuantity: 100,
    unitPrice: 5000,
    costPrice: 3000,
    supplier: "PT Stationery",
    reorderLevel: 50,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Mock data for inventory transactions
let inventoryTransactions: InventoryTransaction[] = [
  {
    id: "INV-1234",
    transactionId: "INV-1234",
    date: new Date("2023-06-15"),
    productId: "P001",
    productName: "Laptop Asus",
    transactionType: "Purchase",
    quantity: 10,
    unitPrice: 8000000,
    totalAmount: 80000000,
    reference: "PO-12345",
    notes: "Pembelian laptop untuk stok",
    createdBy: "Admin",
    createdAt: new Date(),
    syncedToAccounting: true,
  },
  {
    id: "INV-1235",
    transactionId: "INV-1235",
    date: new Date("2023-06-14"),
    productId: "P002",
    productName: "Kemeja Putih",
    transactionType: "Sale",
    quantity: 5,
    unitPrice: 150000,
    totalAmount: 750000,
    reference: "SO-54321",
    notes: "Penjualan kemeja",
    createdBy: "Admin",
    createdAt: new Date(),
    syncedToAccounting: true,
  },
  {
    id: "INV-1236",
    transactionId: "INV-1236",
    date: new Date("2023-06-14"),
    productId: "P003",
    productName: "Mie Instan",
    transactionType: "Purchase",
    quantity: 100,
    unitPrice: 4000,
    totalAmount: 400000,
    reference: "PO-67890",
    notes: "Pembelian mie instan",
    createdBy: "Admin",
    createdAt: new Date(),
    syncedToAccounting: true,
  },
  {
    id: "INV-1237",
    transactionId: "INV-1237",
    date: new Date("2023-06-13"),
    productId: "P004",
    productName: "Air Mineral",
    transactionType: "Sale",
    quantity: 50,
    unitPrice: 5000,
    totalAmount: 250000,
    reference: "SO-09876",
    notes: "Penjualan air mineral",
    createdBy: "Admin",
    createdAt: new Date(),
    syncedToAccounting: true,
  },
  {
    id: "INV-1238",
    transactionId: "INV-1238",
    date: new Date("2023-06-12"),
    productId: "P005",
    productName: "Pulpen",
    transactionType: "Adjustment",
    quantity: -5,
    unitPrice: 3000,
    totalAmount: -15000,
    reference: "ADJ-12345",
    notes: "Penyesuaian stok pulpen",
    createdBy: "Admin",
    createdAt: new Date(),
    syncedToAccounting: false,
  },
];

// Mock data for stock movements
let stockMovements: StockMovement[] = [
  {
    id: "SM-1234",
    productId: "P001",
    productName: "Laptop Asus",
    date: new Date("2023-06-15"),
    quantity: 10,
    balanceAfter: 15,
    transactionId: "INV-1234",
    transactionType: "Purchase",
    notes: "Pembelian laptop untuk stok",
  },
  {
    id: "SM-1235",
    productId: "P002",
    productName: "Kemeja Putih",
    date: new Date("2023-06-14"),
    quantity: -5,
    balanceAfter: 45,
    transactionId: "INV-1235",
    transactionType: "Sale",
    notes: "Penjualan kemeja",
  },
  {
    id: "SM-1236",
    productId: "P003",
    productName: "Mie Instan",
    date: new Date("2023-06-14"),
    quantity: 100,
    balanceAfter: 120,
    transactionId: "INV-1236",
    transactionType: "Purchase",
    notes: "Pembelian mie instan",
  },
  {
    id: "SM-1237",
    productId: "P004",
    productName: "Air Mineral",
    date: new Date("2023-06-13"),
    quantity: -50,
    balanceAfter: 15,
    transactionId: "INV-1237",
    transactionType: "Sale",
    notes: "Penjualan air mineral",
  },
  {
    id: "SM-1238",
    productId: "P005",
    productName: "Pulpen",
    date: new Date("2023-06-12"),
    quantity: -5,
    balanceAfter: 95,
    transactionId: "INV-1238",
    transactionType: "Adjustment",
    notes: "Penyesuaian stok pulpen",
  },
];

// Default account mappings for inventory transactions
const defaultAccountMappings: InventoryAccountMapping[] = [
  {
    transactionType: "Purchase",
    inventoryAccountCode: "1101", // Persediaan Barang Dagang
    cashAccountCode: "1100", // Kas/Bank
    description: "Pembelian persediaan barang dagang",
  },
  {
    transactionType: "Sale",
    revenueAccountCode: "4101", // Pendapatan Penjualan
    receivableAccountCode: "1100", // Kas/Bank
    costOfGoodsAccountCode: "5101", // Harga Pokok Penjualan
    inventoryAccountCode: "1101", // Persediaan Barang Dagang
    description: "Penjualan barang dagang",
  },
  {
    transactionType: "Adjustment",
    inventoryAccountCode: "1101", // Persediaan Barang Dagang
    adjustmentAccountCode: "5102", // Penyesuaian Persediaan
    description: "Penyesuaian persediaan barang dagang",
  },
];

// Mock storage for pending inventory transactions that need to be synced
let pendingInventoryTransactions: InventoryTransaction[] = [
  inventoryTransactions[4], // The adjustment transaction is not synced
];

// Get all product categories
export const getProductCategories = (): ProductCategory[] => {
  return [...productCategories];
};

// Get a product category by ID
export const getProductCategoryById = (id: string): ProductCategory | undefined => {
  return productCategories.find((category) => category.id === id);
};

// Add a new product category
export const addProductCategory = (category: Omit<ProductCategory, "id" | "createdAt" | "updatedAt">): ProductCategory => {
  const newCategory: ProductCategory = {
    id: `cat${productCategories.length + 1}`,
    ...category,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  productCategories.push(newCategory);
  return newCategory;
};

// Update a product category
export const updateProductCategory = (id: string, category: Partial<ProductCategory>): ProductCategory | undefined => {
  const index = productCategories.findIndex((c) => c.id === id);
  if (index >= 0) {
    productCategories[index] = {
      ...productCategories[index],
      ...category,
      updatedAt: new Date(),
    };
    return productCategories[index];
  }
  return undefined;
};

// Delete a product category
export const deleteProductCategory = (id: string): boolean => {
  const initialLength = productCategories.length;
  productCategories = productCategories.filter((category) => category.id !== id);
  return productCategories.length < initialLength;
};

// Get all products
export const getProducts = (): Product[] => {
  return [...products];
};

// Get a product by ID
export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

// Add a new product
export const addProduct = (product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product => {
  const lastId = products.length > 0 ? products[products.length - 1].id : "P000";
  const numericPart = parseInt(lastId.substring(1));
  const newId = `P${(numericPart + 1).toString().padStart(3, "0")}`;
  
  const newProduct: Product = {
    id: newId,
    ...product,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  products.push(newProduct);
  return newProduct;
};

// Update a product
export const updateProduct = (id: string, product: Partial<Product>): Product | undefined => {
  const index = products.findIndex((p) => p.id === id);
  if (index >= 0) {
    products[index] = {
      ...products[index],
      ...product,
      updatedAt: new Date(),
    };
    return products[index];
  }
  return undefined;
};

// Delete a product
export const deleteProduct = (id: string): boolean => {
  const initialLength = products.length;
  products = products.filter((product) => product.id !== id);
  return products.length < initialLength;
};

// Get all inventory transactions
export const getInventoryTransactions = (): InventoryTransaction[] => {
  return [...inventoryTransactions];
};

// Get an inventory transaction by ID
export const getInventoryTransactionById = (id: string): InventoryTransaction | undefined => {
  return inventoryTransactions.find((transaction) => transaction.id === id);
};

// Add a new inventory transaction
export const addInventoryTransaction = (transaction: Omit<InventoryTransaction, "id" | "transactionId" | "createdAt" | "syncedToAccounting">): InventoryTransaction => {
  const transactionId = `INV-${Math.floor(Math.random() * 10000)}-${Date.now().toString().slice(-6)}`;
  
  const newTransaction: InventoryTransaction = {
    id: transactionId,
    transactionId,
    ...transaction,
    createdAt: new Date(),
    syncedToAccounting: false,
  };
  
  inventoryTransactions.push(newTransaction);
  pendingInventoryTransactions.push(newTransaction);
  
  // Update product stock quantity
  updateProductStock(transaction.productId, transaction.quantity, transaction.transactionType);
  
  // Create stock movement record
  createStockMovement(newTransaction);
  
  return newTransaction;
};

// Update product stock quantity based on transaction
const updateProductStock = (productId: string, quantity: number, transactionType: InventoryTransactionType): void => {
  const productIndex = products.findIndex((p) => p.id === productId);
  if (productIndex >= 0) {
    let stockChange = quantity;
    if (transactionType === "Sale") {
      stockChange = -quantity; // Decrease stock for sales
    }
    
    products[productIndex].stockQuantity += stockChange;
    products[productIndex].updatedAt = new Date();
  }
};

// Create a stock movement record
const createStockMovement = (transaction: InventoryTransaction): StockMovement => {
  const product = getProductById(transaction.productId);
  if (!product) {
    throw new Error(`Product with ID ${transaction.productId} not found`);
  }
  
  let quantityChange = transaction.quantity;
  if (transaction.transactionType === "Sale") {
    quantityChange = -transaction.quantity; // Negative for sales
  } else if (transaction.transactionType === "Adjustment" && transaction.quantity < 0) {
    quantityChange = transaction.quantity; // Can be negative for adjustments
  }
  
  const newStockMovement: StockMovement = {
    id: `SM-${Math.floor(Math.random() * 10000)}`,
    productId: transaction.productId,
    productName: transaction.productName,
    date: transaction.date,
    quantity: quantityChange,
    balanceAfter: product.stockQuantity,
    transactionId: transaction.transactionId,
    transactionType: transaction.transactionType,
    notes: transaction.notes,
  };
  
  stockMovements.push(newStockMovement);
  return newStockMovement;
};

// Get all stock movements
export const getStockMovements = (): StockMovement[] => {
  return [...stockMovements];
};

// Get stock movements for a specific product
export const getStockMovementsByProductId = (productId: string): StockMovement[] => {
  return stockMovements.filter((movement) => movement.productId === productId);
};

// Get low stock alerts
export const getLowStockAlerts = (): StockAlert[] => {
  return products
    .filter((product) => product.stockQuantity < product.reorderLevel)
    .map((product) => ({
      productId: product.id,
      productName: product.name,
      categoryName: product.categoryName,
      currentStock: product.stockQuantity,
      reorderLevel: product.reorderLevel,
      supplier: product.supplier,
    }));
};

// Get inventory summary for dashboard
export const getInventorySummary = (): InventorySummary => {
  const totalStockValue = products.reduce(
    (sum, product) => sum + product.stockQuantity * product.costPrice,
    0
  );
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const transactionsThisMonth = inventoryTransactions.filter(
    (transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    }
  ).length;
  
  return {
    totalProducts: products.length,
    totalCategories: productCategories.length,
    totalStockValue,
    lowStockItems: getLowStockAlerts().length,
    transactionsThisMonth,
  };
};

// Get category summaries
export const getCategorySummaries = (): CategorySummary[] => {
  const categorySummaries: CategorySummary[] = [];
  
  productCategories.forEach((category) => {
    const categoryProducts = products.filter(
      (product) => product.categoryId === category.id
    );
    
    const stockValue = categoryProducts.reduce(
      (sum, product) => sum + product.stockQuantity * product.costPrice,
      0
    );
    
    categorySummaries.push({
      categoryName: category.name,
      productCount: categoryProducts.length,
      stockValue,
    });
  });
  
  return categorySummaries;
};

// Get account mappings
export const getInventoryAccountMappings = (): InventoryAccountMapping[] => {
  return [...defaultAccountMappings];
};

// Update account mappings
export const updateInventoryAccountMapping = (mapping: InventoryAccountMapping): void => {
  const index = defaultAccountMappings.findIndex(
    (m) => m.transactionType === mapping.transactionType
  );
  if (index >= 0) {
    defaultAccountMappings[index] = mapping;
  } else {
    defaultAccountMappings.push(mapping);
  }
};

// Get pending inventory transactions
export const getPendingInventoryTransactions = (): InventoryTransaction[] => {
  return pendingInventoryTransactions.filter((t) => !t.syncedToAccounting);
};

// Convert inventory transaction to accounting transaction
export const convertInventoryToAccounting = (inventoryTransaction: InventoryTransaction): Transaction => {
  // Find the appropriate account mapping
  const mapping = defaultAccountMappings.find(
    (m) => m.transactionType === inventoryTransaction.transactionType
  );
  
  if (!mapping) {
    throw new Error(`No account mapping found for transaction type: ${inventoryTransaction.transactionType}`);
  }
  
  // Generate a transaction ID for accounting
  const accountingTransactionId = `ACC-INV-${inventoryTransaction.id.split("-")[1]}`;
  
  // Create transaction entries based on transaction type
  const entries: any[] = [];
  
  switch (inventoryTransaction.transactionType) {
    case "Purchase":
      // Debit Inventory, Credit Cash/Bank
      entries.push(
        {
          id: `${accountingTransactionId}-1`,
          transactionId: accountingTransactionId,
          accountId: mapping.inventoryAccountCode,
          accountCode: mapping.inventoryAccountCode,
          accountName: "Persediaan Barang Dagang",
          description: `Pembelian ${inventoryTransaction.productName}`,
          debit: inventoryTransaction.totalAmount,
          credit: 0,
        },
        {
          id: `${accountingTransactionId}-2`,
          transactionId: accountingTransactionId,
          accountId: mapping.cashAccountCode,
          accountCode: mapping.cashAccountCode,
          accountName: "Kas/Bank",
          description: `Pembayaran untuk ${inventoryTransaction.productName}`,
          debit: 0,
          credit: inventoryTransaction.totalAmount,
        }
      );
      break;
      
    case "Sale":
      // First entry: Debit Cash/Bank, Credit Revenue
      entries.push(
        {
          id: `${accountingTransactionId}-1`,
          transactionId: accountingTransactionId,
          accountId: mapping.receivableAccountCode,
          accountCode: mapping.receivableAccountCode,
          accountName: "Kas/Bank",
          description: `Penerimaan dari penjualan ${inventoryTransaction.productName}`,
          debit: inventoryTransaction.totalAmount,
          credit: 0,
        },
        {
          id: `${accountingTransactionId}-2`,
          transactionId: accountingTransactionId,
          accountId: mapping.revenueAccountCode,
          accountCode: mapping.revenueAccountCode,
          accountName: "Pendapatan Penjualan",
          description: `Penjualan ${inventoryTransaction.productName}`,
          debit: 0,
          credit: inventoryTransaction.totalAmount,
        }
      );
      
      // Second entry: Debit COGS, Credit Inventory
      // Calculate COGS based on product cost price
      const product = getProductById(inventoryTransaction.productId);
      if (product) {
        const cogsAmount = product.costPrice * inventoryTransaction.quantity;
        
        entries.push(
          {
            id: `${accountingTransactionId}-3`,
            transactionId: accountingTransactionId,
            accountId: mapping.costOfGoodsAccountCode,
            accountCode: mapping.costOfGoodsAccountCode,
            accountName: "Harga Pokok Penjualan",
            description: `HPP untuk ${inventoryTransaction.productName}`,
            debit: cogsAmount,
            credit: 0,
          },
          {
            id: `${accountingTransactionId}-4`,
            transactionId: accountingTransactionId,
            accountId: mapping.inventoryAccountCode,
            accountCode: mapping.inventoryAccountCode,
            accountName: "Persediaan Barang Dagang",
            description: `Pengurangan persediaan untuk ${inventoryTransaction.productName}`,
            debit: 0,
            credit: cogsAmount,
          }
        );
      }
      break;
      
    case "Adjustment":
      // For positive adjustment: Debit Inventory, Credit Adjustment
      // For negative adjustment: Debit Adjustment,