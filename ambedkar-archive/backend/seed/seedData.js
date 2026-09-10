require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Document = require('../models/Document');
const Media = require('../models/Media');
const User = require('../models/User');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
};

const documents = [
  // ═══════════════════════════════════════════════════
  // BOOKS
  // ═══════════════════════════════════════════════════
  {
    title: 'Annihilation of Caste',
    titleHi: 'जाति का विनाश',
    titleMr: 'जातीचे उच्चाटन',
    category: 'book',
    language: ['en', 'hi', 'mr'],
    year: 1936,
    summary: 'A landmark speech-turned-book that was censored by the Jat-Pat-Todak Mandal, Annihilation of Caste makes a devastating case against the caste system using logic, history, and moral philosophy. Ambedkar argues that caste cannot be reformed—it must be annihilated—and that Hinduism\'s sacred texts are the root cause of caste oppression.',
    summaryHi: 'यह ऐतिहासिक भाषण-पुस्तक जात-पात-तोड़क मंडल द्वारा सेंसर किया गया था। इसमें डॉ. अंबेडकर ने जाति व्यवस्था के विरुद्ध तर्क, इतिहास और नैतिक दर्शन का उपयोग करते हुए यह सिद्ध किया कि जाति का सुधार नहीं, उच्चाटन होना चाहिए।',
    summaryMr: 'या ऐतिहासिक भाषण-पुस्तकात डॉ. आंबेडकरांनी जातिव्यवस्थेविरुद्ध तर्क, इतिहास आणि नैतिक तत्त्वज्ञानाचा वापर करून सिद्ध केले की जातीचे सुधारण नाही तर उच्चाटन व्हायला हवे.',
    tags: ['caste', 'social reform', 'hinduism', 'equality', 'untouchability'],
    source: 'BAWS Vol. 1 (Dr. Ambedkar Foundation)',
    publisher: 'Balgangadhar Tilak Prakashan',
    pageCount: 226,
    isFeatured: true,
    isPublic: true,
    searchKeywords: ['caste annihilation', 'varna', 'shudra', 'dalit', 'untouchable', 'brahmin', 'social reform', 'jat-pat-todak', 'mandal'],
    fullText: `Preface\n\nOn 12th May 1936, the Jat-Pat-Todak Mandal of Lahore had invited me to preside over their Annual Conference. As the President elect, I had prepared a speech which I intended to deliver at the Conference. But the Reception Committee of the Mandal, after having seen a copy of my speech, informed me that they were sorry to cancel the invitation, because they felt that the speech which I had prepared was likely to create a great controversy. Controlling caste feeling and prejudice is difficult enough. The speech, in their opinion, would have created a storm too violent for them to face...\n\nPart I — The Problem\n\nThe path of social reform, like the path to heaven, at any rate in India, is strewn with many difficulties. Social reform in India has few friends and many critics...\n\nPart II — The Root Cause\n\nThe Hindus criticise the Mussalmans for having spread their religion by the use of the sword. They also criticise the Christians for have converted the Hindus with the help of money. But really speaking, who is better and more worthy of respect—the Mussalmans and Christians on the one side, or the Hindus on the other? The Mussalmans and Christians resorted to force and money...`,
    imageUrl: '',
    downloadUrl: '',
  },
  {
    title: 'Who Were the Shudras?',
    titleHi: 'शूद्र कौन थे?',
    titleMr: 'शूद्र कोण होते?',
    category: 'book',
    language: ['en', 'hi'],
    year: 1948,
    summary: 'A rigorous historical study examining the origins of the Shudras—the fourth varna in the Hindu social order. Ambedkar challenges Brahminic historical narratives and argues that the Shudras were originally Kshatriyas who fell from their status due to conflict with Brahmin priests. One of his most scholarly works.',
    summaryHi: 'यह ग्रंथ हिंदू सामाजिक व्यवस्था में चौथे वर्ण शूद्रों की उत्पत्ति की जांच करता है। अंबेडकर ने ब्राह्मणवादी ऐतिहासिक कथाओं को चुनौती दी।',
    summaryMr: 'हा ग्रंथ हिंदू सामाजिक व्यवस्थेतील चौथ्या वर्णाच्या, म्हणजे शूद्रांच्या उत्पत्तीची तपासणी करतो.',
    tags: ['history', 'shudra', 'varna', 'brahmin', 'kshatriya', 'caste origin'],
    source: 'BAWS Vol. 7 (Dr. Ambedkar Foundation)',
    publisher: 'Thacker & Co.',
    pageCount: 306,
    isFeatured: true,
    isPublic: true,
    searchKeywords: ['shudra origin', 'varna system', 'brahmin kshatriya', 'ancient india', 'manusmriti', 'vedic society'],
    fullText: 'Chapter 1 — The Problem\n\nIn the Chaturvarnya there are four varnas: Brahmin, Kshatriya, Vaishya and Shudra. According to the Hindu theory the Brahmin is supposed to be the product of Brahma\'s mouth, the Kshatriya of his arms, the Vaishya of his thighs and the Shudra of his feet. This is the mythological explanation of the origin of the four varnas...',
    imageUrl: '',
  },
  {
    title: 'The Untouchables: Who Were They and Why They Became Untouchables?',
    titleHi: 'अछूत: वे कौन थे और वे अछूत क्यों बने?',
    titleMr: 'अस्पृश्य: ते कोण होते आणि ते अस्पृश्य का झाले?',
    category: 'book',
    language: ['en', 'hi', 'mr'],
    year: 1948,
    summary: 'Ambedkar investigates the historical origins of untouchability in India. He argues that the untouchables were originally Buddhists who refused to convert to Brahminism and were consequently stigmatized. The book provides an alternative history of the lowest social group in the Hindu order.',
    summaryHi: 'अंबेडकर भारत में अस्पृश्यता की ऐतिहासिक उत्पत्ति की जांच करते हैं। वह तर्क देते हैं कि अस्पृश्य मूल रूप से बौद्ध थे जिन्होंने ब्राह्मणवाद में धर्मांतरण से इनकार किया था।',
    summaryMr: 'आंबेडकर भारतातील अस्पृश्यतेच्या ऐतिहासिक उत्पत्तीची तपासणी करतात. ते असा युक्तिवाद करतात की अस्पृश्य मूळत: बौद्ध होते.',
    tags: ['untouchability', 'buddhism', 'dalit history', 'brahminism', 'social history'],
    source: 'BAWS Vol. 7 (Dr. Ambedkar Foundation)',
    year: 1948,
    pageCount: 164,
    isFeatured: true,
    isPublic: true,
    searchKeywords: ['untouchables', 'dalit', 'buddhism', 'beef eating', 'broken men', 'brahmanism'],
    fullText: 'Part I — The Problem\n\nChapter 1 — The Touchables and the Untouchables\n\nThe population of India can be divided into two sections. One section is composed of those who are called the Touchables and the other of those who are called the Untouchables...',
    imageUrl: '',
  },
  {
    title: 'The Buddha and His Dhamma',
    titleHi: 'बुद्ध और उनका धम्म',
    titleMr: 'बुद्ध आणि त्यांचा धम्म',
    category: 'book',
    language: ['en', 'hi', 'mr'],
    year: 1957,
    summary: 'Written shortly before his death, this is Ambedkar\'s magnum opus—a complete retelling of the life and philosophy of the Buddha. He presents Buddhism as a rational, socially engaged religion of equality, sharply contrasting it with Brahminic Hinduism. Considered the scripture of the Navayana Buddhist movement.',
    summaryHi: 'यह अंबेडकर की महान रचना है, जो उनकी मृत्यु से कुछ समय पहले लिखी गई थी। इसमें बुद्ध के जीवन और दर्शन का पूर्ण पुनर्कथन है।',
    summaryMr: 'हे आंबेडकरांचे महान काम आहे, जे त्यांच्या मृत्यूपूर्वी लिहिले गेले. यात बुद्धाच्या जीवन आणि तत्त्वज्ञानाचे संपूर्ण पुनर्कथन आहे.',
    tags: ['buddhism', 'dhamma', 'religion', 'philosophy', 'navayana', 'conversion'],
    source: 'BAWS Vol. 11 (Dr. Ambedkar Foundation)',
    publisher: 'Siddharth College Publications',
    pageCount: 448,
    isFeatured: true,
    isPublic: true,
    searchKeywords: ['buddha', 'dhamma', 'pali', 'sangha', 'nirvana', 'four noble truths', 'eightfold path', 'navayana', 'ambedkar buddhism'],
    fullText: 'Part I — From Birth to Parivraja\n\nSection 1 — The Boy\n\nThe story of the Buddha starts with his birth. Maya, his mother, was on her way from Kapilavastu to her parent\'s home at Devadaha. She stopped to rest in the Lumbini Grove. It was here that the Buddha was born...',
    imageUrl: '',
  },
  {
    title: 'Pakistan or the Partition of India',
    titleHi: 'पाकिस्तान या भारत का विभाजन',
    titleMr: 'पाकिस्तान किंवा भारताची फाळणी',
    category: 'book',
    language: ['en'],
    year: 1940,
    summary: 'A comprehensive analysis of the demand for Pakistan by the Muslim League. Ambedkar, approaching the question as a constitutional lawyer and social scientist, argues that partition may be unavoidable and examines its political, social, and economic consequences with characteristic rigor.',
    summaryHi: 'मुस्लिम लीग की पाकिस्तान की मांग का एक व्यापक विश्लेषण। अंबेडकर ने एक संवैधानिक वकील और समाज वैज्ञानिक के रूप में विभाजन की अनिवार्यता का परीक्षण किया।',
    summaryMr: 'मुस्लिम लीगच्या पाकिस्तानच्या मागणीचे सर्वसमावेशक विश्लेषण.',
    tags: ['partition', 'pakistan', 'constitution', 'minority', 'communalism'],
    source: 'BAWS Vol. 8 (Dr. Ambedkar Foundation)',
    pageCount: 430,
    isFeatured: false,
    isPublic: true,
    searchKeywords: ['pakistan', 'partition', 'jinnah', 'muslim league', 'communal problem', 'minority rights', 'two nation theory'],
    imageUrl: '',
  },
  {
    title: 'States and Minorities',
    titleHi: 'राज्य और अल्पसंख्यक',
    titleMr: 'राज्ये आणि अल्पसंख्याक',
    category: 'book',
    language: ['en'],
    year: 1947,
    summary: 'Submitted to the Constituent Assembly as a memorandum on behalf of the Scheduled Castes Federation, this document outlines the constitutional safeguards needed for minorities and Dalits in independent India. It is essentially a draft constitution for the protection of the untouchables.',
    summaryHi: 'यह दस्तावेज़ संविधान सभा को अनुसूचित जाति महासंघ की ओर से एक ज्ञापन के रूप में प्रस्तुत किया गया था।',
    summaryMr: 'हे दस्तावेज अनुसूचित जाती महासंघाच्या वतीने संविधान सभेला सादर केले गेले.',
    tags: ['constitution', 'minorities', 'scheduled castes', 'safeguards', 'federalism'],
    source: 'BAWS Vol. 1 (Dr. Ambedkar Foundation)',
    pageCount: 88,
    isFeatured: false,
    isPublic: true,
    searchKeywords: ['scheduled castes', 'minority rights', 'constitutional safeguards', 'reserved seats', 'state socialism'],
    imageUrl: '',
  },
  {
    title: 'Castes in India: Their Mechanism, Genesis and Development',
    titleHi: 'भारत में जातियाँ: उनका तंत्र, उत्पत्ति और विकास',
    titleMr: 'भारतातील जाती: त्यांची यंत्रणा, उत्पत्ती आणि विकास',
    category: 'book',
    language: ['en'],
    year: 1916,
    summary: 'Ambedkar\'s first major paper, delivered at Columbia University when he was just 25 years old. He argues that the caste system is fundamentally defined by the practice of endogamy (marriage within caste), not by hereditary occupation. A seminal academic contribution to understanding Indian society.',
    summaryHi: 'यह अंबेडकर का पहला प्रमुख पेपर है, जो उन्होंने मात्र 25 वर्ष की आयु में कोलंबिया विश्वविद्यालय में प्रस्तुत किया था।',
    summaryMr: 'हा आंबेडकरांचा पहिला महत्त्वाचा पेपर आहे, जो त्यांनी फक्त 25 वर्षांच्या वयात कोलंबिया विद्यापीठात सादर केला.',
    tags: ['caste', 'endogamy', 'sociology', 'columbia', 'academic', 'origin of caste'],
    source: 'BAWS Vol. 1 (Dr. Ambedkar Foundation)',
    publisher: 'Indian Antiquary',
    pageCount: 40,
    isFeatured: true,
    isPublic: true,
    searchKeywords: ['columbia university', 'endogamy', 'exogamy', 'caste mechanism', 'sati', 'child marriage', 'brahmin'],
    imageUrl: '',
  },
  {
    title: 'The Problem of the Rupee',
    titleHi: 'रुपये की समस्या',
    titleMr: 'रुपयाची समस्या',
    category: 'book',
    language: ['en'],
    year: 1923,
    summary: 'Ambedkar\'s doctoral dissertation at the London School of Economics, which laid the groundwork for the establishment of the Reserve Bank of India. It provides a meticulous analysis of Indian monetary policy, currency, and the gold standard. Keynes praised it as an important contribution.',
    summaryHi: 'लंदन स्कूल ऑफ इकोनॉमिक्स में अंबेडकर की डॉक्टरल थीसिस जिसने भारतीय रिज़र्व बैंक की स्थापना की नींव रखी।',
    summaryMr: 'लंडन स्कूल ऑफ इकोनॉमिक्समधील आंबेडकरांचा डॉक्टरल प्रबंध, ज्याने रिझर्व्ह बँक ऑफ इंडियाच्या स्थापनेचा पाया घातला.',
    tags: ['economics', 'RBI', 'monetary policy', 'rupee', 'gold standard', 'LSE'],
    source: 'BAWS Vol. 6 (Dr. Ambedkar Foundation)',
    pageCount: 224,
    isFeatured: false,
    isPublic: true,
    searchKeywords: ['reserve bank india', 'RBI', 'monetary reform', 'currency', 'gold exchange', 'keynes', 'LSE'],
    imageUrl: '',
  },

  // ═══════════════════════════════════════════════════
  // SPEECHES & DEBATES
  // ═══════════════════════════════════════════════════
  {
    title: 'Constituent Assembly Debate — Presenting the Draft Constitution',
    titleHi: 'संविधान सभा वाद-विवाद — मसौदा संविधान प्रस्तुत करना',
    titleMr: 'संविधान सभा वादविवाद — मसुदा संविधान सादर करणे',
    category: 'debate',
    language: ['en', 'hi'],
    year: 1949,
    summary: 'Ambedkar\'s historic closing speech in the Constituent Assembly on November 25, 1949, one day before the Constitution was adopted. He warned that political democracy must be accompanied by social and economic democracy, and cautioned against "hero worship" and the dangers of abandoning constitutional methods.',
    summaryHi: '25 नवंबर 1949 को संविधान सभा में अंबेडकर का ऐतिहासिक समापन भाषण। उन्होंने चेतावनी दी कि राजनीतिक लोकतंत्र के साथ सामाजिक और आर्थिक लोकतंत्र भी होना चाहिए।',
    summaryMr: '25 नोव्हेंबर 1949 रोजी संविधान सभेत आंबेडकरांचे ऐतिहासिक समारोप भाषण.',
    tags: ['constitution', 'democracy', 'constituent assembly', 'social democracy', 'liberty equality fraternity'],
    source: 'Constituent Assembly Debates, Vol. XI',
    year: 1949,
    pageCount: 24,
    isFeatured: true,
    isPublic: true,
    searchKeywords: ['constituent assembly', 'constitution november 1949', 'gramdan', 'hero worship', 'john dewey', 'liberty equality fraternity', 'bhakti in politics'],
    fullText: `Mr. Vice-President, My thanks are due to the House for having passed the Constitution. When I remember that the Constitution is a work of barely three years, I feel rather surprised that we have been able to produce a document of this nature in so short a time.\n\nI feel, however good a Constitution may be, it is sure to turn out bad because those who are called to work it, happen to be a bad lot. However bad a Constitution may be, it may turn out to be good if those who are called to work it, happen to be a good lot.\n\nOn 26th January 1950, India will be an independent country. What would happen to her independence? Will she maintain her independence or will she lose it again? This is the first thought that comes to my mind. It is not that India was never an independent country. The point is that she once lost the independence she had. Will she lose it a second time?\n\nIn politics, Bhakti (devotion) or hero worship is a sure road to degradation and to eventual dictatorship.`,
    imageUrl: '',
  },
  {
    title: 'Poona Pact — Address After Signing',
    titleHi: 'पूना पैक्ट — हस्ताक्षर के बाद संबोधन',
    titleMr: 'पुणे करार — स्वाक्षरीनंतर भाषण',
    category: 'speech',
    language: ['en'],
    year: 1932,
    summary: 'Delivered after Ambedkar signed the Poona Pact with Gandhi in September 1932, ending Gandhi\'s fast unto death. Ambedkar explained his position and the concessions he made under extreme pressure, giving up separate electorates for Scheduled Castes in exchange for reserved seats.',
    summaryHi: 'यह भाषण सितंबर 1932 में गांधी के साथ पूना पैक्ट पर हस्ताक्षर करने के बाद दिया गया। अंबेडकर ने अत्यधिक दबाव में किए गए समझौते की व्याख्या की।',
    summaryMr: 'सप्टेंबर 1932 मध्ये गांधींसोबत पुणे करारावर स्वाक्षरी केल्यानंतर हे भाषण दिले गेले.',
    tags: ['poona pact', 'gandhi', 'separate electorate', 'reserved seats', 'fasting', 'untouchability'],
    source: 'BAWS Vol. 9 (Dr. Ambedkar Foundation)',
    pageCount: 12,
    isFeatured: true,
    isPublic: true,
    searchKeywords: ['poona pact', 'gandhi fast', 'separate electorate', 'communal award', 'reserved seats', 'ramsay macdonald'],
    fullText: 'I have signed the agreement which has been registered in the name of the Poona Pact. I wish to make it clear that the Untouchables have not got what they were entitled to under the Communal Award. The Communal Award was the result of a demand made by us and what we got under it was the right of choosing our own representatives by a separate electorate...\n\nThe fast of Mahatma Gandhi came as a shock to the Untouchables. There was every likelihood that the fast would be fatal to Mahatma Gandhi. I had to make a choice — between my scheme of separate electorates and the life of Mr. Gandhi.',
    imageUrl: '',
  },
  {
    title: 'Yeola Conversion Declaration',
    titleHi: 'येओला धर्मांतरण घोषणा',
    titleMr: 'येवला धर्मांतरण घोषणा',
    category: 'speech',
    language: ['en', 'mr'],
    year: 1935,
    summary: 'At a conference in Yeola (now Yeवला) in 1935, Ambedkar made his historic declaration: "I was born a Hindu, but I will not die a Hindu." He announced his intention to convert to another religion to escape the degradation of untouchability, setting in motion his 21-year journey toward Buddhism.',
    summaryHi: '1935 में येओला में एक सम्मेलन में, अंबेडकर ने अपनी ऐतिहासिक घोषणा की: "मैं हिंदू पैदा हुआ था, लेकिन हिंदू के रूप में नहीं मरूंगा।"',
    summaryMr: '1935 मध्ये येवल्यातील परिषदेत आंबेडकरांनी ऐतिहासिक घोषणा केली: "मी हिंदू म्हणून जन्मलो, पण हिंदू म्हणून मरणार नाही."',
    tags: ['conversion', 'religion', 'hindu', 'untouchability', 'yeola', 'declaration'],
    source: 'BAWS Vol. 17 (Dr. Ambedkar Foundation)',
    pageCount: 8,
    isFeatured: true,
    isPublic: true,
    searchKeywords: ['yeola', 'conversion declaration', 'born hindu will not die hindu', 'religion of equality', 'dignity'],
    imageUrl: '',
  },
  {
    title: 'Mahad Satyagraha — Address to the Conference',
    titleHi: 'महाड़ सत्याग्रह — सम्मेलन में संबोधन',
    titleMr: 'महाड सत्याग्रह — परिषदेतील भाषण',
    category: 'speech',
    language: ['en', 'mr'],
    year: 1927,
    summary: 'Delivered at the Mahad Conference in 1927, where Ambedkar led untouchables to drink water from the public Chavadar Tank, asserting their right as citizens. He also burned the Manusmriti publicly. This is considered the starting point of the Dalit civil rights movement in India.',
    summaryHi: '1927 में महाड़ सम्मेलन में दिया गया भाषण, जहां अंबेडकर ने अछूतों को सार्वजनिक चवदार तालाब से पानी पीने का नेतृत्व किया।',
    summaryMr: '1927 मध्ये महाड परिषदेत दिलेले भाषण. येथे आंबेडकरांनी अस्पृश्यांना सार्वजनिक चवदार तळ्यातून पाणी पिण्याचे नेतृत्व केले.',
    tags: ['mahad', 'satyagraha', 'chavadar tank', 'manusmriti', 'civil rights', 'water rights'],
    source: 'BAWS Vol. 17 (Dr. Ambedkar Foundation)',
    pageCount: 16,
    isFeatured: false,
    isPublic: true,
    searchKeywords: ['mahad', 'chavadar tank', 'manusmriti burning', 'civil rights', '1927', 'dalit movement'],
    imageUrl: '',
  },
  {
    title: 'Round Table Conference — Second Session Address',
    titleHi: 'गोलमेज सम्मेलन — दूसरे सत्र में संबोधन',
    titleMr: 'गोलमेज परिषद — दुसऱ्या अधिवेशनातील भाषण',
    category: 'speech',
    language: ['en'],
    year: 1931,
    summary: 'Ambedkar\'s powerful address at the Second Round Table Conference in London (1931), where he represented the Depressed Classes and argued for separate electorates and political representation. His speeches here put untouchability on the international political agenda for the first time.',
    summaryHi: 'लंदन में दूसरे गोलमेज सम्मेलन (1931) में अंबेडकर का शक्तिशाली भाषण, जहां उन्होंने दलित वर्गों का प्रतिनिधित्व किया।',
    summaryMr: 'लंडनमधील दुसऱ्या गोलमेज परिषदेत (1931) आंबेडकरांचे शक्तिशाली भाषण.',
    tags: ['round table', 'london', 'depressed classes', 'separate electorate', 'colonial', 'minorities'],
    source: 'BAWS Vol. 2 (Dr. Ambedkar Foundation)',
    pageCount: 20,
    isFeatured: false,
    isPublic: true,
    searchKeywords: ['round table conference', 'london 1931', 'depressed classes', 'british india', 'communal award'],
    imageUrl: '',
  },

  // ═══════════════════════════════════════════════════
  // MANUSCRIPTS
  // ═══════════════════════════════════════════════════
  {
    title: 'Riddles in Hinduism (Manuscript)',
    titleHi: 'हिंदुत्व में पहेलियाँ (पांडुलिपि)',
    titleMr: 'हिंदुत्वातील कोडी (हस्तलिखित)',
    category: 'manuscript',
    language: ['en'],
    year: 1955,
    summary: 'An unfinished manuscript found among Ambedkar\'s papers after his death, published posthumously. It is a critical examination of Hindu scriptures, myths, and practices, written with forensic detail. Ambedkar interrogates the contradictions within the Vedas, the Ramayana, and the Mahabharata.',
    tags: ['hinduism', 'vedas', 'ramayana', 'mahabharata', 'manuscript', 'criticism'],
    source: 'BAWS Vol. 4 (Dr. Ambedkar Foundation)',
    pageCount: 312,
    isFeatured: false,
    isPublic: true,
    searchKeywords: ['riddles hinduism', 'rama', 'krishna', 'vedic religion', 'brahmin supremacy', 'manuscript'],
    imageUrl: '',
  },
  {
    title: 'The Buddha or Karl Marx (Manuscript)',
    titleHi: 'बुद्ध या कार्ल मार्क्स (पांडुलिपि)',
    titleMr: 'बुद्ध किंवा कार्ल मार्क्स (हस्तलिखित)',
    category: 'manuscript',
    language: ['en'],
    year: 1956,
    summary: 'A comparative study written by Ambedkar in the last months of his life, contrasting the methods and aims of Buddhism and Marxism. He concludes that while Marx correctly diagnosed the problem of exploitation, the Buddha provided a superior path to liberation through dhamma rather than violent revolution.',
    tags: ['buddhism', 'marxism', 'communism', 'class struggle', 'dhamma', 'philosophy'],
    source: 'BAWS Vol. 3 (Dr. Ambedkar Foundation)',
    pageCount: 48,
    isFeatured: false,
    isPublic: true,
    searchKeywords: ['buddha marx', 'communism buddhism', 'class struggle', 'dhamma way', 'socialism', 'exploitation'],
    imageUrl: '',
  },
];

