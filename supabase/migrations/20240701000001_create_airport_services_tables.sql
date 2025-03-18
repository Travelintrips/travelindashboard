-- Create airport_services table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.airport_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    service_id UUID REFERENCES public.airport_services(id),
    service_name VARCHAR(255) NOT NULL,
    service_category VARCHAR(100) NOT NULL,
    quantity INTEGER DEFAULT 1,
    amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    service_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounting_entries table for order transactions if it doesn't exist
CREATE TABLE IF NOT EXISTS public.order_accounting_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id),
    transaction_id UUID REFERENCES public.transactions(id),
    revenue_account_code VARCHAR(50) NOT NULL,
    receivable_account_code VARCHAR(50) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add revenue account mapping for service categories
CREATE TABLE IF NOT EXISTS public.service_revenue_accounts (
    category VARCHAR(100) PRIMARY KEY,
    account_code VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL
);

-- Insert default revenue account mappings
INSERT INTO public.service_revenue_accounts (category, account_code, account_name)
VALUES
    ('Executive Lounge', '4101', 'Pendapatan Executive Lounge'),
    ('Transportation', '4102', 'Pendapatan Transportation'),
    ('Sapphire Handling', '4103', 'Pendapatan Saphire Handling'),
    ('Porter Service', '4104', 'Pendapatan Porter Service'),
    ('Modem Rental & Sim Card', '4105', 'Pendapatan Modem Rental & Sim Card'),
    ('Sport Center', '4106', 'Pendapatan Sport Center')
ON CONFLICT (category) DO NOTHING;

-- Enable realtime for these tables
alter publication supabase_realtime add table airport_services;
alter publication supabase_realtime add table orders;
alter publication supabase_realtime add table order_accounting_entries;
alter publication supabase_realtime add table service_revenue_accounts;

-- Create function to automatically create accounting entries when an order is created
CREATE OR REPLACE FUNCTION create_order_accounting_entries()
RETURNS TRIGGER AS $$
DECLARE
    v_transaction_id UUID;
    v_revenue_account VARCHAR(50);
    v_receivable_account VARCHAR(50) := '1103'; -- Default receivable account
BEGIN
    -- Get the revenue account code for this service category
    SELECT account_code INTO v_revenue_account
    FROM public.service_revenue_accounts
    WHERE category = NEW.service_category;
    
    -- If no specific revenue account found, use default
    IF v_revenue_account IS NULL THEN
        v_revenue_account := '4100'; -- Default revenue account
    END IF;
    
    -- Create a transaction record
    INSERT INTO public.transactions (
        transaction_id,
        date,
        description,
        reference,
        status
    ) VALUES (
        'ORD-' || NEW.order_number,
        NEW.service_date,
        'Order: ' || NEW.service_name || ' for ' || NEW.customer_name,
        NEW.order_number,
        'Pending'
    ) RETURNING id INTO v_transaction_id;
    
    -- Create the accounting entry
    INSERT INTO public.order_accounting_entries (
        order_id,
        transaction_id,
        revenue_account_code,
        receivable_account_code,
        amount
    ) VALUES (
        NEW.id,
        v_transaction_id,
        v_revenue_account,
        v_receivable_account,
        NEW.amount
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new orders
DROP TRIGGER IF EXISTS trigger_order_accounting_entries ON public.orders;
CREATE TRIGGER trigger_order_accounting_entries
AFTER INSERT ON public.orders
FOR EACH ROW
EXECUTE FUNCTION create_order_accounting_entries();
