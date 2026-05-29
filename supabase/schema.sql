-- 1. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL, -- Short desc / abstract
    content TEXT NOT NULL, -- Long description
    image_url TEXT NOT NULL,
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
    client TEXT NOT NULL,
    year TEXT NOT NULL,
    link TEXT,
    github_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL, -- Short desc / abstract
    content TEXT NOT NULL, -- Markdown content
    cover_image TEXT NOT NULL,
    read_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'published'
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Hero Section Table (Single Row)
CREATE TABLE IF NOT EXISTS public.hero_section (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    headline_1 TEXT NOT NULL,
    headline_2 TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    role TEXT NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_section ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies for Public Access (Read-Only)
-- Public can view all projects
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.projects FOR SELECT USING (true);

-- Public can view published articles
CREATE POLICY "Public articles are viewable by everyone." 
ON public.articles FOR SELECT USING (status = 'published');

-- Public can view hero section
CREATE POLICY "Public hero section is viewable by everyone." 
ON public.hero_section FOR SELECT USING (true);

-- 6. Create Policies for Authenticated Admin Access (Full Control)
-- Admin can do anything on projects
CREATE POLICY "Admins can insert projects." ON public.projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update projects." ON public.projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete projects." ON public.projects FOR DELETE USING (auth.role() = 'authenticated');

-- Admin can do anything on articles
CREATE POLICY "Admins can insert articles." ON public.articles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update articles." ON public.articles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete articles." ON public.articles FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can select all articles." ON public.articles FOR SELECT USING (auth.role() = 'authenticated'); -- Allow admin to see drafts

-- Admin can do anything on hero section
CREATE POLICY "Admins can insert hero section." ON public.hero_section FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update hero section." ON public.hero_section FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete hero section." ON public.hero_section FOR DELETE USING (auth.role() = 'authenticated');

-- 7. Insert Initial Seed Data for Hero Section
INSERT INTO public.hero_section (headline_1, headline_2, subtitle, role)
VALUES (
    'HAIKAL JIBRAN', 
    'AL-GHIFFARRY', 
    'Building the bridge between bits and atoms.', 
    'IoT Engineer | Fullstack Developer'
);

-- 8. Storage Setup (Assuming bucket is created manually or via this SQL)
-- You must first create a bucket named 'portfolio-media' in Supabase Storage UI.
-- Then run this (if you want to automate bucket creation):
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true);

-- Storage RLS Policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-media');
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-media' AND auth.role() = 'authenticated');

-- 9. Seeder for Admin User (auth.users)
-- Email: admin@ghiffa.dev | Password: password123
INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000', 
    gen_random_uuid(), 
    'authenticated', 
    'authenticated', 
    'admin@ghiffa.dev', 
    crypt('Secret123', gen_salt('bf')), 
    now(), now(), now(), 
    '{"provider":"email","providers":["email"]}', 
    '{}', 
    now(), now(), '', '', '', ''
);

-- 10. Seeder for Projects
INSERT INTO public.projects (title, category, description, content, image_url, tech_stack, client, year, link)
VALUES (
    'Digital Bank Raksa', 
    'PROYEK KOMERSIAL', 
    'Sistem perbankan online untuk penanganan pengaduan nasabah, pengajuan kredit secara digital, serta pembukaan rekening.', 
    'Aplikasi ini dibangun untuk memodernisasi proses perbankan tradisional menjadi sepenuhnya digital. Fitur utamanya mencakup e-KYC, pengajuan kredit otomatis, dan integrasi dengan payment gateway.', 
    'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=2070&auto=format&fit=crop', 
    '["PHP", "LARAVEL", "MYSQL"]'::jsonb, 
    'Bank Raksa Indonesia', 
    '2024', 
    '#'
),
(
    'Smart Home IoT Dashboard', 
    'PROYEK PERSONAL', 
    'Dashboard monitoring untuk perangkat IoT di rumah pintar berbasis React dan MQTT.', 
    'Memungkinkan pengguna mengontrol lampu, suhu, dan memantau kamera keamanan secara real-time dari satu antarmuka terpusat.', 
    'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=2070&auto=format&fit=crop', 
    '["REACT", "NODE.JS", "MQTT"]'::jsonb, 
    'Personal', 
    '2023', 
    '#'
);

-- 11. Seeder for Articles
INSERT INTO public.articles (title, slug, description, content, cover_image, read_time, status, published_at)
VALUES (
    'Memahami React Server Components', 
    'memahami-react-server-components', 
    'Panduan komprehensif tentang bagaimana RSC mengubah cara kita membangun aplikasi web.', 
    'React Server Components (RSC) adalah paradigma baru dalam pengembangan aplikasi React. Berbeda dengan komponen tradisional (Client Components) yang dieksekusi di browser pengguna, RSC dirender sepenuhnya di server.\n\nHal ini membawa beberapa keuntungan signifikan:\n1. **Ukuran Bundle Lebih Kecil**: Dependensi yang digunakan di server tidak perlu dikirim ke client.\n2. **Akses Data Langsung**: Komponen dapat langsung mengakses database tanpa melalui API layer.\n3. **Keamanan Ekstra**: Kunci rahasia API tidak akan pernah terekspos ke client.', 
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=2070&auto=format&fit=crop', 
    '5 Min Read', 
    'published', 
    now()
);

-- ==========================================
-- FULL CMS EXPANSION
-- ==========================================

