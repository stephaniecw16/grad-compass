"""Check AMS-published university URLs without treating reachable pages as verified facts.

Input is an operator-supplied browser capture of public AMS tables. Evidence stays
outside Git. Fetches are read-only, rate-limited, deduplicated, and honor robots.txt.
No discovery guesses, paid APIs, login, email, or automated form submissions.
"""
import argparse, concurrent.futures, hashlib, json, threading, time
from pathlib import Path
from urllib.parse import urlsplit, urljoin
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError
from urllib.robotparser import RobotFileParser
from html.parser import HTMLParser

AGENT = 'GradAppStudentResearch/1.0 (public university program information)'
locks, robots, last_request = {}, {}, {}
state_lock = threading.Lock()

class Text(HTMLParser):
    def __init__(self):
        super().__init__(); self.skip = 0; self.parts = []
    def handle_starttag(self, tag, attrs):
        if tag in {'script','style','noscript','svg'}: self.skip += 1
        if tag in {'p','div','h1','h2','h3','li','tr','br'} and not self.skip: self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in {'script','style','noscript','svg'}: self.skip = max(0,self.skip-1)
    def handle_data(self, data):
        if not self.skip: self.parts.append(data)

def read(url):
    with urlopen(Request(url, headers={'User-Agent':AGENT}),timeout=12) as response:
        raw = response.read(2_000_001)
        if len(raw)>2_000_000: raise ValueError('Page exceeds research fetch size limit')
        return response.geturl(),response.status,response.headers.get('Content-Type',''),raw

def inspect(url, output):
    host=urlsplit(url).netloc
    with state_lock: lock=locks.setdefault(host,threading.Lock())
    result={'url':url,'checkedOn':'2026-11-23','verification':'link-check-only'}
    try:
        with lock:
            if host not in robots:
                robot=RobotFileParser(); robot.set_url(urljoin(url,'/robots.txt'))
                try:
                    _,_,_,data=read(robot.url); robot.parse(data.decode('utf-8',errors='replace').splitlines())
                    robots[host]=robot
                except HTTPError as e:
                    if e.code in {404,410}: robots[host]=None
                    else: raise ValueError('Robots check unavailable or denied')
                except (URLError,TimeoutError): raise ValueError('Robots check unavailable')
            robot=robots[host]
            if robot and not robot.can_fetch(AGENT,url): raise ValueError('Disallowed by robots.txt')
            wait=max(.5,robot.crawl_delay(AGENT) or 0 if robot else .5)-(time.monotonic()-last_request.get(host,0))
            if wait>0: time.sleep(wait)
            last_request[host]=time.monotonic()
            final,status,kind,data=read(url)
        result.update(status=status,finalUrl=final,contentType=kind,sha256=hashlib.sha256(data).hexdigest(),outcome='retrieved')
        if 'html' in kind:
            parser=Text();parser.feed(data.decode('utf-8',errors='replace'))
            text='\n'.join(' '.join(line.split()) for line in ''.join(parser.parts).splitlines() if line.strip())
            # Raw source text is review evidence only; never automatically published.
            (output/(hashlib.sha256(url.encode()).hexdigest()+'.txt')).write_text(text)
    except Exception as e: result.update(outcome='not-retrieved',reason=str(e)[:180])
    return result

def main():
    args=argparse.ArgumentParser(description=__doc__);args.add_argument('capture');args.add_argument('output');a=args.parse_args()
    snapshot=json.loads(Path(a.capture).read_text()); output=Path(a.output);output.mkdir(parents=True,exist_ok=True)
    urls=set()
    for record in snapshot['records']:
        rows={row['cells'][0]:row for row in record['tables']['overview']}
        for label in ['URL for prospective students','Department']:
            links=rows.get(label,{}).get('links',[])
            if links:
                url=links[0]['url']
                if urlsplit(url).scheme in {'http','https'}: urls.add(url)
                break
    results=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for result in pool.map(lambda url:inspect(url,output),sorted(urls)):
            results.append(result)
            if len(results)%40==0: print(f'Checked {len(results)} of {len(urls)} university links',flush=True)
    (output/'link-audit.json').write_text(json.dumps(results,indent=2)+'\n')
    print(json.dumps({'urls':len(results),'retrieved':sum(r['outcome']=='retrieved' for r in results),'note':'Link retrieval is not fact verification.'}),flush=True)
if __name__=='__main__': main()
