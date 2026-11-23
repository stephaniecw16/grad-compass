import { checkedOn, amsDirectory } from '../catalog/data.js';
import {
  comparisonData,
  comparisonCriteria,
  comparisonMissing,
} from '../catalog/comparison-data.js';
import { applicationCosts } from '../catalog/costs.js';
import { grePolicy, greOptions, greCheckedOn } from '../catalog/gre-policies.js';
// Every imported or user-entered string is escaped before entering HTML.
export const html = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
export function sourceLink(url, label = 'Official Source') {
  return /^https:\/\//.test(url || '')
    ? `<a href="${html(url)}" target="_blank" rel="noopener noreferrer">${html(label)} ↗</a>`
    : '';
}
export function deadlineText(p) {
  return p.deadline
    ? `${p.deadline} · ${p.kind || 'Published Date'}`
    : `${p.reported} · Confirm with Program`;
}
export function compareCell(p, key) {
  const gre = grePolicy(p),
    cost = applicationCosts[p.id];
  if (key === 'location') return html(p.city);
  if (key === 'areas') return html(p.areas.join('; '));
  if (key === 'deadline')
    return (
      html(deadlineText(p)) +
      sourceLink(p.sources[0]?.[1]) +
      `<p class="quiet">Checked ${html(p.checkedOn)}. ${html(p.note)}</p>`
    );
  if (key === 'greGeneral' || key === 'greMath')
    return (
      html(greOptions[gre[key]]) +
      `<p>${html(gre.note)}</p>` +
      sourceLink(gre.source) +
      `<p class="quiet">Checked ${greCheckedOn}</p>`
    );
  if (key === 'feeDomestic' || key === 'feeInternational') {
    const fee = cost?.[key === 'feeDomestic' ? 'domestic' : 'international'];
    return (fee == null ? 'Not Verified' : '$' + html(fee)) + sourceLink(cost?.feeSource);
  }
  if (key === 'waiver')
    return (
      html(cost?.waiver || 'Not Verified; Ask Graduate Admissions') + sourceLink(cost?.waiverSource)
    );
  const cell = comparisonData[p.id]?.[key];
  return cell
    ? html(cell[0]) + sourceLink(cell[1])
    : html(comparisonMissing[key] || 'Not Verified');
}
export function programCard(p, saved, compared) {
  return `<article class="card ${saved ? 'saved' : ''}" data-program="${p.id}"><div class="card-top"><span class="monogram" aria-hidden="true">${html(p.initials)}</span><label class="check"><input type="checkbox" data-compare="${p.id}" ${compared ? 'checked' : ''} aria-label="Compare ${html(p.name + ' ' + p.title)}"> Compare</label></div><p class="location">${html(p.city)}</p><h3>${html(p.name)}</h3><p class="degree">${html(p.title)} · ${html(p.degree)}</p><div class="tags">${p.areas
    .slice(0, 3)
    .map((area) => `<span>${html(area)}</span>`)
    .join(
      '',
    )}</div><p class="deadline">${html(deadlineText(p))}</p><div class="actions"><button type="button" data-details="${p.id}">Program Details</button><button type="button" data-save="${p.id}" ${saved ? 'disabled' : ''}>${saved ? 'Saved ✓' : 'Save Program'}</button></div></article>`;
}
export function comparisonTable(programs) {
  return `<div class="table-wrap" role="region" aria-label="School Comparison" tabindex="0"><table><thead><tr><th scope="col">Comparison Criteria</th>${programs.map((p) => `<th scope="col">${html(p.name)}<p class="quiet">${html(p.title)}</p><button type="button" class="small" data-uncompare="${p.id}">Remove from Comparison</button></th>`).join('')}</tr></thead><tbody>${comparisonCriteria.map(([key, label]) => `<tr><th scope="row">${html(label)}</th>${programs.map((p) => `<td>${compareCell(p, key)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function programDetails(p) {
  return `<p class="eyebrow">${html(p.city)} · ${html(p.degree)}</p><h2 id="program-dialog-title">${html(p.name)}</h2><h3>${html(p.title)}</h3><p>${html(p.areas.join(' · '))}</p><div class="notice">${html(p.note)}</div><div class="actions"><button class="primary" type="button" data-save="${p.id}">Save Program</button>${sourceLink(p.sources[0]?.[1], 'Visit the University Website')}</div><div class="detail-grid">${comparisonCriteria
    .filter(([key]) => !['location', 'areas'].includes(key))
    .map(
      ([key, label]) =>
        `<div><h3>${html(label)}</h3><div class="detail-value">${compareCell(p, key)}</div></div>`,
    )
    .join(
      '',
    )}</div><h3>Program Sources</h3>${p.sources.map(([label, url]) => `<p>${sourceLink(url, label)}</p>`).join('')}<p class="quiet">Catalog and comparison research checked ${checkedOn}; GRE policies checked ${greCheckedOn}. Information can change. Dates without a verified cycle are not turned into calendar deadlines. ${sourceLink(amsDirectory, 'AMS Directory')}</p>`;
}
