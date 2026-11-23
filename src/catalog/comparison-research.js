// Research expansion: official university/department pages checked November 7, 2026.
// Field text preserves scope and reporting period; expectations, caps and funding are not averages.
const fact = (
  text,
  url,
  kind = 'Published program information',
  period = 'Reporting period not stated',
) => [text, url, { checkedOn: '2026-11-07', kind, period }];
const au = 'https://auburn.edu/cosam/departments/math/assets/dms_math_graduate_handbook_25.pdf';
const bc =
  'https://www.bc.edu/content/bc-web/schools/morrissey/departments/math/graduate/phd-program.html';
const bgsu =
  'https://www.bgsu.edu/arts-and-sciences/mathematics-and-statistics/graduate-programs/frequently-asked-questions';
const byu = 'https://math.byu.edu/graduate-student-handbook';
const bap =
  'https://appliedmath.brown.edu/sites/default/files/2021-01/Graduate%20Handbook%20in%20Applied%20Mathematics%20-%20Summer%202025%20Revision.pdf';
const bryn =
  'https://www.brynmawr.edu/gsas/student-support/renewing-financial-support/financial-support-chemistry-mathematics-physics';
const cmu = 'https://www.cmu.edu/math/grad/phd/requirements.html';
const central =
  'https://www.cmich.edu/docs/default-source/colleges/college-of-science-and-engineering/mathematics/graduate-handbook-2026-27.pdf?Status=Master&sfvrsn=64ae36d4_4';
const cgu = 'https://www.cgu.edu/academics/program/phd-mathematics/';
const clark = 'https://www.clarkson.edu/academics/majors-minors/mathematics-phd';
const clem =
  'https://www.clemson.edu/science/_pdfs/academics/mathstat/math-grad-student-handbook-25-26.pdf';
const csu =
  'https://mathematics.colostate.edu/wp-content/uploads/sites/15/2026/03/march-2026-edition-graduate-program-handbook-mathematics.pdf';
