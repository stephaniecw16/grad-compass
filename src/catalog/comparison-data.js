import { comparisonResearch } from './comparison-research.js?v=15';
// Primary department pages checked November 6, 2026. Unknowns are intentionally absent.
// Descriptions retain each source's scope; funding duration is never an average time to degree.
const previousComparisonData = {
  'brown-math': {
    size: [
      'About 40+ graduate students; department overview, census year unspecified.',
      'https://mathematics.brown.edu/graduate-program',
    ],
    teaching: [
      'At least two semesters as a teaching assistant.',
      'https://mathematics.brown.edu/graduate/graduate-program-handbook',
    ],
  },
  'carnegie-mellon': {
    size: [
      'About 45–50 graduate students across Mathematical Sciences; census year unspecified.',
      'https://www.cmu.edu/math/grad/index.html',
    ],
    faculty: [
      'About 35 faculty in Mathematical Sciences; census year unspecified.',
      'https://www.cmu.edu/math/grad/index.html',
    ],
    teaching: [
      'At least one semester as TA; teaching preparation includes 21-605 and at least one semester leading recitations or teaching a course.',
      'https://www.cmu.edu/math/grad/phd/requirements.html',
    ],
  },
  'cornell-applied': {
    average: [
      '5 years — department-reported average; cohort and reporting period unspecified.',
      'https://cam.cornell.edu/academics/phd-program-timetable/',
    ],
  },
  'cornell-math': {
    timeline: [
      'Most students take 5–6 years (typical range, not a measured average).',
      'https://courses.cornell.edu/programs/mathematics-phd/',
    ],
    faculty: [
      '43 tenured / tenure-track faculty. Excludes emeritus and other faculty categories; census year unspecified.',
      'https://math.cornell.edu/people',
    ],
    size: [
      '80 graduate students, including visiting and non-degree students; census year unspecified.',
      'https://math.cornell.edu/people',
    ],
  },
  'brown-applied': {
    faculty: [
      '22 tenure-stream + 3 teaching-stream faculty; excludes postdocs. Census year unspecified.',
      'https://appliedmath.brown.edu/about/position-openings',
    ],
  },
  baylor: {
    faculty: [
      '22 tenured / tenure-track faculty + 8 lecturers; department overview, census year unspecified.',
      'https://math.artsandsciences.baylor.edu/info',
    ],
    size: [
      '37 graduate students across MS and PhD programs; department overview, census year unspecified.',
      'https://math.artsandsciences.baylor.edu/info',
    ],
  },
  clarkson: {
    timeline: [
      'Minimum 3 academic years full-time (minimum requirement, not an average).',
      'https://www.clarkson.edu/academics/majors-minors/mathematics-phd',
    ],
    teaching: [
      'A full teaching-assistant appointment is up to 20 hours/week on average in fall and spring. Appointment workload, not a universal teaching requirement.',
      'https://www.clarkson.edu/academics/majors-minors/mathematics-phd',
    ],
  },
};
export const comparisonData = Object.fromEntries(
  [...new Set([...Object.keys(previousComparisonData), ...Object.keys(comparisonResearch)])].map(
    (id) => [id, { ...previousComparisonData[id], ...comparisonResearch[id] }],
  ),
);
export const comparisonCriteria = [
  ['greGeneral', 'GRE General'],
  ['greMath', 'GRE Math Subject'],
  ['location', 'Location'],
  ['areas', 'Selected areas of expertise'],
  ['average', 'Average years to graduation'],
  ['timeline', 'Other published timeline'],
  ['teaching', 'Graduate teaching / TA requirements'],
  ['size', 'Program / graduate student size'],
  ['faculty', 'Department faculty'],
  ['funding', 'Funding & support conditions'],
  ['milestones', 'Selected degree requirements / milestones'],
  ['preparation', 'Selected preparation / admissions notes'],
  ['deadline', 'Application deadline'],
  ['feeDomestic', 'Application fee · domestic (USD)'],
  ['feeInternational', 'Application fee · international (USD)'],
  ['waiver', 'Fee waiver / request eligibility'],
];

export const comparisonMissing = {
  average:
    'No program-specific measured average verified. See the separate expected timeline and funding rows.',
  timeline: 'No completion estimate verified. A funding period is not treated as time to degree.',
  faculty:
    'No comparable faculty headcount verified. Program/department scopes and appointment categories vary.',
  size: 'No scoped graduate enrollment count verified. Assistantship counts are not enrollment.',
  teaching:
    'No universal teaching load verified; consult the program about appointment-specific duties.',
  preparation: 'No independent summary verified. Consult the official application instructions.',
  milestones: 'Consult the program’s current catalog or handbook.',
};
