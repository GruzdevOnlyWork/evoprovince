-- This script helps you set admin privileges for a user
-- Replace 'your-email@example.com' with the actual email address of the user you want to make admin

-- First, check if auth schema is accessible
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID by email
  SELECT id INTO user_id 
  FROM auth.users 
  WHERE email = 'your-email@example.com'; -- Replace with your actual email
  
  IF user_id IS NOT NULL THEN
    -- Update user metadata to set is_admin flag
    UPDATE auth.users 
    SET raw_user_meta_data = 
      COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"is_admin": true}'::jsonb
    WHERE id = user_id;
    
    RAISE NOTICE 'Admin privileges granted to user: %', user_id;
  ELSE
    RAISE NOTICE 'User not found with email: your-email@example.com';
  END IF;
END $$;
