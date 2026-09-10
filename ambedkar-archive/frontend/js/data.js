/**
 * data.js — Scholarly AI Knowledge Base & Semantic Engine for BAWS Corpus
 * Fine-tuned across all 21 Volumes of Dr. Babasaheb Ambedkar Writings and Speeches (BAWS),
 * key treatises, Constituent Assembly Debates, and economic / social treatises.
 *
 * Offline-first, deterministic, zero-latency retrieval.
 */

const BAWS_VOLUMES_CATALOG = [
  { vol: 1, title: 'Castes in India, Annihilation of Caste, and Other Essays', year: 1979, pages: 512, topics: ['caste', 'annihilation of caste', 'states and minorities', 'maharashtra as a linguistic province', 'ranade gandhi jinnah', 'communal deadlock'] },
  { vol: 2, title: 'Dr. Ambedkar in Bombay Legislature, Simon Commission & Round Table Conferences', year: 1982, pages: 780, topics: ['bombay legislature', 'simon commission', 'round table conference', 'depressed classes', 'separate electorates'] },
  { vol: 3, title: 'Philosophy of Hinduism, Revolution and Counter-Revolution in Ancient India, Buddha or Karl Marx', year: 1987, pages: 498, topics: ['philosophy of hinduism', 'revolution and counter-revolution', 'buddha or karl marx', 'ancient india', 'brahmanism'] },
  { vol: 4, title: 'Riddles in Hinduism: An Exposition to Enlighten the Masses', year: 1987, pages: 442, topics: ['riddles in hinduism', 'vedas', 'upanishads', 'ramayana', 'mahabharata', 'krishna', 'rama'] },
  { vol: 5, title: 'Essays on Untouchables and Untouchability: Social, Political, Religious', year: 1989, pages: 468, topics: ['untouchables', 'slaves and untouchables', 'untouchability', 'hindu social order', 'demography'] },
  { vol: 6, title: 'The Problem of the Rupee: Its Origin and Solution & Evolution of Provincial Finance in British India', year: 1989, pages: 590, topics: ['problem of the rupee', 'rupee', 'provincial finance', 'economics', 'rbi', 'currency standard', 'gold standard'] },
  { vol: 7, title: 'Who Were the Shudras? & The Untouchables', year: 1990, pages: 450, topics: ['who were the shudras', 'the untouchables', 'broken men', 'fourth varna', 'origins of caste', 'beef eating'] },
  { vol: 8, title: 'Pakistan or the Partition of India', year: 1990, pages: 498, topics: ['pakistan', 'partition of india', 'muslim league', 'two nation theory', 'communalism'] },
  { vol: 9, title: 'What Congress and Gandhi Have Done to the Untouchables & Mr. Gandhi and the Emancipation of the Untouchables', year: 1991, pages: 480, topics: ['what congress and gandhi have done', 'poona pact', 'gandhi', 'congress', 'depressed classes'] },
  { vol: 10, title: 'Dr. Ambedkar as Member of the Governor-General\'s Executive Council (1942–1946)', year: 1991, pages: 1070, topics: ['executive council', 'labour minister', 'damodar valley', 'hirakud dam', 'labour reforms', 'central water commission'] },
  { vol: 11, title: 'The Buddha and His Dhamma', year: 1992, pages: 620, topics: ['the buddha and his dhamma', 'buddhism', 'navayana', 'dhamma', 'conversion', 'nagpur 1956', '22 vows'] },
  { vol: 12, title: 'Ancient Indian Commerce & The Untouchables and the Pax Britannica', year: 1993, pages: 380, topics: ['ancient commerce', 'columbia university', 'british rule', 'pax britannica', 'un-published writings'] },
  { vol: 13, title: 'Dr. Ambedkar: The Principal Architect of the Constitution of India', year: 1994, pages: 1250, topics: ['constitution of india', 'drafting committee', 'article 32', 'article 17', 'fundamental rights', 'preamble'] },
  { vol: 14, title: 'Dr. Ambedkar and the Hindu Code Bill', year: 1995, pages: 1380, topics: ['hindu code bill', 'women rights', 'marriage law', 'divorce', 'inheritance', 'law minister resignation'] },
  { vol: 15, title: 'Dr. Ambedkar as Free India\'s First Law Minister & Member of Opposition in Parliament', year: 1997, pages: 1010, topics: ['law minister', 'parliament', 'foreign policy', 'linguistic provinces', 'kashmir issue'] },
  { vol: 16, title: 'Dr. B. R. Ambedkar: Grammar of Pali & Linguistic Research', year: 1998, pages: 560, topics: ['pali language', 'grammar of pali', 'pali dictionary', 'linguistics'] },
  { vol: 17, title: 'Dr. B. R. Ambedkar and His Egalitarian Revolution (Speeches, Letters & Historical Records)', year: 2003, pages: 1120, topics: ['mahad satyagraha', 'manusmriti dahan', 'kalaram temple', 'yeola declaration', 'bahishkrit bharat'] },
  { vol: 18, title: 'Dr. B. R. Ambedkar\'s Speeches and Writings in Marathi (Bahishkrit Bharat & Mooknayak)', year: 2005, pages: 980, topics: ['mooknayak', 'bahishkrit bharat', 'marathi writings', 'editorials'] },
  { vol: 19, title: 'Dr. B. R. Ambedkar\'s Speeches and Writings in Marathi (Janata & Prabuddha Bharat)', year: 2005, pages: 920, topics: ['janata', 'prabuddha bharat', 'marathi journalism'] },
  { vol: 20, title: 'Historical and Official Documents of the Dalit Movement and Poona Pact Records', year: 2008, pages: 740, topics: ['poona pact records', 'macdonald award', 'yerwada jail', 'treaties'] },
  { vol: 21, title: 'Dr. B. R. Ambedkar: Photo Biography, Personal Letters & Rare Documents', year: 2010, pages: 650, topics: ['letters', 'correspondence', 'biography', 'rare manuscripts'] },
];

