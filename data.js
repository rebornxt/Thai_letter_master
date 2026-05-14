/* ============================================================
   data.js — Thai alphabet master data  (v2.0 schema)
   Generated from CSV columns:
     A → letter   (Thai script; "-" is converted to ◌ for vowels)
     B → group    (Thai script in CSV → internal id below)
     C → audio    (file base name in Sound/)
     D → description
   Length is derived from description text for vowel entries.

   Group ids:
     Consonants: "middle", "high", "lowPair", "lowSingle"
     Vowels:     "simpleVowel", "compoundVowel", "specialVowel"
   Length (vowels only): "short" | "long"
   ============================================================ */

const ALPHABET_DATA = [
  { id:  1, letter: 'ก', group: 'middle', audio: 'ก', description: 'Mid class sounds like ~sky, skate, skill (Like K after S)' },
  { id:  2, letter: 'ข', group: 'high', audio: 'ข_ฃ', description: 'High class sounds like ~ cat, kite, car' },
  { id:  3, letter: 'ฃ', group: 'high', audio: 'ข_ฃ', description: 'High class sounds like ~ cat, kite, car (Obsolete)' },
  { id:  4, letter: 'ค', group: 'lowPair', audio: 'ค_ค_ฅ_ฆ', description: 'Low class pair sounds like ~ cat, kite, car' },
  { id:  5, letter: 'ฅ', group: 'lowPair', audio: 'ค_ค_ฅ_ฆ', description: 'Low class pair sounds like ~ cat, kite, car (Obsolete)' },
  { id:  6, letter: 'ฆ', group: 'lowPair', audio: 'ค_ค_ฅ_ฆ', description: 'Low class pair sounds like ~ cat, kite, car' },
  { id:  7, letter: 'ง', group: 'lowSingle', audio: 'ง', description: 'Low class single sounds like ~sing, ring, king(like ng)' },
  { id:  8, letter: 'จ', group: 'middle', audio: 'จ', description: 'Mid class sounds like ~jam, job, joy(+a bit of Ch)' },
  { id:  9, letter: 'ฉ', group: 'high', audio: 'ฉ', description: 'High class sounds like ~chat, church, cheese' },
  { id: 10, letter: 'ช', group: 'lowPair', audio: 'ช_ฌ', description: 'Low class pair sounds like ~chat, church, cheese' },
  { id: 11, letter: 'ซ', group: 'lowPair', audio: 'ซ', description: 'Low class pair sounds like ~sun, sea, sad' },
  { id: 12, letter: 'ฌ', group: 'lowPair', audio: 'ช_ฌ', description: 'Low class pair sounds like ~chat, church, cheese' },
  { id: 13, letter: 'ญ', group: 'lowSingle', audio: 'ย_ญ', description: 'Low class single sounds like ~yes, you, yellow' },
  { id: 14, letter: 'ฎ', group: 'middle', audio: 'ด_ฎ', description: 'Mid class sounds like ~dog, day, door' },
  { id: 15, letter: 'ฏ', group: 'middle', audio: 'ต_ฏ', description: 'Mid class sounds like ~stop, star, stay(Like T after S)' },
  { id: 16, letter: 'ฐ', group: 'high', audio: 'ถ_ฐ', description: 'High class sounds like ~time, top, tea' },
  { id: 17, letter: 'ฑ', group: 'lowPair', audio: 'ฑ_ฒ_ท_ธ', description: 'Low class pair sounds like ~time, top, tea' },
  { id: 18, letter: 'ฒ', group: 'lowPair', audio: 'ฑ_ฒ_ท_ธ', description: 'Low class pair sounds like ~time, top, tea' },
  { id: 19, letter: 'ณ', group: 'lowSingle', audio: 'น_ณ', description: 'Low class single sounds like ~no, name, nice' },
  { id: 20, letter: 'ด', group: 'middle', audio: 'ด_ฎ', description: 'Mid class sounds like ~dog, day, door' },
  { id: 21, letter: 'ต', group: 'middle', audio: 'ต_ฏ', description: 'Mid class sounds like ~stop, star, stay(Like T after S)' },
  { id: 22, letter: 'ถ', group: 'high', audio: 'ถ_ฐ', description: 'High class sounds like ~time, top, tea' },
  { id: 23, letter: 'ท', group: 'lowPair', audio: 'ฑ_ฒ_ท_ธ', description: 'Low class pair sounds like ~time, top, tea' },
  { id: 24, letter: 'ธ', group: 'lowPair', audio: 'ฑ_ฒ_ท_ธ', description: 'Low class pair sounds like ~time, top, tea' },
  { id: 25, letter: 'น', group: 'lowSingle', audio: 'น_ณ', description: 'Low class single sounds like ~no, name, nice' },
  { id: 26, letter: 'บ', group: 'middle', audio: 'บ', description: 'Mid class sounds like ~boy, bat, book' },
  { id: 27, letter: 'ป', group: 'middle', audio: 'ป', description: 'Mid class sounds like ~spot, spin, spoon(Like P after S)' },
  { id: 28, letter: 'ผ', group: 'high', audio: 'ผ', description: 'High class sounds like ~pen, pig, pan' },
  { id: 29, letter: 'ฝ', group: 'high', audio: 'ฝ', description: 'High class sounds like ~fan, fish, four' },
  { id: 30, letter: 'พ', group: 'lowPair', audio: 'พ_ภ', description: 'Low class pair sounds like ~pen, pig, pan' },
  { id: 31, letter: 'ฟ', group: 'lowPair', audio: 'ฟ', description: 'Low class pair sounds like ~fan, fish, four' },
  { id: 32, letter: 'ภ', group: 'lowPair', audio: 'พ_ภ', description: 'Low class pair sounds like ~pen, pig, pan' },
  { id: 33, letter: 'ม', group: 'lowSingle', audio: 'ม', description: 'Low class single sounds like ~man, moon, milk' },
  { id: 34, letter: 'ย', group: 'lowSingle', audio: 'ย_ญ', description: 'Low class single sounds like ~yes, you, yellow' },
  { id: 35, letter: 'ร', group: 'lowSingle', audio: 'ร', description: 'Low class single sounds like ~run, red, rat' },
  { id: 36, letter: 'ล', group: 'lowSingle', audio: 'ล_ฬ', description: 'Low class single sounds like ~love, look, lion' },
  { id: 37, letter: 'ว', group: 'lowSingle', audio: 'ว', description: 'Low class single sounds like ~we, win, water' },
  { id: 38, letter: 'ศ', group: 'high', audio: 'ศ_ษ_ส', description: 'High class sounds like ~sun, sea, sad' },
  { id: 39, letter: 'ษ', group: 'high', audio: 'ศ_ษ_ส', description: 'High class sounds like ~sun, sea, sad' },
  { id: 40, letter: 'ส', group: 'high', audio: 'ศ_ษ_ส', description: 'High class sound like ~sun, sea, sad' },
  { id: 41, letter: 'ห', group: 'high', audio: 'ห', description: 'High class sounds like ~hat, hot, home' },
  { id: 42, letter: 'ฬ', group: 'lowSingle', audio: 'ล_ฬ', description: 'Low class single sounds like ~love, look, lion' },
  { id: 43, letter: 'อ', group: 'middle', audio: 'อ', description: 'Mid class sounds like ~boy, door, for (as the vowel sound)' },
  { id: 44, letter: 'ฮ', group: 'lowPair', audio: 'ฮ', description: 'Low class pair sounds like ~hat, hot, home' },
  { id: 45, letter: '◌า', group: 'simpleVowel', audio: 'อา', description: 'Long vowel (~car, father, star )', length: 'long' },
  { id: 46, letter: 'เ◌', group: 'simpleVowel', audio: 'เอ', description: 'Long vowel (~ day, say, play)', length: 'long' },
  { id: 47, letter: '◌ี', group: 'simpleVowel', audio: 'อี', description: 'Long vowel (~ see, tree, free)', length: 'long' },
  { id: 48, letter: 'โ◌', group: 'simpleVowel', audio: 'โอ', description: 'Long vowel (~ go, no, so)', length: 'long' },
  { id: 49, letter: '◌ู', group: 'simpleVowel', audio: 'อู', description: 'Long vowel (~ shoe, too, boot)', length: 'long' },
  { id: 50, letter: '◌ือ', group: 'simpleVowel', audio: 'อือ', description: 'Long vowel (~ /ɯː/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed)', length: 'long' },
  { id: 51, letter: '◌ื', group: 'simpleVowel', audio: 'อือ', description: 'Long vowel (~ /ɯː/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed) 2nd form', length: 'long' },
  { id: 52, letter: 'แ◌', group: 'simpleVowel', audio: 'แอ', description: 'Long vowel (~ cat, bat, map)', length: 'long' },
  { id: 53, letter: '◌อ', group: 'simpleVowel', audio: 'ออ', description: 'Long vowel (~ boy, door, for)', length: 'long' },
  { id: 54, letter: 'เ◌อ', group: 'simpleVowel', audio: 'เออ', description: 'Long vowel (~ bird, her, shirt)', length: 'long' },
  { id: 55, letter: 'เ◌ิ', group: 'simpleVowel', audio: 'เออ', description: 'Long vowel (~ bird, her, shirt) the 2nd form', length: 'long' },
  { id: 56, letter: 'เ◌ีย', group: 'compoundVowel', audio: 'เอีย', description: 'Long vowel (~/ia/ or try to say "ear, hear, near" and relax the "r" part or like "yeah")', length: 'long' },
  { id: 57, letter: 'เ◌ือ', group: 'compoundVowel', audio: 'เอือ', description: 'Long vowel (~/ɯːa/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed, then finish by "aa" sound)', length: 'long' },
  { id: 58, letter: '◌ัว', group: 'compoundVowel', audio: 'อัว', description: 'Long vowel (~ /ʊə/ or try to say tour, dual, poor and relax the "r" part)', length: 'long' },
  { id: 59, letter: '◌ว', group: 'compoundVowel', audio: 'อัว', description: 'Long vowel (~ /ʊə/ or try to say tour, dual, poor and relax the "r" part)', length: 'long' },
  { id: 60, letter: '◌ำ', group: 'specialVowel', audio: 'อำ', description: 'extra vowel (~Jump, Numb, Yum)', length: 'short' },
  { id: 61, letter: 'ไ◌', group: 'specialVowel', audio: 'ไอ_ใอ', description: 'extra vowel (~ice, my, bye)', length: 'short' },
  { id: 62, letter: 'ใ◌', group: 'specialVowel', audio: 'ไอ_ใอ', description: 'extra vowel (~ice, my, bye)', length: 'short' },
  { id: 63, letter: 'เ◌า', group: 'specialVowel', audio: 'เอา', description: 'extra vowel (~ cow, how, now)', length: 'short' },
  { id: 64, letter: '◌ะ', group: 'simpleVowel', audio: 'อะ', description: 'Short vowel (~car, father, star )', length: 'short' },
  { id: 65, letter: '◌ั', group: 'simpleVowel', audio: 'อะ', description: 'Short vowel (~car, father, star ) 2nd form', length: 'short' },
  { id: 66, letter: 'เ◌ะ', group: 'simpleVowel', audio: 'เอะ', description: 'Short vowel (~ day, say, play)', length: 'short' },
  { id: 67, letter: '◌ิ', group: 'simpleVowel', audio: 'อิ', description: 'Short vowel (~ see, tree, free)', length: 'short' },
  { id: 68, letter: 'โ◌ะ', group: 'simpleVowel', audio: 'โอะ', description: 'Short vowel (~ go, no, so)', length: 'short' },
  { id: 69, letter: 'not showing anything, but the sound is still here.', group: 'simpleVowel', audio: 'โอะ', description: 'Short vowel (~ go, no, so) 2nd form', length: 'short' },
  { id: 70, letter: '◌ุ', group: 'simpleVowel', audio: 'อุ', description: 'Short vowel (~ shoe, too, boot)', length: 'short' },
  { id: 71, letter: '◌ึ', group: 'simpleVowel', audio: 'อึ', description: 'Short vowel (~ /ɯ/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed)', length: 'short' },
  { id: 72, letter: 'แ◌ะ', group: 'simpleVowel', audio: 'แอะ', description: 'Short vowel (~ cat, bat, map)', length: 'short' },
  { id: 73, letter: 'แ◌็', group: 'simpleVowel', audio: 'แอะ', description: 'Short vowel (~ cat, bat, map) 2nd form', length: 'short' },
  { id: 74, letter: 'เ◌าะ', group: 'simpleVowel', audio: 'เอาะ', description: 'Short vowel (~ boy, door, for)', length: 'short' },
  { id: 75, letter: '◌็อ', group: 'simpleVowel', audio: 'เอาะ', description: 'Short vowel (~ boy, door, for) 2nd form', length: 'short' },
  { id: 76, letter: 'เ◌อะ', group: 'simpleVowel', audio: 'เออะ', description: 'Short vowel (~ bird, her, shirt)', length: 'short' },
  { id: 77, letter: 'เ◌ียะ', group: 'compoundVowel', audio: 'เอียะ', description: 'Short vowel (~/ɯːa/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed, then finish by "aa" sound)', length: 'short' },
  { id: 78, letter: 'เ◌ือะ', group: 'compoundVowel', audio: 'เอือะ', description: 'Short vowel (~ /ʊə/ or try to say tour, dual, poor and relax the "r" part)', length: 'short' },
  { id: 79, letter: '◌ัวะ', group: 'compoundVowel', audio: 'อัวะ', description: 'Short vowel (~ /ʊə/ or try to say tour, dual, poor and relax the "r" part)', length: 'short' },
  { id: 80, letter: 'ฤ', group: 'specialVowel', audio: 'ฤ', description: 'Independent Shortvowel (~ no equivalent)', length: 'short' },
  { id: 81, letter: 'ฤๅ', group: 'specialVowel', audio: 'ฤๅ', description: 'Independent Long vowel (~ no equivalent)', length: 'long' },
  { id: 82, letter: 'ฦ', group: 'specialVowel', audio: 'ฦ', description: '(Obsolete) Short Independent vowel (~ no equivalent)', length: 'short' },
  { id: 83, letter: 'ฦๅ', group: 'specialVowel', audio: 'ฦๅ', description: '(Obsolete) Independent Long vowel (~ no equivalent)', length: 'long' },
];

