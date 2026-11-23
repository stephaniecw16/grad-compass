export const fictionalGreKey = 'gradapp.fictional-gre-policy.v1';
export const greCheckedOn = '2026-11-13';
export const greOptions = {
  require: 'Required',
  suggest: 'Suggested',
  none: 'None',
  unknown: 'Not Verified',
};
export const greTests = {
  greGeneral: {
    label: 'GRE General',
    report: 'https://www.ets.org/gre/test-takers/general-test/scores/send-scores.html',
  },
  greMath: {
    label: 'GRE Math Subject',
    report: 'https://www.ets.org/gre/test-takers/subject-tests/scores/send-scores.html',
  },
};

// “None” includes optional scores when the program does not recommend them.
const rows = {
  auburn: [
    'suggest',
    'none',
    '1005',
    'https://cosam.auburn.edu/math/students/grad/how-to-apply.php',
    'The General Test is recommended. The mathematics bulletin explicitly says the Subject Test is not required.',
    'https://bulletin.auburn.edu/thegraduateschool/graduatedegreesoffered/mathematicsandstatisticsmsmammpsphd_major/',
  ],
  baylor: [
    'none',
    'none',
    '6032',
    'https://math.artsandsciences.baylor.edu/info/frequently-asked-questions',
    'General is optional. Math Subject is not required.',
  ],
  binghamton: [
    'none',
    'none',
    '2535',
    'https://gograd.binghamton.edu/portal/Program_Information',
    'The Mathematical Sciences PhD row lists GRE as not required and gives no separate Math Subject requirement.',
  ],
  boise: [
    'none',
    'none',
    '4018',
    'https://www.boisestate.edu/computing/academics/doctoral-program/frequently-asked-questions/',
    'The Computing PhD does not consider GRE scores.',
  ],
  'boston-college': [
    'none',
    'none',
    '3083',
    'https://www.bc.edu/bc-web/schools/morrissey/graduate/admission.html',
    'The Mathematics PhD checklist lists no GRE. The school-wide code is 3083.',
  ],
  'boston-university': [
    'none',
    'none',
    '3087',
    'https://www.bu.edu/cas/admissions/phd-mfa/apply/',
    'The Fall 2027 Mathematics PhD checklist lists no GRE. Statistics has a separate policy.',
    'https://www.bu.edu/cas/admissions/phd-mfa/apply/frequently-asked-questions/testing-requirements/',
  ],
  'bowling-green': [
    'none',
    'none',
    '1069',
    'https://www.bgsu.edu/arts-and-sciences/mathematics-and-statistics/graduate-programs/apply.html',
    'The application page allows optional submission and lists no separate Math Subject requirement.',
  ],
  byu: [
    'none',
    'none',
    '4019',
    'https://math.byu.edu/applications-deadlines',
    'The current Application Requirements page says both are unnecessary. A separate admissions page still lists a Math Subject minimum. Confirm directly before relying on this policy.',
    'https://math.byu.edu/applications-and-admissions',
  ],
  'brown-math': [
    'none',
    'none',
    '3094',
    'https://mathematics.brown.edu/graduate/graduate-program-admission',
    'General is not required and Math Subject is entirely optional.',
    'https://graduateschool.brown.edu/application-information/gre-information',
  ],
  'brown-applied': [
    'require',
    'suggest',
    '3094',
    'https://appliedmath.brown.edu/academics/graduate-program/prospective-phd-students',
    'General is required. Math Subject is highly recommended.',
  ],
  'bryn-mawr': [
    'none',
    'none',
    '2049',
    'https://www.brynmawr.edu/gsas/admissions-aid/apply',
    'GRE is optional for Mathematics. The checklist gives no separate Math Subject requirement.',
  ],
  caltech: [
    'none',
    'none',
    '4034',
    'https://mathematics.caltech.edu/academics/graduate-studies/admissions-and-financial-support',
    'Neither test is considered in Mathematics. Applied and Computational Mathematics has a separate policy.',
  ],
  'carnegie-mellon': [
    'none',
    'suggest',
    '',
    'https://www.cmu.edu/math/grad/phd/admissions.html',
    'The doctoral checklist recommends the Math Subject Test and does not list the General Test.',
  ],
  'case-western': [
    'suggest',
    'none',
    '',
    'https://mathstats.case.edu/admission/faq/',
    'General is preferred but optional. The department does not recommend the Math Subject Test.',
  ],
  'central-michigan': [
    'require',
    'none',
    '1106',
    'https://www.cmich.edu/academics/colleges/college-science-engineering/departments-schools/mathematics/graduate-programs',
    'The PhD instructions require General scores and list department code 0703. They list no Math Subject requirement.',
  ],
  claremont: [
    'suggest',
    'none',
    '',
    'https://www.cgu.edu/school/institute-of-mathematical-sciences/faq/',
    'The institute FAQ recommends General and makes Subject optional. The program page lists both as optional.',
    'https://www.cgu.edu/academics/program/phd-mathematics/',
  ],
  clarkson: [
    'require',
    'none',
    '2084',
    'https://www.clarkson.edu/academics/majors-minors/mathematics-phd',
    'General is conditional. Optional for applicants with MS and BS degrees in mathematical sciences. Other applicants may request a waiver. The program lists no separate Math Subject requirement.',
    'https://www.clarkson.edu/admissions-aid/graduate/how-to-apply',
  ],
  clemson: [
    'suggest',
    'none',
    '5111',
    'https://www.clemson.edu/science/academics/departments/mathstat/academics/grad-apply.html',
    'General is recommended for all applicants. The checklist gives no Math Subject requirement.',
  ],
  mines: [
    'none',
    'none',
    '4073',
    'https://www.mines.edu/academics/graduate-academics/applied-mathematics-and-statistics-phd/',
    'The PhD page lists GRE as not required and gives no separate Math Subject requirement.',
    'https://gradprograms.mines.edu/admissions-requirements/',
  ],
  'colorado-state': [
    'none',
    'none',
    '4075',
    'https://mathematics.colostate.edu/graduate-students/graduate-program-application-instructions/',
    'Applicants may submit either test. Neither is required or recommended in the instructions.',
  ],
  columbia: [
    'none',
    'require',
    '2162',
    'https://www.gsas.columbia.edu/content/mathematics',
    'The program table requires Math Subject. A scheduling exception on the same page explicitly refers to Fall 2026. Confirm any Fall 2027 exception with GSAS.',
    'https://www.gsas.columbia.edu/content/frequently-asked-questions',
  ],
  'cornell-applied': [
    'none',
    'none',
    '',
    'https://cam.cornell.edu/academics/phd-program-admissions/',
    'Neither test is accepted.',
  ],
  'cornell-math': [
    'none',
    'require',
    '2098',
    'https://math.cornell.edu/graduate-admissions-application',
    'Math Subject is required with a published minimum of 600. General scores are not considered.',
    'https://gradschool.cornell.edu/admissions/application-steps/required-tests/',
  ],
  cuny: [
    'none',
    'suggest',
    '2113',
    'https://www.gc.cuny.edu/admissions-aid/how-apply/application-deadlines-and-requirements',
    'The Mathematics PhD row recommends the Subject Test and lists no General requirement.',
  ],
  dartmouth: [
    'none',
    'suggest',
    '3351',
    'https://hopper.dartmouth.edu/graduate-students/appl-info/',
    'Both are optional. The department encourages Math Subject submission when the result strengthens the application.',
    'https://graduate.dartmouth.edu/admissions/applying-dartmouth/admissions-information',
  ],
};

export function grePolicy(program) {
  const [greGeneral, greMath, greCode, source, note, extra] = rows[program.id] || [
    'unknown',
    'unknown',
    '',
    '',
    'No test-specific university policy independently verified.',
  ];
  let fictional = {};
  if (program.id === 'example-test-university-math') {
    try {
      fictional = JSON.parse(localStorage.getItem(fictionalGreKey) || '{}') || {};
    } catch {}
  }
  const update = { ...fictional, ...program.departmentUpdate };
  const policy = (value, fallback) => (Object.hasOwn(greOptions, value) ? value : fallback);
  return {
    greGeneral: policy(update.greGeneral, greGeneral),
    greMath: policy(update.greMath, greMath),
    greCode: /^\d{4}$/.test(update.greCode || '') ? update.greCode : greCode,
    greDepartmentCode: program.id === 'central-michigan' ? '0703' : '',
    source,
    note,
    extra,
    local: !!(update.greGeneral || update.greMath || update.greCode),
    fictional: !source,
  };
}
