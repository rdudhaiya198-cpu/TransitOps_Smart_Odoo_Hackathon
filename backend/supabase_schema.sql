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
CREATE POLICY "Drivers are viewable by authenticated users" ON public.drivers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Drivers can be modified by authenticated users" ON public.drivers FOR ALL USING (auth.role() = 'authenticated');

-- 4. Trips Table
CREATE TABLE public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE RESTRICT NOT NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE RESTRICT NOT NULL,
    cargo_weight NUMERIC NOT NULL CHECK (cargo_weight > 0),
    status TEXT NOT NULL CHECK (status IN ('Scheduled', 'Dispatched', 'Completed', 'Cancelled')) DEFAULT 'Scheduled',
    start_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    dispatch_time TIMESTAMP WITH TIME ZONE NULL,
    completion_time TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trips are viewable by authenticated users" ON public.trips FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Trips can be modified by authenticated users" ON public.trips FOR ALL USING (auth.role() = 'authenticated');

-- 5. Maintenance Logs Table
CREATE TABLE public.maintenance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NULL,
    cost NUMERIC NOT NULL DEFAULT 0 CHECK (cost >= 0),
    status TEXT NOT NULL CHECK (status IN ('Open', 'Closed')) DEFAULT 'Open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Maintenance logs are viewable by authenticated users" ON public.maintenance_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Maintenance logs can be modified by authenticated users" ON public.maintenance_logs FOR ALL USING (auth.role() = 'authenticated');

-- 6. Fuel Logs Table
CREATE TABLE public.fuel_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE NOT NULL,
    liters NUMERIC NOT NULL CHECK (liters > 0),
    cost NUMERIC NOT NULL CHECK (cost >= 0),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fuel logs are viewable by authenticated users" ON public.fuel_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Fuel logs can be modified by authenticated users" ON public.fuel_logs FOR ALL USING (auth.role() = 'authenticated');

-- 7. Expenses Table
CREATE TABLE public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL NULL,
    driver_id UUID REFERENCES public.drivers(id) ON DELETE SET NULL NULL,
    trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL NULL,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    category TEXT NOT NULL CHECK (category IN ('Fuel', 'Maintenance', 'Toll', 'Food', 'Other')),
    description TEXT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Expenses are viewable by authenticated users" ON public.expenses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Expenses can be modified by authenticated users" ON public.expenses FOR ALL USING (auth.role() = 'authenticated');

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