/* ----- Helpers used by app.js ----- */

const CONSONANT_GROUPS = ["middle", "high", "lowPair", "lowSingle"];
const VOWEL_GROUPS     = ["simpleVowel", "compoundVowel", "specialVowel"];

function isConsonantEntry(e) { return CONSONANT_GROUPS.indexOf(e.group) !== -1; }
function isVowelEntry(e)     { return VOWEL_GROUPS.indexOf(e.group)     !== -1; }

/*
 * getEntriesForCategory(categoryId)
 *
 * Supports plain ids ("middle", "high", "vowels", "all", "simpleVowel", "longVowel" ...)
 * AND compound vowel filters of the form "vowels-<structure>-<length>" where:
 *   <structure> in {simple, compound, special, any}
 *   <length>    in {short, long, any}
 *
 * Examples:
 *   "vowels-compound-long"   → all Long Compound vowels
 *   "vowels-any-short"       → all Short vowels (any structure)
 *   "vowels-simple-any"      → all Simple vowels (any length)
 *   "vowels-any-any" === "vowels"
 */
function getEntriesForCategory(categoryId) {
  switch (categoryId) {
    // ---- Consonant groups (unchanged) ----
    case 'middle':           return ALPHABET_DATA.filter(e => e.group === 'middle');
    case 'high':             return ALPHABET_DATA.filter(e => e.group === 'high');
    case 'lowPair':          return ALPHABET_DATA.filter(e => e.group === 'lowPair');
    case 'lowSingle':        return ALPHABET_DATA.filter(e => e.group === 'lowSingle');
    case 'mixedConsonants':  return ALPHABET_DATA.filter(isConsonantEntry);

    // ---- Vowel groups ----
    case 'vowels':           return ALPHABET_DATA.filter(isVowelEntry);
    case 'simpleVowel':      return ALPHABET_DATA.filter(e => e.group === 'simpleVowel');
    case 'compoundVowel':    return ALPHABET_DATA.filter(e => e.group === 'compoundVowel');
    case 'specialVowel':     return ALPHABET_DATA.filter(e => e.group === 'specialVowel');
    case 'shortVowel':       return ALPHABET_DATA.filter(e => isVowelEntry(e) && e.length === 'short');
    case 'longVowel':        return ALPHABET_DATA.filter(e => isVowelEntry(e) && e.length === 'long');

    // ---- Everything ----
    case 'all':              return ALPHABET_DATA.slice();
  }

  // ---- Compound vowel filter ----
  const m = /^vowels-(simple|compound|special|any)-(short|long|any)$/.exec(categoryId);
  if (m) {
    const structure = m[1];
    const length    = m[2];
    const structureMap = {
      simple:   'simpleVowel',
      compound: 'compoundVowel',
      special:  'specialVowel',
    };
    return ALPHABET_DATA.filter(e => {
      if (!isVowelEntry(e)) return false;
      if (structure !== 'any' && e.group !== structureMap[structure]) return false;
      if (length    !== 'any' && e.length !== length) return false;
      return true;
    });
  }

  return [];
}
