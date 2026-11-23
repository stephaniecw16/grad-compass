import { programs } from '../catalog/catalog.js';
import {
  fellowships,
  filterFellowships,
  fundingCheckedOn,
  deadlineState,
} from '../catalog/fellowships.js';
import {
  writingFor,
  writingStatus,
  writingResearch,
  writingInvestigations,
  writingCheckedOn,
} from '../catalog/application-writing.js';
import { html, sourceLink } from './markup.js';

const fundingFilters = { query: '', field: '', stage: '', location: '' };
const writingFilters = { query: '', degree: '', status: '', saved: false, page: 1, programId: '' };
const pageSize = 12;
const options = (values, selected) =>
  values.map((v) => `<option ${v === selected ? 'selected' : ''}>${html(v)}</option>`).join('');
const heading = (title, description) =>
  `<div class="view-heading"><div><h2>${title}</h2><p>${description}</p></div></div>`;
const bullets = (items) => `<ul>${items.map((i) => `<li>${html(i)}</li>`).join('')}</ul>`;
export const writingCoverage = new Set(writingResearch.flatMap((r) => r.programIds)).size;

export function fundingCard(f) {
  return `<article class="panel funding-card" data-fellowship="${f.id}"><p class="eyebrow">${html(f.sponsor)}</p><h3>${html(f.name)}</h3><div class="tags">${f.fields.map((field) => `<span>${html(field)}</span>`).join('')}</div><p class="quiet">${html(f.location)} · ${html(f.cycle)}</p><div class="research-columns"><section><h4>Who Can Apply</h4>${bullets(f.eligibility)}<p><strong>Support:</strong> ${html(f.award)}</p></section><section><h4>What to Prepare</h4>${bullets(f.requirements)}</section></div><section class="research-dates"><h4>Dates and Application Route</h4>${f.deadlines.map((d) => `<p><span class="evidence-badge ${deadlineState(d.date) === 'Deadline Passed' ? 'unverified' : 'university'}">${deadlineState(d.date)}</span> <strong>${html(d.date)}</strong> · ${html(d.label)}</p>`).join('')}<p>${html(f.timing)}</p></section><p class="quiet">Official sources checked ${fundingCheckedOn}. Summaries are not an eligibility determination.</p><div class="actions">${f.sources.map(([label, url]) => sourceLink(url, label)).join('')}</div></article>`;
}
export function drawFunding(view) {
  view.innerHTML =
    heading(
      'Scholarships and Fellowships',
      'Funding for mathematics, applied mathematics, data science, statistics, and computer science.',
    ) +
    `<p class="notice">Browse without an account. Check citizenship, study stage, research fit and nomination rules with each sponsor. Closed deadlines stay labeled; dates are never carried into another cycle. Applications are completed on the sponsor’s website.</p><div class="filters research-filters"><label>Search Funding<input id="funding-query" type="search" value="${html(fundingFilters.query)}" placeholder="NSF, CSGF, research proposal…"></label><label>Subject<select id="funding-field"><option value="">All Five Subjects</option>${options(['Mathematics', 'Applied Mathematics', 'Data Science', 'Statistics', 'Computer Science'], fundingFilters.field)}</select></label><label>Study Stage<select id="funding-stage"><option value="">All Stages</option>${options(['Entering Graduate Study', 'Early Graduate Study', 'Continuing PhD'], fundingFilters.stage)}</select></label><label>Study Location<select id="funding-location"><option value="">All Locations</option>${options([...new Set(fellowships.map((f) => f.location))], fundingFilters.location)}</select></label></div><p id="funding-count" class="quiet" role="status"></p><div id="funding-results" class="research-list"></div>`;
  drawFundingResults(view);
}
function drawFundingResults(view) {
  const list = filterFellowships(fundingFilters);
  view.querySelector('#funding-count').textContent =
    `${list.length} of ${fellowships.length} researched opportunities · Official sources checked ${fundingCheckedOn}. Topic filters do not determine personal eligibility.`;
  view.querySelector('#funding-results').innerHTML = list.length
    ? list.map(fundingCard).join('')
    : '<div class="empty"><h3>No Matching Funding</h3><p>Try another subject, stage, or search term.</p></div>';
}
function statement(item) {
  return `<section class="writing-item"><h4>${html(item.title)}</h4><p class="quiet">${html(item.requirement)}</p><p>${html(item.summary)}</p><p><strong>Length:</strong> ${html(item.length || 'Not Published / Not Verified — check the current portal.')}</p></section>`;
}
export function writingSummary(program, degree = '') {
  const entries = writingFor(program, degree),
    investigation = writingInvestigations[program.id];
  if (!entries.length)
    return `<section class="writing-summary"><h3>Statements and Supplemental Questions</h3><span class="evidence-badge unverified">Not Verified${degree ? ' for ' + html(degree) : ''}</span><p>${html(investigation?.note || 'A complete public statement prompt, length limit, and supplemental-question set have not been verified for this listing. Check the selected degree in the current application portal.')}</p>${investigation ? `<p class="quiet">Research attempted ${html(investigation.checkedOn)}. ${sourceLink(investigation.source, 'Page Investigated')}</p>` : sourceLink(program.officialUrl, 'Check the Program Website')}</section>`;
  return `<section class="writing-summary"><h3>Statements and Supplemental Questions</h3>${entries.map((e) => `<article class="writing-entry"><span class="evidence-badge university">Published Guidance · ${html(e.degrees.join(' / '))}</span><p class="quiet">${html(e.scope)} · ${html(e.cycle)} · Checked ${html(e.checkedOn)}</p><p class="quiet">Paraphrased prompt summaries; follow the official wording when applying.</p>${e.statements.map(statement).join('')}<h4>Additional Questions and Materials</h4>${e.supplementals.map(statement).join('')}<p class="notice">${html(e.supplementalStatus)}</p><div class="actions">${sourceLink(e.source, 'Official Writing Guidance')}${(e.additionalSources || []).map(([label, url]) => sourceLink(url, label)).join('')}</div></article>`).join('')}</section>`;
}
export function drawWriting(view, saved = {}) {
  view.innerHTML =
    heading(
      'Application Requirements',
      'Research statements and supplemental questions before applying directly to a university.',
    ) +
    `<p class="notice">All ${programs.length} AMS listings are searchable here. Published writing guidance currently covers ${writingCoverage} listings, sometimes only one degree. Other requirements remain Not Verified. A public checklist is not proof that the application has no other questions. Check your exact degree, concentration and entry year.</p><div class="filters research-filters"><label>Search Application Requirements<input id="writing-query" type="search" value="${html(writingFilters.query)}" placeholder="School, department, or prompt topic"></label><label>Degree to Research<select id="writing-degree"><option value="">All Degree Types</option>${options(['Bridge/Postbaccalaureate', 'Masters', 'Doctoral', 'Certificate'], writingFilters.degree)}</select></label><label>Research Coverage<select id="writing-status"><option value="">All Listings</option>${options(['Published Guidance', 'Not Verified'], writingFilters.status)}</select></label><label class="check"><input id="writing-saved" type="checkbox" ${writingFilters.saved ? 'checked' : ''}>Saved Programs Only</label></div>${writingFilters.programId ? '<p><button type="button" id="writing-clear">Show All Programs</button></p>' : ''}<p id="writing-count" class="quiet" role="status"></p><div id="writing-results" class="research-list"></div><nav id="writing-pagination" class="pagination" aria-label="Application Requirement Pages"></nav><p class="quiet">Sources checked ${writingCheckedOn}. No essays, applications or recommendation requests are submitted by this research website.</p>`;
  drawWritingResults(view, saved);
}
function drawWritingResults(view, saved) {
  const term = writingFilters.query.trim().toLowerCase();
  const list = programs
    .filter(
      (p) =>
        (!writingFilters.programId || p.id === writingFilters.programId) &&
        (!writingFilters.saved || Object.hasOwn(saved, p.id)) &&
        (!writingFilters.degree || p.degrees.includes(writingFilters.degree)) &&
        (!writingFilters.status ||
          writingStatus(p, writingFilters.degree) === writingFilters.status) &&
        (!term ||
          [
            p.name,
            p.title,
            p.city,
            ...writingFor(p, writingFilters.degree).flatMap((e) =>
              e.statements.flatMap((s) => [s.title, s.summary]),
            ),
          ]
            .join(' ')
            .toLowerCase()
            .includes(term)),
    )
    .sort((a, b) => a.name.localeCompare(b.name) || a.title.localeCompare(b.title));
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  writingFilters.page = Math.min(writingFilters.page, pages);
  const start = (writingFilters.page - 1) * pageSize;
  view.querySelector('#writing-count').textContent =
    `${list.length} matching AMS listings · Showing ${list.length ? start + 1 : 0}–${Math.min(start + pageSize, list.length)}. ${writingFilters.saved && !Object.keys(saved).length ? 'Sign in and save programs to use your shortlist.' : ''}`;
  view.querySelector('#writing-results').innerHTML = list.length
    ? list
        .slice(start, start + pageSize)
        .map(
          (p) =>
            `<article class="panel" data-writing-program="${p.id}"><p class="eyebrow">AMS #${p.ams.amsId} · ${html(p.country)}</p><h3>${html(p.name)}</h3><p class="degree">${html(p.title)}</p><p class="quiet">Listed degrees: ${html(p.degrees.join(' / ') || 'Not Supplied')}</p>${writingSummary(p, writingFilters.degree)}<div class="actions"><button type="button" data-details="${p.id}">Program Details</button><button type="button" data-save="${p.id}" ${saved[p.id] ? 'disabled' : ''}>${saved[p.id] ? 'Saved ✓' : 'Save Program'}</button></div></article>`,
        )
        .join('')
    : '<div class="empty"><h3>No Matching Programs</h3><p>Try broader filters or turn off Saved Programs Only.</p></div>';
  view.querySelector('#writing-pagination').innerHTML =
    `<button type="button" data-writing-page="${writingFilters.page - 1}" ${writingFilters.page === 1 ? 'disabled' : ''}>Previous Page</button><span>Page ${writingFilters.page} of ${pages}</span><button type="button" data-writing-page="${writingFilters.page + 1}" ${writingFilters.page === pages ? 'disabled' : ''}>Next Page</button>`;
}
export function focusWritingProgram(id, degree = '') {
  Object.assign(writingFilters, {
    programId: id,
    query: '',
    degree,
    status: '',
    saved: false,
    page: 1,
  });
}
// Event delegation survives pane redraws and retains search input focus while typing.
export function handleResearchEvent(event, view, saved = {}) {
  const id = event.target.id;
  if (id.startsWith('funding-')) {
    const key = id.slice(8);
    if (!Object.hasOwn(fundingFilters, key)) return;
    if ((key === 'query') !== (event.type === 'input')) return;
    fundingFilters[key] = event.target.value;
    drawFundingResults(view);
  }
  if (id.startsWith('writing-')) {
    const key = id.slice(8);
    if (!Object.hasOwn(writingFilters, key)) return;
    if ((key === 'query') !== (event.type === 'input')) return;
    writingFilters[key] = key === 'saved' ? event.target.checked : event.target.value;
    writingFilters.page = 1;
    writingFilters.programId = '';
    drawWritingResults(view, saved);
  }
  const button = event.target.closest('button');
  if (button?.dataset.writingPage) {
    writingFilters.page = Number(button.dataset.writingPage);
    drawWritingResults(view, saved);
    view.querySelector('#writing-count').scrollIntoView({ block: 'start' });
  }
  if (button?.id === 'writing-clear') {
    focusWritingProgram('');
    drawWriting(view, saved);
  }
}
