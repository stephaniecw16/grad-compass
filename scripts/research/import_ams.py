"""Turn public AMS table observations into factual, source-scoped catalog data.

The capture is collected from the public directory DOM, never from private APIs.
Only factual fields are published. Contacts and long program prose are excluded.
A reachable university URL is NOT treated as fact verification. Blank/ambiguous
numbers, absent degree tracks and currency placeholders remain unknown.
"""
import argparse, html, json, re
from urllib.parse import urlsplit
from pathlib import Path

LEVELS={'post':'Bridge/Postbaccalaureate','masters':'Masters','doctoral':'Doctoral','certificate':'Certificate'}

def clean(value):
    for _ in range(6):
        decoded=html.unescape(value)
        if decoded==value:break
        value=decoded
    return re.sub(r'\s+',' ',value).strip()

def field(rows,label):
    return next((clean(row['cells'][1]) for row in rows if row['cells'][0]==label and len(row['cells'])>1),'')

def number(value):
    value=value.replace(',','')
    return int(value) if re.fullmatch(r'\d+',value) else None

def link(rows,label):
    for row in rows:
        if row['cells'][0]!=label:continue
        for item in row['links']:
            url=item['url'];parts=urlsplit(url)
            if parts.scheme not in {'http','https'} or not parts.hostname:continue
            if parts.username or parts.password:continue
            if not re.fullmatch(r'[A-Za-z0-9.-]+',parts.hostname):continue
            # Relative department URLs and email addresses sometimes resolve under AMS.
            # Do not send students to those malformed links or guess replacement domains.
            if parts.hostname=='ams.org' or parts.hostname.endswith('.ams.org'):continue
            return url
    return ''

def convert(record):
    overview=record['tables']['overview'];offered=field(overview,'Program(s) offered').split(' · ')
    tracks=[]
    for key,label in LEVELS.items():
        if label not in offered:continue
        rows=record['tables'][key]
        subject=next((row['cells'][1] for row in rows if row['cells'][0].startswith('The department encourages applications') and len(row['cells'])>1),'')
        subjects=[clean(s) for s in subject.split(' · ') if clean(s)]
        # Free-text "Other" descriptions are not copied as a program narrative.
        subjects=[s[:160] for s in subjects if len(s)<=160]
        tracks.append({'type':label,'areas':subjects,'online':field(rows,'Is the program offered online?') or None,
          'greReported':field(rows,'GRE requirement') or None,
          'fullTime':number(field(rows,'Full-time')),'partTime':number(field(rows,'Part-time')),
          'firstYear':number(field(rows,'First year')),
          'awarded':number(next((row['cells'][1] for row in rows if row['cells'][0].startswith('Number of ') and 'awarded' in row['cells'][0] and len(row['cells'])>1),'')),
          'support':field(rows,'Do they offer financial support?') or None,
          'supportedStudents':number(field(rows,'Number of full-time students receiving support')),
          'tuitionReported':(lambda value:value if re.search(r'\d',value) else None)(field(rows,'Typical tuition and fees paid by a full-time student')),
          'stipendReported':(lambda value:value if re.search(r'\d',value) else None)(field(rows,'Typical stipend/salary paid to a full-time student'))})
    return {'amsId':record['amsId'],'institution':field(overview,'Institution'),
      'department':field(overview,'Department'),'location':field(overview,'Location'),
      'website':link(overview,'URL for prospective students') or link(overview,'Department') or None,
      'departmentWebsite':link(overview,'Department') or None,
      'facultyFullTime':number(field(overview,'Number of full-time faculty department members')),
      'updated':field(overview,'Last updated') or None,'tracks':tracks}

def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('capture');p.add_argument('--output',default='src/catalog/ams-data.js');a=p.parse_args()
    capture=json.loads(Path(a.capture).read_text());records=[convert(r) for r in capture['records']]
    assert len(records)==capture['reportedCount']
    assert len({r['amsId'] for r in records})==capture['reportedCount']
    assert all(r['institution'] for r in records)
    # One compact line per listing keeps generated data easy to diff; edit the importer.
    out='// Generated from public AMS listing tables, checked 2026-11-23.\n// AMS-reported facts are not independent university verification.\n// Regenerate with scripts/research/import_ams.py; do not hand-edit.\nexport const amsCheckedOn = "2026-11-23";\nexport const amsListings = [\n'
    out+=''.join('  '+json.dumps(r,ensure_ascii=False,separators=(',',':'))+',\n' for r in records)+'];\n'
    Path(a.output).write_text(out)
    print(json.dumps({'records':len(records),'degreeTracks':sum(len(r['tracks']) for r in records),'facultyCounts':sum(r['facultyFullTime'] is not None for r in records),'tracksWithEnrollment':sum(t['fullTime'] is not None for r in records for t in r['tracks']),'tracksWithGreReport':sum(bool(t['greReported']) for r in records for t in r['tracks'])}))
if __name__=='__main__':main()
