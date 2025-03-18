-- Function to update account balance
CREATE OR REPLACE FUNCTION update_account_balance(p_account_id UUID, p_debit DECIMAL, p_credit DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE accounts
  SET balance = balance + (p_debit - p_credit),
      updated_at = NOW()
  WHERE id = p_account_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create a transaction with entries in a single operation
CREATE OR REPLACE FUNCTION create_transaction(transaction_data JSONB, entries_data JSONB)
RETURNS JSONB AS $$
DECLARE
  transaction_id UUID;
  entry_data JSONB;
  result JSONB;
BEGIN
  -- Insert transaction
  INSERT INTO transactions (
    transaction_id,
    date,
    description,
    reference,
    created_by,
    status
  )
  VALUES (
    transaction_data->>'transaction_id',
    (transaction_data->>'date')::TIMESTAMP WITH TIME ZONE,
    transaction_data->>'description',
    transaction_data->>'reference',
    (transaction_data->>'created_by')::UUID,
    COALESCE(transaction_data->>'status', 'Posted')
  )
  RETURNING id INTO transaction_id;
  
  -- Insert entries
  FOR entry_data IN SELECT * FROM jsonb_array_elements(entries_data)
  LOOP
    INSERT INTO transaction_entries (
      transaction_id,
      account_id,
      account_code,
      account_name,
      description,
      debit,
      credit
    )
    VALUES (
      transaction_id,
      (entry_data->>'account_id')::UUID,
      entry_data->>'account_code',
      entry_data->>'account_name',
      entry_data->>'description',
      COALESCE((entry_data->>'debit')::DECIMAL, 0),
      COALESCE((entry_data->>'credit')::DECIMAL, 0)
    );
    
    -- Update account balance
    PERFORM update_account_balance(
      (entry_data->>'account_id')::UUID,
      COALESCE((entry_data->>'debit')::DECIMAL, 0),
      COALESCE((entry_data->>'credit')::DECIMAL, 0)
    );
  END LOOP;
  
  -- Return the transaction ID
  SELECT jsonb_build_object('transaction_id', transaction_id) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql;