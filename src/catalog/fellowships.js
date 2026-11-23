// Reviewed summaries, not eligibility decisions. Read each sponsor's full rules.
// Never roll a closed competition's dates forward into a new application cycle.
export const fundingCheckedOn = '2026-11-23';
const allFields = [
  'Mathematics',
  'Applied Mathematics',
  'Data Science',
  'Statistics',
  'Computer Science',
];
export const fellowships = [
  {
    id: 'nsf-grfp',
    name: 'NSF Graduate Research Fellowship (GRFP)',
    sponsor: 'U.S. National Science Foundation',
    fields: allFields,
    stages: ['Entering Graduate Study', 'Early Graduate Study'],
    location: 'United States',
    cycle: 'FY2027 · NSF 26-526',
    eligibility: [
      'U.S. citizen, national, or permanent resident pursuing an eligible full-time research master’s or doctorate.',
      'Seniors/bachelor’s holders without prior graduate enrollment, or first-year students in their first graduate degree with less than one academic year completed. Second-year graduate students are ineligible. Joint bachelor’s/master’s rules differ.',
      'Graduate students may apply once; check the current eligible research-field list and exclusions.',
    ],
    requirements: [
      'Personal/background/future-goals statement: PDF, maximum 3 pages.',
      'Graduate research plan: PDF, maximum 2 pages, including references. Both statements need separate Intellectual Merit and Broader Impacts headings.',
      'Education/experience, proposed study, official undergraduate transcripts; graduate transcript exception for first-term students.',
      'Name 3–5 non-family referees; up to 3 preferred letters are reviewed. Follow all formatting and originality rules.',
    ],
    deadlines: [
      { label: 'Mathematical Sciences application · 8 p.m. Eastern', date: '2026-10-23' },
      { label: 'Reference letters · 8 p.m. Eastern', date: '2026-10-16' },
    ],
    timing: 'These FY2027 dates have passed. A future competition deadline is not verified.',
    award:
      'Three supported years within five: annual USD 37,000 stipend plus USD 16,000 institutional education allowance.',
    sources: [
      [
        'Current Solicitation',
        'https://www.nsf.gov/funding/opportunities/grfp-nsf-graduate-research-fellowship-program/nsf26-526/solicitation',
      ],
    ],
  },
  {
    id: 'doe-csgf',
    name: 'DOE Computational Science Graduate Fellowship (CSGF)',
    sponsor: 'U.S. Department of Energy · Krell Institute',
    fields: allFields,
    stages: ['Entering Graduate Study', 'Early Graduate Study'],
    location: 'United States',
    cycle: '2027–2028 incoming cohort',
    eligibility: [
      'U.S. citizen or lawful permanent resident; full-time PhD at an accredited U.S. university by fall 2027.',
      'Seniors, first-year graduate students, and people entering graduate study may qualify. Current master’s students must move institutions for their PhD; second-year-or-later graduate students and concurrent professional doctorates are excluded. Confirm edge cases with Krell.',
      'Choose Science & Engineering or Math/Computer Science track; research must fit DOE interests.',
    ],
    requirements: [
      'Complete the track-specific online application and its research/background responses; exact portal response limits are not independently verified here.',
      'Prepare a Program of Study with an advisor; list three referees and monitor their letters.',
      'Official transcripts from every college/university must come directly from the institution; applicant-sent copies are not accepted.',
    ],
    deadlines: [
      {
        label: 'Application, transcripts, and references · cutoff time not verified',
        date: '2027-01-07',
      },
    ],
    timing:
      'Check the portal for the exact time. Approved coursework, a laboratory practicum, annual renewal and teaching restrictions apply.',
    award: 'Up to four years of support, renewed annually; review current benefits with Krell.',
    sources: [
      [
        'Eligibility and Program Rules',
        'https://www.krellinst.org/csgf/about-doe-csgf/eligibility-program-requirements',
      ],
      ['Application Checklist', 'https://www.krellinst.org/csgf/how-apply'],
      ['Application FAQ', 'https://csgf.krellinst.org/application/faq'],
    ],
  },
  {
    id: 'hertz',
    name: 'Hertz Fellowship',
    sponsor: 'Fannie and John Hertz Foundation',
    fields: ['Applied Mathematics', 'Computer Science', 'Data Science', 'Statistics'],
    stages: ['Entering Graduate Study', 'Early Graduate Study'],
    location: 'United States',
    cycle: '2027 fellowship',
    eligibility: [
      'U.S. citizen or permanent resident; full-time, in-person U.S. PhD in applied science, mathematics or engineering.',
      'Normally entering the first or second PhD year in fall 2027. Later-stage applicants must justify an exception and explain the fellowship’s exceptional benefit.',
      'Research should address important near-term societal problems; professional degrees other than a PhD are excluded, with an MD/PhD exception for the PhD portion.',
    ],
    requirements: [
      'Online application with short essays and a personal essay about creativity beyond research.',
      'Suggested lengths: short essays 250–500 words; personal essay 500–1,000 words. These are guidance, not hard limits.',
      'Four recommenders must use Hertz evaluation forms; ordinary standalone letters are not accepted.',
      'Check the portal for the complete academic-record/document checklist and current prompts.',
    ],
    deadlines: [
      { label: 'Application · October 30, exact cutoff not verified', date: '2026-10-30' },
      { label: 'Recommender evaluations · 6 p.m. Pacific', date: '2026-11-02' },
    ],
    timing: '2027 competition closed. Future-cycle dates are not verified.',
    award: 'Doctoral support; consult current award terms and participating-school arrangements.',
    sources: [
      ['Who Can Apply', 'https://www.hertzfoundation.org/hertz-fellowship/who-can-apply/'],
      ['Application FAQ', 'https://www.hertzfoundation.org/hertz-fellowship/application-help/faq/'],
      ['Application Status', 'https://www.hertzfoundation.org/hertz-fellowship/apply/'],
    ],
  },
  {
    id: 'ndseg',
    name: 'National Defense Science and Engineering Graduate Fellowship (NDSEG)',
    sponsor: 'U.S. Department of Defense',
    fields: allFields,
    stages: ['Entering Graduate Study', 'Early Graduate Study'],
    location: 'United States',
    cycle: 'FY2027',
    eligibility: [
      'U.S. citizen, national, or dual citizen; eligible science/engineering PhD research aligned with a current DoD Broad Agency Announcement (BAA).',
      'Bachelor’s must be completed by the application year; being a senior graduating the following spring is insufficient. Early graduate study is generally within the first two years; verify the detailed current rules.',
    ],
    requirements: [
      'Online academic/background information, CV, transcript PDFs, and three reference evaluation forms.',
      'Personal essay: 500 words on interests, achievements, goals and fellowship fit.',
      'Research proposal: maximum 3 pages plus 1 page of citations; identify a current BAA number and research area. Follow font/margin rules.',
      'Follow current anonymization/redaction guidance for CV, proposal, essays and awards. GRE handling and other portal fields should be confirmed in the current application.',
    ],
    deadlines: [{ label: 'Application · 5 p.m. Eastern', date: '2026-10-30' }],
    timing:
      'FY2027 deadline has passed. Sponsor pages include older examples; confirm current eligibility and portal instructions.',
    award: 'Doctoral fellowship; consult current tuition, stipend and benefits rules.',
    sources: [
      [
        'Application Requirements',
        'https://ndseg.sysplus.com/NDSEG/fellows/Application-Evaluation-Award',
      ],
      ['Current Application FAQ', 'https://ndseg.sysplus.com/NDSEG/FAQ/Application'],
      ['Competition Home', 'https://ndseg.sysplus.com/'],
    ],
  },
  {
    id: 'pd-soros',
    name: 'Paul & Daisy Soros Fellowships for New Americans',
    sponsor: 'Paul & Daisy Soros Fellowships',
    fields: allFields,
    stages: ['Entering Graduate Study', 'Early Graduate Study'],
    location: 'United States',
    cycle: '2027 fellowship · closed',
    eligibility: [
      'Age 30 or younger at the deadline; qualifying immigrant or child-of-immigrants status under the detailed New American rules.',
      'Full-time U.S. graduate study in 2027–2028; applying to graduate school or in the first two years of the degree being funded. Prior-degree and joint-program rules apply.',
      'All five GradApp subject areas can fit; this is a broader graduate award, not a math-only fellowship.',
    ],
    requirements: [
      'Online eligibility/background information, relevant transcripts, résumé/CV, and 3–5 recommendations.',
      'Two essays, each at most 1,000 words: New American experiences and their influence on your achievements; current/near-term goals and reasons for choosing your graduate programs.',
      'Confirm test-score and optional-exhibit requirements in the application; finalists document eligibility and interview.',
    ],
    deadlines: [{ label: 'Application and recommendations · 2 p.m. Eastern', date: '2026-10-29' }],
    timing:
      'Closed for 2027. Sponsor expects the 2028 application to open in spring 2027; its deadline is not yet verified.',
    award: 'Graduate support; review current stipend/tuition terms with the sponsor.',
    sources: [
      ['Detailed Eligibility', 'https://pdsoros.org/eligibility/'],
      ['Application and Essay Guidance', 'https://pdsoros.org/application-process/'],
      ['Reference Deadline', 'https://pdsoros.org/guidance-for-recommenders/'],
    ],
  },
  {
    id: 'google-phd',
    name: 'Google PhD Fellowship',
    sponsor: 'Google Research',
    fields: ['Computer Science', 'Data Science', 'Applied Mathematics', 'Statistics'],
    stages: ['Continuing PhD'],
    location: 'International / Regional Rules',
    cycle: '2026 published rules · next cycle not verified',
    eligibility: [
      'Full-time PhD in computer science or an adjacent research field; university nomination required, with no direct student applications.',
      'U.S./Canada nominees must complete graduate PhD coursework by award start. Other regions have different stage rules.',
      'Google employees and their household members, prior fellows and students with comparable industry funding are excluded; government/nonprofit funding is exempt.',
    ],
    requirements: [
      'University submits a single flat PDF in English: student CV and research/dissertation proposal, at most 3 pages excluding references.',
      'For U.S./Canada: department-chair eligibility cover sheet, advisor’s 1-page CV, transcripts, and 2–3 recommendations including the advisor.',
      'Two essays, each at most 350 words: intended research impact and motivation; a concrete leadership/collaboration experience. Other regions differ.',
    ],
    deadlines: [],
    timing:
      'Ask your department for internal nomination dates. Next sponsor deadline is not verified; do not reuse a previous deadline.',
    award: 'Regional funding and mentorship; amounts and duration vary.',
    sources: [
      [
        'Eligibility, Regional Materials, and Nomination',
        'https://research.google/programs-and-events/phd-fellowship/',
      ],
    ],
  },
  {
    id: 'cgrs-m',
    name: 'Canada Graduate Research Scholarship — Master’s (CGRS M)',
    sponsor: 'Canadian Tri-agency · NSERC route for these subjects',
    fields: allFields,
    stages: ['Entering Graduate Study', 'Early Graduate Study'],
    location: 'Canada',
    cycle: 'Published annual rules; confirm competition in Research Portal',
    eligibility: [
      'Canadian citizen, permanent resident or protected person; eligible research-oriented Canadian graduate program at an institution with an allocation.',
      'Generally 0–12 months of eligible study by December 31; direct-entry/joint doctoral exceptions require checking. First-class standing normally applies, with institutional discretion.',
      'No prior master’s-level tri-agency scholarship; only one CRTAS program application per academic year.',
    ],
    requirements: [
      'Research Portal application, CGRS M Canadian Common CV, all required transcripts, and two reference assessments.',
      'Research outline: 1 page; bibliography/citations: 1 page. Follow the prescribed presentation rules.',
      'Choose up to three eligible institutions, meet their admission deadlines, validate and review the exported application before final submission.',
    ],
    deadlines: [],
    timing:
      'Published annual deadline: December 1 before 8 p.m. Eastern (business-day adjustment applies). Confirm the cycle and institutional admissions deadlines; no year is inferred.',
    award: 'CAD 27,000 for 12 months.',
    sources: [
      [
        'Eligibility and Annual Deadline',
        'https://nserc-crsng.canada.ca/en/funding-opportunity/canada-graduate-research-scholarship-masters-program',
      ],
      [
        'Application Instructions',
        'https://nserc-crsng.canada.ca/en/canada-graduate-research-scholarship-masters-program-instructions-completing-application',
      ],
    ],
  },
  {
    id: 'cgrs-d',
    name: 'Canada Graduate Research Scholarship — Doctoral (CGRS D)',
    sponsor: 'Canadian Tri-agency · NSERC route for these subjects',
    fields: allFields,
    stages: ['Early Graduate Study', 'Continuing PhD'],
    location: 'Canada',
    cycle: 'Published annual rules; institutional deadlines vary',
    eligibility: [
      'Research-oriented doctorate; no more than 36 months of full-time equivalent doctoral study by December 31 of application year. Joint-program counting rules apply.',
      'International applicants must already be registered in an eligible Canadian doctoral program by the deadline; up to 15% of awards are available to them.',
      'One CRTAS program application per year; at most three CGRS D attempts; no previous tri-agency doctoral scholarship. Foreign tenure has additional Canadian-status/prior-degree restrictions.',
    ],
    requirements: [
      'Use NSERC for eligible mathematical/computational research; submit through the correct institution or direct-agency route based on registration status.',
      'Complete the NSERC application and its research, contributions, transcript and referee requirements; exact attachment limits are not independently verified here.',
      'References submit through the agency system. Institutional nomination/quotas may impose substantially earlier deadlines.',
    ],
    deadlines: [],
    timing:
      'Direct-agency annual deadline: October 17 before 8 p.m. Eastern, following business day if weekend. Contact your graduate school for the earlier institutional cutoff; no year is inferred.',
    award: 'CAD 40,000 per year for 36 months.',
    sources: [
      [
        'Eligibility, Routing, and Deadlines',
        'https://nserc.canada.ca/en/funding-opportunity/canada-graduate-research-scholarship-doctoral-program',
      ],
    ],
  },
];

// Topic/stage filters help research; they never imply citizenship or personal eligibility.
export function filterFellowships({ query = '', field = '', stage = '', location = '' } = {}) {
  const term = query.trim().toLowerCase();
  return fellowships.filter(
    (f) =>
      (!term ||
        [f.name, f.sponsor, ...f.fields, ...f.eligibility, ...f.requirements]
          .join(' ')
          .toLowerCase()
          .includes(term)) &&
      (!field || f.fields.includes(field)) &&
      (!stage || f.stages.includes(stage)) &&
      (!location || f.location === location),
  );
}
export function deadlineState(date, today = new Date().toISOString().slice(0, 10)) {
  return date < today ? 'Deadline Passed' : date === today ? 'Due Today' : 'Published Deadline';
}
