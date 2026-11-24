"""Publish explicitly reviewed official department URLs from a private cache.

Search hits alone are never published. The review input records the operator's
selected primary page; the audit must confirm that page was retrieved. A URL
confirms neither degree availability nor the rest of the admissions facts.
"""
import argparse
import json
from pathlib import Path
from urllib.parse import urlsplit


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('review')
    parser.add_argument('audit')
    parser.add_argument('searches')
    args = parser.parse_args()
    selected = json.loads(Path(args.review).read_text())
    results = json.loads(Path(args.audit).read_text())
    searches = json.loads(Path(args.searches).read_text())
    by_url = {result['url']: result for result in results}
    reviewed = {}
    for program in selected:
        url = program['selected']['url']
        parsed = urlsplit(url)
        if parsed.scheme not in {'http', 'https'} or parsed.username or parsed.password:
            raise ValueError('Unsafe reviewed URL')
        if by_url[url]['outcome'] != 'retrieved':
            continue
        reviewed[program['amsId']] = {
            'url': url,
            'source': url,
            'label': program['department'],
            'checkedOn': '2026-11-23',
            'scope': program['scope'],
        }
    Path('src/catalog/department-websites.js').write_text(
        '// Reviewed official department/contact/faculty pages where AMS omits a university URL.\n'
        '// A source confirms the department link, not all program policies.\n'
        'export const reviewedDepartmentWebsites = '
        + json.dumps(reviewed, indent=2, ensure_ascii=False) + ';\n'
    )
    # Publish the search coverage, never raw snippets or unreviewed hit URLs.
    inventory = [{
        'amsId': program['amsId'],
        'checkedOn': '2026-11-23',
        'searchPerformed': True,
        'reviewedDepartmentUrl': reviewed.get(program['amsId'], {}).get('url'),
        'scope': 'A null URL means no independently reviewed page added in this pass; it does not mean no website exists.',
    } for program in searches]
    Path('docs/research/missing-department-link-search.json').write_text(
        json.dumps(inventory, indent=2) + '\n'
    )
    print(json.dumps({'searchedListings': len(searches), 'reviewedUrls': len(reviewed)}))


if __name__ == '__main__':
    main()
