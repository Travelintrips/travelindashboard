-- Create roles table to mirror the current in-memory roles
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create junction table for roles and permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(role_id, permission_id)
);

-- Create profiles table to store additional user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role_id UUID REFERENCES roles(id),
  status TEXT DEFAULT 'active',
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Insert default permissions
INSERT INTO permissions (name, label) VALUES
('read', 'Baca Data'),
('write', 'Tulis Data'),
('delete', 'Hapus Data'),
('limited_write', 'Tulis Terbatas'),
('limited_delete', 'Hapus Terbatas'),
('manage_users', 'Kelola Pengguna'),
('manage_roles', 'Kelola Peran')
ON CONFLICT (name) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('Admin', 'Akses penuh ke semua fitur sistem'),
('Manajer', 'Akses ke laporan dan manajemen data'),
('Staf', 'Akses terbatas untuk entri data'),
('Tamu', 'Hanya dapat melihat data')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
WITH 
  admin_role AS (SELECT id FROM roles WHERE name = 'Admin'),
  manager_role AS (SELECT id FROM roles WHERE name = 'Manajer'),
  staff_role AS (SELECT id FROM roles WHERE name = 'Staf'),
  guest_role AS (SELECT id FROM roles WHERE name = 'Tamu'),
  read_perm AS (SELECT id FROM permissions WHERE name = 'read'),
  write_perm AS (SELECT id FROM permissions WHERE name = 'write'),
  delete_perm AS (SELECT id FROM permissions WHERE name = 'delete'),
  limited_write_perm AS (SELECT id FROM permissions WHERE name = 'limited_write'),
  limited_delete_perm AS (SELECT id FROM permissions WHERE name = 'limited_delete'),
  manage_users_perm AS (SELECT id FROM permissions WHERE name = 'manage_users'),
  manage_roles_perm AS (SELECT id FROM permissions WHERE name = 'manage_roles')
INSERT INTO role_permissions (role_id, permission_id)
VALUES
  -- Admin permissions
  ((SELECT id FROM admin_role), (SELECT id FROM read_perm)),
  ((SELECT id FROM admin_role), (SELECT id FROM write_perm)),
  ((SELECT id FROM admin_role), (SELECT id FROM delete_perm)),
  ((SELECT id FROM admin_role), (SELECT id FROM manage_users_perm)),
  ((SELECT id FROM admin_role), (SELECT id FROM manage_roles_perm)),
  
  -- Manager permissions
  ((SELECT id FROM manager_role), (SELECT id FROM read_perm)),
  ((SELECT id FROM manager_role), (SELECT id FROM write_perm)),
  ((SELECT id FROM manager_role), (SELECT id FROM limited_delete_perm)),
  
  -- Staff permissions
  ((SELECT id FROM staff_role), (SELECT id FROM read_perm)),
  ((SELECT id FROM staff_role), (SELECT id FROM limited_write_perm)),
  
  -- Guest permissions
  ((SELECT id FROM guest_role), (SELECT id FROM read_perm))
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Enable row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Profiles are viewable by users" ON profiles;
CREATE POLICY "Profiles are viewable by users"
ON profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Roles are viewable by all users" ON roles;
CREATE POLICY "Roles are viewable by all users"
ON roles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Permissions are viewable by all users" ON permissions;
CREATE POLICY "Permissions are viewable by all users"
ON permissions FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Role permissions are viewable by all users" ON role_permissions;
CREATE POLICY "Role permissions are viewable by all users"
ON role_permissions FOR SELECT
USING (true);

-- Enable realtime
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table roles;
alter publication supabase_realtime add table permissions;
alter publication supabase_realtime add table role_permissions;