const mediaItems = [
  {
    title: 'Dr. Ambedkar\'s Last Public Speech — Kathmandu (1956)',
    titleHi: 'डॉ. अंबेडकर का अंतिम सार्वजनिक भाषण — काठमांडू (1956)',
    type: 'speech',
    embedUrl: '',
    thumbnail: '',
    duration: 2400,
    year: 1956,
    language: ['en'],
    description: 'Dr. B.R. Ambedkar\'s last public speech delivered at the World Buddhist Conference in Kathmandu, Nepal in November 1956, just weeks before his passing on December 6, 1956.',
    tags: ['last speech', 'kathmandu', 'buddhism', '1956'],
    isFeatured: true,
  },
  {
    title: 'Constituent Assembly Debates — Visual Archive',
    titleHi: 'संविधान सभा वाद-विवाद — दृश्य संग्रह',
    type: 'documentary',
    embedUrl: '',
    thumbnail: '',
    duration: 3600,
    year: 1949,
    language: ['en', 'hi'],
    description: 'Archival footage and audio recordings from the Constituent Assembly debates where Dr. Ambedkar led the drafting of India\'s Constitution.',
    tags: ['constituent assembly', 'constitution', 'parliament', 'historic'],
    isFeatured: true,
  },
  {
    title: 'Nagpur Conversion Ceremony (1956)',
    titleHi: 'नागपुर धर्मांतरण समारोह (1956)',
    type: 'newsreel',
    embedUrl: '',
    thumbnail: '',
    duration: 1800,
    year: 1956,
    language: ['en', 'hi', 'mr'],
    description: 'The historic mass conversion ceremony at Nagpur on October 14, 1956, where Dr. Ambedkar and 600,000 followers embraced Buddhism — the largest mass religious conversion in modern history.',
    tags: ['conversion', 'nagpur', 'buddhism', 'mass conversion', '1956'],
    isFeatured: true,
  },
  {
    title: 'Mahad Satyagraha Documentary',
    type: 'documentary',
    embedUrl: '',
    thumbnail: '',
    duration: 2700,
    year: 1927,
    language: ['en', 'mr'],
    description: 'Documentary coverage of the Mahad Satyagraha of 1927 — the first civil rights movement in modern India led by Dr. Ambedkar to assert the right of untouchables to use public water.',
    tags: ['mahad', 'satyagraha', 'civil rights', 'water rights'],
    isFeatured: false,
  },
  {
    title: 'Interview with Dr. Ambedkar — BBC (1955)',
    titleHi: 'डॉ. अंबेडकर के साथ साक्षात्कार — BBC (1955)',
    type: 'interview',
    embedUrl: '',
    thumbnail: '',
    duration: 2100,
    year: 1955,
    language: ['en'],
    description: 'A rare BBC interview with Dr. Ambedkar where he discusses Buddhism, caste, democracy, and his vision for India.',
    tags: ['BBC', 'interview', 'buddhism', 'democracy'],
    isFeatured: true,
  },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await Document.deleteMany({});
    await Media.deleteMany({});

    console.log('📚 Seeding documents...');
    const seededDocs = await Document.insertMany(documents);
    console.log(`   ✅ ${seededDocs.length} documents seeded`);

    console.log('🎬 Seeding media...');
    const seededMedia = await Media.insertMany(mediaItems);
    console.log(`   ✅ ${seededMedia.length} media items seeded`);

    // Create demo admin user
    const adminExists = await User.findOne({ email: 'admin@ambedkar-archive.in' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@ambedkar-archive.in',
        password: 'Admin@1234',
        role: 'admin',
        language: 'en',
      });
      console.log('👤 Demo admin created: admin@ambedkar-archive.in / Admin@1234');
    }

    const researcherExists = await User.findOne({ email: 'researcher@ambedkar-archive.in' });
    if (!researcherExists) {
      await User.create({
        name: 'Demo Researcher',
        email: 'researcher@ambedkar-archive.in',
        password: 'Research@1234',
        role: 'researcher',
        language: 'en',
        institution: 'Dr. Ambedkar International Centre',
      });
      console.log('👤 Demo researcher created: researcher@ambedkar-archive.in / Research@1234');
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   📄 Documents: ${seededDocs.length}`);
    console.log(`   🎬 Media: ${seededMedia.length}`);
    console.log('   👥 Demo users: admin + researcher');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDatabase();
