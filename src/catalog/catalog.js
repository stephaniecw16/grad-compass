import { curatedPrograms } from './data.js';
export { amsDirectory } from './data.js';
import { amsListings, amsCheckedOn } from './ams-data.js';
import { universityChecks } from './university-checks.js';

// Explicit reviewed links preserve saved IDs for the original 25 doctoral programs.
// Other AMS IDs remain separate, even when institution/department labels duplicate.
export const curatedAmsIds = {
  auburn: '28',
  baylor: '2648',
  binghamton: '6208',
  boise: '8577',
  'boston-college': '8561',
  'boston-university': '813',
  'bowling-green': '5516',
  byu: '8557',
  'brown-math': '6210',
  'brown-applied': '2686',
  'bryn-mawr': '8600',
  caltech: '6336',
  'carnegie-mellon': '982',
  'case-western': '8584',
  'central-michigan': '2535',
  claremont: '132',
  clarkson: '721',
  clemson: '135',
  mines: '8583',
  'colorado-state': '140',
  columbia: '144',
  'cornell-applied': '2558',
  'cornell-math': '152',
  cuny: '8775',
  dartmouth: '8476',
};
// Reviewed one-to-one AMS ID replacements; retain students' original saved IDs.
export const previousAmsIds = { 9040: '719', 8663: '6460', 8520: '6215' };
const curated = new Map(curatedPrograms.map((p) => [curatedAmsIds[p.id], p]));
const regions = {
  Northeast: [
    'Connecticut',
    'Maine',
    'Massachusetts',
    'New Hampshire',
    'Rhode Island',
    'Vermont',
    'New Jersey',
    'New York',
    'Pennsylvania',
  ],
  Midwest: [
    'Illinois',
    'Indiana',
    'Michigan',
    'Ohio',
    'Wisconsin',
    'Iowa',
    'Kansas',
    'Minnesota',
    'Missouri',
    'Nebraska',
    'North Dakota',
    'South Dakota',
  ],
  South: [
    'Delaware',
    'Florida',
    'Georgia',
    'Maryland',
    'North Carolina',
    'South Carolina',
    'Virginia',
    'District of Columbia',
    'West Virginia',
    'Alabama',
    'Kentucky',
    'Mississippi',
    'Tennessee',
    'Arkansas',
    'Louisiana',
    'Oklahoma',
    'Texas',
    'Puerto Rico',
  ],
  West: [
    'Arizona',
    'Colorado',
    'Idaho',
    'Montana',
    'Nevada',
    'New Mexico',
    'Utah',
    'Wyoming',
    'Alaska',
    'California',
    'Hawaii',
    'Oregon',
    'Washington',
  ],
};
function region(location) {
  if (location.endsWith('Canada')) return 'Canada';
  return (
    Object.entries(regions).find(([, states]) =>
      states.some((state) => location.endsWith(state + ' United States of America')),
    )?.[0] || 'Not Listed'
  );
}
function country(location) {
  return location.endsWith('Canada')
    ? 'Canada'
    : location.endsWith('United States of America')
      ? 'United States'
      : 'Not Listed';
}
// Directory filters use a short, consistent taxonomy. Original source categories
// remain unchanged in the evidence rows, with their degree scope and citations.
const areaLabels = {
  'Algebra/Number Theory': 'Algebra and Number Theory',
  'Algebra & number theory': 'Algebra and Number Theory',
  'Real, Complex, Functional, Harmonic Analysis (and Topological Groups)': 'Analysis',
  'Geometry/Topology': 'Geometry and Topology',
  'Geometry & topology': 'Geometry and Topology',
  'Discrete Math/Combinatorics/Logic/Computer Science': 'Discrete Math, Logic and Computer Science',
  'Biostatistics/Statistics': 'Statistics and Biostatistics',
  'Applied mathematics': 'Applied Mathematics',
  'Numerical Analysis/Approximations': 'Numerical Analysis',
  'Linear, Non-linear Optimization/Control': 'Optimization and Control',
  'Differential, Integral, Difference Equations': 'Differential Equations',
};
const duplicateCounts = new Map();
for (const p of amsListings) {
  const key = (p.institution + '|' + p.department).toLowerCase();
  duplicateCounts.set(key, (duplicateCounts.get(key) || 0) + 1);
}
export const programs = amsListings.map((ams, index) => {
  const old = curated.get(ams.amsId);
  const areas = [...new Set(ams.tracks.flatMap((track) => track.areas))];
  const name = old?.name || ams.institution;
  const corrections = universityChecks[ams.amsId] || {};
  const correctedLocation = corrections.location?.value || ams.location;
  const deadlinesByDegree = {
    ...corrections.deadline?.dates,
    ...(old?.deadline ? { Doctoral: old.deadline } : {}),
    ...(corrections.deadline?.date
      ? { [corrections.deadline.degree]: corrections.deadline.date }
      : {}),
  };
  return {
    id: old?.id || 'ams-' + (previousAmsIds[ams.amsId] || ams.amsId),
    name,
    title: old?.title || ams.department || 'Program Details Not Listed',
    degree: old?.degree || ams.tracks.map((track) => track.type).join(' · ') || 'Degree Not Listed',
    degrees: ams.tracks.map((track) => track.type),
    city: corrections.location?.value || old?.city || ams.location || 'Location Not Listed',
    country: country(correctedLocation),
    region: region(correctedLocation),
    areas: [...new Set([...(old?.areas || []), ...areas].map((area) => areaLabels[area] || area))],
    deadlinesByDegree,
    deadline: corrections.deadline?.date || old?.deadline || null,
    reported:
      corrections.deadline?.label ||
      corrections.deadline?.value ||
      old?.reported ||
      'Deadline Not Verified',
    verification: old?.verification || 'unverified',
    kind: corrections.deadline?.date
      ? 'Cycle Confirmed · ' + corrections.deadline.degree
      : old?.kind || 'Not Verified',
    note:
      old?.note ||
      'AMS listing checked ' +
        amsCheckedOn +
        '. Degree-specific information is department-reported. Confirm current admissions policies and dates with the university.',
    checkedOn: old?.checkedOn || amsCheckedOn,
    sources: [
      ...Object.entries(corrections).map(([key, f]) => ['University Check · ' + key, f.source]),
      ...(old?.sources || []),
      [
        'AMS Listing ' + ams.amsId,
        'https://www.ams.org/find-graduate-programs?search=1#school_' + ams.amsId,
      ],
      ...(ams.website ? [['University Link Reported by AMS', ams.website]] : []),
    ],
    officialUrl:
      corrections.deadline?.source ||
      corrections.location?.source ||
      old?.sources[0]?.[1] ||
      ams.website ||
      null,
    initials: name
      .split(/\s+/)
      .filter((w) => !['of', 'University', 'College', 'the'].includes(w))
      .slice(0, 2)
      .map((w) => w[0])
      .join(''),
    color: ['sage', 'blue', 'rose', 'sand', 'lavender', 'mint'][index % 6],
    curatedPhD: !!old,
    ams: {
      ...ams,
      previousAmsId: previousAmsIds[ams.amsId] || null,
      duplicateGroup:
        duplicateCounts.get((ams.institution + '|' + ams.department).toLowerCase()) > 1,
    },
  };
});
export { amsCheckedOn };
export const catalogCount = programs.length;
export const degreeTrackCount = amsListings.reduce((sum, p) => sum + p.tracks.length, 0);
