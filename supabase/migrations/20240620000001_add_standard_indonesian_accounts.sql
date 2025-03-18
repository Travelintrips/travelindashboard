-- Add parent_code column to accounts table for hierarchical structure
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS parent_code VARCHAR(20) REFERENCES accounts(code) ON DELETE SET NULL;

-- Add standard_code column to identify standard Indonesian account codes
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS standard_code VARCHAR(20);

-- Add account_type column for more detailed categorization
ALTER TABLE accounts ADD COLUMN IF NOT EXISTS account_type VARCHAR(50);

-- Insert standard Indonesian chart of accounts
-- Asset accounts (1-xxxx)
INSERT INTO accounts (code, name, category, standard_code, account_type, is_active) VALUES
('1-0000', 'Aset', 'Aset', '1', 'Header', true),
('1-1000', 'Aset Lancar', 'Aset', '11', 'Header', true),
('1-1100', 'Kas', 'Aset', '111', 'Detail', true),
('1-1200', 'Bank', 'Aset', '112', 'Header', true),
('1-1201', 'Bank BCA', 'Aset', '11201', 'Detail', true),
('1-1202', 'Bank Mandiri', 'Aset', '11202', 'Detail', true),
('1-1300', 'Piutang Usaha', 'Aset', '113', 'Detail', true),
('1-1400', 'Persediaan', 'Aset', '114', 'Detail', true),
('1-1500', 'Biaya Dibayar Dimuka', 'Aset', '115', 'Detail', true),
('1-2000', 'Aset Tetap', 'Aset', '12', 'Header', true),
('1-2100', 'Tanah', 'Aset', '121', 'Detail', true),
('1-2200', 'Bangunan', 'Aset', '122', 'Detail', true),
('1-2300', 'Kendaraan', 'Aset', '123', 'Detail', true),
('1-2400', 'Peralatan Kantor', 'Aset', '124', 'Detail', true),
('1-2500', 'Akumulasi Penyusutan', 'Aset', '125', 'Detail', true)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  standard_code = EXCLUDED.standard_code,
  account_type = EXCLUDED.account_type,
  is_active = EXCLUDED.is_active;

-- Liability accounts (2-xxxx)
INSERT INTO accounts (code, name, category, standard_code, account_type, is_active) VALUES
('2-0000', 'Kewajiban', 'Kewajiban', '2', 'Header', true),
('2-1000', 'Kewajiban Jangka Pendek', 'Kewajiban', '21', 'Header', true),
('2-1100', 'Hutang Usaha', 'Kewajiban', '211', 'Detail', true),
('2-1200', 'Hutang Pajak', 'Kewajiban', '212', 'Detail', true),
('2-1300', 'Pendapatan Diterima Dimuka', 'Kewajiban', '213', 'Detail', true),
('2-2000', 'Kewajiban Jangka Panjang', 'Kewajiban', '22', 'Header', true),
('2-2100', 'Hutang Bank', 'Kewajiban', '221', 'Detail', true)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  standard_code = EXCLUDED.standard_code,
  account_type = EXCLUDED.account_type,
  is_active = EXCLUDED.is_active;

-- Equity accounts (3-xxxx)
INSERT INTO accounts (code, name, category, standard_code, account_type, is_active) VALUES
('3-0000', 'Ekuitas', 'Ekuitas', '3', 'Header', true),
('3-1000', 'Modal Disetor', 'Ekuitas', '31', 'Detail', true),
('3-2000', 'Laba Ditahan', 'Ekuitas', '32', 'Detail', true),
('3-3000', 'Laba Tahun Berjalan', 'Ekuitas', '33', 'Detail', true)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  standard_code = EXCLUDED.standard_code,
  account_type = EXCLUDED.account_type,
  is_active = EXCLUDED.is_active;