const cuny = 'https://www.gc.cuny.edu/sites/default/files/2024-10/mathfest-2024-flyer.pdf';
export const comparisonResearch = {
  auburn: {
    faculty: fact(
      'About 50 professors across Mathematics and Statistics, including interdisciplinary work; not a pure-Math-only count.',
      'https://cosam.auburn.edu/math/students/grad/how-to-apply.php',
      'Reported department count',
    ),
    timeline: fact(
      'Department expects PhD completion within 6 years; combined MS→PhD within 7 years. Expectations, not measured averages.',
      au,
      'Expected timeline',
      '2025 handbook',
    ),
    teaching: fact(
      'GTA appointments: 0.33 FTE teaches 8 credit-hours per academic year; 0.50 FTE teaches 12, or equivalent grading/tutoring duties. Teaching training required.',
      au,
      'Assistantship workload',
      '2025 handbook',
    ),
    funding: fact(
      'Competitive GTA support for PhD students in good standing; renewed annually for satisfactory progress and duties. No universal award guarantee.',
      au,
      'Conditional support',
      '2025 handbook',
    ),
    milestones: fact(
      'Coursework, written preliminary requirements, oral examination, dissertation and final defense. Handbook/catalog differ on written-exam count; confirm the current sequence.',
      au,
      'Degree requirements / source discrepancy',
      '2025 handbook',
    ),
    research: fact(
      'Pure and applied mathematics, statistics and interdisciplinary mathematics.',
      'https://cosam.auburn.edu/math/students/grad/how-to-apply.php',
    ),
  },
  baylor: {
    teaching: fact(
      'From year 2, students typically teach one three-credit undergraduate course per semester as teacher of record, with seminars and faculty mentoring.',
      'https://math.artsandsciences.baylor.edu/graduate-program/teaching-opportunities',
      'Typical teaching assignment',
    ),
    funding: fact(
      'For entrants from 2024 onward, support is capped at 5 years, contingent on satisfactory progress and assigned duties. Earlier entrants have different provisions.',
      'https://math.artsandsciences.baylor.edu/graduate-program/guidelines-doctoral-students',
      'Conditional funding limit',
      'Policy distinguishes 2024+ entrants',
    ),
    milestones: fact(
      '72 graduate semester hours; qualifying exams in two core areas, preliminary examination, dissertation and defense; no foreign-language requirement.',
      'https://catalog.baylor.edu/graduate-school/curriculum-departments-institutes-instruction/college-arts-sciences/mathematics/mathematics-phd/mathematics-phd.pdf',
      'Degree requirements',
      '2025–26 catalog',
    ),
  },
  binghamton: {
    faculty: fact(
      '30 tenured/tenure-track faculty, plus other appointments in Mathematics and Statistics.',
      'https://www2.math.binghamton.edu/p/hiring?do=export_pdf',
      'Reported department count',
      'Hiring-page snapshot dated Feb 12, 2026',
    ),
    size: fact(
      '60 graduate students across Mathematics and Statistics; combines graduate programs, not just PhD entrants.',
      'https://www2.math.binghamton.edu/p/hiring?do=export_pdf',
      'Reported department count',
      'Hiring-page snapshot dated Feb 12, 2026',
    ),
    funding: fact(
      'Most full-time PhD students receive teaching assistantships or research fellowships; MA/MS students normally do not receive department support.',
      'https://www2.math.binghamton.edu/p/gd?do=export_pdf',
      'Conditional support',
      'Department page snapshot Sept 2025',
    ),
    research: fact(
      'Algebra, analysis, combinatorics, geometry/topology and statistics; graduate coursework spans at least three concentration areas.',
      'https://www.binghamton.edu/apps/academics/program/gd/mathematical-sciences',
    ),
    preparation: fact(
      'Department may waive the application fee for a limited number of qualified PhD candidates: upload application documents, then send the program a justified request.',
      'https://www.binghamton.edu/apps/academics/program/gd/mathematical-sciences',
      'Application process',
    ),
  },
  boise: {
    timeline: fact(
      'About 4–5 years full-time after a bachelor’s; as few as 3 after a master’s. Part-time study generally exceeds 5 years. Program estimates, not measured means.',
      'https://www.boisestate.edu/computing/academics/doctoral-program/frequently-asked-questions/',
      'Estimated timeline',
    ),
    funding: fact(
      'Limited first-year Computing GAs: published $28,000/year stipend, fall/spring tuition and full-year health insurance. Faculty advisor/funding plan required by first semester’s end; funding is not guaranteed.',
      'https://www.boisestate.edu/computing/academics/doctoral-program/graduate-assistantships/',
      'Competitive first-year package',
      'Annual amount published without award year',
    ),
    teaching: fact(
      'Program GAs may be teaching or research appointments. Teaching positions support undergraduate instruction; exact CMSE teaching load is not specified on the funding page.',
      'https://www.boisestate.edu/computing/academics/doctoral-program/graduate-assistantships/',
      'Appointment types; load unverified',
    ),
    preparation: fact(
      'CMSE emphasis requires upper-division differential equations and linear algebra. Computing applicants must document programming experience.',
      'https://www.boisestate.edu/computing/academics/doctoral-program/computational-math-science-and-engineering/computational-math-science-and-engineering-ph-d/',
      'Emphasis prerequisites',
    ),
    milestones: fact(
      'Comprehensive examination assesses readiness for the scientific research process, including a computing artifact; consult the current catalog for credit/dissertation requirements.',
      'https://www.boisestate.edu/computing/academics/doctoral-program/comprehensive-exam/',
      'Program examination',
    ),
    research: fact(
      'Interdisciplinary Computing PhD with a Computational Math, Science & Engineering emphasis; mathematical and computational research can be supervised by mathematics faculty.',
      'https://www.boisestate.edu/math/grad/',
      'Program scope; not standalone Math PhD',
    ),
  },
  'boston-college': {
    research: fact(
      'Geometry/topology/dynamics; number theory and representation theory; algebraic geometry. Includes knot theory, Langlands-related topics and moduli spaces.',
      bc,
    ),
    teaching: fact(
      'Year 1 TAs assist lectures/recitations; subsequent TFs normally teach one core mathematics section each semester. About 15 hours/week; weekly teaching seminar required.',
      bc,
      'Typical TA/TF workload',
    ),
    funding: fact(
      'Qualified students receive stipend and tuition remission; support anticipated through year 5 given academic progress and satisfactory TA/TF performance. Stipend paid over 9 academic months.',
      bc,
      'Conditional five-year support',
    ),
    preparation: fact(
      'At least a year of abstract algebra and a year of real/complex analysis; three recommendations, transcripts and a mathematics-course abstract.',
      bc,
      'Selected preparation / application requirements',
    ),
  },
  'boston-university': {
    faculty: fact(
      'Approximately 60 faculty, with postdocs listed separately, across the combined Mathematics & Statistics department.',
      'https://www.bu.edu/math/about/',
      'Reported department count',
    ),
    size: fact(
      'Over 100 graduate students across Mathematics & Statistics programs; not a Mathematics-PhD-only census.',
      'https://www.bu.edu/math/about/',
      'Reported department count',
    ),
    funding: fact(
      'Five years of stipend support, full tuition scholarship and a health-insurance credit for PhD students in good standing; department support combines fellowships, teaching and research.',
      'https://www.bu.edu/grad/why-bu/phd-education/',
      'Conditional university PhD guarantee',
    ),
    milestones: fact(
      '16 semester courses at 500+, including at least 8 at 700+; preliminary and oral qualifying exams, dissertation and defense. Oral qualification expected by summer after year 3.',
      'https://www.bu.edu/math/phd-in-mathematics/',
      'Degree requirements',
    ),
  },
  'bowling-green': {
    timeline: fact(
      'Bachelor’s-entry PhD students follow a 6-year plan that includes a master’s. Planned route, not a reported graduation average.',
      bgsu,
      'Program plan',
    ),
    teaching: fact(
      'Most funded TAs teach either one 5-credit course or two 3-credit courses each semester, coordinated by senior faculty.',
      bgsu,
      'Typical assistantship workload',
    ),
    funding: fact(
      'Approximately 55 department teaching-assistant positions with about 20 openings annually; competitive, not student headcount. Fall/spring appointments, with summer opportunities.',
      bgsu,
      'Assistantship capacity, not enrollment',
    ),
    preparation: fact(
      'Advanced undergraduate/master’s analysis and algebra sequences especially important; transcripts, statement and three recommendations. GRE optional in current FAQ.',
      bgsu,
      'Selected preparation / application requirements',
    ),
  },
  byu: {
    average: fact(
      'Department reports an average of 4 years for PhD students in a program described as about 4 years beyond a master’s. Cohort and measurement period unspecified.',
      byu,
      'Department-reported average',
      'Post-master’s context; cohort unspecified',
    ),
    timeline: fact(
      'About 4 years beyond a master’s, per department handbook; this is not a bachelor’s-to-PhD estimate.',
      byu,
      'Program expectation',
    ),
    size: fact(
      'About 35 graduate students in the department, including 10–15 PhD students supported by the department. Census year not stated.',
      byu,
      'Reported program counts',
    ),
    research: fact(
      'Applied math, algebraic geometry, geometric analysis, dynamics, number theory, topology, mathematical biology and group theory.',
      byu,
    ),
    funding: fact(
      'Department generally offers admitted students full tuition and a published PhD stipend of roughly $22,500/year, in exchange for part-time TA/RA work. Confirm the award year and offer.',
      'https://math.byu.edu/financial-support-and-employment',
      'Published annual package; not guaranteed offer',
    ),
    teaching: fact(
      'TA assignments may include office hours, grading and supplementary lectures; RA duties depend on the project. Exact weekly load not verified.',
      'https://math.byu.edu/financial-support-and-employment',
      'Appointment duties',
    ),
    milestones: fact(
      '54 credits: at least 36 coursework and 18 dissertation; breadth across algebra/analysis/applied mathematics plus examination and dissertation requirements.',
      'https://math.byu.edu/programdetails',
      'Degree requirements',
    ),
  },
  'brown-math': {
    funding: fact(
      'Admission promises 5 years of support; first year fellowship, then ordinarily teaching assistantships from year 2. Confirm summer arrangements in the offer.',
      'https://mathematics.brown.edu/graduate/phd-program-description',
      'Conditional program support',
    ),
    milestones: fact(
      'Coursework, qualifying/candidacy requirements and original dissertation. Teaching is part of doctoral preparation, including at least two TA semesters.',
      'https://mathematics.brown.edu/graduate/graduate-program-handbook',
      'Degree requirements',
    ),
  },
  'brown-applied': {
    size: fact(
      'Around 50 PhD students, many pursuing interdisciplinary projects; census year not specified.',
      'https://graduateprograms.brown.edu/graduate-program/applied-mathematics-phd',
      'Reported PhD headcount',
    ),
    research: fact(
      'Dynamics/PDEs, control, probability/stochastic processes, numerical analysis/scientific computing, fluids, computational biology, statistics and pattern theory.',
      'https://graduateprograms.brown.edu/graduate-program/applied-mathematics-phd',
    ),
    funding: fact(
      'Full support for 5 years, including summer support and health benefits.',
      'https://appliedmath.brown.edu/academics/graduate-program/prospective-phd-students',
      'Published support package',
    ),
    teaching: fact(
      'Two semester-long TA courses required unless exempted, normally during year 2.',
      bap,
      'Degree teaching requirement',
      'Summer 2025 handbook revision',
    ),
    timeline: fact(
      'Handbook organizes coursework/prelim in years 1–2 and research/dissertation in years 3–5. Curriculum plan, not measured mean time to degree.',
      bap,
      'Program plan',
      'Summer 2025 handbook revision',
    ),
    milestones: fact(
      'Eight courses, preliminary oral exam, two teaching semesters, dissertation and oral defense; consult the handbook for current course/unit rules.',
      'https://graduateprograms.brown.edu/graduate-program/applied-mathematics-phd',
      'Degree requirements',
    ),
  },
  'bryn-mawr': {
    faculty: fact(
      '8 profiles on the Graduate Program Faculty roster, counted Nov 7, 2026; roster count, not an institutional faculty census.',
      'https://www.brynmawr.edu/gsas/academics/phd-program-mathematics/faculty',
      'Counted graduate-faculty roster',
      'Roster accessed Nov 7, 2026',
    ),
    research: fact(
      'Analysis/number theory, topology, commutative algebra/combinatorics, dynamics, mathematical biology and statistical machine learning, as listed by graduate faculty.',
      'https://www.brynmawr.edu/gsas/academics/phd-program-mathematics/faculty',
    ),
    funding: fact(
      'Up to 6 years of fellowships/assistantships, subject to annual progress review; tuition awards and health-insurance subsidies. 2025–26 academic-year TA stipend listed as $33,500; newer overview quotes $40,000–45,000 for 2026–27 GSAS packages, so confirm your offer.',
      bryn,
      'Conditional package; published-year amounts differ',
      'TA detail page 2025–26; GSAS overview 2026–27',
    ),
    teaching: fact(
      'TA appointments carry a maximum 17.5 hours/week of assigned duties. Course load capped at two units/semester for TAs.',
      bryn,
      'Assistantship workload cap',
      'Published 2025–26 terms',
    ),
    milestones: fact(
      'Doctoral coursework includes supervised work; preliminary examinations follow proficiency in three principal mathematical areas, then dissertation and defense.',
      'https://www.brynmawr.edu/gsas/academics/phd-program-mathematics/degree-requirements',
      'Degree requirements',
    ),
  },
  caltech: {
    funding: fact(
      'Five years of support for satisfactory progress; generally academic-year TA support and summer RA or department fellowship.',
      'https://mathematics.caltech.edu/academics/graduate-studies/admissions-and-financial-support',
      'Conditional five-year support',
    ),
    milestones: fact(
      'Candidacy exam expected by the end of year 3: oral presentation of proposed thesis research to a faculty committee.',
      'https://mathematics.caltech.edu/academics/graduate-studies/math-candidacy-faqs',
      'Candidacy milestone',
    ),
    research: fact(
      'Research spans mathematical physics, geometry and topology, with collaboration across fields. See the department’s research groups for the full portfolio.',
      'https://mathematics.caltech.edu/',
    ),
    teaching: fact(
      'Graduate teaching assistantships generally provide academic-year support; a universal number of TA semesters/hours is not verified on the admissions page.',
      'https://mathematics.caltech.edu/academics/graduate-studies/admissions-and-financial-support',
      'Support mechanism; exact load unverified',
    ),
  },
  'carnegie-mellon': {
    funding: fact(
      'Students with satisfactory degree progress and teaching performance can expect 5 years of support; a sixth year is considered individually.',
      cmu,
      'Conditional support duration',
    ),
    milestones: fact(
      'Breadth in 4 of 6 areas by semester 5; at least 2 basic exams by semester 3; advanced coursework, oral qualifying examination and thesis.',
      cmu,
      'Degree milestones',
    ),
    research: fact(
      'Algebra, analysis, discrete mathematics, logic, probability and topology appear in the breadth curriculum; consult research groups for active specializations.',
      cmu,
      'Curricular breadth; not complete research inventory',
    ),
  },
  'case-western': {
    funding: fact(
      'Department awards several TA/RA positions annually. TA recipients assist with instruction; tuition is waived and stipend depends on the award.',
      'https://mathstats.case.edu/admission/financial-aid/',
      'Competitive department support',
    ),
    teaching: fact(
      'Department/grant-funded PhD students perform teaching or research duties, potentially grading, tutoring or teaching a class; exact assignment varies.',
      'https://artscimedia.case.edu/wp-content/uploads/sites/41/2025/08/28174803/MAMS-Grad-Handbook-2025.pdf',
      'Funded-student duties',
      '2025 MAMS handbook',
    ),
    milestones: fact(
      '36 approved course credits with at least a B average, qualifying/candidacy requirements, original dissertation and defense.',
      'https://bulletin.case.edu/arts-sciences/mams/mathematics-phd/',
      'Degree requirements',
    ),
    research: fact(
      'Algebraic/differential geometry, analysis, category theory, convexity and probability are among the published research areas.',
      'https://case.edu/programs/mathematics-phd',
    ),
    preparation: fact(
      'Bachelor’s degree, statement of purpose/personal statement, unofficial transcripts; program page lists general and mathematics GRE as optional but preferred.',
      'https://case.edu/programs/mathematics-phd',
      'Selected application requirements',
    ),
  },
  'central-michigan': {
    teaching: fact(
      'Doctoral GTAs normally teach two sections one semester and one the other, or two per semester depending on appointment; mandatory GTA workshop. Separate two-semester teaching internships are part of the PhD curriculum.',
      central,
      'Assistantship / curricular teaching',
      '2026–27 handbook',
    ),
    funding: fact(
      'Department assistantships/fellowships are competitive; eligible doctoral support lasts at most 6 years, not a universal guarantee.',
      central,
      'Conditional funding cap',
      '2026–27 handbook',
    ),
    milestones: fact(
      '75 credit hours; Mathematics or Collegiate Mathematics Education concentration; two semester-long teaching internships and a year of college-math instruction coursework.',
      'https://www.cmich.edu/program/mathematical-sciences-phd',
      'Program requirements',
    ),
    research: fact(
      'Pure and applied mathematics and collegiate mathematics education, with concentrations offering different research/teaching emphases.',
      'https://www.cmich.edu/academics/colleges/college-science-engineering/departments-schools/mathematics/graduate-programs/information-for-mathematics-graduate-students',
    ),
  },
  claremont: {
    timeline: fact(
      'Estimated 3–5 years full-time; seven-year dissertation deadline. Estimate and maximum, not a measured average.',
      cgu,
      'Estimated timeline / degree limit',
    ),
    faculty: fact(
      'Approximately 60 mathematics faculty across all seven Claremont Colleges, many available to teach/advise graduate students; consortium count, not CGU-only.',
      'https://www.cgu.edu/school/institute-of-mathematical-sciences/faq/',
      'Reported consortium faculty count',
    ),
    research: fact(
      'Applied mathematics, computation, statistics, financial engineering and industrial modeling; faculty include broader consortium specialties.',
      cgu,
    ),
    milestones: fact(
      '72 coursework units, written qualifying exam, two preliminary exams, computational-tool or foreign-language proficiency, dissertation proposal/candidacy and final oral defense.',
      cgu,
      'Degree requirements',
    ),
    preparation: fact(
      'Generally a mathematics bachelor’s degree; relevant engineering/science preparation considered for computational/applied mathematics.',
      'https://www.cgu.edu/school/institute-of-mathematical-sciences/faq/',
      'Program preparation',
    ),
    funding: fact(
      'CGU lists external doctorate fellowships relevant to mathematics. A universal full-tuition/stipend guarantee was not verified; request the specific award terms.',
      'https://my.cgu.edu/financial-aid/applying-for-aid/external-funding/doctorate-funding/doctorate-math-iss-botany/',
      'External opportunities; standard package unverified',
    ),
  },
  clarkson: {
    research: fact(
      'Applied optimization/statistics, biomathematics, control, computational mathematics, data-driven science, dynamics/complex systems and image processing.',
      clark,
    ),
    funding: fact(
      'TA/RA awards are competitive with limited positions; most current students are supported. TA funding may continue up to 5 years for satisfactory progress; confirm the individual offer.',
      clark,
      'Conditional support',
    ),
    milestones: fact(
      '90 credits; subject exams, thesis proposal and dissertation/defense. First subject exam due by semester 4, second by semester 6.',
      clark,
      'Degree requirements',
    ),
    preparation: fact(
      'BS/MS in mathematics or a closely related field; proof-based mathematics and coding experience expected. GRE policy depends on prior degree; check the current program instructions.',
      clark,
      'Selected preparation',
    ),
  },
  clemson: {
    teaching: fact(
      'School assistantships involve teaching or assisting a maximum of 10 course credit-hours per year.',
      clem,
      'Assistantship workload cap',
      '2025–26 Mathematics handbook',
    ),
    funding: fact(
      'All incoming students considered for assistantships; published 9-month stipend $25,000, rising to $26,000 after milestones; summer up to $5,000 if available. Tuition remission/reduction; fees remain.',
      clem,
      'Competitive published package',
      '2025–26 Mathematics handbook',
    ),
    research: fact(
      'Algebra/discrete math, analysis, computational mathematics, operations research, statistics/probability and applied statistics/data science.',
      clem,
    ),
    milestones: fact(
      'Breadth and concentration coursework, preliminary/comprehensive requirements, original dissertation and defense; consult the Mathematics track handbook for current details.',
      clem,
      'Degree requirements',
      '2025–26 Mathematics handbook',
    ),
  },
  mines: {
    research: fact(
      'Computational/applied mathematics, statistics and data science with interdisciplinary Bio, Geo, Data and Risk applications.',
      'https://ams.mines.edu/',
    ),
    funding: fact(
      'AMS PhD students are typically funded through teaching/research assistantships and fellowships; small research-support awards also available. Confirm duration and stipend in the offer.',
      'https://ams.mines.edu/research/research-support/',
      'Typical support mechanisms',
    ),
    teaching: fact(
      'Teaching assistants/student instructors must take MATH 589, Applied Mathematics and Statistics Teaching Seminar. Course assignment/hour load not verified.',
      'https://proceduresmanual.mines.edu/graduate/programs/ams/',
      'Appointment-specific teaching training',
    ),
    milestones: fact(
      'PhD specializations include computational/applied mathematics and statistics; core coursework, qualifying examinations, research and dissertation requirements vary by specialty.',
      'https://proceduresmanual.mines.edu/graduate/programs/ams/',
      'Degree structure',
    ),
  },
  'colorado-state': {
    size: fact(
      'Approximately 70 Mathematics graduate students across programs; not a PhD-only census.',
      csu,
      'Reported department count',
      'March 2026 handbook',
    ),
    teaching: fact(
      'GTA duties may take up to 20 hours/week (department ideal: no more than 18 on average), through Calculus Center work or teaching calculus sections.',
      csu,
      'Assistantship workload cap',
      'March 2026 handbook',
    ),
    milestones: fact(
      '72 credit-hour PhD program; coursework, graduate breadth seminars, preliminary examination and original dissertation.',
      'https://mathematics.colostate.edu/graduate-students/phd-program/phd-in-mathematics/',
      'Degree requirements',
    ),
  },
  columbia: {
    faculty: fact(
      '51 faculty (27 senior, 24 junior) in the combined Columbia–Barnard department; 19 adjuncts and 8 postdoctoral fellows/scientists listed separately. Census year unspecified.',
      'https://www.math.columbia.edu/research/overview/',
      'Reported combined-department count',
    ),
    size: fact(
      '59 PhD students, per combined department research overview; census year not stated.',
      'https://www.math.columbia.edu/research/overview/',
      'Reported PhD count',
    ),
    teaching: fact(
      'Four years as a teaching assistant or instructor beginning in year 2.',
      'https://www.math.columbia.edu/programs-math/graduate-program/',
      'Program teaching requirement',
    ),
    funding: fact(
      'Doctoral students generally receive 5 years of full fellowship support, with four years of teaching participation.',
      'https://www.gsas.columbia.edu/content/mathematics',
      'Published program support',
    ),
    research: fact(
      'Algebraic geometry, geometry/analysis, mathematical physics, number theory, probability and topology are represented in research groups.',
      'https://www.math.columbia.edu/research/overview/',
    ),
  },
  'cornell-applied': {
    funding: fact(
      'Full-time CAM students guaranteed 5 years of funding for satisfactory academic progress; support can combine fellowships, teaching and research appointments.',
      'https://cam.cornell.edu/academics/tuition-and-financial-support/',
      'Conditional five-year guarantee',
    ),
    faculty: fact(
      'Interdepartmental field draws faculty from 14 departments across four colleges/schools; this is not a standalone mathematics-department headcount.',
      'https://cam.cornell.edu/academics/phd-program/',
      'Interdepartmental structure; headcount unverified',
    ),
    preparation: fact(
      'Advanced undergraduate analysis and algebra expected; missing preparation may need to be remedied.',
      'https://courses.cornell.edu/programs/applied-mathematics-phd/applied-mathematics-phd.pdf',
      'Program prerequisites',
    ),
    milestones: fact(
      'Special-committee-directed coursework/research, admission-to-candidacy A-exam and dissertation. Requirements reflect Cornell’s interdepartmental field system.',
      'https://cam.cornell.edu/academics/phd-program/',
      'Degree structure',
    ),
  },
  'cornell-math': {
    funding: fact(
      'Full support for students making satisfactory progress and fulfilling assistantship responsibilities; department expects completion in 5 years. Funding expectation is not measured completion time.',
      'https://math.cornell.edu/graduate-funding',
      'Conditional support',
    ),
    teaching: fact(
      'MATH 6080 Teaching and Learning Mathematics required in the first spring semester; TA appointments have additional teaching-development requirements. Exact universal TA-semester count not verified.',
      'https://math.cornell.edu/milestones-phd-degree-mathematics',
      'Teaching development requirement',
    ),
    milestones: fact(
      'Graduate coursework and special committee; A-exam/admission to candidacy, original dissertation and final B-exam; teaching development also required.',
      'https://math.cornell.edu/milestones-phd-degree-mathematics',
      'Degree milestones',
    ),
  },
  cuny: {
    faculty: fact(
      'Over 90 faculty across the CUNY Mathematics doctoral network; historical Fall 2024 outreach figure, not a 2026 census.',
      cuny,
      'Historical consortial faculty count',
      'Fall 2024 Mathfest flyer',
    ),
    size: fact(
      '80 graduate students in the Mathematics program, per Fall 2024 Mathfest flyer; historical snapshot.',
      cuny,
      'Historical program count',
      'Fall 2024 Mathfest flyer',
    ),
    research: fact(
      'Algebra/topology, arithmetic geometry, analysis/PDE, dynamics, logic/set theory, probability, number theory, combinatorics and cryptography.',
      cuny,
    ),
    funding: fact(
      'Mathematics states all students receive 5 years of tuition support; many also receive a Graduate Center Fellowship. Tuition support is not a universal living-stipend guarantee.',
      'https://www.gc.cuny.edu/mathematics',
      'Program tuition-support policy',
    ),
    teaching: fact(
      'The common Graduate Center five-year fellowship involves one class/semester in years 2–4. This is university fellowship policy; the individual Math award may differ.',
      'https://www.gc.cuny.edu/student-life/what-expect-graduate-student',
      'University fellowship workload; award-specific',
    ),
    milestones: fact(
      'Doctoral coursework and qualifying/level examinations, followed by dissertation research and defense; see Mathematics curriculum for current exam areas.',
      'https://www.gc.cuny.edu/mathematics/curriculum-and-degree-information',
      'Degree structure',
    ),
  },
  dartmouth: {
    funding: fact(
      'Admitted PhD students offered a Dartmouth Fellowship or other grant for up to 5 years, contingent on progress; verify stipend, health coverage and renewal in the offer.',
      'https://hopper.dartmouth.edu/graduate-students/appl-info/',
      'Conditional program support',
    ),
    preparation: fact(
      'Three recommendations (up to four accepted), transcripts, essay and an upper-level mathematics course/textbook list. General and Math GRE optional.',
      'https://graduate.dartmouth.edu/admissions/programs/mathematics',
      'Selected application requirements',
    ),
  },
};
// Further verified research, milestones and scoped university policies.
comparisonResearch.auburn.preparation = fact(
  'GRE General recommended but not required; consult the department’s current checklist for transcripts, recommendations and English-proficiency evidence.',
  'https://cosam.auburn.edu/math/students/grad/how-to-apply.php',
  'Selected application requirements',
);
comparisonResearch.auburn.milestones[2].additionalSources = [
  'https://bulletin.auburn.edu/thegraduateschool/graduatedegreesoffered/mathematicsandstatisticsmsmammpsphd_major/mathematicsandstatisticsmsmammpsphd_major.pdf',
];
comparisonResearch.baylor.research = fact(
  'Algebra, analysis, applied/computational mathematics, differential equations, mathematical physics, numerical analysis, operator theory, topology and representation theory.',
  'https://math.artsandsciences.baylor.edu/research',
);
comparisonResearch.binghamton.preparation = fact(
  'Substantial graduate training can permit direct PhD entry without an MA. Coursework spans at least three concentration areas; consult the current admissions checklist.',
  'https://www.binghamton.edu/apps/academics/program/gd/mathematical-sciences',
  'Preparation / entry route',
);
comparisonResearch.binghamton.timeline = fact(
  'MA typically takes 2 years; PhD work is expected to take another 3–4 years after the MA for bachelor’s-entry students. Varies with background/dissertation; not a measured mean.',
  'https://www.binghamton.edu/math/graduate/mathematical-sciences.html',
  'Expected entry-route timeline',
);
comparisonResearch.binghamton.teaching = fact(
  'University full-time GA/TA appointments (0.50 FTE) involve about 20 hours/week; half appointments about 10. Math-specific course assignment varies.',
  'https://www.binghamton.edu/operations/policies/policy-614.html',
  'University appointment policy',
  'Policy revised Nov 17, 2025',
);
comparisonResearch.binghamton.milestones = fact(
  'Beyond the master’s: written foundational examination, oral admission-to-candidacy exam and PhD dissertation; advisor matching is by mutual agreement.',
  'https://www.binghamton.edu/math/graduate/mathematical-sciences.html',
  'Degree milestones',
);
comparisonResearch['boston-college'].milestones = fact(
  'At least 50 graduate credit-hours; two qualifying exams, French/German translation exam, doctoral comprehensive exam, teaching seminars and original dissertation/public defense.',
  'https://www.bc.edu/content/bc-web/schools/morrissey/departments/math/graduate/phd-program/phd-requirements.html',
  'Degree requirements',
);
comparisonResearch['boston-university'].research = fact(
  'Applied mathematics, dynamical systems, geometry and physics, number theory, and probability/statistics are department research strengths.',
  'https://www.bu.edu/math/research/',
);
comparisonResearch['boston-university'].teaching = fact(
  'Department PhD support combines university fellowships, teaching fellowships and research grants. A universal Math TA-semester/hour requirement was not verified on the program page.',
  'https://www.bu.edu/math/phd-in-mathematics/',
  'Teaching support mechanism; load unverified',
);
comparisonResearch['bowling-green'].research = fact(
  'Mathematics doctoral study includes algebra, real/complex analysis, topology, PDEs and probability; faculty also work in applied/numerical mathematics.',
  'https://www.bgsu.edu/arts-and-sciences/mathematics-and-statistics/graduate-programs/phd-programs',
  'Curricular and research breadth',
);
comparisonResearch['bowling-green'].milestones = fact(
  '90 graduate credit-hours beyond the bachelor’s; core/breadth sequences, original research and doctoral dissertation.',
  'https://www.bgsu.edu/content/bgsu/en/academics/graduate/mathematics-doctorate.html',
  'Degree structure',
);
comparisonResearch.byu.preparation = fact(
  'Application includes a $50 fee; the Mathematics department cannot waive it. Ecclesiastical endorsement required; consult the page for interviews and prerequisites.',
  'https://math.byu.edu/applications-deadlines',
  'Selected application requirements',
);
comparisonResearch['brown-math'].research = fact(
  'Algebra/arithmetic geometry, analysis, geometry and topology, with connections among number theory, geometric methods and mathematical physics.',
  'https://mathematics.brown.edu/research',
);
comparisonResearch['bryn-mawr'].funding[2].additionalSources = [
  'https://www.brynmawr.edu/gsas/admissions-aid',
];
comparisonResearch.caltech.research = fact(
  'Algebra/algebraic geometry, analysis, combinatorics, geometry/topology, logic, number theory, probability, mathematical physics, quantum structures and mathematics/machine learning.',
  'https://mathematics.caltech.edu/research/research-areas',
);
comparisonResearch.caltech.timeline = fact(
  'Graduation expected by June of year 5; summer support after that is not covered. Department expectation, not measured average.',
  'https://mathematics.caltech.edu/academics/graduate-studies/admissions-and-financial-support',
  'Expected timeline',
);
comparisonResearch.caltech.preparation = fact(
  'GRE General and Subject scores are neither required nor considered, according to the Mathematics admissions page.',
  'https://mathematics.caltech.edu/academics/graduate-studies/admissions-and-financial-support',
  'Selected testing policy',
);
comparisonResearch['colorado-state'].research = fact(
  'Algebraic geometry, combinatorics, computational science, mathematical physics, number theory and topology; applications include imaging, biology, geosciences, data science and cybersecurity.',
  'https://mathematics.colostate.edu/research/',
);
comparisonResearch['colorado-state'].funding = fact(
  'Graduate assistantships include full tuition waiver; handbook lists stipend levels $21,852 entering and $23,058 after Part B of the qualifying system. Confirm appointment period, fees and final offer.',
  csu,
  'Published assistantship terms',
  'March 2026 handbook',
);
comparisonResearch.columbia.teaching = fact(
  'Four years of TA/instructor service from year 2, including at least one semester as primary instructor; remaining semesters as TA.',
  'https://www.math.columbia.edu/programs-math/graduate-program/',
  'Degree teaching requirement',
);
comparisonResearch.columbia.milestones = fact(
  'Written exams on first-year core courses; oral exam on two topics in year 2; research/dissertation. MA awarded after year 1, MPhil after year 4, PhD after successful defense.',
  'https://www.math.columbia.edu/programs-math/graduate-program/',
  'Program milestones',
);
comparisonResearch['cornell-applied'].research = fact(
  'Interdisciplinary applied mathematics across mathematics, statistics, computer science, natural sciences, operations research and engineering; students work with field faculty across departments.',
  'https://cam.cornell.edu/research-areas/',
);
comparisonResearch['cornell-applied'].timeline = fact(
  'Six years is described as relatively common, but sixth-year funding is not guaranteed and depends on available funds. This is qualitative guidance, separate from the reported five-year average.',
  'https://cam.cornell.edu/frequently-asked-questions/',
  'Qualitative duration / funding caveat',
);
comparisonResearch['cornell-applied'].teaching = fact(
  'Support can mix teaching appointments, graduate research assistantships and fellowships across departments. A universal TA-semester/hour load is not verified.',
  'https://cam.cornell.edu/academics/tuition-and-financial-support/',
  'Appointment types; load unverified',
);
comparisonResearch['cornell-math'].research = fact(
  'Algebra, analysis, applied mathematics, combinatorics/discrete geometry, geometry, logic, probability/statistics and topology.',
  'https://www2.math.cornell.edu/m/research',
);
const dartHandbook =
  'https://math.dartmouth.edu/graduate-students/dept_docs/graduate-handbook/pdf/graduate-handbook.pdf';
