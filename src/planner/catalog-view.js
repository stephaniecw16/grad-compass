import { departmentPanel, departmentCardLinks, contactSummary } from './department-view.js';
import { amsCheckedOn, amsDirectory } from '../catalog/catalog.js';
import { fieldEvidence, fieldLabels, verificationSummary } from '../catalog/evidence.js';
import { html, sourceLink } from './markup.js';
export { html, sourceLink } from './markup.js';
import { writingSummary } from './research-workspace.js';
export function deadlineText(p) {
  return p.deadline
    ? `${p.deadline} · ${p.kind || 'Published Date'}`
    : `${p.reported} · Confirm with Program`;
}
const statusLabels = {
  university: 'University Source',
  ams: 'AMS Reported',
  unverified: 'Not Verified',
};
export function compareCell(p, key) {
  if (key === 'departmentContacts') return contactSummary(p, true);
  const field = fieldEvidence(p, key);
  return `<div>${field.url ? sourceLink(field.url, 'Department Website') : html(field.value)}</div><span class="evidence-badge ${field.status}">${statusLabels[field.status]}</span>${field.checkedOn ? `<p class="quiet">Source checked ${html(field.checkedOn)}${field.updated ? '; listing updated ' + html(field.updated) : ''}.</p>` : ''}${field.scope ? `<p class="quiet">${html(field.scope)}</p>` : ''}${sourceLink(field.source, field.status === 'ams' ? 'AMS Listing' : 'University Source')}`;
}
export function programCard(p, saved, compared) {
  return `<article class="card ${saved ? 'saved' : ''}" data-program="${p.id}"><div class="card-top"><span class="monogram" aria-hidden="true">${html(p.initials)}</span><label class="check"><input type="checkbox" data-compare="${p.id}" ${compared ? 'checked' : ''} aria-label="Compare ${html(p.name + ' ' + p.title)}"> Compare</label></div><p class="location">${html(p.city)}</p><h3>${html(p.name)}</h3><p class="degree">${html(p.title)}</p><p class="quiet">${html(p.degrees.join(' · ') || 'Degree Not Listed')} · AMS #${p.ams.amsId}</p><div class="tags">${p.areas
    .slice(0, 3)
    .map((area) => `<span>${html(area)}</span>`)
    .join(
      '',
    )}</div><p class="deadline">${html(deadlineText(p))}</p>${departmentCardLinks(p)}<div class="actions"><button type="button" data-details="${p.id}">Program Details</button><button type="button" data-save="${p.id}" ${saved ? 'disabled' : ''}>${saved ? 'Saved ✓' : 'Save Program'}</button></div></article>`;
}
export function comparisonTable(programs) {
  return `<div class="table-wrap" role="region" aria-label="School Comparison" tabindex="0"><table><thead><tr><th scope="col">Comparison Criteria</th>${programs.map((p) => `<th scope="col">${html(p.name)}<p class="quiet">${html(p.title)} · AMS #${p.ams.amsId}</p><button type="button" class="small" data-uncompare="${p.id}">Remove from Comparison</button></th>`).join('')}</tr></thead><tbody>${fieldLabels.map(([key, label]) => `<tr><th scope="row">${html(label)}</th>${programs.map((p) => `<td>${compareCell(p, key)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function programDetails(p) {
  const coverage = verificationSummary(p);
  return `<p class="eyebrow">${html(p.country)} · AMS #${p.ams.amsId}</p><h2 id="program-dialog-title">${html(p.name)}</h2><h3>${html(p.title)}</h3><p>${html(p.degrees.join(' · ') || 'Degree Options Not Supplied')}</p><p class="notice">${html(p.note)} ${p.curatedPhD ? 'Previously researched admissions, cost, and GRE facts apply to the original doctoral program only.' : ''}</p><p class="quiet">Field coverage: ${coverage.university} university-sourced · ${coverage.ams} AMS-reported · ${coverage.unverified} not verified. Source dates and scope appear with each field.</p><div class="actions"><button class="primary" type="button" data-save="${p.id}">Save Program</button>${sourceLink(p.officialUrl, 'Visit the University Website')}</div>${departmentPanel(p)}${p.ams.duplicateGroup ? `<p class="notice">AMS has multiple listings for this institution/department. This is listing #${p.ams.amsId}; duplicate records are retained rather than silently combined.</p>` : ''}<div class="detail-grid">${fieldLabels
    .filter(([key]) => !['departmentWebsite', 'departmentContacts'].includes(key))
    .map(
      ([key, label]) =>
        `<div><h3>${html(label)}</h3><div class="detail-value">${compareCell(p, key)}</div></div>`,
    )
    .join(
      '',
    )}</div>${writingSummary(p)}<h3>Program Sources</h3>${p.sources.map(([label, url]) => `<p>${sourceLink(url, label)}</p>`).join('')}<p class="quiet">All AMS listing tables were checked ${amsCheckedOn}. Department-reported figures can be stale or incomplete. A listing update date does not establish a statistics year or current admissions cycle. Unknown dates are not added to the calendar. ${sourceLink(amsDirectory, 'AMS Directory')}</p>`;
}
