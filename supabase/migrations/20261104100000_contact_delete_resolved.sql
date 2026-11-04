-- Retention rule agreed by management: a contact enquiry is kept until it is marked "resolved";
-- once resolved, any staff member who can manage enquiries may delete it at any time.
-- Unresolved ('new' / 'reviewed') enquiries can NOT be deleted. Visitors (anon) can never delete.
-- Rollback: 20261104100000_contact_delete_resolved.rollback.sql

grant delete on public.contact_submissions to authenticated;

create policy "authorized staff can delete resolved submissions"
  on public.contact_submissions for delete to authenticated
  using (status = 'resolved' and public.has_permission('manage_contact_submissions'));
