-- GradApp's student research planner. Independent of legacy admissions records.
-- Reviewed deployment: Pilot development project only, November 22, 2026.
create table public.student_program_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan jsonb not null default '{"profile":{},"saved":{}}'::jsonb,
  revision bigint not null default 1,
  updated_at timestamptz not null default now(),
  constraint planner_object check (jsonb_typeof(plan) = 'object' and octet_length(plan::text) <= 200000)
);
alter table public.student_program_plans enable row level security;
revoke all on public.student_program_plans from anon, authenticated;
grant select on public.student_program_plans to authenticated;
grant insert (user_id, plan) on public.student_program_plans to authenticated;
grant update (plan) on public.student_program_plans to authenticated;
create policy "Read own planning workspace" on public.student_program_plans
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own planning workspace" on public.student_program_plans
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own planning workspace" on public.student_program_plans
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create function public.advance_student_plan_revision() returns trigger
  language plpgsql security invoker set search_path = '' as $$
begin
  new.revision := old.revision + 1;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.advance_student_plan_revision() from public, anon, authenticated;
create trigger student_plan_revision before update on public.student_program_plans
  for each row execute function public.advance_student_plan_revision();
