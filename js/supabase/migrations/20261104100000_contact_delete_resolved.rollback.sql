drop policy if exists "authorized staff can delete resolved submissions" on public.contact_submissions;
revoke delete on public.contact_submissions from authenticated;
