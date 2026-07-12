-- Supabase SQL Schema for TransitOps (Vehicles, Drivers, Auth Profiles)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Profiles table extends Supabase auth.users with app roles.
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'Fleet Manager')
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        role = EXCLUDED.role;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Vehicles Table
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_number TEXT UNIQUE NOT NULL,
    name_model TEXT NOT NULL,
    type TEXT NOT NULL,
    max_load_capacity NUMERIC NOT NULL CHECK (max_load_capacity > 0),
    odometer NUMERIC NOT NULL DEFAULT 0 CHECK (odometer >= 0),
    acquisition_cost NUMERIC NOT NULL DEFAULT 0 CHECK (acquisition_cost >= 0),
    status TEXT NOT NULL CHECK (status IN ('Available', 'On Trip', 'In Shop', 'Retired')) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON public.vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_created_at ON public.vehicles(created_at DESC);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Vehicles are viewable by authenticated users" ON public.vehicles;
DROP POLICY IF EXISTS "Vehicles can be modified by authenticated users" ON public.vehicles;
DROP POLICY IF EXISTS "Fleet users can view vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Fleet managers can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Fleet managers can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Fleet managers can delete vehicles" ON public.vehicles;

CREATE POLICY "Fleet users can view vehicles"
ON public.vehicles FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Fleet managers can insert vehicles"
ON public.vehicles FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Fleet Manager'
));

CREATE POLICY "Fleet managers can update vehicles"
ON public.vehicles FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Fleet Manager'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Fleet Manager'
));

CREATE POLICY "Fleet managers can delete vehicles"
ON public.vehicles FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Fleet Manager'
));

-- 3. Drivers Table
CREATE TABLE IF NOT EXISTS public.drivers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    license_category TEXT NOT NULL,
    license_expiry_date DATE NOT NULL,
    contact_number TEXT NOT NULL,
    safety_score NUMERIC DEFAULT 100 CHECK (safety_score >= 0 AND safety_score <= 100),
    status TEXT NOT NULL CHECK (status IN ('Available', 'On Trip', 'Off Duty', 'Suspended')) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON public.drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_license_expiry ON public.drivers(license_expiry_date);
CREATE INDEX IF NOT EXISTS idx_drivers_created_at ON public.drivers(created_at DESC);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Drivers are viewable by authenticated users" ON public.drivers;
DROP POLICY IF EXISTS "Drivers can be modified by authenticated users" ON public.drivers;
DROP POLICY IF EXISTS "Fleet users can view drivers" ON public.drivers;
DROP POLICY IF EXISTS "Fleet managers can insert drivers" ON public.drivers;
DROP POLICY IF EXISTS "Fleet managers can update drivers" ON public.drivers;
DROP POLICY IF EXISTS "Fleet managers can delete drivers" ON public.drivers;

CREATE POLICY "Fleet users can view drivers"
ON public.drivers FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Fleet managers can insert drivers"
ON public.drivers FOR INSERT
WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Fleet Manager'
));

CREATE POLICY "Fleet managers can update drivers"
ON public.drivers FOR UPDATE
USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Fleet Manager'
))
WITH CHECK (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Fleet Manager'
));

CREATE POLICY "Fleet managers can delete drivers"
ON public.drivers FOR DELETE
USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
      AND profiles.role = 'Fleet Manager'
));
