-- DPD CMS 초기 데이터
--
-- assets/js/cms-store.js 의 기본 데이터를 그대로 옮긴 것이다.
-- 지금 화면에 보이는 내용과 같으므로, 적용 직후 사이트가 그대로 유지된다.
-- 다시 실행해도 안전하도록 id 충돌 시 갱신한다.

-- mainHero (3건)
insert into public.main_hero ("id", "enabled", "eyebrow", "title", "media_type", "media", "alt", "sort_order") values
  ('hero-total-solution', true, 'TOTAL SOLUTION', '공장 자동화의 모든 해답, 디피디에 있습니다', 'video', 'assets/images/dpd/main-hero-01.mp4', '공장 자동화 토탈 솔루션', 0),
  ('hero-global-partnership', true, 'GLOBAL PARTNERSHIP', '글로벌 부품, 국내 기술력으로 연결하다', 'video', 'assets/images/dpd/main-hero-02.mp4', '글로벌 자동화 부품 파트너십', 1),
  ('hero-field-engineering', true, 'FIELD ENGINEERING', '설치부터 유지보수까지 현장을 위한 솔루션', 'video', 'assets/images/dpd/main-hero-03.mp4', '현장 기술지원 엔지니어링', 2)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "eyebrow" = excluded."eyebrow",
  "title" = excluded."title",
  "media_type" = excluded."media_type",
  "media" = excluded."media",
  "alt" = excluded."alt",
  "sort_order" = excluded."sort_order";

