(function (window) {
  "use strict";

  var STORAGE_KEY = "dpd.cms.database.v1";
  var TOUCH_KEY = "dpd.cms.database.touch";
  var SESSION_KEY = "dpd.cms.session.v1";
  var ADMIN_ID = "admin";
  var ADMIN_PASSWORD = "dpd2026";

  var defaultData = {
    version: "2026-08-26",
    settings: {
      handledCountryOptions: [
        { value: "china", label: "CHINA" },
        { value: "korea", label: "KOREA" },
        { value: "germany", label: "GERMANY" },
        { value: "japan", label: "JAPAN" }
      ]
    },
    collections: {
      mainHero: [
        {
          id: "hero-total-solution",
          enabled: true,
          eyebrow: "TOTAL SOLUTION",
          title: "공장 자동화의 모든 해답, 디피디에 있습니다",
          mediaType: "video",
          media: "assets/images/dpd/main-hero-01.mp4",
          alt: "공장 자동화 토탈 솔루션"
        },
        {
          id: "hero-global-partnership",
          enabled: true,
          eyebrow: "GLOBAL PARTNERSHIP",
          title: "글로벌 부품, 국내 기술력으로 연결하다",
          mediaType: "video",
          media: "assets/images/dpd/main-hero-02.mp4",
          alt: "글로벌 자동화 부품 파트너십"
        },
        {
          id: "hero-field-engineering",
          enabled: true,
          eyebrow: "FIELD ENGINEERING",
          title: "설치부터 유지보수까지 현장을 위한 솔루션",
          mediaType: "video",
          media: "assets/images/dpd/main-hero-03.mp4",
          alt: "현장 기술지원 엔지니어링"
        }
      ],
      developmentItems: [
        {
          id: "dev-usc",
          enabled: true,
          eyebrow: "DODAM ULTRA SONIC DRY CLEANER",
          title: "USC 초음파 건식 세정 시스템",
          image: "assets/images/dpd/202608/dodam-usc-device.jpg",
          alt: "USC 초음파 건식 세정 시스템",
          href: "kr/product/usc.html#content",
          external: false,
          visualImage: "assets/images/dpd/202608/dodam-usc-flow.jpg",
          detailEyebrow: "DODAM ULTRA SONIC DRY CLEANER",
          detailTitle: "USC 초음파 건식 세정 시스템",
          lead: "부유 파티클을 최대 99.5% 수준까지 제거하는 고효율 건식 세정 시스템",
          summary: "USC는 초음파를 이용한 고속 Air Blowing과 양면 Vacuum Suction을 조합하여 공정 중 발생하는 미세 분진을 흩날림 없이 흡입합니다. 고객사의 소재 폭과 장비 구성에 맞춰 세정 거리와 유틸리티 박스를 주문 대응할 수 있습니다.",
          gallery: [
            "assets/images/dpd/202608/dodam-usc-device.jpg",
            "assets/images/dpd/202608/dodam-usc-flow.jpg"
          ],
          overviewTitle: "Air Blowing + Vacuum Suction",
          overviewDescription: "2차전지 전극, 반도체, 디스플레이 등 분진 관리가 중요한 공정에서 비접촉 방식으로 표면 손상을 줄이고 택트타임을 단축합니다.",
          bullets: [
            "Dry SiO2 기준 40μm 부유 파티클 제거율 99.5% 이상",
            "세정 거리 5~2500mm 주문 대응",
            "최대 150m/s Blowing, 공정 속도 최대 2m/s 대응",
            "DIO, A/D 기본 제어와 Ethernet 옵션 대응"
          ],
          specEyebrow: "CLEANING PERFORMANCE",
          specTitle: "USC 주요 사양",
          specs: [
            { label: "적용 공정", value: "2차전지, 반도체, 디스플레이, Roll-to-Roll 및 Roller 세정" },
            { label: "제거 효율", value: "1.5~3μm 90% 이상, 10μm 97% 이상, 40μm 99.5% 이상" },
            { label: "Utility Box", value: "VCE-375, VCE-500 라인업 / 24Vdc ±10% / 70~75dB" },
            { label: "집진 장치", value: "CBA-1200AT3 / 0.3μm 이상 99% 포집 / 최대 600mm USC 지원" }
          ],
          featureEyebrow: "KEY POINTS",
          featureTitle: "적용 포인트",
          features: [
            { title: "고성능 세정", text: "초음파와 흡입 구조를 함께 적용해 분진 제거율과 공정 안정성을 높입니다." },
            { title: "주문 대응", text: "세정 길이와 설치 간격을 고객 장비 레이아웃에 맞춰 설계합니다." },
            { title: "라인업 확장", text: "Head, Utility Box, Dust Collector, VUV-Type 구성까지 공정별 조합이 가능합니다." }
          ]
        },
        {
          id: "dev-index-table",
          enabled: true,
          eyebrow: "TROCHOID INDEX UNIT",
          title: "INDEX TABLE SYSTEMS",
          image: "assets/images/dpd/202608/index-table-system.jpg",
          alt: "INDEX TABLE SYSTEMS",
          href: "kr/product/index-table.html#content",
          external: false,
          visualImage: "assets/images/dpd/202608/index-table-system.jpg",
          detailEyebrow: "TROCHOID INDEX UNIT",
          detailTitle: "INDEX TABLE SYSTEMS",
          lead: "고하중 정밀 이송을 위한 대구경·슬림형 인덱스 테이블 시스템",
          summary: "고객이 요구하는 외경과 내경, 탑재 하중, 정밀도 조건에 맞춰 설계할 수 있는 주문형 인덱스 테이블입니다. Trochoid 구동 구조를 기반으로 안정적인 반복 정밀도와 내구성을 확보합니다.",
          gallery: [
            "assets/images/dpd/202608/index-table-system.jpg",
            "assets/images/dpd/202608/trochoid-bearing-unit.jpg"
          ],
          overviewTitle: "DPD Original Trochoid Drive",
          overviewDescription: "고하중 회전 이송, 대형 워크 반송, 정밀 포지셔닝이 필요한 장비에서 고객 사양에 맞춘 회전 유닛을 구현합니다.",
          bullets: [
            "고객사 요구 외경·내경 대응 가능",
            "대구경·슬림형 구조 설계",
            "고하중·고정도 이송 공정 특화",
            "Trochoid Index Unit, Trochoid Bearing Unit 대응"
          ],
          specEyebrow: "SYSTEM CONFIGURATION",
          specTitle: "Index Table 구성",
          specs: [
            { label: "핵심 구조", value: "Trochoid Index Unit / Trochoid Bearing Unit" },
            { label: "대응 사양", value: "대구경, 슬림 타입, 고하중, 고정도 이송" },
            { label: "개발 방식", value: "고객 장비 조건 기반 주문 설계" },
            { label: "주요 실적", value: "반도체, 2차전지, CT, 디스플레이, 방산 레이더 장비 대응" }
          ],
          featureEyebrow: "KEY POINTS",
          featureTitle: "적용 포인트",
          features: [
            { title: "정밀 이송", text: "반복 정밀도와 하중 조건을 함께 검토해 회전 이송 품질을 안정화합니다." },
            { title: "장비 최적화", text: "워크 크기와 주변 구조에 맞춰 외경·내경·높이를 조정합니다." },
            { title: "국산화 대응", text: "해외 Index 대체 및 장비 맞춤형 설계 실적을 기반으로 대응합니다." }
          ]
        },
        {
          id: "dev-order-made-bearing",
          enabled: true,
          eyebrow: "SLEWING RING / SLIM SPLIT BEARING",
          title: "ORDER MADE BEARING SYSTEMS",
          image: "assets/images/dpd/202608/order-made-bearing-system.jpg",
          alt: "ORDER MADE BEARING SYSTEMS",
          href: "kr/product/order-made-bearing.html#content",
          external: false,
          visualImage: "assets/images/dpd/202608/order-made-bearing-system.jpg",
          detailEyebrow: "SLEWING RING / SLIM SPLIT BEARING",
          detailTitle: "ORDER MADE BEARING SYSTEMS",
          lead: "대형 회전 구조와 제한된 설치 공간을 위한 오더메이드 베어링 시스템",
          summary: "고객 장비의 외경·내경 조건과 하중, 설치 방식에 맞춰 설계하는 베어링 시스템입니다. CRB 대체 베어링 구동계 기술협약을 바탕으로 대구경 슬림 구조와 고정도 회전 응답을 제공합니다.",
          gallery: [
            "assets/images/dpd/202608/order-made-bearing-system.jpg",
            "assets/images/dpd/202608/slim-split-bearing.jpg",
            "assets/images/dpd/202608/trochoid-bearing-unit.jpg"
          ],
          overviewTitle: "Outer / Inner Diameter Order Made",
          overviewDescription: "장비 프레임과 구동 조건을 함께 검토해 Slewing Ring, Slim Split Bearing, Bearing Unit을 목적에 맞게 구성합니다.",
          bullets: [
            "고객사 요구 외경·내경 대응 가능",
            "대구경·슬림형 고하중 구조",
            "CRB 대체 베어링 구동계 대응",
            "AGV, CT, 방산 레이더 등 회전 장비 적용"
          ],
          specEyebrow: "BEARING SYSTEM",
          specTitle: "Order Made Bearing 구성",
          specs: [
            { label: "라인업", value: "Slewing Ring, Slim Split Bearing, Bearing Unit" },
            { label: "대응 조건", value: "고하중, 고정도, 대구경, 슬림 타입" },
            { label: "기술 기반", value: "Cross-Roller Bearing 대체 베어링 구동계 기술협약" },
            { label: "적용 실적", value: "AGV Bearing, 산업 CT Bearing, 방산 Radar Bearing" }
          ],
          featureEyebrow: "KEY POINTS",
          featureTitle: "적용 포인트",
          features: [
            { title: "설계 자유도", text: "장비 구조에 맞춰 베어링 치수와 체결 방식을 조정합니다." },
            { title: "하중 안정성", text: "회전 하중과 편심 조건을 함께 검토해 내구성을 높입니다." },
            { title: "유지보수성", text: "분할 구조와 주문 사양을 통해 설치와 유지보수 편의성을 고려합니다." }
          ]
        }
      ],
      handledItems: [
        {
          id: "handled-han-drive",
          enabled: true,
          title: "HAN DRIVE",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "구동·제어",
          description: "DD MOTOR",
          image: "assets/images/dpd/live-items/handled-han-drive.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/han-drive/01.png",
            "assets/images/dpd/live-items/gallery/han-drive/02.png",
            "assets/images/dpd/live-items/gallery/han-drive/03.png"
          ],
          href: "https://www.handrivemotor.com/",
          external: true
        },
        {
          id: "handled-veichi",
          enabled: true,
          title: "VEICHI",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "구동·제어",
          description: "SERVO MOTOR & DRIVER, INVERTER, HMI, IO MODULE",
          image: "assets/images/dpd/live-items/handled-veichi.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/veichi/01.png",
            "assets/images/dpd/live-items/gallery/veichi/02.png",
            "assets/images/dpd/live-items/gallery/veichi/03.png"
          ],
          href: "https://www.veichi.com/",
          external: true
        },
        {
          id: "handled-desboer",
          enabled: true,
          title: "DESBOER",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "감속·인덱스",
          description: "HIGH PRECISION REDUCER",
          image: "assets/images/dpd/live-items/handled-desboer.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/desboer/01.png",
            "assets/images/dpd/live-items/gallery/desboer/02.png",
            "assets/images/dpd/live-items/gallery/desboer/03.png"
          ],
          href: "https://desboergroup.com/",
          external: true
        },
        {
          id: "handled-win-roller",
          enabled: true,
          title: "WIN ROLLER",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "이송·컨베이어",
          description: "MOTOR ROLLER, POWER MOLLER",
          image: "assets/images/dpd/live-items/handled-win-roller.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/win-roller/01.png",
            "assets/images/dpd/live-items/gallery/win-roller/02.png",
            "assets/images/dpd/live-items/gallery/win-roller/03.png"
          ],
          href: "https://www.drum-roller.com/",
          external: true
        },
        {
          id: "handled-sango-automation",
          enabled: true,
          title: "SANGO AUTOMATION",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "감속·인덱스",
          description: "CAM INDEX DRIVE, HYPOID HOLLOW REDUCER",
          image: "assets/images/dpd/live-items/handled-sango-automation.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/sango-automation/01.png",
            "assets/images/dpd/live-items/gallery/sango-automation/02.png",
            "assets/images/dpd/live-items/gallery/sango-automation/03.png"
          ],
          href: "https://www.sango-automation.com/",
          external: true
        },
        {
          id: "handled-direc-seiko",
          enabled: true,
          title: "DIREC SEIKO",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "정밀 스테이지·베어링",
          description: "HIGH PRECISION & NANO STAGE, LINEAR & VOICE COIL MOTOR",
          image: "assets/images/dpd/live-items/handled-direc-seiko.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/direc-seiko/01.png",
            "assets/images/dpd/live-items/gallery/direc-seiko/02.png",
            "assets/images/dpd/live-items/gallery/direc-seiko/03.png"
          ],
          href: "https://www.direc-tech.com/",
          external: true
        },
        {
          id: "handled-wanming",
          enabled: true,
          title: "WANMING",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "정밀 스테이지·베어링",
          description: "MOTORIZED STAGE",
          image: "assets/images/dpd/202608/logo-wanming.png",
          gallery: [
            "assets/images/dpd/202608/product-wanming-01.jpeg",
            "assets/images/dpd/202608/product-wanming-02.jpeg",
            "assets/images/dpd/202608/product-wanming-03.jpeg"
          ],
          href: "https://www.rotationstage.com/",
          external: true
        },
        {
          id: "handled-kmf",
          enabled: true,
          title: "KMF",
          eyebrow: "MADE IN GERMANY",
          country: "germany",
          category: "정밀 스테이지·베어링",
          description: "WIRE RACE BALL BEARINGS, BUILT-IN ELEMENTS",
          image: "assets/images/dpd/202608/logo-kmf.png",
          gallery: [
            "assets/images/dpd/202608/product-kmf-01.jpeg",
            "assets/images/dpd/202608/product-kmf-02.jpeg",
            "assets/images/dpd/202608/product-kmf-03.jpeg"
          ],
          href: "https://kmf-bearings.de/en/drahtkugellager-einbauelemente/",
          external: true
        },
        {
          id: "handled-ticbel",
          enabled: true,
          title: "TICBEL",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "이송·컨베이어",
          description: "MAGLEV CONVEYOR LINES",
          image: "assets/images/dpd/202608/logo-ticbel.png",
          gallery: [
            "assets/images/dpd/202608/product-ticbel-01.jpeg",
            "assets/images/dpd/202608/product-ticbel-02.jpeg",
            "assets/images/dpd/202608/product-ticbel-03.jpeg"
          ],
          href: "https://www.ticbel.com/",
          external: true
        },
        {
          id: "handled-yamaha",
          enabled: true,
          title: "YAMAHA",
          eyebrow: "MADE IN JAPAN",
          country: "japan",
          category: "로봇",
          description: "SCARA ROBOT",
          image: "assets/images/dpd/202608/logo-yamaha.png",
          gallery: [
            "assets/images/dpd/202608/product-yamaha-01.png",
            "assets/images/dpd/202608/product-yamaha-02.png",
            "assets/images/dpd/202608/product-yamaha-03.png"
          ],
          href: "https://global.yamaha-motor.com/business/robot/",
          external: true
        },
        {
          id: "handled-dongwoo-robot",
          enabled: true,
          title: "DONGWOO ROBOT",
          eyebrow: "MADE IN KOREA",
          country: "korea",
          category: "로봇",
          description: "SINGLE AXIS ROBOT, BALL SCREW & BELT ROBOT",
          image: "assets/images/dpd/live-items/handled-dongwoo-robot.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/dongwoo-robot/01.jpg",
            "assets/images/dpd/live-items/gallery/dongwoo-robot/02.jpg",
            "assets/images/dpd/live-items/gallery/dongwoo-robot/03.jpg"
          ],
          href: "https://www.dwrobot.co.kr/",
          external: true
        },
        {
          id: "handled-j-one-corporation",
          enabled: true,
          title: "J-ONE CORPORATION",
          eyebrow: "MADE IN KOREA",
          country: "korea",
          category: "이송·컨베이어",
          description: "CAM RACK & ROLLER PINION, INDEX UNIT, BEARING UNIT",
          image: "assets/images/dpd/live-items/handled-j-one-corporation.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/j-one-corporation/01.png",
            "assets/images/dpd/live-items/gallery/j-one-corporation/02.png",
            "assets/images/dpd/live-items/gallery/j-one-corporation/03.png"
          ],
          href: "http://www.joneinc.com/",
          external: true
        },
        {
          id: "handled-actone",
          enabled: true,
          title: "ACTONE",
          eyebrow: "MADE IN KOREA",
          country: "korea",
          category: "감속·인덱스",
          description: "HOLLOW ROTARY REDUCER",
          image: "assets/images/dpd/live-items/handled-actone.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/actone/01.png",
            "assets/images/dpd/live-items/gallery/actone/02.png",
            "assets/images/dpd/live-items/gallery/actone/03.png"
          ],
          href: "http://www.act-one.co.kr/",
          external: true
        },
        {
          id: "handled-e-motion-tek",
          enabled: true,
          title: "E-MOTION TEK",
          eyebrow: "MADE IN KOREA",
          country: "korea",
          category: "구동·제어",
          description: "MOTION CONTROLLER, STEP MOTOR & DRIVER, IO MODULE",
          image: "assets/images/dpd/live-items/handled-e-motion-tek.jpg",
          gallery: [
            "assets/images/dpd/live-items/gallery/e-motion-tek/01.png",
            "assets/images/dpd/live-items/gallery/e-motion-tek/02.jpg",
            "assets/images/dpd/live-items/gallery/e-motion-tek/03.png"
          ],
          href: "http://emotiontek.co.kr/",
          external: true
        },
        {
          id: "handled-dobot",
          enabled: true,
          title: "DOBOT",
          eyebrow: "MADE IN CHINA",
          country: "china",
          category: "로봇",
          description: "COLLABORATIVE ROBOT, DESKTOP ROBOT",
          image: "assets/images/dpd/202608/logo-dobot.png",
          gallery: [
            "assets/images/dpd/202608/product-dobot-01.png",
            "assets/images/dpd/202608/product-dobot-02.png",
            "assets/images/dpd/202608/product-dobot-03.png"
          ],
          href: "https://www.dobot-robots.com/",
          external: true
        }
      ],
      customers: [
        { id: "customer-samsung-display", enabled: true, row: "top", name: "Samsung Display", image: "assets/images/partner/sansung-display.svg", alt: "Samsung Display" },
        { id: "customer-samsung-sdi", enabled: true, row: "top", name: "Samsung SDI", image: "assets/images/partner/samsung-sdi.svg", alt: "Samsung SDI" },
        { id: "customer-samsung-electro", enabled: true, row: "top", name: "Samsung Electro-Mechanics", image: "assets/images/partner/samsung-electro.svg", alt: "Samsung Electro-Mechanics" },
        { id: "customer-hynix", enabled: true, row: "top", name: "SK hynix", image: "assets/images/partner/hynix.svg", alt: "SK hynix" },
        { id: "customer-sk-on", enabled: true, row: "top", name: "SK on", image: "assets/images/partner/sk-on.svg", alt: "SK on" },
        { id: "customer-lg-display", enabled: true, row: "top", name: "LG Display", image: "assets/images/partner/lg-display.svg", alt: "LG Display" },
        { id: "customer-lg-energy", enabled: true, row: "top", name: "LG Energy Solution", image: "assets/images/partner/lg-energy.svg", alt: "LG Energy Solution" },
        { id: "customer-lx", enabled: true, row: "top", name: "LX Hausys", image: "assets/images/partner/lx.svg", alt: "LX Hausys" },
        { id: "customer-hyundai", enabled: true, row: "top", name: "Hyundai", image: "assets/images/partner/hyundai.svg", alt: "Hyundai" },
        { id: "customer-semes", enabled: true, row: "top", name: "SEMES", image: "assets/images/partner/semes.svg", alt: "SEMES" },
        { id: "customer-sfa", enabled: true, row: "top", name: "SFA", image: "assets/images/partner/sfa.svg", alt: "SFA" },
        { id: "customer-kohyoung", enabled: true, row: "top", name: "Koh Young Technology", image: "assets/images/partner/kohyoung.png", alt: "Koh Young Technology" },
        { id: "customer-cfi", enabled: true, row: "top", name: "CFI", image: "assets/images/partner/cfi.svg", alt: "CFI" },
        { id: "customer-viewworks", enabled: true, row: "top", name: "Vieworks", image: "assets/images/partner/viewworks.png", alt: "Vieworks" },
        { id: "customer-unitest", enabled: true, row: "bottom", name: "UniTest", image: "assets/images/partner/unitest.png", alt: "UniTest" },
        { id: "customer-protec", enabled: true, row: "bottom", name: "PROTEC", image: "assets/images/partner/protec.jpg", alt: "PROTEC" },
        { id: "customer-innobiz", enabled: true, row: "bottom", name: "Innobiz", image: "assets/images/partner/innobiz.jpg", alt: "Innobiz" },
        { id: "customer-jastech", enabled: true, row: "bottom", name: "JASTECH", image: "assets/images/partner/jastech.png", alt: "JASTECH" },
        { id: "customer-jas-ats", enabled: true, row: "bottom", name: "JAS ATS", image: "assets/images/partner/jas-ats.png", alt: "JAS ATS" },
        { id: "customer-jtcorp", enabled: true, row: "bottom", name: "JT Corp", image: "assets/images/partner/jtcorp.png", alt: "JT Corp" },
        { id: "customer-cowintech", enabled: true, row: "bottom", name: "Cowin Tech", image: "assets/images/partner/cowintech.png", alt: "Cowin Tech" },
        { id: "customer-bs-tech", enabled: true, row: "bottom", name: "BS Technics", image: "assets/images/partner/bs-tech.png", alt: "BS Technics" },
        { id: "customer-madetech", enabled: true, row: "bottom", name: "MadeTech", image: "assets/images/partner/madetech.png", alt: "MadeTech" },
        { id: "customer-synapse", enabled: true, row: "bottom", name: "Synapse Imaging", image: "assets/images/partner/synapse.png", alt: "Synapse Imaging" },
        { id: "customer-shonics", enabled: true, row: "bottom", name: "Shonics", image: "assets/images/partner/shonics.svg", alt: "Shonics" },
        { id: "customer-ani", enabled: true, row: "bottom", name: "A&I", image: "assets/images/partner/ani.png", alt: "A&I" }
      ],
      resources: [
        {
          id: "resource-handrive-drawing",
          enabled: true,
          category: "drawing",
          type: "ZIP",
          title: "HANDRIVE 도면 자료",
          summary: "HANDRIVE DD MOTOR 적용 검토를 위한 도면 자료입니다.",
          fileUrl: "assets/downloads/plan/handrive-2dcad.zip",
          fileName: "2DCAD.zip"
        },
        {
          id: "resource-dongwoo-catalog",
          enabled: true,
          category: "catalog",
          type: "PDF",
          title: "DONGWOO ROBOT 자료",
          summary: "DONGWOO ROBOT 단축 로봇 검토를 위한 로컬 자료입니다.",
          fileUrl: "assets/downloads/catalog/dongwoo-robot-catalog.pdf",
          fileName: "동우로봇_종합카달로그-V1.pdf"
        },
        {
          id: "resource-actone-catalog",
          enabled: true,
          category: "catalog",
          type: "PDF",
          title: "ACTONE HOLLOW ROTARY REDUCER 자료",
          summary: "ACTONE HOLLOW ROTARY REDUCER 적용 검토를 위한 로컬 자료입니다.",
          fileUrl: "assets/downloads/catalog/actone-hollow-rotary-reducer.pdf",
          fileName: "엑트원-중공감속기.pdf"
        }
      ],
      notices: [
        {
          id: "notice-summer-2026",
          enabled: true,
          date: "2026.07.01",
          title: "주식회사 디피디 2026년 하계휴가 일정 공지 드립니다.",
          summary: "하계휴가 기간 중 상담 및 출고 일정이 일부 조정될 수 있습니다. 긴급 문의는 대표 이메일로 남겨 주시면 순차적으로 확인하겠습니다.",
          href: "kr/pr/news__bgu_view_idx_1.html#content",
          content: "<p>하계휴가 기간 중 상담 및 출고 일정이 일부 조정될 수 있습니다. 긴급 문의는 대표 이메일로 남겨 주시면 순차적으로 확인하겠습니다.</p>"
        },
        {
          id: "notice-smart-factory-2026",
          enabled: true,
          date: "2026.01.15",
          title: "스마트 팩토리의 완성, 주식회사 디피디가 2026년 제조 혁신의 든든한 기반이 되겠습니다.",
          summary: "디피디는 제품 선정과 기술 검토, 공급, 사후대응까지 현장 중심의 자동화 솔루션을 안정적으로 제공하겠습니다.",
          href: "kr/pr/news__bgu_view_idx_2.html#content",
          content: "<p>디피디는 제품 선정과 기술 검토, 공급, 사후대응까지 현장 중심의 자동화 솔루션을 안정적으로 제공하겠습니다.</p>"
        },
        {
          id: "notice-thanks-2025",
          enabled: true,
          date: "2025.12.31",
          title: "함께였기에 가능했던 2025년, 진심으로 감사드립니다.",
          summary: "한 해 동안 보내주신 신뢰에 감사드립니다. 2026년에도 정확한 제품과 책임 있는 기술지원으로 보답하겠습니다.",
          href: "kr/pr/news__bgu_view_idx_3.html#content",
          content: "<p>한 해 동안 보내주신 신뢰에 감사드립니다. 2026년에도 정확한 제품과 책임 있는 기술지원으로 보답하겠습니다.</p>"
        },
        {
          id: "notice-summer-2025",
          enabled: true,
          date: "2025.08.20",
          title: "주식회사 디피디 2025년 하계휴가 일정 공지 드립니다.",
          summary: "휴가 기간 중 문의 회신과 납품 일정에 변동이 있을 수 있으니 일정 협의가 필요한 경우 사전에 연락 부탁드립니다.",
          href: "kr/pr/news__bgu_view_idx_4.html#content",
          content: "<p>휴가 기간 중 문의 회신과 납품 일정에 변동이 있을 수 있으니 일정 협의가 필요한 경우 사전에 연락 부탁드립니다.</p>"
        },
        {
          id: "notice-renewal-open",
          enabled: true,
          date: "2025.07.11",
          title: "주식회사 디피디 홈페이지 리뉴얼 오픈 안내 드립니다.",
          summary: "디피디의 개발품목, 취급품목, 자료실, 문의 정보를 더 쉽게 확인하실 수 있도록 홈페이지를 정비했습니다.",
          href: "kr/pr/news__bgu_view_idx_5.html#content",
          content: "<p>디피디의 개발품목, 취급품목, 자료실, 문의 정보를 더 쉽게 확인하실 수 있도록 홈페이지를 정비했습니다.</p>"
        }
      ],
      companyProfile: [
        {
          "id": "profile-회사명",
          "enabled": true,
          "label": "회사명",
          "value": "주식회사 디피디 (DPD Co.,Ltd.)",
          "note": ""
        },
        {
          "id": "profile-법인-전환일",
          "enabled": true,
          "label": "법인 전환일",
          "value": "2024년 10월 02일",
          "note": "(개인사업자 2022년 05월 설립)"
        },
        {
          "id": "profile-대표이사",
          "enabled": true,
          "label": "대표이사",
          "value": "박준일",
          "note": ""
        },
        {
          "id": "profile-사업분야",
          "enabled": true,
          "label": "사업분야",
          "value": "자동화 부품 개발 및 도소매 유통",
          "note": ""
        },
        {
          "id": "profile-본사",
          "enabled": true,
          "label": "본사",
          "value": "경기도 시흥시 마유로 376, 417호 (정왕동, 시흥창업센터)",
          "note": ""
        },
        {
          "id": "profile-공장",
          "enabled": true,
          "label": "공장",
          "value": "경기도 안산시 상록구 버대길 172 (양상동)",
          "note": ""
        },
        {
          "id": "profile-주요-품목",
          "enabled": true,
          "label": "주요 품목",
          "value": "Cam Rack & Roller Pinion, DD Motor, Linear Motor, Reducer, Robot Etc...",
          "note": ""
        },
        {
          "id": "profile-홈페이지",
          "enabled": true,
          "label": "홈페이지",
          "value": "https://dpdxfa.com/",
          "note": ""
        }
      ],
      companyHistory: [
        {
          "id": "history-2026-03",
          "enabled": true,
          "year": "2026",
          "month": "03",
          "text": "중소벤처기업진흥공단 글로벌창업사관학교 7기 입교 (서울본교)"
        },
        {
          "id": "history-2026-01",
          "enabled": true,
          "year": "2026",
          "month": "01",
          "text": "사업장 이전"
        },
        {
          "id": "history-2025-12",
          "enabled": true,
          "year": "2025",
          "month": "12",
          "text": "벤처기업확인 인증"
        },
        {
          "id": "history-2025-02",
          "enabled": true,
          "year": "2025",
          "month": "02",
          "text": "청년창업사관학교 14기 졸업 (안산본교)"
        },
        {
          "id": "history-2025-01",
          "enabled": true,
          "year": "2025",
          "month": "01",
          "text": "사업장 이전 (경기도 시흥시 소재)"
        },
        {
          "id": "history-2024-11",
          "enabled": true,
          "year": "2024",
          "month": "11",
          "text": "특허등록 제10-2736155호"
        },
        {
          "id": "history-2024-11",
          "enabled": true,
          "year": "2024",
          "month": "11",
          "text": "통신판매업 등록"
        },
        {
          "id": "history-2024-09",
          "enabled": true,
          "year": "2024",
          "month": "09",
          "text": "법인사업자 전환 (주식회사 디피디)"
        },
        {
          "id": "history-2024-03",
          "enabled": true,
          "year": "2024",
          "month": "03",
          "text": "중소벤처기업진흥공단 청년창업사관학교 14기 입교 (안산본교)"
        },
        {
          "id": "history-2023-03",
          "enabled": true,
          "year": "2023",
          "month": "03",
          "text": "크로스롤러베어링 대체 베어링 구동계 제작 기술 협약 (“J”社)"
        },
        {
          "id": "history-2023-03",
          "enabled": true,
          "year": "2023",
          "month": "03",
          "text": "리니어피커 제작 관련 기술 협약 (“M”社)"
        },
        {
          "id": "history-2022-10",
          "enabled": true,
          "year": "2022",
          "month": "10",
          "text": "3D비전 · 협동로봇 활용 AMR 제작 기술 협약 (“T”社)"
        },
        {
          "id": "history-2022-06",
          "enabled": true,
          "year": "2022",
          "month": "06",
          "text": "리니어 모터 활용 구동계 제작 기술 협약 (“D”社)"
        },
        {
          "id": "history-2022-06",
          "enabled": true,
          "year": "2022",
          "month": "06",
          "text": "특허출원 직선 및 회전 구동계 분진 제거 장치"
        },
        {
          "id": "history-2022-05",
          "enabled": true,
          "year": "2022",
          "month": "05",
          "text": "개인사업자 설립 (디피디)"
        }
      ],
      certificates: [
        {
          "id": "certificate-벤처기업확인서",
          "enabled": true,
          "title": "벤처기업확인서",
          "image": "assets/images/dpd/certificates/venture-certificate.jpg",
          "alt": "벤처기업확인서"
        },
        {
          "id": "certificate-통신판매업-신고증",
          "enabled": true,
          "title": "통신판매업 신고증",
          "image": "assets/images/dpd/certificates/mail-order-registration.jpg",
          "alt": "통신판매업 신고증"
        },
        {
          "id": "certificate-청창사-졸업장",
          "enabled": true,
          "title": "청창사 졸업장",
          "image": "assets/images/dpd/certificates/youth-startup-academy-diploma.jpg",
          "alt": "청창사 졸업장"
        },
        {
          "id": "certificate-특허증",
          "enabled": true,
          "title": "특허증",
          "image": "assets/images/dpd/certificates/patent-certificate.jpg",
          "alt": "특허증"
        }
      ],
      supportSteps: [
        {
          "id": "support-step-01",
          "enabled": true,
          "step": "STEP 01",
          "title": "기술·견적 문의 접수",
          "description": "온라인, 전화, 이메일을 통해 사용 조건과 요구 사양을 접수합니다.",
          "image": "assets/images/support/support-step-01-control-panel.jpg",
          "alt": "기술 문의를 검토하는 자동화 제어 패널 이미지"
        },
        {
          "id": "support-step-02",
          "enabled": true,
          "step": "STEP 02",
          "title": "제품 선정 상담",
          "description": "용도, 하중, 정밀도, 납기 조건을 검토해 최적 품목을 제안합니다.",
          "image": "assets/images/support/support-step-02-clean-room.jpg",
          "alt": "제품 선정 상담을 위한 클린룸 제조 현장 이미지"
        },
        {
          "id": "support-step-03",
          "enabled": true,
          "step": "STEP 03",
          "title": "도면·기술자료 제공",
          "description": "도면, 카탈로그, 기술자료를 제공하고 적용 사양을 함께 검토합니다.",
          "image": "assets/images/support/support-step-03-machine-panel.jpg",
          "alt": "도면과 기술자료 검토용 산업 장비 제어 패널 이미지"
        },
        {
          "id": "support-step-04",
          "enabled": true,
          "step": "STEP 04",
          "title": "공급·납품",
          "description": "경쟁력 있는 가격과 안정적인 납기로 제품을 공급합니다.",
          "image": "assets/images/support/support-step-04-conveyor.jpg",
          "alt": "공급과 납품을 위한 산업용 컨베이어 현장 이미지"
        },
        {
          "id": "support-step-05",
          "enabled": true,
          "step": "STEP 05",
          "title": "설치·운영 지원",
          "description": "현장 설치와 초기 운전 과정에서 필요한 기술 지원을 제공합니다.",
          "image": "assets/images/support/support-step-05-robot-arm.jpg",
          "alt": "설치 운영 지원을 위한 로봇 자동화 설비 이미지"
        },
        {
          "id": "support-step-06",
          "enabled": true,
          "step": "STEP 06",
          "title": "유지보수·사후 대응",
          "description": "납품 이후에도 운전 안정성과 유지보수를 위한 대응을 이어갑니다.",
          "image": "assets/images/support/support-step-06-cnc-machine.jpg",
          "alt": "유지보수 사후 대응을 위한 CNC 가공 설비 이미지"
        }
      ],
      networkPartner: [
        {
          "id": "partner-사업자등록번호",
          "enabled": true,
          "label": "사업자등록번호",
          "value": "0202332953"
        },
        {
          "id": "partner-설립일",
          "enabled": true,
          "label": "설립일",
          "value": "2026년 01월 21일"
        },
        {
          "id": "partner-주소",
          "enabled": true,
          "label": "주소",
          "value": "Tòa nhà Thành Đạt, Số 3 Lê Thánh Tông, Ngô Quyền, Hải Phòng, Việt Nam"
        }
      ],
      networkCoverage: [
        {
          "id": "coverage-01",
          "enabled": true,
          "no": "01",
          "region": "Hưng Yên",
          "description": "제조 현장 사양 검토와 초기 납품 대응을 연결합니다."
        },
        {
          "id": "coverage-02",
          "enabled": true,
          "no": "02",
          "region": "Bắc Ninh",
          "description": "전자·자동화 산업 고객사의 제품 선정과 기술 상담을 지원합니다."
        },
        {
          "id": "coverage-03",
          "enabled": true,
          "no": "03",
          "region": "Hải Phòng",
          "description": "항만 물류와 북부 산업단지 납품·유지보수 거점으로 대응합니다."
        }
      ],
      networkResponse: [
        {
          "id": "response-01",
          "enabled": true,
          "no": "01",
          "title": "현지 제품 공급",
          "description": "디피디 취급 품목의 베트남 내 견적 · 납품 대응"
        },
        {
          "id": "response-02",
          "enabled": true,
          "no": "02",
          "title": "기술 상담 · 사양 검토",
          "description": "현장 조건에 맞는 품목 선정과 도면 · 기술자료 지원"
        },
        {
          "id": "response-03",
          "enabled": true,
          "no": "03",
          "title": "설치 · 시운전 지원",
          "description": "현지 방문을 통한 설치 및 초기 가동 지원"
        },
        {
          "id": "response-04",
          "enabled": true,
          "no": "04",
          "title": "사후 대응 · 유지보수",
          "description": "납품 이후 현지 A/S 및 유지보수 대응"
        }
      ],
      contactForms: [
      ]
    }
  };

  var clone = function (value) {
    return JSON.parse(JSON.stringify(value));
  };

  var now = function () {
    return new Date().toISOString();
  };

  var normalizeDatabase = function (database) {
    var next = clone(defaultData);
    if (!database || !database.collections) return next;

    Object.keys(next.collections).forEach(function (key) {
      if (Array.isArray(database.collections[key])) {
        var defaults = next.collections[key] || [];
        next.collections[key] = database.collections[key].map(function (item, index) {
          var seed = defaults.find(function (defaultItem) {
            return defaultItem.id && item && defaultItem.id === item.id;
          }) || defaults[index] || {};
          return Object.assign({}, clone(seed), item);
        });
      }
    });

    next.version = database.version || next.version;
    next.settings = Object.assign({}, clone(defaultData.settings || {}), database.settings || {});
    next.updatedAt = database.updatedAt || "";
    return next;
  };

  /* ────────────────────────────────────────────────────────────────
   * 저장 어댑터
   *
   * 저장 위치에 관한 지식은 전부 이 아래에만 둔다. 화면 코드(cms-admin.js,
   * cms-renderer.js)는 DpdCmsStore 의 메서드만 쓰므로, 백엔드가 붙으면
   * 같은 모양의 어댑터를 만들어 DpdCmsStore.useAdapter() 로 갈아끼우면 된다.
   *
   * 어댑터가 갖춰야 할 것
   *   name           : 로그에 찍히는 식별자
   *   hydrate()      : 첫 사용 전에 데이터를 준비한다. Promise 를 돌려준다.
   *   read()         : 저장된 데이터베이스 객체 또는 null 을 즉시 돌려준다.
   *   write(db)      : 데이터베이스를 저장한다.
   *   clear()        : 저장분을 지운다.
   *   readSession()  : 로그인 세션 객체 또는 null.
   *   writeSession(s): 로그인 세션을 저장한다.
   *   clearSession() : 로그인 세션을 지운다.
   *   authenticate(id, password) : 자격 증명 확인 결과(boolean).
   *   subscribe(fn)  : 다른 탭/사용자의 변경을 알린다. 해지 함수를 돌려준다.
   *
   * read() 와 write() 는 동기 호출이다. API 어댑터는 hydrate() 에서 서버
   * 응답을 받아 메모리에 들고 있다가 read() 로 돌려주고, write() 는 메모리를
   * 갱신한 뒤 전송을 시작하는 방식으로 맞추면 된다.
   * ──────────────────────────────────────────────────────────────── */

  var localStorageAdapter = {
    name: "localStorage",
    hydrate: function () {
      return Promise.resolve();
    },
    read: function () {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    },
    write: function (database) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(database));
      window.localStorage.setItem(TOUCH_KEY, String(Date.now()));
    },
    clear: function () {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.setItem(TOUCH_KEY, String(Date.now()));
    },
    readSession: function () {
      var raw = window.localStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    },
    writeSession: function (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    },
    clearSession: function () {
      window.localStorage.removeItem(SESSION_KEY);
    },
    authenticate: function (id, password) {
      return id === ADMIN_ID && password === ADMIN_PASSWORD;
    },
    subscribe: function (handler) {
      var listener = function (event) {
        if (event.key === TOUCH_KEY) handler();
      };
      window.addEventListener("storage", listener);
      return function () {
        window.removeEventListener("storage", listener);
      };
    }
  };

  var adapter = localStorageAdapter;

  var readStoredData = function () {
    try {
      return normalizeDatabase(adapter.read());
    } catch (error) {
      console.warn("CMS database read failed (" + adapter.name + "):", error);
      return clone(defaultData);
    }
  };

  var writeStoredData = function (database) {
    var next = normalizeDatabase(database);
    next.updatedAt = now();
    adapter.write(next);
    return clone(next);
  };

  var slugify = function (value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item";
  };

  var createId = function (collectionKey, label) {
    return collectionKey + "-" + slugify(label) + "-" + Date.now().toString(36);
  };

  var isLoggedIn = function () {
    try {
      var session = adapter.readSession();
      return Boolean(session && session.loggedIn && session.expiresAt > Date.now());
    } catch (error) {
      return false;
    }
  };

  var login = function (id, password) {
    if (!adapter.authenticate(id, password)) return false;
    adapter.writeSession({
      loggedIn: true,
      loggedAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 12
    });
    return true;
  };

  var logout = function () {
    adapter.clearSession();
  };

  window.DPD_CMS_DEFAULT_DATA = clone(defaultData);
  window.DpdCmsStore = {
    storageKey: STORAGE_KEY,
    touchKey: TOUCH_KEY,
    sessionKey: SESSION_KEY,
    credentials: {
      id: ADMIN_ID,
      password: ADMIN_PASSWORD
    },
    clone: clone,
    getData: readStoredData,
    saveData: writeStoredData,
    resetData: function () {
      adapter.clear();
      return clone(defaultData);
    },
    getCollection: function (collectionKey) {
      var database = readStoredData();
      return clone(database.collections[collectionKey] || []);
    },
    setCollection: function (collectionKey, items) {
      var database = readStoredData();
      database.collections[collectionKey] = Array.isArray(items) ? items : [];
      return writeStoredData(database);
    },
    createId: createId,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn,
    // 현재 어댑터 이름. 화면에서 저장 위치를 표시할 때 쓴다.
    get adapterName() {
      return adapter.name;
    },
    // 백엔드 어댑터로 교체한다. 교체 후 ready() 를 다시 기다려야 한다.
    useAdapter: function (next) {
      if (next) adapter = next;
      return adapter;
    },
    // 첫 읽기 전에 기다린다. localStorage 어댑터에서는 즉시 끝난다.
    ready: function () {
      try {
        return Promise.resolve(adapter.hydrate());
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 다른 탭이나 다른 관리자가 저장했을 때 알림을 받는다. 해지 함수를 돌려준다.
    subscribe: function (handler) {
      if (typeof handler !== "function" || typeof adapter.subscribe !== "function") {
        return function () {};
      }
      return adapter.subscribe(handler);
    }
  };
})(window);
