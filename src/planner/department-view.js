import { departmentInfo, linkCheckText } from '../catalog/department-info.js';
import { html, sourceLink } from './markup.js';
const kinds = {
  department: 'Department Contact',
  program: 'Program Contact',
  college: 'College Office',
  'graduate-school': 'Central Graduate-School Office',
  'ams-listed': 'Role Not Independently Verified',
};
export function contactSummary(program, compact = false) {
  const info = departmentInfo(program);
  return `${info.contacts.map((contact) => `<div class="department-contact"><p><strong>${html(contact.label)}</strong></p><p><a href="mailto:${encodeURIComponent(contact.email)}">${html(contact.email)}</a></p><p class="quiet">${html(kinds[contact.kind] || 'Published University Contact')}</p><span class="evidence-badge ${contact.status}">${contact.status === 'university' ? 'University Source' : 'AMS Reported'}</span><p class="quiet">Checked ${html(contact.checkedOn)}. ${sourceLink(contact.source, 'Contact Source')}</p></div>`).join('')}${info.phones.length ? `<p>AMS-Listed Phone: ${info.phones.map(html).join(' · ')}</p><p class="quiet">Phone numbers are AMS-reported, not independently confirmed. ${sourceLink(info.source, 'AMS Contact Source')}</p>` : ''}${!info.contacts.length && !info.phones.length ? `<p class="quiet">${info.amsContactProvided ? 'AMS includes contact notes; open the listing to view them. No usable email or phone was extracted.' : 'No departmental email or phone verified. Use the official website or AMS listing to find the current graduate coordinator.'}</p>${sourceLink(info.source, 'Check the AMS Listing')}` : ''}${!compact ? '<p class="quiet">Use department contacts for program questions and central offices for general admissions. Staff roles and addresses can change. No message is sent until you choose to write one.</p>' : ''}`;
}
export function departmentPanel(program) {
  const info = departmentInfo(program);
  return `<section class="panel department-panel" aria-label="Department Websites and Contacts"><h3>Department Websites and Contacts</h3><div class="research-columns"><section><h4>Official Department Website</h4>${info.departmentWebsite ? sourceLink(info.departmentWebsite, 'Open Department Website') : '<p class="quiet">Department website not supplied or verified.</p>'}<p class="quiet">${info.discovered ? `Reviewed department page for ${html(info.discovered.label)}. See ${sourceLink(info.discovered.source, 'the University Source')}.` : `URL reported by AMS. ${html(linkCheckText(info.checks.department))}`}</p><h4>Admissions and Prospective Students</h4>${info.admissionsWebsite ? sourceLink(info.admissionsWebsite, 'Open Published Admissions Website') : '<p class="quiet">No separate admissions URL supplied.</p>'}<p class="quiet">This may be a department, central admissions page, or external application service. ${html(linkCheckText(info.checks.admissions))}</p><p class="quiet">${sourceLink(info.source, 'AMS Link Source')} · Checked ${info.checkedOn}${info.updated ? '; AMS listing updated ' + html(info.updated) : ''}. Reaching a page does not verify every program field.</p></section><section><h4>Whom to Contact</h4>${contactSummary(program)}</section></div></section>`;
}
export function departmentCardLinks(program) {
  const info = departmentInfo(program);
  return info.departmentWebsite
    ? `<p class="quiet">${sourceLink(info.departmentWebsite, 'Department Website')} · ${info.discovered ? 'University-Published Link' : 'URL Reported by AMS'}</p>`
    : '';
}