-- developmentItems (3건)
insert into public.development_items ("id", "enabled", "eyebrow", "title", "image", "alt", "href", "external", "visual_image", "detail_eyebrow", "detail_title", "lead", "summary", "gallery", "overview_title", "overview_description", "bullets", "spec_eyebrow", "spec_title", "specs", "feature_eyebrow", "feature_title", "features", "sort_order") values
  ('dev-usc', true, 'DODAM ULTRA SONIC DRY CLEANER', 'USC 초음파 건식 세정 시스템', 'assets/images/dpd/202608/dodam-usc-device.jpg', 'USC 초음파 건식 세정 시스템', 'kr/product/usc.html#content', false, 'assets/images/dpd/202608/dodam-usc-flow.jpg', 'DODAM ULTRA SONIC DRY CLEANER', 'USC 초음파 건식 세정 시스템', '부유 파티클을 최대 99.5% 수준까지 제거하는 고효율 건식 세정 시스템', 'USC는 초음파를 이용한 고속 Air Blowing과 양면 Vacuum Suction을 조합하여 공정 중 발생하는 미세 분진을 흩날림 없이 흡입합니다. 고객사의 소재 폭과 장비 구성에 맞춰 세정 거리와 유틸리티 박스를 주문 대응할 수 있습니다.', array['assets/images/dpd/202608/dodam-usc-device.jpg', 'assets/images/dpd/202608/dodam-usc-flow.jpg']::text[], 'Air Blowing + Vacuum Suction', '2차전지 전극, 반도체, 디스플레이 등 분진 관리가 중요한 공정에서 비접촉 방식으로 표면 손상을 줄이고 택트타임을 단축합니다.', array['Dry SiO2 기준 40μm 부유 파티클 제거율 99.5% 이상', '세정 거리 5~2500mm 주문 대응', '최대 150m/s Blowing, 공정 속도 최대 2m/s 대응', 'DIO, A/D 기본 제어와 Ethernet 옵션 대응']::text[], 'CLEANING PERFORMANCE', 'USC 주요 사양', '[{"label":"적용 공정","value":"2차전지, 반도체, 디스플레이, Roll-to-Roll 및 Roller 세정"},{"label":"제거 효율","value":"1.5~3μm 90% 이상, 10μm 97% 이상, 40μm 99.5% 이상"},{"label":"Utility Box","value":"VCE-375, VCE-500 라인업 / 24Vdc ±10% / 70~75dB"},{"label":"집진 장치","value":"CBA-1200AT3 / 0.3μm 이상 99% 포집 / 최대 600mm USC 지원"}]'::jsonb, 'KEY POINTS', '적용 포인트', '[{"title":"고성능 세정","text":"초음파와 흡입 구조를 함께 적용해 분진 제거율과 공정 안정성을 높입니다."},{"title":"주문 대응","text":"세정 길이와 설치 간격을 고객 장비 레이아웃에 맞춰 설계합니다."},{"title":"라인업 확장","text":"Head, Utility Box, Dust Collector, VUV-Type 구성까지 공정별 조합이 가능합니다."}]'::jsonb, 0),
  ('dev-index-table', true, 'TROCHOID INDEX UNIT', 'INDEX TABLE SYSTEMS', 'assets/images/dpd/202608/index-table-system.jpg', 'INDEX TABLE SYSTEMS', 'kr/product/index-table.html#content', false, 'assets/images/dpd/202608/index-table-system.jpg', 'TROCHOID INDEX UNIT', 'INDEX TABLE SYSTEMS', '고하중 정밀 이송을 위한 대구경·슬림형 인덱스 테이블 시스템', '고객이 요구하는 외경과 내경, 탑재 하중, 정밀도 조건에 맞춰 설계할 수 있는 주문형 인덱스 테이블입니다. Trochoid 구동 구조를 기반으로 안정적인 반복 정밀도와 내구성을 확보합니다.', array['assets/images/dpd/202608/index-table-system.jpg', 'assets/images/dpd/202608/trochoid-bearing-unit.jpg']::text[], 'DPD Original Trochoid Drive', '고하중 회전 이송, 대형 워크 반송, 정밀 포지셔닝이 필요한 장비에서 고객 사양에 맞춘 회전 유닛을 구현합니다.', array['고객사 요구 외경·내경 대응 가능', '대구경·슬림형 구조 설계', '고하중·고정도 이송 공정 특화', 'Trochoid Index Unit, Trochoid Bearing Unit 대응']::text[], 'SYSTEM CONFIGURATION', 'Index Table 구성', '[{"label":"핵심 구조","value":"Trochoid Index Unit / Trochoid Bearing Unit"},{"label":"대응 사양","value":"대구경, 슬림 타입, 고하중, 고정도 이송"},{"label":"개발 방식","value":"고객 장비 조건 기반 주문 설계"},{"label":"주요 실적","value":"반도체, 2차전지, CT, 디스플레이, 방산 레이더 장비 대응"}]'::jsonb, 'KEY POINTS', '적용 포인트', '[{"title":"정밀 이송","text":"반복 정밀도와 하중 조건을 함께 검토해 회전 이송 품질을 안정화합니다."},{"title":"장비 최적화","text":"워크 크기와 주변 구조에 맞춰 외경·내경·높이를 조정합니다."},{"title":"국산화 대응","text":"해외 Index 대체 및 장비 맞춤형 설계 실적을 기반으로 대응합니다."}]'::jsonb, 1),
  ('dev-order-made-bearing', true, 'SLEWING RING / SLIM SPLIT BEARING', 'ORDER MADE BEARING SYSTEMS', 'assets/images/dpd/202608/order-made-bearing-system.jpg', 'ORDER MADE BEARING SYSTEMS', 'kr/product/order-made-bearing.html#content', false, 'assets/images/dpd/202608/order-made-bearing-system.jpg', 'SLEWING RING / SLIM SPLIT BEARING', 'ORDER MADE BEARING SYSTEMS', '대형 회전 구조와 제한된 설치 공간을 위한 오더메이드 베어링 시스템', '고객 장비의 외경·내경 조건과 하중, 설치 방식에 맞춰 설계하는 베어링 시스템입니다. CRB 대체 베어링 구동계 기술협약을 바탕으로 대구경 슬림 구조와 고정도 회전 응답을 제공합니다.', array['assets/images/dpd/202608/order-made-bearing-system.jpg', 'assets/images/dpd/202608/slim-split-bearing.jpg', 'assets/images/dpd/202608/trochoid-bearing-unit.jpg']::text[], 'Outer / Inner Diameter Order Made', '장비 프레임과 구동 조건을 함께 검토해 Slewing Ring, Slim Split Bearing, Bearing Unit을 목적에 맞게 구성합니다.', array['고객사 요구 외경·내경 대응 가능', '대구경·슬림형 고하중 구조', 'CRB 대체 베어링 구동계 대응', 'AGV, CT, 방산 레이더 등 회전 장비 적용']::text[], 'BEARING SYSTEM', 'Order Made Bearing 구성', '[{"label":"라인업","value":"Slewing Ring, Slim Split Bearing, Bearing Unit"},{"label":"대응 조건","value":"고하중, 고정도, 대구경, 슬림 타입"},{"label":"기술 기반","value":"Cross-Roller Bearing 대체 베어링 구동계 기술협약"},{"label":"적용 실적","value":"AGV Bearing, 산업 CT Bearing, 방산 Radar Bearing"}]'::jsonb, 'KEY POINTS', '적용 포인트', '[{"title":"설계 자유도","text":"장비 구조에 맞춰 베어링 치수와 체결 방식을 조정합니다."},{"title":"하중 안정성","text":"회전 하중과 편심 조건을 함께 검토해 내구성을 높입니다."},{"title":"유지보수성","text":"분할 구조와 주문 사양을 통해 설치와 유지보수 편의성을 고려합니다."}]'::jsonb, 2)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "eyebrow" = excluded."eyebrow",
  "title" = excluded."title",
  "image" = excluded."image",
  "alt" = excluded."alt",
  "href" = excluded."href",
  "external" = excluded."external",
  "visual_image" = excluded."visual_image",
  "detail_eyebrow" = excluded."detail_eyebrow",
  "detail_title" = excluded."detail_title",
  "lead" = excluded."lead",
  "summary" = excluded."summary",
  "gallery" = excluded."gallery",
  "overview_title" = excluded."overview_title",
  "overview_description" = excluded."overview_description",
  "bullets" = excluded."bullets",
  "spec_eyebrow" = excluded."spec_eyebrow",
  "spec_title" = excluded."spec_title",
  "specs" = excluded."specs",
  "feature_eyebrow" = excluded."feature_eyebrow",
  "feature_title" = excluded."feature_title",
  "features" = excluded."features",
  "sort_order" = excluded."sort_order";

