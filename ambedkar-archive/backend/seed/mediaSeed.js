/**
 * mediaSeed.js — Curated collection of Dr. B. R. Ambedkar's historical speeches,
 * BBC interviews, Constituent Assembly recordings, and the BAWS Hindi Audiobook playlist.
 */

const HISTORIC_MEDIA = [
  // ══════════════════════════════════════════════════════════════════
  // 1. HISTORIC ARCHIVES & CONSTITUENT ASSEMBLY SPEECHES (YOUTUBE)
  // ══════════════════════════════════════════════════════════════════
  {
    title: 'Historic First Address to the Constituent Assembly (Dec 17, 1946)',
    titleHi: 'संविधान सभा में प्रथम ऐतिहासिक भाषण (१७ दिसंबर १९४६)',
    titleMr: 'घटना समितीतील पहिले ऐतिहासिक भाषण',
    type: 'speech',
    url: 'https://www.youtube.com/watch?v=kYV3nJ_5_W8',
    embedUrl: 'https://www.youtube.com/embed/kYV3nJ_5_W8',
    thumbnail: 'https://i.ytimg.com/vi/kYV3nJ_5_W8/hqdefault.jpg',
    duration: 1260,
    year: 1946,
    language: ['en', 'hi'],
    speaker: 'Dr. B. R. Ambedkar',
    date: 'December 17, 1946',
    description: 'Dr. Ambedkar delivering his visionary uninvited speech in the Constituent Assembly, declaring: "I know today we are divided politically, socially and economically... but with all our differences, I have not the slightest doubt that we shall in some form be a united people."',
    source: 'Prasar Bharati Archives / All India Radio',
    tags: ['Constituent Assembly', 'Unity of India', 'Founding Speech', 'Prasar Bharati'],
    isFeatured: true,
    transcript: [
      { time: '00:00', text: 'Mr. Chairman, Sir, I have not had the opportunity of speaking on this Resolution before.' },
      { time: '02:15', text: 'I know today we are divided politically, socially and economically. We are a group of warring camps and I probably am one of the leaders of such a camp.' },
      { time: '05:40', text: 'But, Sir, with all our differences, I have not the slightest doubt that we shall in some form be a united people.' },
      { time: '09:30', text: 'Sovereignty resides in the people, and no group can deny liberty and equality to the millions of this country.' },
      { time: '14:20', text: 'Let us place the country above all differences and forge a Constitution worthy of free India.' }
    ]
  },
  {
    title: 'Presentation of the Draft Constitution to Constituent Assembly (Nov 4, 1948)',
    titleHi: 'प्रारूप संविधान सभा में प्रस्तुत (४ नवंबर १९४८)',
    titleMr: 'मसुदा संविधान सादर करतानाचे भाषण',
    type: 'debate',
    url: 'https://www.youtube.com/watch?v=3g5YyY2uU7o',
    embedUrl: 'https://www.youtube.com/embed/3g5YyY2uU7o',
    thumbnail: 'https://i.ytimg.com/vi/3g5YyY2uU7o/hqdefault.jpg',
    duration: 1800,
    year: 1948,
    language: ['en'],
    speaker: 'Dr. B. R. Ambedkar',
    date: 'November 4, 1948',
    description: 'Dr. Ambedkar presenting the final draft of the Indian Constitution, detailing the parliamentary system, federal structure with single citizenship, and fundamental rights guarantees.',
    source: 'Prasar Bharati Archives / Sansad TV',
    tags: ['Draft Constitution', 'Parliamentary Democracy', 'Fundamental Rights', 'Constituent Assembly'],
    isFeatured: true,
    transcript: [
      { time: '00:00', text: 'Sir, I move that the Constitution as settled by the Assembly be taken into consideration.' },
      { time: '04:10', text: 'The Draft Constitution has adopted the Parliamentary system of Government in preference to the Presidential system.' },
      { time: '08:45', text: 'A student of constitutional law will recognize that there is only one citizenship for the whole of India—there is no State citizenship.' },
      { time: '15:20', text: 'Constitutional morality is not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it.' }
    ]
  },
  {
    title: 'Rare BBC Television Interview: "The Social Structure Must Change" (1953)',
    titleHi: 'दुर्लभ बीबीसी टीवी साक्षात्कार: "सामाजिक संरचना बदलनी चाहिए" (१९५३)',
    titleMr: 'बीबीसी टीव्ही मुलाखत (१९५३)',
    type: 'interview',
    url: 'https://www.youtube.com/watch?v=WY0Q56VlZ9E',
    embedUrl: 'https://www.youtube.com/embed/WY0Q56VlZ9E',
    thumbnail: 'https://i.ytimg.com/vi/WY0Q56VlZ9E/hqdefault.jpg',
    duration: 540,
    year: 1953,
    language: ['en'],
    speaker: 'Dr. B. R. Ambedkar & BBC Host',
    date: 'May 1953',
    description: 'Dr. Ambedkar’s rare televised interview with the BBC in London discussing democracy, why Indian social hierarchy threatens democratic stability, and the urgent necessity of social equality.',
    source: 'BBC News Archives',
    tags: ['BBC Interview', 'Democracy', 'Social Structure', 'Electoral Reform'],
    isFeatured: true,
    transcript: [
      { time: '00:00', text: 'BBC: Dr. Ambedkar, do you think parliamentary democracy will succeed in India?' },
      { time: '01:15', text: 'Dr. Ambedkar: Democracy is only a top-dressing on Indian soil which is essentially undemocratic.' },
      { time: '03:40', text: 'Unless you change the social structure, you cannot make democracy work in reality.' },
      { time: '06:20', text: 'Equality must be granted in daily life, otherwise democracy becomes an empty political formality.' }
    ]
  },
  {
    title: 'Historic Conversion to Buddhism at Deekshabhoomi, Nagpur (Oct 14, 1956)',
    titleHi: 'दीक्षाभूमि नागपुर में बौद्ध धम्म दीक्षा एवं २२ प्रतिज्ञाएं (१९५६)',
    titleMr: 'दीक्षाभूमी नागपूर धम्मचक्र प्रवर्तन',
    type: 'newsreel',
    url: 'https://www.youtube.com/watch?v=kVKmUuBBWzw',
    embedUrl: 'https://www.youtube.com/embed/kVKmUuBBWzw',
    thumbnail: 'https://i.ytimg.com/vi/kVKmUuBBWzw/hqdefault.jpg',
    duration: 720,
    year: 1956,
    language: ['mr', 'hi', 'en'],
    speaker: 'Dr. B. R. Ambedkar',
    date: 'October 14, 1956',
    description: 'Historic newsreel coverage and audio recording of Dr. Babasaheb Ambedkar leading over 500,000 followers into Buddhism and administering the historic 22 Vows at Deekshabhoomi, Nagpur.',
    source: 'Films Division of India / Archival Newsreel',
    tags: ['Deekshabhoomi', 'Buddhism', '22 Vows', 'Dhamma Chakra Pravartan', 'Nagpur'],
    isFeatured: true,
    transcript: [
      { time: '00:00', text: 'Over half a million people assemble at Nagpur on Vijaya Dashami for the historic Dhamma initiation.' },
      { time: '02:30', text: 'Dr. Ambedkar administers the 22 vows renouncing social discrimination and embracing the path of the Buddha.' },
      { time: '06:00', text: 'Religion must be based on reason, morality, and fraternity.' }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // 2. YOUTUBE PLAYLIST: DR. BABASAHAB AMBEDKAR HINDI SPEECHES & WORKS
  // (Source: https://www.youtube.com/playlist?list=PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)
  // ══════════════════════════════════════════════════════════════════
  {
    title: 'Dr. Babasaheb Ambedkar Writings & Speeches HINDI Vol. 1 Overview',
    titleHi: 'डॉ. बाबासाहेब आंबेडकर वाङ्मय एवं भाषण (हिंदी खंड १) परिचयात्मक विश्लेषण',
    titleMr: 'डॉ. आंबेडकर साहित्य व भाषणे हिंदी खंड १',
    type: 'lecture',
    url: 'https://www.youtube.com/watch?v=4H0v4V0IR-Q',
    embedUrl: 'https://www.youtube.com/embed/4H0v4V0IR-Q',
    thumbnail: 'https://i.ytimg.com/vi/4H0v4V0IR-Q/hqdefault.jpg',
    duration: 980,
    year: 1979,
    language: ['hi'],
    speaker: 'BAWS Hindi Audio Archive',
    date: 'BAWS Vol. 1 Audio Series',
    description: 'Comprehensive chapter breakdown and analytical introduction to Dr. B. R. Ambedkar’s official Hindi Volume 1 (Castes in India, Annihilation of Caste, and Social Essays).',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Hindi BAWS', 'Volume 1', 'Audiobook', 'Caste Annihilation'],
    isFeatured: true,
    transcript: [
      { time: '00:00', text: 'डॉ. बाबासाहेब आंबेडकर के विचार आज भी सामाजिक न्याय के मार्गदर्शक हैं।' },
      { time: '03:15', text: 'खंड १ में उनके प्रारंभिक और सबसे प्रभावशाली लेखों का संग्रह है।' },
      { time: '08:40', text: 'जाति प्रथा के उन्मूलन का मूल उद्देश्य मानवीय गरिमा और बंधुत्व की स्थापना है।' }
    ]
  },
  {
    title: 'Annihilation of Caste Complete Hindi Audiobook (जातिप्रथा उन्मूलन)',
    titleHi: 'जातिप्रथा उन्मूलन (Annihilation of Caste) संपूर्ण हिंदी ऑडियोबुक',
    titleMr: 'जातीचे उच्चाटन संपूर्ण हिंदी ऑडिओ',
    type: 'speech',
    url: 'https://www.youtube.com/watch?v=N1Q5BdZJq6g',
    embedUrl: 'https://www.youtube.com/embed/N1Q5BdZJq6g',
    thumbnail: 'https://i.ytimg.com/vi/N1Q5BdZJq6g/hqdefault.jpg',
    duration: 3600,
    year: 1936,
    language: ['hi'],
    speaker: 'Dr. B. R. Ambedkar (Hindi Narration)',
    date: 'May 1936 Original',
    description: 'Complete Hindi narration of Dr. Ambedkar’s most famous treatise "Annihilation of Caste", dissecting religious orthodoxy, untouchability, and the moral requirement for equality.',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Annihilation of Caste', 'Hindi Audiobook', 'Jat-Pat-Todak Mandal', 'Social Reform'],
    isFeatured: true,
    transcript: [
      { time: '00:00', text: 'जाति कोई ईंटों की दीवार नहीं है जिसे तोड़ा जा सके; यह एक मानसिक स्थिति है।' },
      { time: '10:00', text: 'जाति व्यवस्था केवल श्रम का विभाजन नहीं है, बल्कि श्रमिकों का विभाजन है।' },
      { time: '25:30', text: 'जब तक समाज में स्वतंत्रता, समानता और बंधुत्व का भाव नहीं होगा, तब तक वास्तविक जनतंत्र संभव नहीं है।' },
      { time: '45:00', text: 'शास्त्रों की सत्ता को चुनौती दिए बिना जाति का समूल नाश असंभव है।' }
    ]
  },
  {
    title: 'Castes in India: Genesis, Mechanism and Spread (भारत में जातिप्रथा)',
    titleHi: 'भारत में जातिप्रथा - संरचना, उत्पत्ति और विकास (हिंदी व्याख्यान)',
    titleMr: 'भारतातील जाती - रचना व उत्पत्ती',
    type: 'speech',
    url: 'https://www.youtube.com/watch?v=GsR6ChAiTHU',
    embedUrl: 'https://www.youtube.com/embed/GsR6ChAiTHU',
    thumbnail: 'https://i.ytimg.com/vi/GsR6ChAiTHU/hqdefault.jpg',
    duration: 1450,
    year: 1916,
    language: ['hi', 'en'],
    speaker: 'Dr. B. R. Ambedkar (Columbia Paper)',
    date: 'May 9, 1916 Original',
    description: 'Dr. Ambedkar’s seminal paper presented at Columbia University in New York under Prof. Alexander Goldenweiser, explaining endogamy as the core mechanism creating the caste system.',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Columbia University', 'Endogamy', 'Anthropology', 'Castes in India'],
    isFeatured: true,
    transcript: [
      { time: '00:00', text: 'कोलंबिया विश्वविद्यालय न्यूयॉर्क में प्रस्तुत ऐतिहासिक शोध पत्र।' },
      { time: '04:20', text: 'सगोत्र विवाह (Endogamy) ही जाति व्यवस्था के अस्तित्व का मुख्य आधार है।' },
      { time: '10:15', text: 'एक वर्ग ने स्वयं को बंद कर लिया, जिससे अन्य समूहों को भी बंद होना पड़ा।' }
    ]
  },
  {
    title: 'Ranade, Gandhi & Jinnah Complete Hindi Audiobook (रानाडे, गाँधी और जिन्ना)',
    titleHi: 'रानाडे, गाँधी और जिन्ना - संपूर्ण विश्लेषण (हिंदी ऑडियोबुक)',
    titleMr: 'रानडे, गांधी आणि जिन्ना',
    type: 'speech',
    url: 'https://www.youtube.com/watch?v=KW7VBaYAxNg',
    embedUrl: 'https://www.youtube.com/embed/KW7VBaYAxNg',
    thumbnail: 'https://i.ytimg.com/vi/KW7VBaYAxNg/hqdefault.jpg',
    duration: 2700,
    year: 1943,
    language: ['hi'],
    speaker: 'Dr. B. R. Ambedkar (Address at Gokhale Institute)',
    date: 'January 18, 1943',
    description: 'Dr. Ambedkar’s address on the 101st birthday celebration of Justice Mahadev Govind Ranade in Poona, offering a comparative analysis of leadership, hero worship, and democratic statesmanship.',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Ranade', 'Gandhi', 'Jinnah', 'Leadership', 'Political Philosophy'],
    isFeatured: true,
    transcript: [
      { time: '00:00', text: 'गोखले राजनीति संस्थान पूना में दिया गया ऐतिहासिक भाषण।' },
      { time: '08:30', text: 'महान व्यक्ति की परिभाषा क्या है? केवल शक्ति या जनसमर्थन नहीं, बल्कि नैतिक दिशा।' },
      { time: '18:45', text: 'राजनीति में भक्ति अथवा व्यक्तित्व-पूजा अधिनायकवाद और पतन का निश्चित मार्ग है।' }
    ]
  },
  {
    title: 'Dr. Ambedkar’s Reply to Mahatma Gandhi (महात्मा गाँधी को डॉ. आंबेडकर का उत्तर)',
    titleHi: 'महात्मा गाँधी के विचारों पर डॉ. आंबेडकर का ऐतिहासिक प्रत्युत्तर',
    titleMr: 'महात्मा गांधींना डॉ. आंबेडकरांचे प्रत्युत्तर',
    type: 'debate',
    url: 'https://www.youtube.com/watch?v=7FtPxq_J3Xc',
    embedUrl: 'https://www.youtube.com/embed/7FtPxq_J3Xc',
    thumbnail: 'https://i.ytimg.com/vi/7FtPxq_J3Xc/hqdefault.jpg',
    duration: 1120,
    year: 1936,
    language: ['hi'],
    speaker: 'Debate: Ambedkar vs Gandhi on Varna & Caste',
    date: '1936 Appendix to Annihilation of Caste',
    description: 'Dr. Ambedkar’s rejoinder to Mahatma Gandhi’s review in "Harijan", debating the feasibility of ideal Varna vyavastha versus the reality of caste oppression.',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Gandhi Debate', 'Varna System', 'Harijan Review', 'Philosophical Debate'],
    isFeatured: false,
    transcript: [
      { time: '00:00', text: 'हरिजन पत्रिका में प्रकाशित महात्मा गांधी की समीक्षा का बिंदुवार उत्तर।' },
      { time: '04:10', text: 'गांधीजी वर्ण व्यवस्था को आदर्श मानते हैं, किंतु व्यवहार में वह केवल जाति और शोषण बनती है।' },
      { time: '09:30', text: 'मानवता का उद्धार जन्म आधारित वर्गीकरण में नहीं, बल्कि समान अवसरों में है।' }
    ]
  },
  {
    title: 'Annihilation of Caste Hindi: Part 1 - Why Hindu Reformers Failed',
    titleHi: 'जातिप्रथा उन्मूलन (भाग १): हिंदू समाज सुधारक असफल क्यों रहे?',
    titleMr: 'जातीचे उच्चाटन भाग १',
    type: 'speech',
    url: 'https://www.youtube.com/watch?v=WheIQxIHUPw',
    embedUrl: 'https://www.youtube.com/embed/WheIQxIHUPw',
    thumbnail: 'https://i.ytimg.com/vi/WheIQxIHUPw/hqdefault.jpg',
    duration: 900,
    year: 1936,
    language: ['hi'],
    speaker: 'Dr. B. R. Ambedkar (BAWS Vol. 1)',
    date: '1936',
    description: 'Part 1 of the serialized Annihilation of Caste audio reading: analyzing why political reform without social reform produces fractured nations.',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Annihilation of Caste', 'Part 1', 'Social Reform'],
    isFeatured: false,
    transcript: [
      { time: '00:00', text: 'लाहौर के जात-पात तोड़क मंडल के लिए तैयार किया गया मूल आलेख।' },
      { time: '03:45', text: 'राजनीतिक स्वतंत्रता से पहले सामाजिक मुक्ति अनिवार्य क्यों है।' }
    ]
  },
  {
    title: 'Annihilation of Caste Hindi: Part 2 - Caste is Not Division of Labour',
    titleHi: 'जातिप्रथा उन्मूलन (भाग २): जाति केवल श्रम विभाजन नहीं, श्रमिकों का विभाजन है',
    titleMr: 'जातीचे उच्चाटन भाग २',
    type: 'speech',
    url: 'https://www.youtube.com/watch?v=iokJNKlR_I8',
    embedUrl: 'https://www.youtube.com/embed/iokJNKlR_I8',
    thumbnail: 'https://i.ytimg.com/vi/iokJNKlR_I8/hqdefault.jpg',
    duration: 850,
    year: 1936,
    language: ['hi'],
    speaker: 'Dr. B. R. Ambedkar (BAWS Vol. 1)',
    date: '1936',
    description: 'Part 2 examining economic efficiency arguments: proving caste creates involuntary unemployment by forbidding career choice.',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Economics of Caste', 'Division of Labor', 'Part 2'],
    isFeatured: false,
    transcript: [
      { time: '00:00', text: 'आर्थिक दृष्टि से जाति प्रथा की विवेचना।' },
      { time: '04:10', text: 'मनुष्य को अपनी रुचि और योग्यता के अनुसार व्यवसाय चुनने की स्वतंत्रता होनी चाहिए।' }
    ]
  },
  {
    title: 'Annihilation of Caste Hindi: Part 3 - Caste Destroys Public Spirit',
    titleHi: 'जातिप्रथा उन्मूलन (भाग ३): जाति ने सार्वजनिक चेतना को कैसे नष्ट किया?',
    titleMr: 'जातीचे उच्चाटन भाग ३',
    type: 'speech',
    url: 'https://www.youtube.com/watch?v=ktStz-YWg7Q',
    embedUrl: 'https://www.youtube.com/embed/ktStz-YWg7Q',
    thumbnail: 'https://i.ytimg.com/vi/ktStz-YWg7Q/hqdefault.jpg',
    duration: 890,
    year: 1936,
    language: ['hi'],
    speaker: 'Dr. B. R. Ambedkar (BAWS Vol. 1)',
    date: '1936',
    description: 'Part 3 illustrating how caste loyalty supplants national and humanitarian loyalty, eroding civic ethics.',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Public Spirit', 'Ethics', 'Part 3'],
    isFeatured: false,
    transcript: [
      { time: '00:00', text: 'जाति चेतना और राष्ट्रीय एकता का अंतर्विरोध।' },
      { time: '05:00', text: 'सच्चा लोकतंत्र केवल वोट देने तक सीमित नहीं, बल्कि बंधुत्व की जीवन पद्धति है।' }
    ]
  },
  {
    title: 'Ranade, Gandhi & Jinnah Hindi: Part 1 - Philosophy of Social Reform',
    titleHi: 'रानाडे, गाँधी और जिन्ना (भाग १): सामाजिक सुधार बनाम राजनीतिक सत्ता',
    titleMr: 'रानडे, गांधी आणि जिन्ना भाग १',
    type: 'speech',
    url: 'https://www.youtube.com/watch?v=8QGhwFpR3gw',
    embedUrl: 'https://www.youtube.com/embed/8QGhwFpR3gw',
    thumbnail: 'https://i.ytimg.com/vi/8QGhwFpR3gw/hqdefault.jpg',
    duration: 920,
    year: 1943,
    language: ['hi'],
    speaker: 'Dr. B. R. Ambedkar',
    date: '1943',
    description: 'Part 1 of the Ranade address: evaluating Justice Ranade’s foundational contributions to the Indian social reform movement.',
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    tags: ['Ranade', 'Social Reformers', 'Part 1'],
    isFeatured: false,
    transcript: [
      { time: '00:00', text: 'न्यायमूर्ति रानाडे के सामाजिक सिद्धांतों की आधुनिक प्रासंगिकता।' },
      { time: '04:30', text: 'सामाजिक व्यवस्था को सुधारे बिना राजनीतिक स्वतंत्रता खोखली रहती है।' }
    ]
  }
];

module.exports = { HISTORIC_MEDIA };
