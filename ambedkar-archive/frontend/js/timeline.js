/**
 * timeline.js — Interactive Chronological Milestone & Exact Book Reference Explorer
 * Double-bezel responsive alternating layout with deep historical context and direct reader jumping.
 */

const TIMELINE_EVENTS = [
  {
    year: 1891,
    icon: '🌟',
    title: 'Birth in Mhow',
    exactDate: 'April 14, 1891',
    location: 'Mhow (now Dr. Ambedkar Nagar), Central Provinces',
    desc: 'Bhimrao Ramji Ambedkar was born into the Mahar community to Subedar Ramji Maloji Sakpal and Bhimabai Sakpal. As the 14th child, his childhood exposed him to institutional untouchability.',
    detail: 'Born into an impoverished untouchable military family in the British garrison town of Mhow. His father was a teacher and Subedar in the British Indian Army. Despite acute caste humiliation in schools where untouchable students had to sit outside on gunny sacks and were denied water without peons pouring it from a distance, young Bhimrao persevered with exceptional academic discipline.',
    quote: 'Cultivation of mind should be the ultimate aim of human existence.',
    category: 'education',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part I): Dr. B. R. Ambedkar and His Egalitarian Revolution',
      chapter: 'Waiting for a Visa: Autobiographical Reminiscences of Childhood Humiliations (pp. 661–691)'
    }
  },
  {
    year: 1907,
    icon: '📚',
    title: 'Matriculation Triumph',
    exactDate: '1907',
    location: 'Elphinstone High School, Bombay',
    desc: 'Passed the matriculation examination from Government High School, Bombay — an unprecedented milestone for an untouchable youth in that era.',
    detail: 'Passing matriculation was celebrated as a major historical breakthrough for depressed classes. At a public felicitation presided over by social reformer S. K. Bole, Marathi scholar K. A. Keluskar presented Bhimrao with a biography of Gautam Buddha, planting the intellectual seeds of his lifelong philosophical quest.',
    quote: 'Knowledge is the foundation of a man’s life and character.',
    category: 'education',
    featured: false,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part I): Biographical Chronicles and Early Formative Years',
      chapter: 'Early Awakening and Keluskar’s Gift of the Buddha Biography (pp. 705–715)'
    }
  },
  {
    year: 1912,
    icon: '🎓',
    title: 'B.A. from Bombay University',
    exactDate: '1912',
    location: 'Elphinstone College, Bombay',
    desc: 'Graduated with a degree in Economics and Political Science from Bombay University, funded by the Maharaja of Baroda.',
    detail: 'Supported by a monthly scholarship of Rs. 25 granted by the visionary Maharaja Sayajirao Gaekwad III of Baroda, Ambedkar completed his Bachelor of Arts. Under the terms of the agreement, he entered the service of the Baroda State administration after completing his degree.',
    quote: 'Men are mortal. So are ideas. An idea needs propagation as much as a plant needs watering.',
    category: 'education',
    featured: false,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part I): Academic Records and Baroda State Service',
      chapter: 'Educational Milestones and Service in the Baroda State Army and Finance Dept'
    }
  },
  {
    year: 1913,
    icon: '✈️',
    title: 'Arrival at Columbia University, New York',
    exactDate: 'July 1913',
    location: 'Columbia University, Morningside Heights, New York City',
    desc: 'Awarded Baroda scholarship for overseas studies. Studied under Prof. John Dewey, whose philosophy of democracy deeply shaped Ambedkar.',
    detail: 'Ambedkar arrived in New York to embark on advanced postgraduate studies. Living in Hartley Hall, he immersed himself in economics, sociology, and philosophy for 18 hours a day. Under American pragmatist John Dewey, he learned that democracy is not merely a political mechanism, but an ethical way of life based on social equality and continuous communicative association.',
    quote: 'Democracy is not merely a form of government; it is primarily a mode of associated living, of conjoint communicated experience.',
    category: 'education',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part III): Reminiscences of Columbia University',
      chapter: 'Letters from New York and Philosophical Studies under John Dewey'
    }
  },
  {
    year: 1915,
    icon: '🎓',
    title: 'M.A. in Economics from Columbia',
    exactDate: 'June 1915',
    location: 'Columbia University, New York',
    desc: 'Completed Master of Arts in Economics with a seminal dissertation on "Ancient Indian Commerce".',
    detail: 'Defended his Master of Arts thesis examining foreign trade, trade routes, merchandise, banking, and mercantile morality in ancient India. He combined economic history with archaeological and textual citations from the Arthashastra, Buddhist Jatakas, and Greek sources.',
    quote: 'Economics cannot be divorced from history and the sociological conditions of human labor.',
    category: 'education',
    featured: false,
    bookRef: {
      volNo: 12,
      docId: 'doc-en-12',
      volTitle: 'BAWS Vol. 12: Ancient Indian Commerce & Commercial Relations',
      chapter: 'Ancient Indian Commerce: Master of Arts Thesis (pp. 1–68)'
    }
  },
  {
    year: 1916,
    icon: '📄',
    title: '"Castes in India" — Columbia Seminar Paper',
    exactDate: 'May 9, 1916',
    location: 'Anthropology Seminar of Dr. Alexander Goldenweiser, Columbia University',
    desc: 'Presented his landmark paper defining caste through endogamy — his first major academic work on the mechanism of caste hierarchy.',
    detail: 'In this pathbreaking paper, Dr. Ambedkar dissected the caste system not as a natural outcome of racial or occupational division, but as the mechanical imposition of endogamy (in-group marriage) upon an originally exogamous society. He proved that orthodox priestly classes enclosed themselves first, forcing other classes to imitate this artificial isolation.',
    quote: 'Endogamy is the only characteristic that is peculiar to caste, and if we succeed in showing how endogamy is maintained, we shall have arrived at the solution of the problem of caste.',
    category: 'writing',
    featured: true,
    bookRef: {
      volNo: 1,
      docId: 'doc-en-1',
      volTitle: 'BAWS Vol. 1: Castes in India, Annihilation of Caste and Other Essays',
      chapter: 'Castes in India: Their Mechanism, Genesis and Development (pp. 3–22)'
    }
  },
  {
    year: 1916,
    icon: '⚖️',
    title: 'Admitted to Gray’s Inn & LSE, London',
    exactDate: 'October 1916',
    location: 'Gray’s Inn & London School of Economics, London, UK',
    desc: 'Enrolled to read for the Bar at Gray\'s Inn while pursuing doctoral studies in economics at the London School of Economics.',
    detail: 'Traveled from New York to London and gained admission to Gray’s Inn to qualify as a barrister-at-law, while simultaneously registering at LSE under Edwin Cannan. His research was interrupted in 1917 when the Baroda scholarship expired, but the LSE senate granted him special permission to resume within four years.',
    quote: 'My life is a battle against inequality. Education is the greatest weapon in that struggle.',
    category: 'education',
    featured: false,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part I): London Chronicles and Bar Examinations',
      chapter: 'Legal Studies at Gray’s Inn and Doctoral Research at London School of Economics'
    }
  },
  {
    year: 1919,
    icon: '🏛️',
    title: 'Evidence Before Southborough Committee',
    exactDate: 'January 27, 1919',
    location: 'Bombay',
    desc: 'Testified before the Southborough Franchise Committee, presenting the first comprehensive case for separate electorates for depressed classes.',
    detail: 'Submitted a rigorous constitutional statement proving that untouchables constituted a distinct and severed minority unable to rely on the goodwill of upper-caste majorities. He argued for universal adult franchise, communal representation, and reserved political power as the sole guarantees against structural bondage.',
    quote: 'The right of representation is the only true guarantee of liberty and equality for depressed classes.',
    category: 'politics',
    featured: false,
    bookRef: {
      volNo: 1,
      docId: 'doc-en-1',
      volTitle: 'BAWS Vol. 1: Evidence Before the Southborough Committee',
      chapter: 'Evidence Before the Southborough Franchise Committee (pp. 243–278)'
    }
  },
  {
    year: 1920,
    icon: '📰',
    title: 'Mooknayak Newspaper Founded',
    exactDate: 'January 31, 1920',
    location: 'Bombay',
    desc: 'Founded "Mooknayak" (Leader of the Voiceless), his first fortnightly newspaper championing social justice and political assertion.',
    detail: 'With financial aid of Rs. 2,500 from Chhatrapati Shahu Maharaj of Kolhapur, Ambedkar launched the Marathi paper Mooknayak. In the opening editorial, he famously compared Hindu society to a three-storeyed house without a staircase, where persons born on one floor are condemned to live and die on that floor without mobility.',
    quote: 'Indian society is like a multi-storeyed tower having no staircase and no entrance. Those born on a floor must die on that floor.',
    category: 'movement',
    featured: false,
    bookRef: {
      volNo: 19,
      docId: 'doc-en-19',
      volTitle: 'BAWS Vol. 19: Journalism of Dr. B. R. Ambedkar: Mooknayak',
      chapter: 'Mooknayak Inaugural Editorials & Articles (1920)'
    }
  },
  {
    year: 1923,
    icon: '💰',
    title: 'D.Sc. from LSE — "The Problem of the Rupee"',
    exactDate: 'March 1923',
    location: 'London School of Economics, London',
    desc: 'Awarded Doctor of Science in Economics for his magnum opus on the Indian rupee, directly influencing the creation of the Reserve Bank of India.',
    detail: 'Ambedkar completed his monumental doctoral thesis analyzing the monetary history of British India from 1800 to 1893. He challenged John Maynard Keynes’s advocacy of the gold exchange standard, demonstrating that it caused unchecked inflation and currency debasement. When the Hilton Young Royal Commission on Indian Currency convened in 1925, Ambedkar’s evidence was used as the blueprint for creating the Reserve Bank of India (RBI).',
    quote: 'Currency must have stability in its purchasing power. An unprincipled monetary system is a silent engine of exploitation.',
    category: 'education',
    featured: true,
    bookRef: {
      volNo: 6,
      docId: 'doc-en-6',
      volTitle: 'BAWS Vol. 6: Babasaheb’s Writings on Economics: The Problem of the Rupee',
      chapter: 'The Problem of the Rupee: Its Origin and Its Solution (pp. 167–384)'
    }
  },
  {
    year: 1924,
    icon: '✊',
    title: 'Bahishkrit Hitakarini Sabha Founded',
    exactDate: 'July 20, 1924',
    location: 'Damodar Hall, Parel, Bombay',
    desc: 'Founded the Outcastes Welfare Association in Bombay with the historic motto: "Educate, Agitate, Organize".',
    detail: 'Established to open hostels, reading rooms, schools, and cultural bodies for depressed classes. Ambedkar recognized that mere philanthropy was inadequate; the oppressed must develop self-reliance, moral discipline, and organized collective power to claim their human rights.',
    quote: 'Educate, Agitate, Organize; Have faith in yourselves.',
    category: 'movement',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part I): The Socio-Political Awakening',
      chapter: 'Constitution, Aims and Historic Resolutions of Bahishkrit Hitakarini Sabha'
    }
  },
  {
    year: 1927,
    icon: '💧',
    title: 'Mahad Satyagraha & Manusmriti Burning',
    exactDate: 'March 20 & December 25, 1927',
    location: 'Chavadar Tank, Mahad, Maharashtra',
    desc: 'Led thousands to drink water from the public Chavadar Tank, followed by the historic public burning of the Manusmriti on December 25.',
    detail: 'When Mahad municipality passed a resolution opening the Chavadar tank to all public, orthodox priests refused to permit untouchables to drink. Dr. Ambedkar led thousands of satyagrahis to the tank and drank water, inaugurating modern Dalit civil rights. When orthodox groups staged violent purification rituals, Ambedkar returned on December 25, 1927, and publicly burned the Manusmriti on a funeral pyre, declaring it a charter of spiritual slavery.',
    quote: 'We are not going to the Chavadar Tank merely to drink water. We are going to the tank to assert that we too are human beings like others.',
    category: 'movement',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part I): Mahad Satyagraha and Social Emancipation',
      chapter: 'The Mahad Satyagraha Conference Speeches & Historic Manusmriti Dahan'
    }
  },
  {
    year: 1930,
    icon: '🤝',
    title: 'First Round Table Conference, London',
    exactDate: 'November 12, 1930',
    location: 'House of Lords, London, UK',
    desc: 'Represented the Depressed Classes of India, demanding equal citizenship, fundamental rights, and political safeguards in free India.',
    detail: 'Speaking before British Prime Minister Ramsay MacDonald and Indian princes, Ambedkar stated that the bureaucratic British Raj had failed to liberate depressed classes from social tyrannies. He demanded self-government with mandatory statutory representation for the marginalized.',
    quote: 'We must have a government in which men in power will not be afraid to amend the social and economic code of life.',
    category: 'politics',
    featured: false,
    bookRef: {
      volNo: 2,
      docId: 'doc-en-2',
      volTitle: 'BAWS Vol. 2: Dr. Ambedkar in the Round Table Conferences',
      chapter: 'First Round Table Conference: Plenary Speeches & Sub-Committee Proceedings (pp. 503–530)'
    }
  },
  {
    year: 1931,
    icon: '🤝',
    title: 'Second Round Table Conference & Gandhi Debate',
    exactDate: 'Autumn 1931',
    location: 'St. James’s Palace, London',
    desc: 'Confronted Mahatma Gandhi on separate electorates, insisting that untouchables required statutory constitutional guarantees.',
    detail: 'When Gandhi insisted that the Congress represented all of India and refused separate political representation for untouchables, Ambedkar stood firm. He argued that political safeguards were a survival prerequisite for the depressed classes so they would not be crushed by an entrenched caste majority.',
    quote: 'I have no homeland, Mr. Gandhi... How can I call this land my home where we are treated worse than cats and dogs?',
    category: 'politics',
    featured: true,
    bookRef: {
      volNo: 2,
      docId: 'doc-en-2',
      volTitle: 'BAWS Vol. 2: Minorities Committee Proceedings',
      chapter: 'Debates with Gandhi and the Minorities Pact at the Second Round Table Conference (pp. 531–662)'
    }
  },
  {
    year: 1932,
    icon: '📜',
    title: 'The Poona Pact',
    exactDate: 'September 24, 1932',
    location: 'Yerwada Central Jail, Poona',
    desc: 'Signed the historic Poona Pact, relinquishing separate electorates in exchange for 148 reserved seats in provincial assemblies.',
    detail: 'When British Prime Minister MacDonald announced the Communal Award granting separate electorates to depressed classes, Gandhi undertook a fast unto death in Yerwada Jail. Faced with immense national panic and the threat of catastrophic retaliatory violence against Dalits if Gandhi died, Ambedkar negotiated the Poona Pact, securing 148 reserved seats (more than double the British award of 71).',
    quote: 'There was immense pressure on me, but I had to safeguard the political future of my people.',
    category: 'politics',
    featured: true,
    bookRef: {
      volNo: 9,
      docId: 'doc-en-9',
      volTitle: 'BAWS Vol. 9: What Congress and Gandhi Have Done to the Untouchables',
      chapter: 'Chapter III: The Poona Pact and Its Political Consequences (pp. 70–125)'
    }
  },
  {
    year: 1935,
    icon: '⚡',
    title: 'Yeola Declaration on Conversion',
    exactDate: 'October 13, 1935',
    location: 'Yeola, Nashik District, Maharashtra',
    desc: 'Declared spiritual liberation: "I was born a Hindu because I had no control over it, but I solemnly assure you I will not die a Hindu."',
    detail: 'Speaking to over 10,000 delegates at the Bombay Provincial Depressed Classes Conference in Yeola, Dr. Ambedkar announced that after 15 years of futile efforts to reform Hinduism from within through temple entry movements (like Kalaram), he was abandoning the fold of caste religion and would embrace a religion founded on liberty, equality, and fraternity.',
    quote: 'I was born a Hindu because I had no control over it, but I solemnly assure you I will not die a Hindu.',
    category: 'religion',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part III): Religious Awakening and Speeches',
      chapter: 'The Historic Yeola Conference and Declaration on Religious Conversion'
    }
  },
  {
    year: 1936,
    icon: '📖',
    title: 'Publication of "Annihilation of Caste"',
    exactDate: 'May 1936',
    location: 'Bombay',
    desc: 'Published his masterpiece on why caste cannot be reformed without dynamiting the theological sanctity of the scriptures.',
    detail: 'Prepared as a presidential address for the Jat-Pat-Todak Mandal in Lahore, the organizers demanded that Ambedkar remove his scathing philosophical critique of the Vedas and Smritis. Ambedkar refused to change a single comma, cancelled his address, and published the text privately. It has since become a global classic of political philosophy.',
    quote: 'You cannot build anything on the foundations of caste. You cannot build up a nation, you cannot build up a morality.',
    category: 'writing',
    featured: true,
    bookRef: {
      volNo: 1,
      docId: 'doc-en-1',
      volTitle: 'BAWS Vol. 1: Castes in India, Annihilation of Caste and Other Essays',
      chapter: 'Annihilation of Caste: With a Reply to Mahatma Gandhi (pp. 23–96)'
    }
  },
  {
    year: 1936,
    icon: '🏛️',
    title: 'Independent Labour Party Founded',
    exactDate: 'August 1936',
    location: 'Bombay',
    desc: 'Formed the Independent Labour Party (ILP) with an progressive socialist platform uniting industrial workers and rural landless laborers.',
    detail: 'Recognizing that untouchables were predominantly landless agricultural tenants and factory workers, Ambedkar formed the ILP. In the 1937 provincial elections, ILP scored a sensational victory, winning 14 out of 17 contested seats in the Bombay Legislative Assembly.',
    quote: 'The interests of labor and social democracy are inseparable.',
    category: 'politics',
    featured: false,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part II): Political Parties and Manifestos',
      chapter: 'Manifesto, Program and Legislative Victories of the Independent Labour Party'
    }
  },
  {
    year: 1942,
    icon: '⚒️',
    title: 'Member of Viceroy’s Executive Council (Labour)',
    exactDate: 'July 20, 1942 – June 1946',
    location: 'New Delhi',
    desc: 'Appointed Labour Member of India\'s wartime government, pioneering the 8-hour workday, maternity benefits, and national power grids.',
    detail: 'As de facto Minister for Labour and Public Works, Dr. Ambedkar implemented groundbreaking modern labor legislation: reducing working hours from 12 to 8 hours per day, enacting the Mines Maternity Benefit Act, creating employment exchanges, establishing the tripartite Indian Labour Conference, and initiating India\'s first multipurpose river valley projects (Damodar Valley and Hirakud) under the Central Waterways Commission.',
    quote: 'Labour is not a commodity. It is human life with human rights.',
    category: 'politics',
    featured: true,
    bookRef: {
      volNo: 10,
      docId: 'doc-en-10',
      volTitle: 'BAWS Vol. 10: Dr. Ambedkar as Member of the Governor General’s Executive Council',
      chapter: 'Labour Legislation, the 8-Hour Workday, and Damodar Valley River Projects (pp. 1–450)'
    }
  },
  {
    year: 1947,
    icon: '⚖️',
    title: 'First Law Minister of Independent India & Drafting Chairman',
    exactDate: 'August 15 & 29, 1947',
    location: 'New Delhi',
    desc: 'Appointed free India\'s first Law Minister and unanimously elected Chairman of the Constitution Drafting Committee.',
    detail: 'On August 15, 1947, Dr. Ambedkar was sworn in as free India’s first Minister of Law. On August 29, 1947, the Constituent Assembly elected him Chairman of the Drafting Committee. Tasked with transforming diverse peoples into a single sovereign democratic republic, he worked tirelessly through 141 days of committee drafting.',
    quote: 'I entered the Constituent Assembly to safeguard the interests of my people, but I was called upon to draft a Constitution for all of India.',
    category: 'politics',
    featured: true,
    bookRef: {
      volNo: 13,
      docId: 'doc-en-13',
      volTitle: 'BAWS Vol. 13: Dr. Ambedkar: The Principal Architect of the Constitution',
      chapter: 'Appointment as Drafting Committee Chairman and Presentation of Draft (pp. 1–118)'
    }
  },
  {
    year: 1948,
    icon: '📘',
    title: 'Historiographical Studies: "Who Were the Shudras?"',
    exactDate: '1948',
    location: 'New Delhi / Bombay',
    desc: 'Published groundbreaking historical studies tracing the origins of caste hierarchy and the emergence of untouchability.',
    detail: 'Dedicated to Mahatma Jyotirao Phule, "Who Were the Shudras?" demonstrated that Shudras were originally Aryan Kshatriyas degraded through conflicts with the Vedic priesthood. In "The Untouchables," he traced untouchability to ancient tribal conflicts around 400 CE where defeated broken tribes refused to abandon beef-eating.',
    quote: 'History is a guide to emancipation. Those who forget their history cannot create a new history.',
    category: 'writing',
    featured: true,
    bookRef: {
      volNo: 7,
      docId: 'doc-en-7',
      volTitle: 'BAWS Vol. 7: Who Were the Shudras? & The Untouchables',
      chapter: 'Who Were the Shudras? (pp. 1–224) & The Untouchables (pp. 225–384)'
    }
  },
  {
    year: 1949,
    icon: '🏛️',
    title: 'Adoption of the Constitution of India',
    exactDate: 'November 26, 1949',
    location: 'Constituent Assembly Hall, New Delhi',
    desc: 'The Constitution of India is adopted. In his historic final speech on Nov 25, Ambedkar delivered profound warnings on social democracy.',
    detail: 'Ambedkar delivered his crowning address warning of social contradictions: "On the 26th of January 1950, we are going to enter into a life of contradictions. In politics we will have equality and in social and economic life we will have inequality. We must remove this contradiction at the earliest possible moment, or else those who suffer from inequality will blow up the structure of political democracy which this Assembly has so laboriously built up."',
    quote: 'Constitutional morality is not a natural sentiment. It has to be cultivated. We must make our political democracy a social democracy as well.',
    category: 'politics',
    featured: true,
    bookRef: {
      volNo: 13,
      docId: 'doc-en-13',
      volTitle: 'BAWS Vol. 13: Constituent Assembly Debates & Final Adoption',
      chapter: 'Historic Farewell Address to the Constituent Assembly (Nov 25, 1949, pp. 119–130)'
    }
  },
  {
    year: 1951,
    icon: '🚪',
    title: 'Resignation Over the Hindu Code Bill',
    exactDate: 'September 27, 1951',
    location: 'Parliament of India, New Delhi',
    desc: 'Resigned from Nehru\'s Cabinet after conservative resistance stalled the Hindu Code Bill granting women equal inheritance and divorce rights.',
    detail: 'Dr. Ambedkar drafted the revolutionary Hindu Code Bill to abolish polygamy, institute civil divorce, and grant women equal property inheritance. When orthodox opposition forced Prime Minister Nehru to drop the bill before elections, Ambedkar resigned in protest, stating that no society could call itself civilized while treating its women as property.',
    quote: 'I measure the progress of a community by the degree of progress which women have achieved.',
    category: 'politics',
    featured: true,
    bookRef: {
      volNo: 14,
      docId: 'doc-en-14',
      volTitle: 'BAWS Vol. 14: The Hindu Code Bill (Part I & II)',
      chapter: 'Statement by Dr. B. R. Ambedkar in Support of His Resignation as Law Minister (Sept 1951)'
    }
  },
  {
    year: 1954,
    icon: '🌏',
    title: 'World Fellowship of Buddhists & "Buddha or Karl Marx"',
    exactDate: 'December 1954',
    location: 'Rangoon, Burma & Colombo, Sri Lanka',
    desc: 'Addressed the World Fellowship of Buddhists, presenting his comparative study "Buddha or Karl Marx".',
    detail: 'Ambedkar traveled across Southeast Asia to study modern Buddhist governance. At the World Fellowship of Buddhists in Rangoon, he presented his philosophical thesis comparing the Buddha and Karl Marx, demonstrating that the Buddha’s path of Dhamma achieves fraternity and economic equality through voluntary ethical persuasion rather than the coercive dictatorship of the state.',
    quote: 'The Buddha’s method was to change the mind of man by moral persuasion and dhamma.',
    category: 'religion',
    featured: false,
    bookRef: {
      volNo: 3,
      docId: 'doc-en-3',
      volTitle: 'BAWS Vol. 3: Philosophy of Hinduism, Buddha or Marx',
      chapter: 'Buddha or Karl Marx: A Comparative Study (pp. 441–464)'
    }
  },
  {
    year: 1956,
    icon: '☸️',
    title: 'Mass Conversion to Buddhism at Nagpur',
    exactDate: 'October 14, 1956',
    location: 'Deekshabhoomi, Nagpur, Maharashtra',
    desc: 'Converted to Buddhism with over 500,000 followers and administered the historic 22 Vows, igniting the modern Buddhist revival.',
    detail: 'On Vijaya Dashami (Ashoka Vijaya Dashami), Dr. Ambedkar and Dr. Savita Ambedkar took refuge in the Triple Gem (Buddha, Dhamma, Sangha) and the Five Precepts from Venerable U Chandramani. Dr. Ambedkar then personally administered the 22 Vows to approximately 500,000 men and women, renouncing caste orthodoxy, idol worship, and superstition, and declaring the birth of an egalitarian spiritual brotherhood.',
    quote: 'By discarding my ancient religion which stood for inequality and oppression, today I have had the rebirth.',
    category: 'religion',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part III): The Great Buddhist Revival & The 22 Vows',
      chapter: 'Historic Speech at Deekshabhoomi, Nagpur on October 14–15, 1956'
    }
  },
  {
    year: 1956,
    icon: '📗',
    title: 'Completion of "The Buddha and His Dhamma"',
    exactDate: 'November 1956',
    location: '26 Alipur Road, New Delhi',
    desc: 'Completed his magnum opus on the life and teachings of the Buddha, finishing the preface days before his passing.',
    detail: 'Despite failing health and failing eyesight, Dr. Ambedkar typed the preface of his definitive treatise on the Buddha. Published posthumously in 1957, the work reconstructs the Buddha’s teachings as a rational, human-centered philosophy based on Prajna (understanding against superstition), Karuna (love and empathy), and Samata (equality).',
    quote: 'Religion must be based on reason and morality, not on superstition and dogma.',
    category: 'writing',
    featured: true,
    bookRef: {
      volNo: 11,
      docId: 'doc-en-11',
      volTitle: 'BAWS Vol. 11: The Buddha and His Dhamma',
      chapter: 'The Buddha and His Dhamma: Complete Treatise (pp. 1–620)'
    }
  },
  {
    year: 1956,
    icon: '🕊️',
    title: 'Mahaparinirvan',
    exactDate: 'December 6, 1956',
    location: '26 Alipur Road, New Delhi (Cremation at Chaityabhoomi, Mumbai)',
    desc: 'Passed away peacefully in Delhi. Over a million people attended his state Buddhist funeral at Chaityabhoomi, Mumbai.',
    detail: 'Dr. Ambedkar breathed his last in his sleep at his Delhi residence. His body was flown to Bombay, where over one million grief-stricken citizens joined the solemn Buddhist funeral procession to Chaityabhoomi, Dadar. Conferred India\'s highest civilian honor, the Bharat Ratna, in 1990.',
    quote: 'My life has been dedicated to liberty, equality, and fraternity for all.',
    category: 'religion',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17 (Part I): Mahaparinirvan Chronicles and Memorials',
      chapter: 'Tributes in Parliament, Prime Minister Nehru\'s Eulogy and Chaityabhoomi Proceedings'
    }
  }
];

