import { Article, Category, Tag, AdPlacement, EditorialSettings, AuditLog } from '@/types';

export { newsroomAuthors as initialAuthors } from './author-profiles';

export const initialCategories: Category[] = [
  {
    id: 'cat-ap',
    slug: 'andhra-pradesh',
    nameEn: 'Andhra Pradesh',
    nameTe: 'ఆంధ్రప్రదేశ్',
    descriptionEn: 'Comprehensive news, politics, and development reports from across Andhra Pradesh.',
    descriptionTe: 'ఆంధ్రప్రదేశ్ సమగ్ర వార్తలు, అమరావతి అభివృద్ధి, పోలవరం, విశాఖ పరిణామాలు మరియు ప్రజా సమస్యలు.',
    displayOrder: 1,
    featured: true,
  },
  {
    id: 'cat-tg',
    slug: 'telangana',
    nameEn: 'Telangana',
    nameTe: 'తెలంగాణ',
    descriptionEn: 'Latest political, economic, and administrative updates from Hyderabad and Telangana districts.',
    descriptionTe: 'హైదరాబాద్ ఐటీ నగరం, తెలంగాణ రాజకీయాలు, సంక్షేమ పథకాలు మరియు జిల్లాల ముఖ్యాంశాలు.',
    displayOrder: 2,
    featured: true,
  },
  {
    id: 'cat-vizag',
    slug: 'visakhapatnam',
    nameEn: 'Visakhapatnam',
    nameTe: 'విశాఖపట్నం',
    descriptionEn: 'Steel City, IT hub, port trade, and smart city infrastructure news.',
    descriptionTe: 'విశాఖ నగర వార్తలు, పోర్ట్ వాణిజ్యం, ఐటీ జోన్, పర్యాటకం మరియు పారిశ్రామికాభివృద్ధి.',
    parentId: 'cat-ap',
    displayOrder: 3,
  },
  {
    id: 'cat-amaravati',
    slug: 'amaravati',
    nameEn: 'Amaravati',
    nameTe: 'అమరావతి',
    descriptionEn: 'Capital city construction, infrastructure works, and administrative updates.',
    descriptionTe: 'రాజధాని అమరావతి నిర్మాణం, మౌలిక వసతులు మరియు సచివాలయ సమీక్షలు.',
    parentId: 'cat-ap',
    displayOrder: 4,
  },
  {
    id: 'cat-india',
    slug: 'india',
    nameEn: 'India',
    nameTe: 'జాతీయం',
    descriptionEn: 'National politics, Parliament updates, Union budget, and defense news.',
    descriptionTe: 'జాతీయ రాజకీయాలు, పార్లమెంట్ సమావేశాలు, కేంద్ర బడ్జెట్ మరియు దేశ సమగ్ర పరిణామాలు.',
    displayOrder: 5,
    featured: true,
  },
  {
    id: 'cat-world',
    slug: 'world',
    nameEn: 'World',
    nameTe: 'అంతర్జాతీయం',
    descriptionEn: 'Global affairs, geopolitics, diaspora news, and international relations.',
    descriptionTe: 'ప్రపంచ వ్యవహారాలు, అంతర్జాతీయ దౌత్యం, ఎన్నారై (NRI) విశేషాలు మరియు ప్రపంచ పరిణామాలు.',
    displayOrder: 6,
  },
  {
    id: 'cat-politics',
    slug: 'politics',
    nameEn: 'Politics',
    nameTe: 'రాజకీయాలు',
    descriptionEn: 'In-depth political analysis, election coverage, and policy debates.',
    descriptionTe: 'సమగ్ర రాజకీయ విశ్లేషణలు, ఎన్నికల పరిశీలనలు మరియు విధాన సమీక్షలు.',
    displayOrder: 7,
    featured: true,
  },
  {
    id: 'cat-business',
    slug: 'business',
    nameEn: 'Business & Economy',
    nameTe: 'వాణిజ్యం & ఆర్థికం',
    descriptionEn: 'Markets, corporate investments in Telugu states, startups, and macroeconomics.',
    descriptionTe: 'స్టాక్ మార్కెట్లు, తెలుగు రాష్ట్రాల్లో పెట్టుబడులు, స్టార్టప్‌లు మరియు ఆర్థిక విశ్లేషణలు.',
    displayOrder: 8,
    featured: true,
  },
  {
    id: 'cat-tech',
    slug: 'technology',
    nameEn: 'Technology & AI',
    nameTe: 'టెక్నాలజీ & ఏఐ',
    descriptionEn: 'Artificial intelligence, space science, gadget reviews, and Indian tech innovations.',
    descriptionTe: 'కృత్రిమ మేధ (AI), ఇస్రో ప్రయోగాలు, సైబర్ భద్రత మరియు సరికొత్త సాంకేతిక ఆవిష్కరణలు.',
    displayOrder: 9,
    featured: true,
  },
  {
    id: 'cat-agri',
    slug: 'agriculture',
    nameEn: 'Agriculture & Rythu',
    nameTe: 'వ్యవసాయం & రైతు',
    descriptionEn: 'Farmer welfare, crop prices, monsoon updates, irrigation, and natural farming.',
    descriptionTe: 'రైతు సంక్షేమం, పంట గిట్టుబాటు ధరలు, రుతుపవనాలు, సాగునీటి ప్రాజెక్టులు మరియు సేంద్రీయ వ్యవసాయం.',
    displayOrder: 10,
    featured: true,
  },
  {
    id: 'cat-sports',
    slug: 'sports',
    nameEn: 'Sports',
    nameTe: 'క్రీడలు',
    descriptionEn: 'Cricket, IPL, badminton, regional sports talents, and international championships.',
    descriptionTe: 'క్రికెట్, ఐపీఎల్, బ్యాడ్మింటన్, తెలుగు క్రీడాకారుల ప్రతిభ మరియు ఒలింపిక్ వార్తలు.',
    displayOrder: 11,
  },
  {
    id: 'cat-entertainment',
    slug: 'entertainment',
    nameEn: 'Entertainment & Tollywood',
    nameTe: 'వినోదం & టాలీవుడ్',
    descriptionEn: 'Telugu cinema reviews, box office reports, OTT releases, and cultural features.',
    descriptionTe: 'టాలీవుడ్ సినిమా సమీక్షలు, బాక్సాఫీస్ కలెక్షన్లు, ఓటీటీ విశేషాలు మరియు తెలుగు సంస్కృతి.',
    displayOrder: 12,
  },
  {
    id: 'cat-factcheck',
    slug: 'fact-checks',
    nameEn: 'Fact Checks',
    nameTe: 'ఫ్యాక్ట్ చెక్',
    descriptionEn: 'Independent, evidence-backed fact checking on viral claims and political statements.',
    descriptionTe: 'వైరల్ ప్రచారాలు, రాజకీయ ప్రకటనలపై నిష్పక్షపాత ఆధారాలతో కూడిన నిజనిర్ధారణ.',
    displayOrder: 13,
    featured: true,
  },
  {
    id: 'cat-special',
    slug: 'special-reports',
    nameEn: 'Special Reports',
    nameTe: 'ప్రత్యేక కథనాలు',
    descriptionEn: 'In-depth longform journalism, field reports, and investigative stories.',
    descriptionTe: 'క్షేత్రస్థాయి పరిశోధనాత్మక కథనాలు, లోతైన విశ్లేషణలు మరియు ప్రత్యేక ఫీచర్లు.',
    displayOrder: 14,
  },
  {
    id: 'cat-editorial',
    slug: 'editorial-opinion',
    nameEn: 'Editorial & Opinion',
    nameTe: 'సంపాదకీయం & అభిప్రాయం',
    descriptionEn: 'Perspectives and viewpoints from senior editors, intellectuals, and columnists.',
    descriptionTe: 'ప్రముఖుల వ్యాసాలు, సంపాదకీయాలు మరియు ప్రజాభిప్రాయ వేదిక.',
    displayOrder: 15,
  },
  {
    id: 'cat-videos',
    slug: 'videos',
    nameEn: 'Video News',
    nameTe: 'వీడియో న్యూస్',
    descriptionEn: 'Video bulletins, ground interviews, and live event broadcasts.',
    descriptionTe: 'ప్రత్యక్ష ప్రసారాలు, క్షేత్రస్థాయి ఇంటర్వ్యూలు మరియు వీడియో బులెటిన్లు.',
    displayOrder: 16,
  },
  {
    id: 'cat-photos',
    slug: 'photos',
    nameEn: 'Photo Stories',
    nameTe: 'ఫోటో కథనాలు',
    descriptionEn: 'Curated visual journalism and photo essays from across the region.',
    descriptionTe: 'దృశ్యరూప జర్నలిజం, ఫోటో గ్యాలరీలు మరియు చిత్రాల ద్వారా కథనాలు.',
    displayOrder: 17,
  },
  {
    id: 'cat-live',
    slug: 'live',
    nameEn: 'Live Updates',
    nameTe: 'లైవ్ అప్‌డేట్స్',
    descriptionEn: 'Minute-by-minute live reporting on major events and developing stories.',
    descriptionTe: 'ప్రధాన పరిణామాలపై ఎప్పటికప్పుడు క్షణ క్షణం ప్రత్యక్ష వార్తా ప్రసారం.',
    displayOrder: 18,
  }
];

