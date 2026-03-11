export type Locale = "en" | "vi" | "fr" | "de";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
  fr: "Français",
  de: "Deutsch",
};

const en = {
  // Nav
  nav_home: "Home",
  nav_about: "About",
  nav_faq: "FAQ",
  nav_policy: "Policy",

  // Home header
  home_title: "HCMC 3D Building Tiles",
  home_subtitle: "Select district(s) to download MVT building tiles from HCMC server.",

  // Quick selection
  btn_clear_all: "Clear All",
  btn_select_urban: "Select Urban (17)",
  btn_select_all: "Select All (22)",
  btn_include_geojson: "Include GeoJSON",
  btn_download_selected: "Process Selected",
  btn_download_all: "Process All HCM",
  btn_download_zip: "Download All as ZIP",
  btn_download: "Download",
  btn_cancel: "Cancel",
  btn_cancel_all: "Cancel All",

  // Download progress
  progress_waiting: "Waiting...",
  progress_completed_files: "Completed Files",

  // Footer
  footer_text: "HCMC 3D Tiles · Built with Vite + Vue",

  // About
  about_title: "About",
  about_intro: "{name} is a tool for downloading MVT (Mapbox Vector Tile) building data from the Ho Chi Minh City 3D map server, packaged into MBTiles format for offline use.",
  about_how_title: "How it works",
  about_step1: "Select one or more of the 22 HCMC districts",
  about_step2: "The backend computes tile coordinates at zoom level 16",
  about_step3: "Tiles are fetched concurrently and written into a SQLite-based MBTiles file",
  about_step4: "Progress is streamed in real-time via Server-Sent Events",
  about_step5: "Download the completed MBTiles file when finished",
  about_tech_title: "Tech stack",
  about_tech_backend: "Bun runtime, bun:sqlite, Worker threads, SSE",
  about_tech_frontend: "Vue 3, Pinia, Vite, Tailwind CSS 4",
  about_tech_pwa: "Installable with offline shell via vite-plugin-pwa",
  about_data_title: "Data source",
  about_data_text: "Building tiles are fetched from the HCMC Department of Information and Communications 3D map tile server. This tool does not host or redistribute any tile data.",

  // FAQ
  faq_title: "Frequently Asked Questions",
  faq_q1: "What format are the downloaded files?",
  faq_a1: "Files are in MBTiles format — a SQLite-based container for map tiles. You can open them with QGIS, MapLibre, Mapbox, or any tool that supports MBTiles.",
  faq_q2: "Can I download tiles for all districts at once?",
  faq_a2: "Yes. Use the \"Download All HCM\" button to download a single MBTiles file containing all 22 districts with deduplicated tiles.",
  faq_q3: "Why does the download take time?",
  faq_a3: "Tiles are fetched from the HCMC server in real-time. The speed depends on the server response time and the number of tiles in the selected districts.",
  faq_q4: "Is the GeoJSON option required?",
  faq_a4: "No. GeoJSON export is optional. When enabled, building footprints are also exported as a GeoJSON file alongside the MBTiles file.",
  faq_q5: "Can I use this offline?",
  faq_a5: "The app shell works offline as a PWA, but downloading tiles requires an active connection to the HCMC tile server.",
  faq_q6: "What zoom level are the tiles?",
  faq_a6: "All tiles are fetched at zoom level 16, which provides building-level detail for 3D visualization.",

  // Policy
  policy_title: "Privacy Policy",
  policy_intro: "This application is an open-source tool. We respect your privacy.",
  policy_data_title: "Data Collection",
  policy_data_text: "This application does not collect, store, or transmit any personal data. All tile downloads are processed through the backend and are not logged or tracked.",
  policy_cookies_title: "Cookies",
  policy_cookies_text: "This application does not use cookies or any tracking technologies.",
  policy_third_title: "Third-Party Services",
  policy_third_text: "Tile data is fetched from the HCMC Department of Information and Communications server. We do not control their privacy practices. No analytics or advertising services are used.",
  policy_changes_title: "Changes",
  policy_changes_text: "This policy may be updated occasionally. Changes will be reflected in the application repository.",

  // Loading
  loading_text: "Loading...",

  // Connection
  connection_error_title: "Connection Failed",
  connection_error_text: "Cannot connect to the backend server. Please make sure the server is running and try again.",
  btn_retry: "Retry",

  // Toasts
  toast_select_warning: "Select at least one district",
};

