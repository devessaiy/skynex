drop policy if exists "portfolio managers upload portfolio media" on storage.objects;
drop policy if exists "portfolio managers read portfolio media" on storage.objects;
drop policy if exists "portfolio managers update portfolio media" on storage.objects;
drop policy if exists "portfolio managers delete portfolio media" on storage.objects;
-- delete bucket objects first (via the dashboard/API), then: delete from storage.buckets where id = 'portfolio-media';
drop table if exists public.portfolio_projects;
delete from public.role_permissions where permission_code = 'manage_portfolio';
delete from public.permissions where code = 'manage_portfolio';
