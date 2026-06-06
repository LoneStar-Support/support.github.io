/* ============================================================
   LoneStar Support — Enneagram "Map" quiz: question bank
   ------------------------------------------------------------
   Source: "Discerning Questions per Type" (Daniel, Yasmina,
   Isabelle, Sept 2020). Each bullet from the source is ONE
   slider comparing two types.

   INVARIANT: lo < hi ALWAYS.
     lo = lower-numbered type = LEFT end of the slider
     hi = higher-numbered type = RIGHT end of the slider
   The source lists options in inconsistent order, so each
   phrase is mapped to its type by MEANING (not word order):
   loLabel is always the lo-type's phrase, hiLabel the hi-type's.

   No build step; plain script. Defines two globals consumed by
   quiz.js: ENNEAGRAM_QUESTIONS and ENNEAGRAM_AXES.
   ============================================================ */

/* Short value-phrase per type — used for radar spokes + pairing headings. */
var ENNEAGRAM_AXES = {
  1: "Do it right",
  2: "Be kind & helpful",
  3: "Achieve excellence",
  4: "Nurture uniqueness",
  5: "Be calm & smart",
  6: "Be alert & prepared",
  7: "Joy & adventure",
  8: "Be strong & brave",
  9: "Keep the peace"
};

var ENNEAGRAM_QUESTIONS = [
  /* ---------- Type 1 vs … ---------- */
  { id: "1v2-1", lo: 1, hi: 2, prompt: "What matters most?", loLabel: "How you view yourself", hiLabel: "How others perceive you" },
  { id: "1v2-2", lo: 1, hi: 2, prompt: "You care more about…", loLabel: "Reaching your internal standards", hiLabel: "People liking you" },
  { id: "1v2-3", lo: 1, hi: 2, prompt: "When it comes down to it, it's about…", loLabel: "Doing it right", hiLabel: "Meeting others' needs" },
  { id: "1v2-4", lo: 1, hi: 2, prompt: "The world needs more…", loLabel: "Righteousness", hiLabel: "Kindness" },

  { id: "1v3-1", lo: 1, hi: 3, prompt: "You pay more attention to…", loLabel: "Reaching your own standards of perfection", hiLabel: "How others perceive you (your image)" },
  { id: "1v3-2", lo: 1, hi: 3, prompt: "What matters most?", loLabel: "Right and wrong", hiLabel: "Looking good" },
  { id: "1v3-3", lo: 1, hi: 3, prompt: "When it comes down to it, it's about…", loLabel: "Doing it perfectly, without mistakes", hiLabel: "Achieving it efficiently" },
  { id: "1v3-4", lo: 1, hi: 3, prompt: "Everyone should…", loLabel: "Have integrity", hiLabel: "Work hard" },

  { id: "1v4-1", lo: 1, hi: 4, prompt: "Which is more you?", loLabel: "Control your emotions", hiLabel: "Feel a wide range of emotions" },
  { id: "1v4-2", lo: 1, hi: 4, prompt: "When it comes down to it, it's about…", loLabel: "Doing it right", hiLabel: "Being special and unique" },
  { id: "1v4-3", lo: 1, hi: 4, prompt: "The world would be better if everyone would…", loLabel: "Take a stand and do the right thing", hiLabel: "Create beauty and share true feelings" },

  { id: "1v5-1", lo: 1, hi: 5, prompt: "You're more critical when others…", loLabel: "Do it wrong", hiLabel: "Don't understand" },
  { id: "1v5-2", lo: 1, hi: 5, prompt: "When it comes down to it, it's about…", loLabel: "Doing the right thing", hiLabel: "Complete knowledge and understanding" },
  { id: "1v5-3", lo: 1, hi: 5, prompt: "The world would be better if everyone would…", loLabel: "Take a stand and do the right thing", hiLabel: "Study the best information and apply it" },

  { id: "1v6-1", lo: 1, hi: 6, prompt: "You're more critical when others…", loLabel: "Do it wrong", hiLabel: "Do something unsafe" },
  { id: "1v6-2", lo: 1, hi: 6, prompt: "Do you tend to…", loLabel: "Follow the rules", hiLabel: "Question the rules" },
  { id: "1v6-3", lo: 1, hi: 6, prompt: "When it comes down to it, it's about…", loLabel: "Doing it right", hiLabel: "Being safe" },
  { id: "1v6-4", lo: 1, hi: 6, prompt: "The world would be better if everyone would…", loLabel: "Take a stand and do the right thing", hiLabel: "Prepare for the worst and stay loyal" },

  { id: "1v7-1", lo: 1, hi: 7, prompt: "What comes first?", loLabel: "Work", hiLabel: "Play" },
  { id: "1v7-2", lo: 1, hi: 7, prompt: "When it comes down to it, it's about…", loLabel: "Doing it right", hiLabel: "Enjoying yourself" },
  { id: "1v7-3", lo: 1, hi: 7, prompt: "The world would be better if everyone would…", loLabel: "Take a stand and do the right thing", hiLabel: "Commit to joy and adventure" },

  { id: "1v8-1", lo: 1, hi: 8, prompt: "Do you tend to…", loLabel: "Control your impulses", hiLabel: "Go with your impulses" },
  { id: "1v8-2", lo: 1, hi: 8, prompt: "When it comes down to it, it's about…", loLabel: "Doing it right", hiLabel: "Appearing strong" },
  { id: "1v8-3", lo: 1, hi: 8, prompt: "The world would be better if everyone would…", loLabel: "Take a stand and do the right thing", hiLabel: "Be (or follow) a strong leader" },

  { id: "1v9-1", lo: 1, hi: 9, prompt: "Which is more you?", loLabel: "Know the right way to do things", hiLabel: "Hard time knowing your own opinion" },
  { id: "1v9-2", lo: 1, hi: 9, prompt: "When it comes down to it, it's about…", loLabel: "Doing it right", hiLabel: "Reaching consensus or harmony" },
  { id: "1v9-3", lo: 1, hi: 9, prompt: "The world would be better if everyone would…", loLabel: "Follow their conscience", hiLabel: "Keep the peace" },

  /* ---------- Type 2 vs … ---------- */
  { id: "2v3-1", lo: 2, hi: 3, prompt: "What matters most?", loLabel: "Being liked, avoiding rejection", hiLabel: "Success, avoiding failure" },
  { id: "2v3-2", lo: 2, hi: 3, prompt: "When it comes down to it, it's about…", loLabel: "Meeting others' needs (helping)", hiLabel: "Accomplishing goals and tasks" },
  { id: "2v3-3", lo: 2, hi: 3, prompt: "Everyone should…", loLabel: "Help people who need it", hiLabel: "Work hard and achieve excellence" },

  { id: "2v4-1", lo: 2, hi: 4, prompt: "Which is more you?", loLabel: "Stay optimistic", hiLabel: "Focus on what's missing" },
  { id: "2v4-2", lo: 2, hi: 4, prompt: "When it comes down to it, it's about…", loLabel: "Making others happy", hiLabel: "Being true to yourself" },
  { id: "2v4-3", lo: 2, hi: 4, prompt: "Everyone should…", loLabel: "Help the needy", hiLabel: "Be true to themselves" },

  { id: "2v5-1", lo: 2, hi: 5, prompt: "You're more preoccupied with…", loLabel: "People", hiLabel: "Ideas" },
  { id: "2v5-2", lo: 2, hi: 5, prompt: "You want more…", loLabel: "Close relationships with others", hiLabel: "Privacy and alone time" },
  { id: "2v5-3", lo: 2, hi: 5, prompt: "The world would be better if everyone would…", loLabel: "Be kind and helpful", hiLabel: "Be intelligent and logical" },

  { id: "2v6-1", lo: 2, hi: 6, prompt: "With authority figures, you…", loLabel: "Try to be liked by them", hiLabel: "Are suspicious or rebellious" },
  { id: "2v6-2", lo: 2, hi: 6, prompt: "When it comes down to it, it's about…", loLabel: "Being liked", hiLabel: "Being safe" },
  { id: "2v6-3", lo: 2, hi: 6, prompt: "The world would be better if everyone would…", loLabel: "Be kind and helpful", hiLabel: "Be alert and prepared" },

  { id: "2v7-1", lo: 2, hi: 7, prompt: "You do things because…", loLabel: "You want people to like you", hiLabel: "They're fun" },
  { id: "2v7-2", lo: 2, hi: 7, prompt: "When it comes down to it, it's about…", loLabel: "Feeling loved", hiLabel: "Being free" },
  { id: "2v7-3", lo: 2, hi: 7, prompt: "The world would be better if everyone would…", loLabel: "Be kind and helpful", hiLabel: "Commit to a life of joy" },

  { id: "2v8-1", lo: 2, hi: 8, prompt: "With others, you tend to…", loLabel: "Serve their needs by adjusting to them", hiLabel: "Challenge them to be their best" },
  { id: "2v8-2", lo: 2, hi: 8, prompt: "When it comes down to it, it's about…", loLabel: "Feeling loved", hiLabel: "Being truthful" },
  { id: "2v8-3", lo: 2, hi: 8, prompt: "The world would be better if everyone would…", loLabel: "Be kind and helpful", hiLabel: "Be strong and brave" },

  { id: "2v9-1", lo: 2, hi: 9, prompt: "With others' needs, you tend to…", loLabel: "Actively try to meet them", hiLabel: "Merge with their needs and agendas" },
  { id: "2v9-2", lo: 2, hi: 9, prompt: "If your needs aren't met, it's because…", loLabel: "You didn't earn it", hiLabel: "You don't matter" },
  { id: "2v9-3", lo: 2, hi: 9, prompt: "The world would be better if everyone would…", loLabel: "Be kind and helpful", hiLabel: "Keep the peace" },

  /* ---------- Type 3 vs … ---------- */
  { id: "3v4-1", lo: 3, hi: 4, prompt: "When it comes down to it, it's about…", loLabel: "Accomplishing the tasks", hiLabel: "Feeling all the feelings" },
  { id: "3v4-2", lo: 3, hi: 4, prompt: "When it comes down to it, it's about…", loLabel: "Being successful", hiLabel: "Being unique and special" },
  { id: "3v4-3", lo: 3, hi: 4, prompt: "The world would be better if everyone would…", loLabel: "Persevere to achieve excellence", hiLabel: "Nurture their unique gifts" },

  { id: "3v5-1", lo: 3, hi: 5, prompt: "You're more preoccupied with…", loLabel: "Being impressive to others", hiLabel: "Understanding things" },
  { id: "3v5-2", lo: 3, hi: 5, prompt: "When it comes down to it, it's about…", loLabel: "Being successful", hiLabel: "Knowing everything" },
  { id: "3v5-3", lo: 3, hi: 5, prompt: "The world would be better if everyone would…", loLabel: "Persevere to achieve excellence", hiLabel: "Be intelligent and logical" },

  { id: "3v6-1", lo: 3, hi: 6, prompt: "Which is more you?", loLabel: "Move quickly and efficiently toward goals", hiLabel: "Plan for worst-case scenarios" },
  { id: "3v6-2", lo: 3, hi: 6, prompt: "When it comes down to it, it's about…", loLabel: "Being successful", hiLabel: "Being safe" },
  { id: "3v6-3", lo: 3, hi: 6, prompt: "The world would be better if everyone would…", loLabel: "Persevere to achieve excellence", hiLabel: "Be alert and prepared" },

  { id: "3v7-1", lo: 3, hi: 7, prompt: "You're more preoccupied with…", loLabel: "Looking good", hiLabel: "Enjoying all life has to offer" },
  { id: "3v7-2", lo: 3, hi: 7, prompt: "When it comes down to it, it's about…", loLabel: "Getting things accomplished", hiLabel: "Having fun" },
  { id: "3v7-3", lo: 3, hi: 7, prompt: "The world would be better if everyone would…", loLabel: "Persevere to achieve excellence", hiLabel: "Embody joy and fun" },

  { id: "3v8-1", lo: 3, hi: 8, prompt: "Which is more you?", loLabel: "Focus on how others perceive you", hiLabel: "Tell the truth no matter what" },
  { id: "3v8-2", lo: 3, hi: 8, prompt: "When it comes down to it, it's about…", loLabel: "Being successful and looking good", hiLabel: "Being powerful" },
  { id: "3v8-3", lo: 3, hi: 8, prompt: "The world would be better if everyone would…", loLabel: "Persevere to achieve excellence", hiLabel: "Be strong and brave" },

  { id: "3v9-1", lo: 3, hi: 9, prompt: "With a lot to do, you tend to…", loLabel: "Double down on focus", hiLabel: "Get distracted from your priorities" },
  { id: "3v9-2", lo: 3, hi: 9, prompt: "When it comes down to it, it's about…", loLabel: "Accomplishing tasks and goals", hiLabel: "Maintaining peace and harmony" },
  { id: "3v9-3", lo: 3, hi: 9, prompt: "The world would be better if everyone would…", loLabel: "Persevere to achieve excellence", hiLabel: "Help everyone get along" },

  /* ---------- Type 4 vs … ---------- */
  { id: "4v5-1", lo: 4, hi: 5, prompt: "With strong emotions, you…", loLabel: "Feel comfortable with them", hiLabel: "Avoid strong emotional experiences" },
  { id: "4v5-2", lo: 4, hi: 5, prompt: "When it comes down to it, it's about…", loLabel: "Feeling all your feelings", hiLabel: "Thinking and accessing all knowledge" },
  { id: "4v5-3", lo: 4, hi: 5, prompt: "The world would be better if everyone would…", loLabel: "Nurture their uniqueness", hiLabel: "Be smart, calm, and logical" },

  { id: "4v6-1", lo: 4, hi: 6, prompt: "You think more about…", loLabel: "What's missing in your life", hiLabel: "Worst-case scenarios" },
  { id: "4v6-2", lo: 4, hi: 6, prompt: "When it comes down to it, it's about…", loLabel: "Being unique and special", hiLabel: "Being safe" },
  { id: "4v6-3", lo: 4, hi: 6, prompt: "The world would be better if everyone would…", loLabel: "Nurture their unique gifts", hiLabel: "Be alert and prepared" },

  { id: "4v7-1", lo: 4, hi: 7, prompt: "With sadness and melancholy, you…", loLabel: "Move toward it", hiLabel: "Move away from it" },
  { id: "4v7-2", lo: 4, hi: 7, prompt: "When it comes down to it, it's about…", loLabel: "Being special and unique", hiLabel: "Seeking pleasure and fun" },
  { id: "4v7-3", lo: 4, hi: 7, prompt: "The world would be better if everyone would…", loLabel: "Nurture their unique gifts", hiLabel: "Be fun and joyful" },

  { id: "4v8-1", lo: 4, hi: 8, prompt: "With emotional vulnerability, you…", loLabel: "Feel comfortable being vulnerable", hiLabel: "Avoid being vulnerable" },
  { id: "4v8-2", lo: 4, hi: 8, prompt: "When it comes down to it, it's about…", loLabel: "Being special and unique", hiLabel: "Being strong and powerful" },
  { id: "4v8-3", lo: 4, hi: 8, prompt: "The world would be better if everyone would…", loLabel: "Create more beauty and depth", hiLabel: "Be a strong leader to follow" },

  { id: "4v9-1", lo: 4, hi: 9, prompt: "When you feel bad, it's because you were…", loLabel: "Ostracized or rejected", hiLabel: "Passed over and invisible" },
  { id: "4v9-2", lo: 4, hi: 9, prompt: "When it comes down to it, it's about…", loLabel: "Being special and unique", hiLabel: "Creating harmony" },
  { id: "4v9-3", lo: 4, hi: 9, prompt: "The world would be better if everyone would…", loLabel: "Nurture their unique gifts", hiLabel: "Have everyone get along" },

  /* ---------- Type 5 vs … ---------- */
  { id: "5v6-1", lo: 5, hi: 6, prompt: "You worry more that people…", loLabel: "Steal your energy and time", hiLabel: "Do unsafe things" },
  { id: "5v6-2", lo: 5, hi: 6, prompt: "When it comes down to it, it's about…", loLabel: "Creating understanding", hiLabel: "Creating safety" },
  { id: "5v6-3", lo: 5, hi: 6, prompt: "The world would be better if everyone would…", loLabel: "Be calm and smart", hiLabel: "Be alert and prepared" },

  { id: "5v7-1", lo: 5, hi: 7, prompt: "You tend to…", loLabel: "Retract to protect your boundaries", hiLabel: "Expand your limits and options" },
  { id: "5v7-2", lo: 5, hi: 7, prompt: "When it comes down to it, it's about…", loLabel: "Going deep on one topic", hiLabel: "Learning a bit of everything" },
  { id: "5v7-3", lo: 5, hi: 7, prompt: "The world would be better if everyone would…", loLabel: "Be calm and smart", hiLabel: "Be joyful and fun" },

  { id: "5v8-1", lo: 5, hi: 8, prompt: "You tend to…", loLabel: "Overthink before taking action", hiLabel: "Leap into action fast" },
  { id: "5v8-2", lo: 5, hi: 8, prompt: "When it comes down to it, it's about…", loLabel: "Being wise", hiLabel: "Being powerful" },
  { id: "5v8-3", lo: 5, hi: 8, prompt: "The world would be better if everyone would…", loLabel: "Be calm and smart", hiLabel: "Be a strong leader to follow" },

  /* 5v9: source bullet 3 ("Be alert and prepared" for type 9) is a copy/paste typo
     — that's Type 6's phrase — so it is dropped; the A/B bullet below is kept. */
  { id: "5v9-1", lo: 5, hi: 9, prompt: "You tend to…", loLabel: "Detach to protect your space", hiLabel: "Blend in to facilitate harmony" },
  { id: "5v9-2", lo: 5, hi: 9, prompt: "When it comes down to it, it's about…", loLabel: "Having all the answers", hiLabel: "Getting along with friends" },
  { id: "5v9-3", lo: 5, hi: 9, prompt: "The world would be better if everyone would…", loLabel: "Be calm and smart", hiLabel: "Get along harmoniously" },

  /* ---------- Type 6 vs … ---------- */
  { id: "6v7-1", lo: 6, hi: 7, prompt: "You tend to think about…", loLabel: "Worst-case scenarios", hiLabel: "Positive possibilities" },
  { id: "6v7-2", lo: 6, hi: 7, prompt: "When it comes down to it, it's about…", loLabel: "Being safe", hiLabel: "Seeking pleasure" },
  { id: "6v7-3", lo: 6, hi: 7, prompt: "The world would be better if everyone would…", loLabel: "Be alert and prepared", hiLabel: "Be joyful and fun" },

  { id: "6v8-1", lo: 6, hi: 8, prompt: "You tend to…", loLabel: "Doubt yourself and overthink", hiLabel: "Know and move into action quickly" },
  { id: "6v8-2", lo: 6, hi: 8, prompt: "When it comes down to it, it's about…", loLabel: "Seeking safety", hiLabel: "Seeking power" },
  { id: "6v8-3", lo: 6, hi: 8, prompt: "The world would be better if everyone would…", loLabel: "Be alert and prepared", hiLabel: "Be a strong leader to follow" },

  { id: "6v9-1", lo: 6, hi: 9, prompt: "With authority, you tend to…", loLabel: "Doubt it", hiLabel: "Go along with it" },
  { id: "6v9-2", lo: 6, hi: 9, prompt: "When something goes wrong, you're…", loLabel: "Rattled by mishaps", hiLabel: "Easygoing and unflappable" },
  { id: "6v9-3", lo: 6, hi: 9, prompt: "You prefer to…", loLabel: "Vent your fears and doubts", hiLabel: "Stay silent and keep inner peace" },
  { id: "6v9-4", lo: 6, hi: 9, prompt: "The world would be better if everyone would…", loLabel: "Be alert and prepared", hiLabel: "Develop inner peace" },

  /* ---------- Type 7 vs … ---------- */
  { id: "7v8-1", lo: 7, hi: 8, prompt: "You see yourself as…", loLabel: "An idealistic optimist", hiLabel: "A hard-nosed realist" },
  { id: "7v8-2", lo: 7, hi: 8, prompt: "When it comes down to it, it's about…", loLabel: "Being free", hiLabel: "Being powerful" },
  { id: "7v8-3", lo: 7, hi: 8, prompt: "The world would be better if everyone would…", loLabel: "Commit to joy and fun", hiLabel: "Be a strong leader to follow" },

  { id: "7v9-1", lo: 7, hi: 9, prompt: "You tend to be…", loLabel: "Clear about what you want", hiLabel: "Unsure what you want" },
  { id: "7v9-2", lo: 7, hi: 9, prompt: "When it comes down to it, it's about…", loLabel: "Seeking excitement and high energy", hiLabel: "Seeking peace and an even keel" },
  { id: "7v9-3", lo: 7, hi: 9, prompt: "The world would be better if everyone would…", loLabel: "Commit to a life of adventure", hiLabel: "Find inner peace" },

  /* ---------- Type 8 vs 9 ---------- */
  { id: "8v9-1", lo: 8, hi: 9, prompt: "You tend to…", loLabel: "Tell your truth and confront easily", hiLabel: "Go along to keep the peace" },
  { id: "8v9-2", lo: 8, hi: 9, prompt: "When it comes down to it, it's about…", loLabel: "Seeking power", hiLabel: "Seeking harmony" },
  { id: "8v9-3", lo: 8, hi: 9, prompt: "The world would be better if everyone would…", loLabel: "Be a strong leader to follow", hiLabel: "Commit to a life of inner peace" }
];
