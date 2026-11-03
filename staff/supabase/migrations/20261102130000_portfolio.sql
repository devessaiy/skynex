-- Portfolio: data-driven projects, managed by the CEO only.
-- Pattern copied from leadership_members: permission code + has_permission() in RLS + a public image bucket.
-- Additive only: new permission row, new table, new bucket. No existing table or policy is changed.
-- Rollback: 20261102130000_portfolio.rollback.sql

-- 1) Permission: CEO only (other directors do NOT get it automatically).
insert into public.permissions (code, description)
values ('manage_portfolio', 'Create, edit, publish and delete portfolio projects')
on conflict (code) do nothing;
insert into public.role_permissions (role_code, permission_code)
values ('ceo', 'manage_portfolio')
on conflict do nothing;

-- 2) Table
create table public.portfolio_projects (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null check (char_length(btrim(title)) between 1 and 150),
  slug                text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  short_description   text not null check (char_length(btrim(short_description)) between 1 and 300),
  description         text check (description is null or char_length(description) <= 10000),   -- plain text, rendered escaped
  category            text check (category is null or char_length(category) <= 60),
  technologies        text[] not null default '{}' check (cardinality(technologies) <= 20),
  completed_on        date,
  client_name         text check (client_name is null or char_length(client_name) <= 120),     -- only if approved for public disclosure
  live_url            text check (live_url is null or (char_length(live_url) <= 500 and live_url ~* '^https://[^[:space:]]+$')),
  featured_image_path text check (featured_image_path is null or char_length(featured_image_path) <= 300),
  gallery_paths       text[] not null default '{}' check (cardinality(gallery_paths) <= 12),
  is_featured         boolean not null default false,
  status              text not null default 'draft' check (status in ('draft', 'published')),
  display_order       integer not null default 0,
  created_by          uuid default auth.uid(),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index portfolio_projects_public_idx on public.portfolio_projects (status, display_order, completed_on desc);

create trigger portfolio_projects_set_updated_at
  before update on public.portfolio_projects
  for each row execute function public.set_updated_at();

-- 3) Row Level Security
alter table public.portfolio_projects enable row level security;

create policy "public can read published portfolio"
  on public.portfolio_projects for select to anon, authenticated
  using (status = 'published');
create policy "portfolio managers can read all"
  on public.portfolio_projects for select to authenticated
  using (public.has_permission('manage_portfolio'));
create policy "portfolio managers can add"
  on public.portfolio_projects for insert to authenticated
  with check (public.has_permission('manage_portfolio'));
create policy "portfolio managers can edit"
  on public.portfolio_projects for update to authenticated
  using (public.has_permission('manage_portfolio'))
  with check (public.has_permission('manage_portfolio'));
create policy "portfolio managers can delete"
  on public.portfolio_projects for delete to authenticated
  using (public.has_permission('manage_portfolio'));

-- Visitors only ever need to read the public columns (created_by stays private).
revoke all on public.portfolio_projects from anon;
grant select (id, title, slug, short_description, description, category, technologies, completed_on,
              client_name, live_url, featured_image_path, gallery_paths, is_featured, status,
              display_order, created_at, updated_at)
  on public.portfolio_projects to anon;

-- 4) Image bucket: public read (images appear on the public site), 5 MB, images only, CEO-only writes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "portfolio managers upload portfolio media" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-media' and public.has_permission('manage_portfolio'));
create policy "portfolio managers read portfolio media" on storage.objects for select to authenticated
  using (bucket_id = 'portfolio-media' and public.has_permission('manage_portfolio'));
create policy "portfolio managers update portfolio media" on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-media' and public.has_permission('manage_portfolio'))
  with check (bucket_id = 'portfolio-media' and public.has_permission('manage_portfolio'));
create policy "portfolio managers delete portfolio media" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-media' and public.has_permission('manage_portfolio'));
