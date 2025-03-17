-- Create a function to handle profile creation or update
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Check if a profile already exists for this user
  IF EXISTS (SELECT 1 FROM profiles WHERE id = NEW.id) THEN
    -- Profile exists, do nothing
    RETURN NEW;
  ELSE
    -- Create a new profile with default values
    INSERT INTO profiles (id, full_name, role, status, last_login)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name', 'Tamu', 'active', NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a trigger to automatically create profiles when users are created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