-- handledItems (15건)
insert into public.handled_items ("id", "enabled", "title", "eyebrow", "country", "category", "description", "image", "gallery", "href", "external", "sort_order") values
  ('handled-han-drive', true, 'HAN DRIVE', 'MADE IN CHINA', 'china', '구동·제어', 'DD MOTOR', 'assets/images/dpd/live-items/handled-han-drive.jpg', array['assets/images/dpd/live-items/gallery/han-drive/01.png', 'assets/images/dpd/live-items/gallery/han-drive/02.png', 'assets/images/dpd/live-items/gallery/han-drive/03.png']::text[], 'https://www.handrivemotor.com/', true, 0),
  ('handled-veichi', true, 'VEICHI', 'MADE IN CHINA', 'china', '구동·제어', 'SERVO MOTOR & DRIVER, INVERTER, HMI, IO MODULE', 'assets/images/dpd/live-items/handled-veichi.jpg', array['assets/images/dpd/live-items/gallery/veichi/01.png', 'assets/images/dpd/live-items/gallery/veichi/02.png', 'assets/images/dpd/live-items/gallery/veichi/03.png']::text[], 'https://www.veichi.com/', true, 1),
  ('handled-desboer', true, 'DESBOER', 'MADE IN CHINA', 'china', '감속·인덱스', 'HIGH PRECISION REDUCER', 'assets/images/dpd/live-items/handled-desboer.jpg', array['assets/images/dpd/live-items/gallery/desboer/01.png', 'assets/images/dpd/live-items/gallery/desboer/02.png', 'assets/images/dpd/live-items/gallery/desboer/03.png']::text[], 'https://desboergroup.com/', true, 2),
  ('handled-win-roller', true, 'WIN ROLLER', 'MADE IN CHINA', 'china', '이송·컨베이어', 'MOTOR ROLLER, POWER MOLLER', 'assets/images/dpd/live-items/handled-win-roller.jpg', array['assets/images/dpd/live-items/gallery/win-roller/01.png', 'assets/images/dpd/live-items/gallery/win-roller/02.png', 'assets/images/dpd/live-items/gallery/win-roller/03.png']::text[], 'https://www.drum-roller.com/', true, 3),
  ('handled-sango-automation', true, 'SANGO AUTOMATION', 'MADE IN CHINA', 'china', '감속·인덱스', 'CAM INDEX DRIVE, HYPOID HOLLOW REDUCER', 'assets/images/dpd/live-items/handled-sango-automation.jpg', array['assets/images/dpd/live-items/gallery/sango-automation/01.png', 'assets/images/dpd/live-items/gallery/sango-automation/02.png', 'assets/images/dpd/live-items/gallery/sango-automation/03.png']::text[], 'https://www.sango-automation.com/', true, 4),
  ('handled-direc-seiko', true, 'DIREC SEIKO', 'MADE IN CHINA', 'china', '정밀 스테이지·베어링', 'HIGH PRECISION & NANO STAGE, LINEAR & VOICE COIL MOTOR', 'assets/images/dpd/live-items/handled-direc-seiko.jpg', array['assets/images/dpd/live-items/gallery/direc-seiko/01.png', 'assets/images/dpd/live-items/gallery/direc-seiko/02.png', 'assets/images/dpd/live-items/gallery/direc-seiko/03.png']::text[], 'https://www.direc-tech.com/', true, 5),
  ('handled-wanming', true, 'WANMING', 'MADE IN CHINA', 'china', '정밀 스테이지·베어링', 'MOTORIZED STAGE', 'assets/images/dpd/202608/logo-wanming.png', array['assets/images/dpd/202608/product-wanming-01.jpeg', 'assets/images/dpd/202608/product-wanming-02.jpeg', 'assets/images/dpd/202608/product-wanming-03.jpeg']::text[], 'https://www.rotationstage.com/', true, 6),
  ('handled-kmf', true, 'KMF', 'MADE IN GERMANY', 'germany', '정밀 스테이지·베어링', 'WIRE RACE BALL BEARINGS, BUILT-IN ELEMENTS', 'assets/images/dpd/202608/logo-kmf.png', array['assets/images/dpd/202608/product-kmf-01.jpeg', 'assets/images/dpd/202608/product-kmf-02.jpeg', 'assets/images/dpd/202608/product-kmf-03.jpeg']::text[], 'https://kmf-bearings.de/en/drahtkugellager-einbauelemente/', true, 7),
  ('handled-ticbel', true, 'TICBEL', 'MADE IN CHINA', 'china', '이송·컨베이어', 'MAGLEV CONVEYOR LINES', 'assets/images/dpd/202608/logo-ticbel.png', array['assets/images/dpd/202608/product-ticbel-01.jpeg', 'assets/images/dpd/202608/product-ticbel-02.jpeg', 'assets/images/dpd/202608/product-ticbel-03.jpeg']::text[], 'https://www.ticbel.com/', true, 8),
  ('handled-yamaha', true, 'YAMAHA', 'MADE IN JAPAN', 'japan', '로봇', 'SCARA ROBOT', 'assets/images/dpd/202608/logo-yamaha.png', array['assets/images/dpd/202608/product-yamaha-01.png', 'assets/images/dpd/202608/product-yamaha-02.png', 'assets/images/dpd/202608/product-yamaha-03.png']::text[], 'https://global.yamaha-motor.com/business/robot/', true, 9),
  ('handled-dongwoo-robot', true, 'DONGWOO ROBOT', 'MADE IN KOREA', 'korea', '로봇', 'SINGLE AXIS ROBOT, BALL SCREW & BELT ROBOT', 'assets/images/dpd/live-items/handled-dongwoo-robot.jpg', array['assets/images/dpd/live-items/gallery/dongwoo-robot/01.jpg', 'assets/images/dpd/live-items/gallery/dongwoo-robot/02.jpg', 'assets/images/dpd/live-items/gallery/dongwoo-robot/03.jpg']::text[], 'https://www.dwrobot.co.kr/', true, 10),
  ('handled-j-one-corporation', true, 'J-ONE CORPORATION', 'MADE IN KOREA', 'korea', '이송·컨베이어', 'CAM RACK & ROLLER PINION, INDEX UNIT, BEARING UNIT', 'assets/images/dpd/live-items/handled-j-one-corporation.jpg', array['assets/images/dpd/live-items/gallery/j-one-corporation/01.png', 'assets/images/dpd/live-items/gallery/j-one-corporation/02.png', 'assets/images/dpd/live-items/gallery/j-one-corporation/03.png']::text[], 'http://www.joneinc.com/', true, 11),
  ('handled-actone', true, 'ACTONE', 'MADE IN KOREA', 'korea', '감속·인덱스', 'HOLLOW ROTARY REDUCER', 'assets/images/dpd/live-items/handled-actone.jpg', array['assets/images/dpd/live-items/gallery/actone/01.png', 'assets/images/dpd/live-items/gallery/actone/02.png', 'assets/images/dpd/live-items/gallery/actone/03.png']::text[], 'http://www.act-one.co.kr/', true, 12),
  ('handled-e-motion-tek', true, 'E-MOTION TEK', 'MADE IN KOREA', 'korea', '구동·제어', 'MOTION CONTROLLER, STEP MOTOR & DRIVER, IO MODULE', 'assets/images/dpd/live-items/handled-e-motion-tek.jpg', array['assets/images/dpd/live-items/gallery/e-motion-tek/01.png', 'assets/images/dpd/live-items/gallery/e-motion-tek/02.jpg', 'assets/images/dpd/live-items/gallery/e-motion-tek/03.png']::text[], 'http://emotiontek.co.kr/', true, 13),
  ('handled-dobot', true, 'DOBOT', 'MADE IN CHINA', 'china', '로봇', 'COLLABORATIVE ROBOT, DESKTOP ROBOT', 'assets/images/dpd/202608/logo-dobot.png', array['assets/images/dpd/202608/product-dobot-01.png', 'assets/images/dpd/202608/product-dobot-02.png', 'assets/images/dpd/202608/product-dobot-03.png']::text[], 'https://www.dobot-robots.com/', true, 14)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "title" = excluded."title",
  "eyebrow" = excluded."eyebrow",
  "country" = excluded."country",
  "category" = excluded."category",
  "description" = excluded."description",
  "image" = excluded."image",
  "gallery" = excluded."gallery",
  "href" = excluded."href",
  "external" = excluded."external",
  "sort_order" = excluded."sort_order";

