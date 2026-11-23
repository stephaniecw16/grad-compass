// A separate row per authenticated student, protected by database ownership policies.
// Revision matching rejects stale tabs rather than silently overwriting another device.
export async function loadPlan(client, userId) {
  const { data, error } = await client
    .from('student_program_plans')
    .select('plan,revision')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw Error('Could not load your saved programs. ' + error.message);
  return data;
}
export async function writePlan(client, userId, plan, revision) {
  const request =
    revision === null
      ? client.from('student_program_plans').insert({ user_id: userId, plan })
      : client
          .from('student_program_plans')
          .update({ plan })
          .eq('user_id', userId)
          .eq('revision', revision);
  const { data, error } = await request.select('revision').maybeSingle();
  if (error || !data)
    throw Error(
      error?.code === '23505' || !error
        ? 'Your plan changed in another tab or device. Reload before saving again; your unsaved text is still here.'
        : 'Save failed. Your changes are still on this page. ' + error.message,
    );
  return data.revision;
}
