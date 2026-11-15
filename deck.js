// The deck: everything about this talk lives here. The stage, the speaker notes, the review and the printed
// backup all read this one file. docs/DECK.md explains every field; node scripts/check.js says what's wrong.
//
// DEMO DRAFT, 2026-11-14. Built from the LiRN planning meeting (Nov 12) and the "Literacy Across Different
// Modalities" research doc. Wording is a first draft for Andrew and Sean to adjust. Notes marked [ADD] are
// gaps only the presenters can fill (a source, a name, a finding). Who leads each slide is a proposal.

export default {
  id: "lirn-literacy-ai",
  title: "Literacy Across Modalities",
  subtitle: "AI as a maker of text and a source to navigate, and what stays social about becoming literate.",
  by: "Andrew Rummel and Sean Beaverson",
  url: "https://inquiredu.org/lirn-literacy-ai/",   // live once the repo is public and Pages is on
  links: { site: "./" },
  theme: "light",
  logo: { light: "assets/inquiredu-wordmark.svg", dark: "assets/inquiredu-wordmark-reversed.svg", alt: "inquiredu" },
  mark: { src: "assets/inquiredu-monogram.svg" },

  // Set these once the session's room and start time are confirmed; until then the clock waits for T.
  // day: "2026-11-19", start: "HH:MM", timeZone: "America/Chicago",

  parts: [
    { id: "open", title: "Opening", minutes: 6 },
    { id: "keeps", title: "1 · What literacy keeps", minutes: 9 },
    { id: "maker", title: "2 · AI as a maker of text", minutes: 16, tone: "inverse" },
    { id: "source", title: "3 · AI as a source to navigate", minutes: 11, tone: "inverse" },
    { id: "social", title: "4 · Literacy is social", minutes: 12, tone: "accent" },
    { id: "close", title: "Close", minutes: 6 }
  ],

  slides: [
    // ── Opening ─────────────────────────────────────────────────────────────
    {
      id: "title", part: "open", kind: "title",
      kicker: "LiRN · Intermediate grades", heading: "Literacy Across Modalities", sub: "{subtitle}", by: "{by}",
      notes: "Both: welcome people as they come in. Press T (or Call to order) when you begin; the session clock counts {length} from then."
    },
    {
      id: "plan", part: "open", kind: "plan", heading: "Where we're headed",
      notes: "Sean: one sentence per part. We start with what literacy has always asked of readers, then look at AI two ways (as a maker of text, and as a source to navigate), then the social side of learning, which runs underneath both."
    },
    {
      id: "fluent", part: "open", kind: "statement",
      kicker: "A small cautionary tale",
      heading: "Our session description was drafted by a **meeting bot**.",
      body: "Digital storytelling, AI, teaching reading: all the right words, all at once. Fluent, confident, and not yet saying anything.",
      foot: "Fluent isn't the same as literate.",
      notes: "Andrew: optional opener. Keep it light and self-aimed; the point is the gap between fluent text and meaningful text, not the tool or whoever ran it. Cut this slide if it might land wrong with the organizers."
    },
    {
      id: "pause-arrive", part: "open", kind: "pause",
      kicker: "Turn and talk · {mins}",
      heading: "Where has AI already shown up in your students' **reading and writing**?",
      body: "One example from this fall. Something you saw, a student told you, or you tried yourself.",
      foot: "Talk first. We'll come back to these.",
      timer: 3,
      notes: "Sean: {Mins:words} with a neighbor. Start the timer (T). Listen for two or three examples to name later, especially any that touch differentiation or students checking AI answers."
    },

    // ── 1 · What literacy keeps ─────────────────────────────────────────────
    {
      id: "keeps", part: "keeps", kind: "section",
      heading: "What literacy keeps",
      body: "Print, then screens, now AI. What has being literate always asked of a reader?",
      notes: "Andrew: section one, about {keeps.length}. The move here is to name what stays constant before we talk about what AI changes."
    },
    {
      id: "constants", part: "keeps", kind: "list",
      kicker: "Across print, screens and AI", heading: "What every modality still asks of a reader",
      items: [
        { name: "Making meaning", why: "Building understanding from words, images and sound, not just receiving them." },
        { name: "Judging what to trust", why: "Weighing a text against what else we know and who made it." },
        { name: "Noticing when I don't understand", why: "The quiet monitoring that tells a reader to slow down, reread or check." },
        { name: "Owning what I claim", why: "Being able to explain, defend and take responsibility for what I say I know.", key: true }
      ],
      foot: "Our synthesis, drawing on the New London Group's multiliteracies (1996) and later work on reading across media.",
      notes: "Andrew: read the four names; let the reasons sit. The ✦ is the one AI puts most at risk, because a fluent answer can stand in for my own reasoning without my noticing. This list is our framing, not a published framework; say so if asked."
    },
    {
      id: "four-roles", part: "keeps", kind: "list",
      kicker: "Freebody & Luke, 1990", heading: "Four roles of the reader",
      items: [
        { name: "Code breaker", why: "Decoding: sounds, letters, conventions.", later: true },
        { name: "Text participant", why: "Making meaning from what's on the page.", later: true },
        { name: "Text user", why: "Using and creating texts for real purposes and audiences." },
        { name: "Text analyst", why: "Asking how a text positions me, whose view it carries, what it leaves out.", key: true }
      ],
      foot: "Today we stay with the upper two: AI as a maker of text, and AI as a text to interrogate.",
      notes: "Andrew: the Four Resources model. The roles aren't a sequence; readers need all four. We're deliberately not claiming anything about AI and decoding instruction. It isn't our expertise, and it isn't what this group asked for."
    },
    {
      id: "signpost", part: "keeps", kind: "statement",
      kicker: "A signpost, not a verdict",
      heading: "We're not here to teach decoding with AI. We will watch what it **costs**.",
      body: "If a platform promises to help with early reading, what would tell us it's trading away something the process needs?",
      notes: "Sean: not a prediction that it will. The question is what signposts we'd look for when we adopt a platform that's supposed to help, so we'd know early if it's sacrificing something important. Invite people to hold this question; we won't answer it today."
    },
    {
      id: "framings", part: "keeps", kind: "cards",
      heading: "Two ways AI shows up in literacy work",
      cards: [
        { kicker: "Part 2", heading: "A **maker** of text", body: "A thought partner for writing, and a tool teachers use to create and adapt texts." },
        { kicker: "Part 3", heading: "A **source** to navigate", body: "Content students read, question and decide whether to trust." }
      ],
      foot: "Literacy skills sit under each one.",
      notes: "Andrew: this two-way framing isn't ours. [ADD] credit the author Andrew used in his earlier session. Narrowing to these two keeps us in the intermediate grades and inside an hour."
    },

    // ── 2 · AI as a maker of text ───────────────────────────────────────────
    {
      id: "maker", part: "maker", kind: "section",
      heading: "AI as a maker of text",
      body: "When AI writes alongside students, and when teachers use it to write for them.",
      notes: "Andrew: section two, about {maker.length}. We'll spend most of it on one practice: using AI to level or differentiate a text."
    },
    {
      id: "tension", part: "maker", kind: "statement",
      kicker: "The tension",
      heading: "“Every kid needs a grade-level text.”",
      body: "Then a newcomer joins your third-grade class in October.",
      notes: "Andrew: the talking point is right about expectations and incomplete about the room. Teachers are already using AI to produce easier versions quickly. What does that give a student, and what can it take away? Name the tension; don't resolve it yet."
    },
    {
      id: "evidence-level", part: "maker", kind: "stats",
      heading: "The closest test of easier versus harder texts",
      stats: [
        { num: "293", label: "ninth graders, randomly assigned easy or challenging versions of 24 texts" },
        { num: "12", label: "weeks, with instructional support either way" },
        { num: "Most", label: "understood both versions about equally well" }
      ],
      body: "A small group reading well below average, many of them English learners, did better with the easier versions.",
      cite: "Lupo, Tortorelli, Invernizzi, Ryoo & Strong (2019), Reading Research Quarterly 54(4). Human-leveled texts, not AI: no study yet tests AI-leveled texts with K-12 readers.",
      notes: "Andrew: the important caveat is in the citation. This is the best adjacent evidence we have; nobody has run the AI version of this study. With support, most students handled the harder text. The students who gained from easier text are exactly the newcomers in the tension slide."
    },
    {
      id: "gives-takes", part: "maker", kind: "cards",
      heading: "What an easier version gives, and what it takes",
      cards: [
        { kicker: "Gives", heading: "Access", body: "A way in for the weakest readers and beginning English learners: literal understanding, fluency practice, confidence." },
        { kicker: "Takes", heading: "Words, ideas, volume", body: "Fewer rare words, fewer ideas and less reading overall. Chopped sentences can lose the connectives that hold meaning together." },
        { kicker: "So", heading: "Scaffold first, **level second**", body: "Teach through the original: key words taught ahead, glosses, chunking, audio, partner talk. A leveled version is a bridge you plan to leave.", key: true }
      ],
      notes: "Andrew: the cost of a leveled text looks smallest as a short bridge back to the shared text, and largest as a permanent substitute. Sean: this is the middle we keep coming back to. It's neither 'never' nor 'always'."
    },
    {
      id: "if-you-level", part: "maker", kind: "steps",
      heading: "If you use AI to adapt a text",
      steps: [
        "Start with the original, and ask AI to find the barriers: hard words, long sentences, knowledge it assumes.",
        "Name the five to eight words that must survive, and tell the model to keep them.",
        "Ask for added explanation and connectives, not just shorter sentences.",
        "Read it against the source before a student sees it.",
        "Same title, same discussion, and a planned way back to the original."
      ],
      foot: "The lowest-regret approach we found, not a proven one.",
      notes: "Andrew: this draws on Shanahan's 'assistant to the teacher, not to the reader' and the IES practice guide's advice on teaching a few central words in depth. The direct evidence for this exact package is thin; say that plainly."
    },
    {
      id: "pause-lever", part: "maker", kind: "pause",
      kicker: "Pause · {mins} at your table",
      heading: "Where's the **middle lever**?",
      body: "Saying AI should never differentiate a text is as unwise as saying it always should. What would you hold onto? What would you try?",
      foot: "Name one value you'd keep, and one thing you'd test.",
      timer: 5,
      notes: "Sean: {Mins:words}. This is the heart of the session: clarify what we value and see how it holds up against the new tool. Collect two or three tables' answers before moving on."
    },

    // ── 3 · AI as a source to navigate ──────────────────────────────────────
    {
      id: "source", part: "source", kind: "section",
      heading: "AI as a source to navigate",
      body: "When the text in front of a student came from a machine.",
      notes: "Sean: section three, about {source.length}. The other column: how a reader navigates what AI produces."
    },
    {
      id: "checks-break", part: "source", kind: "statement",
      kicker: "Why the usual source checks break",
      heading: "Fluent isn't the same as **true**.",
      body: "A chatbot answer has no author, no edition and no stated purpose, so “who wrote this?” stops helping. What's left: what's claimed, what backs it up, and how my question shaped the answer.",
      notes: "Sean: polish raises our confidence without raising accuracy, and a leading question invites agreement. That's why 'be careful, AI can be wrong' isn't enough on its own. Students need a move that forces a comparison."
    },
    {
      id: "design-matters", part: "source", kind: "stats",
      heading: "How it's set up matters more than **whether** it's used",
      stats: [
        { num: "48%", label: "higher practice scores with a plain chatbot" },
        { num: "17%", label: "lower exam scores once the chatbot was taken away" },
        { num: "≈1,000", label: "high school math students in the field experiment" }
      ],
      body: "A version built to give hints instead of answers avoided the drop.",
      cite: "Bastani, Bastani, Sungu, Ge, Kabakcı & Mariman (2025), PNAS 122(26). High school math in Turkey, not reading.",
      notes: "Sean: math, not literacy, and older students than ours, but it's the largest K-12 randomized study we have. Students didn't notice they'd learned less. The design point carries: a tool that answers can stand in for the work; a tool that asks can support it."
    },
    {
      id: "ladder", part: "source", kind: "list",
      kicker: "Grades 4 to 8", heading: "A ladder of moves to try",
      items: [
        { name: "Test it on what you know", why: "Ask about a book you just read or a topic you know well. What did it get right or wrong?", key: true },
        { name: "Find the planted error", why: "The teacher generates the answer and plants a mistake; students hunt for it." },
        { name: "Check one claim against a second source", why: "One sentence, one teacher-provided text." },
        { name: "Change the question, watch the answer change", why: "Ask it neutrally, then ask the opposite." },
        { name: "Does the cited source exist?", why: "Grades 6 to 8: look it up and see whether it says that.", later: true }
      ],
      foot: "A hypothesis to test in your room. Students catch errors when they know the ground truth.",
      notes: "Sean: the one pattern across the small studies is that children catch AI errors when they can check the answer themselves, and miss them on unfamiliar content. So topic choice and a teacher-supplied reference text matter more than which move you teach. For students under 13, the teacher generates the output and students interrogate it; check district approvals before any student-operated tool."
    },
    {
      id: "claims-not-spotting", part: "source", kind: "statement",
      kicker: "One thing to skip",
      heading: "Teach claim-checking, not **AI-spotting**.",
      body: "Detectors and gut feelings are unreliable, and detectors flag non-native English writers most. Whether the claims hold up matters more than who, or what, wrote them.",
      notes: "Sean: the equity point matters here: a 2023 Stanford study found AI detectors flagged most essays by non-native English writers as AI-written. Origin is a weak stand-in for truth."
    },

    // ── 4 · Literacy is social ──────────────────────────────────────────────
    {
      id: "social", part: "social", kind: "section",
      heading: "Literacy is social",
      body: "It rarely develops apart from other people.",
      notes: "Sean: section four, about {social.length}. This is the reason underneath both framings. Interpersonal connection is how most of us became literate."
    },
    {
      id: "t-chart", part: "social", kind: "cards",
      heading: "AI and the people in the room",
      cards: [
        { kicker: "Where it can crowd out", heading: "Asking each other", body: "“Just ask ChatGPT” replaces asking a classmate. Groups split the work and each prompts alone. Peer feedback thins out." },
        { kicker: "Where it can open a door", heading: "Rehearsing first", body: "Private, ungraded practice before speaking. Help drafting a message for a student who finds live interaction costly. A bridge for multilingual learners." }
      ],
      foot: "Both columns describe the same tools. The difference is what happens next.",
      notes: "Sean: a T-chart. [ADD] the University of Minnesota research we planned to pull in, on either column. The support column matters: for students with social anxiety or for whom interaction is costly, AI can lower the barrier. The evidence on both sides is mostly small, short and from higher education."
    },
    {
      id: "help-seeking", part: "social", kind: "stats",
      heading: "When the first question goes to a **chatbot**",
      stats: [
        { num: "13 of 17", label: "students said help-seeking was now often mediated by generative AI" }
      ],
      body: "Some described peers answering a question by running it through ChatGPT and passing the answer along.",
      cite: "Hou et al. (2025), “All Roads Lead to ChatGPT,” interviews with computing undergraduates. One exploratory study; no K-12 study yet counts peer talk before and after AI.",
      notes: "Sean: one voice from one study, not a trend, and not K-12. It's here because it names something teachers can watch for: who a student asks first."
    },
    {
      id: "bridge", part: "social", kind: "list",
      heading: "Bridge or substitute?",
      items: [
        { name: "Does it end in a human interaction?", why: "A share, a discussion, a conference. Or does it end with the AI?", key: true },
        { name: "Did the student's own words survive?", why: "Student drafts first; AI coaches. Not AI writing the student's message." },
        { name: "Is the AI's output argued over, or just pasted?", why: "One shared AI a group critiques together, rather than each student prompting alone." }
      ],
      foot: "A lens to try, not a validated measure.",
      notes: "Sean: the same private rehearsal that helps a student speak up can, set up differently, replace speaking at all. From the doorway they look alike. These three questions are our synthesis from the research; offer them as something to test."
    },
    {
      id: "pause-bridge", part: "social", kind: "pause",
      kicker: "Pause · {mins}",
      heading: "What would tell you AI is a **bridge** in your room?",
      body: "Name one thing you could see or hear in a ten-minute walkthrough.",
      foot: "Who talks to whom? Who gets asked first?",
      timer: 4,
      notes: "Andrew: {Mins:words} at tables, then two or three shares. Listen for observable things (who students ask, whether AI output gets argued over) rather than feelings about AI."
    },

    // ── Close ───────────────────────────────────────────────────────────────
    {
      id: "values", part: "close", kind: "statement",
      kicker: "Where we land",
      heading: "Values first. Conclusions **later**.",
      body: "We're early in what looks like a real disruption. None of this is settled. It's what we're deciding with what we know now, measured against what we already believe about how kids become readers and writers.",
      notes: "Sean: the underpinning why. When the next tool arrives, the social nature of learning and the values you hold are how you evaluate it, not the tool's promises."
    },
    {
      id: "way-back", part: "close", kind: "link",
      heading: "Everything is here",
      body: "These slides, the speaker notes, and the research behind them.",
      notes: "Andrew: leave this up while people scan. Q shows the code large."
    },
    {
      id: "thanks", part: "close", kind: "statement",
      kicker: "Thank you",
      heading: "Literacy rarely develops **apart from others**.",
      foot: "{by} · {url}",
      notes: "Both: thank the room. Point them to the review page for slides, notes and sources."
    }
  ]
};
