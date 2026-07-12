-- Supabase SQL Schema for TransitOps (Yash's part: Vehicles & Drivers)

-- 1. Custom Users / Roles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Secure profiles table with RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Vehicles Table
CREATE TABLE public.vehicles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_number TEXT UNIQUE NOT NULL,
    name_model TEXT NOT NULL,
    type TEXT NOT NULL,
    max_load_capacity NUMERIC NOT NULL CHECK (max_load_capacity > 0),
    odometer NUMERIC NOT NULL DEFAULT 0,
    acquisition_cost NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('Available', 'On Trip', 'In Shop', 'Retired')) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
-- For hackathon simplicity, we might allow authenticated users to view/edit, but we'll set it to allow all authenticated users for now
CREATE POLICY "Vehicles are viewable by authenticated users" ON public.vehicles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Vehicles can be modified by authenticated users" ON public.vehicles FOR ALL USING (auth.role() = 'authenticated');

-- 3. Drivers Table
CREATE TABLE public.drivers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) NULL, -- Optional link to auth user if driver logs in
    name TEXT NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    license_category TEXT NOT NULL,
    license_expiry_date DATE NOT NULL,
    contact_number TEXT NOT NULL,
    safety_score NUMERIC DEFAULT 100 CHECK (safety_score >= 0 AND safety_score <= 100),
    status TEXT NOT NULL CHECK (status IN ('Available', 'On Trip', 'Off Duty', 'Suspended')) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drivers are viewable by authenticated users" ON public.drivers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Drivers can be modified by authenticated users" ON public.drivers FOR ALL USING (auth.role() = 'authenticated');

-- 4. Trips Table
CREATE TABLE public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trip_id TEXT UNIQUE NOT NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) NULL,
    driver_id UUID REFERENCES public.drivers(id) NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    cargo_weight NUMERIC NOT NULL CHECK (cargo_weight > 0),
    planned_distance NUMERIC NOT NULL CHECK (planned_distance > 0),
    eta TEXT NULL,
    status TEXT NOT NULL CHECK (status IN ('Draft', 'Dispatched', 'Completed', 'Cancelled')) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trips are viewable by authenticated users" ON public.trips FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Trips can be modified by authenticated users" ON public.trips FOR ALL USING (auth.role() = 'authenticated');

-- 5. Maintenance Logs Table
CREATE TABLE public.maintenance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    type TEXT NOT NULL,
    cost NUMERIC NOT NULL DEFAULT 0 CHECK (cost >= 0),
    status TEXT NOT NULL CHECK (status IN ('Active', 'Closed')) DEFAULT 'Active',
    start_date DATE NOT NULL,
    end_date DATE NULL,
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Maintenance are viewable by authenticated users" ON public.maintenance_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Maintenance can be modified by authenticated users" ON public.maintenance_logs FOR ALL USING (auth.role() = 'authenticated');

-- 6. Fuel Logs Table
CREATE TABLE public.fuel_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    liters NUMERIC NOT NULL CHECK (liters > 0),
    cost NUMERIC NOT NULL CHECK (cost >= 0),
    log_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fuel_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fuel logs are viewable by authenticated users" ON public.fuel_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Fuel logs can be modified by authenticated users" ON public.fuel_logs FOR ALL USING (auth.role() = 'authenticated');

-- 7. Expenses Table
CREATE TABLE public.expenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
    trip_id UUID REFERENCES public.trips(id) NULL,
    type TEXT NOT NULL, -- e.g., 'Toll', 'Fine', 'Maintenance', 'Fuel', 'Other'
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    date DATE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Expenses are viewable by authenticated users" ON public.expenses FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Expenses can be modified by authenticated users" ON public.expenses FOR ALL USING (auth.role() = 'authenticated');