const vi: typeof en = {
  nav_home: "Trang chủ",
  nav_about: "Giới thiệu",
  nav_faq: "Câu hỏi",
  nav_policy: "Chính sách",

  home_title: "Dữ liệu 3D Toà nhà TP.HCM",
  home_subtitle: "Chọn quận/huyện để tải dữ liệu MVT toà nhà từ máy chủ TP.HCM.",

  btn_clear_all: "Bỏ chọn",
  btn_select_urban: "Chọn nội thành (17)",
  btn_select_all: "Chọn tất cả (22)",
  btn_include_geojson: "Kèm GeoJSON",
  btn_download_selected: "Xử lý quận đã chọn",
  btn_download_all: "Xử lý toàn TP.HCM",
  btn_download_zip: "Tải tất cả dạng ZIP",
  btn_download: "Tải về",
  btn_cancel: "Hủy",
  btn_cancel_all: "Hủy tất cả",

  progress_waiting: "Đang chờ...",
  progress_completed_files: "Tệp hoàn thành",

  footer_text: "HCMC 3D Tiles · Xây dựng với Bun + Vue",

  about_title: "Giới thiệu",
  about_intro: "{name} là công cụ tải dữ liệu MVT (Mapbox Vector Tile) toà nhà từ máy chủ bản đồ 3D TP.HCM, đóng gói thành MBTiles để sử dụng ngoại tuyến.",
  about_how_title: "Cách hoạt động",
  about_step1: "Chọn một hoặc nhiều trong 22 quận/huyện TP.HCM",
  about_step2: "Backend tính toạ độ tile ở mức zoom 16",
  about_step3: "Tile được tải đồng thời và ghi vào tệp MBTiles (SQLite)",
  about_step4: "Tiến trình được truyền thời gian thực qua SSE",
  about_step5: "Tải tệp MBTiles khi hoàn tất",
  about_tech_title: "Công nghệ",
  about_tech_backend: "Bun runtime, bun:sqlite, Worker threads, SSE",
  about_tech_frontend: "Vue 3, Pinia, Vite, Tailwind CSS 4",
  about_tech_pwa: "Cài đặt được dưới dạng PWA với vite-plugin-pwa",
  about_data_title: "Nguồn dữ liệu",
  about_data_text: "Tile toà nhà được lấy từ máy chủ bản đồ 3D của Sở Thông tin và Truyền thông TP.HCM. Công cụ này không lưu trữ hay phân phối lại dữ liệu tile.",

  faq_title: "Câu hỏi thường gặp",
  faq_q1: "Tệp tải về có định dạng gì?",
  faq_a1: "Tệp ở định dạng MBTiles — một container dựa trên SQLite cho map tiles. Bạn có thể mở bằng QGIS, MapLibre, Mapbox hoặc bất kỳ công cụ hỗ trợ MBTiles.",
  faq_q2: "Tôi có thể tải tiles cho tất cả quận cùng lúc không?",
  faq_a2: "Có. Sử dụng nút \"Tải toàn TP.HCM\" để tải một tệp MBTiles chứa tất cả 22 quận với tiles đã loại trùng.",
  faq_q3: "Tại sao quá trình tải mất thời gian?",
  faq_a3: "Tiles được lấy từ máy chủ TP.HCM theo thời gian thực. Tốc độ phụ thuộc vào thời gian phản hồi máy chủ và số lượng tiles.",
  faq_q4: "Tùy chọn GeoJSON có bắt buộc không?",
  faq_a4: "Không. Xuất GeoJSON là tùy chọn. Khi bật, dữ liệu footprint toà nhà cũng được xuất thành tệp GeoJSON.",
  faq_q5: "Tôi có thể sử dụng ngoại tuyến không?",
  faq_a5: "Shell ứng dụng hoạt động ngoại tuyến dưới dạng PWA, nhưng tải tiles cần kết nối đến máy chủ TP.HCM.",
  faq_q6: "Tiles ở mức zoom nào?",
  faq_a6: "Tất cả tiles được lấy ở zoom 16, cung cấp chi tiết cấp toà nhà cho trực quan hoá 3D.",

  policy_title: "Chính sách bảo mật",
  policy_intro: "Ứng dụng này là công cụ mã nguồn mở. Chúng tôi tôn trọng quyền riêng tư của bạn.",
  policy_data_title: "Thu thập dữ liệu",
  policy_data_text: "Ứng dụng không thu thập, lưu trữ hay truyền bất kỳ dữ liệu cá nhân nào. Mọi quá trình tải tiles đều qua backend và không được ghi nhận.",
  policy_cookies_title: "Cookie",
  policy_cookies_text: "Ứng dụng không sử dụng cookie hay bất kỳ công nghệ theo dõi nào.",
  policy_third_title: "Dịch vụ bên thứ ba",
  policy_third_text: "Dữ liệu tile được lấy từ máy chủ Sở TT&TT TP.HCM. Chúng tôi không kiểm soát chính sách bảo mật của họ. Không sử dụng dịch vụ phân tích hay quảng cáo.",
  policy_changes_title: "Thay đổi",
  policy_changes_text: "Chính sách này có thể được cập nhật. Thay đổi sẽ được phản ánh trong kho mã nguồn.",

  loading_text: "Đang tải...",
  connection_error_title: "Lỗi kết nối",
  connection_error_text: "Không thể kết nối đến máy chủ backend. Vui lòng kiểm tra máy chủ đang chạy và thử lại.",
  btn_retry: "Thử lại",

  toast_select_warning: "Vui lòng chọn ít nhất một quận/huyện",
};

