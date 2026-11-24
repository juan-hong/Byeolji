"""언어별 주소(/en/, /ja/ ...) 페이지 만들기. 검색엔진이 언어마다 따로 보게 함.

원본(한국어, 루트)을 고친 뒤 다시 실행: python tools/lang_pages.py
- 복사본마다 html lang, 제목, 설명, 대표 주소(canonical), og, hreflang 을 그 언어로
- <meta name="byeolji-lang"> 로 페이지 언어를 알려 줌 (i18n.js, map.js 가 먼저 봄)
- 안쪽 링크(/, /download/, /genshin/map/)는 같은 언어 주소로
- 원본에도 hreflang 을 넣음. sitemap.xml 도 다시 씀
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = 'https://byeolji.app'
LANGS = ['ko', 'en', 'ja', 'zh', 'ru', 'id', 'es']
HTML_LANG = {'zh': 'zh-CN'}
PAGES = ['/', '/download/', '/genshin/map/']

# 페이지별 제목·설명 (ko 는 원본 그대로)
META = {
 '/': {
  'en': ('Byeolji · Genshin Impact map', 'Byeolji: a Genshin Impact resource map and a map overlay for the game. Your progress stays in sync across web, PC and Android with one account.'),
  'ja': ('Byeolji · 原神マップ', 'Byeolji: 原神の資源マップと、ゲームの上に重ねる地図アプリ。Web・PC・Android どこでも同じアカウントで記録が続きます。'),
  'zh': ('Byeolji · 原神地图', 'Byeolji: 原神资源地图，以及叠加在游戏上的地图应用。网页、电脑、安卓都能用同一账号同步记录。'),
  'ru': ('Byeolji · карта Genshin Impact', 'Byeolji: карта ресурсов Genshin Impact и оверлей карты поверх игры. Прогресс синхронизируется между вебом, ПК и Android одним аккаунтом.'),
  'id': ('Byeolji · Peta Genshin Impact', 'Byeolji: peta sumber daya Genshin Impact dan overlay peta di atas game. Progres tersinkron di web, PC, dan Android dengan satu akun.'),
  'es': ('Byeolji · Mapa de Genshin Impact', 'Byeolji: mapa de recursos de Genshin Impact y superposición del mapa sobre el juego. Tu progreso se sincroniza entre web, PC y Android con una cuenta.'),
 },
 '/download/': {
  'en': ('Byeolji · Download', 'Download Byeolji: the Genshin Impact map overlay for Windows and the Android app (beta), with requirements and install guides.'),
  'ja': ('Byeolji · ダウンロード', 'Byeolji のダウンロード: Windows 用の原神マップオーバーレイと Android アプリ(ベータ)、推奨スペックとインストールガイド。'),
  'zh': ('Byeolji · 下载', '下载 Byeolji: Windows 版原神地图叠加工具和安卓应用(测试版)，以及配置要求和安装指南。'),
  'ru': ('Byeolji · Скачать', 'Скачать Byeolji: оверлей карты Genshin Impact для Windows и приложение для Android (бета), требования и инструкции по установке.'),
  'id': ('Byeolji · Unduh', 'Unduh Byeolji: overlay peta Genshin Impact untuk Windows dan aplikasi Android (beta), dengan spesifikasi dan panduan instalasi.'),
  'es': ('Byeolji · Descargar', 'Descarga Byeolji: la superposición del mapa de Genshin Impact para Windows y la app para Android (beta), con requisitos y guías de instalación.'),
 },
 '/genshin/map/': {
  'en': ('Byeolji Map · Genshin Impact interactive map', 'Genshin Impact resource map. Find chests, oculi, local specialties and more, and check off what you collect in sync with the Byeolji PC and Android apps.'),
  'ja': ('Byeolji マップ · 原神インタラクティブマップ', '原神の資源マップ。宝箱・神瞳・特産品などの場所を確認し、獲得したところをチェックすると Byeolji の PC・Android アプリと同期されます。'),
  'zh': ('Byeolji 地图 · 原神互动地图', '原神资源地图。查看宝箱、神瞳、特产等位置，标记已获取的地点，与 Byeolji 电脑版和安卓版同步。'),
  'ru': ('Карта Byeolji · интерактивная карта Genshin Impact', 'Карта ресурсов Genshin Impact: сундуки, окулусы, местные диковинки и многое другое. Отмечайте собранное — синхронизация с приложениями Byeolji для ПК и Android.'),
  'id': ('Peta Byeolji · Peta interaktif Genshin Impact', 'Peta sumber daya Genshin Impact. Lihat lokasi peti, oculus, spesialisasi lokal, dan lainnya, lalu tandai yang sudah dikumpulkan, tersinkron dengan aplikasi PC dan Android Byeolji.'),
  'es': ('Mapa Byeolji · Mapa interactivo de Genshin Impact', 'Mapa de recursos de Genshin Impact. Encuentra cofres, óculos, especialidades locales y más, y marca lo que recojas sincronizado con las apps de Byeolji para PC y Android.'),
 },
}

def url(lang, page):
    return SITE + ('' if lang == 'ko' else '/' + lang) + page

def alternates(page):
    out = [f'<link rel="alternate" hreflang="{HTML_LANG.get(l, l) if l != "zh" else "zh-Hans"}" href="{url(l, page)}">' for l in LANGS]
    out.append(f'<link rel="alternate" hreflang="x-default" href="{url("ko", page)}">')
    return '\n'.join(out)

def src_path(page):
    return os.path.join(ROOT, page.strip('/').replace('/', os.sep), 'index.html') if page != '/' else os.path.join(ROOT, 'index.html')

MARK_A = '<!-- lang-pages:alternates -->'
MARK_B = '<!-- /lang-pages:alternates -->'

def with_alternates(s, page):
    s = re.sub(re.escape(MARK_A) + r'.*?' + re.escape(MARK_B) + r'\n?', '', s, flags=re.S)
    block = f'{MARK_A}\n{alternates(page)}\n{MARK_B}\n'
    return re.sub(r'(<link rel="canonical"[^>]*>\n)', lambda m: m.group(1) + block, s, count=1)

def set_attr(s, pattern, value):
    s2, n = re.subn(pattern, lambda m: m.group(1) + value + m.group(2), s, count=1)
    return s2

for page in PAGES:
    path = src_path(page)
    src = open(path, encoding='utf-8').read()
    assert '<link rel="canonical"' in src, page
    # 원본: hreflang 만
    src = with_alternates(src, page)
    open(path, 'w', encoding='utf-8', newline='').write(src)
    for lang in LANGS[1:]:
        title, desc = META[page][lang]
        s = src
        s = re.sub(r'<html lang="ko"', f'<html lang="{HTML_LANG.get(lang, lang)}"', s, count=1)
        s = re.sub(r'<title>[^<]*</title>', f'<title>{title}</title>', s, count=1)
        s = set_attr(s, r'(<meta name="description" content=")[^"]*(")', desc)
        s = set_attr(s, r'(<meta property="og:title" content=")[^"]*(")', title)
        s = set_attr(s, r'(<meta property="og:description" content=")[^"]*(")', desc)
        s = set_attr(s, r'(<meta property="og:url" content=")[^"]*(")', url(lang, page))
        s = set_attr(s, r'(<link rel="canonical" href=")[^"]*(")', url(lang, page))
        # 페이지 언어 알림 (charset 바로 뒤)
        s = s.replace('<meta charset="utf-8">', f'<meta charset="utf-8">\n<meta name="byeolji-lang" content="{lang}">', 1)
        # 안쪽 페이지 링크는 같은 언어로
        for p in PAGES:
            s = s.replace(f'href="{p}"', f'href="/{lang}{p}"')
        # (base 는 링크 바꾼 뒤에 넣어야 언어 주소로 안 바뀜)
        if page != '/':
            s = s.replace('<meta charset="utf-8">', f'<meta charset="utf-8">\n<base href="{page}">', 1)
        out = os.path.join(ROOT, lang, page.strip('/').replace('/', os.sep), 'index.html') if page != '/' else os.path.join(ROOT, lang, 'index.html')
        os.makedirs(os.path.dirname(out), exist_ok=True)
        head = f'<!-- 자동 생성 (tools/lang_pages.py). 직접 고치지 말고 원본을 고친 뒤 다시 실행 -->\n'
        open(out, 'w', encoding='utf-8', newline='').write(s.replace('<!doctype html>\n', '<!doctype html>\n' + head, 1))

# sitemap
items = []
for page in PAGES:
    links = '\n'.join(f'    <xhtml:link rel="alternate" hreflang="{"zh-Hans" if l == "zh" else l}" href="{url(l, page)}"/>' for l in LANGS)
    links += f'\n    <xhtml:link rel="alternate" hreflang="x-default" href="{url("ko", page)}"/>'
    for l in LANGS:
        items.append(f'  <url>\n    <loc>{url(l, page)}</loc>\n{links}\n  </url>')
open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8', newline='\n').write(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    + '\n'.join(items) + '\n</urlset>\n')
print('ok', len(PAGES) * (len(LANGS) - 1), 'pages')
