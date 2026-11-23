"""Publish explicitly reviewed university GRE statements, preserving degree scope.

Generic GRE statements stay in the overall-policy row; they never silently become
verified subject-test rules. Historical-cycle and unrelated-program snippets are
excluded. Reviewed facts apply only to this dated evidence capture, not future runs.
"""
import json,hashlib
from pathlib import Path

EXPECTED_CANDIDATE_HASH='c41eb42fe38a544adf9f5cb4cbeeadc2e58b790dbcc8a6f06d17ff3b7682b0f4'
REVIEWED={
  6:{'greGeneral':'None — optional.','greMath':'None — optional.'},
  7:{'greGeneral':'Suggested, not required.','greMath':'Suggested, not required.'},
  8:{'greGeneral':'None — accepted but not required.','greMath':'None — optional.'},
  15:{'greGeneral':'None — not considered.','greMath':'None — optional; omission is not penalized.'},
  16:{'grePolicy':'GRE is one possible preparation route, not universally required. The GRE route has published percentile expectations; review the alternative-route requirements.'},
  21:{'grePolicy':'GRE scores are not required and provide no stated admissions advantage.'},
  22:{'grePolicy':'The CMOR PhD requires GRE scores beginning with Fall 2026 admission.','greMath':'Not required for CMOR PhD; do not apply the separate Rice mathematics policy.'},
  28:{'grePolicy':'GRE scores are not required for the mathematics MS/PhD program.'},
  53:{'greGeneral':'None — not required for admission or TA consideration. A few university fellowships may require GRE scores.','greMath':'None — not required for admission or TA consideration; check separate fellowship eligibility.'},
  54:{'greGeneral':'Doctoral: required; master’s: optional; certificate: not required.','greMath':'Suggested, not required; certificate applicants do not have a GRE requirement.'},
  55:{'greGeneral':'None — scores are not considered.','greMath':'Required; the department says applications without a subject score of at least 600 are not reviewed.'},
  57:{'grePolicy':'Doctoral GRE scores are optional; omission does not harm consideration.'},
  58:{'greGeneral':'Not required according to the department’s current FAQ.','greMath':'Not required according to the department’s current FAQ.'},
  59:{'greGeneral':'None — not required or used in mathematics admission decisions.','greMath':'None — not required or used in mathematics admission decisions.'},
  61:{'grePolicy':'GRE scores are not currently required.','greMath':'Suggested if submitting GRE results; the department recommends the specialized mathematics test.'},
  63:{'greGeneral':'None — optional for mathematics MS/PhD.','greMath':'None — optional for mathematics MS/PhD.'},
  64:{'grePolicy':'GRE scores are not required; the cited statement does not distinguish tests.'},
  65:{'grePolicy':'GRE results are accepted but not required; any submitted scores must satisfy the stated age limit.'},
  69:{'grePolicy':'GRE scores are optional but preferred; the cited sentence does not separately identify the tests.'},
  70:{'grePolicy':'GRE scores are not required for entrance to the mathematics graduate program.'},
  71:{'greMath':'Suggested, not required for Fall 2027 mathematics applicants.'},
  75:{'greGeneral':'Biostatistics MA: required unless the published exemption criteria are met. Other degree routes on the page have different rules; do not generalize this to all PhD applicants.'},
  79:{'greGeneral':'None — not required for statistics master’s/PhD admission.','greMath':'None — subject scores are not required for statistics master’s/PhD admission.'},
  97:{'greGeneral':'None — optional for biostatistics MS/PhD regardless of prior degree.'},
  104:{'grePolicy':'Mathematics MS: optional for applicants with mathematical-sciences BS/MS preparation; others face a GRE requirement with case-by-case waivers. This does not verify a PhD rule.'},
  107:{'greGeneral':'None — not collected.','greMath':'Suggested, not required; applications receive full consideration without scores.'},
  108:{'greGeneral':'None — not accepted.','greMath':'Suggested strongly, but not required.'},
  125:{'greGeneral':'None — not considered in mathematics or applied-mathematics graduate review.','greMath':'Mathematics MA/PhD: suggested, not required. Applied Mathematics MS/PhD: not required and not reviewed.'},
  126:{'greMath':'None — optional; the department gives GRE reporting code 0984.'},
  127:{'grePolicy':'Not required; the department encourages available general and mathematics-subject scores. Applications without scores receive full consideration.'},
  134:{'grePolicy':'Optional but encouraged if scores help demonstrate preparation; the statement does not distinguish the tests.'},
  135:{'grePolicy':'Recommended, not required for the Data Science MS.'},
  144:{'grePolicy':'Statistics PhD: recommended, not mandatory. Master’s: not required.'},
}

def main():
    cache=Path('/private/tmp/gradapp-university-evidence-2026-11-23-os-roots')
    raw=(cache/'candidates.json').read_bytes()
    assert hashlib.sha256(raw).hexdigest()==EXPECTED_CANDIDATE_HASH,'Evidence differs from the reviewed snapshot; rereview before publishing.'
    candidates=json.loads(raw)
    capture=json.loads(Path('/private/tmp/gradapp-ams-source-2026-11-23.json').read_text())
    results={}
    for index,fields in REVIEWED.items():
        row=candidates[index]
        for p in capture['records']:
            links=[a['url'] for r in p['tables']['overview'] if r['cells'][0] in ['URL for prospective students','Department'] for a in r['links']]
            if row['reportedUrl'] not in links:continue
            results.setdefault(p['amsId'],{}).update({key:{'value':value,'source':row['source'],'scope':'Current university statement for the degree/program named in this value. Where no cycle is stated, current-cycle applicability must be confirmed.'} for key,value in fields.items()})
    Path('src/catalog/university-gre-checks.js').write_text('// Manually reviewed, degree-scoped university GRE statements, checked 2026-11-23.\nexport const universityGreChecks = '+json.dumps(results,indent=2,ensure_ascii=False)+';\n')
    print('Reviewed GRE facts:',sum(len(v) for v in results.values()),'for AMS listings:',len(results))
if __name__=='__main__':main()
