/* ============================================================
   data.js — Thai alphabet master data
   Mirrors the CSV exactly (Column A → letter, B → group,
   C → audio file base name, D → description).
   Edit this file if you ever need to update the alphabet data.
   ============================================================ */

const ALPHABET_DATA = [
  // ---------- Consonants ----------
  { id: 1,  letter: 'ก', group: 'middle',    audio: 'ก',          description: 'Mid class sounds like ~sky, skate, skill (Like K after S)' },
  { id: 2,  letter: 'ข', group: 'high',      audio: 'ข_ฃ',        description: 'High class sounds like ~ cat, kite, car' },
  { id: 3,  letter: 'ฃ', group: 'high',      audio: 'ข_ฃ',        description: 'High class sounds like ~ cat, kite, car (Obsolete)' },
  { id: 4,  letter: 'ค', group: 'lowPair',   audio: 'ค_ค_ฅ_ฆ',    description: 'Low class pair sounds like ~ cat, kite, car' },
  { id: 5,  letter: 'ฅ', group: 'lowPair',   audio: 'ค_ค_ฅ_ฆ',    description: 'Low class pair sounds like ~ cat, kite, car (Obsolete)' },
  { id: 6,  letter: 'ฆ', group: 'lowPair',   audio: 'ค_ค_ฅ_ฆ',    description: 'Low class pair sounds like ~ cat, kite, car' },
  { id: 7,  letter: 'ง', group: 'lowSingle', audio: 'ง',          description: 'Low class single sounds like ~sing, ring, king(like ng)' },
  { id: 8,  letter: 'จ', group: 'middle',    audio: 'จ',          description: 'Mid class sounds like ~jam, job, joy(+a bit of Ch)' },
  { id: 9,  letter: 'ฉ', group: 'high',      audio: 'ฉ',          description: 'High class sounds like ~chat, church, cheese' },
  { id: 10, letter: 'ช', group: 'lowPair',   audio: 'ช_ฌ',        description: 'Low class pair sounds like ~chat, church, cheese' },
  { id: 11, letter: 'ซ', group: 'lowPair',   audio: 'ซ',          description: 'Low class pair sounds like ~sun, sea, sad' },
  { id: 12, letter: 'ฌ', group: 'lowPair',   audio: 'ช_ฌ',        description: 'Low class pair sounds like ~chat, church, cheese' },
  { id: 13, letter: 'ญ', group: 'lowSingle', audio: 'ย_ญ',        description: 'Low class single sounds like ~yes, you, yellow' },
  { id: 14, letter: 'ฎ', group: 'middle',    audio: 'ด_ฎ',        description: 'Mid class sounds like ~dog, day, door' },
  { id: 15, letter: 'ฏ', group: 'middle',    audio: 'ต_ฏ',        description: 'Mid class sounds like ~stop, star, stay(Like T after S)' },
  { id: 16, letter: 'ฐ', group: 'lowPair',   audio: 'ถ_ฐ',        description: 'Low class pair sounds like ~time, top, tea' },
  { id: 17, letter: 'ฑ', group: 'lowPair',   audio: 'ฑ_ฒ_ท_ธ',    description: 'Low class pair sounds like ~time, top, tea' },
  { id: 18, letter: 'ฒ', group: 'lowPair',   audio: 'ฑ_ฒ_ท_ธ',    description: 'Low class pair sounds like ~time, top, tea' },
  { id: 19, letter: 'ณ', group: 'lowSingle', audio: 'น_ณ',        description: 'Low class single sounds like ~no, name, nice' },
  { id: 20, letter: 'ด', group: 'middle',    audio: 'ด_ฎ',        description: 'Mid class sounds like ~dog, day, door' },
  { id: 21, letter: 'ต', group: 'middle',    audio: 'ต_ฏ',        description: 'Mid class sounds like ~stop, star, stay(Like T after S)' },
  { id: 22, letter: 'ถ', group: 'high',      audio: 'ถ_ฐ',        description: 'High class sounds like ~time, top, tea' },
  { id: 23, letter: 'ท', group: 'lowPair',   audio: 'ฑ_ฒ_ท_ธ',    description: 'Low class pair sounds like ~time, top, tea' },
  { id: 24, letter: 'ธ', group: 'lowPair',   audio: 'ฑ_ฒ_ท_ธ',    description: 'Low class pair sounds like ~time, top, tea' },
  { id: 25, letter: 'น', group: 'lowSingle', audio: 'น_ณ',        description: 'Low class single sounds like ~no, name, nice' },
  { id: 26, letter: 'บ', group: 'middle',    audio: 'บ',          description: 'Mid class sounds like ~boy, bat, book' },
  { id: 27, letter: 'ป', group: 'middle',    audio: 'ป',          description: 'Mid class sounds like ~spot, spin, spoon(Like P after S)' },
  { id: 28, letter: 'ผ', group: 'high',      audio: 'ผ',          description: 'High class sounds like ~pen, pig, pan' },
  { id: 29, letter: 'ฝ', group: 'high',      audio: 'ฝ',          description: 'High class sounds like ~fan, fish, four' },
  { id: 30, letter: 'พ', group: 'lowPair',   audio: 'พ_ภ',        description: 'Low class pair sounds like ~pen, pig, pan' },
  { id: 31, letter: 'ฟ', group: 'lowPair',   audio: 'ฟ',          description: 'Low class pair sounds like ~fan, fish, four' },
  { id: 32, letter: 'ภ', group: 'lowPair',   audio: 'พ_ภ',        description: 'Low class pair sounds like ~pen, pig, pan' },
  { id: 33, letter: 'ม', group: 'lowSingle', audio: 'ม',          description: 'Low class single sounds like ~man, moon, milk' },
  { id: 34, letter: 'ย', group: 'lowSingle', audio: 'ย_ญ',        description: 'Low class single sounds like ~yes, you, yellow' },
  { id: 35, letter: 'ร', group: 'lowSingle', audio: 'ร',          description: 'Low class single sounds like ~run, red, rat' },
  { id: 36, letter: 'ล', group: 'lowSingle', audio: 'ล_ฬ',        description: 'Low class single sounds like ~love, look, lion' },
  { id: 37, letter: 'ว', group: 'lowSingle', audio: 'ว',          description: 'Low class single sounds like ~we, win, water' },
  { id: 38, letter: 'ศ', group: 'high',      audio: 'ศ_ษ_ส',      description: 'High class sounds like ~sun, sea, sad' },
  { id: 39, letter: 'ษ', group: 'high',      audio: 'ศ_ษ_ส',      description: 'High class sounds like ~sun, sea, sad' },
  { id: 40, letter: 'ส', group: 'high',      audio: 'ศ_ษ_ส',      description: 'High class sound like ~sun, sea, sad' },
  { id: 41, letter: 'ห', group: 'high',      audio: 'ห',          description: 'High class sounds like ~hat, hot, home' },
  { id: 42, letter: 'ฬ', group: 'lowSingle', audio: 'ล_ฬ',        description: 'Low class single sounds like ~love, look, lion' },
  { id: 43, letter: 'อ', group: 'middle',    audio: 'อ',          description: 'Mid class sounds like ~boy, door, for (as the vowel sound)' },
  { id: 44, letter: 'ฮ', group: 'lowPair',   audio: 'ฮ',          description: 'Low class pair sounds like ~hat, hot, home' },

  // ---------- Vowels ----------
  { id: 45, letter: '◌า',    group: 'vowel', audio: 'อา',    description: 'Long vowel (~car, father, star )' },
  { id: 46, letter: 'เ◌',    group: 'vowel', audio: 'เอ',    description: 'Long vowel (~ day, say, play)' },
  { id: 47, letter: '◌ี',    group: 'vowel', audio: 'อี',    description: 'Long vowel (~ see, tree, free)' },
  { id: 48, letter: 'โ◌',    group: 'vowel', audio: 'โอ',    description: 'Long vowel (~ go, no, so)' },
  { id: 49, letter: '◌ู',    group: 'vowel', audio: 'อู',    description: 'Long vowel (~ shoe, too, boot)' },
  { id: 50, letter: '◌ือ',   group: 'vowel', audio: 'อือ',   description: 'Long vowel (~ /ɯː/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed)' },
  { id: 51, letter: '◌ื',    group: 'vowel', audio: 'อือ',   description: 'Long vowel (~ /ɯː/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed) 2nd form' },
  { id: 52, letter: 'แ◌',    group: 'vowel', audio: 'แอ',    description: 'Long vowel (~ cat, bat, map)' },
  { id: 53, letter: '◌อ',    group: 'vowel', audio: 'ออ',    description: 'Long vowel (~ boy, door, for)' },
  { id: 54, letter: 'เ◌อ',   group: 'vowel', audio: 'เออ',   description: 'Long vowel (~ bird, her, shirt)' },
  { id: 55, letter: 'เ◌ิ',   group: 'vowel', audio: 'เออ',   description: 'Long vowel (~ bird, her, shirt) the 2nd form' },
  { id: 56, letter: 'เ◌ีย',  group: 'vowel', audio: 'เอีย',  description: 'Long vowel (~/ia/ or try to say "ear, hear, near" and relax the "r" part or like "yeah")' },
  { id: 57, letter: 'เ◌ือ',  group: 'vowel', audio: 'เอือ',  description: 'Long vowel (~/ɯːa/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed, then finish by "aa" sound)' },
  { id: 58, letter: '◌ัว',   group: 'vowel', audio: 'อัว',   description: 'Long vowel (~ /ʊə/ or try to say tour, dual, poor and relax the "r" part)' },
  { id: 59, letter: '◌ว',    group: 'vowel', audio: 'อัว',   description: 'Long vowel (~ /ʊə/ or try to say tour, dual, poor and relax the "r" part)' },
  { id: 60, letter: '◌ำ',    group: 'vowel', audio: 'อำ',    description: 'extra vowel (~Jump, Numb, Yum)' },
  { id: 61, letter: 'ไ◌',    group: 'vowel', audio: 'ไอ_ใอ', description: 'extra vowel (~ice, my, bye)' },
  { id: 62, letter: 'ใ◌',    group: 'vowel', audio: 'ไอ_ใอ', description: 'extra vowel (~ice, my, bye)' },
  { id: 63, letter: 'เ◌า',   group: 'vowel', audio: 'เอา',   description: 'extra vowel (~ cow, how, now)' },
  { id: 64, letter: '◌ะ',    group: 'vowel', audio: 'อะ',    description: 'Short vowel (~car, father, star )' },
  { id: 65, letter: '◌ั',    group: 'vowel', audio: 'อะ',    description: 'Short vowel (~car, father, star ) 2nd form' },
  { id: 66, letter: 'เ◌ะ',   group: 'vowel', audio: 'เอะ',   description: 'Short vowel (~ day, say, play)' },
  { id: 67, letter: '◌ิ',    group: 'vowel', audio: 'อิ',    description: 'Short vowel (~ see, tree, free)' },
  { id: 68, letter: 'โ◌ะ',   group: 'vowel', audio: 'โอะ',   description: 'Short vowel (~ go, no, so)' },
  { id: 69, letter: 'not showing anything, but the sound is still here.', group: 'vowel', audio: 'โอะ', description: 'Short vowel (~ go, no, so) 2nd form' },
  { id: 70, letter: '◌ุ',    group: 'vowel', audio: 'อุ',    description: 'Short vowel (~ shoe, too, boot)' },
  { id: 71, letter: '◌ึ',    group: 'vowel', audio: 'อึ',    description: 'Short vowel (~ /ɯ/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed)' },
  { id: 72, letter: 'แ◌ะ',   group: 'vowel', audio: 'แอะ',   description: 'Short vowel (~ cat, bat, map)' },
  { id: 73, letter: 'แ◌็',   group: 'vowel', audio: 'แอะ',   description: 'Short vowel (~ cat, bat, map) 2nd form' },
  { id: 74, letter: 'เ◌าะ',  group: 'vowel', audio: 'เอาะ',  description: 'Short vowel (~ boy, door, for)' },
  { id: 75, letter: '◌็อ',   group: 'vowel', audio: 'เอาะ',  description: 'Short vowel (~ boy, door, for) 2nd form' },
  { id: 76, letter: 'เ◌อะ',  group: 'vowel', audio: 'เออะ',  description: 'Short vowel (~ bird, her, shirt)' },
  { id: 77, letter: 'เ◌ียะ', group: 'vowel', audio: 'เอียะ', description: 'Short vowel (~/ɯːa/ no equivalent, the closest sound is to try to say "good" with a wide smile and teeth closed, then finish by "aa" sound)' },
  { id: 78, letter: 'เ◌ือะ', group: 'vowel', audio: 'เอือะ', description: 'Short vowel (~ /ʊə/ or try to say tour, dual, poor and relax the "r" part)' },
  { id: 79, letter: '◌ัวะ',  group: 'vowel', audio: 'อัวะ',  description: 'Short vowel (~ /ʊə/ or try to say tour, dual, poor and relax the "r" part)' },
  { id: 80, letter: 'ฤ',     group: 'vowel', audio: 'ฤ',     description: 'Independent Shortvowel (~ no equivalent)' },
  { id: 81, letter: 'ฤๅ',    group: 'vowel', audio: 'ฤๅ',    description: 'Independent Long vowel (~ no equivalent)' },
  { id: 82, letter: 'ฦ',     group: 'vowel', audio: 'ฦ',     description: '(Obsolete) Short Independent vowel (~ no equivalent)' },
  { id: 83, letter: 'ฦๅ',    group: 'vowel', audio: 'ฦๅ',    description: '(Obsolete) Independent Long vowel (~ no equivalent)' },
];

/* ----- Helpers used by app.js ----- */

function getEntriesForCategory(categoryId) {
  switch (categoryId) {
    case 'middle':           return ALPHABET_DATA.filter(e => e.group === 'middle');
    case 'high':             return ALPHABET_DATA.filter(e => e.group === 'high');
    case 'lowPair':          return ALPHABET_DATA.filter(e => e.group === 'lowPair');
    case 'lowSingle':        return ALPHABET_DATA.filter(e => e.group === 'lowSingle');
    case 'mixedConsonants':  return ALPHABET_DATA.filter(e => e.group !== 'vowel');
    case 'vowels':           return ALPHABET_DATA.filter(e => e.group === 'vowel');
    case 'all':              return ALPHABET_DATA.slice();
    default:                 return [];
  }
}
