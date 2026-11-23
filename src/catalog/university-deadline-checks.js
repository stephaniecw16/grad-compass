// University pages reviewed 2026-11-23; every automatic date has an explicit year/cycle.
// A record may have distinct deadlines for Masters and Doctoral study.
const reviewed = (value, source, scope, dates = {}) => ({
  deadline: {
    value,
    source,
    scope,
    dates,
    ...(dates.Doctoral
      ? { date: dates.Doctoral, degree: 'Doctoral' }
      : dates.Masters
        ? { date: dates.Masters, degree: 'Masters' }
        : {}),
  },
});
export const universityDeadlineChecks = {
  152: reviewed(
    'December 15, 2026; all materials for Fall 2027 mathematics PhD entry. Late letters may prevent review.',
    'https://math.cornell.edu/graduate-admissions-application',
    'Mathematics PhD, not the separate Center for Applied Mathematics.',
    { Doctoral: '2026-12-15' },
  ),
  8799: reviewed(
    'December 15, 2026 for Fall 2027 graduate entry; letters accepted through December 22, 2026.',
    'https://math.oregonstate.edu/graduate/visit-and-apply/instructions',
    'Mathematics graduate application; separate letter allowance does not extend the application deadline.',
    { Masters: '2026-12-15', Doctoral: '2026-12-15' },
  ),
  8566: reviewed(
    'January 4, 2027. Late applications may be considered through April 15, 2027 with a competitive disadvantage.',
    'https://math.rice.edu/application-procedure',
    'Mathematics graduate admission; do not substitute the CMOR deadline.',
    { Doctoral: '2027-01-04' },
  ),
  767: reviewed(
    'Autumn 2027: doctoral applications December 9, 2026; master’s applications March 1, 2027.',
    'https://math.washington.edu/graduate-admissions',
    'Mathematics; the two degree routes have different dates.',
    { Doctoral: '2026-12-09', Masters: '2027-03-01' },
  ),
  8572: reviewed(
    'January 15, 2027; all materials for Fall 2027 PhD entry.',
    'https://naturalsciences.uoregon.edu/mathematics/apply/graduate-admissions',
    'Mathematics PhD.',
    { Doctoral: '2027-01-15' },
  ),
  976: {
    ...reviewed(
      'September 2027 intake: application December 23, 2026; supporting documents and references December 31, 2026.',
      'https://www.math.ubc.ca/graduate/prospective-students',
      'Mathematics MSc/PhD. The calendar uses the earlier application deadline.',
      { Masters: '2026-12-23', Doctoral: '2026-12-23' },
    ),
    timeline: {
      value:
        'MSc usually two years; PhD usually another three or four years after the master’s. Not a measured graduation average.',
      source: 'https://www.math.ubc.ca/graduate/prospective-students',
      scope: 'Mathematics; degree-entry context matters.',
    },
    preparation: {
      value:
        'Doctoral admission normally requires a mathematics master’s or equivalent qualification; recent bachelor’s graduates normally begin in the MSc.',
      source: 'https://www.math.ubc.ca/graduate/prospective-students',
      scope: 'Mathematics; consult the full equivalency and exceptional-entry rules.',
    },
  },
  794: reviewed(
    'Fall entry: PhD January 15, 2027; MA Applied Statistics/Statistics March 1, 2027.',
    'https://www.stat.pitt.edu/graduate/admissions',
    'Statistics department, not the separate mathematics department.',
    { Doctoral: '2027-01-15', Masters: '2027-03-01' },
  ),
  6277: {
    deadline: {
      value:
        'Cycle conflict: the page says Fall 2026 entry but gives December 2026 priority and March 2027 final dates. Confirm the intended intake with Statistics.',
      source: 'https://cla.umn.edu/statistics/graduate/how-apply',
      scope: 'No calendar date assigned until the conflicting cycle wording is resolved.',
      verification: 'unverified',
      label: 'Conflicting Cycle Information',
    },
  },
  5501: {
    feePublished: {
      value:
        'Standard fee $85; the page announces a waiver for Fall 2027 CMOR doctoral applications.',
      source: 'https://cmor.rice.edu/academics/graduate-programs/graduate-admissions',
      scope: 'CMOR PhD, not Rice’s separate mathematics program.',
    },
    waiver: {
      value:
        'The department announces application-fee waivers for Fall 2027 CMOR PhD applicants; review the current instructions before paying.',
      source: 'https://cmor.rice.edu/academics/graduate-programs/graduate-admissions',
      scope: 'CMOR PhD; the same page also describes the usual $85 fee.',
    },
  },
  8484: {
    faculty: {
      value:
        'More than 40 faculty; the page also describes 15–20 postdoctoral/visiting scholars separately. These are not added into a tenure-track count.',
      source: 'https://www.math.ucdavis.edu/grad',
      scope: 'Department/program overview; census year is not supplied.',
    },
    size: {
      value: 'More than 100 graduate students across the department’s programs.',
      source: 'https://www.math.ucdavis.edu/grad',
      scope: 'Combined graduate programs, not a verified PhD-only enrollment count.',
    },
  },
  721: {
    timeline: {
      value:
        'Typical durations: master’s two years; PhD five to six years. These are not measured cohort averages.',
      source: 'https://www.clarkson.edu/academics/majors-minors/mathematics-ms',
      scope: 'Mathematics program overview; doctoral and master’s timelines are distinct.',
    },
  },
};