const fr: typeof en = {
  nav_home: "Accueil",
  nav_about: "A propos",
  nav_faq: "FAQ",
  nav_policy: "Politique",

  home_title: "Tuiles 3D Batiments HCMV",
  home_subtitle: "Selectionnez des districts pour telecharger les tuiles MVT depuis le serveur HCMV.",

  btn_clear_all: "Tout effacer",
  btn_select_urban: "Urbains (17)",
  btn_select_all: "Tout selectionner (22)",
  btn_include_geojson: "Inclure GeoJSON",
  btn_download_selected: "Traiter la sélection",
  btn_download_all: "Traiter tout HCMV",
  btn_download_zip: "Télécharger tout en ZIP",
  btn_download: "Télécharger",
  btn_cancel: "Annuler",
  btn_cancel_all: "Tout annuler",

  progress_waiting: "En attente...",
  progress_completed_files: "Fichiers termines",

  footer_text: "HCMC 3D Tiles · Construit avec Bun + Vue",

  about_title: "A propos",
  about_intro: "{name} est un outil pour telecharger des donnees MVT (Mapbox Vector Tile) de batiments depuis le serveur 3D de Ho Chi Minh-Ville, empaquetees au format MBTiles pour une utilisation hors-ligne.",
  about_how_title: "Comment ca marche",
  about_step1: "Selectionnez un ou plusieurs des 22 districts de HCMV",
  about_step2: "Le backend calcule les coordonnees des tuiles au niveau de zoom 16",
  about_step3: "Les tuiles sont telechargees en parallele et ecrites dans un fichier MBTiles (SQLite)",
  about_step4: "La progression est diffusee en temps reel via SSE",
  about_step5: "Telechargez le fichier MBTiles une fois termine",
  about_tech_title: "Technologies",
  about_tech_backend: "Bun runtime, bun:sqlite, Worker threads, SSE",
  about_tech_frontend: "Vue 3, Pinia, Vite, Tailwind CSS 4",
  about_tech_pwa: "Installable hors-ligne avec vite-plugin-pwa",
  about_data_title: "Source des donnees",
  about_data_text: "Les tuiles de batiments proviennent du serveur 3D du Departement de l'Information et des Communications de HCMV. Cet outil ne stocke ni redistribue les donnees.",

  faq_title: "Questions frequentes",
  faq_q1: "Quel format pour les fichiers telecharges ?",
  faq_a1: "Les fichiers sont au format MBTiles — un conteneur SQLite pour les tuiles cartographiques. Vous pouvez les ouvrir avec QGIS, MapLibre, Mapbox ou tout outil compatible.",
  faq_q2: "Puis-je telecharger tous les districts d'un coup ?",
  faq_a2: "Oui. Utilisez le bouton \"Telecharger tout HCMV\" pour un fichier MBTiles unique contenant les 22 districts avec deduplication des tuiles.",
  faq_q3: "Pourquoi le telechargement prend-il du temps ?",
  faq_a3: "Les tuiles sont recuperees en temps reel depuis le serveur HCMV. La vitesse depend du temps de reponse du serveur et du nombre de tuiles.",
  faq_q4: "L'option GeoJSON est-elle obligatoire ?",
  faq_a4: "Non. L'export GeoJSON est optionnel. Lorsqu'il est active, les empreintes de batiments sont aussi exportees en GeoJSON.",
  faq_q5: "Puis-je utiliser l'appli hors-ligne ?",
  faq_a5: "L'interface fonctionne hors-ligne en tant que PWA, mais le telechargement des tuiles necessite une connexion au serveur HCMV.",
  faq_q6: "A quel niveau de zoom sont les tuiles ?",
  faq_a6: "Toutes les tuiles sont au niveau de zoom 16, offrant un detail au niveau des batiments pour la visualisation 3D.",

  policy_title: "Politique de confidentialite",
  policy_intro: "Cette application est un outil open-source. Nous respectons votre vie privee.",
  policy_data_title: "Collecte de donnees",
  policy_data_text: "Cette application ne collecte, ne stocke ni ne transmet aucune donnee personnelle. Tous les telechargements de tuiles sont traites par le backend sans journalisation.",
  policy_cookies_title: "Cookies",
  policy_cookies_text: "Cette application n'utilise pas de cookies ni de technologies de suivi.",
  policy_third_title: "Services tiers",
  policy_third_text: "Les donnees de tuiles proviennent du serveur du Departement de l'Information de HCMV. Nous ne controlons pas leurs pratiques de confidentialite. Aucun service d'analyse ou de publicite n'est utilise.",
  policy_changes_title: "Modifications",
  policy_changes_text: "Cette politique peut etre mise a jour. Les changements seront publies dans le depot du projet.",

  loading_text: "Chargement...",
  connection_error_title: "Echec de connexion",
  connection_error_text: "Impossible de se connecter au serveur backend. Veuillez verifier que le serveur est en marche et reessayer.",
  btn_retry: "Reessayer",

  toast_select_warning: "Selectionnez au moins un district",
};

