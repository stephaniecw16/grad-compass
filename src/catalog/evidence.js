// Every comparison cell carries its own source, scope, and verification state.
// AMS reports are useful evidence, but are never presented as a current university policy.
import { comparisonData, comparisonMissing } from './comparison-data.js';
import { applicationCosts } from './costs.js';
import { grePolicy, greOptions, greCheckedOn } from './gre-policies.js';
import { amsCheckedOn } from './ams-data.js';
import { universityChecks } from './university-checks.js';

export const fieldLabels = [
  ['degrees', 'Listed Degree Options'],
  ['department', 'Department / Program'],
  ['location', 'Location'],
  ['areas', 'Areas of Expertise'],
  ['grePolicy', 'University GRE Policy · Overall'],
  ['greGeneral', 'GRE General'],
  ['greMath', 'GRE Math Subject'],
  ['amsGre', 'AMS-Reported GRE Policy by Degree'],
  ['average', 'Average Years to Graduation'],
  ['timeline', 'Other Published Timeline'],
  ['teaching', 'Graduate Teaching / TA Requirements'],
  ['size', 'Program / Graduate Student Size'],
  ['faculty', 'Department Faculty'],
  ['funding', 'Funding and Support Conditions'],
  ['milestones', 'Degree Requirements / Milestones'],
  ['preparation', 'Preparation / Admissions Notes'],
  ['deadline', 'Application Deadline'],
  ['feePublished', 'Published Base Application Fee'],
  ['feeDomestic', 'Application Fee · Domestic'],
  ['feeInternational', 'Application Fee · International'],
  ['waiver', 'Fee Waiver / Request Eligibility'],
  ['online', 'Online Study Options by Degree'],
  ['awarded', 'Degrees Awarded (AMS Report)'],
  ['sourceUpdated', 'AMS Listing Last Updated'],
];
const unknown = (key) => ({
  value:
    comparisonMissing[key] ||
    'Not independently verified. Check the current university program instructions.',
  status: 'unverified',
  checkedOn: null,
  source: null,
  scope: '',
});
function university(value, source, date, scope = 'Doctoral Program') {
  return { value, source, checkedOn: date, status: 'university', scope };
}
function ams(program, value, scope) {
  return {
    value,
    source: 'https://www.ams.org/find-graduate-programs?search=1#school_' + program.ams.amsId,
    checkedOn: amsCheckedOn,
    status: 'ams',
    scope,
    updated: program.ams.updated,
  };
}
function tracks(program, callback) {
  return program.ams.tracks
    .map((track) => {
      const value = callback(track);
      return value ? track.type + ': ' + value : null;
    })
    .filter(Boolean)
    .join('; ');
}
export function fieldEvidence(program, key) {
  const p = program,
    report = p.ams;
  const reviewed = universityChecks[report.amsId]?.[key];
  if (reviewed)
    return { ...reviewed, status: reviewed.verification || 'university', checkedOn: '2026-11-23' };
  if (key === 'degrees')
    return ams(
      p,
      p.degrees.join('; ') || 'Degree options not supplied',
      'Degree types advertised in this AMS listing; not proof that each is currently accepting applications.',
    );
  if (key === 'department')
    return ams(p, report.department || 'Department not supplied', 'AMS listing ' + report.amsId);
  if (key === 'sourceUpdated')
    return ams(
      p,
      report.updated || 'No update date supplied',
      'Listing update timestamp, not a statistics reporting year or an admissions cycle.',
    );
  if (key === 'location')
    return p.curatedPhD
      ? university(
          p.city,
          p.officialUrl,
          p.checkedOn,
          'Previously sourced location; AMS reports ' + report.location,
        )
      : ams(
          p,
          report.location || 'Location not supplied',
          'Check the university if the AMS location looks inconsistent.',
        );
  if (key === 'areas') {
    const value = tracks(p, (t) => t.areas.join('; '));
    return value
      ? ams(
          p,
          value,
          'Selected structured research categories by degree. Additional free-text specialties may appear in AMS; this is not exhaustive.',
        )
      : report.tracks.some((t) => t.otherAreasReported)
        ? ams(
            p,
            'Additional specialties are described in AMS free text; consult the source.',
            'Free-text instructions are not promoted into verified subject tags.',
          )
        : unknown(key);
  }
  if (key === 'amsGre') {
    const value = tracks(p, (t) => t.greReported);
    return value
      ? ams(
          p,
          value,
          'Raw AMS test labels, which can be ambiguous or outdated. They do not establish a current test-specific requirement.',
        )
      : unknown(key);
  }
  if (key === 'greGeneral' || key === 'greMath') {
    if (!p.curatedPhD) return unknown(key);
    const policy = grePolicy(p);
    return university(
      (greOptions[policy[key]] || 'Not Verified') + '. ' + policy.note,
      policy.source,
      greCheckedOn,
      'Original curated doctoral program only; other degrees may differ.',
    );
  }
  if (key === 'deadline')
    return p.curatedPhD
      ? university(
          (p.deadline || p.reported) + '. ' + p.note,
          p.officialUrl,
          p.checkedOn,
          'Original curated doctoral program only. Annual or conflicting dates are not confirmed cycle deadlines.',
        )
      : unknown(key);
  if (['feeDomestic', 'feeInternational', 'waiver'].includes(key)) {
    const cost = applicationCosts[p.id];
    if (!cost) return unknown(key);
    if (key === 'waiver') return university(cost.waiver, cost.waiverSource, cost.checkedOn);
    const amount = cost[key === 'feeDomestic' ? 'domestic' : 'international'];
    return amount == null
      ? unknown(key)
      : university('$' + amount + ' USD', cost.feeSource, cost.checkedOn);
  }
  const prior = comparisonData[p.id]?.[key];
  if (prior)
    return university(
      prior[0],
      prior[1],
      '2026-11-06',
      'Original curated doctoral program; source scope and reporting period are retained in the description.',
    );
  if (key === 'faculty' && report.facultyFullTime !== null)
    return ams(
      p,
      report.facultyFullTime + ' full-time department faculty',
      'Department scope; listing update date is not a census year.',
    );
  if (key === 'size') {
    const value = tracks(p, (t) =>
      [
        t.fullTime === null ? null : t.fullTime + ' full-time',
        t.partTime === null ? null : t.partTime + ' part-time',
      ]
        .filter(Boolean)
        .join(', '),
    );
    return value
      ? ams(
          p,
          value,
          'Degree-specific enrollment, not annual intake or assistantship slots. Reporting year not supplied.',
        )
      : unknown(key);
  }
  if (key === 'funding') {
    const value = tracks(p, (t) =>
      t.support
        ? 'Support availability: ' +
          t.support +
          (t.supportedStudents === null
            ? ''
            : '; ' + t.supportedStudents + ' full-time students supported')
        : null,
    );
    return value
      ? ams(
          p,
          value,
          'Availability, not a guaranteed offer, duration, amount or teaching obligation.',
        )
      : unknown(key);
  }
  if (key === 'online') {
    const value = tracks(p, (t) => t.online);
    return value
      ? ams(
          p,
          value,
          'Degree-specific online options; verify availability for the intended cohort.',
        )
      : unknown(key);
  }
  if (key === 'awarded') {
    const value = tracks(p, (t) => (t.awarded === null ? null : String(t.awarded)));
    return value
      ? ams(
          p,
          value,
          'Degrees awarded in the reported past year. The calendar year is not supplied; this is not time to degree.',
        )
      : unknown(key);
  }
  return unknown(key);
}
export function verificationSummary(p) {
  const fields = fieldLabels.map(([key]) => fieldEvidence(p, key));
  return {
    university: fields.filter((f) => f.status === 'university').length,
    ams: fields.filter((f) => f.status === 'ams').length,
    unverified: fields.filter((f) => f.status === 'unverified').length,
  };
}
