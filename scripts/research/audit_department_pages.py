"""Audit explicit department/prospective-student links and public contact pages.

Read-only, bounded and per-host rate limited; honors robots.txt and TLS. Public
source text remains in an operator-provided private cache outside the repository.
A retrieved page is not evidence that every program fact is current. Contact
candidates require review before publication; no messages or forms are submitted.
"""
import argparse, concurrent.futures, hashlib, html, json, re, threading
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from audit_university_links import Text, inspect

EMAIL=re.compile(r'[A-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9.-]*[A-Z0-9])?\.[A-Z]{2,}',re.I)
class Page(Text):
    def __init__(self):
        super().__init__(); self.links=[]; self.anchor=None; self.title_parts=[]; self.in_title=False
    def handle_starttag(self,tag,attrs):
        super().handle_starttag(tag,attrs)
        a=dict(attrs)
        if tag=='a' and a.get('href'):self.anchor={'href':a['href'],'label':''}
        if tag=='title':self.in_title=True
    def handle_endtag(self,tag):
        super().handle_endtag(tag)
        if tag=='a' and self.anchor:self.links.append(self.anchor);self.anchor=None
        if tag=='title':self.in_title=False
    def handle_data(self,data):
        super().handle_data(data)
        if self.anchor:self.anchor['label']+=data
        if self.in_title:self.title_parts.append(data)

def safe_url(value):
    try:
        p=urlsplit(html.unescape(value));host=p.hostname or ''
        if p.scheme not in {'http','https'} or p.username or p.password or p.port not in {None,80,443}:return None
        if not re.fullmatch(r'[A-Za-z0-9.-]+',host) or '.' not in host or host.endswith('.ams.org') or host=='ams.org':return None
        if re.fullmatch(r'[\d.]+',host) or host in {'localhost','example.com','example.edu'}:return None
        return urlunsplit((p.scheme,p.netloc,p.path,p.query,''))
    except ValueError:return None

def collect(url,folder):
    # Reuse the policy-aware fetcher while retaining the HTML needed for explicit
    # contact-page anchors. It performs the request through the same read hook.
    import audit_university_links as base
    return inspect(url,folder)

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('capture');parser.add_argument('output');a=parser.parse_args()
    capture=json.loads(Path(a.capture).read_text());output=Path(a.output);output.mkdir(parents=True,exist_ok=True)
    roots=set()
    for record in capture['records']:
        for row in record['rows']:
            if row['cells'][0] not in {'Department','URL for prospective students'}:continue
            for link in row['links']:
                url=safe_url(link['url'])
                if url:roots.add(url)
    # Capture public HTML in the bounded/TLS-verified base read, not via browser APIs.
    import audit_university_links as base
    original=base.read; payloads={};lock=threading.Lock()
    def read(url):
        result=original(url)
        if 'html' in result[2]:
            with lock:payloads[url]=result
        return result
    base.read=read
    checkpoint=output/'audit.json'
    results={r['url']:r for r in json.loads(checkpoint.read_text())} if checkpoint.exists() else {}
    def run(url):
        result=collect(url,output)
        if result['outcome']=='retrieved' and url in payloads:
            final,_,kind,data=payloads.pop(url);p=Page();p.feed(data.decode('utf-8',errors='replace'))
            text='\n'.join(' '.join(line.split()) for line in ''.join(p.parts).splitlines() if line.strip())
            contexts=[]
            for match in EMAIL.finditer(text):
                email=match.group().rstrip('.');contexts.append({'email':email,'context':text[max(0,match.start()-180):match.end()+180]})
            links=[]
            for item in p.links:
                try:links.append({'url':urljoin(final,item['href']),'label':' '.join(item['label'].split())})
                except ValueError:continue  # Malformed source anchors do not invalidate the page.
            result.update(title=' '.join(p.title_parts).strip(),emails=contexts,links=links)
        return result
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for i,r in enumerate(pool.map(run,sorted(roots-set(results))),1):
            results[r['url']]=r
            if i%50==0:
                (output/'audit.json').write_text(json.dumps(list(results.values()),indent=2));print(f'Base links checked: {len(results)}/{len(roots)}',flush=True)
    children=set()
    for r in results.values():
        if r['outcome']!='retrieved':continue
        host=urlsplit(r.get('finalUrl',r['url'])).hostname
        candidates=[]
        for link in r.get('links',[]):
            url=safe_url(link['url']);label=link['label'].lower()
            if not url or urlsplit(url).hostname!=host or url in results:continue
            if re.search(r'privacy|accessibility|cookie|giving|donate|emergency|media|alumni',label):continue
            if re.search(r'contact|graduate.*(admission|coordinator|director)|admission.*(graduate|contact)',label):
                candidates.append((0 if 'graduate' in label else 1,url))
        children.update(url for _,url in sorted(set(candidates))[:1])
    print(f'Contact-page links to check: {len(children)}',flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        for i,r in enumerate(pool.map(run,sorted(children-set(results))),1):
            results[r['url']]=r
            if i%50==0:print(f'Contact links checked: {i}/{len(children)}',flush=True)
    (output/'audit.json').write_text(json.dumps(list(results.values()),indent=2))
    print(json.dumps({'baseUrls':len(roots),'contactUrls':len(children),'checked':len(results),'retrieved':sum(r['outcome']=='retrieved' for r in results.values())}),flush=True)
if __name__=='__main__':main()