const de: typeof en = {
  nav_home: "Startseite",
  nav_about: "Info",
  nav_faq: "FAQ",
  nav_policy: "Datenschutz",

  home_title: "HCMC 3D-Gebaudekacheln",
  home_subtitle: "Wahlen Sie Bezirke aus, um MVT-Gebaudekacheln vom HCMC-Server herunterzuladen.",

  btn_clear_all: "Alle abwahlen",
  btn_select_urban: "Stadtbezirke (17)",
  btn_select_all: "Alle wahlen (22)",
  btn_include_geojson: "GeoJSON einschließen",
  btn_download_selected: "Auswahl verarbeiten",
  btn_download_all: "Alle HCMC verarbeiten",
  btn_download_zip: "Alles als ZIP herunterladen",
  btn_download: "Herunterladen",
  btn_cancel: "Abbrechen",
  btn_cancel_all: "Alle abbrechen",

  progress_waiting: "Warten...",
  progress_completed_files: "Fertige Dateien",

  footer_text: "HCMC 3D Tiles · Erstellt mit Bun + Vue",

  about_title: "Info",
  about_intro: "{name} ist ein Werkzeug zum Herunterladen von MVT (Mapbox Vector Tile) Gebaudedaten vom Ho-Chi-Minh-Stadt 3D-Kartenserver im MBTiles-Format fur die Offline-Nutzung.",
  about_how_title: "So funktioniert es",
  about_step1: "Wahlen Sie einen oder mehrere der 22 HCMC-Bezirke",
  about_step2: "Das Backend berechnet Kachelkoordinaten auf Zoomstufe 16",
  about_step3: "Kacheln werden parallel abgerufen und in eine SQLite-basierte MBTiles-Datei geschrieben",
  about_step4: "Der Fortschritt wird in Echtzeit uber SSE gestreamt",
  about_step5: "Laden Sie die fertige MBTiles-Datei herunter",
  about_tech_title: "Technologie",
  about_tech_backend: "Bun Runtime, bun:sqlite, Worker Threads, SSE",
  about_tech_frontend: "Vue 3, Pinia, Vite, Tailwind CSS 4",
  about_tech_pwa: "Installierbar mit Offline-Shell uber vite-plugin-pwa",
  about_data_title: "Datenquelle",
  about_data_text: "Gebaudekacheln stammen vom 3D-Kartenserver der HCMC-Informationsbehorde. Dieses Tool speichert oder verteilt keine Kacheldaten.",

  faq_title: "Haufig gestellte Fragen",
  faq_q1: "Welches Format haben die Downloads?",
  faq_a1: "Dateien sind im MBTiles-Format — ein SQLite-basierter Container fur Kartenkacheln. Offnen Sie sie mit QGIS, MapLibre, Mapbox oder jedem MBTiles-kompatiblen Tool.",
  faq_q2: "Kann ich alle Bezirke gleichzeitig herunterladen?",
  faq_a2: "Ja. Verwenden Sie die Schaltflache \"Alle HCMC herunterladen\" fur eine einzelne MBTiles-Datei mit allen 22 Bezirken und deduplizierten Kacheln.",
  faq_q3: "Warum dauert der Download?",
  faq_a3: "Kacheln werden in Echtzeit vom HCMC-Server abgerufen. Die Geschwindigkeit hangt von der Serverantwortzeit und der Kachelanzahl ab.",
  faq_q4: "Ist die GeoJSON-Option erforderlich?",
  faq_a4: "Nein. Der GeoJSON-Export ist optional. Bei Aktivierung werden Gebaudegrundrisse zusatzlich als GeoJSON exportiert.",
  faq_q5: "Kann ich die App offline nutzen?",
  faq_a5: "Die App-Shell funktioniert offline als PWA, aber das Herunterladen von Kacheln erfordert eine Verbindung zum HCMC-Server.",
  faq_q6: "Welche Zoomstufe haben die Kacheln?",
  faq_a6: "Alle Kacheln werden auf Zoomstufe 16 abgerufen, was Details auf Gebaudeebene fur 3D-Visualisierung bietet.",

  policy_title: "Datenschutzerklarung",
  policy_intro: "Diese Anwendung ist ein Open-Source-Tool. Wir respektieren Ihre Privatsphare.",
  policy_data_title: "Datenerfassung",
  policy_data_text: "Diese Anwendung erfasst, speichert oder ubertragt keine personlichen Daten. Alle Kachel-Downloads werden uber das Backend verarbeitet und nicht protokolliert.",
  policy_cookies_title: "Cookies",
  policy_cookies_text: "Diese Anwendung verwendet keine Cookies oder Tracking-Technologien.",
  policy_third_title: "Drittanbieterdienste",
  policy_third_text: "Kacheldaten stammen vom HCMC-Informationsbehorde-Server. Wir kontrollieren nicht deren Datenschutzpraktiken. Es werden keine Analyse- oder Werbedienste verwendet.",
  policy_changes_title: "Anderungen",
  policy_changes_text: "Diese Richtlinie kann aktualisiert werden. Anderungen werden im Projektrepository veroffentlicht.",

  loading_text: "Laden...",
  connection_error_title: "Verbindung fehlgeschlagen",
  connection_error_text: "Verbindung zum Backend-Server nicht moglich. Bitte stellen Sie sicher, dass der Server lauft, und versuchen Sie es erneut.",
  btn_retry: "Erneut versuchen",

  toast_select_warning: "Wahlen Sie mindestens einen Bezirk",
};

export const messages: Record<Locale, typeof en> = { en, vi, fr, de };
