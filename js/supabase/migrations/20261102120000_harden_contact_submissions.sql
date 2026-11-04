-- Harden the public contact form table (public.contact_submissions).
-- Why: anonymous visitors may INSERT (needed), but nothing capped field sizes, validated the email shape,
-- or slowed floods. Column-level grants already stop anon from setting id/status/created_at - unchanged here.
-- Safe to apply: additive only; the 4 existing rows were checked against every new rule; no data is modified.
-- Rollback: 20261102120000_harden_contact_submissions.rollback.sql

begin;

-- 1) Size and shape limits (also enforced in the browser via maxlength; this is the trusted check).
alter table public.contact_submissions
  add constraint contact_submissions_name_len     check (char_length(name) <= 100),
  add constraint contact_submissions_email_len    check (char_length(email) <= 254),
  add constraint contact_submissions_email_format check (email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]{2,}$'),
  add constraint contact_submissions_message_len  check (char_length(message) <= 5000),
  add constraint contact_submissions_company_len  check (company_name is null or char_length(company_name) <= 150);

create index if not exists contact_submissions_created_at_idx on public.contact_submissions (created_at);

-- 2) Normalise + flood brake. SECURITY DEFINER so it can count rows even though anon has no SELECT.
--    Limits: 3 enquiries per email per hour, 20 enquiries site-wide per minute. Raises 'rate_limited'.
create or replace function public.contact_submissions_guard()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  new.name         := btrim(new.name);
  new.email        := lower(btrim(new.email));
  new.message      := btrim(new.message);
  new.company_name := nullif(btrim(new.company_name), '');

  if (select count(*) from public.contact_submissions
        where lower(email) = new.email and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001', hint = 'per_email';
  end if;

  if (select count(*) from public.contact_submissions
        where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'rate_limited' using errcode = 'P0001', hint = 'global';
  end if;

  return new;
end;
$$;

-- Trigger functions fire without EXECUTE grants; revoke every path so it cannot be called as an RPC.
revoke all on function public.contact_submissions_guard() from public, anon, authenticated;

drop trigger if exists contact_submissions_guard on public.contact_submissions;
create trigger contact_submissions_guard
  before insert on public.contact_submissions
  for each row execute function public.contact_submissions_guard();

commit;
