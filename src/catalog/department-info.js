import { amsDepartmentDirectory, departmentCheckedOn } from './department-data.js';
import { reviewedDepartmentContacts } from './department-research.js';
import { departmentLinkChecks } from './department-link-checks.js';
import { reviewedDepartmentWebsites } from './department-websites.js';

const reviewedById = new Map();
for (const contact of reviewedDepartmentContacts)
  for (const id of contact.programAmsIds) {
    if (!reviewedById.has(id)) reviewedById.set(id, []);
    reviewedById.get(id).push(contact);
  }
export function departmentInfo(program) {
  const id = program.ams.amsId;
  const record = amsDepartmentDirectory[id];
  const source = 'https://www.ams.org/find-graduate-programs?search=1#school_' + id;
  const reviewed = reviewedById.get(id) || [];
  const seen = new Set();
  const contacts = reviewed
    .filter((contact) => {
      const key = contact.email.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((contact) => ({ ...contact, status: 'university' }));
  for (const email of record.amsEmails)
    if (!seen.has(email.toLowerCase())) {
      contacts.push({
        email,
        label: 'AMS-Listed Department Contact',
        kind: 'ams-listed',
        source,
        checkedOn: departmentCheckedOn,
        status: 'ams',
      });
      seen.add(email.toLowerCase());
    }
  const checks = departmentLinkChecks[id] || {};
  const discovered = reviewedDepartmentWebsites[id] || checks.discovered;
  return {
    departmentWebsite: discovered?.url || record.departmentWebsite,
    discovered,
    admissionsWebsite: record.admissionsWebsite,
    contacts,
    phones: record.amsPhones,
    amsContactProvided: record.amsContactProvided,
    source,
    checkedOn: departmentCheckedOn,
    updated: program.ams.updated,
    checks,
  };
}
export function departmentEvidence(program, key) {
  const info = departmentInfo(program);
  if (key === 'departmentWebsite' && info.departmentWebsite)
    return {
      value: info.departmentWebsite,
      url: info.departmentWebsite,
      source: info.discovered?.source || info.source,
      checkedOn: info.checkedOn,
      updated: info.updated,
      status: info.discovered ? 'university' : 'ams',
      scope: info.discovered
        ? 'Reviewed university department page: ' +
          info.discovered.label +
          '. This verifies the URL label, not admissions policies.'
        : 'Department URL supplied in AMS. ' +
          linkCheckText(info.checks.department) +
          ' URL retrieval does not verify admissions facts.',
    };
  if (key === 'departmentContacts' && (info.contacts.length || info.phones.length)) {
    const first = info.contacts[0];
    return {
      value:
        info.contacts.map((c) => c.label + ': ' + c.email).join('; ') || info.phones.join('; '),
      source: first?.source || info.source,
      checkedOn: first?.checkedOn || info.checkedOn,
      status: first?.status || 'ams',
      scope:
        'Professional contacts only. Department, college and central graduate-school roles are labeled separately; verify degree-specific routing.',
    };
  }
  return null;
}
export function linkCheckText(check) {
  if (!check) return 'Link not checked independently.';
  return check.outcome === 'retrieved'
    ? 'Page retrieved on ' +
        check.checkedOn +
        (check.redirected ? '; the source URL redirects.' : '.')
    : 'Page could not be retrieved on ' + check.checkedOn + '; it may still open in your browser.';
}
export function contactCoverage(programs) {
  const infos = programs.map(departmentInfo);
  return {
    listings: programs.length,
    departmentWebsites: infos.filter((i) => i.departmentWebsite).length,
    admissionsWebsites: infos.filter((i) => i.admissionsWebsite).length,
    listedContacts: infos.filter((i) => i.amsContactProvided).length,
    usableContacts: infos.filter((i) => i.contacts.length || i.phones.length).length,
    universityContacts: infos.filter((i) => i.contacts.some((c) => c.status === 'university'))
      .length,
    departmentContacts: infos.filter((i) =>
      i.contacts.some(
        (c) => c.status === 'university' && ['department', 'program'].includes(c.kind),
      ),
    ).length,
  };
}
