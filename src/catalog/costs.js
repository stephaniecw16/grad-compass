// Official graduate/program policies checked Nov 6, 2026. USD; published fees may not identify a cycle.
const cost = (domestic, international, feeSource, waiver, waiverSource = feeSource) => ({
  domestic,
  international,
  feeSource,
  waiver,
  waiverSource,
  checkedOn: '2026-11-06',
});
export const applicationCosts = {
  auburn: cost(
    60,
    70,
    'https://bulletin.auburn.edu/thegraduateschool/admissions/admissions.pdf',
    'Financial-hardship requests possible during application; confirm eligibility and process.',
    'https://php.auburn.edu/cosam/departments/math/students/grad/prospective/mathgradbrochure.pdf',
  ),
  baylor: cost(
    50,
    60,
    'https://graduate.baylor.edu/admissions/how-apply',
    'Waiver eligibility not verified for Mathematics; ask the graduate program before paying.',
  ),
  binghamton: cost(
    75,
    75,
    'https://www.binghamton.edu/admissions/graduate/apply/application-guide.html',
    'Waiver eligibility not verified for this PhD; check with Graduate Admissions.',
  ),
  boise: cost(
    65,
    95,
    'https://www.boisestate.edu/graduatecollege/admissions/how-to-apply/',
    'Limited in-application categories or rare departmental sponsorship; the Graduate College generally does not waive fees. Confirm with Computing.',
    'https://www.boisestate.edu/graduatecollege/admissions/how-to-apply/admissions-faq/',
  ),
  'boston-college': cost(
    75,
    75,
    'https://www.bc.edu/bc-web/schools/morrissey/graduate/admission/',
    'Requests possible for documented financial hardship or listed affiliations. Upload the request in MCGS; submit the application before waiver review. Departments cannot grant waivers.',
  ),
  'boston-university': cost(
    95,
    95,
    'https://www.bu.edu/cas/admissions/phd-mfa/apply/application-checklist/',
    'Qualifying affiliation / hardship requests possible through GRS. Submit request at least five business days before the deadline; paid fees are not refunded.',
    'https://www.bu.edu/cas/admissions/phd-mfa/apply/fee-waiver/',
  ),
  'bowling-green': cost(
    45,
    75,
    'https://www.bgsu.edu/admissions/graduate/graduate-application-instructions/',
    'Listed automatic waivers include McNair, US veterans, returned Peace Corps and US K–12 public teachers. The same page says international fees are not waived; confirm any exception before relying on it.',
  ),
  byu: cost(
    null,
    null,
    'https://math.byu.edu/applications-deadlines',
    'Current graduate fee and waiver policy not verified. Older guides list $50; do not treat that as a confirmed current fee.',
  ),
  'brown-math': cost(
    75,
    75,
    'https://graduateschool.brown.edu/index.php/apply-mfa-or-doctoral-study-brown',
    'Financial-need request with supporting documentation inside the application. Brown recommends submitting with the request at least two weeks before the program deadline; approval is not guaranteed.',
    'https://graduateschool.brown.edu/apply/application-fee-waivers',
  ),
  'brown-applied': cost(
    75,
    75,
    'https://graduateschool.brown.edu/index.php/apply-mfa-or-doctoral-study-brown',
    'Financial-need request with supporting documentation inside the application. Brown recommends submitting with the request at least two weeks before the program deadline; approval is not guaranteed.',
    'https://graduateschool.brown.edu/apply/application-fee-waivers',
  ),
  'bryn-mawr': cost(
    50,
    50,
    'https://www.brynmawr.edu/gsas/admissions-aid/apply',
    'McNair / Fulbright waivers and hardship requests possible. Email gradadmissions@brynmawr.edu.',
  ),
  caltech: cost(
    100,
    100,
    'https://gradoffice.caltech.edu/admissions/applyonline',
    'Financial-need or qualifying affiliation requests possible in the application payment options; subject to review. Fee page currently labels the 2026–27 admission period; reconfirm for your cycle.',
    'https://gradoffice.caltech.edu/admissions/faq-applicants',
  ),
  'carnegie-mellon': cost(
    0,
    0,
    'https://www.cmu.edu/math/grad/phd/admissions.html',
    'Not needed: Mathematical Sciences states there is no application fee.',
  ),
  'case-western': cost(
    null,
    null,
    'https://case.edu/gradstudies/prospective-students/instructions-requirements',
    'Severe financial hardship: contact your program to ask about a waiver. Mathematics-specific fee amount not verified.',
  ),
  'central-michigan': cost(
    50,
    null,
    'https://www.cmich.edu/graduate/how-to-apply',
    'US veterans, active-duty, National Guard and Reserve service members may request a waiver with documentation. International fee amount not verified on this page.',
  ),
  claremont: cost(
    80,
    80,
    'https://www.cgu.edu/apply/',
    'Listed affiliation waivers possible, including Claremont Colleges students, staff and alumni. Contact admissions@cgu.edu about eligibility.',
    'https://www.cgu.edu/admissions/how-to-apply/applicant-faq/',
  ),
  clarkson: cost(
    0,
    0,
    'https://www.clarkson.edu/admissions-aid/graduate/how-to-apply',
    'Currently waived for graduate applicants; no individual request stated. Temporary policy — reconfirm before applying.',
  ),
  clemson: cost(
    0,
    0,
    'https://www.app.clemson.edu/admissions/graduate-admissions/apply/',
    'Not needed: current graduate application page states there is no application fee. Older documents list fees; use current instructions.',
  ),
  mines: cost(
    75,
    95,
    'https://gradprograms.mines.edu/admissions-requirements/',
    'Requirements page lists waivers for Mines affiliates, GEM and McNair. The general FAQ says Admissions does not waive fees; confirm listed eligibility directly before relying on a waiver.',
  ),
  'colorado-state': cost(
    60,
    70,
    'https://graduateschool.colostate.edu/apply/',
    'Qualifying Colorado / US land-grant degrees and specified service / fellowship affiliations may qualify. Requests can take four business days; apply at least one week early.',
    'https://graduateschool.colostate.edu/skip-the-application-fee/',
  ),
  columbia: cost(
    null,
    null,
    'https://www.gsas.columbia.edu/content/application-fee-waivers',
    'Financial need, hardship or qualifying circumstances: request through the applicant status page after submitting; upload documentation. Current Mathematics fee amount not verified.',
  ),
  'cornell-applied': cost(
    105,
    105,
    'https://gradschool.cornell.edu/admissions/application-steps/pay-fees/',
    'Financial-hardship request possible through the payment page; provide an explanation. Request eligibility does not guarantee approval.',
  ),
  'cornell-math': cost(
    105,
    105,
    'https://gradschool.cornell.edu/admissions/application-steps/pay-fees/',
    'Financial-hardship request possible through the payment page; provide an explanation. Request eligibility does not guarantee approval.',
  ),
  cuny: cost(
    75,
    75,
    'https://www.gc.cuny.edu/admissions-aid/how-apply/frequently-asked-questions',
    'Graduate Center FAQ limits waivers to US Armed Services Veterans and McNair Scholars: select pay by mail/check, then email Admissions with documentation. Other CUNY pages differ; confirm your eligibility with the Graduate Center.',
  ),
  dartmouth: cost(
    null,
    null,
    'https://graduate.dartmouth.edu/admissions/applying-dartmouth/fee-waiver-criteria',
    'Qualifying affiliations / GRE fee reduction requests possible for US and non-US applicants. Meet criteria before submitting; no retroactive waiver. Mathematics-specific fee amount not verified.',
  ),
};
export function feeTotals(ids, kind) {
  let amount = 0,
    known = 0;
  for (const id of ids) {
    const value = applicationCosts[id]?.[kind];
    if (typeof value === 'number' && Number.isFinite(value)) {
      amount += value;
      known++;
    }
  }
  return { amount, known, unknown: ids.length - known };
}
// Additional program-specific checks on November 7, 2026.
Object.assign(applicationCosts.byu, {
  domestic: 50,
  international: 50,
  feeSource: 'https://math.byu.edu/applications-deadlines',
  waiver:
    'The Mathematics department states it cannot waive the $50 application fee. Other Graduate Studies exceptions were not verified.',
  waiverSource: 'https://math.byu.edu/applications-deadlines',
  checkedOn: '2026-11-07',
});
Object.assign(applicationCosts['case-western'], {
  domestic: 85,
  international: 85,
  feeSource: 'https://case.edu/programs/mathematics-phd',
  waiver:
    'Severe financial hardship: contact the Mathematics program about a waiver. The current Mathematics program page lists an $85 fee; unrelated/older program pages may differ.',
  checkedOn: '2026-11-07',
});
Object.assign(applicationCosts.columbia, {
  domestic: 125,
  international: 125,
  feeSource: 'https://www.gsas.columbia.edu/content/application-fee',
  waiver:
    'GSAS considers financial-need/hardship requests through the application status page after submission, with documentation. Do not pay while a request is pending; approval is not guaranteed.',
  note: 'Official GSAS page explicitly identifies the 2027 online application.',
  checkedOn: '2026-11-07',
});
Object.assign(applicationCosts.dartmouth, {
  domestic: 150,
  international: 150,
  feeSource: 'https://graduate.dartmouth.edu/admissions/programs/mathematics',
  waiver:
    'Qualifying affiliations / GRE fee reduction requests possible for US and non-US applicants. Meet criteria before submitting; no retroactive waiver.',
  checkedOn: '2026-11-07',
});
Object.assign(applicationCosts.binghamton, {
  waiver:
    'Limited waivers for qualified PhD candidates. Upload all application documents, then send the Mathematics graduate program a justification for the request; approval is not automatic.',
  waiverSource: 'https://www.binghamton.edu/apps/academics/program/gd/mathematical-sciences',
  checkedOn: '2026-11-07',
});
Object.assign(applicationCosts.boise, {
  waiver:
    'Computing states it does not provide application fee waivers. The Graduate College separately lists very limited in-application categories; confirm any institutional eligibility directly.',
  waiverSource:
    'https://www.boisestate.edu/computing/academics/doctoral-program/application-requirements-ph-d/',
  additionalSources: [
    'https://www.boisestate.edu/graduatecollege/admissions/how-to-apply/admissions-faq/',
  ],
  checkedOn: '2026-11-07',
});
Object.assign(applicationCosts['central-michigan'], {
  international: null,
  note: 'International fee conflict: admissions instructions say $65; the FY26 university fee schedule lists $70 from Fall 2024. Confirm the current charge; neither value is included in totals.',
  additionalSources: [
    'https://www.cmich.edu/international-admissions/graduate/apply-international',
    'https://www.cmich.edu/docs/default-source/finance-and-administrative-services-division/financial-planning-and-budgets/university-fees/fy26-university-fee-listing-for-website.pdf?sfvrsn=545da1d0_7',
  ],
  waiver:
    'US military/veteran categories may request a documented waiver. International fee amount requires confirmation because official sources differ.',
  checkedOn: '2026-11-07',
});
