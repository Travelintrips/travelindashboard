-- Create user role enum type
CREATE TYPE user_role AS ENUM ('Admin', 'Manajer', 'Staf', 'Tamu');

-- Alter profiles table to use the enum type
ALTER TABLE profiles ADD COLUMN role user_role;

-- Create a function to sync role_id with role enum
CREATE OR REPLACE FUNCTION sync_profile_role()
RETURNS TRIGGER AS $$
BEGIN
  -- When role_id changes, update the role enum
  IF TG_OP = 'UPDATE' AND NEW.role_id IS DISTINCT FROM OLD.role_id THEN
    SELECT name INTO NEW.role FROM roles WHERE id = NEW.role_id;
  END IF;
  
  -- When role enum changes, update the role_id
  IF TG_OP = 'UPDATE' AND NEW.role IS DISTINCT FROM OLD.role THEN
    SELECT id INTO NEW.role_id FROM roles WHERE name = NEW.role::text;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to keep role and role_id in sync
CREATE TRIGGER sync_profile_role_trigger
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION sync_profile_role();

-- Update existing profiles to set the role enum based on role_id
UPDATE profiles p
SET role = r.name::user_role
FROM roles r
WHERE p.role_id = r.id;
