// Primary sources read November 23, 2026. Each field has explicit degree/program scope.
// Deadlines receive a calendar date only when the university identifies the cycle/year.
import { universityFeeChecks } from './university-fee-checks.js';
import { universityGreChecks } from './university-gre-checks.js';
import { universityDeadlineChecks } from './university-deadline-checks.js';
const fact = (value, source, scope) => ({ value, source, scope });
const mit = 'https://math.mit.edu/academics/grad/phd/admission/';
const mitOge = 'https://oge.mit.edu/programs/mathematics/';
const princeton = 'https://www.math.princeton.edu/graduate/admissions';
const princetonDates =
  'https://gradschool.princeton.edu/admission-onboarding/prepare/application-deadlines';
const stanford = 'https://mathematics.stanford.edu/academics/graduate-admissions';
const berkeley = 'https://math.berkeley.edu/node/93';
const acadia = 'https://www2.acadiau.ca/academics/graduate/mathematics-and-statistics.html';
const stanfordFacts = {
  degrees: fact(
    'External applicants: doctoral study only. Coterminal master’s admission is restricted to current Stanford undergraduates.',
    stanford,
    'Mathematics admissions; differs from a blanket interpretation of the AMS degree labels.',
  ),
  deadline: {
    ...fact(
      'December 1, 2026, 11:59 p.m. Pacific; Autumn 2027 entry.',
      stanford,
      'Doctoral mathematics only.',
    ),
    date: '2026-12-01',
    degree: 'Doctoral',
  },
  greGeneral: fact(
    'None — General scores are neither required nor accepted.',
    stanford,
    'Doctoral mathematics, Autumn 2027.',
  ),
  greMath: fact(
    'Required/expected; applicants unable to take the subject test can request the application’s test waiver.',
    stanford,
    'Doctoral mathematics, Autumn 2027; waiver is not automatic.',
  ),
  waiver: fact(
    'University fee-waiver routes exist; the mathematics department does not provide its own waivers. Request at least two weeks before the deadline.',
    stanford,
    'Application fee waiver, distinct from the GRE-test waiver.',
  ),
  timeline: fact(
    'Five years described as typical; this is not a measured cohort average.',
    stanford,
    'Mathematics PhD.',
  ),
  funding: fact(
    'Five years of full funding conditional on satisfactory progress, through fellowships and teaching/research assistantships.',
    stanford,
    'Mathematics PhD; funding duration is not a teaching load.',
  ),
  preparation: fact(
    'A bachelor’s-equivalent degree and advanced mathematics preparation are expected. A prior master’s and research experience are not prerequisites.',
    stanford,
    'Mathematics PhD.',
  ),
};
const manualChecks = {
  7906: {
    location: fact(
      'Wolfville, Nova Scotia Canada',
      acadia,
      'University address corrects AMS’s conflicting Alberta location.',
    ),
    degrees: fact(
      'Master of Pure and Applied Science in Mathematics and Statistics.',
      acadia,
      'Current degree title on the university program page.',
    ),
    areas: fact(
      'Selected topics include graph theory, number theory, cryptography, statistical learning, scientific computing and tidal-energy modeling.',
      acadia,
      'Mathematics and Statistics master’s; selected topics, not a faculty census.',
    ),
    online: fact('In-person courses.', acadia, 'Mathematics and Statistics master’s.'),
    timeline: fact(
      'Published study plan spans two years; this is not a measured graduation average.',
      acadia,
      'Mathematics and Statistics master’s.',
    ),
    milestones: fact(
      'Research seminar, electives and thesis; an internship/co-op option is described.',
      acadia,
      'Mathematics and Statistics master’s.',
    ),
  },
  2799: {
    degrees: fact(
      'PhD/ScD options; the fifth-year master’s route is for current MIT students only.',
      mitOge,
      'Mathematics; external master’s admission must not be inferred from AMS degree labels.',
    ),
    deadline: fact(
      'December 1, 11:59 p.m. Eastern; the cited deadline itself is annual, so no cycle year is inferred.',
      mitOge,
      'Doctoral mathematics. No automatic calendar date assigned.',
    ),
    greGeneral: fact(
      'None — submission is optional and omission does not penalize the application.',
      mit,
      'Doctoral mathematics.',
    ),
    greMath: fact(
      'None — subject scores are optional, though of particular interest if supplied.',
      mit,
      'Doctoral mathematics.',
    ),
    feeDomestic: fact(
      '$90 USD',
      mitOge,
      'Mathematics graduate application; current-student master’s routes may differ.',
    ),
    feeInternational: fact(
      '$90 USD',
      mitOge,
      'Mathematics graduate application; no separate international fee is listed.',
    ),
    waiver: fact(
      'Request within the application. Published waiver cutoff: November 20, 2026, earlier than the application deadline.',
      mit,
      'Doctoral mathematics; the cutoff has already passed as of this check.',
    ),
    funding: fact(
      'Five-year support conditional on satisfactory progress: tuition, stipend and individual health coverage. First year uses fellowships with no teaching duties.',
      mitOge,
      'Doctoral mathematics; later support can include TA/RA appointments.',
    ),
    preparation: fact(
      'Statement of objectives, academic record and recommendation letters are required; applicants shortlisted for admission are interviewed.',
      mit,
      'Doctoral mathematics; consult the full checklist for language requirements.',
    ),
  },
  682: {
    deadline: {
      ...fact(
        'December 15, 2026, 11:59 p.m. Eastern; Fall 2027 entry.',
        princetonDates,
        'Mathematics PhD; the Graduate School explicitly places this cycle’s deadlines in 2026.',
      ),
      date: '2026-12-15',
      degree: 'Doctoral',
    },
    greGeneral: fact('None — optional.', princeton, 'Mathematics PhD.'),
    greMath: fact('Suggested — optional but strongly recommended.', princeton, 'Mathematics PhD.'),
    timeline: fact(
      'Four-year program; a fifth year is usually available for satisfactory progress and additional need. Not a measured average.',
      princeton,
      'Mathematics PhD.',
    ),
    preparation: fact(
      'Academic-purpose statement, personal statement, CV, transcripts and three recommendation letters.',
      princeton,
      'Mathematics PhD; separate application for applied/computational mathematics.',
    ),
  },
  455: {
    deadline: {
      ...fact(
        'December 15, 2026, 11:59 p.m. Eastern; Fall 2027 entry.',
        princetonDates,
        'Applied and Computational Mathematics PhD, not the separate mathematics department.',
      ),
      date: '2026-12-15',
      degree: 'Doctoral',
    },
  },
  6270: stanfordFacts,
  2528: stanfordFacts,
  2538: {
    degrees: fact(
      'External mathematics/applied-mathematics applicants apply to the PhD. The simultaneous MA route is restricted to existing Berkeley doctoral students.',
      berkeley,
      'Mathematics department; do not interpret the AMS MA label as open external admission.',
    ),
    deadline: {
      ...fact(
        'December 1, 2026, 8:59 p.m. Pacific; Fall 2027 doctoral entry.',
        berkeley,
        'Mathematics/Applied Mathematics PhD; separate existing-student MA rules apply.',
      ),
      date: '2026-12-01',
      degree: 'Doctoral',
    },
    greGeneral: fact(
      'None — optional; only the mathematics subject test is required.',
      berkeley,
      'Fall 2027 mathematics/applied mathematics PhD.',
    ),
    greMath: fact(
      'Required. ETS institution code 4833; no department-specific reporting code.',
      berkeley,
      'Fall 2027 mathematics/applied mathematics PhD.',
    ),
    waiver: fact(
      'International fee-waiver requests cannot be accommodated for Fall 2027. Domestic applicants should check Graduate Division eligibility.',
      berkeley,
      'Mathematics department, Fall 2027; not a university-wide claim for every program.',
    ),
    preparation: fact(
      'Preparation comparable to a mathematics/applied-mathematics major; three recommendations, transcripts and two statements.',
      berkeley,
      'Mathematics/Applied Mathematics PhD.',
    ),
  },
};

export const universityChecks = Object.fromEntries(
  [
    ...new Set([
      ...Object.keys(universityFeeChecks),
      ...Object.keys(universityGreChecks),
      ...Object.keys(universityDeadlineChecks),
      ...Object.keys(manualChecks),
    ]),
  ].map((id) => [
    id,
    {
      ...universityFeeChecks[id],
      ...universityGreChecks[id],
      ...universityDeadlineChecks[id],
      ...manualChecks[id],
    },
  ]),
);
