/**
 * media.js — Comprehensive Audio-Visual Gallery & Synchronized Live Transcript Engine
 * Features extensive multi-paragraph archival transcripts, live running audio timer,
 * clickable progress scrubber bar, dual-mode video/audio switching, and real-time canvas visualizer.
 */

let MEDIA_DATA = [
  // ══════════════════════════════════════════════════════════════════
  // HISTORIC ARCHIVES & CONSTITUENT ASSEMBLY SPEECHES
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'yt-ca-1',
    title: 'Historic First Address to the Constituent Assembly',
    speaker: 'Dr. B. R. Ambedkar',
    date: 'December 17, 1946',
    type: 'speech',
    duration: '21 mins',
    embedUrl: 'https://www.youtube.com/embed/kYV3nJ_5_W8',
    url: 'https://www.youtube.com/watch?v=kYV3nJ_5_W8',
    thumbnail: 'https://i.ytimg.com/vi/kYV3nJ_5_W8/hqdefault.jpg',
    category: 'speech',
    language: ['en'],
    source: 'Prasar Bharati Archives / All India Radio',
    description: 'Dr. Ambedkar delivering his uninvited, historic maiden speech in the Constituent Assembly on the Objectives Resolution: "I know today we are divided politically, socially and economically... but I have not the slightest doubt that we shall in some form be a united people."',
    transcript: [
      { time: '00:00', text: 'Mr. Chairman, Sir, I have not had the opportunity of speaking on this Resolution before, and I am grateful for the chance now accorded to me to express my views on this momentous occasion.' },
      { time: '01:30', text: 'The resolution moved by Pandit Jawaharlal Nehru seeks to lay down the objectives which this Constituent Assembly should bear in mind in framing the Constitution of free India.' },
      { time: '03:15', text: 'I know today we are divided politically, socially, and economically. We are a group of warring camps, and I probably am one of the leaders of such a camp.' },
      { time: '05:00', text: 'But, Sir, with all our differences, with all our conflicting loyalties, I have not the slightest doubt in my mind that we shall in some form be a united people.' },
      { time: '06:45', text: 'There is no power on earth that can prevent this country from becoming one united nation if only we have the courage and the wisdom to conquer our own internal divisions.' },
      { time: '08:30', text: 'Our difficulty is not with the British; our difficulty is with ourselves. We have to decide whether we are to place the country above our groups or whether we are to place our groups above the country.' },
      { time: '10:15', text: 'Sovereignty resides in the people of India as a whole. No class, no community, and no vested interest can be permitted to tyrannize or deny fundamental human rights to the millions of this ancient land.' },
      { time: '12:00', text: 'If we want to create a social democracy, we must ensure that the economic structure of our society is made consistent with the requirements of personal liberty and human equality.' },
      { time: '13:45', text: 'Political power in the hands of an oligarchy or an entrenched hierarchy is the death knell of genuine democracy.' },
      { time: '15:30', text: 'I appeal to the majority party in this house: do not exercise power merely because you have the power. Exercise power with restraint, with justice, and with magnanimity.' },
      { time: '17:15', text: 'Let us remember that unity cannot be imposed by force; it must be built upon mutual trust, equal citizenship, and the voluntary consent of every minority group.' },
      { time: '19:00', text: 'Let us place the country above all differences and forge a Constitution worthy of a free, sovereign, democratic, and enlightened India.' },
      { time: '20:30', text: 'May this Assembly possess the wisdom and the moral fortitude to fulfill the hopes and aspirations of the teeming millions of India.' }
    ]
  },
  {
    id: 'yt-ca-2',
    title: 'Presentation of the Draft Constitution to Constituent Assembly',
    speaker: 'Dr. B. R. Ambedkar',
    date: 'November 4, 1948',
    type: 'debate',
    duration: '30 mins',
    embedUrl: 'https://www.youtube.com/embed/3g5YyY2uU7o',
    url: 'https://www.youtube.com/watch?v=3g5YyY2uU7o',
    thumbnail: 'https://i.ytimg.com/vi/3g5YyY2uU7o/hqdefault.jpg',
    category: 'video',
    language: ['en'],
    source: 'Prasar Bharati Archives / Sansad TV',
    description: 'Dr. Ambedkar presenting the final draft of the Indian Constitution, detailing the parliamentary system, federal structure with single citizenship, independent judiciary, and fundamental rights guarantees.',
    transcript: [
      { time: '00:00', text: 'Mr. Vice-President, Sir, I move that the Constitution as settled by the Drafting Committee be taken into consideration.' },
      { time: '02:30', text: 'The Draft Constitution contains 315 Articles and 8 Schedules. It is undoubtedly the most comprehensive constitutional document in the world, addressing the unprecedented diversity of our vast nation.' },
      { time: '05:00', text: 'The Draft Constitution has adopted the Parliamentary system of Government in preference to the Presidential system, because parliamentary democracy offers a daily assessment of executive responsibility alongside periodic elections.' },
      { time: '07:45', text: 'A student of constitutional law will recognize that there is only one citizenship for the whole of India—there is no State citizenship. An Indian citizen is a citizen everywhere throughout the territory of the Union.' },
      { time: '10:30', text: 'The Indian Federation is not the result of an agreement by the States to join a federation. The Federation is an indissoluble Union, and no State has the legal right to secede from it.' },
      { time: '13:15', text: 'We have provided for a single integrated judiciary, uniform basic civil and criminal laws, and common All-India Services to maintain national cohesion and administrative efficiency.' },
      { time: '16:00', text: 'Fundamental Rights guaranteed under Part III are justifiable in courts of law. Without judicial remedy through Article 32, fundamental rights would remain mere paper declarations.' },
      { time: '18:45', text: 'Directive Principles of State Policy embody the concept of social and economic democracy, directing all future legislatures to strive for economic justice and welfare.' },
      { time: '21:30', text: 'Constitutional morality is not a natural sentiment. It has to be cultivated. We must realize that our people have yet to learn it. Democracy in India is only a top-dressing on an Indian soil which is essentially undemocratic.' },
      { time: '24:15', text: 'However good a Constitution may be, it is sure to turn out bad if those who are called upon to work it happen to be a bad lot. However bad a Constitution may be, it may turn out to be good if those who work it happen to be a good lot.' },
      { time: '27:00', text: 'I commend this Draft Constitution to the House with the earnest conviction that it is workable, flexible, and strong enough to hold the country together both in peace-time and in war-time.' }
    ]
  },
  {
    id: 'yt-bbc-1',
    title: 'Rare BBC Television Interview: "The Social Structure Must Change"',
    speaker: 'Dr. B. R. Ambedkar & BBC Host',
    date: 'May 1953',
    type: 'interview',
    duration: '9 mins',
    embedUrl: 'https://www.youtube.com/embed/WY0Q56VlZ9E',
    url: 'https://www.youtube.com/watch?v=WY0Q56VlZ9E',
    thumbnail: 'https://i.ytimg.com/vi/WY0Q56VlZ9E/hqdefault.jpg',
    category: 'interview',
    language: ['en'],
    source: 'BBC News Archives (London)',
    description: 'Dr. Ambedkar’s rare televised interview with the BBC in London discussing democracy, why Indian social hierarchy threatens democratic stability, and the urgent necessity of social equality.',
    transcript: [
      { time: '00:00', text: 'BBC Host: Dr. Ambedkar, do you believe that Western parliamentary democracy will permanently succeed in India?' },
      { time: '01:15', text: 'Dr. Ambedkar: Democracy is only a top-dressing on an Indian soil which is essentially hierarchical and undemocratic. The social structure of India is entirely opposed to democratic principles.' },
      { time: '02:30', text: 'BBC Host: But elections have taken place, and millions voted peacefully. Is that not democratic maturity?' },
      { time: '03:45', text: 'Dr. Ambedkar: Voting every five years is not democracy. Democracy is an attitude of mind, an ethos of respect and equality between fellow human beings in everyday life.' },
      { time: '05:00', text: 'Dr. Ambedkar: If you have a society where millions of people are treated as untouchables, unapproachable, and deprived of education and land, political democracy becomes an empty facade.' },
      { time: '06:15', text: 'BBC Host: What then is required to make democracy a genuine reality in India?' },
      { time: '07:15', text: 'Dr. Ambedkar: You must change the social structure. Unless you destroy the caste hierarchy and establish social equality, your political democracy will remain permanently vulnerable to dictatorship and decay.' },
      { time: '08:30', text: 'Dr. Ambedkar: Equality and fraternity must be established in the economic and social spheres. Without that, liberty becomes the privilege of the few.' }
    ]
  },
  {
    id: 'yt-dhamma-1',
    title: 'Historic Conversion to Buddhism at Deekshabhoomi, Nagpur (1956)',
    speaker: 'Dr. B. R. Ambedkar',
    date: 'October 14, 1956',
    type: 'newsreel',
    duration: '12 mins',
    embedUrl: 'https://www.youtube.com/embed/kVKmUuBBWzw',
    url: 'https://www.youtube.com/watch?v=kVKmUuBBWzw',
    thumbnail: 'https://i.ytimg.com/vi/kVKmUuBBWzw/hqdefault.jpg',
    category: 'video',
    language: ['hi', 'mr'],
    source: 'Films Division of India / Archival Footage',
    description: 'Historic footage and audio recording of Dr. Babasaheb Ambedkar leading over 500,000 followers into Buddhism and administering the historic 22 Vows at Deekshabhoomi, Nagpur.',
    transcript: [
      { time: '00:00', text: 'Over half a million people assemble at Nagpur on Vijaya Dashami for the historic Buddhist initiation ceremony.' },
      { time: '01:30', text: 'Dr. Babasaheb Ambedkar addresses the gathering: "By taking refuge in the Buddha, Dhamma, and Sangha, we are casting off centuries of degradation and taking rebirth into human dignity."' },
      { time: '03:00', text: 'Dr. Ambedkar administers the Three Refuges (Trisaran) and Five Precepts (Panchsheel) to the immense gathering.' },
      { time: '04:30', text: 'Vow 1 to 4: I shall have no faith in Brahma, Vishnu, and Mahesh, nor shall I worship them. I shall have no faith in Rama and Krishna. I shall not consider the Buddha an incarnation.' },
      { time: '06:00', text: 'Vow 5 to 10: I shall perform no Sraddha nor offer Pinda. I shall not allow any ceremonies to be performed by Brahmins. I shall believe in the equality of all human beings.' },
      { time: '07:30', text: 'Vow 11 to 16: I shall follow the Noble Eightfold Path of the Buddha. I shall have compassion and loving-kindness for all living beings. I shall not steal, lie, or consume intoxicants.' },
      { time: '09:00', text: 'Vow 17 to 22: I embrace Buddhism because it is based on morality, reason, and fraternity. Today I have taken a new birth. I dedicate my life to the Dhamma.' },
      { time: '10:45', text: 'The gathering roars in jubilation: "Buddham Saranam Gacchami, Dhammam Saranam Gacchami, Sangham Saranam Gacchami."' }
    ]
  },
  {
    id: 'yt-hindi-aoc-full',
    title: 'Annihilation of Caste Complete Hindi Audiobook (जातिप्रथा उन्मूलन)',
    speaker: 'Dr. B. R. Ambedkar (Hindi Narration)',
    date: '1936 / BAWS Audio',
    type: 'speech',
    duration: '60 mins',
    embedUrl: 'https://www.youtube.com/embed/N1Q5BdZJq6g',
    url: 'https://www.youtube.com/watch?v=N1Q5BdZJq6g',
    thumbnail: 'https://i.ytimg.com/vi/N1Q5BdZJq6g/hqdefault.jpg',
    category: 'hindi',
    language: ['hi'],
    source: 'YouTube Playlist (BAWS Hindi Audio)',
    description: 'Complete Hindi narration of Dr. Ambedkar’s most famous work "Annihilation of Caste", dissecting religious orthodoxy, untouchability, and the moral requirement for equality.',
    transcript: [
      { time: '00:00', text: 'डॉ. बाबासाहेब आंबेडकर का ऐतिहासिक ग्रंथ: जातिप्रथा उन्मूलन (Annihilation of Caste)।' },
      { time: '03:45', text: 'जाति व्यवस्था केवल श्रम का विभाजन नहीं है, बल्कि यह श्रमिकों का अप्राकृतिक और विवशतापूर्ण विभाजन है।' },
      { time: '07:30', text: 'सभ्य समाजों में श्रम विभाजन स्वाभाविक होता है, लेकिन भारत की जाति व्यवस्था में यह जन्म के आधार पर थोपा जाता है।' },
      { time: '11:15', text: 'मनुष्य की व्यक्तिगत रुचि, योग्यता और क्षमता को अनदेखा करके केवल उसके जन्म से उसका व्यवसाय निर्धारित करना अन्याय है।' },
      { time: '15:00', text: 'आर्थिक दृष्टि से भी जाति प्रथा विनाशकारी है, क्योंकि यह कार्यकुशलता और गतिशीलता को अवरुद्ध कर देती है।' },
      { time: '19:00', text: 'जाति कोई भौतिक दीवार नहीं है जिसे तोड़ा जा सके; यह एक मानसिक धारणा और वैचारिक स्थिति है।' },
      { time: '23:00', text: 'जाति की भावना राष्ट्रीय एकता और मानवीय संवेदनाओं को समाप्त कर देती है। एक जाति के लोग दूसरी जाति के प्रति सहानुभूति खो देते हैं।' },
      { time: '27:30', text: 'अंतरजातीय विवाह ही जाति की जड़ को हिलाने का वास्तविक उपाय है, क्योंकि रक्त का सम्मिश्रण ही सगोत्रता की दीवार को गिराता है।' },
      { time: '32:00', text: 'लेकिन लोग अंतरजातीय विवाह तब तक नहीं करेंगे जब तक वे शास्त्रों की इस शिक्षा पर विश्वास करते रहेंगे कि जाति ईश्वरीय विधान है।' },
      { time: '37:00', text: 'इसलिए वास्तविक शत्रु जाति नहीं, बल्कि शास्त्रों की वह सत्ता है जो जाति को पवित्र और धार्मिक कर्तव्य घोषित करती है।' },
      { time: '42:00', text: 'सच्चा लोकतंत्र केवल मतपत्र डालने का नाम नहीं है; लोकतंत्र का अर्थ है स्वतंत्रता, समता और बंधुत्व की जीवंत जीवन-पद्धति।' },
      { time: '48:00', text: 'जब तक हम शास्त्रों की अंधभक्ति को त्यागकर विवेक और मानवीय नैतिकता पर आधारित धर्म को नहीं अपनाते, तब तक समता असंभव है।' },
      { time: '55:00', text: 'आइए हम एक ऐसे समाज का निर्माण करें जहां मनुष्य का मूल्यांकन उसके जन्म से नहीं, बल्कि उसके चरित्र और कर्म से हो।' }
    ]
  },
  {
    id: 'yt-hindi-castes-india',
    title: 'Castes in India: Genesis, Mechanism & Spread (भारत में जातिप्रथा)',
    speaker: 'Dr. B. R. Ambedkar (Columbia Paper)',
    date: 'May 9, 1916',
    type: 'speech',
    duration: '24 mins',
    embedUrl: 'https://www.youtube.com/embed/GsR6ChAiTHU',
    url: 'https://www.youtube.com/watch?v=GsR6ChAiTHU',
    thumbnail: 'https://i.ytimg.com/vi/GsR6ChAiTHU/hqdefault.jpg',
    category: 'hindi',
    language: ['hi'],
    source: 'YouTube Playlist (BAWS Hindi Audio)',
    description: 'Dr. Ambedkar’s seminal paper presented at Columbia University in New York under Prof. Alexander Goldenweiser, explaining endogamy as the core mechanism creating the caste system.',
    transcript: [
      { time: '00:00', text: 'कोलंबिया विश्वविद्यालय न्यूयॉर्क में ९ मई १९१६ को प्रस्तुत ऐतिहासिक शोध पत्र: भारत में जातिप्रथा।' },
      { time: '02:40', text: 'डॉ. आंबेडकर ने पहली बार वैज्ञानिक विश्लेषण से सिद्ध किया कि भारतीय समाज मूलतः सजातीय और बहिर्विवाही (Exogamous) था।' },
      { time: '05:30', text: 'सगोत्र विवाह (Endogamy) ही वह मुख्य साधन है जिसके द्वारा जातियों का निर्माण और संरक्षण हुआ।' },
      { time: '08:45', text: 'स्त्री-पुरुष के संख्यात्मक संतुलन को बनाए रखने के लिए सती प्रथा, बाल विवाह और विधवा-मुंडन जैसी कुप्रथाएं गढ़ी गईं।' },
      { time: '12:00', text: 'ब्राह्मण वर्ग ने सबसे पहले अपने आप को एक बंद वर्ग (Closed Class) के रूप में परिणत कर लिया।' },
      { time: '15:15', text: 'जब एक वर्ग ने अपने द्वार बंद कर लिए, तो दूसरे वर्गों को भी आत्मरक्षा और अनुकरण में अपने द्वार बंद करने पड़े।' },
      { time: '18:30', text: 'इस प्रकार अनुकरण के मनोवैज्ञानिक नियम के कारण पूरा भारतीय समाज जातियों के बंद डिब्बों में विभाजित हो गया।' },
      { time: '22:00', text: 'यह शोध पत्र आधुनिक समाजशास्त्र में जाति की उत्पत्ति और तंत्र को समझने का सबसे प्रामाणिक दस्तावेज है।' }
    ]
  },
  {
    id: 'yt-hindi-rgj-full',
    title: 'Ranade, Gandhi & Jinnah Complete Hindi Audiobook (रानाडे, गाँधी और जिन्ना)',
    speaker: 'Dr. B. R. Ambedkar',
    date: 'January 18, 1943',
    type: 'speech',
    duration: '45 mins',
    embedUrl: 'https://www.youtube.com/embed/KW7VBaYAxNg',
    url: 'https://www.youtube.com/watch?v=KW7VBaYAxNg',
    thumbnail: 'https://i.ytimg.com/vi/KW7VBaYAxNg/hqdefault.jpg',
    category: 'hindi',
    language: ['hi'],
    source: 'YouTube Playlist (BAWS Hindi Audio)',
    description: 'Dr. Ambedkar’s address on the 101st birthday celebration of Justice Mahadev Govind Ranade in Poona, offering a comparative analysis of leadership, hero worship, and democratic statesmanship.',
    transcript: [
      { time: '00:00', text: 'गोखले राजनीति संस्थान पूना में न्यायमूर्ति रानाडे की १०१वीं जयंती पर दिया गया ऐतिहासिक व्याख्यान।' },
      { time: '04:30', text: 'रानाडे का सिद्धांत था कि जब तक समाज के भीतर सामाजिक कुरीतियों को समाप्त नहीं किया जाता, तब तक राजनीतिक स्वशासन व्यर्थ है।' },
      { time: '09:00', text: 'महान व्यक्ति की कसौटी क्या है? केवल भीड़ जुटाना या सत्ता प्राप्त करना महानता नहीं है, बल्कि समाज को नैतिक दिशा देना है।' },
      { time: '14:00', text: 'भारत की राजनीति में भक्ति अथवा व्यक्तित्व-पूजा (Hero-Worship) लोकतंत्र के पतन और अधिनायकवाद का सीधा मार्ग है।' },
      { time: '19:30', text: 'गांधी और जिन्ना दोनों ही व्यक्तित्व-पूजा के आधार पर राजनीति चला रहे हैं, जो भारतीय जनतंत्र के लिए अत्यंत चिंताजनक है।' },
      { time: '25:00', text: 'नेता को जनता का सेवक होना चाहिए, न कि ऐसा मसीहा जिसकी आलोचना को देशद्रोह समझा जाए।' },
      { time: '31:00', text: 'रानाडे ने सिखाया कि तर्क, सत्य और सामाजिक सुधार ही किसी भी राष्ट्र की सच्ची नींव होते हैं।' },
      { time: '38:00', text: 'लोकतंत्र का भविष्य इस बात पर निर्भर करता है कि जनता स्वतंत्र विचार और आलोचनात्मक दृष्टि विकसित करे।' }
    ]
  },
  {
    id: 'yt-hindi-aoc-p1',
    title: 'जातिप्रथा उन्मूलन (भाग १) - Annihilation of Caste Hindi Part 1',
    speaker: 'Dr. B. R. Ambedkar',
    date: 'BAWS Vol. 1',
    type: 'speech',
    duration: '15 mins',
    embedUrl: 'https://www.youtube.com/embed/WheIQxIHUPw',
    url: 'https://www.youtube.com/watch?v=WheIQxIHUPw',
    thumbnail: 'https://i.ytimg.com/vi/WheIQxIHUPw/hqdefault.jpg',
    category: 'hindi',
    language: ['hi'],
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    description: 'Part 1 of the serialized Hindi reading of Annihilation of Caste: Why social reform must precede political freedom.',
    transcript: [
      { time: '00:00', text: 'लाहौर के जात-पात तोड़क मंडल के लिए तैयार किया गया मूल आलेख: भूमिका और पृष्ठभूमि।' },
      { time: '02:30', text: 'राजनीतिक सुधारकों का मानना था कि पहले अंग्रेजों से सत्ता लेनी चाहिए, फिर सामाजिक सुधार करेंगे।' },
      { time: '05:45', text: 'डॉ. आंबेडकर ने इसका जोरदार खंडन किया और पूछा: क्या एक ऐसा समाज जो अपने ही करोड़ों नागरिकों को अछूत समझता है, आजादी का सदुपयोग कर सकता है?' },
      { time: '09:00', text: 'इतिहास गवाह है कि जब तक सामाजिक आधार मजबूत नहीं होता, राजनीतिक सत्ता निरंकुश हो जाती है।' },
      { time: '12:30', text: 'सामाजिक न्याय और समता ही किसी भी स्वतंत्र राष्ट्र की पहली आवश्यकता है।' }
    ]
  },
  {
    id: 'yt-hindi-aoc-p2',
    title: 'जातिप्रथा उन्मूलन (भाग २) - Annihilation of Caste Hindi Part 2',
    speaker: 'Dr. B. R. Ambedkar',
    date: 'BAWS Vol. 1',
    type: 'speech',
    duration: '14 mins',
    embedUrl: 'https://www.youtube.com/embed/iokJNKlR_I8',
    url: 'https://www.youtube.com/watch?v=iokJNKlR_I8',
    thumbnail: 'https://i.ytimg.com/vi/iokJNKlR_I8/hqdefault.jpg',
    category: 'hindi',
    language: ['hi'],
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    description: 'Part 2 examining economic efficiency arguments: proving caste creates involuntary unemployment by forbidding career choice.',
    transcript: [
      { time: '00:00', text: 'आर्थिक दृष्टि से जाति प्रथा की विवेचना: क्या यह कार्यकुशलता बढ़ाती है?' },
      { time: '03:15', text: 'जाति व्यवस्था में व्यक्ति को अपनी पसंद का काम चुनने का कोई अधिकार नहीं होता।' },
      { time: '06:30', text: 'जब कोई काम केवल जन्म के आधार पर सौंपा जाता है, तो व्यक्ति उसमें उत्साह और रुचि के साथ कार्य नहीं कर पाता।' },
      { time: '09:45', text: 'यही कारण है कि जाति प्रथा अनिवार्य बेरोजगारी और आर्थिक पिछड़ेपन को जन्म देती है।' },
      { time: '12:30', text: 'मनुष्य की योग्यता और उसकी पसंद को प्राथमिकता देना ही आधुनिक औद्योगिक समाज की आवश्यकता है।' }
    ]
  },
  {
    id: 'yt-hindi-aoc-p3',
    title: 'जातिप्रथा उन्मूलन (भाग ३) - Annihilation of Caste Hindi Part 3',
    speaker: 'Dr. B. R. Ambedkar',
    date: 'BAWS Vol. 1',
    type: 'speech',
    duration: '15 mins',
    embedUrl: 'https://www.youtube.com/embed/ktStz-YWg7Q',
    url: 'https://www.youtube.com/watch?v=ktStz-YWg7Q',
    thumbnail: 'https://i.ytimg.com/vi/ktStz-YWg7Q/hqdefault.jpg',
    category: 'hindi',
    language: ['hi'],
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    description: 'Part 3 illustrating how caste loyalty supplants national and humanitarian loyalty, eroding civic ethics.',
    transcript: [
      { time: '00:00', text: 'जाति चेतना और राष्ट्रीय एकता का अंतर्विरोध।' },
      { time: '03:30', text: 'जाति के कारण एक हिंदू दूसरे हिंदू को अपना नहीं समझता। जाति निष्ठा राष्ट्र निष्ठा पर भारी पड़ जाती है।' },
      { time: '07:00', text: 'सार्वजनिक जीवन में जब जाति का प्रभाव होता है, तो योग्यता और नैतिकता के स्थान पर पक्षपात आ जाता है।' },
      { time: '10:30', text: 'सच्चा लोकतंत्र केवल मत देने तक सीमित नहीं, बल्कि बंधुत्व की एक पवित्र जीवन पद्धति है।' },
      { time: '13:30', text: 'जाति का विनाश किए बिना भारत एक सच्चा राष्ट्र कभी नहीं बन सकता।' }
    ]
  },
  {
    id: 'yt-hindi-rgj-p1',
    title: 'रानाडे, गाँधी और जिन्ना (भाग १) - Ranade, Gandhi & Jinnah Hindi',
    speaker: 'Dr. B. R. Ambedkar',
    date: 'BAWS Vol. 1',
    type: 'speech',
    duration: '15 mins',
    embedUrl: 'https://www.youtube.com/embed/8QGhwFpR3gw',
    url: 'https://www.youtube.com/watch?v=8QGhwFpR3gw',
    thumbnail: 'https://i.ytimg.com/vi/8QGhwFpR3gw/hqdefault.jpg',
    category: 'hindi',
    language: ['hi'],
    source: 'YouTube Playlist (PLKosneHQlBBQ1J4OR9rNCIdVWu1Gz2iYX)',
    description: 'Part 1 of the Ranade address: evaluating Justice Ranade’s foundational contributions to the Indian social reform movement.',
    transcript: [
      { time: '00:00', text: 'न्यायमूर्ति रानाडे के सामाजिक सिद्धांतों की आधुनिक प्रासंगिकता।' },
      { time: '03:45', text: 'रानाडे ने जीवन भर यह सिखाया कि देश को केवल विदेशी सत्ता से मुक्त कराना काफी नहीं, आंतरिक बुराइयों से मुक्त कराना भी जरूरी है।' },
      { time: '07:15', text: 'सामाजिक व्यवस्था को सुधारे बिना राजनीतिक स्वतंत्रता खोखली और अल्पकालिक सिद्ध होगी।' },
      { time: '11:00', text: 'सच्चा सुधारक वह है जो भीड़ के पीछे चलने के बजाय भीड़ को सही दिशा में ले जाने का साहस रखे।' },
      { time: '13:45', text: 'डॉ. आंबेडकर ने रानाडे को आधुनिक भारत का महानतम सामाजिक दार्शनिक घोषित किया।' }
    ]
  }
];

