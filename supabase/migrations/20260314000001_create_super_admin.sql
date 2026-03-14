-- Create Super Admin user in Supabase Auth
-- Run this in the Supabase SQL Editor after the initial schema migration

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  role,
  aud,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'royston.emmanuel@oecs.int',
  crypt('Freire_123', gen_salt('bf')),
  NOW(),
  'authenticated',
  'authenticated',
  '{"provider": "email", "providers": ["email"]}',
  '{"email": "royston.emmanuel@oecs.int"}',
  NOW(),
  NOW(),
  '',
  ''
);

-- Update the auto-created public.users record to SuperAdmin
UPDATE public.users
SET type = 'SuperAdmin'
WHERE email = 'royston.emmanuel@oecs.int';