comparisonResearch.dartmouth.faculty = fact(
  '24 tenured/tenure-track Mathematics faculty, per recruitment advertisement for a July 2026 appointment. Excludes other appointment categories.',
  'https://math.dartmouth.edu/activities/recruiting/recruiting_fliers_2026/PFQB-2026.pdf',
  'Reported faculty count',
  '2026-start recruitment advertisement',
);
comparisonResearch.dartmouth.teaching = fact(
  'TA work in years 1–2; after pedagogical training, at least two and typically three teaching opportunities, normally one in each of years 3–5. Fifth-year alternatives require approval.',
  dartHandbook,
  'Program teaching progression',
  'Department handbook indexed in 2026',
);
comparisonResearch.dartmouth.timeline = fact(
  'Handbook describes an expected 5-year course/research progression; not a measured average.',
  'https://math.dartmouth.edu/graduate-students/dept_docs/graduate-handbook-production/output/pdf/graduate-handbook.pdf',
  'Expected program plan',
  'Public handbook; edition date not verified',
);
comparisonResearch.dartmouth.research = fact(
  'Algebra, analysis, topology and applied mathematics, including numerical methods, stochastic processes/uncertainty quantification and analytic PDE methods.',
  'https://math.dartmouth.edu/graduate-students/dept_docs/graduate-handbook-production/output/pdf/graduate-handbook.pdf',
  'Program research/breadth areas',
);
comparisonResearch.dartmouth.milestones = fact(
  'Early breadth/certification requirements, advancement to candidacy, pedagogical training, research and doctoral dissertation/defense.',
  dartHandbook,
  'Degree structure',
  'Department handbook indexed in 2026',
);

comparisonResearch.auburn.research = fact(
  'Algebra, analysis/stochastic analysis, combinatorics, numerical analysis, statistics/data science, topology/geometry and mathematics education research.',
  'https://cosam.auburn.edu/math/research-areas/',
);
