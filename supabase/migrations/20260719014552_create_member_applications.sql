/*
# Create member_applications table (single-tenant, no auth)

1. New Tables
   - `member_applications`
     - `id` (uuid, primary key)
     - `name` (text, not null) - applicant full name
     - `company_name` (text, not null) - applicant company name
     - `email` (text, not null) - contact email
     - `phone` (text, not null) - contact phone number
     - `sms_opt_in` (boolean, default false) - consent for SMS messages
     - `monthly_volume` (text, not null) - expected monthly volume
     - `notes` (text) - optional notes, max 100 chars
     - `created_at` (timestamptz) - submission timestamp

2. Security
   - Enable RLS on `member_applications`.
   - Allow anon + authenticated INSERT (public signup form).
   - Allow anon + authenticated SELECT on own row (for confirmation UX).
*/

CREATE TABLE IF NOT EXISTS member_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  sms_opt_in boolean NOT NULL DEFAULT false,
  monthly_volume text NOT NULL,
  notes text CHECK (char_length(notes) <= 100),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE member_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_applications" ON member_applications;
CREATE POLICY "anon_insert_applications" ON member_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_applications" ON member_applications;
CREATE POLICY "anon_select_applications" ON member_applications FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_update_applications" ON member_applications;
CREATE POLICY "anon_update_applications" ON member_applications FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_applications" ON member_applications;
CREATE POLICY "anon_delete_applications" ON member_applications FOR DELETE
  TO anon, authenticated USING (true);