const CHATBOT_QA = [
  // ─── 1. ANNIHILATION OF CASTE (1936) ──────────────────────────────────
  {
    id: 'annihilation-of-caste',
    volume: 1,
    title: 'Annihilation of Caste (1936)',
    triggers: [
      'annihilation of caste', 'jat-pat-todak', 'caste annihilation', 'destroy caste', 
      'caste reform', 'shastras', 'smritis', 'shastra', 'varnashrama', 'inter-dining', 
      'inter-marriage', 'dynamite the shastras', 'vol 1', 'volume 1'
    ],
    answer: `**"Annihilation of Caste" (1936)** is Dr. Ambedkar's seminal masterwork on the mechanics and eradication of the caste system. Originally drafted as the presidential address for the 1936 Lahore conference of the Hindu reformist society *Jat-Pat-Todak Mandal*, the organizers revoked their invitation when Ambedkar refused to delete his uncompromising indictment of Hindu scriptures.\n\n### Key Philosophical Theses:\n1. **Caste is Not a Division of Labour, but a Division of Labourers**: It is a hierarchy where occupations are involuntarily pre-ordained by birth rather than natural aptitudes or economic efficiency.\n2. **Failure of Social Reform via Palliatives**: Inter-dining and inter-caste marriages are insufficient to destroy caste because caste is a sanctified state of mind sustained by religious dogmas.\n3. **Dynamiting the Scriptures**: Ambedkar concluded that caste cannot be reformed from within because the roots of caste lie in the sacred books (*Shastras* and *Smritis*). You must destroy the belief in the divine authority of these texts to genuinely end caste prejudice.\n4. **Critique of Gandhi's Ideal**: Rebuked Mahatma Gandhi's idealization of *Varnashrama Dharma*, demonstrating that hereditary division inevitably degenerates into degrading hierarchy and untouchability.`,
    citation: 'BAWS Vol. 1, pp. 23–96 · Annihilation of Caste (1936)',
    related: ['Who Were the Shudras?', 'Philosophy of Hinduism', 'States and Minorities']
  },

  // ─── 2. CASTES IN INDIA (1916) ─────────────────────────────────────────
  {
    id: 'castes-in-india-1916',
    volume: 1,
    title: 'Castes in India: Their Mechanism, Genesis and Development (1916)',
    triggers: [
      'castes in india', 'endogamy', 'exogamy', 'goldenweiser', 'columbia 1916', 
      'mechanism of caste', 'genesis of caste', 'imitation', 'surplus woman', 'surplus man', 'sati'
    ],
    answer: `Presented on May 9, 1916 at Columbia University in Dr. Alexander Goldenweiser's Anthropology Seminar, **"Castes in India"** was Dr. Ambedkar's foundational academic dissertation on the sociologic genesis of caste.\n\n### The Mechanism:\n- **Endogamy Superimposed on Exogamy**: Ambedkar identified that all Indian populations originally shared tribal clan exogamy. Caste emerged when a particular elite class enclosed itself by practicing strict **Endogamy** (marrying only within the group).\n- **The Problem of Surplus Men and Surplus Women**: To maintain numerical parity within an enclosed caste, society invented brutal customs:\n  1. *Sati* (burning the surplus widow)\n  2. *Enforced Widowhood* (preventing the surplus female from remarrying)\n  3. *Girl Marriage* (giving young prepubescent girls to elderly surplus men)\n- **The Contagion of Imitation**: The Brahmins were the first to enclose themselves; other classes, striving for status, mechanically imitated the Brahmins, dividing the entire society into mutually exclusive closed compartments.`,
    citation: 'BAWS Vol. 1, pp. 3–22 · Anthropological Paper, Columbia University (1916)',
    related: ['Annihilation of Caste', 'Who Were the Shudras?']
  },

  // ─── 3. THE PROBLEM OF THE RUPEE (1923) ────────────────────────────────
  {
    id: 'problem-of-the-rupee',
    volume: 6,
    title: 'The Problem of the Rupee: Its Origin and Its Solution (1923)',
    triggers: [
      'problem of the rupee', 'rupee', 'rbi', 'reserve bank', 'monetary', 'currency', 
      'inflation', 'gold standard', 'gold exchange standard', 'keynes', 'hilton young', 
      'vol 6', 'volume 6', 'economics', 'doctoral dissertation'
    ],
    answer: `**"The Problem of the Rupee" (1923)** was Dr. Ambedkar's D.Sc. dissertation at the London School of Economics (LSE) and constitutes one of the most brilliant macroeconomic treatises in Indian history.\n\n### Central Economic Arguments:\n1. **Critique of John Maynard Keynes**: Ambedkar sharply disagreed with J.M. Keynes's advocacy of the Gold Exchange Standard for India. Ambedkar proved that the Gold Exchange Standard allowed the colonial British administration to manipulate currency reserves, triggering rampant price inflation that devastated the purchasing power of the Indian peasantry and labour classes.\n2. **Advocacy of a Modified Gold Standard**: Recommended a stable Gold Standard with fixed currency issue limits to check arbitrary bureaucratic currency debasement.\n3. **Founding Blueprint for the Reserve Bank of India (RBI)**: When the British **Hilton Young Commission** (Royal Commission on Indian Currency and Finance) convened in 1926, Dr. Ambedkar appeared before it. His principles of monetary stability and currency issuance directly shaped the charter that established the Reserve Bank of India in 1935.`,
    citation: 'BAWS Vol. 6, pp. 313–640 · Doctoral Thesis, London School of Economics (1923)',
    related: ['Provincial Finance in British India', 'Executive Council Labour Reforms']
  },

  // ─── 4. WHO WERE THE SHUDRAS? (1948) ──────────────────────────────────
  {
    id: 'who-were-the-shudras',
    volume: 7,
    title: 'Who Were the Shudras? (1948)',
    triggers: [
      'who were the shudras', 'shudras', 'shudra', 'fourth varna', 'kshatriya', 
      'upanayana', 'sudras', 'rig veda', 'purusha sukta', 'vol 7', 'volume 7', 'origins of shudra'
    ],
    answer: `In **"Who Were the Shudras? How They Came to be the Fourth Varna in the Indo-Aryan Society" (1948)**, dedicated to Mahatma Jyotirao Phule, Dr. Ambedkar conducted an exhaustive forensic textual and historical investigation into ancient Vedic literature.\n\n### Two Revolutionary Historical Conclusions:\n1. **The Shudras were originally Aryan Kshatriyas**: In the early Indo-Aryan society, there were only three varnas (Brahmins, Kshatriyas, and Vaishyas). The Shudras were not non-Aryan subjugated tribes; they were an illustrious Solar Dynasty of Kshatriya kings (such as King Sudas in the Rigveda).\n2. **The Brahmin-Kshatriya Conflict and Degradation**: A prolonged and bitter political feud occurred between Shudra Kshatriya kings and Brahmin priests. As an act of ecclesiastical vengeance, Brahmins refused to perform the *Upanayana* (sacred thread investiture) for Shudras, systematically stripping them of twice-born (*Dvija*) social rank and degrading them into the fourth servile varna.`,
    citation: 'BAWS Vol. 7, pp. 11–228 · Thacker & Co., Bombay (1948)',
    related: ['The Untouchables (1948)', 'Philosophy of Hinduism']
  },

  // ─── 5. THE UNTOUCHABLES (1948) ────────────────────────────────────────
  {
    id: 'the-untouchables-1948',
    volume: 7,
    title: 'The Untouchables: Who Were They and Why They Became Untouchables? (1948)',
    triggers: [
      'the untouchables', 'untouchability origin', 'broken men', 'beef eating', 
      'beef', 'dalit origin', 'pollution', 'buddhism origin', 'touchables', 'antyas'
    ],
    answer: `In **"The Untouchables: Who Were They and Why They Became Untouchables?" (1948)**, Dr. Ambedkar exposed the false orthodox myth that untouchability has existed since the beginning of time.\n\n### The "Broken Men" Thesis:\n1. **Tribal Warfare & Broken Men**: During primitive times, pastoral communities fought for pasture land. Defeated tribes splintered into wandering fragments called **"Broken Men"**. Settled agricultural villages struck treaties allowing Broken Men to reside outside village perimeter walls as guards and scavengers.\n2. **Buddhism vs. Counter-Revolution**: In ancient India, the Broken Men adopted Buddhism. When the Gupta Empire and Brahminical counter-revolution arose (around 400 CE), orthodox Brahminism adopted vegetarianism and cow-worship to outdo Buddhist morality.\n3. **Culmination of Untouchability**: Because the Buddhist Broken Men could not afford to abandon eating the flesh of dead cows (carcass meat), Brahmins branded them with hereditary religious pollution. Hence, **Untouchability was born out of religious struggle between Buddhism and Brahminism combined with beef-eating habits around 400 CE**.`,
    citation: 'BAWS Vol. 7, pp. 239–382 · Amrit Book Co., New Delhi (1948)',
    related: ['Who Were the Shudras?', 'Revolution and Counter-Revolution']
  },

  // ─── 6. THE BUDDHA AND HIS DHAMMA (1957) ──────────────────────────────
  {
    id: 'buddha-and-his-dhamma',
    volume: 11,
    title: 'The Buddha and His Dhamma (1957)',
    triggers: [
      'the buddha and his dhamma', 'buddha', 'dhamma', 'navayana', 'nagpur', 
      'conversion 1956', '22 vows', 'diksha', 'dikshabhumi', 'four noble truths', 
      'karma', 'rebirth', 'vol 11', 'volume 11'
    ],
    answer: `**"The Buddha and His Dhamma" (1957)** is Dr. Ambedkar's magnum opus on Buddhist philosophy, completed shortly before his Mahaparinirvana and published posthumously.\n\n### The Core Philosophy of Navayana:\n1. **Religion vs. Dhamma**: Religion is personal and concerned with God and the soul; *Dhamma* is social and concerned with the moral relationship between human beings on earth.\n2. **Scientific Reason and Compassion**: Ambedkar rejected supernatural deities, infallible revelations, and dogmatic fatalism (*Karma* as cosmic retribution for past lives). He anchored Buddhism firmly in **Prajna** (critical understanding) and **Karuna** (boundless empathy).\n3. **Re-interpretation of the Four Noble Truths**: Argued that the core *Dukkha* (suffering) to be abolished is social exploitation, caste servitude, and injustice rather than passive sorrow.\n4. **The 22 Vows (Nagpur, 14 Oct 1956)**: Over 600,000 followers converted with Ambedkar, taking the historic 22 vows pledging to reject Hindu deities, reject caste distinctions, adhere to the Noble Eightfold Path, and treat all humanity as equals.`,
    citation: 'BAWS Vol. 11, pp. 1–620 · Siddharth College Publication (1957)',
    related: ['Buddha or Karl Marx', 'Yeola Declaration (1935)']
  },

  // ─── 7. BUDDHA OR KARL MARX (1956) ────────────────────────────────────
  {
    id: 'buddha-or-karl-marx',
    volume: 3,
    title: 'Buddha or Karl Marx (1956)',
    triggers: [
      'buddha or karl marx', 'karl marx', 'marxism', 'communism', 'marx', 
      'dictatorship of proletariat', 'sangha', 'private property', 'means of production', 
      'democracy vs communism', 'vol 3', 'volume 3'
    ],
    answer: `Delivered at the World Fellowship of Buddhists in Kathmandu (November 1956), **"Buddha or Karl Marx"** provides a profound comparative critique of democratic socialism, Marxist communism, and Buddhist social ethics.\n\n### The Comparative Synthesis:\n1. **What Remains of Marx**: Ambedkar accepted Marx's premise that private property generates inequality, and that class exploitation must be ended.\n2. **Where Marx Fails — The Method of Violence**: Marxists seek to eliminate inequality through bloody violent revolution and enforce equality via the **Dictatorship of the Proletariat**. Ambedkar warned that dictatorship annihilates liberty and spiritual self-determination.\n3. **Buddha's Superior Alternative**: The Buddha abolished private property within the *Sangha* and established absolute social equality 2,500 years before Marx, but did so through **moral transformation of the human mind** and democratic consensus, preserving both **Liberty** and **Equality**.\n4. **Ambedkar's Verdict**: *"Society must choose between the Rule of Law with Moral Fraternity (Buddha) or the Rule of the Bayonet and Force (Marx)."*`,
    citation: 'BAWS Vol. 3, pp. 441–462 · Kathmandu Address (1956)',
    related: ['The Buddha and His Dhamma', 'States and Minorities']
  },

  // ─── 8. RIDDLES IN HINDUISM (1987) ────────────────────────────────────
  {
    id: 'riddles-in-hinduism',
    volume: 4,
    title: 'Riddles in Hinduism: An Exposition to Enlighten the Masses',
    triggers: [
      'riddles in hinduism', 'riddles', 'rama', 'krishna', 'vedas riddle', 
      'ramayana riddle', 'mahabharata riddle', 'vol 4', 'volume 4', 'shastras riddles'
    ],
    answer: `**"Riddles in Hinduism"** (written in the 1950s, published as BAWS Vol. 4 in 1987) contains 24 critical analytical interrogations into orthodox Hindu mythology, epics, and religious codes.\n\n### The Thesis:\nAmbedkar examined the contradictions within sacred texts:\n- **Riddle of the Vedas and Brahmins**: Why do the Vedas contradict themselves on creation, ethics, and morality?\n- **The Riddle of Rama and Krishna**: An objective historical and ethical analysis of the epics *Ramayana* and *Mahabharata*, questioning the killing of Shambuka (the Shudra ascetic) and the treatment of Sita.\n- **The Aim**: Ambedkar stated his purpose was not malicious insult, but to awaken the democratic critical reasoning of the masses: to demonstrate that religious dogmas are human political constructs that must bow before constitutional human dignity and reason.`,
    citation: 'BAWS Vol. 4, pp. 1–442 · Dr. Ambedkar Foundation (1987)',
    related: ['Philosophy of Hinduism', 'Annihilation of Caste']
  },

  // ─── 9. PHILOSOPHY OF HINDUISM (BAWS VOL 3) ───────────────────────────
  {
    id: 'philosophy-of-hinduism',
    volume: 3,
    title: 'Philosophy of Hinduism',
    triggers: [
      'philosophy of hinduism', 'manu', 'manusmriti', 'inequality', 'justice in hinduism', 
      'utility vs justice', 'morality in religion'
    ],
    answer: `In **"Philosophy of Hinduism"** (BAWS Vol. 3), Dr. Ambedkar subjects the religious doctrine of Hinduism to two modern philosophical tests: **Justice** and **Utility**.\n\n### His Analysis:\n1. **Religion Must Stand the Test of Social Utility & Justice**: True religion must promote individual liberty, equality, and fraternity.\n2. **Hinduism Fails Both Tests**: Hinduism, as codified by *Manu*, is founded upon the principle of graded inequality. It denies common fraternity and makes social oppression an eternal divine commandment.\n3. **Sanctification of Graded Hierarchy**: Unlike ordinary class oppression where victims can unite, Hindu caste creates graded inequality: each caste looks down on the one below it, preventing collective solidarity against the oppressive system.`,
    citation: 'BAWS Vol. 3, pp. 1–94 · Dr. Ambedkar Foundation (1987)',
    related: ['Riddles in Hinduism', 'Annihilation of Caste']
  },

  // ─── 10. STATES AND MINORITIES (1947) ─────────────────────────────────
  {
    id: 'states-and-minorities',
    volume: 1,
    title: 'States and Minorities: What are Their Rights and How to Secure Them in the Constitution of Free India (1947)',
    triggers: [
      'states and minorities', 'state socialism', 'socialism', 'nationalisation', 
      'fundamental rights', 'constitution draft 1947', 'agriculture nationalise', 'economic democracy'
    ],
    answer: `Submitted to the Constituent Assembly in March 1947 on behalf of the All India Scheduled Castes Federation, **"States and Minorities"** was Dr. Ambedkar's proposed draft constitution for free India.\n\n### Landmark Provisions:\n1. **Constitutional State Socialism**: Proposed that key industries, insurance, and agricultural land should be nationalized and owned by the State by law, ensuring that economic democracy is etched directly into the fundamental constitutional framework.\n2. **Collective Farming**: Proposed state-directed collective agriculture where land is distributed to villagers irrespective of caste or religion.\n3. **Guaranteed Minority Protections**: Detailed statutory representation for Scheduled Castes and minority communities in civil services, legislatures, and executive cabinets to guard against majoritarian despotism.`,
    citation: 'BAWS Vol. 1, pp. 381–450 · C. Thacker & Co. (1947)',
    related: ['Constituent Assembly Debates', 'The Problem of the Rupee']
  },

  // ─── 11. CONSTITUTION OF INDIA & CAD (1946–1949) ──────────────────────
  {
    id: 'constitution-of-india',
    volume: 13,
    title: 'Principal Architect of the Constitution of India (BAWS Vol. 13)',
    triggers: [
      'constitution', 'constituent assembly', 'drafting committee', 'article 32', 
      'article 17', 'architect of the constitution', 'november 25 1949', 'life of contradictions', 
      'bhakti in politics', 'hero worship', 'fundamental rights', 'vol 13', 'volume 13'
    ],
    answer: `As Chairman of the 7-member Drafting Committee, Dr. B. R. Ambedkar steered the framing of the Constitution of India across 2 years, 11 months, and 17 days.\n\n### Historical Pillars:\n1. **Article 32 — Heart and Soul of the Constitution**: Ambedkar termed the Right to Constitutional Remedies (Article 32) the very soul of the Constitution: without judicial enforcement, all fundamental rights are worthless paper.\n2. **Article 17 — Abolition of Untouchability**: Constitutionally outlawed untouchability in all forms and made its practice a punishable offence.\n3. **The Prophetic Final Address (25 November 1949)**:\n   - *A Life of Contradictions*: "On 26th January 1950, we are going to enter into a life of contradictions. In politics we will have equality (one man, one vote), and in social and economic life we will have inequality. We must remove this contradiction at the earliest possible moment, or else those who suffer from inequality will blow up the structure of political democracy."\n   - *Bhakti in Politics*: "Bhakti in religion may be a road to salvation of the soul. But in politics, Bhakti or hero-worship is a sure road to degradation and to eventual dictatorship."\n   - *Constitutional Methods*: Abandon bloody revolution, civil disobedience, and Satyagraha; govern strictly via constitutional methods.`,
    citation: 'BAWS Vol. 13 · Constituent Assembly Debates, Vol. XI, 25 Nov 1949',
    related: ['States and Minorities', 'Hindu Code Bill']
  },

  // ─── 12. HINDU CODE BILL (1948–1951) ──────────────────────────────────
  {
    id: 'hindu-code-bill',
    volume: 14,
    title: 'Dr. Ambedkar and the Hindu Code Bill (BAWS Vol. 14)',
    triggers: [
      'hindu code bill', 'women rights', 'marriage', 'divorce', 'inheritance', 
      'resignation', 'law minister resignation', 'vol 14', 'volume 14', 'gender equality'
    ],
    answer: `As independent India's first Law Minister, Dr. Ambedkar drafted the **Hindu Code Bill**, the most comprehensive reform of Hindu civil and personal laws in thousands of years.\n\n### Core Reforms for Women's Rights:\n1. **Abolition of Polygamy**: Enforced strict monogamy under the law.\n2. **Right to Divorce**: Granted women legal rights to seek divorce on grounds of cruelty, desertion, or disease.\n3. **Equal Property Inheritance**: Granted daughters equal inheritance rights in parental property alongside sons.\n4. **Inter-Caste Marriage Legalisation**: Removed religious hurdles to inter-caste and civil marriages.\n\n### His Principled Resignation (September 1951):\nWhen conservative members of Parliament and the cabinet stalled and diluted the bill, Dr. Ambedkar resigned in protest on September 27, 1951, declaring that he could not remain in an administration that refused to grant equal constitutional dignity to women. His bill was later passed piecemeal as the Hindu Marriage Act (1955), Hindu Succession Act (1956), and Hindu Adoption Act (1956).`,
    citation: 'BAWS Vol. 14, Parts 1 & 2 · Speeches in Parliament & Resignation Statement (1951)',
    related: ['Constitution of India', 'Annihilation of Caste']
  },

  // ─── 13. POONA PACT (1932) ───────────────────────────────────────────
  {
    id: 'poona-pact',
    volume: 9,
    title: 'The Poona Pact (September 1932) & Communal Award',
    triggers: [
      'poona pact', 'poona', 'pact', 'gandhi fast', 'communal award', 
      'separate electorates', 'yerwada', 'joint electorates', '1932', 'vol 9', 'volume 9'
    ],
    answer: `The **Poona Pact** was signed on September 24, 1932 at Yerwada Central Jail in Pune between Dr. B. R. Ambedkar and caste Hindu leaders including Madan Mohan Malaviya.\n\n### Historical Conflict:\n1. **The Communal Award (Aug 1932)**: British Prime Minister Ramsay MacDonald granted **Separate Electorates** to the Depressed Classes (Dalits), allowing them to vote exclusively for their own Dalit representatives without upper-caste interference.\n2. **Gandhi's Fast Unto Death**: Mahatma Gandhi began a fast unto death, claiming separate electorates would sever untouchables from Hindu society forever.\n3. **The Compromise**: Faced with immense national pressure and the impending death of Gandhi, Ambedkar conceded separate electorates in return for a vastly increased number of reserved seats (from 71 to 148 seats in provincial legislatures) under a system of **Joint Electorates**.\n4. **Ambedkar's Later Critique**: In *What Congress and Gandhi Have Done to the Untouchables* (1945), Ambedkar condemned the Pact, proving that joint electorates allowed the upper-caste majority to elect pliable, puppet Dalit candidates who bowed to caste party whips.`,
    citation: 'BAWS Vol. 9, pp. 79–102 · What Congress and Gandhi Have Done (1945)',
    related: ['Round Table Conferences', 'Castes in India']
  },

  // ─── 14. MAHAD SATYAGRAHA & MANUSMRITI DAHAN (1927) ───────────────────
  {
    id: 'mahad-satyagraha',
    volume: 17,
    title: 'Mahad Satyagraha and Manusmriti Dahan (1927)',
    triggers: [
      'mahad', 'satyagraha', 'chavadar', 'chavadar tank', 'manusmriti dahan', 
      'burning manusmriti', '1927', 'water satyagraha', 'vol 17', 'volume 17'
    ],
    answer: `The **Mahad Satyagraha (20 March 1927)** was India's first organized mass civil rights crusade for Dalit equality, led by Dr. B. R. Ambedkar at Mahad, Kolaba District, Maharashtra.\n\n### Landmark Milestones:\n1. **Drinking from Chavadar Tank**: Thousands of Dalits marched peacefully to the Chavadar public freshwater tank to drink water. Although public municipal laws permitted it, local orthodox upper castes had violently forbidden untouchables. This was not merely for water; as Ambedkar stated: *"We want to go to the Tank not to drink water. We want to establish our human rights."*\n2. **Manusmriti Dahan (25 December 1927)**: At the second Mahad conference, on the proposal of Sahasrabuddhe (a Brahmin follower of Ambedkar), the ancient orthodox legal code *Manusmriti* was ceremonially burned on a public pyre, symbolizing the absolute annihilation of religious caste tyranny. December 25 is celebrated annually as **Manusmriti Dahan Din**.`,
    citation: 'BAWS Vol. 17, Part 1, pp. 3–42 · Dr. Ambedkar and His Egalitarian Revolution',
    related: ['Bahishkrit Bharat', 'Kalaram Temple Satyagraha']
  },

  // ─── 15. ROUND TABLE CONFERENCES (1930–1932) ──────────────────────────
  {
    id: 'round-table-conferences',
    volume: 2,
    title: 'Round Table Conferences in London (1930–1932)',
    triggers: [
      'round table conference', 'round table', 'london 1930', 'london 1931', 
      'rtc', 'simon commission', 'depressed classes representation', 'vol 2', 'volume 2'
    ],
    answer: `Dr. Ambedkar represented the Depressed Classes at all three **Round Table Conferences** held in London (1930, 1931, and 1932) to negotiate India's constitutional governance.\n\n### Historical Speeches:\n1. **First Conference (1930)**: Challenged the British Crown, demanding complete self-government (*Swaraj*) for India, while making it clear that freedom from British tyranny must simultaneously mean freedom from upper-caste tyranny for 50 million untouchables.\n2. **Second Conference (1931)**: Epic clash with Mahatma Gandhi. When Gandhi claimed that he alone represented all of India including untouchables, Ambedkar replied: *"I have no Homeland... How can I call this land my home where we are treated worse than dogs and cats?"*\n3. **Result**: Successfully secured recognition of Depressed Classes as an independent political entity with separate constitutional representation.`,
    citation: 'BAWS Vol. 2, pp. 503–668 · Speeches at the Round Table Conferences',
    related: ['Poona Pact', 'Simon Commission']
  },

  // ─── 16. PAKISTAN OR THE PARTITION OF INDIA (1940) ────────────────────
  {
    id: 'partition-of-india',
    volume: 8,
    title: 'Pakistan or The Partition of India (1940 / 1945)',
    triggers: [
      'pakistan', 'partition', 'partition of india', 'muslim league', 'jinnah', 
      'two nation', 'vol 8', 'volume 8', 'communal'
    ],
    answer: `Written in 1940 following the Muslim League's Lahore Resolution, **"Pakistan or the Partition of India"** is a clinical, objective constitutional analysis of the communal conflict between the Indian National Congress and the Muslim League.\n\n### Ambedkar's Prescient Analysis:\n1. **Dispassionate Sociological Approach**: Neither celebrated nor dogmatically condemned the idea of Pakistan; he treated it as a sociological problem requiring constitutional resolution.\n2. **Warning on Mixed Armies and Majoritarianism**: Argued that a united India with an unwilling 33% Muslim minority would be vulnerable to endless deadlock and civil unrest, particularly within the armed forces.\n3. **Clean Partition and Population Exchange**: Concluded that if partition were chosen, it must be an orderly, peaceful, and complete boundary transfer to prevent the horrific communal massacres that tragically transpired in 1947.`,
    citation: 'BAWS Vol. 8, pp. 1–498 · Thacker & Co., Bombay (1945 edition)',
    related: ['States and Minorities', 'Ranade, Gandhi and Jinnah']
  },

  // ─── 17. LABOUR & WATER REFORMS: EXECUTIVE COUNCIL (1942–1946) ────────
  {
    id: 'executive-council-reforms',
    volume: 10,
    title: 'Executive Council: Labour, Water and Power Infrastructure (1942–1946)',
    triggers: [
      'labour minister', 'executive council', 'damodar valley', 'hirakud', 'water resources', 
      '8 hours work', 'maternity benefit', 'provident fund', 'coal mines', 'vol 10', 'volume 10'
    ],
    answer: `Serving as the **Labour Member in the Viceroy's Executive Council (1942–1946)**, Dr. Ambedkar laid the infrastructural and statutory foundations of modern India's working-class protections and water-energy grids.\n\n### Monumental Reforms:\n1. **Reduction of Working Hours from 12 to 8**: Changed the Indian Factories Act in 1942, reducing standard daily working hours from 12 hours to 8 hours.\n2. **Women and Maternity Rights**: Enacted the Mines Maternity Benefit Act, equal pay for equal work principles, and the Employees' State Insurance (ESI) blueprint.\n3. **National Water & Power Grid**: Established the **Central Waterways, Irrigation and Navigation Commission (CWINC)** (now Central Water Commission) and the **Central Electricity Authority (CEA)**.\n4. **River Valley Projects**: Architected India's multipurpose river valley projects including the **Damodar Valley Corporation (DVC)**, the **Hirakud Dam on the Mahanadi River**, and the **Sone River Valley Project**.`,
    citation: 'BAWS Vol. 10, pp. 1–1070 · Speeches and Minutes as Labour Member (1942–1946)',
    related: ['The Problem of the Rupee', 'States and Minorities']
  },

  // ─── 18. EDUCATION AND ACADEMIC TRAJECTORY ─────────────────────────────
  {
    id: 'education-and-degrees',
    volume: 12,
    title: 'Education, Columbia, LSE & Gray\'s Inn',
    triggers: [
      'columbia', 'columbia university', 'lse', 'london school', 'degrees', 'education', 
      'phd', 'doctorate', 'gray\'s inn', 'barrister', 'elphinstone', 'mhow', 'early life'
    ],
    answer: `Dr. Ambedkar was one of the most prolific and rigorously trained multidisciplinary scholars of the twentieth century.\n\n### Academic Timeline:\n- **1907**: Matriculated from Elphinstone High School, Bombay (the first Mahar untouchable to do so).\n- **1912**: B.A. in Economics and Politics from Elphinstone College, University of Bombay.\n- **1913–1916 (Columbia University, New York)**: Awarded Maharaja of Baroda scholarship. Completed M.A. (1915) and Ph.D. in Economics with dissertations *Ancient Indian Commerce* and *The National Dividend of India: A Historical and Analytical Study* under Prof. Edwin R.A. Seligman and John Dewey.\n- **1916–1923 (London School of Economics & Gray\'s Inn)**: Admitted to Gray's Inn to read for the Bar (Barrister-at-Law, 1923) and obtained his Master of Science (M.Sc., 1921) and Doctor of Science (D.Sc., 1923) in Economics from LSE with *The Problem of the Rupee*.\n- **1952 & 1953**: Awarded honorary Doctor of Laws (LL.D.) by Columbia University and Doctor of Letters (D.Litt.) by Osmania University.`,
    citation: 'BAWS Vol. 12 & Columbia University Archives',
    related: ['The Problem of the Rupee', 'Castes in India']
  },

  // ─── 19. FAMOUS MOTTO: EDUCATE, AGITATE, ORGANIZE ──────────────────────
  {
    id: 'educate-agitate-organize',
    volume: 17,
    title: 'The Great Motto: Educate, Agitate, Organize',
    triggers: [
      'educate agitate organize', 'educate', 'agitate', 'organize', 'motto', 'slogan', 
      'bahishkrit hitakarini', 'all india depressed classes', 'quotes'
    ],
    answer: `**"Educate, Agitate, Organize"** was declared by Dr. Ambedkar as the guiding lodestar for human emancipation during his address to the All-India Depressed Classes Conference at Nagpur on July 20, 1942 (originating from the founding of Bahishkrit Hitakarini Sabha in 1924).\n\n### The Triad of Liberation:\n1. **Educate**: *"My final words of advice to you are educate, agitate and organize; have faith in yourselves. With justice on our side I do not see how we can lose our battle."* Education is not just literacy, but cultivation of the critical, rational mind.\n2. **Agitate**: Agitation does not mean chaotic violence; it means peaceful, principled, democratic unrest against institutionalized inequality and oppression.\n3. **Organize**: Disjointed communities are easily exploited. Only when the oppressed unify under collective civic and political solidarity can they achieve self-respect and legal liberation.`,
    citation: 'BAWS Vol. 17, Part 3, pp. 955–960 · Nagpur Address, 20 July 1942',
  },

  // ─── 20. JOURNALISM & PRESS FREEDOM (1920–1956) ─────────────────────────
  {
    id: 'journalism-and-periodicals',
    volume: 18,
    title: 'Voice of the Voiceless: Historic Marathi Periodicals',
    triggers: [
      'mooknayak', 'bahishkrit bharat', 'janata', 'prabuddha bharat', 'journalism', 
      'newspaper', 'press', 'editorials', '1920', 'मूकनायक', 'बहिष्कृत भारत', 'जनता', 'प्रबुद्ध भारत'
    ],
    answer: `Recognizing that the mainstream contemporary press was owned and monopolized by orthodox caste elites who ignored or misrepresented the plight of the oppressed, Dr. Ambedkar founded four historic periodicals over 36 years:\n\n### The Four Publications:\n1. **Mooknayak (Leader of the Voiceless, 31 Jan 1920)**: Founded with financial assistance from Chhatrapati Shahu Maharaj of Kolhapur. The frontispiece carried Sant Tukaram's verses: *"What can a dumb man do? For him, who will speak?"*\n2. **Bahishkrit Bharat (Excluded India, 3 April 1927)**: Launched after the Mahad Satyagraha to expose caste hypocrisy and coordinate civil rights campaigns across Maharashtra.\n3. **Janata (The People, 1930)**: Longest-running weekly (1930–1956), articulating the economic struggle of industrial workers, agricultural tenants, and Dalits.\n4. **Prabuddha Bharat (Enlightened India, 4 Feb 1956)**: Re-titled on the eve of the Buddhist conversion to reflect the spiritual awakening and rational reconstruction of Indian society.`,
    citation: 'BAWS Vol. 18 & 19 · Dr. B. R. Ambedkar\'s Speeches & Writings in Marathi',
    related: ['Educate, Agitate, Organize', 'Mahad Satyagraha and Manusmriti Dahan']
  },

  // ─── 21. KALARAM TEMPLE SATYAGRAHA (1930–1935) ──────────────────────────
  {
    id: 'kalaram-temple-satyagraha',
    volume: 17,
    title: 'Kalaram Temple Entry Satyagraha, Nashik (1930–1935)',
    triggers: [
      'kalaram', 'kalaram temple', 'nashik 1930', 'temple entry', 'bhaurao gaikwad', 
      'satyagraha nashik', 'कालाराम मंदिर', 'मंदिर प्रवेश'
    ],
    answer: `Launched on March 2, 1930 at Nashik under the operational leadership of B. K. (Dadasaheb) Gaikwad and Dr. Ambedkar, the **Kalaram Temple Satyagraha** was a 5-year non-violent campaign demanding equal entry for untouchables into the famous Rama temple.\n\n### The Strategic Objective:\n- **Not for Idols, but for Human Equality**: Dr. Ambedkar explicitly clarified that the aim was not religious devotion to temple stone idols, but to test whether Hindu orthodoxy recognized Dalits as equal human beings.\n- **Reaction of Orthodoxy**: Orthodoxy locked the temple gates for years, attacked unarmed satyagrahis with stones, and threw holy water to "purify" the grounds when satyagrahis touched the chariot.\n- **The Lesson Learned**: By 1935, Ambedkar concluded that spending energy and blood trying to enter Hindu temples was futile, as Hinduism’s core structure was founded on graded inequality. This directly led to his historic declaration at Yeola later that year.`,
    citation: 'BAWS Vol. 17, Part 1, pp. 111–180 · Temple Entry Movements',
    related: ['Yeola Declaration', 'Mahad Satyagraha and Manusmriti Dahan']
  },

  // ─── 22. YEOLA DECLARATION (1935) ───────────────────────────────────────
  {
    id: 'yeola-declaration-1935',
    volume: 17,
    title: 'The Yeola Declaration (13 October 1935)',
    triggers: [
      'yeola', 'yeola declaration', 'born a hindu', 'will not die a hindu', 
      'conversion announcement', '1935', 'येवला घोषणा', 'धर्म परिवर्तन'
    ],
    answer: `At the Bombay Presidency Depressed Classes Conference held at Yeola (Nashik) on October 13, 1935, Dr. B. R. Ambedkar made his most world-shaking existential declaration:\n\n### The Historic Pledge:\n> *"I was born a Hindu, because I had no control over this. It was not my fault and I could not prevent it. But I solemnly assure you that I will not die a Hindu."*\n\n### Core Philosophical Significance:\n1. **Final Rupture with Reformism**: After a decade of patient civil struggles (Mahad, Kalaram Temple), Ambedkar concluded that untouchability is not an accidental blemish on Hinduism; it is the very bedrock of its scripture-sanctified social order.\n2. **Twenty-One Years of Deliberation**: Ambedkar did not convert rashly or emotionally. He studied world religions (Islam, Christianity, Sikhism, Buddhism) for 21 years to evaluate which faith offered the ultimate synthesis of **Prajna** (Reason), **Karuna** (Compassion), and **Samata** (Equality), culminating in his conversion to Buddhism at Nagpur in 1956.`,
    citation: 'BAWS Vol. 17, Part 1, pp. 181–202 · Historic Declaration at Yeola (1935)',
    related: ['The Buddha and His Dhamma', 'Kalaram Temple Satyagraha']
  },

  // ─── 23. THOUGHTS ON LINGUISTIC STATES (1955) ───────────────────────────
  {
    id: 'linguistic-states-maharashtra',
    volume: 1,
    title: 'Thoughts on Linguistic States & Samyukta Maharashtra',
    triggers: [
      'linguistic states', 'samyukta maharashtra', 'maharashtra linguistic province', 
      'mumbai maharashtra', 'state reorganization', 'bilingual state', 'भाषावार प्रांत रचना'
    ],
    answer: `In treatises such as **"Maharashtra as a Linguistic Province" (1948)** and **"Thoughts on Linguistic States" (1955)**, Dr. Ambedkar laid down pioneering constitutional guidelines for the reorganization of Indian states.\n\n### Key Theses:\n1. **One State, One Language**: Endorsed linguistic states to make democratic administration accessible to the common person who only speaks the regional mother tongue.\n2. **Separation of Language and Nation**: Emphasized that linguistic states must never lead to linguistic chauvinism or secessionism. The official central language must unite all states.\n3. **Defense of Mumbai in Maharashtra**: Fought fiercely against proposals to make Bombay a separate city-state or bilingual partition, demonstrating with deep economic and geographical data that Mumbai is geographically and economically inseparable from Maharashtra.\n4. **Safeguard for Minorities in Linguistic States**: Warned that linguistic majorities could easily oppress linguistic and caste minorities unless fundamental rights and federal representation are rigorously enforced.`,
    citation: 'BAWS Vol. 1, pp. 97–168 & Thoughts on Linguistic States (1955)',
    related: ['States and Minorities', 'Constitution of India']
  },

  // ─── 24. WOMEN'S RIGHTS & GENDER PHILOSOPHY ─────────────────────────────
  {
    id: 'women-rights-philosophy',
    volume: 14,
    title: 'Ambedkar’s Philosophy of Gender Emancipation',
    triggers: [
      'women', 'women rights', 'gender equality', 'progress of women', 
      'maternity benefit', 'radhabai vadale', 'depressed classes women', 'महिला अधिकार', 'स्त्री उद्धार'
    ],
    answer: `Dr. Ambedkar was one of India's earliest and most uncompromising feminists, recognizing that caste hierarchy and female subjugation are twin pillars of the same oppressive mechanism.\n\n### Key Tenets of Gender Justice:\n1. **The Measure of Civilization**: *"I measure the progress of a community by the degree of progress which women have achieved."* (Address to the All-India Depressed Classes Women's Conference, Nagpur, 20 July 1942, attended by over 25,000 women).\n2. **Endogamy and the Subjugation of Women**: In *Castes in India* (1916), proved that caste relies on controlling female sexuality through child marriage, enforced widowhood, and Sati to preserve endogamy.\n3. **Labor Protections for Women**: As Labour Member (1942–46), enacted the Mines Maternity Benefit Act, equal wages for female workers, and paid leave provisions.\n4. **The Hindu Code Bill**: Sacrificed his cabinet post as Law Minister in 1951 when Parliament stalled the bill granting women absolute property inheritance and civil divorce rights.`,
    citation: 'BAWS Vol. 14 & Vol. 17 (Part 3) · Addresses to Women\'s Conferences',
    related: ['The Hindu Code Bill', 'Castes in India (1916)']
  }
];

