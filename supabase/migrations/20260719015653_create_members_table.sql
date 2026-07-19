/*
# Create members table for valid member IDs

1. New Tables
   - `members`
     - `id` (uuid, primary key)
     - `member_id` (text, unique, not null) - the unique customer/member identifier used at checkout
     - `active` (boolean, default true) - whether the member can place orders
     - `created_at` (timestamptz) - when the member was added

2. Seed Data
   - Insert member ID "Ramonskitest"

3. Security
   - Enable RLS on `members`.
   - Allow anon + authenticated SELECT so the frontend can validate IDs.
   - Allow anon + authenticated INSERT/UPDATE/DELETE for admin management.
*/

CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id text UNIQUE NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_members" ON members;
CREATE POLICY "anon_select_members" ON members FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_members" ON members;
CREATE POLICY "anon_insert_members" ON members FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_members" ON members;
CREATE POLICY "anon_update_members" ON members FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_members" ON members;
CREATE POLICY "anon_delete_members" ON members FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO members (member_id) VALUES ('Ramonskitest')
ON CONFLICT (member_id) DO NOTHING;
