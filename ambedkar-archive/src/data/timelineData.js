/**
 * timelineData.js — Verified Chronological Milestones of Dr. B. R. Ambedkar (1891–1956)
 * Source of truth: BAWS (Babasaheb Ambedkar: Writings and Speeches) Official Archives
 */

export const TIMELINE_CATEGORIES = {
  all: { label: 'All Milestones', color: '#f59e0b' },
  education: { label: 'Education & Academics', color: '#38bdf8' },
  movement: { label: 'Civil Rights Movement', color: '#ef4444' },
  politics: { label: 'Governance & Constitution', color: '#10b981' },
  writing: { label: 'Foundational Books & Essays', color: '#a855f7' },
  religion: { label: 'Dhamma & Conversion', color: '#f59e0b' }
};

export const TIMELINE_EVENTS = [
  {
    id: 'mhow-1891',
    year: 1891,
    title: 'Birth in Mhow',
    exactDate: 'April 14, 1891',
    location: 'Mhow, Central Provinces',
    category: 'education',
    icon: '🌟',
    quote: 'Cultivation of mind should be the ultimate aim of human existence.',
    desc: 'Born into the Mahar community. His childhood in the British garrison town of Mhow exposed him to acute institutional untouchability.',
    detail: 'Despite acute caste humiliation in schools where untouchable students had to sit outside on gunny sacks and were denied water without peons pouring it from a distance, young Bhimrao persevered with exceptional academic discipline.',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: Autobiographical Reminiscences',
      chapter: 'Waiting for a Visa (pp. 661–691)'
    }
  },
  {
    id: 'matric-1907',
    year: 1907,
    title: 'Matriculation Triumph',
    exactDate: '1907',
    location: 'Elphinstone High School, Bombay',
    category: 'education',
    icon: '📚',
    quote: 'Knowledge is the foundation of a man’s life and character.',
    desc: 'Passed the matriculation examination from Government High School, Bombay — a historic milestone for an untouchable youth.',
    detail: 'Celebrated at a public felicitation where Marathi scholar K. A. Keluskar presented Bhimrao with a biography of Gautam Buddha, planting the intellectual seeds of his lifelong philosophical quest.',
    featured: false,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: Biographical Chronicles',
      chapter: 'Early Awakening and Keluskar’s Gift of the Buddha Biography'
    }
  },
  {
    id: 'ba-1912',
    year: 1912,
    title: 'B.A. from Bombay University',
    exactDate: '1912',
    location: 'Elphinstone College, Bombay',
    category: 'education',
    icon: '🎓',
    quote: 'Men are mortal. So are ideas. An idea needs propagation as much as a plant needs watering.',
    desc: 'Graduated with a degree in Economics and Political Science from Bombay University, funded by the Maharaja of Baroda.',
    detail: 'Supported by a scholarship from Maharaja Sayajirao Gaekwad III of Baroda, Ambedkar completed his Bachelor of Arts and entered Baroda State administration.',
    featured: false,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: Academic Records and Baroda State Service',
      chapter: 'Educational Milestones and Service in the Baroda State Army'
    }
  },
  {
    id: 'columbia-1913',
    year: 1913,
    title: 'Arrival at Columbia University, New York',
    exactDate: 'July 1913',
    location: 'Columbia University, New York City',
    category: 'education',
    icon: '✈️',
    quote: 'Democracy is not merely a form of government; it is primarily a mode of associated living.',
    desc: 'Awarded Baroda scholarship for overseas studies. Studied under Prof. John Dewey, whose philosophy of democracy deeply shaped Ambedkar.',
    detail: 'Living in Hartley Hall, he immersed himself in economics, sociology, and philosophy for 18 hours a day. Under John Dewey, he learned that democracy is an ethical way of life based on social equality.',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: Reminiscences of Columbia University',
      chapter: 'Letters from New York and Philosophical Studies under John Dewey'
    }
  },
  {
    id: 'caste-seminar-1916',
    year: 1916,
    title: '"Castes in India" — Columbia Seminar Paper',
    exactDate: 'May 9, 1916',
    location: 'Columbia University, New York',
    category: 'writing',
    icon: '📄',
    quote: 'Endogamy is the only characteristic that is peculiar to caste.',
    desc: 'Presented his landmark paper defining caste through endogamy — his first major academic work on the mechanism of caste hierarchy.',
    detail: 'Dr. Ambedkar proved that orthodox priestly classes enclosed themselves through endogamy, forcing other classes to imitate this artificial isolation.',
    featured: true,
    bookRef: {
      volNo: 1,
      docId: 'doc-en-1',
      volTitle: 'BAWS Vol. 1: Castes in India, Annihilation of Caste',
      chapter: 'Castes in India: Their Mechanism, Genesis and Development (pp. 3–22)'
    }
  },
  {
    id: 'grays-lse-1916',
    year: 1916,
    title: 'Admitted to Gray’s Inn & LSE, London',
    exactDate: 'October 1916',
    location: 'London School of Economics & Gray’s Inn, London',
    category: 'education',
    icon: '⚖️',
    quote: 'My life is a battle against inequality. Education is the greatest weapon in that struggle.',
    desc: 'Enrolled to read for the Bar at Gray\'s Inn while pursuing doctoral studies in economics at LSE.',
    detail: 'Gained admission to Gray’s Inn to qualify as a barrister-at-law, while simultaneously registering at LSE under Edwin Cannan.',
    featured: false,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: London Chronicles and Bar Examinations',
      chapter: 'Legal Studies at Gray’s Inn and Research at LSE'
    }
  },
  {
    id: 'southborough-1919',
    year: 1919,
    title: 'Evidence Before Southborough Committee',
    exactDate: 'January 27, 1919',
    location: 'Bombay',
    category: 'politics',
    icon: '🏛️',
    quote: 'The right of representation is the only true guarantee of liberty and equality for depressed classes.',
    desc: 'Testified before Southborough Franchise Committee, presenting the first comprehensive case for separate electorates.',
    detail: 'Submitted a rigorous constitutional statement proving that untouchables constituted a distinct and severed minority needing statutory representation.',
    featured: false,
    bookRef: {
      volNo: 1,
      docId: 'doc-en-1',
      volTitle: 'BAWS Vol. 1: Southborough Committee Testimony',
      chapter: 'Evidence Before the Southborough Franchise Committee (pp. 243–278)'
    }
  },
  {
    id: 'mooknayak-1920',
    year: 1920,
    title: 'Mooknayak Newspaper Founded',
    exactDate: 'January 31, 1920',
    location: 'Bombay',
    category: 'movement',
    icon: '📰',
    quote: 'Indian society is like a multi-storeyed tower having no staircase and no entrance.',
    desc: 'Founded "Mooknayak" (Leader of the Voiceless), his first fortnightly newspaper championing social justice.',
    detail: 'With financial aid from Chhatrapati Shahu Maharaj of Kolhapur, Ambedkar compared Hindu society to a house without a staircase where persons born on one floor are condemned to die on that floor.',
    featured: false,
    bookRef: {
      volNo: 19,
      docId: 'doc-en-19',
      volTitle: 'BAWS Vol. 19: Journalism of Dr. B. R. Ambedkar',
      chapter: 'Mooknayak Inaugural Editorials & Articles (1920)'
    }
  },
  {
    id: 'rupee-1923',
    year: 1923,
    title: 'D.Sc. from LSE — "The Problem of the Rupee"',
    exactDate: 'March 1923',
    location: 'London School of Economics, London',
    category: 'education',
    icon: '💰',
    quote: 'Currency must have stability in its purchasing power. An unprincipled monetary system is a silent engine of exploitation.',
    desc: 'Awarded Doctor of Science in Economics for his magnum opus on the rupee, directly influencing the creation of the RBI.',
    detail: 'Ambedkar challenged J. M. Keynes’s advocacy of the gold exchange standard. His evidence before the 1925 Hilton Young Commission formed the blueprint for the Reserve Bank of India.',
    featured: true,
    bookRef: {
      volNo: 6,
      docId: 'doc-en-6',
      volTitle: 'BAWS Vol. 6: The Problem of the Rupee',
      chapter: 'The Problem of the Rupee: Its Origin and Its Solution (pp. 167–384)'
    }
  },
  {
    id: 'bhs-1924',
    year: 1924,
    title: 'Bahishkrit Hitakarini Sabha Founded',
    exactDate: 'July 20, 1924',
    location: 'Damodar Hall, Parel, Bombay',
    category: 'movement',
    icon: '✊',
    quote: 'Educate, Agitate, Organize; Have faith in yourselves.',
    desc: 'Founded the Outcastes Welfare Association in Bombay with the historic motto: "Educate, Agitate, Organize".',
    detail: 'Established to open hostels, reading rooms, schools, and cultural bodies for depressed classes, recognizing that self-reliance and moral discipline are fundamental to human emancipation.',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: Socio-Political Awakening',
      chapter: 'Constitution and Aims of Bahishkrit Hitakarini Sabha'
    }
  },
  {
    id: 'mahad-1927',
    year: 1927,
    title: 'Mahad Satyagraha & Manusmriti Burning',
    exactDate: 'March 20 & Dec 25, 1927',
    location: 'Chavadar Tank, Mahad, Maharashtra',
    category: 'movement',
    icon: '💧',
    quote: 'We are not going to the Chavadar Tank merely to drink water. We are going to the tank to assert that we too are human beings.',
    desc: 'Led thousands to drink water from the public Chavadar Tank, followed by the historic public burning of the Manusmriti on Dec 25.',
    detail: 'When orthodox groups staged violent purification rituals, Ambedkar returned on December 25, 1927, and publicly burned the Manusmriti on a funeral pyre, declaring it a charter of spiritual slavery.',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: Mahad Satyagraha and Social Emancipation',
      chapter: 'The Mahad Satyagraha Conference Speeches & Manusmriti Dahan'
    }
  },
  {
    id: 'rtc1-1930',
    year: 1930,
    title: 'First Round Table Conference, London',
    exactDate: 'November 12, 1930',
    location: 'House of Lords, London',
    category: 'politics',
    icon: '🤝',
    quote: 'We must have a government in which men in power will not be afraid to amend the social and economic code of life.',
    desc: 'Represented the Depressed Classes of India, demanding equal citizenship, fundamental rights, and political safeguards.',
    detail: 'Speaking before British Prime Minister Ramsay MacDonald and Indian princes, Ambedkar stated that the bureaucratic British Raj had failed to liberate depressed classes from social tyrannies.',
    featured: false,
    bookRef: {
      volNo: 2,
      docId: 'doc-en-2',
      volTitle: 'BAWS Vol. 2: Round Table Conferences',
      chapter: 'Plenary Speeches & Sub-Committee Proceedings (pp. 503–530)'
    }
  },
  {
    id: 'rtc2-1931',
    year: 1931,
    title: 'Second Round Table Conference & Gandhi Debate',
    exactDate: 'Autumn 1931',
    location: 'St. James’s Palace, London',
    category: 'politics',
    icon: '🤝',
    quote: 'I have no homeland, Mr. Gandhi... How can I call this land my home where we are treated worse than cats and dogs?',
    desc: 'Confronted Mahatma Gandhi on separate electorates, insisting that untouchables required statutory constitutional guarantees.',
    detail: 'When Gandhi insisted that the Congress represented all of India, Ambedkar stood firm that political safeguards were a survival prerequisite so Dalits would not be crushed by an entrenched caste majority.',
    featured: true,
    bookRef: {
      volNo: 2,
      docId: 'doc-en-2',
      volTitle: 'BAWS Vol. 2: Minorities Committee Proceedings',
      chapter: 'Debates with Gandhi at the Second Round Table Conference'
    }
  },
  {
    id: 'poona-1932',
    year: 1932,
    title: 'The Poona Pact',
    exactDate: 'September 24, 1932',
    location: 'Yerwada Central Jail, Poona',
    category: 'politics',
    icon: '📜',
    quote: 'There was immense pressure on me, but I had to safeguard the political future of my people.',
    desc: 'Signed the historic Poona Pact, relinquishing separate electorates in exchange for 148 reserved seats in provincial assemblies.',
    detail: 'When Gandhi undertook a fast unto death in Yerwada Jail, Ambedkar negotiated the Poona Pact, securing 148 reserved seats (more than double the British award of 71).',
    featured: true,
    bookRef: {
      volNo: 9,
      docId: 'doc-en-9',
      volTitle: 'BAWS Vol. 9: What Congress and Gandhi Have Done to the Untouchables',
      chapter: 'The Poona Pact and Its Political Consequences'
    }
  },
  {
    id: 'yeola-1935',
    year: 1935,
    title: 'Yeola Declaration on Conversion',
    exactDate: 'October 13, 1935',
    location: 'Yeola, Nashik District, Maharashtra',
    category: 'religion',
    icon: '⚡',
    quote: 'I was born a Hindu because I had no control over it, but I solemnly assure you I will not die a Hindu.',
    desc: 'Declared spiritual liberation: "I was born a Hindu because I had no control over it, but I solemnly assure you I will not die a Hindu."',
    detail: 'Speaking to over 10,000 delegates at Yeola, Dr. Ambedkar announced that after 15 years of futile efforts to reform Hinduism from within, he was abandoning the fold of caste religion.',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: Religious Awakening',
      chapter: 'The Historic Yeola Conference and Declaration on Conversion'
    }
  },
  {
    id: 'aoc-1936',
    year: 1936,
    title: 'Publication of "Annihilation of Caste"',
    exactDate: 'May 1936',
    location: 'Bombay',
    category: 'writing',
    icon: '📖',
    quote: 'You cannot build anything on the foundations of caste. You cannot build up a nation, you cannot build up a morality.',
    desc: 'Published his masterpiece on why caste cannot be reformed without dynamiting the theological sanctity of the scriptures.',
    detail: 'Prepared as a presidential address for the Jat-Pat-Todak Mandal in Lahore. When organizers asked him to soften his critique, Ambedkar cancelled his address and published the book privately.',
    featured: true,
    bookRef: {
      volNo: 1,
      docId: 'doc-en-1',
      volTitle: 'BAWS Vol. 1: Annihilation of Caste',
      chapter: 'Annihilation of Caste: With a Reply to Mahatma Gandhi'
    }
  },
  {
    id: 'labour-1942',
    year: 1942,
    title: 'Member of Viceroy’s Executive Council (Labour)',
    exactDate: 'July 1942 – June 1946',
    location: 'New Delhi',
    category: 'politics',
    icon: '⚒️',
    quote: 'Labour is not a commodity. It is human life with human rights.',
    desc: 'Appointed Labour Member of India\'s wartime government, pioneering the 8-hour workday, maternity benefits, and national power grids.',
    detail: 'Implemented groundbreaking labor legislation: reducing working hours from 12 to 8 hours per day, enacting Mines Maternity Benefit Act, and initiating the Damodar Valley and Hirakud river projects.',
    featured: true,
    bookRef: {
      volNo: 10,
      docId: 'doc-en-10',
      volTitle: 'BAWS Vol. 10: Governor General’s Executive Council',
      chapter: 'Labour Legislation and the 8-Hour Workday'
    }
  },
  {
    id: 'drafting-1947',
    year: 1947,
    title: 'First Law Minister & Drafting Chairman',
    exactDate: 'August 15 & 29, 1947',
    location: 'New Delhi',
    category: 'politics',
    icon: '⚖️',
    quote: 'I entered the Constituent Assembly to safeguard the interests of my people, but I was called upon to draft a Constitution for all of India.',
    desc: 'Appointed free India\'s first Law Minister and unanimously elected Chairman of the Constitution Drafting Committee.',
    detail: 'Tasked with transforming diverse peoples into a single sovereign democratic republic, Dr. Ambedkar guided the 141 days of committee drafting.',
    featured: true,
    bookRef: {
      volNo: 13,
      docId: 'doc-en-13',
      volTitle: 'BAWS Vol. 13: Principal Architect of the Constitution',
      chapter: 'Appointment as Drafting Committee Chairman and Presentation of Draft'
    }
  },
  {
    id: 'adoption-1949',
    year: 1949,
    title: 'Adoption of the Constitution of India',
    exactDate: 'November 26, 1949',
    location: 'Constituent Assembly Hall, New Delhi',
    category: 'politics',
    icon: '🏛️',
    quote: 'Constitutional morality is not a natural sentiment. It has to be cultivated. We must make our political democracy a social democracy.',
    desc: 'The Constitution is adopted. Ambedkar delivered his profound farewell address warning against constitutional contradictions.',
    detail: 'Ambedkar warned: "On the 26th of January 1950, we are going to enter into a life of contradictions: equality in politics, inequality in social and economic life. We must remove this contradiction or those who suffer will blow up the structure."',
    featured: true,
    bookRef: {
      volNo: 13,
      docId: 'doc-en-13',
      volTitle: 'BAWS Vol. 13: Constituent Assembly Debates',
      chapter: 'Farewell Address to the Constituent Assembly (Nov 25, 1949)'
    }
  },
  {
    id: 'deeksha-1956',
    year: 1956,
    title: 'Historic Dhamma Diksha at Deekshabhoomi',
    exactDate: 'October 14, 1956',
    location: 'Deekshabhoomi, Nagpur, Maharashtra',
    category: 'religion',
    icon: '☸️',
    quote: 'I like the religion that teaches liberty, equality, and fraternity.',
    desc: 'Fulfilled the 1935 Yeola pledge, embracing Navayana Buddhism with 500,000 followers and taking the historic 22 Vows.',
    detail: 'Administered the refuge of the Buddha, Dhamma, and Sangha along with the 22 Vows renouncing inequality and superstition, initiating the revival of Buddhism in modern India.',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: The Great Conversion',
      chapter: 'The Great Conversion at Nagpur and The 22 Vows'
    }
  },
  {
    id: 'parinirvan-1956',
    year: 1956,
    title: 'Mahaparinirvan',
    exactDate: 'December 6, 1956',
    location: '26 Alipur Road, New Delhi',
    category: 'religion',
    icon: '🕯️',
    quote: 'My people must not look back. March ahead with wisdom and courage.',
    desc: 'Passed away peacefully in his sleep at 26 Alipur Road, New Delhi, leaving an immortal legacy of human dignity and liberty.',
    detail: 'Over 500,000 people gathered at Chaitya Bhoomi in Dadar, Bombay, for his cremation, mourning the visionary who gave modern India its moral and constitutional conscience.',
    featured: true,
    bookRef: {
      volNo: 17,
      docId: 'doc-en-17',
      volTitle: 'BAWS Vol. 17: Mahaparinirvan',
      chapter: 'Tributes, Condolence Resolutions and Global Remembrance'
    }
  }
];
