"""Publish manually reviewed fee facts from the temporary university evidence cache.

The explicit reviewed rows below are an allowlist, not a keyword extractor.
Unqualified base fees do not become verified nationality-specific rates. Tuition,
exam charges, application reimbursements and undergrad-only pages are excluded.
The private source text/candidate files are never copied into the repository.
"""
import json,hashlib
from pathlib import Path

EXPECTED_CANDIDATE_HASH='c41eb42fe38a544adf9f5cb4cbeeadc2e58b790dbcc8a6f06d17ff3b7682b0f4'
REVIEWED={
  2:{'feePublished':'$70 for a first graduate application; $25 for another within 12 months. Excludes specified professional/non-graduate applications.'},
  4:{'feePublished':'$30 graduate application fee.','waiver':'The Office of Admissions does not provide fee waivers; this does not establish every department’s funding policy.'},
  5:{'feeDomestic':'$55 USD','feeInternational':'$65 USD','waiver':'Some programs may cover all or part of the fee; McNair Scholars can request a waiver with proof of status.'},
  8:{'feePublished':'$90 for the Applied Mathematics graduate application.','waiver':'A graduate application fee-waiver process is linked; eligibility must be checked before payment.'},
  11:{'feeDomestic':'$35 USD','feeInternational':'$60 USD'},
  19:{'feePublished':'$50 for Graduate College of Arts and Sciences applications.'},
  23:{'feePublished':'$100 for College of Science graduate applications.'},
  28:{'feeDomestic':'$60 USD','feeInternational':'$100 USD'},
  32:{'feeDomestic':'$125 as published; confirm billing currency.','feeInternational':'$145 as published; confirm billing currency.'},
  33:{'feePublished':'$75; the page says the fee covers up to three graduate program choices.'},
  39:{'feePublished':'$105 for Graduate School applications.'},
  40:{'feePublished':'$90 processing fee for each graduate program application.'},
  42:{'feePublished':'$100 for Graduate School applications.'},
  47:{'feePublished':'$75 for Graduate School doctoral/MFA applications; not a verified fee for every master’s route.'},
  48:{'feePublished':'$75 for degree-seeking graduate applicants; reductions/waivers may depend on eligibility.'},
  59:{'feePublished':'$85 for the mathematics graduate application.'},
  63:{'feePublished':'$60 in the mathematics department’s graduate application instructions.'},
  65:{'feePublished':'$85 in mathematics graduate application instructions.'},
  71:{'feeDomestic':'$70 USD','feeInternational':'$90 USD'},
  74:{'feePublished':'$30 USD for the Biostatistics PhD application.'},
  92:{'feeDomestic':'$50 USD; centralized application services may charge additional fees.','feeInternational':'$100 USD; centralized application services may charge additional fees.'},
  96:{'feeDomestic':'$45 USD','feeInternational':'$75 USD'},
  98:{'feePublished':'$50 for Graduate Admissions applications.'},
  106:{'feeDomestic':'$50 USD; only the domestic amount is specified on the cited page.'},
  109:{'feePublished':'$115 as published; confirm the payment currency and applicable program total.'},
  112:{'feePublished':'By degree: $60 master’s, $80 doctoral, $20 graduate certificate.'},
  118:{'feePublished':'$75 for advanced-certificate/degree/doctoral/nondegree applicants; $20 for readmission.'},
  119:{'feePublished':'$75 for advanced-certificate/degree/doctoral/nondegree applicants; $20 for readmission.'},
  125:{'feeDomestic':'$135 USD','feeInternational':'$155 USD','waiver':'The mathematics program says it does not offer program-level fee waivers; check university-level eligibility separately.'},
  126:{'feePublished':'$185 CAD; described as the university-wide application fee.'},
  127:{'feePublished':'$75 in mathematics graduate application instructions.','waiver':'Dietrich Arts and Sciences accepts case-by-case waiver requests; approval is not guaranteed.'},
  131:{'feePublished':'$60 for in-person graduate programs; not a verified online-program rate.'},
  133:{'feePublished':'$35 for Graduate School applications.','waiver':'Listed eligibility includes McNair Scholars, US armed-forces/veteran applicants and Native American applicants.'},
  138:{'feePublished':'$120 CAD for the graduate application.'},
  140:{'feePublished':'$40 Graduate School application fee in mathematics admission requirements.'},
  144:{'feePublished':'$75 through the statistics GradCAS application.','waiver':'Case-by-case Arts and Sciences waiver requests must be approved before paying; paid fees are not refunded.'},
  148:{'feePublished':'$30 for College of Graduate Studies applications.'},
  149:{'feePublished':'$30 for College of Graduate Studies applications.'},
}

def main():
    cache=Path('/private/tmp/gradapp-university-evidence-2026-11-23-os-roots')
    raw=(cache/'candidates.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest()==EXPECTED_CANDIDATE_HASH,'Evidence differs from reviewed snapshot; rereview before publishing.'
    candidates=json.loads(raw)
    capture=json.loads(Path('/private/tmp/gradapp-ams-source-2026-11-23.json').read_text())
    results={}
    for index,fields in REVIEWED.items():
        row=candidates[index]
        for p in capture['records']:
            links=[a['url'] for r in p['tables']['overview'] if r['cells'][0] in ['URL for prospective students','Department'] for a in r['links']]
            if row['reportedUrl'] not in links:continue
            results.setdefault(p['amsId'],{}).update({key:{'value':value,'source':row['source'],'scope':'University-published application fee policy for the program/graduate unit in this source. Amounts retain their published currency and any nationality/degree limits.'} for key,value in fields.items()})
    Path('src/catalog/university-fee-checks.js').write_text('// Manually reviewed university fee/waiver facts, checked 2026-11-23.\n// Base fees are not silently interpreted as international or domestic totals.\nexport const universityFeeChecks = '+json.dumps(results,indent=2,ensure_ascii=False)+';\n')
    print('Reviewed fee/waiver facts:',sum(len(v) for v in results.values()),'for AMS listings:',len(results))
if __name__=='__main__':main()
