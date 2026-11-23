import { createClient } from '../../vendor/supabase/client.mjs';
import { currentLocalAccount } from '../workspaces/local-accounts.js';
let backend;
export async function accountClient() {
  if (!backend)
    backend = (async () => {
      const response = await fetch('./public-config.json', { cache: 'no-store' });
      if (!response.ok)
        throw Error(
          'Online accounts are unavailable. Please try again later or use the clearly labeled local demo.',
        );
      const config = await response.json();
      if (
        !/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl) ||
        !config.supabasePublishableKey?.startsWith('sb_publishable_')
      )
        throw Error('Online accounts have not been configured for this preview.');
      return createClient(config.supabaseUrl, config.supabasePublishableKey, {
        auth: {
          storageKey: 'gradapp.coursework.auth.v1',
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    })();
  return backend;
}
export async function activeAccount() {
  if (new URLSearchParams(location.search).get('local') === '1') {
    const user = currentLocalAccount();
    return user?.role === 'student' ? { user, local: true, client: null } : null;
  }
  const client = await accountClient();
  const { data, error } = await client.auth.getUser();
  if (error && error.name !== 'AuthSessionMissingError')
    throw Error('Could not verify your account. Please sign in again.');
  return data.user ? { user: data.user, client, local: false } : null;
}
export function plannerUrl(local = false, hash = 'saved') {
  return 'index.html' + (local ? '?local=1' : '') + '#' + hash;
}
