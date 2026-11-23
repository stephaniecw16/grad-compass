const accountPrefix = 'gradapp.local-accounts.v1.';
const sessionKey = accountPrefix + 'session';
const demoAccounts = {
  student: { name: 'Mira Sample', email: 'demo-student@example.invalid', role: 'student' },
  faculty: { name: 'Dr. Avery Example', email: 'demo-faculty@example.invalid', role: 'faculty' },
  admin: { name: 'Dr. Emery Example', email: 'demo-admin@example.invalid', role: 'admin' },
};
const normalizeEmail = (value) =>
  String(value || '')
    .trim()
    .toLowerCase();
const roles = ['student', 'faculty', 'admin'];
const uuidPattern = /^[0-9a-f-]{36}$/;

function readAccount(email) {
  const account = JSON.parse(localStorage.getItem(accountPrefix + email) || 'null');
  return account?.email === email && uuidPattern.test(account.id) && roles.includes(account.role)
    ? account
    : null;
}

function publicAccount({ id, name, email, role, demo }) {
  return { id, name, email, role, demo: demo === true };
}

export function currentLocalAccount() {
  try {
    const email = sessionStorage.getItem(sessionKey);
    const account = email && readAccount(email);
    return account ? publicAccount(account) : null;
  } catch {
    return null;
  }
}

function startSession(account) {
  sessionStorage.setItem(sessionKey, account.email);
  return publicAccount(account);
}

export function signOutLocally() {
  sessionStorage.removeItem(sessionKey);
}

const hex = (bytes) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

async function passwordVerifier(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt),
      iterations: 600000,
      hash: 'SHA-256',
    },
    key,
    256,
  );
  return hex(new Uint8Array(bits));
}

async function createAccount(fields, resumeDemo = false) {
  const save = () => {
    const existing = readAccount(fields.email);
    if (existing) {
      if (resumeDemo && existing.demo === true && existing.role === fields.role)
        return startSession(existing);
      throw Error(
        'An account with this email already exists on this browser. Sign in to continue.',
      );
    }
    const account = { ...fields, id: crypto.randomUUID() };
    localStorage.setItem(accountPrefix + account.email, JSON.stringify(account));
    return startSession(account);
  };
  return navigator.locks ? navigator.locks.request(accountPrefix + fields.email, save) : save();
}

export async function signUpLocally({ name, email, role, password }) {
  name = String(name || '').trim();
  email = normalizeEmail(email);
  if (!name || name.length > 120) throw Error('Enter a name of 120 characters or fewer.');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw Error('Enter a valid email address.');
  if (!roles.includes(role))
    throw Error('Choose Student, Faculty Demo, or Program Administration Demo.');
  if (Object.values(demoAccounts).some((account) => account.email === email))
    throw Error('Use the corresponding demo button for that email address.');
  if (typeof password !== 'string' || password.length < 10 || password.length > 128)
    throw Error('Use a password between 10 and 128 characters.');
  const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)));
  const verifier = await passwordVerifier(password, salt);
  return createAccount({ name, email, role, salt, verifier });
}

export async function signInLocally(email, password) {
  const account = readAccount(normalizeEmail(email));
  if (
    !account?.verifier ||
    typeof password !== 'string' ||
    password.length > 128 ||
    (await passwordVerifier(password, account.salt)) !== account.verifier
  ) {
    throw Error(
      'Email or password does not match a local account. Use a demo button for a fictional account.',
    );
  }
  return startSession(account);
}

export async function openLocalDemo(role) {
  if (!Object.hasOwn(demoAccounts, role)) throw Error('Choose one of the demo accounts.');
  return createAccount({ ...demoAccounts[role], demo: true }, true);
}
