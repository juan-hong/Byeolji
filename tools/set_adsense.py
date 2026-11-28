"""구글 애드센스 값 넣기: 게시자 id, (승인 뒤) 광고 단위 id.

  python tools/set_adsense.py ca-pub-1234567890123456
  python tools/set_adsense.py ca-pub-1234567890123456 --home 111 --guide 222 --download 333 --map 444

- ads.js 의 CLIENT·SLOTS
- ads.txt (google.com, pub-..., DIRECT, f08c47fec0942fa0)
- 원본 페이지 4개의 <meta name="google-adsense-account"> (사이트 소유 확인용)
그 뒤 언어별 페이지도 다시 만듦 (tools/lang_pages.py). 끝나면 커밋·푸시만 하면 됨
"""
import argparse, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'download/index.html', 'guide/index.html', 'genshin/map/index.html']
GOOGLE_CERT = 'f08c47fec0942fa0'  # 구글이 정해 둔 ads.txt 인증 id (모든 게시자 같음)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('client', help='ca-pub-로 시작하는 게시자 id')
    for k in ('home', 'guide', 'download', 'map'):
        ap.add_argument('--' + k, help=f'{k} 자리 광고 단위 id (숫자)')
    a = ap.parse_args()
    if not re.fullmatch(r'ca-pub-\d{10,20}', a.client):
        sys.exit('게시자 id 는 ca-pub-숫자 꼴이어야 함')

    p = os.path.join(ROOT, 'ads.js')
    s = open(p, encoding='utf-8').read()
    s = re.sub(r"const CLIENT = '[^']*';", f"const CLIENT = '{a.client}';", s, count=1)
    for k in ('home', 'guide', 'download', 'map'):
        v = getattr(a, k)
        if v is not None:
            if not re.fullmatch(r'\d{5,20}', v):
                sys.exit(f'--{k} 광고 단위 id 는 숫자여야 함')
            s = re.sub(rf"{k}: '[^']*'", f"{k}: '{v}'", s, count=1)
    open(p, 'w', encoding='utf-8', newline='\n').write(s)

    pub = a.client.removeprefix('ca-')
    open(os.path.join(ROOT, 'ads.txt'), 'w', encoding='utf-8', newline='\n').write(
        f'google.com, {pub}, DIRECT, {GOOGLE_CERT}\n')

    for page in PAGES:
        p = os.path.join(ROOT, page)
        s = open(p, encoding='utf-8').read()
        s = re.sub(r'(<meta name="google-adsense-account" content=")[^"]*(")', rf'\g<1>{a.client}\g<2>', s, count=1)
        open(p, 'w', encoding='utf-8', newline='').write(s)

    subprocess.run([sys.executable, os.path.join(ROOT, 'tools', 'lang_pages.py')], check=True)
    print('done:', a.client, {k: getattr(a, k) for k in ('home', 'guide', 'download', 'map') if getattr(a, k)})


if __name__ == '__main__':
    main()
