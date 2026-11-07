// 사이트 번역. 한국어는 index.html 에 있는 문장을 그대로 씀 (여기엔 없음).
// 다른 언어 문장을 고칠 때: 아래에서 같은 이름(예: 'hero.title')을 찾아 따옴표 안만 바꾸세요.
// <br>(줄바꿈), <kbd>…</kbd>(키 모양), <code>…</code> 는 그대로 두세요.
window.I18N = {
  en: {
    'meta.title': 'Byeolji · Resource markers on your Genshin map',
    'meta.desc': 'A free Windows overlay that shows resource locations right on the Genshin Impact PC map and minimap.',
    'nav.how': 'How it works', 'nav.install': 'Install', 'nav.about': 'About',
    'hero.alt': 'The Genshin map around Mondstadt. Resource markers show only under the transparent sheet.',
    'hero.slider': 'Transparent sheet position (markers show where it covers)',
    'hero.drag': '← Drag me',
    'hero.title': 'A sheet of stars<br>on your map.',
    'hero.lede': 'A free helper for Genshin Impact on PC that shows resource locations right on your in-game map and minimap.',
    'hero.download': 'Download for Windows',
    'hero.fine': 'Free · Windows 10/11 64-bit · Fan project, not affiliated with HoYoverse',
    'hero.caption': 'The map around Mondstadt with 144 spots from Byeolji’s data (Teleport Waypoints, Statues of The Seven, Dandelion Seeds, Windwheel Asters and more), placed the same way the app does.',
    'how.title': 'Legend',
    'how.map.t': 'Open the map with <kbd>M</kbd>',
    'how.map.d': 'Drag or zoom the map and the markers you picked follow along. Works underground, in controller mode, and on monitors of all aspect ratios.',
    'how.mini.t': 'Walking? Check the minimap',
    'how.mini.d': 'Nearby resources show inside the minimap too, so you don’t have to reopen the map.',
    'how.done.t': 'Collected spots fade out',
    'how.done.d': '<kbd>Ctrl</kbd>+click a marker to mark it found. Sign in to sync your progress across PCs (signing in is optional).',
    'keys.title': 'Hotkeys', 'keys.f7': 'Open/close the resource panel', 'keys.f8': 'Find my position again', 'keys.f10': 'Diagnostics',
    'install.title': 'The warnings you’ll see when installing',
    'install.why': 'Chrome or Windows will warn that the file "might be dangerous". That’s not because of a virus: Byeolji is a free program made by one person, so it has no code signature (a verified maker stamp) yet, and every new version starts its download count from zero. Please download the installer only from the button on this page (GitHub).',
    'ui.chrome.msg': 'This file isn’t commonly downloaded', 'ui.chrome.delete': 'Delete', 'ui.chrome.keep': 'Keep',
    'install.s1.t': 'If Chrome blocks it: "Keep"',
    'install.s1.d': 'Click the download icon at the top right and choose "Keep" or "Continue". Don’t see it? Type <code>chrome://downloads</code> in the address bar.',
    'ui.smart.title': 'Windows protected your PC', 'ui.smart.msg': 'Microsoft Defender SmartScreen prevented an unrecognized app from starting.', 'ui.smart.more': 'More info', 'ui.smart.dont': 'Don’t run',
    'install.s2.t': 'Blue window: "More info" → "Run anyway"',
    'install.s2.d': 'The run button is hidden at first. It appears after you click "More info".',
    'ui.uac.msg': 'Do you want to allow this app to make changes to your device?', 'ui.uac.yes': 'Yes', 'ui.uac.no': 'No',
    'install.s3.t': 'Administrator permission: "Yes"',
    'install.s3.d': 'Genshin runs as administrator, so Byeolji needs the same permission for hotkeys and the mouse to work over the game.',
    'about.title': 'Who made this',
    'about.text': 'I’m a college student who loves Genshin. I made this because I wanted to see resource locations as an overlay. Your feedback means a lot to me, so feel free to email any bug or idea, however small.',
    'about.mail': 'ghdwndks123@naver.com (email)', 'about.kofi': 'Support on Ko-fi',
    'privacy.title': 'Privacy',
    'privacy.text': 'Your game screen is only used to recognize the map position and never leaves your PC. Signing in is only for syncing and is optional.',
    'privacy.link': 'Privacy policy',
    'footer': 'Byeolji is a personal fan project, not affiliated with HoYoverse. Genshin Impact and its game data and images belong to HoYoverse.',
  },
  ja: {
    'meta.title': 'Byeolji · 原神の地図に素材マーカーを',
    'meta.desc': '原神PC版の大きな地図とミニマップの上に素材の場所を表示する無料のWindowsオーバーレイアプリ。',
    'nav.how': '使い方', 'nav.install': 'インストール', 'nav.about': '作った人',
    'hero.alt': 'モンド城周辺の原神の地図。透明なシートをかぶせた側にだけ素材マーカーが見える。',
    'hero.slider': '透明シートの位置（かぶせた側にマーカーが見えます）',
    'hero.drag': '← ドラッグしてみて',
    'hero.title': '地図の上に、<br>星のシートを一枚。',
    'hero.lede': '原神PC版の大きな地図とミニマップの上に、素材の場所をそのまま表示する無料の補助ツールです。',
    'hero.download': 'Windows版をダウンロード',
    'hero.fine': '無料 · Windows 10/11 64ビット · HoYoverseとは無関係のファンプロジェクト',
    'hero.caption': 'モンド城周辺の地図に、Byeoljiのデータでワープポイント、七天神像、蒲公英の種、風車アスターなど144か所をアプリと同じ方法で表示したもの。',
    'how.title': '凡例',
    'how.map.t': '<kbd>M</kbd>で地図を開くと',
    'how.map.d': '地図をドラッグしたり拡大したりしても、画面を認識して選んだマーカーがついてきます。地下の層、コントローラー操作、さまざまな比率のモニターにも対応。',
    'how.mini.t': '歩いているときはミニマップに',
    'how.mini.d': 'ミニマップの円の中にも近くの素材が出るので、地図を開き直す必要はありません。',
    'how.done.t': '集めた場所は薄く',
    'how.done.d': 'マーカーを<kbd>Ctrl</kbd>+クリックで入手済みに。ログインすると複数のPCで記録を同期できます（ログインは任意）。',
    'keys.title': 'ショートカット', 'keys.f7': '素材を選ぶパネルの開閉', 'keys.f8': '位置を探し直す', 'keys.f10': '診断画面',
    'install.title': 'インストール時に出る警告',
    'install.why': 'ChromeやWindowsが「危険な可能性がある」と警告します。ウイルスがあるからではなく、個人が作った無料のプログラムでまだコード署名（作者確認の印）がなく、新しいバージョンが出るたびにダウンロード数が0から数え直されるためです。インストーラーは必ずこのページのダウンロードボタン（GitHub）から入手してください。',
    'ui.chrome.msg': '一般的にダウンロードされているファイルではありません', 'ui.chrome.delete': '削除', 'ui.chrome.keep': '保存',
    'install.s1.t': 'Chromeがブロックしたら「保存」',
    'install.s1.d': '右上のダウンロードアイコンから「保存」または「続行」を押してください。見つからなければアドレスバーに<code>chrome://downloads</code>と入力。',
    'ui.smart.title': 'Windows によって PC が保護されました', 'ui.smart.msg': 'Microsoft Defender SmartScreen は認識されないアプリの起動を停止しました。', 'ui.smart.more': '詳細情報', 'ui.smart.dont': '実行しない',
    'install.s2.t': '青い画面は「詳細情報」→「実行」',
    'install.s2.d': '最初は実行ボタンが隠れています。「詳細情報」を押すと表示されます。',
    'ui.uac.msg': 'このアプリがデバイスに変更を加えることを許可しますか？', 'ui.uac.yes': 'はい', 'ui.uac.no': 'いいえ',
    'install.s3.t': '管理者権限は「はい」',
    'install.s3.d': '原神は管理者権限で動いているため、同じ権限でないとゲームの上でショートカットやマウスが効きません。',
    'about.title': '作った人',
    'about.text': '原神が大好きな大学生です。素材の場所をオーバーレイで見たくて作りました。皆さんのフィードバックをとても大切にしています。小さなバグや要望も気軽にメールしてください。',
    'about.mail': 'ghdwndks123@naver.com（メール）', 'about.kofi': 'Ko-fiで応援',
    'privacy.title': 'プライバシー',
    'privacy.text': 'ゲーム画面は位置の認識だけに使い、PCの外には絶対に送りません。ログインは同期のためだけで、任意です。',
    'privacy.link': 'プライバシーポリシー',
    'footer': 'ByeoljiはHoYoverseとは関係のない個人のファンプロジェクトです。原神およびゲームデータ・画像の権利はHoYoverseに帰属します。',
  },
  zh: {
    'meta.title': 'Byeolji · 在原神地图上显示资源标记',
    'meta.desc': '在原神PC版大地图和小地图上直接显示资源位置的免费Windows叠加层应用。',
    'nav.how': '使用方法', 'nav.install': '安装', 'nav.about': '关于作者',
    'hero.alt': '蒙德城周边的原神地图。只有被透明薄片覆盖的一侧才显示资源标记。',
    'hero.slider': '透明薄片的位置（覆盖处显示标记）',
    'hero.drag': '← 拖动试试',
    'hero.title': '在地图上，<br>覆一张星图。',
    'hero.lede': '在原神PC版的大地图和小地图上直接显示资源位置的免费辅助工具。',
    'hero.download': '下载 Windows 版',
    'hero.fine': '免费 · Windows 10/11 64位 · 与HoYoverse无关的粉丝项目',
    'hero.caption': '在蒙德城周边地图上，用 Byeolji 的数据按应用相同的方式标出传送锚点、七天神像、蒲公英籽、风车菊等144处。',
    'how.title': '图例',
    'how.map.t': '按<kbd>M</kbd>打开地图',
    'how.map.d': '拖动或缩放地图时，会识别画面，选好的标记随之移动。支持地下层、手柄操作，以及各种比例的显示器。',
    'how.mini.t': '走路时看小地图',
    'how.mini.d': '小地图的圆圈里也会显示附近的资源，不用再打开地图。',
    'how.done.t': '已收集的地点变淡',
    'how.done.d': '<kbd>Ctrl</kbd>+点击标记即可设为已获得。登录后可在多台电脑间同步记录（登录为可选）。',
    'keys.title': '快捷键', 'keys.f7': '打开/关闭资源面板', 'keys.f8': '重新定位', 'keys.f10': '诊断界面',
    'install.title': '安装时出现的警告',
    'install.why': 'Chrome 或 Windows 会提示“可能有危险”。这不是因为有病毒，而是因为这是个人制作的免费程序，还没有代码签名（开发者认证章），而且每出一个新版本，下载人数都会从0重新计算。请务必只从本页的下载按钮（GitHub）获取安装文件。',
    'ui.chrome.msg': '此文件不常被下载', 'ui.chrome.delete': '删除', 'ui.chrome.keep': '保留',
    'install.s1.t': 'Chrome 拦截时点“保留”',
    'install.s1.d': '点右上角的下载图标，选择“保留”或“继续”。找不到的话在地址栏输入<code>chrome://downloads</code>。',
    'ui.smart.title': 'Windows 已保护你的电脑', 'ui.smart.msg': 'Microsoft Defender SmartScreen 阻止了无法识别的应用启动。', 'ui.smart.more': '更多信息', 'ui.smart.dont': '不运行',
    'install.s2.t': '蓝色窗口点“更多信息”→“仍要运行”',
    'install.s2.d': '一开始运行按钮是隐藏的，点“更多信息”后才会出现。',
    'ui.uac.msg': '你要允许此应用对你的设备进行更改吗？', 'ui.uac.yes': '是', 'ui.uac.no': '否',
    'install.s3.t': '管理员权限点“是”',
    'install.s3.d': '原神以管理员权限运行，Byeolji 也需要相同权限，快捷键和鼠标才能在游戏上生效。',
    'about.title': '关于作者',
    'about.text': '我是一个喜欢原神的大学生。因为想用叠加层看资源位置，就做了这个工具。非常重视大家的反馈，发现小 bug 或有建议都欢迎发邮件给我。',
    'about.mail': 'ghdwndks123@naver.com（邮件）', 'about.kofi': '在 Ko-fi 支持我',
    'privacy.title': '隐私',
    'privacy.text': '游戏画面只用于识别地图位置，绝不会发送到你的电脑之外。登录仅用于同步，为可选项。',
    'privacy.link': '隐私政策',
    'footer': 'Byeolji 是与 HoYoverse 无关的个人粉丝项目，原神及其游戏数据、图片的权利归 HoYoverse 所有。',
  },
  ru: {
    'meta.title': 'Byeolji · Метки ресурсов на карте Genshin',
    'meta.desc': 'Бесплатный оверлей для Windows: показывает ресурсы прямо на большой карте и мини-карте Genshin Impact на ПК.',
    'nav.how': 'Как работает', 'nav.install': 'Установка', 'nav.about': 'Об авторе',
    'hero.alt': 'Карта Genshin вокруг Мондштадта. Метки ресурсов видны только под прозрачным листом.',
    'hero.slider': 'Положение прозрачного листа (метки видны там, где он лежит)',
    'hero.drag': '← Потяните',
    'hero.title': 'Лист со звёздами<br>поверх карты.',
    'hero.lede': 'Бесплатный помощник для Genshin Impact на ПК: показывает места ресурсов прямо на большой карте и мини-карте в игре.',
    'hero.download': 'Скачать для Windows',
    'hero.fine': 'Бесплатно · Windows 10/11 64-бит · Фанатский проект, не связан с HoYoverse',
    'hero.caption': 'Карта вокруг Мондштадта со 144 точками из данных Byeolji (точки телепортации, статуи семи Архонтов, семена одуванчика, ветряные астры и другое), расставленными так же, как это делает приложение.',
    'how.title': 'Легенда',
    'how.map.t': 'Откройте карту клавишей <kbd>M</kbd>',
    'how.map.d': 'Двигайте и приближайте карту — выбранные метки следуют за ней. Работает под землёй, в режиме геймпада и на мониторах с любым соотношением сторон.',
    'how.mini.t': 'В пути — на мини-карте',
    'how.mini.d': 'Ближайшие ресурсы видны и внутри мини-карты, так что карту не нужно открывать снова.',
    'how.done.t': 'Собранное становится бледнее',
    'how.done.d': '<kbd>Ctrl</kbd>+клик по метке — отметить как найденную. Войдите, чтобы синхронизировать прогресс между ПК (вход необязателен).',
    'keys.title': 'Горячие клавиши', 'keys.f7': 'Открыть/закрыть панель ресурсов', 'keys.f8': 'Найти позицию заново', 'keys.f10': 'Диагностика',
    'install.title': 'Предупреждения при установке',
    'install.why': 'Chrome или Windows предупредят, что файл «может быть опасен». Дело не в вирусе: это бесплатная программа одного автора, у неё пока нет цифровой подписи (печати проверенного автора), а счётчик скачиваний каждой новой версии начинается с нуля. Скачивайте установщик только по кнопке на этой странице (GitHub).',
    'ui.chrome.msg': 'Этот файл редко скачивают', 'ui.chrome.delete': 'Удалить', 'ui.chrome.keep': 'Сохранить',
    'install.s1.t': 'Если Chrome блокирует — «Сохранить»',
    'install.s1.d': 'Нажмите значок загрузок справа вверху и выберите «Сохранить» или «Продолжить». Не видно? Введите <code>chrome://downloads</code> в адресной строке.',
    'ui.smart.title': 'Система Windows защитила ваш компьютер', 'ui.smart.msg': 'Фильтр SmartScreen в Microsoft Defender предотвратил запуск неопознанного приложения.', 'ui.smart.more': 'Подробнее', 'ui.smart.dont': 'Не выполнять',
    'install.s2.t': 'Синее окно: «Подробнее» → «Выполнить в любом случае»',
    'install.s2.d': 'Сначала кнопка запуска скрыта. Она появится после нажатия «Подробнее».',
    'ui.uac.msg': 'Разрешить этому приложению вносить изменения на вашем устройстве?', 'ui.uac.yes': 'Да', 'ui.uac.no': 'Нет',
    'install.s3.t': 'Права администратора — «Да»',
    'install.s3.d': 'Genshin работает с правами администратора, и Byeolji нужны те же права, чтобы горячие клавиши и мышь работали поверх игры.',
    'about.title': 'Об авторе',
    'about.text': 'Я студент, который очень любит Genshin. Сделал программу, потому что хотел видеть места ресурсов в виде оверлея. Ваши отзывы для меня очень важны — пишите на почту о любых ошибках и идеях, даже мелких.',
    'about.mail': 'ghdwndks123@naver.com (почта)', 'about.kofi': 'Поддержать на Ko-fi',
    'privacy.title': 'Конфиденциальность',
    'privacy.text': 'Изображение игры используется только для определения позиции на карте и никогда не покидает ваш ПК. Вход нужен только для синхронизации и необязателен.',
    'privacy.link': 'Политика конфиденциальности',
    'footer': 'Byeolji — личный фанатский проект, не связанный с HoYoverse. Права на Genshin Impact, игровые данные и изображения принадлежат HoYoverse.',
  },
  id: {
    'meta.title': 'Byeolji · Penanda sumber daya di peta Genshin',
    'meta.desc': 'Overlay Windows gratis yang menampilkan lokasi sumber daya langsung di peta besar dan minimap Genshin Impact PC.',
    'nav.how': 'Cara kerja', 'nav.install': 'Instal', 'nav.about': 'Pembuat',
    'hero.alt': 'Peta Genshin di sekitar Mondstadt. Penanda hanya terlihat di bawah lembar transparan.',
    'hero.slider': 'Posisi lembar transparan (penanda terlihat di bagian yang tertutup)',
    'hero.drag': '← Geser',
    'hero.title': 'Selembar bintang<br>di atas petamu.',
    'hero.lede': 'Alat bantu gratis untuk Genshin Impact PC yang menampilkan lokasi sumber daya langsung di peta besar dan minimap dalam game.',
    'hero.download': 'Unduh untuk Windows',
    'hero.fine': 'Gratis · Windows 10/11 64-bit · Proyek penggemar, tidak terkait HoYoverse',
    'hero.caption': 'Peta di sekitar Mondstadt dengan 144 titik dari data Byeolji (Teleport Waypoint, Patung The Seven, Dandelion Seed, Windwheel Aster, dan lainnya), ditempatkan dengan cara yang sama seperti di aplikasi.',
    'how.title': 'Legenda',
    'how.map.t': 'Buka peta dengan <kbd>M</kbd>',
    'how.map.d': 'Geser atau perbesar peta, penanda yang kamu pilih ikut bergerak. Bisa di lantai bawah tanah, mode controller, dan monitor berbagai rasio.',
    'how.mini.t': 'Saat berjalan, lihat minimap',
    'how.mini.d': 'Sumber daya terdekat juga muncul di dalam minimap, jadi tidak perlu membuka peta lagi.',
    'how.done.t': 'Yang sudah diambil jadi pudar',
    'how.done.d': '<kbd>Ctrl</kbd>+klik penanda untuk menandainya sudah ditemukan. Login untuk menyinkronkan catatan antar-PC (login opsional).',
    'keys.title': 'Pintasan', 'keys.f7': 'Buka/tutup panel sumber daya', 'keys.f8': 'Cari posisi lagi', 'keys.f10': 'Diagnostik',
    'install.title': 'Peringatan saat instalasi',
    'install.why': 'Chrome atau Windows akan memperingatkan bahwa file "mungkin berbahaya". Bukan karena ada virus: ini program gratis buatan satu orang, belum punya tanda tangan kode (stempel pembuat terverifikasi), dan setiap versi baru menghitung jumlah unduhan dari nol lagi. Unduh installer hanya dari tombol di halaman ini (GitHub).',
    'ui.chrome.msg': 'File ini tidak umum didownload', 'ui.chrome.delete': 'Hapus', 'ui.chrome.keep': 'Simpan',
    'install.s1.t': 'Jika Chrome memblokir: "Simpan"',
    'install.s1.d': 'Klik ikon unduhan di kanan atas lalu pilih "Simpan" atau "Lanjutkan". Tidak terlihat? Ketik <code>chrome://downloads</code> di bilah alamat.',
    'ui.smart.title': 'Windows melindungi PC Anda', 'ui.smart.msg': 'Microsoft Defender SmartScreen mencegah aplikasi yang tidak dikenal dimulai.', 'ui.smart.more': 'Info selengkapnya', 'ui.smart.dont': 'Jangan jalankan',
    'install.s2.t': 'Jendela biru: "Info selengkapnya" → "Tetap jalankan"',
    'install.s2.d': 'Awalnya tombol jalankan tersembunyi. Tombol muncul setelah kamu klik "Info selengkapnya".',
    'ui.uac.msg': 'Izinkan aplikasi ini membuat perubahan pada perangkat Anda?', 'ui.uac.yes': 'Ya', 'ui.uac.no': 'Tidak',
    'install.s3.t': 'Izin administrator: "Ya"',
    'install.s3.d': 'Genshin berjalan sebagai administrator, jadi Byeolji perlu izin yang sama agar pintasan dan mouse bekerja di atas game.',
    'about.title': 'Pembuat',
    'about.text': 'Aku mahasiswa yang suka banget Genshin. Aku membuat ini karena ingin melihat lokasi sumber daya sebagai overlay. Masukan pengguna sangat berarti buatku, jadi kirim saja bug atau ide sekecil apa pun lewat email.',
    'about.mail': 'ghdwndks123@naver.com (email)', 'about.kofi': 'Dukung di Ko-fi',
    'privacy.title': 'Privasi',
    'privacy.text': 'Layar game hanya dipakai untuk mengenali posisi peta dan tidak pernah dikirim keluar dari PC-mu. Login hanya untuk sinkronisasi dan bersifat opsional.',
    'privacy.link': 'Kebijakan privasi',
    'footer': 'Byeolji adalah proyek penggemar pribadi yang tidak terkait dengan HoYoverse. Hak atas Genshin Impact serta data dan gambar game milik HoYoverse.',
  },
  es: {
    'meta.title': 'Byeolji · Marcadores de recursos en tu mapa de Genshin',
    'meta.desc': 'Overlay gratuito para Windows que muestra los recursos directamente en el mapa y el minimapa de Genshin Impact en PC.',
    'nav.how': 'Cómo funciona', 'nav.install': 'Instalar', 'nav.about': 'Quién lo hizo',
    'hero.alt': 'El mapa de Genshin alrededor de Mondstadt. Los marcadores solo se ven bajo la lámina transparente.',
    'hero.slider': 'Posición de la lámina transparente (los marcadores se ven donde cubre)',
    'hero.drag': '← Arrástrala',
    'hero.title': 'Una lámina de estrellas<br>sobre tu mapa.',
    'hero.lede': 'Ayudante gratuito para Genshin Impact en PC que muestra los recursos directamente en el mapa y el minimapa del juego.',
    'hero.download': 'Descargar para Windows',
    'hero.fine': 'Gratis · Windows 10/11 de 64 bits · Proyecto de fans, sin relación con HoYoverse',
    'hero.caption': 'El mapa alrededor de Mondstadt con 144 puntos de los datos de Byeolji (puntos de teletransporte, Estatuas de Los Siete, semillas de diente de león, margaritas voladoras y más), colocados igual que en la app.',
    'how.title': 'Leyenda',
    'how.map.t': 'Abre el mapa con <kbd>M</kbd>',
    'how.map.d': 'Arrastra o haz zoom y los marcadores que elegiste te siguen. Funciona bajo tierra, con mando y en monitores de cualquier proporción.',
    'how.mini.t': 'Caminando, en el minimapa',
    'how.mini.d': 'Los recursos cercanos también aparecen dentro del minimapa, así no tienes que volver a abrir el mapa.',
    'how.done.t': 'Lo recogido se atenúa',
    'how.done.d': '<kbd>Ctrl</kbd>+clic en un marcador para marcarlo como encontrado. Inicia sesión para sincronizar tu progreso entre PC (es opcional).',
    'keys.title': 'Atajos', 'keys.f7': 'Abrir/cerrar el panel de recursos', 'keys.f8': 'Volver a buscar la posición', 'keys.f10': 'Diagnóstico',
    'install.title': 'Los avisos al instalar',
    'install.why': 'Chrome o Windows avisarán de que el archivo "podría ser peligroso". No es por un virus: es un programa gratuito hecho por una sola persona, aún no tiene firma de código (sello de autor verificado) y cada versión nueva empieza a contar descargas desde cero. Descarga el instalador solo desde el botón de esta página (GitHub).',
    'ui.chrome.msg': 'Este archivo no se descarga con frecuencia', 'ui.chrome.delete': 'Eliminar', 'ui.chrome.keep': 'Conservar',
    'install.s1.t': 'Si Chrome lo bloquea: "Conservar"',
    'install.s1.d': 'Pulsa el icono de descargas arriba a la derecha y elige "Conservar" o "Continuar". ¿No lo ves? Escribe <code>chrome://downloads</code> en la barra de direcciones.',
    'ui.smart.title': 'Windows protegió su PC', 'ui.smart.msg': 'Microsoft Defender SmartScreen impidió el inicio de una aplicación no reconocida.', 'ui.smart.more': 'Más información', 'ui.smart.dont': 'No ejecutar',
    'install.s2.t': 'Ventana azul: "Más información" → "Ejecutar de todas formas"',
    'install.s2.d': 'Al principio el botón de ejecutar está oculto. Aparece al pulsar "Más información".',
    'ui.uac.msg': '¿Quieres permitir que esta aplicación haga cambios en el dispositivo?', 'ui.uac.yes': 'Sí', 'ui.uac.no': 'No',
    'install.s3.t': 'Permiso de administrador: "Sí"',
    'install.s3.d': 'Genshin se ejecuta como administrador, así que Byeolji necesita el mismo permiso para que los atajos y el ratón funcionen sobre el juego.',
    'about.title': 'Quién lo hizo',
    'about.text': 'Soy un estudiante universitario al que le encanta Genshin. Lo hice porque quería ver los recursos como un overlay. Tus comentarios me importan muchísimo: envíame por correo cualquier fallo o idea, por pequeños que sean.',
    'about.mail': 'ghdwndks123@naver.com (correo)', 'about.kofi': 'Apóyame en Ko-fi',
    'privacy.title': 'Privacidad',
    'privacy.text': 'La imagen del juego solo se usa para reconocer la posición en el mapa y nunca sale de tu PC. Iniciar sesión solo sirve para sincronizar y es opcional.',
    'privacy.link': 'Política de privacidad',
    'footer': 'Byeolji es un proyecto personal de fans sin relación con HoYoverse. Los derechos de Genshin Impact y de sus datos e imágenes pertenecen a HoYoverse.',
  },
};