-- customers (26건)
insert into public.customers ("id", "enabled", "row_position", "name", "image", "alt", "sort_order") values
  ('customer-samsung-display', true, 'top', 'Samsung Display', 'assets/images/partner/sansung-display.svg', 'Samsung Display', 0),
  ('customer-samsung-sdi', true, 'top', 'Samsung SDI', 'assets/images/partner/samsung-sdi.svg', 'Samsung SDI', 1),
  ('customer-samsung-electro', true, 'top', 'Samsung Electro-Mechanics', 'assets/images/partner/samsung-electro.svg', 'Samsung Electro-Mechanics', 2),
  ('customer-hynix', true, 'top', 'SK hynix', 'assets/images/partner/hynix.svg', 'SK hynix', 3),
  ('customer-sk-on', true, 'top', 'SK on', 'assets/images/partner/sk-on.svg', 'SK on', 4),
  ('customer-lg-display', true, 'top', 'LG Display', 'assets/images/partner/lg-display.svg', 'LG Display', 5),
  ('customer-lg-energy', true, 'top', 'LG Energy Solution', 'assets/images/partner/lg-energy.svg', 'LG Energy Solution', 6),
  ('customer-lx', true, 'top', 'LX Hausys', 'assets/images/partner/lx.svg', 'LX Hausys', 7),
  ('customer-hyundai', true, 'top', 'Hyundai', 'assets/images/partner/hyundai.svg', 'Hyundai', 8),
  ('customer-semes', true, 'top', 'SEMES', 'assets/images/partner/semes.svg', 'SEMES', 9),
  ('customer-sfa', true, 'top', 'SFA', 'assets/images/partner/sfa.svg', 'SFA', 10),
  ('customer-kohyoung', true, 'top', 'Koh Young Technology', 'assets/images/partner/kohyoung.png', 'Koh Young Technology', 11),
  ('customer-cfi', true, 'top', 'CFI', 'assets/images/partner/cfi.svg', 'CFI', 12),
  ('customer-viewworks', true, 'top', 'Vieworks', 'assets/images/partner/viewworks.png', 'Vieworks', 13),
  ('customer-unitest', true, 'bottom', 'UniTest', 'assets/images/partner/unitest.png', 'UniTest', 14),
  ('customer-protec', true, 'bottom', 'PROTEC', 'assets/images/partner/protec.jpg', 'PROTEC', 15),
  ('customer-innobiz', true, 'bottom', 'Innobiz', 'assets/images/partner/innobiz.jpg', 'Innobiz', 16),
  ('customer-jastech', true, 'bottom', 'JASTECH', 'assets/images/partner/jastech.png', 'JASTECH', 17),
  ('customer-jas-ats', true, 'bottom', 'JAS ATS', 'assets/images/partner/jas-ats.png', 'JAS ATS', 18),
  ('customer-jtcorp', true, 'bottom', 'JT Corp', 'assets/images/partner/jtcorp.png', 'JT Corp', 19),
  ('customer-cowintech', true, 'bottom', 'Cowin Tech', 'assets/images/partner/cowintech.png', 'Cowin Tech', 20),
  ('customer-bs-tech', true, 'bottom', 'BS Technics', 'assets/images/partner/bs-tech.png', 'BS Technics', 21),
  ('customer-madetech', true, 'bottom', 'MadeTech', 'assets/images/partner/madetech.png', 'MadeTech', 22),
  ('customer-synapse', true, 'bottom', 'Synapse Imaging', 'assets/images/partner/synapse.png', 'Synapse Imaging', 23),
  ('customer-shonics', true, 'bottom', 'Shonics', 'assets/images/partner/shonics.svg', 'Shonics', 24),
  ('customer-ani', true, 'bottom', 'A&I', 'assets/images/partner/ani.png', 'A&I', 25)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "row_position" = excluded."row_position",
  "name" = excluded."name",
  "image" = excluded."image",
  "alt" = excluded."alt",
  "sort_order" = excluded."sort_order";

