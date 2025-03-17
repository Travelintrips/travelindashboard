-- Ensure the roles table has the Admin role
INSERT INTO roles (name, description)
VALUES ('Admin', 'Administrator with full access')
ON CONFLICT (name) DO NOTHING;

-- Update profiles to ensure role_id is set correctly for Admin users
UPDATE profiles
SET role_id = (SELECT id FROM roles WHERE name = 'Admin')
WHERE role = 'Admin' AND (role_id IS NULL OR role_id != (SELECT id FROM roles WHERE name = 'Admin'));

-- Add the role column to the realtime publication
alter publication supabase_realtime add table profiles;
