-- ==========================================
-- DANGER: This will delete the existing table and ALL its data!
-- Run this only for a fresh setup or when resetting the database.
-- ==========================================

-- 1. Drop existing table and types if they exist
DROP TABLE IF EXISTS leads;
DROP TYPE IF EXISTS lead_status;

-- 2. Create an ENUM type for the different event statuses
CREATE TYPE lead_status AS ENUM ('pending', 'approved', 'rescheduled', 'completed', 'cancelled');

-- 3. Create the main leads table with the updated schema
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Client details
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Event timing
  date DATE NOT NULL,
  time TIME NOT NULL,
  
  -- Event logistics (Replaced single location field)
  city TEXT NOT NULL,
  street TEXT NOT NULL,
  house_number TEXT NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment')),
  floor TEXT, -- Optional: Only relevant for apartments
  
  -- Guest count and food details
  adults_count INTEGER NOT NULL,
  kids_count INTEGER DEFAULT 0,
  serving_style TEXT NOT NULL CHECK (serving_style IN ('buffet', 'center')),
  desserts_included BOOLEAN DEFAULT false,
  
  -- Additional information
  notes TEXT,
  
  -- Event status (Default: pending)
  status lead_status DEFAULT 'pending' NOT NULL
);

-- 4. Create indexes for fast querying and filtering in the application
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_date ON leads(date);



-- policies
-- 1. Enable Row Level Security (Just in case it wasn't explicitly enabled)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows ANYONE (public) to insert new leads
CREATE POLICY "Enable insert for public" 
ON leads 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 3. (Optional but recommended) Create a policy so your admin can read/update/delete
-- If your admin dashboard already works and reads data, you might already have this,
-- but adding it ensures the authenticated chef can do everything.
CREATE POLICY "Enable full access for authenticated users" 
ON leads 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);