-- resources (3건)
insert into public.resources ("id", "enabled", "category", "file_type", "title", "summary", "file_url", "file_name", "sort_order") values
  ('resource-handrive-drawing', true, 'drawing', 'ZIP', 'HANDRIVE 도면 자료', 'HANDRIVE DD MOTOR 적용 검토를 위한 도면 자료입니다.', 'assets/downloads/plan/handrive-2dcad.zip', '2DCAD.zip', 0),
  ('resource-dongwoo-catalog', true, 'catalog', 'PDF', 'DONGWOO ROBOT 자료', 'DONGWOO ROBOT 단축 로봇 검토를 위한 로컬 자료입니다.', 'assets/downloads/catalog/dongwoo-robot-catalog.pdf', '동우로봇_종합카달로그-V1.pdf', 1),
  ('resource-actone-catalog', true, 'catalog', 'PDF', 'ACTONE HOLLOW ROTARY REDUCER 자료', 'ACTONE HOLLOW ROTARY REDUCER 적용 검토를 위한 로컬 자료입니다.', 'assets/downloads/catalog/actone-hollow-rotary-reducer.pdf', '엑트원-중공감속기.pdf', 2)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "category" = excluded."category",
  "file_type" = excluded."file_type",
  "title" = excluded."title",
  "summary" = excluded."summary",
  "file_url" = excluded."file_url",
  "file_name" = excluded."file_name",
  "sort_order" = excluded."sort_order";

