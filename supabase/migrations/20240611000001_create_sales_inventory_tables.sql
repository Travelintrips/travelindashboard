-- Create sales tables
CREATE TABLE IF NOT EXISTS sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  customer_id UUID,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity DECIMAL(15, 2) NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  discount_percent DECIMAL(5, 2) DEFAULT 0,
  tax_percent DECIMAL(5, 2) DEFAULT 0,
  subtotal DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create inventory tables
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  unit TEXT,
  purchase_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
  selling_price DECIMAL(15, 2) NOT NULL DEFAULT 0,
  stock_quantity DECIMAL(15, 2) NOT NULL DEFAULT 0,
  min_stock_level DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT NOT NULL, -- 'purchase', 'sale', 'adjustment', 'transfer'
  product_id UUID NOT NULL REFERENCES products(id),
  quantity DECIMAL(15, 2) NOT NULL,
  unit_price DECIMAL(15, 2),
  reference_id TEXT, -- invoice number, adjustment ID, etc.
  notes TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create triggers for auto-updating stock quantity
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- For inventory transactions
  IF TG_TABLE_NAME = 'inventory_transactions' THEN
    IF NEW.transaction_type = 'purchase' OR NEW.transaction_type = 'adjustment_in' THEN
      UPDATE products SET 
        stock_quantity = stock_quantity + NEW.quantity,
        updated_at = NOW()
      WHERE id = NEW.product_id;
    ELSIF NEW.transaction_type = 'sale' OR NEW.transaction_type = 'adjustment_out' THEN
      UPDATE products SET 
        stock_quantity = stock_quantity - NEW.quantity,
        updated_at = NOW()
      WHERE id = NEW.product_id;
    END IF;
  -- For sales items
  ELSIF TG_TABLE_NAME = 'sales_items' THEN
    UPDATE products SET 
      stock_quantity = stock_quantity - NEW.quantity,
      updated_at = NOW()
    WHERE id = NEW.product_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER inventory_transaction_trigger
AFTER INSERT ON inventory_transactions
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

CREATE TRIGGER sales_item_trigger
AFTER INSERT ON sales_items
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();

-- Enable realtime for all tables
alter publication supabase_realtime add table sales;
alter publication supabase_realtime add table sales_items;
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table inventory_transactions;
