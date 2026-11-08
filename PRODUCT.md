# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML/CSS (+ a little vanilla JS), no build step. Served by Cloudflare Workers static assets from the GitHub repo `juan-hong/byeolji-site`, domain `byeolji.app` (`www` redirects to root).

## Users

원신(Genshin Impact) PC 플레이어. 대부분 커뮤니티 홍보 글(디시인사이드·아카라이브·레딧·빌리빌리 등)의 링크로 처음 들어온다. 몇 초 안에 "이게 뭔지, 내 PC에서 안전한지"를 판단하고 바로 내려받으려 한다. 이미 쓰는 사람은 업데이트·사용법·문의 때문에 다시 온다.

## Product Purpose

Byeolji 는 전체화면 원신 위에 투명 오버레이로 자원 위치 마커를 띄우는 무료 Windows 앱이다. 게임의 큰 지도와 미니맵 위에 마커가 겹쳐 그려지고, 화면 인식으로 지도를 열거나 끌거나 확대해도 알아서 따라간다. 웹 지도(원신맵스·HoYoLAB)를 따로 열지 않고 게임 안에서 채집을 끝내게 하는 것이 목적이다.

이 사이트(byeolji.app)의 일: 처음 온 사람이 무엇인지 이해하고, 경고 창(SmartScreen·크롬)에 놀라지 않고, 설치까지 가게 한다.

## Positioning

- 게임 화면 위에 바로: 큰 지도·미니맵 위에 마커가 겹쳐 그려진다 (웹 지도와 다름).
- 자동 위치 인식: 지도를 열고 끌고 확대해도, 지하 층까지 따라간다. 패드(컨트롤러) 조작 화면도 인식한다.
- 획득 표시(Ctrl+클릭, 1.0.4부터 키 변경 가능), 로그인하면 여러 PC 동기화. 로그인은 선택.

## Capabilities and Constraints

- Windows 10/11 64비트. 설치 파일은 GitHub 릴리스(`juan-hong/Byeolji-releases`, 최신은 `releases/latest`)에서만 배포. 코드 서명이 없어 크롬·SmartScreen 경고가 뜬다 → 사이트가 이유와 넘기는 방법을 정확히 안내해야 한다.
- 관리자 권한 필요(원신이 관리자 권한으로 돌아감).
- 화면 캡처는 PC 안에서만 처리, 어디로도 보내지 않음.
- 앱 UI 언어 7개: 영어, 한국어, 일본어, 중국어(간체), 러시아어, 인도네시아어, 스페인어. 사이트도 7개 언어.
- 단축키: F7 패널, F8 다시 찾기, F10 진단, F6 마커 켜기/끄기(1.0.4부터).
- 실제 게임 화면 스크린샷(마커가 떠 있는 큰 지도·미니맵)을 사이트에 써도 된다(사용자 확인, 팬 콘텐츠 범위). 게임 로고·공식 일러스트는 쓰지 않는다.

## Brand Commitments

- 이름: Byeolji (별지). 로고: 둥근 사각형 청록 남색 바탕(#113A47 계열)에 금색 네 꼭짓점 별(북극성/나침반)과 크림색 원. 워드마크는 기하학적 산세리프.
- HoYoverse 와 관계없는 비공식 개인 팬 프로젝트임을 밝힌다. 원신과 게임 데이터·이미지의 권리는 HoYoverse 에 있다.
- 말투: 만든 사람(원신 좋아하는 대학생)의 친근한 1인칭. 과장·보장 표현("정지 위험 절대 없음" 등) 금지.
- 후원: Ko-fi(모든 언어), 카카오페이(한국어만). 문의 support@byeolji.app (Cloudflare 이메일 라우팅 → Gmail).

## Evidence on Hand

- 실제 자원 지점 약 96,000개(HoYoLAB 데이터), 7.2 스네즈나야까지.
- 사용자 수·후기·평점은 아직 공개할 만한 것이 없다. 지어내지 않는다.