// 적용: 한국어 원문은 처음 읽을 때 저장해 두고, 고른 언어 문장으로 바꿈
(() => {
  const LANGS = ['ko', 'en', 'ja', 'zh', 'ru', 'id', 'es'];
  const ko = {};
  document.querySelectorAll('[data-i18n]').forEach((el) => { ko[el.dataset.i18n] = el.innerHTML; });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    const [attr, key] = el.dataset.i18nAttr.split(':');
    ko[key] = el.getAttribute(attr);
  });
  window.I18N.ko = ko;

  const pick = () => {
    const q = new URLSearchParams(location.search).get('lang');
    if (LANGS.includes(q)) return q;
    try { const s = localStorage.getItem('lang'); if (LANGS.includes(s)) return s; } catch {}
    for (const l of navigator.languages || [navigator.language || 'en']) {
      const base = String(l).toLowerCase().split('-')[0];
      if (LANGS.includes(base)) return base;
    }
    return 'en';
  };

  window.t = (key) => (window.I18N[window.byeoljiLang] || {})[key] ?? ko[key] ?? '';

  const apply = (lang) => {
    window.byeoljiLang = lang;
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.innerHTML = window.t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
      const [attr, key] = el.dataset.i18nAttr.split(':');
      el.setAttribute(attr, window.t(key));
    });
    document.querySelectorAll('[data-only]').forEach((el) => { el.hidden = el.dataset.only !== lang; });
    const sel = document.getElementById('lang');
    if (sel) sel.value = lang;
    document.dispatchEvent(new CustomEvent('langchange'));
  };

  apply(pick());
  document.getElementById('lang')?.addEventListener('change', (e) => {
    try { localStorage.setItem('lang', e.target.value); } catch {}
    apply(e.target.value);
  });
})();
