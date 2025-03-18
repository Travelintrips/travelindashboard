-- Create integration_logs table to track synchronization between modules
CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT NOT NULL,
  integration_type TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Add synced_to_accounting column to inventory_transactions if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'inventory_transactions' 
                AND column_name = 'synced_to_accounting') THEN
    ALTER TABLE inventory_transactions ADD COLUMN synced_to_accounting BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Create function to automatically post inventory transactions to accounting
CREATE OR REPLACE FUNCTION auto_post_inventory_transaction()
RETURNS TRIGGER AS $$
DECLARE
  v_product_record RECORD;
  v_transaction_id TEXT;
  v_debit_account_code TEXT;
  v_credit_account_code TEXT;
  v_description TEXT;
  v_cogs_amount NUMERIC;
BEGIN
  -- Get product information
  SELECT * INTO v_product_record FROM products WHERE id = NEW.product_id;
  
  -- Generate transaction ID for accounting
  v_transaction_id := 'ACC-INV-' || SUBSTRING(NEW.id FROM '[^-]*$');
  
  -- Handle different transaction types
  IF NEW.transaction_type = 'Purchase' THEN
    -- Debit Inventory, Credit Cash/Bank
    v_debit_account_code := '1101'; -- Persediaan Barang Dagang
    v_credit_account_code := '1100'; -- Kas/Bank
    v_description := 'Pembelian ' || v_product_record.name;
    
    -- Insert transaction
    INSERT INTO transactions (
      transaction_id, date, description, status, created_by
    ) VALUES (
      v_transaction_id, 
      NEW.date, 
      v_description, 
      'Posted',
      NEW.created_by
    );
    
    -- Insert transaction entries
    INSERT INTO transaction_entries (
      transaction_id, account_code, account_name, description, debit, credit
    ) VALUES 
    (
      v_transaction_id,
      v_debit_account_code,
      'Persediaan Barang Dagang',
      v_description,
      NEW.quantity * NEW.unit_price,
      0
    ),
    (
      v_transaction_id,
      v_credit_account_code,
      'Kas/Bank',
      'Pembayaran untuk ' || v_product_record.name,
      0,
      NEW.quantity * NEW.unit_price
    );
    
  ELSIF NEW.transaction_type = 'Sale' THEN
    -- First entry: Debit Cash/Bank, Credit Revenue
    INSERT INTO transactions (
      transaction_id, date, description, status, created_by
    ) VALUES (
      v_transaction_id, 
      NEW.date, 
      'Penjualan ' || v_product_record.name, 
      'Posted',
      NEW.created_by
    );
    
    -- Calculate COGS
    v_cogs_amount := v_product_record.cost_price * NEW.quantity;
    
    -- Insert transaction entries for revenue
    INSERT INTO transaction_entries (
      transaction_id, account_code, account_name, description, debit, credit
    ) VALUES 
    (
      v_transaction_id,
      '1100', -- Kas/Bank
      'Kas/Bank',
      'Penerimaan dari penjualan ' || v_product_record.name,
      NEW.quantity * NEW.unit_price,
      0
    ),
    (
      v_transaction_id,
      '4101', -- Pendapatan Penjualan
      'Pendapatan Penjualan',
      'Penjualan ' || v_product_record.name,
      0,
      NEW.quantity * NEW.unit_price
    ),
    (
      v_transaction_id,
      '5101', -- Harga Pokok Penjualan
      'Harga Pokok Penjualan',
      'HPP untuk ' || v_product_record.name,
      v_cogs_amount,
      0
    ),
    (
      v_transaction_id,
      '1101', -- Persediaan Barang Dagang
      'Persediaan Barang Dagang',
      'Pengurangan persediaan untuk ' || v_product_record.name,
      0,
      v_cogs_amount
    );
    
  ELSIF NEW.transaction_type = 'Adjustment' THEN
    -- For adjustments, handle positive and negative separately
    v_description := 'Penyesuaian persediaan ' || v_product_record.name;
    
    INSERT INTO transactions (
      transaction_id, date, description, status, created_by
    ) VALUES (
      v_transaction_id, 
      NEW.date, 
      v_description, 
      'Posted',
      NEW.created_by
    );
    
    IF NEW.quantity > 0 THEN
      -- Positive adjustment: Debit Inventory, Credit Adjustment
      INSERT INTO transaction_entries (
        transaction_id, account_code, account_name, description, debit, credit
      ) VALUES 
      (
        v_transaction_id,
        '1101', -- Persediaan Barang Dagang
        'Persediaan Barang Dagang',
        v_description,
        NEW.quantity * NEW.unit_price,
        0
      ),
      (
        v_transaction_id,
        '5102', -- Penyesuaian Persediaan
        'Penyesuaian Persediaan',
        v_description,
        0,
        NEW.quantity * NEW.unit_price
      );
    ELSE
      -- Negative adjustment: Debit Adjustment, Credit Inventory
      INSERT INTO transaction_entries (
        transaction_id, account_code, account_name, description, debit, credit
      ) VALUES 
      (
        v_transaction_id,
        '5102', -- Penyesuaian Persediaan
        'Penyesuaian Persediaan',
        v_description,
        ABS(NEW.quantity * NEW.unit_price),
        0
      ),
      (
        v_transaction_id,
        '1101', -- Persediaan Barang Dagang
        'Persediaan Barang Dagang',
        v_description,
        0,
        ABS(NEW.quantity * NEW.unit_price)
      );
    END IF;
  END IF;
  
  -- Mark as synced
  NEW.synced_to_accounting := TRUE;
  
  -- Log successful integration
  INSERT INTO integration_logs (
    transaction_id, integration_type, status, created_by
  ) VALUES (
    NEW.id, 'inventory_to_accounting', 'success', NEW.created_by
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error
  INSERT INTO integration_logs (
    transaction_id, integration_type, status, error_message, created_by
  ) VALUES (
    NEW.id, 'inventory_to_accounting', 'error', SQLERRM, NEW.created_by
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-posting inventory transactions
DROP TRIGGER IF EXISTS trg_auto_post_inventory_transaction ON inventory_transactions;
CREATE TRIGGER trg_auto_post_inventory_transaction
AFTER INSERT ON inventory_transactions
FOR EACH ROW
EXECUTE FUNCTION auto_post_inventory_transaction();