let activeFilter = 'all';
let activeModalEvent = null;
let currentSpeechUtterance = null;
let isSpeaking = false;

// ── Local & Cloud Bookmark Store ───────────────────────────
const TIMELINE_BOOKMARK_KEY = 'archival_timeline_bookmarks';

function getTimelineBookmarks() {
  try {
    const raw = localStorage.getItem(TIMELINE_BOOKMARK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function isMilestoneBookmarked(ev) {
  if (!ev) return false;
  const bookmarks = getTimelineBookmarks();
  const id = `${ev.year}_${ev.title}`;
  return bookmarks.some(b => (typeof b === 'string' ? b === id : b.id === id));
}

function toggleTimelineBookmark(ev) {
  if (!ev) return false;
  const id = `${ev.year}_${ev.title}`;
  let bookmarks = getTimelineBookmarks();
  const index = bookmarks.findIndex(b => (typeof b === 'string' ? b === id : b.id === id));
  let isNowBookmarked = false;

  if (index >= 0) {
    bookmarks.splice(index, 1);
    isNowBookmarked = false;
  } else {
    bookmarks.push({
      id: id,
      year: ev.year,
      title: ev.title,
      category: ev.category,
      exactDate: ev.exactDate,
      savedAt: new Date().toISOString()
    });
    isNowBookmarked = true;

    // Optional cloud sync if logged in
    if (window.api && window.api.bookmarks && typeof window.api.bookmarks.add === 'function') {
      window.api.bookmarks.add({
        documentId: ev.bookRef?.docId || 'timeline-milestone',
        title: `${ev.year}: ${ev.title}`,
        page: ev.year,
        excerpt: ev.desc || ev.title,
        type: 'milestone'
      }).catch(() => {});
    }
  }

  localStorage.setItem(TIMELINE_BOOKMARK_KEY, JSON.stringify(bookmarks));

  // Update card buttons across DOM
  document.querySelectorAll(`.timeline-card-bookmark-btn[data-id="${id}"]`).forEach(btn => {
    if (isNowBookmarked) {
      btn.classList.add('bookmarked');
      btn.setAttribute('title', 'Remove bookmark');
      btn.setAttribute('aria-label', 'Remove bookmark');
    } else {
      btn.classList.remove('bookmarked');
      btn.setAttribute('title', 'Bookmark milestone');
      btn.setAttribute('aria-label', 'Bookmark milestone');
    }
  });

  // Update modal button if currently open for this event
  updateModalBookmarkBtn(ev);
  updateBookmarkCounter();

  if (window.showToast) {
    window.showToast(isNowBookmarked ? `🔖 Bookmarked: ${ev.year} — ${ev.title}` : `Bookmark removed for ${ev.year}`);
  }

  // If in 'bookmarked' filter tab, re-render view
  if (activeFilter === 'bookmarked') {
    renderTimeline('bookmarked');
  }

  return isNowBookmarked;
}

function updateBookmarkCounter() {
  const counterEl = document.getElementById('bookmark-counter');
  if (counterEl) {
    const list = getTimelineBookmarks();
    counterEl.textContent = list.length;
  }
}

function updateModalBookmarkBtn(ev) {
  const btn = document.getElementById('modal-bookmark-btn');
  const icon = document.getElementById('modal-bookmark-icon');
  const text = document.getElementById('modal-bookmark-text');
  if (!btn || !ev) return;

  const bookmarked = isMilestoneBookmarked(ev);
  if (bookmarked) {
    btn.classList.add('bookmarked');
    btn.style.borderColor = 'var(--gold)';
    btn.style.color = 'var(--gold)';
    btn.style.background = 'rgba(212, 175, 55, 0.18)';
    if (icon) icon.textContent = '★';
    if (text) text.textContent = 'Bookmarked';
  } else {
    btn.classList.remove('bookmarked');
    btn.style.borderColor = '';
    btn.style.color = '';
    btn.style.background = '';
    if (icon) icon.textContent = '🔖';
    if (text) text.textContent = 'Bookmark';
  }
}

// ── Speech Synthesis Narration ("Tell Description") ──────────
function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  currentSpeechUtterance = null;
  const icon = document.getElementById('modal-speak-icon');
  const text = document.getElementById('modal-speak-text');
  const btn = document.getElementById('modal-speak-btn');
  if (icon) icon.textContent = '🔊';
  if (text) text.textContent = 'Listen';
  if (btn) {
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-outline');
  }
}

function speakEventDescription(ev) {
  if (!('speechSynthesis' in window)) {
    if (window.showToast) window.showToast('Speech narration is not supported on this browser.');
    return;
  }

  if (isSpeaking) {
    stopSpeaking();
    return;
  }

  // Construct clear, comprehensive narration text
  const narrative = [
    `Milestone: ${ev.year}, ${ev.title}.`,
    ev.exactDate ? `Date: ${ev.exactDate}.` : '',
    ev.location ? `Location: ${ev.location}.` : '',
    ev.desc || '',
    ev.detail ? `Historical Context: ${ev.detail}.` : '',
    ev.quote ? `Quote by Dr. Ambedkar: "${ev.quote}"` : '',
    ev.bookRef ? `Official reference recorded in ${ev.bookRef.volTitle}.` : ''
  ].filter(Boolean).join(' ');

  const utterance = new SpeechSynthesisUtterance(narrative);
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  utterance.lang = 'en-US';

  const icon = document.getElementById('modal-speak-icon');
  const text = document.getElementById('modal-speak-text');
  const btn = document.getElementById('modal-speak-btn');

  utterance.onstart = () => {
    isSpeaking = true;
    if (icon) icon.textContent = '⏹️';
    if (text) text.textContent = 'Stop';
    if (btn) {
      btn.classList.remove('btn-outline');
      btn.classList.add('btn-primary');
    }
  };

  utterance.onend = () => {
    stopSpeaking();
  };

  utterance.onerror = () => {
    stopSpeaking();
  };

  currentSpeechUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

function renderTimeline(filter) {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  // Preserve the central spine line
  const line = container.querySelector('.timeline-line') || document.createElement('div');
  line.className = 'timeline-line';
  container.innerHTML = '';
  container.appendChild(line);

  let filtered = [];
  if (filter === 'all') {
    filtered = TIMELINE_EVENTS;
  } else if (filter === 'bookmarked') {
    filtered = TIMELINE_EVENTS.filter(e => isMilestoneBookmarked(e));
  } else {
    filtered = TIMELINE_EVENTS.filter(e => e.category === filter);
  }

  filtered.forEach((ev, i) => {
    // Strictly alternate: even index = left side, odd index = right side
    const isLeft = i % 2 === 0;
    const item = document.createElement('div');
    item.className = `timeline-item ${isLeft ? 'side-left' : 'side-right'} animate-fade-up`;
    item.style.animationDelay = Math.min(i * 45, 500) + 'ms';

    const bookPillHtml = ev.bookRef 
      ? `<span class="timeline-book-pill" title="Official BAWS Reference Available">📖 Vol. ${ev.bookRef.volNo} Ref ↗</span>` 
      : '';

    const id = `${ev.year}_${ev.title}`;
    const bookmarked = isMilestoneBookmarked(ev);

    const cardHtml = `
      <div class="timeline-content" tabindex="0" role="article" aria-label="${ev.year}: ${ev.title}">
        <div class="timeline-content-inner">
          <div class="flex-between items-center" style="margin-bottom:var(--space-2);">
            <div class="flex items-center gap-2">
              <div class="timeline-year">${ev.year}</div>
              <button class="timeline-card-bookmark-btn ${bookmarked ? 'bookmarked' : ''}" data-id="${id}" title="${bookmarked ? 'Remove Bookmark' : 'Bookmark Milestone'}" aria-label="Bookmark this milestone">
                🔖
              </button>
            </div>
            <span class="text-xs text-muted font-mono" style="font-size:0.75rem;">${ev.exactDate || ''}</span>
          </div>
          <div class="timeline-title">${ev.title}</div>
          <div class="timeline-desc">${ev.desc}</div>
          
          <div class="timeline-tag">
            <div class="flex gap-2 items-center">
              <span class="badge badge-${ev.category === 'education' ? 'book' : ev.category === 'writing' ? 'manuscript' : ev.category === 'movement' ? 'speech' : ev.category === 'politics' ? 'debate' : 'article'}">${ev.category}</span>
              ${ev.featured ? '<span class="badge badge-admin">Key Milestone</span>' : ''}
            </div>
            ${bookPillHtml}
          </div>
        </div>
      </div>
    `;

    const dotHtml = `<div class="timeline-dot ${ev.featured ? 'featured' : ''}" aria-hidden="true" title="Click to view full detail">${ev.icon}</div>`;
    const spacerHtml = `<div class="spacer" aria-hidden="true"></div>`;

    if (isLeft) {
      item.innerHTML = cardHtml + dotHtml + spacerHtml;
    } else {
      item.innerHTML = spacerHtml + dotHtml + cardHtml;
    }

    // Attach click events to card and dot
    const contentEl = item.querySelector('.timeline-content');
    const dotEl = item.querySelector('.timeline-dot');
    const bookmarkBtn = item.querySelector('.timeline-card-bookmark-btn');

    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTimelineBookmark(ev);
      });
    }

    const openHandler = () => openTimelineModal(ev);
    if (contentEl) {
      contentEl.addEventListener('click', openHandler);
      contentEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openHandler();
        }
      });
    }
    if (dotEl) {
      dotEl.addEventListener('click', openHandler);
    }

    container.appendChild(item);
  });

  if (!filtered.length) {
    if (filter === 'bookmarked') {
      container.innerHTML += `
        <div class="empty-state py-12 text-center" style="grid-column: 1 / -1; width: 100%;">
          <span class="empty-state-icon text-4xl">🔖</span>
          <h3 class="font-heading text-lg mt-2 text-gold">No Bookmarked Milestones Yet</h3>
          <p class="text-sm text-muted mt-1 max-w-md mx-auto">Click the bookmark icon 🔖 on any milestone card or inside the detail modal to save it to your personal study collection.</p>
        </div>
      `;
    } else {
      container.innerHTML += `<div class="empty-state py-8 text-center" style="grid-column: 1 / -1; width: 100%;"><span class="empty-state-icon text-3xl">📅</span><h3 class="font-heading text-lg mt-2">No events found for this category filter.</h3></div>`;
    }
  }

  updateBookmarkCounter();
}