export const initialTags: Tag[] = [
  {
    id: 'tag-1',
    slug: 'andhra-pradesh',
    nameEn: 'Andhra Pradesh',
    nameTe: 'ఆంధ్రప్రదేశ్',
    aliases: ['ap', 'andhra'],
    articleCount: 12,
  },
  {
    id: 'tag-2',
    slug: 'amaravati',
    nameEn: 'Amaravati',
    nameTe: 'అమరావతి',
    aliases: ['ap-capital', 'rajadhani'],
    articleCount: 8,
  },
  {
    id: 'tag-3',
    slug: 'visakhapatnam',
    nameEn: 'Visakhapatnam',
    nameTe: 'విశాఖపట్నం',
    aliases: ['vizag', 'vishakhapatnam', 'waltair'],
    articleCount: 7,
  },
  {
    id: 'tag-4',
    slug: 'telangana',
    nameEn: 'Telangana',
    nameTe: 'తెలంగాణ',
    aliases: ['tg', 'telangana-state'],
    articleCount: 9,
  },
  {
    id: 'tag-5',
    slug: 'hyderabad',
    nameEn: 'Hyderabad',
    nameTe: 'హైదరాబాద్',
    aliases: ['cyberabad', 'bhagyanagar'],
    articleCount: 10,
  },
  {
    id: 'tag-6',
    slug: 'polavaram',
    nameEn: 'Polavaram Project',
    nameTe: 'పోలవరం ప్రాజెక్ట్',
    aliases: ['polavaram-dam', 'godavari-irrigation'],
    articleCount: 4,
  },
  {
    id: 'tag-7',
    slug: 'agriculture',
    nameEn: 'Agriculture',
    nameTe: 'వ్యవసాయం',
    aliases: ['farming', 'rythu', 'kisan', 'crops'],
    articleCount: 6,
  },
  {
    id: 'tag-8',
    slug: 'technology',
    nameEn: 'Technology & AI',
    nameTe: 'టెక్నాలజీ & ఏఐ',
    aliases: ['tech', 'artificial-intelligence', 'software', 'it-sector'],
    articleCount: 7,
  },
  {
    id: 'tag-9',
    slug: 'indian-economy',
    nameEn: 'Indian Economy',
    nameTe: 'భారత ఆర్థిక వ్యవస్థ',
    aliases: ['economy', 'rbi', 'budget', 'gdp'],
    articleCount: 5,
  },
  {
    id: 'tag-10',
    slug: 'cricket',
    nameEn: 'Cricket',
    nameTe: 'క్రికెట్',
    aliases: ['bcci', 'ipl', 'team-india'],
    articleCount: 4,
  },
  {
    id: 'tag-11',
    slug: 'tollywood',
    nameEn: 'Tollywood',
    nameTe: 'టాలీవుడ్',
    aliases: ['telugu-cinema', 'film-industry'],
    articleCount: 5,
  }
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    slug: 'amaravati-phase-2-greenfield-works-begin',
    headline: 'Amaravati Capital Works Gain Momentum as Core Infrastructure Tenders Finalized',
    headlineTe: 'అమరావతి నిర్మాణ పనుల్లో వేగం: కోర్ క్యాపిటల్ మౌలిక వసతుల టెండర్ల ఖరారు',
    summary: 'The Andhra Pradesh Capital Region Development Authority has approved the engineering layouts for the greenfield government complex and arterial road networks connecting Amaravati with Vijayawada and Guntur.',
    summaryTe: 'ఆంధ్రప్రదేశ్ రాజధాని అమరావతిలో సచివాలయం, అసెంబ్లీ, హైకోర్టు అనుసంధాన ప్రధాన రహదారుల నిర్మాణానికి సీఆర్‌డీఏ తుది రూపునిచ్చింది. ప్రపంచ బ్యాంకు సహకారంతో పనులు వేగవంతం కానున్నాయి.',
    body: `## Core Capital Development Plan Receives Full Technical Clearance

AMARAVATI — In a major milestone for Andhra Pradesh's greenfield riverfront capital, the Capital Region Development Authority (CRDA) and State Cabinet have formally approved the execution schedules for Phase 2 infrastructure works across the 217-square-kilometre capital city zone.

The infrastructure push involves a multi-modal arterial grid linking the Seed Capital Access Road with National Highway 16, comprehensive storm-water gravity drainage systems designed to withstand 100-year flood levels, and underground utility ducts spanning 140 kilometres.

### Key Infrastructure Pillars in Phase 2
* **Flood Mitigation & Riverfront Protection**: Constructing reinforced revetments along the Krishna River bank and dual reservoir balancing systems at Kondaveeti Vagu to ensure 100% flood resilience.
* **Smart Grid & Zero-Discharge Utilities**: Underground multi-utility conduits for optical fiber, electricity, and recycled water.
* **Connectivity Corridors**: Six-lane bypass link connecting Vijayawada Airport at Gannavaram to the core administrative enclave in under 25 minutes.

"Our objective is not merely administrative construction, but creating an economically self-sustaining, eco-friendly green metropolis that generates sustainable employment for youth across coastal and Rayalaseema districts," stated the Municipal Administration minister during the review meeting.

Local farmer representatives from Tulluru, Velagapudi, and Mandadam expressed satisfaction over the revival of infrastructure development, highlighting that returnable developed plots are witnessing renewed investor interest from educational institutions, national healthcare chains, and IT firms.`,
    bodyTe: `## కోర్ క్యాపిటల్ మౌలిక వసతులకు సాంకేతిక ఆమోదం

అమరావతి — ఆంధ్రప్రదేశ్ ప్రజా రాజధాని అమరావతి నిర్మాణంలో మరో కీలక అడుగు పడింది. 217 చదరపు కిలోమీటర్ల రాజధాని పరిధిలో రెండో దశ మౌలిక వసతుల పనుల కార్యాచరణకు కేబినెట్ మరియు సీఆర్‌డీఏ (CRDA) లాంఛనంగా ఆమోదం తెలిపాయి.

కృష్ణా నదీ తీరంలో వరద నివారణ వ్యవస్థలు, 140 కిలోమీటర్ల మేర అండర్‌గ్రౌండ్ యుటిలిటీ డక్టులు, రాజధాని నుంచి జాతీయ రహదారి 16కు అనుసంధానించే 6 వరుసల రహదారుల నిర్మాణం ఇందులో ప్రధానాంశాలు.

### రెండో దశ పనుల్లో కీలక ముఖ్యాంశాలు:
* **వరద ముంపు నివారణ**: కొండవీటి వాగు వరద నీటి నియంత్రణకు భారీ రెగ్యులేటర్లు, లిఫ్ట్ ఇరిగేషన్ పంపింగ్ కేంద్రాల ఆధునీకరణ.
* **అంతర్జాతీయ ప్రమాణాలతో మౌలిక వసతులు**: విద్యుత్, తాగునీరు, ఆప్టికల్ ఫైబర్ కేబుల్స్ కోసం రోడ్లను తవ్వకుండా నిర్మించే అధునాతన అండర్‌గ్రౌండ్ డక్ట్ వ్యవస్థ.
* **గన్నవరం ఎయిర్‌పోర్ట్ అనుసంధానం**: విజయవాడ విమానాశ్రయం నుంచి సచివాలయానికి కేవలం 25 నిమిషాల్లో చేరుకునేలా ఎక్స్‌ప్రెస్‌వే నిర్మాణం.

"అమరావతి కేవలం పరిపాలనా నగరం మాత్రమే కాదు, రాబోయే తరాలకు ఉపాధి అవకాశాలు కల్పించే విజ్ఞాన, పారిశ్రామిక కేంద్రంగా అభివృద్ధి చెందనుంది" అని అధికారులు సమీక్షలో స్పష్టం చేశారు. స్థానిక రైతు సంఘాలు ఈ నిర్ణయం పట్ల హర్షం వ్యక్తం చేశాయి.`,
    categoryId: 'cat-ap',
    subcategoryId: 'cat-amaravati',
    tags: ['andhra-pradesh', 'amaravati'],
    authorId: 'auth-1',
    location: 'Amaravati',
    locationTe: 'అమరావతి',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Architectural overview of the planned core administrative zone in Amaravati along the Krishna riverfront.',
    imageCredit: 'AP CRDA / Sunrise News Archive',
    publishedAt: '2026-09-21T08:30:00Z',
    updatedAt: '2026-09-21T09:15:00Z',
    isLeadStory: true,
    isBreaking: false,
    isEditorPick: true,
    isTrending: true,
    viewsCount: 14200,
    readingTimeMinutes: 4,
    format: 'article',
    seoTitle: 'Amaravati Capital Works Phase 2 Approved: Core Infrastructure Details',
    seoDescription: 'AP Government finalizes tenders for Amaravati core capital zone infrastructure, riverfront protection, and airport expressway.',
  },
  {
    id: 'art-2',
    slug: 'visakhapatnam-it-corridor-semiconductor-lab',
    headline: 'Visakhapatnam Set to Host Advanced Semiconductor Testing and Design Facility',
    headlineTe: 'విశాఖలో అత్యాధునిక సెమీకండక్టర్ టెస్టింగ్ & డిజైనింగ్ ల్యాబ్ ఏర్పాటు',
    summary: 'A premier consortium of semiconductor firms and educational institutions is investing ₹1,800 crore in the Gambheeram IT Special Economic Zone, cementing Vizag as an emerging technology powerhouse.',
    summaryTe: 'విశాఖపట్నం గంభీరం ఐటీ ప్రత్యేక ఆర్థిక మండలిలో ₹1,800 కోట్ల పెట్టుబడితో అధునాతన చిప్ డిజైనింగ్, టెస్టింగ్ కేంద్రాన్ని ఏర్పాటు చేయనున్నారు. స్థానిక ఇంజనీరింగ్ పట్టభద్రులకు వేలాది ఉద్యోగావకాశాలు లభించనున్నాయి.',
    body: `## High-Tech Manufacturing and Chip Design Hub in Coastal Andhra

VISAKHAPATNAM — The port city of Visakhapatnam continues its rapid ascension as a specialized hardware and semiconductor technology hub. The State Electronics & IT Department has signed an agreement with an international semiconductor consortium to establish a 40-acre Testing, Marking, and Packaging (ATMP) center in the Gambheeram IT SEZ.

The strategic coastal location of Visakhapatnam, coupled with direct international air cargo connections and deep-water container berths at Visakhapatnam Port and Gangavaram Port, played a decisive role in the investment decision.

### Key Highlights of the Initiative:
1. **Direct Employment Generation**: Over 3,200 high-skilled VLSI design, semiconductor testing, and cleanroom engineering roles over three years.
2. **Academic Partnerships**: Collaboration with Andhra University College of Engineering and IIT Tirupati to introduce specialized semiconductor wafer fabrication and VLSI certification curricula.
3. **Clean Energy Grid**: The facility will be powered by a dedicated 25 MW solar and green hydrogen micro-grid to achieve near-zero carbon emission standards.

"Visakhapatnam offers the optimal balance of maritime logistics, educated engineering manpower, and robust power stability. This project will serve as the anchor for an entire electronics component supply chain in northern Andhra Pradesh," noted the principal investor during the formal declaration ceremony.`,
    bodyTe: `## గంభీరం ఐటీ సెజ్ లో హైటెక్ విప్లవం

విశాఖపట్నం — సాగర తీర నగరం విశాఖపట్నం పారిశ్రామికంగా, సాంకేతికంగా సరికొత్త మైలురాయిని అధిగమించింది. విశాఖ రూరల్ గంభీరం పరిధిలోని ఐటీ సెజ్ లో ₹1,800 కోట్ల వ్యయంతో సెమీకండక్టర్ టెస్టింగ్ మరియు చిప్ ప్యాకేజింగ్ యూనిట్ ఏర్పాటుకు ప్రభుత్వం రంగం సిద్ధం చేసింది.

సముద్ర తీరం, పోర్టు ద్వారా సులభతర ఎగుమతి సదుపాయాలు మరియు ఇంజనీరింగ్ మానవ వనరులు అందుబాటులో ఉండటంతో అంతర్జాతీయ సంస్థలు విశాఖ వైపు మొగ్గు చూపుతున్నాయి.

### ప్రాజెక్టు విశేషాలు:
1. **ఉద్యోగావకాశాలు**: ప్రత్యక్షంగా 3,200 మంది ఇంజనీర్లకు, పరోక్షంగా 6,000 మందికి ఉపాధి.
2. **ఆంధ్రా యూనివర్సిటీతో ఒప్పందం**: ఏయూ ఇంజనీరింగ్ కాలేజీలో సెమీకండక్టర్ డిజైనింగ్ పై ప్రత్యేక పీజీ మరియు డిప్లొమా కోర్సుల నిర్వహణ.
3. **పర్యావరణ హిత ఇంధనం**: పరిశ్రమకు అవసరమైన విద్యుత్తు కోసం 25 మెగావాట్ల సోలార్ ప్రాజెక్ట్ ఏర్పాటు.

ఈ ప్రాజెక్టు ద్వారా ఉత్తరాంధ్ర ప్రాంతం గ్లోబల్ టెక్నాలజీ మ్యాప్‌లో మరింత ప్రముఖ స్థానాన్ని సంపాదించుకోనుంది.`,
    categoryId: 'cat-ap',
    subcategoryId: 'cat-vizag',
    tags: ['visakhapatnam', 'andhra-pradesh', 'technology'],
    authorId: 'auth-3',
    location: 'Visakhapatnam',
    locationTe: 'విశాఖపట్నం',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Advanced cleanroom wafer testing and semiconductor manufacturing facility model.',
    imageCredit: 'Sunrise News / Technology Bureau',
    publishedAt: '2026-09-21T07:45:00Z',
    updatedAt: '2026-09-21T08:20:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: true,
    isTrending: true,
    viewsCount: 11850,
    readingTimeMinutes: 3,
    format: 'article',
    seoTitle: 'Visakhapatnam Semiconductor Testing Facility: ₹1800 Cr Investment',
    seoDescription: 'Consortium to establish chip testing and design center in Vizag Gambheeram IT SEZ creating 3200 high-tech jobs.',
  },
  {
    id: 'art-3',
    slug: 'hyderabad-global-ai-hub-investments',
    headline: 'Hyderabad Secures Multi-Billion Dollar AI Research Center in Financial District',
    headlineTe: 'హైదరాబాద్ ఫైనాన్షియల్ డిస్ట్రిక్ట్‌లో అంతర్జాతీయ ఏఐ పరిశోధనా కేంద్రం',
    summary: 'Global enterprise software giants announce a dedicated Center of Excellence for Generative AI and multilingual computing models, focusing on Indian languages including Telugu, Hindi, and Tamil.',
    summaryTe: 'భారతీయ ప్రాంతీయ భాషల ప్రాసెసింగ్ మరియు జనరేటివ్ ఏఐ పరిశోధనల కోసం హైదరాబాద్‌లో అత్యాధునిక సెంటర్ ఆఫ్ ఎక్సలెన్స్ ప్రారంభం కానుంది. ప్రపంచ స్థాయి టెక్ సంస్థల భాగస్వామ్యంతో విస్తరణ.',
    body: `## Hyderabad Consolidates Position as India's AI Capital

HYDERABAD — The Telangana state capital has recorded another historic victory in high-technology foreign investment with the inauguration of the International Generative AI Center in Hyderabad's Financial District.

The campus will house over 4,500 researchers, neural architecture engineers, and natural language processing (NLP) linguists dedicated to developing large language models customized for Indian regional governance, agricultural advisories, and vernacular healthcare applications.

### Focus on Telugu and Indic Language AI
A specialized division of the research lab will partner with the International Institute of Information Technology Hyderabad (IIIT-H) to train deep multilingual foundation models on verified cultural, administrative, and legal corpora in Telugu.

"Language barriers should never impede citizens from accessing welfare governance or market intelligence. Our Hyderabad center will train the world's most accurate Telugu and Indic conversational systems," the Chief Technology Officer announced.`,
    bodyTe: `## టెక్ రాజధానిగా హైదరాబాద్ సరికొత్త మైలురాయి

హైదరాబాద్ — నగరంలోని ఫైనాన్షియల్ డిస్ట్రిక్ట్ లో అంతర్జాతీయ జనరేటివ్ ఏఐ (Generative AI) మరియు మెషిన్ లెర్నింగ్ రీసెర్చ్ కేంద్రాన్ని ప్రముఖ టెక్నాలజీ దిగ్గజాలు సంయుక్తంగా ప్రారంభించాయి.

ఈ పరిశోధనా కేంద్రంలో 4,500 మంది కంప్యూటర్ సైంటిస్టులు, న్యూరల్ నెట్‌వర్క్ ఇంజనీర్లు మరియు భాషా శాస్త్రవేత్తలు భారతీయ భాషలపై ప్రత్యేకంగా పరిశోధనలు చేయనున్నారు.

### తెలుగు భాషా ఏఐ మోడళ్ల అభివృద్ధి:
ట్రిపుల్ ఐటీ హైదరాబాద్ (IIIT-H) భాగస్వామ్యంతో తెలుగు పరిపాలనా భాష, రైతులకు అవసరమైన వాతావరణ సమాచారం మరియు వైద్య సలహాలను అందించే స్వదేశీ ఏఐ అప్లికేషన్లను రూపొందిస్తున్నారు.`,
    categoryId: 'cat-tg',
    tags: ['hyderabad', 'telangana', 'technology'],
    authorId: 'auth-2',
    location: 'Hyderabad',
    locationTe: 'హైదరాబాద్',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Neural network and AI computing infrastructure visualization at Hyderabad tech campus.',
    imageCredit: 'Tech Desk / Sunrise News',
    publishedAt: '2026-09-21T06:15:00Z',
    updatedAt: '2026-09-21T07:10:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: true,
    isTrending: true,
    viewsCount: 9400,
    readingTimeMinutes: 3,
    format: 'article',
  },
  {
    id: 'art-4',
    slug: 'polavaram-project-diaphragm-wall-milestone',
    headline: 'Polavaram Project Achieves Critical Milestone: Diaphragm Wall Safety Tests Completed',
    headlineTe: 'పోలవరం ప్రాజెక్టులో కీలక పురోగతి: డయాఫ్రమ్ వాల్ పటిష్టత పరీక్షలు పూర్తి',
    summary: 'Central Water Commission and international dam safety experts give affirmative clearance to the reinforced main dam foundational works on the Godavari River.',
    summaryTe: 'గోదావరి నదిపై నిర్మిస్తున్న పోలవరం జాతీయ ప్రాజెక్ట్ డయాఫ్రమ్ వాల్ భద్రతా పరీక్షలను కేంద్ర జల సంఘం (CWC) మరియు అంతర్జాతీయ నిపుణుల బృందం విజయవంతంగా సమీక్షించాయి.',
    body: `## Godavari Lifeline Dam Construction Enters Decisive Phase

POLAVARAM — In an encouraging development for millions of farmers across the Godavari and Krishna delta basins, foundational safety assessments on the main earth-cum-rockfill (ECRF) dam at Polavaram have been officially certified by the Central Water Commission (CWC).

Following ultrasonic testing and core structural drilling, the reconstituted diaphragm wall demonstrated full soil stabilization capacity, paving the way for full-scale height elevation works ahead of the upcoming monsoon season.

### Irrigation Reach & Beneficiaries:
* **Direct Ayacut**: 7.2 lakh acres of agricultural land in East Godavari, West Godavari, Krishna, and Visakhapatnam districts.
* **Drinking Water**: Supplies 23.44 TMC to Visakhapatnam smart city and 540 drought-prone villages along the canal route.
* **Hydroelectric Power**: 960 MW hydro-generating plant scheduled for commissioning in phased blocks.`,
    bodyTe: `## గోదావరి నదీ జలాల పరిరక్షణ దిశగా కీలక అడుగు

పోలవరం — ఆంధ్రప్రదేశ్ రైతాంగానికి జీవనాడి అయిన పోలవరం ప్రాజెక్ట్ నిర్మాణంలో అత్యంత ప్రధానమైన డయాఫ్రమ్ వాల్ పటిష్టత పరీక్షలు విజయవంతంగా పూర్తయ్యాయి. కేంద్ర జల సంఘం నిపుణులు, అంతర్జాతీయ ఇంజనీర్ల బృందం క్షేత్రస్థాయిలో అల్ట్రాసోనిక్ పరీక్షలు నిర్వహించి క్లియరెన్స్ ఇచ్చాయి.

దీంతో ఈసీఆర్‌ఎఫ్ (ECRF) ప్రధాన డ్యామ్ ఎత్తు పెంచే పనులు వేగవంతం కానున్నాయి.

### పోలవరం ప్రాజెక్ట్ ప్రయోజనాలు:
* **రైతాంగానికి సాగునీరు**: ఉభయ గోదావరి, కృష్ణా, విశాఖ జిల్లాల్లో దాదాపు 7.2 లక్షల ఎకరాల ఆయకట్టుకు శాశ్వత సాగునీరు.
* **తాగునీటి సరఫరా**: విశాఖపట్నం మహానగరంతో పాటు కాలువ పరివాహక ప్రాంతంలోని 540 గ్రామాలకు పరిశుభ్రమైన తాగునీరు.
* **జల విద్యుత్**: 960 మెగావాట్ల సామర్థ్యంతో పర్యావరణహిత విద్యుత్ ఉత్పత్తి కేంద్రం నిర్మాణం.`,
    categoryId: 'cat-ap',
    tags: ['polavaram', 'andhra-pradesh', 'agriculture'],
    authorId: 'auth-4',
    location: 'Polavaram',
    locationTe: 'పోలవరం',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Spillway gates and concrete civil structures at the Polavaram irrigation reservoir on the Godavari.',
    imageCredit: 'Water Resources Dept / Sunrise News',
    publishedAt: '2026-09-20T16:30:00Z',
    updatedAt: '2026-09-21T05:00:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: true,
    isTrending: false,
    viewsCount: 8200,
    readingTimeMinutes: 4,
    format: 'article',
  },
  {
    id: 'art-5',
    slug: 'fact-check-electric-vehicle-subsidy-viral-claims',
    headline: 'FACT CHECK: Viral WhatsApp Forward Claiming 50% Flat Subsidy on Two-Wheelers in AP & Telangana is False',
    headlineTe: 'ఫ్యాక్ట్ చెక్: ఏపీ, తెలంగాణలో ద్విచక్ర వాహనాలపై 50% ఫ్లాట్ సబ్సిడీ అంటూ సోషల్ మీడియాలో ప్రచారం అబద్ధం',
    summary: 'Sunrise News Fact-Check Unit verifies circulating messages regarding free registration and flat 50% cash refunds for electric scooters.',
    summaryTe: 'సోషల్ మీడియా మరియు వాట్సాప్‌లో హల్‌చల్ చేస్తున్న "ఈవీ స్కూటర్లపై 50 శాతం నగదు రాయితీ" వార్తలపై సన్‌రైజ్ న్యూస్ నిజనిర్ధారణ చేసింది. రవాణా శాఖ విడుదల చేసిన నిబంధనలను తప్పుగా చిత్రీకరించినట్లు తేలింది.',
    body: `## Claims Examined by Sunrise News Independent Fact-Check Desk

NEW DELHI / HYDERABAD — Over the past 72 hours, a viral message across WhatsApp groups in Andhra Pradesh and Telangana claimed that state governments have sanctioned an immediate 50% direct bank transfer (DBT) subsidy for any citizen purchasing an electric two-wheeler before October 31.

### Claim Under Review
* **The Claim**: Citizens buying any EV scooter will receive half the ex-showroom price credited back to their Aadhaar-linked bank account within 14 days under a special green mobility scheme.
* **Circulating Source**: Fraudulent WhatsApp forwarded graphics mimicking government transport portal headers with fake link attachments.

### Our Investigation
1. We checked the official transport portals of Andhra Pradesh (\`aptransport.org\`) and Telangana (\`transport.telangana.gov.in\`).
2. We interviewed Principal Secretaries of Transport in both states. Both confirmed that while road tax and registration fees are exempted for electric vehicles under state clean mobility policies, there is **NO 50% flat cash rebate**.
3. Central FAME-II and PM E-DRIVE guidelines only provide predetermined per-kilowatt-hour production subsidies directly discounted on the dealer invoice, not direct cash transfers.

### Verdict: FALSE
The claim is false and misleading. Readers are strictly warned not to click unknown third-party web links claiming to register Aadhaar details for subsidies.`,
    bodyTe: `## సన్‌రైజ్ న్యూస్ ఫ్యాక్ట్ చెక్ డెస్క్ దర్యాప్తు

హైదరాబాద్ / న్యూఢిల్లీ — ఆంధ్రప్రదేశ్, తెలంగాణ రాష్ట్రాల్లో ఎలక్ట్రిక్ స్కూటర్లు కొనుగోలు చేసే వారికి ప్రభుత్వం 50% నేరుగా బ్యాంకు ఖాతాలో నగదు జమ చేస్తుందంటూ వాట్సాప్, ఫేస్‌బుక్‌లలో ఒక సందేశం విపరీతంగా వ్యాపిస్తోంది.

### పరిశీలించిన వాదన:
* **ప్రచారం**: అక్టోబర్ 31 లోపు ఈవీ వాహనం కొంటే సగం ధరను ప్రభుత్వమే చెల్లిస్తుంది. ఆధార్ లింక్ చేసి దరఖాస్తు చేసుకోవాలంటూ ఒక గుర్తుతెలియని లింక్ ప్రచారం జరుగుతోంది.

### నిజనిర్ధారణ వాస్తవాలు:
1. రెండు రాష్ట్రాల రవాణా శాఖల అధికారిక వెబ్‌సైట్లను సన్‌రైజ్ న్యూస్ పరిశీలించింది.
2. రవాణా శాఖ ఉన్నతాధికారులను సంప్రదించగా, ఈవీ వాహనాలకు కేవలం రోడ్డు పన్ను (Road Tax), రిజిస్ట్రేషన్ ఫీజుల మినహాయింపు మాత్రమే అమల్లో ఉందని, ఎటువంటి 50% నగదు రాయితీ లేదని స్పష్టం చేశారు.
3. కేంద్ర ప్రభుత్వ పీఎం ఈ-డ్రైవ్ రాయితీ వాహన తయారీ సంస్థలకే వర్తిస్తుంది. ప్రజలకు నేరుగా ఖాతాల్లో నగదు బదిలీ చేయరు.

### తీర్పు: అబద్ధం (FALSE)
ఈ ప్రచారం పూర్తిగా అవాస్తవం. వ్యక్తిగత ఆధార్, బ్యాంకు వివరాలను అపరిచిత లింకుల్లో నమోదు చేసి మోసపోవద్దని ప్రజలను హెచ్చరిస్తున్నాము.`,
    categoryId: 'cat-factcheck',
    tags: ['technology', 'andhra-pradesh', 'telangana'],
    authorId: 'auth-5',
    location: 'New Delhi',
    locationTe: 'న్యూఢిల్లీ',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Electric two-wheeler mobility analysis by Sunrise News Fact Check Unit.',
    imageCredit: 'Sunrise News Fact Check Desk',
    publishedAt: '2026-09-21T09:00:00Z',
    updatedAt: '2026-09-21T09:30:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: true,
    isTrending: true,
    viewsCount: 16500,
    readingTimeMinutes: 3,
    format: 'fact-check',
    factCheck: {
      claim: 'AP and Telangana governments are crediting 50% cash refunds to bank accounts for electric two-wheelers.',
      claimTe: 'ఏపీ, తెలంగాణ ప్రభుత్వాలు ఎలక్ట్రిక్ స్కూటర్లపై 50% నగదు రాయితీని నేరుగా ఖాతాల్లో జమ చేస్తున్నాయి.',
      claimedBy: 'Viral WhatsApp forwards and phishing websites',
      verdict: 'False',
      verdictTe: 'అబద్ధం',
      evidenceSummary: 'State transport departments confirm only road tax and registration fees are exempted; no flat 50% cash subsidy exists.',
      evidenceSummaryTe: 'రవాణా శాఖల ధ్రువీకరణ: రోడ్డు పన్ను మినహాయింపు మాత్రమే ఉంది, 50% నగదు రాయితీ అనేది అసత్య ప్రచారం.',
      reviewDate: '2026-09-21',
    },
  },
  {
    id: 'art-6',
    slug: 'rayalaseema-drip-irrigation-horticulture-boom',
    headline: 'Green Revolution in Rayalaseema: Micro-Irrigation Turns Arid Land into Fruit Capital',
    headlineTe: 'రాయలసీమలో ఉద్యానవన విప్లవం: బిందు సేద్యంతో సస్యశ్యామలమైన మెట్ట భూములు',
    summary: 'Anantapur and Kadapa districts lead South India in sweet orange, pomegranate, and banana cultivation through precision drip-irrigation networks.',
    summaryTe: 'అనంతపురం, వైఎస్సార్ కడప జిల్లాల్లో ఆధునిక బిందు సేద్యం (Drip Irrigation) సాంకేతికతతో చీనీ, దానిమ్మ, అరటి తోటల విస్తీర్ణం భారీగా పెరిగింది. విదేశీ మార్కెట్లకు భారీగా ఎగుమతులు.',
    body: `## Transforming Drought-Prone Regions Through Precision Agritech

ANANTAPUR — Known historically for arid red soils and scarce rainfall, the Rayalaseema plateau is witnessing an agricultural renaissance driven by micro-irrigation technologies, solar borewells, and cold-chain infrastructure.

Over the past four harvest seasons, farmers in Anantapur and Pulivendula have expanded sweet lime (Battaayi), pomegranate, and tissue-culture banana orchards over 1.8 lakh hectares.

### Economics of Precision Micro-Irrigation
By combining targeted nutrient delivery (fertigation) with soil moisture IoT sensors, water consumption dropped by 42% while fruit yield per acre surged by 35%. Farmer producer organizations (FPOs) have negotiated direct export consignments to Gulf Cooperation Council (GCC) countries and Europe, eliminating predatory intermediaries.

"Three years ago, water scarcity forced us to contemplate migrating to urban centers. With subsidy-backed drip systems and solar cold storage clusters, our orchard generates net profits exceeding ₹3.5 lakh per acre," explained a progressive grower from Tadipatri.`,
    bodyTe: `## రాయలసీమ ముఖచిత్రాన్ని మార్చిన బిందు సేద్యం

అనంతపురం — ఒకప్పుడు కరవు కాటకాలకు నెలవైన రాయలసీమ నేడు దక్షిణ భారత ఉద్యానవన రాజధానిగా రూపుదిద్దుకుంటోంది. బిందు సేద్యం, మైక్రో ఇరిగేషన్ పరికరాలు మరియు అత్యాధునిక కోల్డ్ స్టోరేజీల రాకతో వేలాది ఎకరాల్లో నాణ్యమైన పండ్ల తోటలు వెలిశాయి.

అనంతపురం, కడప జిల్లాల నుంచి చీనీ, అరటి, దానిమ్మ పండ్లు గల్ఫ్ దేశాలకు మరియు యూరప్‌కు భారీగా ఎగుమతి అవుతున్నాయి.

### ఆధునిక వ్యవసాయం తెచ్చిన మార్పులు:
నీటి వినియోగం 40 శాతానికి పైగా తగ్గడమే కాకుండా, ఎరువుల వృథా అరికట్టడంతో దిగుబడులు 30 శాతం పెరిగాయి. రైతు ఉత్పత్తిదారుల సంఘాల (FPO) ద్వారా దళారుల ప్రమేయం లేకుండా నేరుగా ఎగుమతిదారులు పంటను కొనుగోలు చేస్తుండటంతో రైతులకు గరిష్ట లాభాలు దక్కుతున్నాయి.`,
    categoryId: 'cat-agri',
    tags: ['agriculture', 'andhra-pradesh'],
    authorId: 'auth-4',
    location: 'Anantapur',
    locationTe: 'అనంతపురం',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Fruit orchard under automated drip irrigation network in Rayalaseema.',
    imageCredit: 'Sunrise News Agriculture Desk',
    publishedAt: '2026-09-20T11:00:00Z',
    updatedAt: '2026-09-20T12:30:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: false,
    isTrending: true,
    viewsCount: 7100,
    readingTimeMinutes: 4,
    format: 'article',
  },
  {
    id: 'art-7',
    slug: 'tollywood-pan-world-box-office-phenomenon',
    headline: 'Beyond Pan-India: How Telugu Cinema is Redefining Global Visual Storytelling',
    headlineTe: 'పాన్-ఇండియాను దాటి ప్రపంచ తెరపై తెలుగు సినిమా విశ్వరూపం',
    summary: 'With technological innovation, emotional rootedness, and grand production values, Tollywood continues to captivate global audiences from Tokyo to Los Angeles.',
    summaryTe: 'కథలోని భావోద్వేగం, సాంకేతిక విలువలు, భారీ బడ్జెట్ నిర్మాణాలతో ప్రపంచ ప్రేక్షకులను ఉర్రూతలూగిస్తున్న తెలుగు చలనచిత్ర పరిశ్రమ. బాక్సాఫీస్ వద్ద సరికొత్త రికార్డులు.',
    body: `## High Production Craft and Cultural Authenticity

HYDERABAD — What began as the "Pan-India" phenomenon has formally evolved into a global cinematic movement. Films produced in Hyderabad's studios are routinely securing wide theatrical rollouts across North America, Japan, the United Kingdom, and Australia, outperforming major Hollywood releases in key metropolitan markets.

Industry analysts attribute this triumph to three distinct factors:
1. **Visual Effects and Indigenous VFX Studios**: Hyderabad's visual effects houses are now globally competitive, executing complex simulations locally.
2. **Universal Emotional Resonance**: Unapologetic heroism rooted in regional folklore, family loyalties, and grand mythological echoes.
3. **Sound Engineering**: Masterful acoustic compositions integrating traditional Indian folk rhythms with orchestral symphonies.`,
    bodyTe: `## తెలుగు సినిమా గ్లోబల్ జైత్రయాత్ర

హైదరాబాద్ — ప్రాంతీయ చలనచిత్ర పరిశ్రమ స్థాయి నుంచి అంతర్జాతీయ స్థాయికి ఎదిగిన తెలుగు సినిమా సరికొత్త రికార్డులను సృష్టిస్తోంది. జపాన్, అమెరికా, యూరప్ దేశాల్లో మన సినిమాలు వసూళ్ల వర్షం కురిపిస్తున్నాయి.

హైదరాబాద్ కేంద్రంగా పనిచేస్తున్న వీఎఫ్‌ఎక్స్ (VFX) సంస్థల సాంకేతిక నైపుణ్యం, భారతీయ సంస్కృతి-పురాణాల ఆధారంగా రూపొందించిన శక్తివంతమైన కథనాలు అంతర్జాతీయ ప్రేక్షకులను సైతం విశేషంగా ఆకట్టుకుంటున్నాయి.`,
    categoryId: 'cat-entertainment',
    tags: ['tollywood', 'hyderabad', 'telangana'],
    authorId: 'auth-2',
    location: 'Hyderabad',
    locationTe: 'హైదరాబాద్',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Cinematography camera rig and production set in Ramoji Film City.',
    imageCredit: 'Entertainment Bureau / Sunrise News',
    publishedAt: '2026-09-19T14:20:00Z',
    updatedAt: '2026-09-20T08:00:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: false,
    isTrending: true,
    viewsCount: 13200,
    readingTimeMinutes: 3,
    format: 'article',
  },
  {
    id: 'art-8',
    slug: 'coastal-groundwater-salinity-investigation',
    headline: 'INVESTIGATION: The Sinking Freshwater Lens of Coastal Andhra Pradesh',
    headlineTe: 'పరిశోధనాత్మక కథనం: కోస్తాంధ్రలో వేగంగా పెరుగుతున్న భూగర్భ జలాల లవణీయత',
    summary: 'Unregulated aqua farms and deep groundwater extraction threaten the drinking water security of over 400 coastal villages from Kalingapatnam to Nizampatnam.',
    summaryTe: 'అనుమతులు లేని రొయ్యల సాగు మరియు అధికంగా భూగర్భ జలాలను తోడేయడంతో తీరప్రాంత గ్రామాల్లో తాగునీటి బావులు ఉప్పునీరుగా మారుతున్నాయి. సన్‌రైజ్ న్యూస్ క్షేత్రస్థాయి పరిశోధన.',
    body: `## An Ecological Crisis Brewing Beneath Coastal Sands

VISAKHAPATNAM / MACHILIPATNAM — A six-month field investigation conducted across 28 coastal mandals in Srikakulam, Vizianagaram, Visakhapatnam, and Krishna districts reveals that seawater intrusion has pushed 8 to 14 kilometers inland over the last decade.

### Key Investigative Findings:
* **Total Dissolved Solids (TDS)**: Well water samples tested in 42 villages registered TDS levels between 2,800 mg/L and 5,400 mg/L — far above the Bureau of Indian Standards (BIS) safe permissible limit of 500 mg/L.
* **Aquifer Depletion**: Deep commercial borewells operated by unauthorized aqua ponds pump millions of litres daily without mandatory seawater recycling or brine recharge pits.
* **Public Health Fallout**: Local primary health centers report an alarming 28% increase in chronic kidney ailments (CKD) among fishing and agrarian communities reliant on brackish ground wells.

Community elders and environmental scientists demand immediate enforcement of Coastal Regulation Zone (CRZ) water norms, strict closure of illegal ponds, and rapid expansion of piped surface water grids from river sources.`,
    bodyTe: `## తీర ప్రాంతాల్లో ముంచుకొస్తున్న తాగునీటి ముప్పు

విశాఖపట్నం / మచిలీపట్నం — శ్రీకాకుళం నుంచి కృష్ణా జిల్లా తీర ప్రాంతాల వరకు సన్‌రైజ్ న్యూస్ పరిశోధనా బృందం 6 నెలల పాటు క్షేత్రస్థాయిలో నిర్వహించిన అధ్యయనంలో విస్తుపోయే వాస్తవాలు వెలుగుచూశాయి. 

అనధికార రొయ్యల చెరువుల కోసం వేలాది అడుగుల లోతుకు వేసిన బోరుబావుల వల్ల సముద్రపు ఉప్పునీరు భూగర్భంలోకి 12 కిలోమీటర్ల వరకు చొచ్చుకొచ్చింది.

### పరిశోధనలో వెల్లడైన ముఖ్యాంశాలు:
* **నీటిలో లవణీయత (TDS)**: పరిశీలించిన 42 గ్రామాల్లో నీటి టీడీఎస్ స్థాయిలు 4000 దాటాయి (సురక్షిత పరిమితి 500 మాత్రమే).
* **ఆరోగ్య సమస్యలు**: తీర గ్రామాల ప్రజల్లో కిడ్నీ సంబంధిత సమస్యలు 28% పెరిగినట్లు వైద్యులు వెల్లడించారు.
* **ప్రభుత్వ చర్యలు ఆవశ్యకం**: అక్రమ చెరువులపై కఠిన చర్యలు తీసుకోవడంతో పాటు నదుల నుంచి రక్షిత మంచినీటి పైప్‌లైన్లను వెంటనే నిర్మించాలని ప్రజలు కోరుతున్నారు.`,
    categoryId: 'cat-special',
    tags: ['visakhapatnam', 'andhra-pradesh'],
    authorId: 'auth-3',
    location: 'Visakhapatnam',
    locationTe: 'విశాఖపట్నం',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Groundwater sampling and salinity measurement along the Bay of Bengal coastline.',
    imageCredit: 'S. Krishna Murthy / Sunrise News Investigation',
    publishedAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-19T06:45:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: true,
    isTrending: false,
    viewsCount: 6500,
    readingTimeMinutes: 5,
    format: 'investigation',
    corrections: [
      {
        id: 'corr-1',
        date: '2026-09-19T06:45:00Z',
        originalText: 'seawater intrusion has pushed 18 to 24 kilometers inland',
        correctedText: 'seawater intrusion has pushed 8 to 14 kilometers inland',
        reason: 'Corrected geographic distance based on official state groundwater board survey coordinates.',
        editorName: 'Ramesh Varma',
      }
    ],
  },
  {
    id: 'art-9',
    slug: 'kondapalli-artisans-revival-photo-story',
    headline: 'PHOTO ESSAY: The Living Colors and Chisels of Kondapalli Toy Makers',
    headlineTe: 'ఫోటో ఫీచర్: కొండపల్లి బొమ్మల కళాకారుల చేతి నైపుణ్యం మరియు సాంస్కృతిక వైభవం',
    summary: 'A visual journey into the ancient workshops of Ibrahimpatnam mandal, where master craftsmen turn Tella Poniki softwood into world-renowned handcrafted wooden treasures.',
    summaryTe: 'శతాబ్దాల నాటి సాంప్రదాయ కొండపల్లి బొమ్మల తయారీ విశేషాలు. తెల్ల పొనికి చెక్కతో జీవం పోసుకునే కళాఖండాల దృశ్యరూప కథనం.',
    body: `## Centuries of Craftsmanship Along the Krishna Valley

KONDAPALLI — Nestled at the foothills of the Kondapalli reserve forest near Vijayawada, artisan families have preserved the 400-year-old tradition of carving vibrant wooden figurines known worldwide as Kondapalli Bommalu.

Using the light, malleable wood of the *Tella Poniki* tree (Givotia rottleriformis), craftspeople meticulously chisel mythological deities, traditional rural occupations, Ambari elephants, and Dussehra sets.

The process remains strictly organic: artisans boil natural tamarind seed paste (Makku) to seal carved joints and extract natural colors from turmeric, pomegranate rind, lime, and indigenous plant dyes.

Supported by Geographical Indication (GI) registration and modern e-commerce cooperatives, the younger generation of artisans is blending modern minimalist aesthetics with time-honored sculptural motifs.`,
    bodyTe: `## కృష్ణా తీరంలో సజీవ శిల్పకళా సంపద

కొండపల్లి — విజయవాడ సమీపంలోని కొండపల్లి గ్రామంలో 400 ఏళ్లుగా వంశపారపర్యంగా వస్తున్న కొండపల్లి బొమ్మల కళ తెలుగు వారి గర్వకారణం.

తేలికపాటి 'తెల్ల పొనికి' చెక్కతో చింతపిక్కల జిగురును ఉపయోగించి తయారుచేసే ఈ బొమ్మలు భౌగోళిక గుర్తింపు (GI Tag) పొందాయి. సహజ సిద్ధమైన రంగులతో జీవం పోసే ఈ బొమ్మల తయారీని సన్‌రైజ్ న్యూస్ ఫోటోగ్రాఫర్లు సునిశితంగా కెమెరాలో బంధించారు.`,
    categoryId: 'cat-photos',
    tags: ['andhra-pradesh'],
    authorId: 'auth-1',
    location: 'Vijayawada',
    locationTe: 'విజయవాడ',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Master artisan carving wooden figurines with specialized indigenous chisels in Kondapalli.',
    imageCredit: 'Sunrise News Visuals',
    publishedAt: '2026-09-17T09:15:00Z',
    updatedAt: '2026-09-17T11:00:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: true,
    isTrending: false,
    viewsCount: 5400,
    readingTimeMinutes: 3,
    format: 'photo',
    galleryImages: [
      {
        url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80',
        caption: 'Chiseling the soft Poniki timber block into delicate contours.',
        credit: 'Sunrise News Visuals',
      },
      {
        url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&auto=format&fit=crop&q=80',
        caption: 'Applying natural vegetable dyes and oil lacquer for lasting luster.',
        credit: 'Sunrise News Visuals',
      }
    ]
  },
  {
    id: 'art-10',
    slug: 'cooperative-federalism-water-and-regional-harmony',
    headline: 'EDITORIAL: Cooperative Federalism: River Basin Accord Key to South India’s Industrial Future',
    headlineTe: 'సంపాదకీయం: నదీ జలాల సమతుల్యత మరియు సహకార సమాఖ్య స్ఫూర్తితోనే అభివృద్ధి',
    summary: 'Equitable river basin management, transparent telemetry gauging, and mature political dialogue are vital to secure agrarian prosperity and manufacturing growth across both Telugu states.',
    summaryTe: 'కృష్ణా, గోదావరి నదీ జలాల నిర్వహణలో టెలిమెట్రీ పరిజ్ఞానం మరియు రాష్ట్రాల మధ్య సామరస్యపూర్వక చర్చలే దక్షిణాది పారిశ్రామిక, వ్యవసాయ భవిష్యత్తుకు మార్గదర్శకం.',
    body: `## The Imperative of Joint Hydrological Stewardship

The shared heritage of Andhra Pradesh and Telangana is intimately bound to the life-giving currents of the Krishna and Godavari rivers. Over the past decade, rapid industrialization, burgeoning urban demand in the Hyderabad metropolis, and ambitious irrigation networks have placed unprecedented strain on water distribution mechanisms.

Litigation and mutual grievances before central tribunals have often slowed down critical maintenance and common storage approvals. What is urgently demanded is not protracted legal wrangling, but the institutional embrace of cooperative federalism.

### Three Concrete Steps Forward:
1. **Automated Telemetry Gauging**: Installing real-time digital sensors at every major barrage and extraction point under the Krishna River Management Board (KRMB) and Godavari River Management Board (GRMB), removing opacity in water accounting.
2. **Joint Flood Coordination Rooms**: Shared command centers during peak monsoon inflows to prevent downstream inundations and optimize multi-purpose reservoir fills.
3. **Equitable Water Recycling**: Aggressive water recycling mandates for industrial parks, reducing freshwater diversion from rural agricultural canals.

When sister states cooperate on shared natural assets, the entire region emerges as a premier economic corridor for India.`,
    bodyTe: `## సమష్టి నిర్ణయాలతోనే శాశ్వత పరిష్కారం

తెలుగు ప్రజల సాంస్కృతిక, ఆర్థిక పురోగతి కృష్ణా, గోదావరి జీవనదులతో ముడిపడి ఉంది. తెలంగాణ, ఆంధ్రప్రదేశ్ రాష్ట్రాలు రెండూ తమ రైతాంగ ప్రయోజనాలను కాపాడుకుంటూనే, నగరాల తాగునీటి అవసరాలు, పారిశ్రామిక విస్తరణను సమతుల్యం చేసుకోవాల్సిన ఆవశ్యకత ఉంది.

ట్రిబ్యునళ్లలో న్యాయపోరాటాల కంటే, టెక్నాలజీ ఆధారిత టెలిమెట్రీ వ్యవస్థలను ఏర్పాటు చేసి నీటి లెక్కలను పారదర్శకంగా నిర్వహించడం ద్వారా వివాదాలకు శాశ్వత పరిష్కారం లభిస్తుంది. ఉభయ రాష్ట్రాలు పరస్పర సహకారంతో ముందుకు సాగితేనే తెలుగు నేల సమగ్ర అభివృద్ధి సాధ్యమవుతుంది.`,
    categoryId: 'cat-editorial',
    tags: ['andhra-pradesh', 'telangana', 'polavaram'],
    authorId: 'auth-1',
    location: 'Amaravati / Hyderabad',
    locationTe: 'అమరావతి / హైదరాబాద్',
    language: 'en',
    status: 'published',
    featuredImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80',
    imageCaption: 'Sunset over the vast waters of the Krishna River barrage.',
    imageCredit: 'Sunrise News Editorial Board',
    publishedAt: '2026-09-21T04:00:00Z',
    updatedAt: '2026-09-21T04:00:00Z',
    isLeadStory: false,
    isBreaking: false,
    isEditorPick: true,
    isTrending: false,
    viewsCount: 4800,
    readingTimeMinutes: 4,
    format: 'opinion',
  }
];

