-- Ensure all profiles have a role value
-- This migration adds a default role to any profile that doesn't have one

-- Update any existing profiles with null roles to have the default 'Tamu' role
UPDATE profiles
SET role = 'Tamu'
WHERE role IS NULL;

-- Create or replace the function to ensure profile role is synced
CREATE OR REPLACE FUNCTION public.sync_profile_role()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Ensure role is never null
  IF NEW.role IS NULL THEN
    NEW.role := 'Tamu';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Make sure the trigger exists
DROP TRIGGER IF EXISTS sync_profile_role_trigger ON profiles;
CREATE TRIGGER sync_profile_role_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_role();
