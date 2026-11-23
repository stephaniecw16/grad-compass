import {
  programs,
  amsCheckedOn,
  amsDirectory,
  catalogCount,
  degreeTrackCount,
} from '../catalog/catalog.js';
import {
  html,
  sourceLink,
  deadlineText,
  programCard,
  comparisonTable,
  programDetails,
} from './catalog-view.js';
import {
  normalizePlan,
  newSaved,
  checklist,
  stages,
  effectiveDeadline,
  daysAway,
  calendarFile,
} from './plan-model.js';
import { activeAccount } from './auth.js';
import { signOutLocally } from '../workspaces/local-accounts.js';
import { loadPlan, writePlan } from './plan-store.js';

const view = document.querySelector('#view');
const dialog = document.querySelector('#program-dialog');
let account = null,
  plan = normalizePlan({}, programs),
  revision = null,
  ready = false,
  storageError = '',
  dirty = false,
  saving = false;
const compared = new Set(); // Public comparison choices do not expose any student's saved list.
const filters = { query: '', area: '', region: '', degree: '', country: '', sort: 'name', page: 1 };
const pageSize = 24;
let toastTimer;
function notify(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 4500);
}
const localKey = () => 'gradapp.student-planner.v1.' + account.user.id;
function route() {
  const key = location.hash.slice(1);
  return ['directory', 'compare', 'saved', 'deadlines', 'profile', 'about'].includes(key)
    ? key
    : 'directory';
}
function signInNotice() {
  return '<div class="empty"><h2>Your Own Planning Space</h2><p>Create a free account to save programs, notes, and deadlines.</p><a class="button primary" href="account.html">Create Free Account</a> <a class="button" href="account.html?mode=signin">Sign In</a></div>';
}
function title(heading, description, actions = '') {
  return `<div class="view-heading"><div><h2>${heading}</h2><p>${description}</p></div>${actions}</div>`;
}
function drawDirectory() {
  const options = (values, selected) =>
    values
      .map((value) => `<option ${selected === value ? 'selected' : ''}>${html(value)}</option>`)
      .join('');
  view.innerHTML =
    title(
      'A Program for Your Next Chapter',
      `Explore all ${catalogCount} AMS listings in the United States and Canada, covering ${degreeTrackCount} listed degree options.`,
    ) +
    `<div class="filters"><label>Search Programs<input id="search" type="search" value="${html(filters.query)}" placeholder="School, department, city, or research area"></label><label>Degree Type<select id="degree" aria-label="Degree Type"><option value="">All Degree Types</option>${options(['Bridge/Postbaccalaureate', 'Masters', 'Doctoral', 'Certificate'], filters.degree)}</select></label><label>Country<select id="country" aria-label="Country"><option value="">All Countries</option>${options(['United States', 'Canada'], filters.country)}</select></label><label>Research Area<select id="area"><option value="">All Areas</option>${options([...new Set(programs.flatMap((p) => p.areas))].sort(), filters.area)}</select></label><label>Region<select id="region"><option value="">All Regions</option>${options([...new Set(programs.map((p) => p.region))].sort(), filters.region)}</select></label><label>Sort By<select id="sort"><option value="name">School Name</option><option value="deadline" ${filters.sort === 'deadline' ? 'selected' : ''}>Published Doctoral Deadline</option></select></label></div><p class="notice">AMS-reported data is separate from university-verified policies. Some listings are incomplete, duplicated or outdated. Open Program Details for field sources, scope and dates.</p><p class="quiet" id="result-count"></p><div id="results" class="grid"></div><nav id="pagination" class="pagination" aria-label="Directory Pages"></nav><p class="quiet">All AMS listing tables checked ${amsCheckedOn}. The original 25 doctoral programs retain their earlier university research dates. Only independently confirmed cycle dates appear automatically in your calendar. ${sourceLink(amsDirectory, 'Browse the AMS Directory')}</p>`;
  drawResults();
}
function drawResults() {
  const query = filters.query.trim().toLowerCase();
  const results = programs
    .filter(
      (p) =>
        (!query ||
          [p.name, p.title, p.city, p.country, p.ams.department, ...p.areas]
            .join(' ')
            .toLowerCase()
            .includes(query)) &&
        (!filters.area || p.areas.includes(filters.area)) &&
        (!filters.region || p.region === filters.region) &&
        (!filters.degree || p.degrees.includes(filters.degree)) &&
        (!filters.country || p.country === filters.country),
    )
    .sort((a, b) =>
      filters.sort === 'deadline'
        ? (a.deadline || '9999').localeCompare(b.deadline || '9999')
        : a.name.localeCompare(b.name) ||
          a.title.localeCompare(b.title) ||
          Number(a.ams.amsId) - Number(b.ams.amsId),
    );
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  filters.page = Math.min(filters.page, pages);
  const start = (filters.page - 1) * pageSize;
  document.querySelector('#result-count').textContent =
    `${results.length} of ${catalogCount} AMS listings · Showing ${results.length ? start + 1 : 0}–${Math.min(start + pageSize, results.length)} · ${compared.size} selected for comparison.`;
  document.querySelector('#results').innerHTML = results.length
    ? results
        .slice(start, start + pageSize)
        .map((p) => programCard(p, !!plan.saved[p.id], compared.has(p.id)))
        .join('')
    : '<p>No matching programs. Try a broader search or another degree type.</p>';
  document.querySelector('#pagination').innerHTML =
    `<button type="button" data-page="${filters.page - 1}" ${filters.page === 1 ? 'disabled' : ''}>Previous Page</button><span>Page ${filters.page} of ${pages}</span><button type="button" data-page="${filters.page + 1}" ${filters.page === pages ? 'disabled' : ''}>Next Page</button>`;
}
function drawComparison() {
  const selected = programs.filter((p) => compared.has(p.id));
  view.innerHTML =
    title(
      'Compare What Matters',
      'Compare sourced facts and uncertainties side by side.',
      '<a class="button" href="#directory">Choose Programs</a>',
    ) +
    (selected.length < 2
      ? '<div class="empty"><h3>Choose Two or More Programs</h3><p>Check Compare on any program cards in the directory.</p><a class="button primary" href="#directory">Explore Programs</a></div>'
      : '<p class="notice">Compare source dates and degree scope. AMS reports are not current university verification. “None” includes optional tests without a recommendation; unknown policies remain Not Verified. Program duration is not a measured graduation average.</p>' +
        comparisonTable(selected));
}
function savedPrograms() {
  return programs.filter((p) => Object.hasOwn(plan.saved, p.id));
}
function legacyEntries() {
  if (!account) return {};
  const key = account.local
    ? 'gradapp.local.' + account.user.id + '.gradapp.real-programs.v2'
    : 'gradapp.real-programs.v2.' + account.user.id;
  try {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    return Object.fromEntries(programs.filter((p) => data?.[p.id]).map((p) => [p.id, data[p.id]]));
  } catch {
    return {};
  }
}
function drawSaved() {
  if (!account) {
    view.innerHTML = signInNotice();
    return;
  }
  const list = savedPrograms();
  view.innerHTML =
    title(
      'Your Saved Programs',
      'A shortlist, a few notes, and a clearer plan. Save changes using the button at the bottom right.',
    ) +
    (Object.keys(legacyEntries()).some((id) => !plan.saved[id])
      ? '<p class="notice">An earlier shortlist exists for this account in this browser. <button type="button" id="import-legacy">Import My Earlier Saved Programs</button> Existing notes and plans will be preserved.</p>'
      : '') +
    (!list.length
      ? '<div class="empty"><h3>Start with a Few Possibilities</h3><p>Save schools from the directory to build your shortlist and checklist.</p><a class="button primary" href="#directory">Find Programs</a></div>'
      : `<form id="saved-form">${list.map((p) => savedCard(p)).join('')}<div class="save-bar"><span id="save-state">All Changes Saved</span><button class="primary" type="submit">Save All Program Changes</button></div></form>`);
}
function savedCard(p) {
  const entry = plan.saved[p.id];
  return `<article class="panel plan-card" id="plan-${p.id}"><div class="card-top"><div><p class="eyebrow">${html(p.city)}</p><h3>${html(p.name)} · ${html(p.title)}</h3></div><button type="button" class="small" data-remove="${p.id}">Remove Program</button></div><p class="quiet">Published: ${html(deadlineText(p))}. ${sourceLink(p.sources[0]?.[1], 'Check Current Requirements')}</p><label>Degree or Program Track<select name="${p.id}.degree"><option value="">Choose a Degree for Planning</option>${p.degrees.map((degree) => `<option ${entry.degree === degree ? 'selected' : ''}>${html(degree)}</option>`).join('')}</select><span class="quiet">University policies and dates may differ by degree. Notes apply to this saved AMS listing.</span></label><div class="form-grid"><label>Planning Stage<select name="${p.id}.stage">${stages.map((stage) => `<option ${entry.stage === stage ? 'selected' : ''}>${html(stage)}</option>`).join('')}</select></label><label>My Planning Deadline<input type="date" name="${p.id}.deadline" value="${html(entry.deadline)}"><span class="quiet">Optional personal override. Published date: ${html(effectiveDeadline(p, { degree: entry.degree }) || 'No Confirmed Date for This Degree')}.</span></label></div><label>Research Notes<textarea name="${p.id}.notes" maxlength="5000" placeholder="Faculty interests, funding questions, what feels like a good fit…">${html(entry.notes)}</textarea></label><h3>My Planning Checklist</h3><div class="tasks">${checklist.map(([id, label]) => `<label class="check"><input type="checkbox" name="${p.id}.task.${id}" ${entry.tasks[id] ? 'checked' : ''}>${label}</label>`).join('')}</div><p class="quiet">${checklist.filter(([id]) => entry.tasks[id]).length} of ${checklist.length} planning steps complete. These are personal reminders; they do not verify submission or receipt.</p><button type="button" class="small" data-details="${p.id}">View Program Research</button></article>`;
}
function deadlineRows() {
  return savedPrograms()
    .map((program) => ({ program, date: effectiveDeadline(program, plan.saved[program.id]) }))
    .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
}
function drawDeadlines() {
  if (!account) {
    view.innerHTML = signInNotice();
    return;
  }
  const rows = deadlineRows();
  view.innerHTML =
    title(
      'A Little More Time to Plan',
      'Published deadlines and your personal overrides, in one place.',
      rows.length ? '<button type="button" id="calendar-export">Download Calendar</button>' : '',
    ) +
    '<p class="notice">Calendar events are all-day planning reminders. Verify the university’s exact time, time zone, and cycle. No automated emails are sent.</p>' +
    (!rows.length
      ? '<div class="empty"><h3>No Deadlines Yet</h3><p>Save a few programs to start your timeline.</p><a class="button" href="#directory">Explore Programs</a></div>'
      : `<div class="panel">${rows
          .map(({ program: p, date }) => {
            const days = daysAway(date);
            return `<div class="calendar-row"><div class="calendar-date ${days !== null && days <= 14 ? 'due-soon' : ''}">${html(date || 'Confirm Date')}</div><div><h3>${html(p.name)} · ${html(p.title)}</h3><p class="quiet">${html(plan.saved[p.id].deadline ? 'Your Personal Planning Date' : date ? 'Published Date for ' + (plan.saved[p.id].degree || 'Selected Degree') : 'No Verified Cycle Date for the Selected Degree')} ${days === null ? '' : days < 0 ? '· Date Passed' : days === 0 ? '· Today' : `· In ${days} Days`}</p>${sourceLink(p.sources[0]?.[1], 'Verify with the University')}</div></div>`;
          })
          .join(
            '',
          )}</div><div class="actions"><a class="button" href="#saved">Edit My Planning Deadlines</a></div>`);
}
function drawProfile() {
  if (!account) {
    view.innerHTML = signInNotice();
    return;
  }
  const p = plan.profile;
  view.innerHTML =
    title(
      'My Planning Profile',
      'Keep the context for your program research. You can update this at any time.',
    ) +
    `<form id="profile-form" class="panel"><label>Your Name<input name="name" value="${html(p.name)}" maxlength="120" autocomplete="name"></label><label>College or University<input name="college" value="${html(p.college)}" maxlength="200" autocomplete="organization"></label><label>Mathematical Interests<textarea name="interests" maxlength="1000" placeholder="Areas you want to explore, questions you want to ask…">${html(p.interests)}</textarea></label><p class="quiet">Signed in as ${html(account.user.email)}. This profile is for planning; application files and academic records are outside this website’s scope.</p><div class="save-bar"><span id="save-state">All Changes Saved</span><button class="primary" type="submit">Save My Profile</button></div></form>`;
}
function drawAbout() {
  view.innerHTML =
    title(
      'Two Projects, Clear Purposes',
      'GradApp helps students plan. AppHelper supports admissions review.',
    ) +
    '<div class="form-grid"><section class="panel"><h3>GradApp · Free for Students</h3><p>Research graduate study across mathematics and related subjects, compare evidence, save notes, and track deadlines. Apply directly through each university.</p></section><section class="panel"><h3>AppHelper · Separate Review Workspace</h3><p>Application importing, faculty collaboration and admissions review belong to the separate AppHelper project. This student site grants no staff access.</p></section></div>' +
    `<section class="panel"><h3>Directory Coverage</h3><p>All ${catalogCount} entries in the ${sourceLink(amsDirectory, 'AMS Graduate Program Directory')} were captured on ${amsCheckedOn}. They advertise ${degreeTrackCount} degree options across master's, doctoral, bridge/postbaccalaureate and certificate study in the United States and Canada. Separate AMS IDs are retained, including duplicate and incomplete listings. Inclusion does not certify that a program is currently admitting students.</p><h3>What Verification Means</h3><p><strong>University Source</strong> identifies a fact checked against a university page, with its date and program scope. <strong>AMS Reported</strong> identifies department-reported directory information, with the listing update time where available. <strong>Not Verified</strong> means there is no independently verified value; it never means zero, no fee waiver, or no GRE requirement.</p><p>The original 25 doctoral programs retain their earlier November 6–13 research; individual fresh checks show November 23. A listing update timestamp is not an enrollment census year. Funding duration is not average time to degree. Tuition is not an application fee. Raw AMS GRE labels can conflict and are not turned into test-specific university requirements.</p><h3>Deadlines and Your Data</h3><p>Only cycle-confirmed dates for the selected degree become automatic calendar events. Annual dates stay undated. Your personal overrides are labeled. Online planning records are private to your account; local preview records stay in this browser. No applications or reminder emails are sent by this site.</p></section>`;
}
function render() {
  const key = route();
  document.querySelectorAll('.tabs a').forEach((a) => {
    if (a.hash === '#' + key) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.querySelector('#hero').hidden = key !== 'directory' || !!location.hash;
  document.querySelector('#compare-count').textContent = compared.size;
  if (!ready) return;
  if (storageError && ['saved', 'profile', 'deadlines'].includes(key)) {
    view.innerHTML =
      '<div class="empty"><h2>Your Plan Could Not Be Loaded</h2><p>' +
      html(storageError) +
      '</p><button type="button" id="reload-plan">Reload and Try Again</button></div>';
    return;
  }
  ({
    directory: drawDirectory,
    compare: drawComparison,
    saved: drawSaved,
    deadlines: drawDeadlines,
    profile: drawProfile,
    about: drawAbout,
  })[key]();
}
async function persist(next) {
  if (!account || storageError) throw Error('Sign in and load your plan before saving.');
  if (saving) throw Error('A save is already in progress. Please wait.');
  saving = true;
  const buttons = [...document.querySelectorAll('button')];
  buttons.forEach((b) => (b.disabled = true));
  try {
    const clean = normalizePlan(next, programs);
    if (account.local) localStorage.setItem(localKey(), JSON.stringify(clean));
    else revision = await writePlan(account.client, account.user.id, clean, revision);
    plan = clean;
    dirty = false;
  } finally {
    saving = false;
    buttons.forEach((b) => (b.disabled = false));
  }
}
function confirmDiscard() {
  return !dirty || confirm('You have unsaved changes. Leave this page and discard them?');
}
view.addEventListener('input', (event) => {
  const id = event.target.id;
  if (id === 'search') {
    filters.query = event.target.value;
    filters.page = 1;
    drawResults();
    return;
  }
  if (event.target.closest('#saved-form,#profile-form')) {
    dirty = true;
    const state = document.querySelector('#save-state');
    if (state) state.textContent = 'Unsaved Changes';
  }
});
view.addEventListener('change', (event) => {
  const id = event.target.id;
  if (['area', 'region', 'sort', 'degree', 'country'].includes(id)) {
    filters[id] = event.target.value;
    filters.page = 1;
    drawResults();
  }
  if (event.target.matches('[data-compare]')) {
    if (event.target.checked) compared.add(event.target.dataset.compare);
    else compared.delete(event.target.dataset.compare);
    document.querySelector('#compare-count').textContent = compared.size;
    drawResults();
    notify(`${compared.size} Programs Selected for Comparison`);
  }
  if (event.target.closest('#saved-form')) {
    dirty = true;
    document.querySelector('#save-state').textContent = 'Unsaved Changes';
  }
});
view.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (saving) return;
  const data = new FormData(event.target),
    next = structuredClone(plan);
  if (event.target.id === 'profile-form') next.profile = Object.fromEntries(data);
  else if (event.target.id === 'saved-form')
    for (const p of savedPrograms())
      next.saved[p.id] = {
        notes: data.get(p.id + '.notes'),
        degree: data.get(p.id + '.degree'),
        stage: data.get(p.id + '.stage'),
        deadline: data.get(p.id + '.deadline'),
        tasks: Object.fromEntries(checklist.map(([id]) => [id, data.has(p.id + '.task.' + id)])),
      };
  else return;
  const button = event.submitter;
  const previous = button.textContent;
  button.textContent = 'Saving…';
  try {
    await persist(next);
    notify('Changes Saved Successfully');
    render();
  } catch (error) {
    notify(error.message);
    document.querySelector('#save-state').textContent = error.message;
  } finally {
    button.textContent = previous;
  }
});
async function actions(event) {
  const button = event.target.closest('button');
  if (!button || saving) return;
  const { details, save, remove, uncompare } = button.dataset;
  if (button.dataset.page) {
    filters.page = Number(button.dataset.page);
    drawResults();
    document.querySelector('#result-count').scrollIntoView({ block: 'start' });
    return;
  }
  try {
    if (details) {
      document.querySelector('#program-details').innerHTML = programDetails(
        programs.find((p) => p.id === details),
      );
      dialog.showModal();
    }
    if (save) {
      if (!account) {
        sessionStorage.setItem('gradapp.planner.pending', save);
        location.assign('account.html');
        return;
      }
      if (plan.saved[save]) {
        notify('This Program Is Already Saved');
        return;
      }
      const next = structuredClone(plan);
      next.saved[save] = newSaved(programs.find((p) => p.id === save));
      await persist(next);
      notify('Program Saved to Your Shortlist');
      render();
    }
    if (remove) {
      if (!confirmDiscard()) return;
      const next = structuredClone(plan);
      delete next.saved[remove];
      await persist(next);
      notify('Program Removed');
      render();
    }
    if (uncompare) {
      compared.delete(uncompare);
      render();
    }
    if (button.id === 'reload-plan') location.reload();
    if (button.id === 'calendar-export') {
      const rows = deadlineRows().filter((row) => row.date);
      if (!rows.length) {
        notify('No Dated Deadlines to Export. Add Personal Dates in Saved Programs.');
        return;
      }
      const url = URL.createObjectURL(
        new Blob([calendarFile(rows)], { type: 'text/calendar;charset=utf-8' }),
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = 'GradApp-Planning-Deadlines.ics';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      notify('Calendar Downloaded');
    }
    if (button.id === 'import-legacy') {
      if (!confirmDiscard()) return;
      const next = structuredClone(plan);
      for (const [id, entry] of Object.entries(legacyEntries()))
        if (!next.saved[id]) next.saved[id] = { ...newSaved(), deadline: entry.deadline || '' };
      await persist(next);
      notify('Earlier Shortlist Imported; Original Records Preserved');
      render();
    }
  } catch (error) {
    notify(error.message);
  }
}
document.addEventListener('click', actions);
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
// Guard navigation and browser close when a visible form has not been saved.
document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || link.target === '_blank' || !dirty) return;
  if (!confirmDiscard()) event.preventDefault();
  else dirty = false;
});
// Hash routes render into one shared pane; move it into view for same-route links too.
document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || link.classList.contains('skip')) return;
  setTimeout(() => view.scrollIntoView({ block: 'start' }), 0);
});
window.addEventListener('beforeunload', (event) => {
  if (dirty || saving) {
    event.preventDefault();
    event.returnValue = '';
  }
});
window.addEventListener('hashchange', () => {
  dirty = false;
  render();
});
async function start() {
  try {
    account = await activeAccount();
    if (account) {
      if (account.local)
        plan = normalizePlan(JSON.parse(localStorage.getItem(localKey()) || '{}'), programs);
      else {
        const row = await loadPlan(account.client, account.user.id);
        revision = row?.revision ?? null;
        plan = normalizePlan(row?.plan, programs);
      }
      if (!plan.profile.name)
        plan.profile.name = account.local
          ? account.user.name
          : account.user.user_metadata?.name || '';
      document.querySelector('#account-links').innerHTML =
        '<a href="#profile">My Profile</a><button type="button" id="sign-out" class="small">Sign Out</button>';
      document.querySelector('#account-status').textContent = account.local
        ? 'Local Preview · Saved in This Browser Only · ' + account.user.email
        : 'Your Private Planning Workspace · Saved Across Devices · ' + account.user.email;
      document.querySelector('#sign-out').addEventListener('click', async () => {
        if (!confirmDiscard()) return;
        try {
          if (account.local) signOutLocally();
          else {
            const { error } = await account.client.auth.signOut();
            if (error) throw error;
          }
          dirty = false;
          location.assign('index.html');
        } catch (error) {
          notify(error.message);
        }
      });
      if (!account.local)
        account.client.auth.onAuthStateChange((_event, session) => {
          if ((session?.user?.id || null) === account.user.id) return;
          document.querySelector('#workspace').replaceChildren();
          dialog.close();
          dirty = false;
          setTimeout(() => location.reload(), 0);
        });
      const pending = sessionStorage.getItem('gradapp.planner.pending');
      if (programs.some((p) => p.id === pending) && !plan.saved[pending]) {
        const next = structuredClone(plan);
        next.saved[pending] = newSaved(programs.find((p) => p.id === pending));
        await persist(next);
        sessionStorage.removeItem('gradapp.planner.pending');
        notify('Your Selected Program Was Saved');
      }
    }
  } catch (error) {
    storageError = error.message;
    document.querySelector('#account-status').textContent =
      error.message + ' You can still browse and compare.';
  }
  ready = true;
  render();
  // Keep first-click targets stable while catalog modules and account state load.
  document.querySelector('.tabs').inert = false;
  document.querySelector('#workspace').setAttribute('aria-busy', 'false');
}
start();