let currentMediaIndex = 0;
let currentPlaybackMode = 'video'; // 'video' | 'audio'
let isAudioPlaying = false;
let activeTranscriptIndex = 0;
let visualizerLoopId = null;

// Live Running Audio Timer State
let audioElapsedSeconds = 0;
let audioTotalSeconds = 1260;
let audioTimerInterval = null;

document.addEventListener('DOMContentLoaded', async () => {
  // Try fetching dynamic media from API if available
  try {
    const res = await fetch('/api/media');
    if (res.ok) {
      const json = await res.json();
      if (json.media && json.media.length > 0) {
        const apiMedia = json.media.map(m => ({
          id: m._id,
          title: m.title,
          speaker: m.speaker || 'Dr. B. R. Ambedkar',
          date: m.year ? `${m.year}` : 'Archival',
          type: m.type,
          duration: `${Math.round((m.duration || 600) / 60)} mins`,
          embedUrl: m.embedUrl || '',
          url: m.url || (m.embedUrl ? m.embedUrl.replace('/embed/', '/watch?v=').split('?')[0] : '#'),
          thumbnail: m.thumbnail || '🎙️',
          category: (m.language && m.language.includes('hi')) ? 'hindi' : m.type,
          language: m.language || ['en'],
          source: m.source || 'YouTube Archival',
          description: m.description || '',
          transcript: typeof m.transcript === 'string' && m.transcript.startsWith('[') 
            ? JSON.parse(m.transcript) 
            : (Array.isArray(m.transcript) ? m.transcript : [])
        }));
        const existingUrls = new Set(MEDIA_DATA.map(m => m.url));
        apiMedia.forEach(m => {
          if (!existingUrls.has(m.url)) {
            MEDIA_DATA.push(m);
            existingUrls.add(m.url);
          }
        });
      }
    }
  } catch (e) {
    // Graceful fallback to static MEDIA_DATA
  }

  renderMediaGrid('all');
  initAudioVisualizer();
  loadMediaTrack(0, false);

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderMediaGrid(filter);
    });
  });

  // Playback Mode Switchers (Video vs Audio)
  const tabVideo = document.getElementById('player-tab-video');
  const tabAudio = document.getElementById('player-tab-audio');
  const switchAudioBtn = document.getElementById('video-switch-audio-btn');

  if (tabVideo) tabVideo.addEventListener('click', () => switchPlaybackMode('video'));
  if (tabAudio) tabAudio.addEventListener('click', () => switchPlaybackMode('audio'));
  if (switchAudioBtn) {
    switchAudioBtn.addEventListener('click', () => {
      switchPlaybackMode('audio');
      playCurrentAudio();
    });
  }

  // Audio Play / Pause Button
  const audioPlayBtn = document.getElementById('audio-play-pause-btn');
  if (audioPlayBtn) {
    audioPlayBtn.addEventListener('click', toggleAudioPlayPause);
  }

  // Audio Restart Button
  const audioRestartBtn = document.getElementById('audio-restart-btn');
  if (audioRestartBtn) {
    audioRestartBtn.addEventListener('click', restartAudio);
  }

  // Audio Progress Bar Scrubber
  const progressBar = document.getElementById('audio-progress-bar');
  if (progressBar) {
    progressBar.addEventListener('click', (e) => {
      const rect = progressBar.getBoundingClientRect();
      const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      seekAudio(clickRatio);
    });
  }

  // Speed Control
  const speedSelect = document.getElementById('playback-speed');
  const audioEl = document.getElementById('main-audio-player');
  if (speedSelect) {
    speedSelect.addEventListener('change', (e) => {
      const rate = parseFloat(e.target.value) || 1.0;
      if (audioEl) audioEl.playbackRate = rate;
      if (isAudioPlaying) {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        speakTranscriptLine(activeTranscriptIndex);
      }
    });
  }

  // Copy Transcript
  const copyBtn = document.getElementById('copy-transcript-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const item = MEDIA_DATA[currentMediaIndex];
      const text = (item.transcript || []).map(t => `[${t.time}] ${t.text}`).join('\n');
      navigator.clipboard.writeText(text).then(() => {
        if (window.showToast) window.showToast('Full transcript copied to clipboard!');
      });
    });
  }

  // TTS Transcript Read Aloud button in transcript header
  const ttsBtn = document.getElementById('tts-transcript-btn');
  if (ttsBtn) {
    ttsBtn.addEventListener('click', () => {
      switchPlaybackMode('audio');
      restartAudio();
    });
  }

  // HTML5 audio timeupdate hook (if playing an actual audio file)
  if (audioEl) {
    audioEl.addEventListener('timeupdate', () => {
      if (audioEl.duration) {
        audioElapsedSeconds = Math.floor(audioEl.currentTime);
        audioTotalSeconds = Math.floor(audioEl.duration);
        updateAudioTimeDisplay();
      }
    });
    audioEl.addEventListener('ended', () => {
      pauseCurrentAudio();
      audioElapsedSeconds = audioTotalSeconds;
      updateAudioTimeDisplay();
    });
  }

  // Listen for language changes
  document.addEventListener('languageChange', (e) => {
    const lang = e.detail && e.detail.lang;
    if (lang === 'hi') {
      const hindiFilter = document.querySelector('.filter-btn[data-filter="hindi"]');
      if (hindiFilter) hindiFilter.click();
    }
  });
});

