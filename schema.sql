-- This SQL script used to create the database

-- 1. Create an ENUM type for the different event statuses
CREATE TYPE lead_status AS ENUM ('pending', 'approved', 'rescheduled', 'completed', 'cancelled');

-- 2. Create the main events table (now leads)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Client details
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  
  -- Event details
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT NOT NULL,
  
  -- Guest count and extras
  adults_count INTEGER NOT NULL,
  kids_count INTEGER DEFAULT 0,
  desserts_included BOOLEAN DEFAULT false,
  
  -- Additional information
  notes TEXT,
  
  -- Event status (Default: pending)
  status lead_status DEFAULT 'pending' NOT NULL
);

-- 3. Create indexes for fast querying and filtering in the application
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_date ON leads(date);