-- Revenue accounts (4-xxxx) with sales sub-accounts
INSERT INTO accounts (code, name, category, standard_code, account_type, is_active) VALUES
('4-0000', 'Pendapatan', 'Pendapatan', '4', 'Header', true),
('4-1000', 'Pendapatan Usaha', 'Pendapatan', '41', 'Header', true),
('4-1100', 'Pendapatan Penjualan', 'Pendapatan', '411', 'Header', true),
('4-1110', 'Penjualan Tiket Pesawat', 'Pendapatan', '4111', 'Detail', true),
('4-1120', 'Penjualan Hotel', 'Pendapatan', '4112', 'Detail', true),
('4-1130', 'Penjualan Paket Wisata', 'Pendapatan', '4113', 'Detail', true),
('4-1140', 'Penjualan Transportasi', 'Pendapatan', '4114', 'Detail', true),
('4-1150', 'Penjualan Visa', 'Pendapatan', '4115', 'Detail', true),
('4-1200', 'Pendapatan Komisi', 'Pendapatan', '412', 'Header', true),
('4-1210', 'Komisi Maskapai', 'Pendapatan', '4121', 'Detail', true),
('4-1220', 'Komisi Hotel', 'Pendapatan', '4122', 'Detail', true),
('4-1230', 'Komisi Operator Wisata', 'Pendapatan', '4123', 'Detail', true),
('4-2000', 'Pendapatan Lain-lain', 'Pendapatan', '42', 'Detail', true)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  standard_code = EXCLUDED.standard_code,
  account_type = EXCLUDED.account_type,
  is_active = EXCLUDED.is_active;

-- Expense accounts (5-xxxx)
INSERT INTO accounts (code, name, category, standard_code, account_type, is_active) VALUES
('5-0000', 'Beban', 'Beban', '5', 'Header', true),
('5-1000', 'Beban Operasional', 'Beban', '51', 'Header', true),
('5-1100', 'Beban Gaji', 'Beban', '511', 'Detail', true),
('5-1200', 'Beban Sewa', 'Beban', '512', 'Detail', true),
('5-1300', 'Beban Utilitas', 'Beban', '513', 'Detail', true),
('5-1400', 'Beban Penyusutan', 'Beban', '514', 'Detail', true),
('5-1500', 'Beban Pemasaran', 'Beban', '515', 'Detail', true),
('5-2000', 'Beban Penjualan', 'Beban', '52', 'Header', true),
('5-2100', 'Beban Tiket Pesawat', 'Beban', '521', 'Detail', true),
('5-2200', 'Beban Hotel', 'Beban', '522', 'Detail', true),
('5-2300', 'Beban Paket Wisata', 'Beban', '523', 'Detail', true),
('5-3000', 'Beban Lain-lain', 'Beban', '53', 'Detail', true)
ON CONFLICT (code) DO UPDATE SET 
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  standard_code = EXCLUDED.standard_code,
  account_type = EXCLUDED.account_type,
  is_active = EXCLUDED.is_active;

-- Update parent_code relationships
-- Asset accounts
UPDATE accounts SET parent_code = '1-0000' WHERE code IN ('1-1000', '1-2000');
UPDATE accounts SET parent_code = '1-1000' WHERE code IN ('1-1100', '1-1200', '1-1300', '1-1400', '1-1500');
UPDATE accounts SET parent_code = '1-1200' WHERE code IN ('1-1201', '1-1202');
UPDATE accounts SET parent_code = '1-2000' WHERE code IN ('1-2100', '1-2200', '1-2300', '1-2400', '1-2500');

-- Liability accounts
UPDATE accounts SET parent_code = '2-0000' WHERE code IN ('2-1000', '2-2000');
UPDATE accounts SET parent_code = '2-1000' WHERE code IN ('2-1100', '2-1200', '2-1300');
UPDATE accounts SET parent_code = '2-2000' WHERE code = '2-2100';

-- Equity accounts
UPDATE accounts SET parent_code = '3-0000' WHERE code IN ('3-1000', '3-2000', '3-3000');

-- Revenue accounts
UPDATE accounts SET parent_code = '4-0000' WHERE code IN ('4-1000', '4-2000');
UPDATE accounts SET parent_code = '4-1000' WHERE code IN ('4-1100', '4-1200');
UPDATE accounts SET parent_code = '4-1100' WHERE code IN ('4-1110', '4-1120', '4-1130', '4-1140', '4-1150');
UPDATE accounts SET parent_code = '4-1200' WHERE code IN ('4-1210', '4-1220', '4-1230');

-- Expense accounts
UPDATE accounts SET parent_code = '5-0000' WHERE code IN ('5-1000', '5-2000', '5-3000');
UPDATE accounts SET parent_code = '5-1000' WHERE code IN ('5-1100', '5-1200', '5-1300', '5-1400', '5-1500');
UPDATE accounts SET parent_code = '5-2000' WHERE code IN ('5-2100', '5-2200', '5-2300');

-- Note: accounts table is already in the realtime publication
