-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Auth service can create profiles" ON profiles;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles"
ON profiles
USING (auth.role() = 'service_role');

CREATE POLICY "Auth service can create profiles"
ON profiles FOR INSERT
WITH CHECK (true);

-- Removed the realtime publication line that was causing the error
