begin;
drop trigger if exists contact_submissions_guard on public.contact_submissions;
drop function if exists public.contact_submissions_guard();
drop index if exists public.contact_submissions_created_at_idx;
alter table public.contact_submissions
  drop constraint if exists contact_submissions_name_len,
  drop constraint if exists contact_submissions_email_len,
  drop constraint if exists contact_submissions_email_format,
  drop constraint if exists contact_submissions_message_len,
  drop constraint if exists contact_submissions_company_len;
commit;
