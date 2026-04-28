-- Bu kodu Supabase-də "SQL Editor" bölməsində işlədin:

-- 1. menu_data cədvəli üçün RLS-i aktivləşdirin (əgər deyilsə)
ALTER TABLE public.menu_data ENABLE ROW LEVEL SECURITY;

-- 2. HƏR KƏSƏ (müştərilərə) menyunu oxumağa icazə verən qayda (SELECT)
CREATE POLICY "Public can view menus" 
ON public.menu_data 
FOR SELECT 
USING (true);

-- 3. Yalnız sahibinə (adminə) öz menyusunu dəyişməyə icazə verən qayda (INSERT/UPDATE/DELETE)
CREATE POLICY "Users can update their own menu" 
ON public.menu_data 
FOR ALL 
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);
