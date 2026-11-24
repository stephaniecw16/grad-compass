"""Publish source-link outcomes and conservative department-link discoveries.

Only factual URLs, status codes and exact public anchor labels are published.
Raw source pages, contact paragraphs and email candidates remain private caches.
A matching university anchor confirms that URL's label, not every program fact.
"""
import argparse,json,re
from pathlib import Path
from urllib.parse import urlsplit
from import_department_contacts import normal

def topics(text):
    text=text.lower();found=set()
    for term,pattern in [('math',r'\bmath(?:ematics|ematical)?\b'),('stat',r'\bstat(?:istics|istical|s)?\b'),('biostat',r'\bbiostatistics?\b'),('cs',r'\bcomput(?:er|ing|ational)\b'),('data',r'\bdata\s+science\b'),('operations',r'\boper(?:ations|ational)\s+research\b')]:
        if re.search(pattern,text):found.add(term)
    return found

def institution(url):
    host=urlsplit(url).hostname or ''
    return '.'.join(host.split('.')[-2:])

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('capture');parser.add_argument('audit');a=parser.parse_args()
    capture=json.loads(Path(a.capture).read_text());audit=json.loads(Path(a.audit).read_text());byurl={normal(r['url']):r for r in audit};checks={}
    for r in capture['records']:
        rows={row['cells'][0]:row for row in r['rows']};entry={}
        for label,key in [('Department','department'),('URL for prospective students','admissions')]:
            urls=[l['url'] for l in rows.get(label,{}).get('links',[]) if l['url'].startswith(('http://','https://'))]
            if not urls:continue
            result=byurl.get(normal(urls[0]))
            if result:entry[key]={k:result[k] for k in ['outcome','status','checkedOn'] if k in result};entry[key]['redirected']=bool(result.get('finalUrl') and normal(result['finalUrl'])!=normal(result['url']))
        # Missing/broken department URLs may be replaced only by a unique,
        # explicitly named departmental anchor on a linked university page.
        desired=topics(rows.get('Department',{}).get('cells',['',''])[1]);candidates={}
        department_links=rows.get('Department',{}).get('links',[])
        for row in [rows.get('URL for prospective students',{}),rows.get('Department',{})]:
            for origin in row.get('links',[]):
                if not origin['url'].startswith(('http://','https://')):continue
                result=byurl.get(normal(origin['url']))
                if not result or result['outcome']!='retrieved':continue
                base=result.get('finalUrl',result['url']);root=institution(base)
                if not root.endswith(('.edu','.ca','.mil','.gov')):continue
                for link in result.get('links',[]):
                    u=link['url'];label=link['label']
                    if not u.startswith(('http://','https://')) or institution(u)!=root:continue
                    if not desired or topics(label)!=desired:continue
                    if not re.search(r'department|school of|division of',label,re.I):continue
                    if len(label)>120 or re.search(r'faculty|staff|admission|research|give|donat|job',label,re.I):continue
                    if urlsplit(u).username or urlsplit(u).password:continue
                    candidates[normal(u)]={'url':u,'label':label,'source':base,'checkedOn':'2026-11-23'}
        if len(candidates)==1 and (not department_links or entry.get('department',{}).get('outcome')=='not-retrieved'):
            entry['discovered']=next(iter(candidates.values()))
        checks[r['amsId']]=entry
    Path('src/catalog/department-link-checks.js').write_text('// Generated link outcomes and explicit university anchor discoveries.\n// URL retrieval alone never verifies program policies or contact roles.\nexport const departmentLinkChecks = '+json.dumps(checks,separators=(',',':'),ensure_ascii=False)+';\n')
    public=[{k:r[k] for k in ['url','finalUrl','checkedOn','outcome','status'] if k in r} for r in audit]
    Path('docs/research/department-link-audit.json').write_text(json.dumps({'checkedOn':'2026-11-23','purpose':'Public URL retrieval only; academic facts and contact roles require separate evidence.','checkedUrls':len(audit),'retrieved':sum(r['outcome']=='retrieved' for r in audit),'results':public},indent=2)+'\n')
    print(json.dumps({'checkedUrls':len(audit),'retrieved':sum(r['outcome']=='retrieved' for r in audit),'discoveredDepartmentLinks':sum('discovered' in e for e in checks.values())}))
if __name__=='__main__':main()
