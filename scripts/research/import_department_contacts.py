"""Build AMS contact evidence and map human-reviewed university contacts to listings.

Inputs are public DOM observations, public-page link audits, and explicit review
choices. Raw free-text contact paragraphs are never republished. Contacts are
professional addresses supplied by AMS or deliberately approved from university
pages; none are guessed. No program changes identity or saved ID.
"""
import argparse, html, json, re
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from import_ams import clean, link

EMAIL=re.compile(r'(?<![\w.+-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?![\w-])',re.I)
PHONE=re.compile(r'(?:\+?1[ .-]?)?\(?[2-9]\d{2}\)?[ .-]\d{3}[ .-]\d{4}(?:\s*(?:x|ext\.?|extension)\s*\d{1,6})?',re.I)
def normal(url):
    p=urlsplit(clean(url));query=urlencode([(k,v) for k,v in parse_qsl(p.query) if not (k.startswith('utm_') or k.startswith('_ga') or k=='ref')])
    return urlunsplit((p.scheme,p.netloc.lower(),p.path.rstrip('/') or '/',query,''))

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('capture');parser.add_argument('review');parser.add_argument('previous_audit');a=parser.parse_args()
    capture=json.loads(Path(a.capture).read_text());review=json.loads(Path(a.review).read_text());audit=json.loads(Path(a.previous_audit).read_text())
    by_url={};records={}
    for r in capture['records']:
        for row in r['rows']:
            if row['cells'][0] not in {'Department','URL for prospective students'}:continue
            for item in row['links']:
                if item['url'].startswith(('http://','https://')):by_url.setdefault(normal(item['url']),set()).add(r['amsId'])
        contact=next((row['cells'][1] for row in r['rows'] if row['cells'][0]=='Contact information' and len(row['cells'])>1),'')
        text=clean(contact)
        emails=sorted(set(m.group().rstrip('.').lower() for m in EMAIL.finditer(text)))
        phones=[]
        for line in html.unescape(contact).splitlines():
            if re.search(r'fax',line,re.I):continue
            phones.extend(m.group().strip() for m in PHONE.finditer(line))
        records[r['amsId']]={'departmentWebsite':link(r['rows'],'Department') or None,'admissionsWebsite':link(r['rows'],'URL for prospective students') or None,'amsContactProvided':bool(text),'amsEmails':emails[:5],'amsPhones':list(dict.fromkeys(phones))[:2]}
    for r in audit:
        if r.get('finalUrl') and normal(r['url']) in by_url:
            by_url.setdefault(normal(r['finalUrl']),set()).update(by_url[normal(r['url'])])
    reviewed=[]
    for r in review:
        ids=sorted(r.get('programAmsIds') or by_url.get(normal(r['source']),set()),key=int)
        if not ids:raise ValueError('Reviewed source has no explicit AMS listing association: '+r['source'])
        if not EMAIL.fullmatch(r['email']):raise ValueError('Invalid reviewed email')
        if any(id not in records for id in ids):raise ValueError('Contact links to an unknown AMS ID')
        reviewed.append(dict(programAmsIds=ids,**{k:v for k,v in r.items() if k!='programAmsIds'}))
    generated='// Generated factual AMS link/contact fields. Never hand-edit.\n// AMS-reported contacts may be outdated; no free-text paragraphs are included.\nexport const departmentCheckedOn = "2026-11-23";\nexport const amsDepartmentDirectory = {\n'
    generated+=''.join('  '+json.dumps(id)+':'+json.dumps(value,ensure_ascii=False,separators=(',',':'))+',\n' for id,value in records.items())+'};\n'
    Path('src/catalog/department-data.js').write_text(generated)
    Path('src/catalog/department-research.js').write_text('// Human-reviewed public professional contacts; graduate-school contacts are labeled separately.\n// Explicit AMS source associations prevent contacts leaking into unrelated institutions.\nexport const reviewedDepartmentContacts = '+json.dumps(reviewed,ensure_ascii=False,indent=2)+';\n')
    print(json.dumps({'listings':len(records),'departmentUrls':sum(bool(r['departmentWebsite']) for r in records.values()),'listedEmails':sum(bool(r['amsEmails']) for r in records.values()),'reviewedContacts':len(reviewed),'reviewedListingCoverage':len({id for r in reviewed for id in r['programAmsIds']})}))
if __name__=='__main__':main()