-- notices (5건)
insert into public.notices ("id", "enabled", "published_on", "title", "summary", "href", "content", "sort_order") values
  ('notice-summer-2026', true, '2026.07.01', '주식회사 디피디 2026년 하계휴가 일정 공지 드립니다.', '하계휴가 기간 중 상담 및 출고 일정이 일부 조정될 수 있습니다. 긴급 문의는 대표 이메일로 남겨 주시면 순차적으로 확인하겠습니다.', 'kr/pr/news__bgu_view_idx_1.html#content', '<p>하계휴가 기간 중 상담 및 출고 일정이 일부 조정될 수 있습니다. 긴급 문의는 대표 이메일로 남겨 주시면 순차적으로 확인하겠습니다.</p>', 0),
  ('notice-smart-factory-2026', true, '2026.01.15', '스마트 팩토리의 완성, 주식회사 디피디가 2026년 제조 혁신의 든든한 기반이 되겠습니다.', '디피디는 제품 선정과 기술 검토, 공급, 사후대응까지 현장 중심의 자동화 솔루션을 안정적으로 제공하겠습니다.', 'kr/pr/news__bgu_view_idx_2.html#content', '<p>디피디는 제품 선정과 기술 검토, 공급, 사후대응까지 현장 중심의 자동화 솔루션을 안정적으로 제공하겠습니다.</p>', 1),
  ('notice-thanks-2025', true, '2025.12.31', '함께였기에 가능했던 2025년, 진심으로 감사드립니다.', '한 해 동안 보내주신 신뢰에 감사드립니다. 2026년에도 정확한 제품과 책임 있는 기술지원으로 보답하겠습니다.', 'kr/pr/news__bgu_view_idx_3.html#content', '<p>한 해 동안 보내주신 신뢰에 감사드립니다. 2026년에도 정확한 제품과 책임 있는 기술지원으로 보답하겠습니다.</p>', 2),
  ('notice-summer-2025', true, '2025.08.20', '주식회사 디피디 2025년 하계휴가 일정 공지 드립니다.', '휴가 기간 중 문의 회신과 납품 일정에 변동이 있을 수 있으니 일정 협의가 필요한 경우 사전에 연락 부탁드립니다.', 'kr/pr/news__bgu_view_idx_4.html#content', '<p>휴가 기간 중 문의 회신과 납품 일정에 변동이 있을 수 있으니 일정 협의가 필요한 경우 사전에 연락 부탁드립니다.</p>', 3),
  ('notice-renewal-open', true, '2025.07.11', '주식회사 디피디 홈페이지 리뉴얼 오픈 안내 드립니다.', '디피디의 개발품목, 취급품목, 자료실, 문의 정보를 더 쉽게 확인하실 수 있도록 홈페이지를 정비했습니다.', 'kr/pr/news__bgu_view_idx_5.html#content', '<p>디피디의 개발품목, 취급품목, 자료실, 문의 정보를 더 쉽게 확인하실 수 있도록 홈페이지를 정비했습니다.</p>', 4)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "published_on" = excluded."published_on",
  "title" = excluded."title",
  "summary" = excluded."summary",
  "href" = excluded."href",
  "content" = excluded."content",
  "sort_order" = excluded."sort_order";

