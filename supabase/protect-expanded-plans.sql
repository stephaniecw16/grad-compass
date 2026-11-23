-- Prevent older 25-program previews from dropping newly saved AMS records.
-- Ownership policies and revision conflict checks remain unchanged.
create or replace function public.advance_student_plan_revision() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if old.plan->>'schemaVersion' = '2' and new.plan->>'schemaVersion' is distinct from '2' then
    raise exception using errcode = '22023',
      message = 'This plan uses the expanded AMS catalog. Open the current GradApp (Student) preview before saving; your existing plan is unchanged.';
  end if;
  new.revision := old.revision + 1;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.advance_student_plan_revision() from public, anon, authenticated;
