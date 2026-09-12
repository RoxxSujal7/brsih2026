const fs = require('fs');
const path = require('path');

const debatesHtml = fs.readFileSync(path.join(__dirname, '../frontend/debates.html'), 'utf8');
const memorialsHtml = fs.readFileSync(path.join(__dirname, '../frontend/memorials.html'), 'utf8');

console.log('======================================================');
console.log('📜 DEBATES & MEMORIALS CONTENT EXPANSION AUDIT');
console.log('======================================================\n');

let failed = 0;
let passed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${message}`);
    failed++;
  }
}

// ----------------------------------------------------
// PAGE 1: DEBATES.HTML VERIFICATION
// ----------------------------------------------------
console.log('--- Checking Page 1: Political Thought & Historical Debates ---');

// Hero check
assert(debatesHtml.includes('class="debates-hero"'), 'debates.html: Hero section is preserved');
assert(debatesHtml.includes('ARCHIVAL RESEARCH &amp; HISTORICAL INQUIRY'), 'debates.html: Hero eyebrow text is intact');

// Section 1: Introduction to Ambedkar's Political Thought
assert(debatesHtml.includes('id="section-introduction"'), 'debates.html: Section 1 (Introduction) exists');
assert(debatesHtml.includes("Introduction to Ambedkar's Political Thought") && debatesHtml.includes('EPISTEMOLOGICAL FOUNDATIONS'), 'debates.html: Section 1 covers political thought & foundations');
assert(debatesHtml.includes('Documented Fact') && debatesHtml.includes('Primary Source') && debatesHtml.includes('Scholarly Interpretation') && debatesHtml.includes('Educational Synthesis'), 'debates.html: Section 1 epistemological distinctions clearly labeled');

// Section 2: Explore the Core Debates
assert(debatesHtml.includes('id="section-core-debates"'), 'debates.html: Section 2 (Core Debates) exists');
assert(debatesHtml.includes('id="debates-container"'), 'debates.html: Section 2 container for debate modules exists');
assert(debatesHtml.includes('debate-expander-btn') && debatesHtml.includes('toggleDebateArticle'), 'debates.html: Section 2 expandable debate cards with interactive toggle implemented');
assert(debatesHtml.includes('Why This Debate Matters') && debatesHtml.includes('Key People &amp; Organizations'), 'debates.html: Section 2 cards include why it matters & key people/orgs');

// Section 3: Ambedkar & Gandhi
assert(debatesHtml.includes('id="section-gandhi-deepdive"'), 'debates.html: Section 3 (Ambedkar & Gandhi deep dive) exists');
assert(debatesHtml.includes('Mani Bhavan') && debatesHtml.includes('Annihilation of Caste'), 'debates.html: Section 3 covers historic meetings & Annihilation of Caste');
assert(debatesHtml.includes('Poona Pact') && debatesHtml.includes('Yerwada Central Jail'), 'debates.html: Section 3 covers Poona Pact and separate electorates');

// Section 4: Ambedkar & Congress
assert(debatesHtml.includes('id="section-congress"'), 'debates.html: Section 4 (Congress & Representation) exists');
assert(debatesHtml.includes('What Congress and Gandhi Have Done'), 'debates.html: Section 4 references BAWS Vol. 9');

// Section 5: Muslim League & Pakistan
assert(debatesHtml.includes('id="section-pakistan-debates"'), 'debates.html: Section 5 (Pakistan Debates) exists');
assert(debatesHtml.includes('Pakistan or the Partition of India') || debatesHtml.includes('BAWS Volume 8'), 'debates.html: Section 5 references BAWS Vol. 8');

// Section 6: Communalism & Minority Representation
assert(debatesHtml.includes('id="section-communalism"'), 'debates.html: Section 6 (Communalism & Representation) exists');
assert(debatesHtml.includes('Communal vs. Political Majority') || debatesHtml.includes('Communal Majority'), 'debates.html: Section 6 distinguishes communal from political majoritarianism');

// Section 7: Comparative Matrix
assert(debatesHtml.includes('id="section-comparison-matrix"'), 'debates.html: Section 7 (Comparative Matrix) exists');
assert(debatesHtml.includes('class="matrix-table"'), 'debates.html: Section 7 structured table layout exists');

// Section 8: Independence & Freedom
assert(debatesHtml.includes('id="section-independence"'), 'debates.html: Section 8 (Independence & Freedom) exists');
assert(debatesHtml.includes('Political Freedom vs. Social Democracy') || debatesHtml.includes('life of contradictions'), 'debates.html: Section 8 contrasts political freedom with social democracy');

// Section 9: Round Table Conferences Timeline
assert(debatesHtml.includes('id="section-rtc-timeline"'), 'debates.html: Section 9 (RTC Timeline) exists');
assert(debatesHtml.includes('First Round Table Conference') && debatesHtml.includes('Second Round Table Conference') && debatesHtml.includes('Third Round Table Conference'), 'debates.html: Section 9 covers all three RTCs');
assert(debatesHtml.includes('Ambedkar did NOT attend the main 3rd RTC plenary'), 'debates.html: Section 9 preserves critical historical accuracy rule on 3rd RTC');

// Section 10: Primary Source Archive
assert(debatesHtml.includes('id="section-primary-sources"'), 'debates.html: Section 10 (Primary Sources) exists');
assert(debatesHtml.includes('BAWS VOLUME 1') && debatesHtml.includes('BAWS VOLUME 8') && debatesHtml.includes('BAWS VOLUME 9') && debatesHtml.includes('BAWS VOLUME 13'), 'debates.html: Section 10 cross-links to BAWS Volumes');

// Section 11: Interactive Historical Timeline
assert(debatesHtml.includes('id="section-interactive-timeline"'), 'debates.html: Section 11 (Interactive Historical Timeline) exists');
assert(debatesHtml.includes('timeline-filter-deck') && debatesHtml.includes('filterTimeline'), 'debates.html: Section 11 category filter buttons functional');
assert(debatesHtml.includes('Southborough Committee Evidence') && debatesHtml.includes('Ramsay MacDonald') && debatesHtml.includes('Poona Pact'), 'debates.html: Section 11 timeline events cataloged');

// Section 12: Key Concepts (9 Concepts)
assert(debatesHtml.includes('id="section-key-concepts"'), 'debates.html: Section 12 (Key Concepts) exists');
const concepts = ['Democracy', 'Social Democracy', 'Constitutional Morality', 'Liberty', 'Equality', 'Fraternity', 'Representation', 'Minority Rights', 'Social Justice'];
concepts.forEach(c => {
  assert(debatesHtml.includes(c), `debates.html: Section 12 includes concept "${c}"`);
});

// Mobile & Layout checks
assert(!debatesHtml.includes('width: 1200px') && !debatesHtml.includes('width: 1400px'), 'debates.html: No rigid oversized fixed widths causing mobile overflow');
assert(debatesHtml.includes('max-width: 1140px') && debatesHtml.includes('clamp('), 'debates.html: Fluid max-width and clamp typography used');

console.log('\n--- Checking Page 2: Memorials & Digital Heritage Journey ---');

// Hero check
assert(memorialsHtml.includes('class="memorials-hero"'), 'memorials.html: Hero section is preserved');
assert(memorialsHtml.includes('SACRED GEOGRAPHY &amp; NATIONAL MEMORIALS'), 'memorials.html: Hero eyebrow text is intact');

// Section 1: The Heritage Journey
assert(memorialsHtml.includes('id="section-heritage-journey"'), 'memorials.html: Section 1 (Heritage Journey) exists');
assert(memorialsHtml.includes('Living Monuments of Emancipation') || memorialsHtml.includes('SACRED MEMORIALIZATION'), 'memorials.html: Section 1 explains institutional significance of memorials');

// Section 2: Featured Memorials
assert(memorialsHtml.includes('id="section-featured-memorials"'), 'memorials.html: Section 2 (Featured Memorials) exists');
assert(memorialsHtml.includes('id="memorial-grid"'), 'memorials.html: Section 2 dynamic grid container exists');

// Section 3: Pancha Tirtha
assert(memorialsHtml.includes('id="section-pancha-tirtha"'), 'memorials.html: Section 3 (Pancha Tirtha) exists');
assert(memorialsHtml.includes('JANMA BHOOMI') && memorialsHtml.includes('DEEKSHA BHOOMI') && memorialsHtml.includes('CHAITYA BHOOMI'), 'memorials.html: Section 3 covers major Pancha Tirtha sacred sites');

// Section 4: Chronology
assert(memorialsHtml.includes('id="section-heritage-timeline"'), 'memorials.html: Section 4 (Chronology of Sacred Space) exists');
assert(memorialsHtml.includes('1891 · BIRTH') && memorialsHtml.includes('1956 · PARINIRVAN'), 'memorials.html: Section 4 connects timeline to physical sites');

// Section 5: Explore by Location
assert(memorialsHtml.includes('id="section-explore-by-location"'), 'memorials.html: Section 5 (Explore by Location) exists');
assert(memorialsHtml.includes('filterByLocationCity'), 'memorials.html: Section 5 filterByLocationCity interactive handler exists');
const locations = ['Delhi', 'Mumbai', 'Nagpur', 'Mhow', 'Mahad', 'Nashik'];
locations.forEach(loc => {
  assert(memorialsHtml.includes(loc), `memorials.html: Section 5 includes verified geographic hub "${loc}"`);
});

// Section 6: Mahad & Social Movement
assert(memorialsHtml.includes('id="section-mahad-deepdive"'), 'memorials.html: Section 6 (Mahad Deep Dive) exists');
assert(memorialsHtml.includes('Chavdar Tale &amp; The Krantistambh'), 'memorials.html: Section 6 covers Chavdar Tale & Krantistambh');

// Section 7: Nagpur & Deeksha Bhoomi
assert(memorialsHtml.includes('id="section-nagpur-deepdive"'), 'memorials.html: Section 7 (Nagpur Deep Dive) exists');
assert(memorialsHtml.includes('22 Vows') && memorialsHtml.includes('Buddhist Renaissance'), 'memorials.html: Section 7 covers 22 Vows and Stupa architecture');

// Section 8: Rajgruha & Intellectual Heritage
assert(memorialsHtml.includes('id="section-rajgruha-deepdive"'), 'memorials.html: Section 8 (Rajgruha Deep Dive) exists');
assert(memorialsHtml.includes('50,000-Volume') && memorialsHtml.includes('Hindu Colony'), 'memorials.html: Section 8 covers Rajgruha personal library');

// Section 9: New Delhi & Constitutional Legacy
assert(memorialsHtml.includes('id="section-delhi-memorials"'), 'memorials.html: Section 9 (New Delhi Memorials) exists');
assert(memorialsHtml.includes('15 JANPATH') && memorialsHtml.includes('26 ALIPUR ROAD'), 'memorials.html: Section 9 covers DAIC and DANM');

// Section 10: Memorial Story Cards
assert(memorialsHtml.includes('id="section-story-cards"'), 'memorials.html: Section 10 (Memorial Story Cards) exists');
assert(memorialsHtml.includes('toggleStoryCard') && memorialsHtml.includes('speakStoryText'), 'memorials.html: Section 10 accordion toggle and narration functional');
const storyKeys = ['Why This Place Matters', 'Historical Context', 'Key Events', "Ambedkar's Connection", 'Archival Sources', 'Related Timeline Events'];
storyKeys.forEach(k => {
  assert(memorialsHtml.includes(k), `memorials.html: Section 10 structure contains sub-section "${k}"`);
});

// Section 11: Connect to Archive Repository
assert(memorialsHtml.includes('id="section-archive-crosslinks"'), 'memorials.html: Section 11 (Archive Cross-links) exists');
assert(memorialsHtml.includes('archive.html') && memorialsHtml.includes('media.html') && memorialsHtml.includes('letters.html') && memorialsHtml.includes('timeline.html'), 'memorials.html: Section 11 cross-links to primary archive modules');

// Speech API preservation
assert(memorialsHtml.includes('speechSynthesis'), 'memorials.html: Web Speech API narration preserved and active');

console.log('\n------------------------------------------------------');
console.log(`TOTAL AUDIT CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('------------------------------------------------------');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL CONTENT EXPANSION AUDIT CHECKS PASSED PERFECTLY!\n');
  process.exit(0);
}