-- companyProfile (8건)
insert into public.company_profile ("id", "enabled", "label", "value", "note", "sort_order") values
  ('profile-회사명', true, '회사명', '주식회사 디피디 (DPD Co.,Ltd.)', '', 0),
  ('profile-법인-전환일', true, '법인 전환일', '2024년 10월 02일', '(개인사업자 2022년 05월 설립)', 1),
  ('profile-대표이사', true, '대표이사', '박준일', '', 2),
  ('profile-사업분야', true, '사업분야', '자동화 부품 개발 및 도소매 유통', '', 3),
  ('profile-본사', true, '본사', '경기도 시흥시 마유로 376, 417호 (정왕동, 시흥창업센터)', '', 4),
  ('profile-공장', true, '공장', '경기도 안산시 상록구 버대길 172 (양상동)', '', 5),
  ('profile-주요-품목', true, '주요 품목', 'Cam Rack & Roller Pinion, DD Motor, Linear Motor, Reducer, Robot Etc...', '', 6),
  ('profile-홈페이지', true, '홈페이지', 'https://dpdxfa.com/', '', 7)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "label" = excluded."label",
  "value" = excluded."value",
  "note" = excluded."note",
  "sort_order" = excluded."sort_order";

-- companyHistory (15건)
insert into public.company_history ("id", "enabled", "year", "month", "text", "sort_order") values
  ('history-2026-03', true, '2026', '03', '중소벤처기업진흥공단 글로벌창업사관학교 7기 입교 (서울본교)', 0),
  ('history-2026-01', true, '2026', '01', '사업장 이전', 1),
  ('history-2025-12', true, '2025', '12', '벤처기업확인 인증', 2),
  ('history-2025-02', true, '2025', '02', '청년창업사관학교 14기 졸업 (안산본교)', 3),
  ('history-2025-01', true, '2025', '01', '사업장 이전 (경기도 시흥시 소재)', 4),
  ('history-2024-11', true, '2024', '11', '특허등록 제10-2736155호', 5),
  ('history-2024-11', true, '2024', '11', '통신판매업 등록', 6),
  ('history-2024-09', true, '2024', '09', '법인사업자 전환 (주식회사 디피디)', 7),
  ('history-2024-03', true, '2024', '03', '중소벤처기업진흥공단 청년창업사관학교 14기 입교 (안산본교)', 8),
  ('history-2023-03', true, '2023', '03', '크로스롤러베어링 대체 베어링 구동계 제작 기술 협약 (“J”社)', 9),
  ('history-2023-03', true, '2023', '03', '리니어피커 제작 관련 기술 협약 (“M”社)', 10),
  ('history-2022-10', true, '2022', '10', '3D비전 · 협동로봇 활용 AMR 제작 기술 협약 (“T”社)', 11),
  ('history-2022-06', true, '2022', '06', '리니어 모터 활용 구동계 제작 기술 협약 (“D”社)', 12),
  ('history-2022-06', true, '2022', '06', '특허출원 직선 및 회전 구동계 분진 제거 장치', 13),
  ('history-2022-05', true, '2022', '05', '개인사업자 설립 (디피디)', 14)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "year" = excluded."year",
  "month" = excluded."month",
  "text" = excluded."text",
  "sort_order" = excluded."sort_order";

-- certificates (4건)
insert into public.certificates ("id", "enabled", "title", "image", "alt", "sort_order") values
  ('certificate-벤처기업확인서', true, '벤처기업확인서', 'assets/images/dpd/certificates/venture-certificate.jpg', '벤처기업확인서', 0),
  ('certificate-통신판매업-신고증', true, '통신판매업 신고증', 'assets/images/dpd/certificates/mail-order-registration.jpg', '통신판매업 신고증', 1),
  ('certificate-청창사-졸업장', true, '청창사 졸업장', 'assets/images/dpd/certificates/youth-startup-academy-diploma.jpg', '청창사 졸업장', 2),
  ('certificate-특허증', true, '특허증', 'assets/images/dpd/certificates/patent-certificate.jpg', '특허증', 3)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "title" = excluded."title",
  "image" = excluded."image",
  "alt" = excluded."alt",
  "sort_order" = excluded."sort_order";