-- 12. Create About Section Table
CREATE TABLE IF NOT EXISTS public.about_section (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    content TEXT NOT NULL,
    cv_url TEXT
);

-- 13. Create Experiences Table
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    period TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    order_index INT DEFAULT 0
);

-- 14. Create Qualifications Table (Education, Honors, Certifications)
CREATE TABLE IF NOT EXISTS public.qualifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('education', 'honor', 'certification')),
    period TEXT NOT NULL,
    title TEXT NOT NULL,
    institution TEXT NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0
);

-- 15. Create Contact Section Table
CREATE TABLE IF NOT EXISTS public.contact_section (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    availability TEXT NOT NULL,
    display_text TEXT NOT NULL,
    linkedin_url TEXT,
    instagram_url TEXT,
    github_url TEXT,
    phone_number TEXT
);

-- Enable RLS
ALTER TABLE public.about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qualifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_section ENABLE ROW LEVEL SECURITY;

-- Public Access Policies
CREATE POLICY "Public can view about" ON public.about_section FOR SELECT USING (true);
CREATE POLICY "Public can view experiences" ON public.experiences FOR SELECT USING (true);
CREATE POLICY "Public can view qualifications" ON public.qualifications FOR SELECT USING (true);
CREATE POLICY "Public can view contact" ON public.contact_section FOR SELECT USING (true);

-- Admin Access Policies
CREATE POLICY "Admin can full access about" ON public.about_section FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can full access experiences" ON public.experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can full access qualifications" ON public.qualifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can full access contact" ON public.contact_section FOR ALL USING (auth.role() = 'authenticated');

-- Seed Data
INSERT INTO public.about_section (content)
VALUES (
    'Mahasiswa Teknik Informatika Universitas Kuningan dengan fokus mendalam pada rekayasa perangkat lunak, arsitektur sistem, dan pengembangan web modern. Memiliki rekam jejak dalam merancang serta mengimplementasikan aplikasi web komersial maupun platform administrasi digital.&#10;&#10;Memiliki dedikasi tinggi untuk terus mempelajari arsitektur teknologi baru, beradaptasi dengan cepat, serta menghadirkan solusi digital yang bersih, efisien, aman, dan berdampak nyata bagi industri.'
);

INSERT INTO public.experiences (period, role, company, description, order_index)
VALUES 
('OKT 2024 - FEB 2025', 'Web Developer', 'PT. Bengkel Aplikasi Nusantara', 'Mengembangkan modul aplikasi web dinamis sesuai kebutuhan spesifik klien perusahaan. Merancang dan mengoptimalkan API internal serta melakukan pemeliharaan database.', 1),
('MEI 2024 - JUN 2024', 'Web Developer & System Designer', 'LSP-P1 SMKN 2 Kuningan', 'Merancang dan membangun aplikasi manajemen sertifikasi profesi online. Mengintegrasikan alur registrasi asesi, form pengisian asesmen mandiri, dan evaluasi portofolio.', 2),
('OKT 2023 - DES 2023', 'Web Developer Intern', 'PT. BPR Raksa Wacana Agri Purnama', 'Berkontribusi dalam digitalisasi sistem perbankan internal. Membangun fitur penanganan pengaduan nasabah, pengajuan kredit online, dan dasbor kelayakan kredit.', 3);

INSERT INTO public.qualifications (type, period, title, institution, description, order_index)
VALUES 
('education', '2024 - SEKARANG', 'S1 Teknik Informatika', 'Universitas Kuningan', 'Fokus pada struktur data, algoritma tingkat lanjut, rekayasa komputasi, dan riset pengembangan sistem terpadu.', 1),
('education', '2021 - 2024', 'Rekayasa Perangkat Lunak (RPL)', 'SMKN 2 Kuningan', 'Fokus pada dasar analisis sistem, manajemen basis data relasional (RDBMS), dan pemrograman modular.', 2),
('honor', '2025', 'Juara 3 Lomba Web Design IT Festival', 'Fakultas Ilmu Komputer UNIKU', 'Penghargaan atas kualitas estetika UI/UX, arsitektur kode modular, dan optimasi performa web.', 1),
('honor', '2025', 'Juara 1 Business Plan Competition', 'Uniku Business Community', 'Penyusunan rencana bisnis platform "RETHREEE" dengan analisis keberlanjutan ekologis komprehensif.', 2),
('honor', '2024', 'Nilai Tertinggi Pertama Uji Kompetensi', 'SMKN 2 Kuningan', 'Pencapaian akademis dan praktis tertinggi pada evaluasi rekayasa perangkat lunak akhir.', 3),
('certification', 'Okt 2024', 'Junior Web Developer', 'BNSP & Kominfo', NULL, 1),
('certification', 'Ags 2024', 'Vocational School Graduate Academy', 'Kemenkominfo', NULL, 2),
('certification', 'Mei 2024', 'Junior Web Programmer', 'PT. Cakrawala Global Yaksa', NULL, 3);

INSERT INTO public.contact_section (email, availability, display_text, linkedin_url, instagram_url, github_url, phone_number)
VALUES (
    'haikaljibran.dev@gmail.com', 
    'Open for collaboration & freelance', 
    'LET''S TALK.',
    'https://linkedin.com/in/haikal-jibran-al-ghiffarry',
    'https://instagram.com/haikaljibrn__',
    'https://github.com/ghiffa',
    '+6285156958580'
);