export const initialAdPlacements: AdPlacement[] = [
  {
    id: 'ad-1',
    slotKey: 'leaderboard',
    title: 'Sunrise News Mobile App — Download Now',
    imageUrl: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=970&h=250&auto=format&fit=crop&q=80',
    targetUrl: 'https://sunrisenews.in/app',
    advertiser: 'Sunrise Digital Media',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'ad-2',
    slotKey: 'sidebar',
    title: 'Amaravati Global Investment Summit 2026',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=250&auto=format&fit=crop&q=80',
    targetUrl: 'https://sunrisenews.in/invest-ap',
    advertiser: 'AP Economic Development Board',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
  },
  {
    id: 'ad-3',
    slotKey: 'mid_content',
    title: 'Clean Energy Telugu States Initiative',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=728&h=90&auto=format&fit=crop&q=80',
    targetUrl: 'https://sunrisenews.in/solar-initiative',
    advertiser: 'Renewable Energy Mission',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
  }
];

export const initialSettings: EditorialSettings = {
  siteNameEn: 'SUNRISE NEWS',
  siteNameTe: 'సన్‌రైజ్ న్యూస్',
  taglineEn: 'Your World. Your News. Every Day.',
  taglineTe: 'మీ ప్రపంచం. మీ వార్తలు. అనునిత్యం.',
  breakingNewsEnabled: true,
  breakingNewsTextEn: 'AP CRDA finalizes tenders for Amaravati core infrastructure; works to commence immediately across 217 sq km zone.',
  breakingNewsTextTe: 'అమరావతి ప్రధాన మౌలిక వసతుల పనులకు సీఆర్‌డీఏ టెండర్ల ఖరారు; త్వరలోనే పనులు ప్రారంభం.',
  breakingNewsUrl: '/en/article/amaravati-phase-2-greenfield-works-begin',
  contactEmail: 'editor@sunrisenews.in',
  contactPhone: '+91 866 245 8899',
  addressHyderabad: 'Sunrise News Media Tower, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
  addressAmaravati: 'Sunrise Bhavan, Seed Capital Access Road, Rayapudi, Amaravati, Andhra Pradesh 522237',
  addressVisakhapatnam: 'Oceanic Media Center, VIP Road, Siripuram, Visakhapatnam, Andhra Pradesh 530003',
  addressDelhi: 'Press House, Bahadur Shah Zafar Marg, ITO, New Delhi 110002',
  grievanceOfficerName: 'K. Satyanarayana, Advocate & Redressal Officer',
  grievanceOfficerEmail: 'grievance@sunrisenews.in',
};

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    userId: 'usr-admin',
    userName: 'Ramesh Varma (Editor-in-Chief)',
    userRole: 'super_admin',
    action: 'publish',
    targetType: 'article',
    targetId: 'art-1',
    targetTitle: 'Amaravati Capital Works Phase 2 Approved',
    timestamp: '2026-09-21T08:30:00Z',
    details: 'Reviewed lead story and pushed to public production feed.',
  },
  {
    id: 'log-2',
    userId: 'usr-admin',
    userName: 'Ananya Sharma',
    userRole: 'editor',
    action: 'publish',
    targetType: 'article',
    targetId: 'art-5',
    targetTitle: 'FACT CHECK: Viral Electric Vehicle Subsidy Claims',
    timestamp: '2026-09-21T09:00:00Z',
    details: 'Completed transport ministry verification and released fact-check analysis.',
  }
];