-- supportSteps (6건)
insert into public.support_steps ("id", "enabled", "step", "title", "description", "image", "alt", "sort_order") values
  ('support-step-01', true, 'STEP 01', '기술·견적 문의 접수', '온라인, 전화, 이메일을 통해 사용 조건과 요구 사양을 접수합니다.', 'assets/images/support/support-step-01-control-panel.jpg', '기술 문의를 검토하는 자동화 제어 패널 이미지', 0),
  ('support-step-02', true, 'STEP 02', '제품 선정 상담', '용도, 하중, 정밀도, 납기 조건을 검토해 최적 품목을 제안합니다.', 'assets/images/support/support-step-02-clean-room.jpg', '제품 선정 상담을 위한 클린룸 제조 현장 이미지', 1),
  ('support-step-03', true, 'STEP 03', '도면·기술자료 제공', '도면, 카탈로그, 기술자료를 제공하고 적용 사양을 함께 검토합니다.', 'assets/images/support/support-step-03-machine-panel.jpg', '도면과 기술자료 검토용 산업 장비 제어 패널 이미지', 2),
  ('support-step-04', true, 'STEP 04', '공급·납품', '경쟁력 있는 가격과 안정적인 납기로 제품을 공급합니다.', 'assets/images/support/support-step-04-conveyor.jpg', '공급과 납품을 위한 산업용 컨베이어 현장 이미지', 3),
  ('support-step-05', true, 'STEP 05', '설치·운영 지원', '현장 설치와 초기 운전 과정에서 필요한 기술 지원을 제공합니다.', 'assets/images/support/support-step-05-robot-arm.jpg', '설치 운영 지원을 위한 로봇 자동화 설비 이미지', 4),
  ('support-step-06', true, 'STEP 06', '유지보수·사후 대응', '납품 이후에도 운전 안정성과 유지보수를 위한 대응을 이어갑니다.', 'assets/images/support/support-step-06-cnc-machine.jpg', '유지보수 사후 대응을 위한 CNC 가공 설비 이미지', 5)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "step" = excluded."step",
  "title" = excluded."title",
  "description" = excluded."description",
  "image" = excluded."image",
  "alt" = excluded."alt",
  "sort_order" = excluded."sort_order";

-- networkPartner (3건)
insert into public.network_partner ("id", "enabled", "label", "value", "sort_order") values
  ('partner-사업자등록번호', true, '사업자등록번호', '0202332953', 0),
  ('partner-설립일', true, '설립일', '2026년 01월 21일', 1),
  ('partner-주소', true, '주소', 'Tòa nhà Thành Đạt, Số 3 Lê Thánh Tông, Ngô Quyền, Hải Phòng, Việt Nam', 2)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "label" = excluded."label",
  "value" = excluded."value",
  "sort_order" = excluded."sort_order";

-- networkCoverage (3건)
insert into public.network_coverage ("id", "enabled", "region", "description", "sort_order") values
  ('coverage-01', true, 'Hưng Yên', '제조 현장 사양 검토와 초기 납품 대응을 연결합니다.', 0),
  ('coverage-02', true, 'Bắc Ninh', '전자·자동화 산업 고객사의 제품 선정과 기술 상담을 지원합니다.', 1),
  ('coverage-03', true, 'Hải Phòng', '항만 물류와 북부 산업단지 납품·유지보수 거점으로 대응합니다.', 2)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "region" = excluded."region",
  "description" = excluded."description",
  "sort_order" = excluded."sort_order";

-- networkResponse (4건)
insert into public.network_response ("id", "enabled", "title", "description", "sort_order") values
  ('response-01', true, '현지 제품 공급', '디피디 취급 품목의 베트남 내 견적 · 납품 대응', 0),
  ('response-02', true, '기술 상담 · 사양 검토', '현장 조건에 맞는 품목 선정과 도면 · 기술자료 지원', 1),
  ('response-03', true, '설치 · 시운전 지원', '현지 방문을 통한 설치 및 초기 가동 지원', 2),
  ('response-04', true, '사후 대응 · 유지보수', '납품 이후 현지 A/S 및 유지보수 대응', 3)
on conflict (id) do update set
  "enabled" = excluded."enabled",
  "title" = excluded."title",
  "description" = excluded."description",
  "sort_order" = excluded."sort_order";