// ── Interactive Detail Modal & Book Reference Controller ──
function openTimelineModal(ev) {
  const modal = document.getElementById('timeline-detail-modal');
  if (!modal || !ev) return;

  activeModalEvent = ev;
  stopSpeaking(); // Reset any active speech

  const iconEl = document.getElementById('modal-event-icon');
  const yearEl = document.getElementById('modal-event-year');
  const catEl = document.getElementById('modal-event-category');
  const milestoneEl = document.getElementById('modal-event-milestone');
  const titleEl = document.getElementById('modal-event-title');
  const dateEl = document.getElementById('modal-event-date');
  const locEl = document.getElementById('modal-event-location');
  const detailEl = document.getElementById('modal-event-detail');
  const quoteBox = document.getElementById('modal-event-quote-box');
  const quoteEl = document.getElementById('modal-event-quote');
  
  const bookVolEl = document.getElementById('modal-book-vol');
  const bookTitleEl = document.getElementById('modal-book-title');
  const bookChapterEl = document.getElementById('modal-book-chapter');
  const jumpBtn = document.getElementById('modal-jump-btn');
  const searchBtn = document.getElementById('modal-search-btn');
  const copyCitationBtn = document.getElementById('modal-copy-citation-btn');

  if (iconEl) iconEl.textContent = ev.icon;
  if (yearEl) yearEl.textContent = ev.year;
  if (catEl) catEl.textContent = ev.category.toUpperCase();
  if (milestoneEl) milestoneEl.style.display = ev.featured ? 'inline-flex' : 'none';
  if (titleEl) titleEl.textContent = ev.title;
  if (dateEl) dateEl.textContent = `🗓️ ${ev.exactDate || ev.year}`;
  if (locEl) locEl.textContent = `📍 ${ev.location || 'India'}`;
  if (detailEl) detailEl.textContent = ev.detail || ev.desc;

  if (quoteBox && quoteEl) {
    if (ev.quote) {
      quoteBox.style.display = 'block';
      quoteEl.textContent = ev.quote;
    } else {
      quoteBox.style.display = 'none';
    }
  }

  // Exact Book Reference
  if (ev.bookRef) {
    if (bookVolEl) bookVolEl.textContent = `BAWS Volume ${ev.bookRef.volNo}`;
    if (bookTitleEl) bookTitleEl.textContent = ev.bookRef.volTitle;
    if (bookChapterEl) bookChapterEl.textContent = `Citation / Chapter: ${ev.bookRef.chapter}`;
    if (jumpBtn) {
      jumpBtn.href = `reader.html?id=${ev.bookRef.docId || 'doc-en-1'}`;
      jumpBtn.style.display = 'inline-flex';
    }
    if (searchBtn) {
      searchBtn.href = `archive.html?q=${encodeURIComponent(ev.title)}`;
    }
    if (copyCitationBtn) {
      copyCitationBtn.onclick = () => {
        const citation = `Dr. B. R. Ambedkar: Writings and Speeches (BAWS), Volume ${ev.bookRef.volNo}, "${ev.bookRef.chapter}". National Heritage Archive.`;
        navigator.clipboard.writeText(citation).then(() => {
          if (window.showToast) window.showToast('Academic citation copied to clipboard!');
        });
      };
    }
  }

  // Update Bookmark & Speak controls
  updateModalBookmarkBtn(ev);

  const speakBtn = document.getElementById('modal-speak-btn');
  if (speakBtn) {
    speakBtn.onclick = () => speakEventDescription(ev);
  }

  const bookmarkBtn = document.getElementById('modal-bookmark-btn');
  if (bookmarkBtn) {
    bookmarkBtn.onclick = () => toggleTimelineBookmark(ev);
  }

  // Activate Modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Lock background scroll
}

function closeTimelineModal() {
  const modal = document.getElementById('timeline-detail-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
  stopSpeaking();
  activeModalEvent = null;
}

document.addEventListener('DOMContentLoaded', () => {
  renderTimeline('all');
  updateBookmarkCounter();

  // Category filter tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => { 
        t.classList.remove('active'); 
        t.setAttribute('aria-selected', 'false'); 
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      activeFilter = tab.dataset.filter;
      renderTimeline(activeFilter);
    });
  });

  // Modal close handlers
  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeTimelineModal);

  const modal = document.getElementById('timeline-detail-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      // Close only if clicking the backdrop outside the dialog
      if (e.target === modal) closeTimelineModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTimelineModal();
  });

  // Re-render when language changes
  document.addEventListener('languageChange', () => {
    renderTimeline(activeFilter);
  });
});
