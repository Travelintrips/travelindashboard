-- Create integration_logs table to track synchronization between modules
CREATE TABLE IF NOT EXISTS integration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT NOT NULL,
  source TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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
    transaction_id, source, action, status, details
  ) VALUES (
    NEW.id, 'inventory', 'auto_post', 'success', 'Transaction automatically posted to accounting'
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error
  INSERT INTO integration_logs (
    transaction_id, source, action, status, details
  ) VALUES (
    NEW.id, 'inventory', 'auto_post', 'error', SQLERRM
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

-- Create API for inventory transactions and general ledger
CREATE OR REPLACE FUNCTION get_inventory_transactions_api()
RETURNS SETOF inventory_transactions AS $$
BEGIN
  RETURN QUERY SELECT * FROM inventory_transactions ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_general_ledger_api(p_start_date DATE, p_end_date DATE, p_account_code TEXT DEFAULT NULL)
RETURNS TABLE (
  transaction_id TEXT,
  transaction_date DATE,
  description TEXT,
  account_code TEXT,
  account_name TEXT,
  debit NUMERIC,
  credit NUMERIC,
  balance NUMERIC
) AS $$
DECLARE
  v_balance NUMERIC := 0;
BEGIN
  RETURN QUERY 
  WITH ledger_entries AS (
    SELECT 
      t.transaction_id,
      t.date AS transaction_date,
      t.description,
      te.account_code,
      te.account_name,
      te.debit,
      te.credit
    FROM transactions t
    JOIN transaction_entries te ON t.id = te.transaction_id
    WHERE t.date BETWEEN p_start_date AND p_end_date
    AND (p_account_code IS NULL OR te.account_code = p_account_code)
    ORDER BY t.date, t.id
  )
  SELECT 
    le.transaction_id,
    le.transaction_date,
    le.description,
    le.account_code,
    le.account_name,
    le.debit,
    le.credit,
    SUM(le.debit - le.credit) OVER (PARTITION BY le.account_code ORDER BY le.transaction_date, le.transaction_id) AS balance
  FROM ledger_entries le;
END;
$$ LANGUAGE plpgsql;

-- Create notification function for sync errors
CREATE OR REPLACE FUNCTION notify_sync_error()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'error' THEN
    -- In a real implementation, this would send an email or notification
    -- For now, just log it
    RAISE NOTICE 'Transaction % failed to post to General Ledger. Please check system logs.', NEW.transaction_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for sync error notifications
DROP TRIGGER IF EXISTS trg_notify_sync_error ON integration_logs;
CREATE TRIGGER trg_notify_sync_error
AFTER INSERT ON integration_logs
FOR EACH ROW
WHEN (NEW.status = 'error')
EXECUTE FUNCTION notify_sync_error();
