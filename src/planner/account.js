import { accountClient, plannerUrl } from './auth.js';
import { openLocalDemo, signUpLocally, signInLocally } from '../workspaces/local-accounts.js';
const form = document.querySelector('#account-form');
const message = document.querySelector('#account-message');
const mode = document.querySelector('#account-mode');
const scope = document.querySelector('#account-scope');
function update() {
  const signup = mode.value === 'signup';
  document.querySelector('#name-field').hidden = !signup;
  form.elements.name.required = signup;
  form.elements.password.autocomplete = signup ? 'new-password' : 'current-password';
  form.elements.password.minLength = signup ? 10 : 1;
  document.querySelector('#account-submit').textContent = signup
    ? 'Create My Free Account'
    : 'Sign In';
  document.querySelector('#local-explanation').hidden = scope.value !== 'local';
}
mode.addEventListener('change', update);
scope.addEventListener('change', update);
if (new URLSearchParams(location.search).get('mode') === 'signin') mode.value = 'signin';
update();
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = document.querySelector('#account-submit');
  button.disabled = true;
  button.textContent = 'Please Wait…';
  message.textContent = '';
  const fields = Object.fromEntries(new FormData(form));
  try {
    const signup = mode.value === 'signup';
    if (scope.value === 'local') {
      if (signup) await signUpLocally({ ...fields, role: 'student' });
      else {
        const user = await signInLocally(fields.email, fields.password);
        if (user.role !== 'student')
          throw Error(
            'This site accepts student planning accounts. Staff review belongs in AppHelper.',
          );
      }
      location.assign(plannerUrl(true));
      return;
    }
    const client = await accountClient();
    const result = signup
      ? await client.auth.signUp({
          email: fields.email,
          password: fields.password,
          options: {
            data: { name: fields.name },
            emailRedirectTo: new URL('index.html', location.href).href,
          },
        })
      : await client.auth.signInWithPassword({ email: fields.email, password: fields.password });
    if (result.error) throw result.error;
    form.elements.password.value = '';
    if (result.data.session) {
      location.assign(plannerUrl());
      return;
    }
    message.textContent =
      'Check your inbox for a confirmation link. If this email already has an account, choose Sign In. Your plan can be saved after you confirm your email.';
  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
    update();
  }
});
document.querySelector('#demo-start').addEventListener('click', async (event) => {
  event.currentTarget.disabled = true;
  try {
    await openLocalDemo('student');
    location.assign(plannerUrl(true));
  } catch (error) {
    message.textContent = error.message;
    event.currentTarget.disabled = false;
  }
});
