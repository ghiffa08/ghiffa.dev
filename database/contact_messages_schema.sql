-- Contact Messages Schema
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    topic TEXT DEFAULT 'General Inquiry',
    status TEXT DEFAULT 'unread', -- 'unread', 'read', 'replied', 'archived'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.contact_messages OWNER TO postgres;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Public/anonymous users can submit contact messages
DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Policy: Authenticated admin has full access (read, update, delete)
DROP POLICY IF EXISTS "Admin full access contact messages" ON public.contact_messages;
CREATE POLICY "Admin full access contact messages"
ON public.contact_messages
FOR ALL
USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages (status);