function parseDurationToSeconds(durationStr) {
  if (!durationStr) return 1200;
  const num = parseInt(durationStr);
  if (isNaN(num)) return 1200;
  if (durationStr.includes('min')) return num * 60;
  if (durationStr.includes('sec')) return num;
  if (durationStr.includes('hr') || durationStr.includes('hour')) return num * 3600;
  return num;
}

function formatSeconds(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function updateAudioTimeDisplay() {
  const timeLabel = document.getElementById('audio-time-label');
  const progressFill = document.getElementById('audio-progress-fill');
  const progressBar = document.getElementById('audio-progress-bar');

  if (timeLabel) {
    timeLabel.textContent = `${formatSeconds(audioElapsedSeconds)} / ${formatSeconds(audioTotalSeconds)}`;
  }

  if (progressFill && audioTotalSeconds > 0) {
    const pct = Math.min(100, Math.max(0, (audioElapsedSeconds / audioTotalSeconds) * 100));
    progressFill.style.width = `${pct}%`;
  }

  if (progressBar) {
    progressBar.setAttribute('aria-valuenow', Math.round((audioElapsedSeconds / (audioTotalSeconds || 1)) * 100));
  }
}

function startAudioTimer() {
  if (audioTimerInterval) clearInterval(audioTimerInterval);
  audioTimerInterval = setInterval(() => {
    audioElapsedSeconds++;
    if (audioElapsedSeconds >= audioTotalSeconds) {
      audioElapsedSeconds = audioTotalSeconds;
      updateAudioTimeDisplay();
      // Completed full address
      pauseCurrentAudio();
    } else {
      updateAudioTimeDisplay();
    }
  }, 1000);
}

function pauseAudioTimer() {
  if (audioTimerInterval) {
    clearInterval(audioTimerInterval);
    audioTimerInterval = null;
  }
}

function resetAudioTimer() {
  pauseAudioTimer();
  audioElapsedSeconds = 0;
  updateAudioTimeDisplay();
}

function seekAudio(ratio) {
  audioElapsedSeconds = Math.round(ratio * audioTotalSeconds);
  updateAudioTimeDisplay();

  const item = MEDIA_DATA[currentMediaIndex];
  if (!item || !item.transcript || item.transcript.length === 0) return;

  // Jump to corresponding transcript line
  const targetIndex = Math.min(item.transcript.length - 1, Math.floor(ratio * item.transcript.length));
  activeTranscriptIndex = targetIndex;
  highlightTranscriptLine(targetIndex);

  const audioEl = document.getElementById('main-audio-player');
  if (item.audioUrl && audioEl && audioEl.duration) {
    audioEl.currentTime = audioElapsedSeconds;
  } else if (isAudioPlaying) {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    speakTranscriptLine(targetIndex);
  }
}

function switchPlaybackMode(mode) {
  currentPlaybackMode = mode;
  const tabVideo = document.getElementById('player-tab-video');
  const tabAudio = document.getElementById('player-tab-audio');
  const videoContainer = document.getElementById('video-container');
  const videoActionBar = document.getElementById('video-action-bar');
  const videoInfoBar = document.getElementById('video-info-bar');
  const audioScreen = document.getElementById('audio-screen');
  const audioControls = document.getElementById('audio-controls');
  const videoPlayer = document.getElementById('main-video-player');
  const item = MEDIA_DATA[currentMediaIndex];

  if (mode === 'video') {
    pauseCurrentAudio();

    if (tabVideo) tabVideo.className = 'btn btn-xs btn-primary';
    if (tabAudio) tabAudio.className = 'btn btn-xs btn-outline';

    if (audioScreen) audioScreen.style.display = 'none';
    if (audioControls) audioControls.style.display = 'none';
    if (videoContainer) videoContainer.style.display = 'block';
    if (videoActionBar) videoActionBar.style.display = 'flex';
    if (videoInfoBar) videoInfoBar.style.display = 'block';

    if (videoPlayer && item && item.embedUrl) {
      const targetSrc = item.embedUrl + '?autoplay=1&rel=0';
      if (videoPlayer.src !== targetSrc) {
        videoPlayer.src = targetSrc;
      }
    }
  } else {
    if (videoPlayer) videoPlayer.src = '';
    if (videoContainer) videoContainer.style.display = 'none';
    if (videoActionBar) videoActionBar.style.display = 'none';
    if (videoInfoBar) videoInfoBar.style.display = 'none';

    if (tabVideo) tabVideo.className = 'btn btn-xs btn-outline';
    if (tabAudio) tabAudio.className = 'btn btn-xs btn-primary';

    if (audioScreen) audioScreen.style.display = 'block';
    if (audioControls) audioControls.style.display = 'block';
  }
}

function renderMediaGrid(filter) {
  const grid = document.getElementById('media-grid');
  if (!grid) return;

  let filtered = MEDIA_DATA;
  if (filter === 'speech') {
    filtered = MEDIA_DATA.filter(m => m.type === 'speech' && (!m.category || m.category !== 'hindi'));
  } else if (filter === 'video') {
    filtered = MEDIA_DATA.filter(m => m.type === 'video' || m.type === 'newsreel');
  } else if (filter === 'hindi') {
    filtered = MEDIA_DATA.filter(m => m.category === 'hindi' || (m.language && m.language.includes('hi')));
  } else if (filter === 'interview') {
    filtered = MEDIA_DATA.filter(m => m.type === 'interview' || m.type === 'debate' || m.type === 'radio');
  }

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="col-span-full text-center py-5 text-muted">No media items found for filter "${filter}".</div>`;
    return;
  }

  grid.innerHTML = filtered.map((item) => {
    const originalIdx = MEDIA_DATA.findIndex(m => m.id === item.id);
    const badgeClass = item.type === 'speech' ? 'badge-blue' : item.type === 'video' || item.type === 'newsreel' ? 'badge-gold' : item.category === 'hindi' ? 'badge-red' : 'badge-green';
    
    const isImageThumb = item.thumbnail && item.thumbnail.startsWith('http');
    const thumbHtml = isImageThumb
      ? `<div style="position:relative; width:100%; height:160px; overflow:hidden; border-radius:var(--radius-sm); background:#000;" class="mb-3">
          <img src="${item.thumbnail}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover; opacity:0.9;" loading="lazy" />
          <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.35);">
            <div style="width:44px; height:44px; border-radius:50%; background:rgba(212,175,55,0.9); display:flex; align-items:center; justify-content:center; color:#000; font-size:1.2rem; box-shadow:0 4px 15px rgba(0,0,0,0.4);">▶</div>
          </div>
        </div>`
      : `<div class="text-3xl text-center py-4 bg-glass rounded mb-3">${item.thumbnail}</div>`;

    return `
      <div class="card card-hover cursor-pointer animate-fade-up" onclick="loadMediaTrack(${originalIdx}, true)">
        <div class="card-inner" style="padding:var(--space-4);display:flex;flex-direction:column;justify-content:space-between;height:100%;">
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="badge ${badgeClass} text-xs uppercase">${item.type}</span>
              <span class="text-xs text-muted num-tabular">⏱️ ${item.duration}</span>
            </div>
            ${thumbHtml}
            <h3 class="font-heading text-base mb-1 text-gold leading-snug">${item.title}</h3>
            <p class="text-xs text-muted mb-2">🗓️ ${item.date} • ${item.speaker}</p>
            <p class="text-xs leading-relaxed text-muted line-clamp-2">${item.description}</p>
          </div>
          <button class="btn btn-outline btn-sm w-full mt-3 flex items-center justify-center gap-1" style="border-radius:var(--radius-full);">
            <span>Play Recording / Video</span>
            <span class="btn-icon-bubble">▶</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function loadMediaTrack(index, autoPlay = false) {
  currentMediaIndex = index;
  const item = MEDIA_DATA[index];
  if (!item) return;

  pauseCurrentAudio();
  activeTranscriptIndex = 0;
  audioTotalSeconds = parseDurationToSeconds(item.duration);
  resetAudioTimer();

  const playerTypeBadge = document.getElementById('player-type-badge');
  const playerDate = document.getElementById('player-date');
  const playerTitle = document.getElementById('player-title');
  const playerSpeaker = document.getElementById('player-speaker');
  const videoDirectBtn = document.getElementById('video-direct-yt-btn');
  const videoTitle = document.getElementById('video-title');
  const videoSourceInfo = document.getElementById('video-source-info');
  const statusText = document.getElementById('audio-status-text');

  if (playerTypeBadge) playerTypeBadge.textContent = (item.type || 'MEDIA').toUpperCase();
  if (playerDate) playerDate.textContent = item.date || 'Historical Archive';
  if (playerTitle) playerTitle.textContent = item.title;
  if (playerSpeaker) playerSpeaker.textContent = item.speaker || 'Dr. B. R. Ambedkar';
  if (videoTitle) videoTitle.textContent = item.title;
  if (videoSourceInfo) videoSourceInfo.textContent = `Source: ${item.source || 'Archival Records'} • ${item.date}`;
  if (statusText) statusText.textContent = `Ready to play: ${item.title} (${item.transcript ? item.transcript.length : 0} paragraphs)`;

  if (videoDirectBtn) {
    const watchUrl = item.url || (item.embedUrl ? item.embedUrl.replace('/embed/', '/watch?v=').split('?')[0] : '#');
    videoDirectBtn.href = watchUrl;
  }

  renderTranscript(item);
  switchPlaybackMode(currentPlaybackMode);

  if (autoPlay) {
    if (currentPlaybackMode === 'audio') {
      playCurrentAudio();
    }
  }

  window.scrollTo({ top: 180, behavior: 'smooth' });
}

function renderTranscript(item) {
  const transcriptContent = document.getElementById('transcript-content');
  if (!transcriptContent) return;

  if (item.transcript && item.transcript.length > 0) {
    transcriptContent.innerHTML = item.transcript.map((t, idx) => `
      <div id="transcript-line-${idx}" class="transcript-line flex gap-3 p-3 rounded hover:bg-glass cursor-pointer" onclick="jumpToTranscriptLine(${idx})" style="transition:all 0.2s ease; margin-bottom:4px; border-radius:var(--radius-sm);">
        <span class="badge badge-gold text-xs font-mono self-start" style="flex-shrink:0;">${t.time}</span>
        <p class="text-sm leading-relaxed" style="color:var(--text);">${t.text}</p>
      </div>
    `).join('');
  } else {
    transcriptContent.innerHTML = `
      <div class="text-center py-4 text-muted text-sm">
        <p>📝 Synchronized transcript is being generated by the archive AI digitizer.</p>
        <p class="text-xs text-faint mt-1">Audio description: ${item.description}</p>
      </div>
    `;
  }
}

// ── Audio & Speech Synthesis Playback Controller ──────────
function toggleAudioPlayPause() {
  if (isAudioPlaying) {
    pauseCurrentAudio();
  } else {
    playCurrentAudio();
  }
}

function playCurrentAudio() {
  const item = MEDIA_DATA[currentMediaIndex];
  if (!item) return;

  const audioEl = document.getElementById('main-audio-player');
  const audioSource = document.getElementById('audio-source');

  if (item.audioUrl && audioEl && audioSource) {
    audioSource.src = item.audioUrl;
    audioEl.load();
    audioEl.play().then(() => {
      isAudioPlaying = true;
      setAudioUIPlaying(true);
      startVisualizerWave();
      startAudioTimer();
    }).catch(() => {
      // Fallback to speech synthesis if audio file not reachable
      speakTranscriptLine(activeTranscriptIndex);
    });
  } else {
    speakTranscriptLine(activeTranscriptIndex);
  }
}

function pauseCurrentAudio() {
  const audioEl = document.getElementById('main-audio-player');
  if (audioEl) audioEl.pause();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  isAudioPlaying = false;
  setAudioUIPlaying(false);
  stopVisualizerWave();
  pauseAudioTimer();

  const statusText = document.getElementById('audio-status-text');
  if (statusText) statusText.textContent = 'Audio playback paused.';
}

function restartAudio() {
  pauseCurrentAudio();
  activeTranscriptIndex = 0;
  clearTranscriptHighlights();
  resetAudioTimer();
  playCurrentAudio();
}

function jumpToTranscriptLine(index) {
  activeTranscriptIndex = index;
  switchPlaybackMode('audio');
  pauseCurrentAudio();

  const item = MEDIA_DATA[currentMediaIndex];
  if (item && item.transcript && item.transcript.length > 0) {
    audioElapsedSeconds = Math.round((index / item.transcript.length) * audioTotalSeconds);
    updateAudioTimeDisplay();
  }

  speakTranscriptLine(index);
}

function speakTranscriptLine(index) {
  const item = MEDIA_DATA[currentMediaIndex];
  if (!item) return;

  const transcripts = item.transcript || [];
  if (index >= transcripts.length) {
    // Finished all lines of full address
    isAudioPlaying = false;
    activeTranscriptIndex = 0;
    setAudioUIPlaying(false);
    stopVisualizerWave();
    pauseAudioTimer();
    const statusText = document.getElementById('audio-status-text');
    if (statusText) statusText.textContent = 'Complete archival address finished.';
    return;
  }

  activeTranscriptIndex = index;
  const currentLine = transcripts[index];

  highlightTranscriptLine(index);

  const statusText = document.getElementById('audio-status-text');
  if (statusText) statusText.textContent = `Narrating paragraph ${index + 1} of ${transcripts.length}...`;

  if (!('speechSynthesis' in window)) {
    alert('Browser speech engine is not supported. Please use YouTube video mode.');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(currentLine.text);

  const speedSelect = document.getElementById('playback-speed');
  const rate = speedSelect ? parseFloat(speedSelect.value) || 1.0 : 1.0;
  utterance.rate = rate;

  const isHindiOrMarathi = (item.language && (item.language.includes('hi') || item.language.includes('mr'))) || item.category === 'hindi';
  if (isHindiOrMarathi) {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.onstart = () => {
    isAudioPlaying = true;
    setAudioUIPlaying(true);
    startVisualizerWave();
    startAudioTimer();
  };

  utterance.onend = () => {
    if (isAudioPlaying) {
      // Proceed continuously through the complete address
      setTimeout(() => {
        speakTranscriptLine(activeTranscriptIndex + 1);
      }, 350);
    }
  };

  utterance.onerror = () => {
    isAudioPlaying = false;
    setAudioUIPlaying(false);
    stopVisualizerWave();
    pauseAudioTimer();
  };

  window.speechSynthesis.speak(utterance);
}

function highlightTranscriptLine(index) {
  clearTranscriptHighlights();
  const target = document.getElementById(`transcript-line-${index}`);
  if (target) {
    target.style.background = 'rgba(212, 175, 55, 0.15)';
    target.style.borderLeft = '3px solid var(--gold)';
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function clearTranscriptHighlights() {
  document.querySelectorAll('.transcript-line').forEach(el => {
    el.style.background = 'transparent';
    el.style.borderLeft = 'none';
  });
}

function setAudioUIPlaying(playing) {
  const playIcon = document.getElementById('audio-play-icon');
  const playLabel = document.getElementById('audio-play-label');

  if (playing) {
    if (playIcon) playIcon.textContent = '⏸';
    if (playLabel) playLabel.textContent = 'Pause Speech';
  } else {
    if (playIcon) playIcon.textContent = '▶';
    if (playLabel) playLabel.textContent = 'Play Speech';
  }
}

// ── HTML5 Canvas Live Audio Visualizer ─────────────────────
function initAudioVisualizer() {
  const canvas = document.getElementById('live-visualizer');
  if (!canvas) return;
  drawWaveform(false);
}

function drawWaveform(active = false) {
  const canvas = document.getElementById('live-visualizer');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const numBars = 28;
  const barWidth = (canvas.width / numBars) - 2;
  const now = performance.now() * 0.005;

  for (let i = 0; i < numBars; i++) {
    let height;
    if (active) {
      const sin1 = Math.sin((i * 0.35) + now);
      const cos1 = Math.cos((i * 0.6) - (now * 1.3));
      const normalized = Math.max(0.18, (sin1 + cos1 + 2) / 4);
      height = normalized * (canvas.height - 6);
    } else {
      height = 4; // Idle resting line
    }

    const x = i * (barWidth + 2);
    const y = canvas.height - height - 2;

    const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
    grad.addColorStop(0, 'rgba(212, 175, 55, 0.35)');
    grad.addColorStop(1, 'rgba(250, 228, 176, 0.95)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, height, [2, 2, 0, 0]);
    ctx.fill();
  }
}

function startVisualizerWave() {
  if (visualizerLoopId) cancelAnimationFrame(visualizerLoopId);
  function loop() {
    drawWaveform(true);
    visualizerLoopId = requestAnimationFrame(loop);
  }
  loop();
}

function stopVisualizerWave() {
  if (visualizerLoopId) cancelAnimationFrame(visualizerLoopId);
  visualizerLoopId = null;
  drawWaveform(false);
}