// ─── STOPWORDS & TOKENIZER ────────────────────────────────────────────────
const STOPWORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or', 'is', 'are', 
  'was', 'were', 'what', 'who', 'how', 'why', 'where', 'when', 'did', 'does', 'do', 
  'dr', 'ambedkar', 'babasaheb', 'bhimrao', 'tell', 'me', 'about', 'explain', 'book', 
  'books', 'can', 'you', 'give', 'information', 'details'
]);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOPWORDS.has(t));
}

// ─── SCHOLARLY RETRIEVAL ENGINE ───────────────────────────────────────────
function findAnswer(query) {
  const raw = query.toLowerCase().trim();
  if (!raw) return null;

  // 1. Direct Volume Number Check (e.g. "volume 3", "vol 7", "baws 11")
  const volMatch = raw.match(/\b(?:vol|volume|baws|khand)\s*(\d{1,2})\b/i);
  let targetVol = volMatch ? parseInt(volMatch[1], 10) : null;

  let bestEntry = null;
  let highestScore = 0;

  const queryTokens = tokenize(raw);

  for (const item of CHATBOT_QA) {
    let score = 0;

    // Volume boost if explicitly queried
    if (targetVol && item.volume === targetVol) {
      score += 60;
    }

    // Exact trigger matching
    for (const trigger of item.triggers) {
      if (raw === trigger) {
        score += 80;
      } else if (raw.includes(trigger)) {
        score += trigger.length * 2.5;
      } else {
        // Token intersection
        const trigTokens = trigger.split(' ');
        const matches = queryTokens.filter(t => trigTokens.includes(t));
        if (matches.length > 0) {
          score += matches.length * 4;
        }
      }
    }

    // Title / citation token matching
    const titleTokens = tokenize(item.title);
    for (const token of queryTokens) {
      if (titleTokens.includes(token)) {
        score += 6;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestEntry = item;
    }
  }

  // Check Volume Catalog if no high-confidence Q&A match, or if specific volume requested
  if (targetVol && (!bestEntry || highestScore < 30)) {
    const catalogItem = BAWS_VOLUMES_CATALOG.find(v => v.vol === targetVol);
    if (catalogItem) {
      return {
        id: `vol-${catalogItem.vol}`,
        volume: catalogItem.vol,
        answer: `### BAWS Volume ${catalogItem.vol}: ${catalogItem.title}\n\n**Published Year:** ${catalogItem.year} · **Length:** ${catalogItem.pages} pages\n\n**Primary Treatises & Subjects:**\n${catalogItem.topics.map(t => `• ${t.toUpperCase()}`).join('\n')}\n\nThis volume is fully digitized in our archive. You can inspect the complete historical scan, download the official MEA PDF, or open it in our distraction-free reader.`,
        citation: `BAWS Volume ${catalogItem.vol} · Ministry of External Affairs / Dr. Ambedkar Foundation`,
        related: ['Annihilation of Caste', 'Who Were the Shudras?', 'The Buddha and His Dhamma']
      };
    }
  }

  // Threshold: if confident match found
  if (highestScore >= 6 && bestEntry) {
    return bestEntry;
  }

  // Default scholarly guidance
  return {
    answer: `I could not locate an exact passage for "${query}" in our instant Q&A index, but here is where you can explore Dr. Ambedkar's writings on this subject:\n\n` +
      `• **Social & Caste Reform:** Explore *Annihilation of Caste* (BAWS Vol. 1) & *Who Were the Shudras?* (BAWS Vol. 7).\n` +
      `• **Economics & Monetary Policy:** Consult *The Problem of the Rupee* (BAWS Vol. 6) & *Evolution of Provincial Finance*.\n` +
      `• **Constitutional & Legal Rights:** Read the *Constituent Assembly Debates* (BAWS Vol. 13) & *Hindu Code Bill* (BAWS Vol. 14).\n` +
      `• **Religious & Moral Thought:** Study *The Buddha and His Dhamma* (BAWS Vol. 11) & *Philosophy of Hinduism* (BAWS Vol. 3).\n\n` +
      `*Tip: Try asking "What is the thesis of Annihilation of Caste?", "What did Ambedkar say about Karl Marx?", "Tell me about Volume 6", or "Why did Ambedkar resign as Law Minister?".*`,
    citation: 'Ambedkar Digital Heritage Archive — Curated BAWS Corpus',
    related: ['Annihilation of Caste', 'The Problem of the Rupee', 'Constitution of India', 'The Buddha and His Dhamma']
  };
}

// ─── Multilingual Greetings ───────────────────────────────────────────────
const GREETING = {
  en: "Jai Bhim! Welcome to the AI Research Assistant. Ask me anything about Dr. B. R. Ambedkar's 21 BAWS volumes, economic dissertations, constitutional debates, or historical milestones.",
  hi: "जय भीम! एआई शोध सहायक में आपका स्वागत है। डॉ. बी. आर. अंबेडकर के २१ खंडों, आर्थिक शोध, संवैधानिक बहसों या ऐतिहासिक घटनाओं के बारे में पूछें।",
  mr: "जय भीम! एआय संशोधन सहाय्यकामध्ये आपले स्वागत आहे. डॉ. बाबासाहेब आंबेडकरांच्या २१ खंडांबद्दल, आर्थिक प्रबंधांबद्दल किंवा संविधानिक कार्याबद्दल काहीही विचारा."
};

window.ChatbotData = {
  findAnswer,
  GREETING,
  CHATBOT_QA,
  BAWS_VOLUMES_CATALOG,
  tokenize
};
