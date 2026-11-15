// The deck: everything about this talk lives here. The stage, the speaker notes, the review and the printed
// backup all read this one file. docs/DECK.md explains every field; node scripts/check.js says what's wrong.
//
// SEAN'S WORKING DRAFT, v2 (2026-11-14), for Andrew to react to. Rebuilt as a working session: the room reads,
// writes and revises, and the evidence is offered as "what we're noticing," not as findings. Audience: literacy
// coaches, literacy leaders and media specialists. [ADD] in a note marks a gap only Andrew or Sean can fill.
// The room's thinking goes to a Padlet for now (an Apps Script capture tool is pinned for later). Resources and
// what the room learns afterward are shared through What We Talk About When We Talk About AI.
// Authorship: a joint piece, not either presenter's brand. "R&B: Reading & Belonging" (Rummel & Beaverson) is a
// working name for Andrew and Sean to settle together. It appears in two places: the title slide's kicker and
// the thank-you slide's foot.

export default {
  id: "lirn-literacy-ai",
  title: "Literacy Across Modalities",
  subtitle: "A working session on what it means to be literate now, with AI in the room.",
  by: "Andrew Rummel and Sean Beaverson",
  url: "https://inquiredu.org/lirn-literacy-ai/",   // live once the repo is public and Pages is on
  links: {
    site: "./",
    padlet: "https://padlet.com/",                    // [ADD] the session's Padlet, with five columns (see the notes on slide 4)
    wwta: "https://inquiredu.org/what-we-talk-about/" // where resources and the room's learning are shared afterward
  },
  theme: "light",

  // Set these once the start time is confirmed; until then the clock waits for T.
  // day: "2026-11-19", start: "HH:MM", timeZone: "America/Chicago",

  // The front door (index.html, where the QR code leads): why we're doing this, in our own words. DRAFT for
  // Andrew to read and change; every line here is his to edit as much as Sean's.
  landing: {
    questions: {
      heading: "The questions we're carrying",
      intro: "We don't have conclusions. We have questions we'd like to get sharper, and we'd rather work on them with you than at you.",
      items: [
        "What does it mean to be literate now, with AI in the room?",
        "What has reading and writing always asked of us, and what is actually new?",
        "When AI helps make a text (a student's draft, a teacher's easier version), whose thinking is on the page, and what should we hold onto?",
        "When the text came from a machine, how does a reader check it, especially on a topic they don't know yet?",
        "What happens to the talk between people that literacy has always grown from?",
        "Which of our values should hold steady while the tools keep changing?"
      ]
    },
    aim: {
      heading: "If it goes well",
      intro: "Nobody leaves with the answer. We hope everyone leaves with a clearer way to ask:",
      items: [
        "A sentence about literacy now that you wrote, revised, and can stand behind.",
        "A shared lens, the four roles of the reader, to use on any text AI made.",
        "One signpost to watch for, and one small thing to try in your building.",
        "A few more people to keep thinking with."
      ],
      close: "Clarity and precision, at a moment when the words are moving fast. Decisions for now, held up against what we already believe about how kids become readers and writers."
    },
    us: {
      heading: "Why the two of us",
      body: [
        "We've been friends since Sean was seventeen. We both started as English teachers. Andrew went deep into literacy: intervention, coaching, and K–12 literacy for Minneapolis Public Schools. Sean went toward technology and how schools take it on. We keep meeting in the middle of the same conversation.",
        "We share what we're working out because saying it out loud, to people who'll push back, is how we get clearer. We don't always agree, and you'll hear that. We also just like doing this together, and we hope that comes through."
      ],
      signoff: "Andrew & Sean",
      season: "social"            // the part whose drawing is taped beside it: October, the fire
    },
    made: "How this was made: our conversation, Gemini's notes on it, deep-research prompts, and a first draft of the deck by Claude, all revised by us, with the studies on the slides checked against their sources. Telling you that is part of the session."
  },

  // Each part is a Minnesota season, so the review reads through a year and comes back round: a line drawing
  // and a field-note caption at the foot of every notes page in that part (assets/seasons/, drawn for this talk).
  parts: [
    { id: "open", title: "Opening", minutes: 8,
      season: { art: "assets/seasons/november.svg", caption: "November · birches at the lake's edge" } },
    { id: "lens", title: "1 · A shared lens", minutes: 8,
      season: { art: "assets/seasons/january.svg", caption: "January · a fish house on the ice" } },
    { id: "making", title: "2 · Making text with AI", minutes: 15,
      season: { art: "assets/seasons/april.svg", caption: "April · ice-out, and the loons come back" } },
    { id: "navigating", title: "3 · Navigating AI text", minutes: 12,
      season: { art: "assets/seasons/july.svg", caption: "July · a canoe, and the portage on the map" } },
    { id: "social", title: "4 · The social thread", minutes: 10, tone: "accent",
      season: { art: "assets/seasons/october.svg", caption: "October · a fire, and someone to sit with" } },
    { id: "revisit", title: "Revisit", minutes: 7,
      season: { art: "assets/seasons/first-snow.svg", caption: "First snow · the year comes round" } }
  ],

  slides: [
    // ── Opening: read a text, learn how it was made, write a first definition ───────────────────────────
    {
      id: "title", part: "open", kind: "title",
      kicker: "R&B · Reading & Belonging", heading: "Literacy Across Modalities", sub: "{subtitle}", by: "{by} · a working session for LiRN",
      notes: "Both: welcome people as they come in. Press T (or Call to order) when you begin; the clock counts {length} from then.\n\nSean: set the frame in two sentences. This is a working session, not a talk, and nothing we show today is a conclusion. Most of the hour belongs to you."
    },
    {
      id: "read-this", part: "open", kind: "pause",
      kicker: "Read it · {mins}",
      heading: "Read this the way a **text analyst** would.",
      body: "“This session explores the intersection of artificial intelligence and literacy instruction, focusing on AI's role as a dynamic text-creation tool and a complex source of texts and content. Rather than viewing AI in isolation, we will examine how these emerging technologies influence and reshape the essential social aspects of learning, literacy instruction, interpersonal connection, and critical inquiry.”",
      foot: "Who made this? How would you know? What is it doing?",
      timer: 3,
      notes: "Andrew: don't say what it is yet. {Mins:words}, alone or with a neighbor. Listen for people noticing the stacked abstractions, the confident tone, and the absence of a single concrete example.\n\nIt's the first two sentences of our own session description."
    },
    {
      id: "how-made", part: "open", kind: "steps",
      kicker: "The reveal", heading: "How this text was made",
      steps: [
        "Andrew and Sean talked for twenty minutes.",
        "Gemini took notes, and we asked it for a paragraph.",
        "We read it, kept some of it, and changed some of it.",
        "The research behind today came from deep-research prompts. Then we checked the studies we use.",
        "This deck was first drafted by Claude from our notes. We've been revising it since."
      ],
      foot: "A person decided something at every step. Which decisions matter most is today's question.",
      notes: "Sean: be plain about it. [ADD] say exactly what we changed in the description, and what we didn't check.\n\nOptional aside, light and self-aimed: the first description of this session was written by a meeting bot, and it was all the right words about nothing in particular. Skip it if it might land wrong with the organizers."
    },
    {
      id: "v1", part: "open", kind: "pause",
      kicker: "Version 1 · {mins}",
      heading: "What does it mean to be **literate now**?",
      body: "One sentence, on the Padlet. You'll come back to it before you leave.",
      foot: "It's supposed to be incomplete.",
      timer: 2,
      notes: "Sean: {Mins:words}. Put the Padlet link in the chat or on table cards: {links.padlet}\n\nSet the Padlet up beforehand with five columns: Literate now (v1 and v2), The four roles, Making text, Navigating text, The social thread. Don't read answers aloud yet; we come back to them at the end."
    },

    // ── 1 · A shared lens ─────────────────────────────────────────────────────────────────────────────────
    {
      id: "lens", part: "lens", kind: "section",
      heading: "A shared lens",
      body: "Before AI: what has reading and writing always asked of us?",
      notes: "Andrew: section one, about {lens.length}. We borrow a lens most of this room already knows, and use it on text AI made."
    },
    {
      id: "four-roles", part: "lens", kind: "list",
      kicker: "Freebody & Luke, 1990", heading: "Four roles of the reader",
      items: [
        { name: "Code breaker", why: "How do I crack this text?" },
        { name: "Text participant", why: "What does it mean, to me?" },
        { name: "Text user", why: "What do I do with it, here, for this purpose?" },
        { name: "Text analyst", why: "What is this text doing, and to whom?" }
      ],
      foot: "Not a ladder: readers need all four, every time. Later adapted for making texts across modes.",
      notes: "Andrew: the Four Resources model. The roles aren't a sequence, and we aren't ranking them. Luke and Freebody's 1999 update, and later work, adapted it for creating texts in different modes, which matters when AI is the one making text.\n\nWe won't claim anything about AI and early decoding instruction; that isn't our expertise. Sean's signpost question can live here as a parking-lot item: if a platform promises to help early reading, what would tell us it's trading away something the process needs?"
    },
    {
      id: "roles-grid", part: "lens", kind: "pause",
      kicker: "At your table · {mins}",
      heading: "When the text came from **AI**, what does each role look like?",
      body: "Each table takes one role. Name one way it changes, and one way it stays the same.",
      foot: "Add it to the Padlet, under your role.",
      timer: 5,
      notes: "Andrew: count tables off 1 to 4 by role. Spread media specialists across tables; they'll pull toward text analyst, and every table benefits from that lens.\n\nHear one answer per role out loud before moving on. This is the room's lens for the rest of the hour."
    },
    {
      id: "framings", part: "lens", kind: "cards",
      heading: "Two places we'll test the lens",
      cards: [
        { kicker: "Part 2", heading: "**Making** text with AI", body: "AI as a thought partner for writing, and as a tool for creating and adapting texts." },
        { kicker: "Part 3", heading: "**Navigating** AI text", body: "AI as a source students read, question and decide whether to trust." }
      ],
      foot: "The social side of learning runs under both. We pull it together in Part 4.",
      notes: "Andrew: this two-way framing isn't ours. [ADD] credit the author from Andrew's earlier session."
    },

    // ── 2 · Making text with AI ───────────────────────────────────────────────────────────────────────────
    {
      id: "making", part: "making", kind: "section",
      heading: "Making text with AI",
      body: "Two cases. Same question: what would you hold onto?",
      notes: "Andrew: section two, about {making.length}. Both cases are made up, but they'll sound familiar."
    },
    {
      id: "cases", part: "making", kind: "cards",
      heading: "Two cases",
      cards: [
        { kicker: "Case A · A student writer", heading: "Is the draft **hers**?", body: "A fifth grader asks AI for ideas for her opinion piece. She gets five, picks one, and writes. Her draft is fluent and on topic." },
        { kicker: "Case B · A teacher adapting text", heading: "Is the easier version enough?", body: "A newcomer joins a third-grade class in October. Her teacher asks AI for an easier version of the science article. It's ready in seconds." }
      ],
      notes: "Andrew reads Case A; Sean reads Case B. Don't comment yet."
    },
    {
      id: "hold-test", part: "making", kind: "pause",
      kicker: "Pause · {mins}",
      heading: "What would you hold onto? What would you **test**?",
      body: "Half the room takes Case A, half takes Case B. Name one value that shouldn't bend, and one thing you'd try and watch.",
      foot: "Add both to the Padlet, under Making text.",
      timer: 6,
      notes: "Sean: {Mins:words}. Split the room by side. Listen for values (ownership of ideas, every student in the shared text, struggle that builds something) and for tests (what would you look at a month from now?)."
    },
    {
      id: "noticing-a", part: "making", kind: "cards",
      heading: "Case A: what we're noticing so far",
      cards: [
        { kicker: "Noticing", heading: "Practice isn't learning", body: "In one high school math experiment, a plain chatbot raised practice scores, and exam scores fell once it was taken away. A version that gave hints instead of answers didn't show that drop." },
        { kicker: "Don't know yet", heading: "Young writers", body: "We found no study of intermediate-grade students drafting with AI, or of what happens to their writing and their sense of ownership." },
        { kicker: "Would tell us", heading: "Your evidence", body: "What would you look for in her next draft, written without AI? What would she say if you asked where the idea came from?", key: true }
      ],
      foot: "Bastani et al. (2025), PNAS 122(26): about 1,000 high school math students in Turkey. Math, not writing.",
      notes: "Sean: present this as something we're noticing, not a finding about writing. The design point may carry over: a tool that answers can stand in for the work; a tool that asks can support it. Then turn it back: what's your evidence?\n\nIf the room wants a worked structure for this, Kit 05 (Curriculum Mapping) on What We Talk About is built to catch AI doing the thinking a standard names."
    },
    {
      id: "noticing-b", part: "making", kind: "cards",
      heading: "Case B: what we're noticing so far",
      cards: [
        { kicker: "Noticing", heading: "Most read the harder text", body: "293 ninth graders read easy or challenging versions of the same texts for 12 weeks, with support. Most understood both about equally well; a small group well below average, many of them English learners, did better with easier versions." },
        { kicker: "Don't know yet", heading: "AI-leveled text", body: "No study we found tests AI-leveled texts with K-12 readers, or what an easier version takes away over time." },
        { kicker: "Would tell us", heading: "Your evidence", body: "Does she come back to the shared text? Does she join the discussion? Which words from the original does she use a week later?", key: true }
      ],
      foot: "Lupo, Tortorelli, Invernizzi, Ryoo & Strong (2019), Reading Research Quarterly 54(4). Texts leveled by people, not AI.",
      notes: "Andrew: the students who did better with easier versions look a lot like the newcomer in Case B, so the study doesn't settle the case; it sharpens it. One option to name, not prescribe: scaffold the original first (key words taught ahead, glosses, chunking, audio, partner talk), and treat a leveled version as a bridge you plan to leave."
    },
    {
      id: "middle", part: "making", kind: "statement",
      kicker: "Thinking out loud",
      heading: "“Never” is as unwise as “always.”",
      body: "We don't fully agree on leveling texts with AI. Here's where each of us lands today, and why.",
      notes: "Andrew and Sean: three minutes, unscripted, out loud. Andrew: the grade-level text talking point and the newcomer it doesn't account for. Sean: clarifying our values and norms first, and finding the middle lever we can use intelligently. Disagree where you do. End with what would change your mind."
    },

    // ── 3 · Navigating AI text ───────────────────────────────────────────────────────────────────────────
    {
      id: "navigating", part: "navigating", kind: "section",
      heading: "Navigating AI text",
      body: "When the text in front of a reader came from a machine.",
      notes: "Sean: section three, about {navigating.length}. Media specialists, this is your home turf; we'll lean on you."
    },
    {
      id: "check-this", part: "navigating", kind: "pause",
      kicker: "Try it · {mins}",
      heading: "Check this answer.",
      body: "“Charlotte's Web (1952) by E. B. White follows Wilbur, a runt pig saved first by a girl named Fern and then by Charlotte, a barn spider. With help from Templeton, a greedy goose, Charlotte weaves words into her web to show that Wilbur is special. The first word she writes is ‘Terrific.’ It is the most-assigned chapter book in U.S. fourth-grade classrooms.”",
      foot: "Use what you know. Then mark one claim you couldn't check.",
      timer: 4,
      notes: "Sean: {Mins:words}, alone first, then compare with a neighbor. Don't hint. We wrote this answer ourselves to look like a chatbot's, so we'd know exactly where the problems are. [ADD] or generate one live and plant the errors, if you'd rather show the real thing."
    },
    {
      id: "what-was-in-it", part: "navigating", kind: "list",
      heading: "What was in it",
      items: [
        { name: "“Templeton, a greedy goose”", why: "Wrong: Templeton is a rat. Easy to catch if you know the book." },
        { name: "“The first word she writes is ‘Terrific’”", why: "Wrong: it was “Some Pig.” Harder, even for people who know the book well." },
        { name: "“The most-assigned chapter book in fourth grade”", why: "No source. You can't check it from memory at all, and it sounds the most authoritative.", key: true }
      ],
      foot: "Three claims, three different kinds of checking.",
      notes: "Sean: ask how people caught each one, and who missed which. The point isn't the errors; it's that checking depended on what each reader already knew, and the claim that sounded most like a fact was the one nobody could check from memory."
    },
    {
      id: "noticing-nav", part: "navigating", kind: "cards",
      heading: "Navigating: what we're noticing so far",
      cards: [
        { kicker: "Noticing", heading: "Knowing the answer matters", body: "21 children, ages 6 to 11, caught a chatbot's errors on puzzles they could solve themselves. 63 students, ages 14 to 15, couldn't tell good chatbot answers from poor ones on science problems." },
        { kicker: "Don't know yet", heading: "Grades 4 to 6", body: "Lateral reading has strong support for websites with students in grades 7 to 12. We found nothing testing checking moves on chatbot text with younger students." },
        { kicker: "Would tell us", heading: "Your evidence", body: "Media specialists: what do your students do now when an answer sounds right? What do they do when they don't know the topic?", key: true }
      ],
      foot: "Dangol et al. (2025), IDC; arXiv 2505.01106 (preprint, France); Brodsky et al. (2023), AERA Open, 2,278 students.",
      notes: "Sean: two small studies, different ages and tasks, pointing the same way. Treat that as a pattern worth testing, not a finding. If it holds, topic choice and a teacher-supplied reference text matter more than which checking move you teach. Add answers to the Padlet, under Navigating text."
    },
    {
      id: "moves", part: "navigating", kind: "list",
      kicker: "To try, not a sequence", heading: "Moves worth testing with intermediate readers",
      items: [
        { name: "Test it on what you know", why: "A book you just read, a topic you know well. What did it get right or wrong?" },
        { name: "Find the planted error", why: "The teacher makes the answer; students interrogate it." },
        { name: "Check one claim against a second source", why: "One sentence, one teacher-provided text." },
        { name: "Change the question, watch the answer change", why: "Ask it neutrally, then ask the opposite." }
      ],
      foot: "Which would you test first? What would you watch for?",
      notes: "Sean: for students under 13, the teacher generates the output and students interrogate it; check district approvals before any student-operated tool. Ask the media specialists which of these they already teach under another name.\n\nThe planted-error move is the same one the kits on What We Talk About use: each kit ships a synthetic worked example with deliberate errors, and a reviewer that has to catch them."
    },

    // ── 4 · The social thread ────────────────────────────────────────────────────────────────────────────
    {
      id: "social", part: "social", kind: "section",
      heading: "The social thread",
      body: "Literacy rarely develops apart from other people. What happened to talk in each case?",
      notes: "Sean: section four, about {social.length}. This is the reason underneath both framings."
    },
    {
      id: "t-chart", part: "social", kind: "cards",
      heading: "AI and the people in the room",
      cards: [
        { kicker: "Where talk can thin out", heading: "Asking each other", body: "“Just ask the chatbot” replaces asking a classmate. Each student prompts alone. Peer feedback gets thinner." },
        { kicker: "Where a door can open", heading: "Rehearsing first", body: "Private, ungraded practice before speaking. Help drafting a message for a student who finds live interaction costly. A bridge for multilingual learners." }
      ],
      foot: "Starters, not findings. The same tool can do either. You'll build the rest.",
      notes: "Sean: a T-chart. [ADD] the University of Minnesota research we planned to bring in. The 'door' column matters as much as the other: for students with social anxiety, or for whom interaction is costly, AI can lower the barrier. Most of the evidence on both sides is small, short and from higher education."
    },
    {
      id: "build-chart", part: "social", kind: "pause",
      kicker: "Build it · {mins}",
      heading: "Where would talk thin out? Where would it **open up**?",
      body: "Look back at Case A, Case B, and the answer you just checked. Add one to each side.",
      foot: "Add it to the Padlet, under The social thread.",
      timer: 4,
      notes: "Andrew: {Mins:words}. Pull two or three from each side out loud, and name where the room's columns differ from our starters."
    },
    {
      id: "bridge", part: "social", kind: "list",
      kicker: "A lens to try",
      heading: "Bridge or substitute?",
      items: [
        { name: "Does it end in a human interaction?", why: "A share, a discussion, a conference. Or does it end with the AI?" },
        { name: "Did the student's own words survive?", why: "Student drafts first and AI coaches, not AI writing the student's message." },
        { name: "Is the AI's output argued over, or just pasted?", why: "One shared AI a group critiques together, rather than each student prompting alone." }
      ],
      foot: "Our synthesis from early research. Try it on your own cases and tell us where it breaks.",
      notes: "Sean: the same private rehearsal that helps a student speak up can, set up differently, replace speaking at all. From the doorway they look alike. These questions aren't validated; offer them as something to test."
    },

    // ── Revisit ───────────────────────────────────────────────────────────────────────────────────────────
    {
      id: "v2", part: "revisit", kind: "pause",
      kicker: "Version 2 · {mins}",
      heading: "What does it mean to be **literate now**?",
      body: "Revise your sentence from the start. Put version 2 next to version 1. What changed? What didn't?",
      foot: "What didn't change may matter most.",
      timer: 3,
      notes: "Both: {Mins:words}. Then read three or four pairs aloud, version 1 then version 2. Notice together what stayed the same; that's where the values are."
    },
    {
      id: "signpost", part: "revisit", kind: "statement",
      kicker: "Before you go",
      heading: "One signpost to watch. One thing to **test**.",
      body: "A sign that AI is costing a reader something, or a small change you'll try and watch. We're early in this. What we decide now is a decision for now, measured against what we already believe about how kids become readers and writers.",
      notes: "Sean: the underpinning why, said once. When the next tool arrives, the social nature of learning and the values the room just named are how to evaluate it, not the tool's promises."
    },
    {
      id: "keep-learning", part: "revisit", kind: "statement",
      kicker: "Where this goes next",
      heading: "Keep learning **with us**.",
      body: "What We Talk About When We Talk About AI gathers the research library, the leadership kits, and now this session's resources. Bring back what you notice when you try something.",
      foot: "inquiredu.org/what-we-talk-about",
      notes: "Sean: this is where the room's learning lives after today. [ADD] how people send observations back (the Padlet stays open, an email, or a form on the site), and when we'll add the session's resources there. Link for the chat: {links.wwta}"
    },
    {
      id: "way-back", part: "revisit", kind: "link",
      heading: "Today's slides and notes",
      body: "This deck, with speaker notes and sources, to read again or share.",
      notes: "Andrew: leave this up while people scan. Q shows the code large."
    },
    {
      id: "thanks", part: "revisit", kind: "statement",
      kicker: "Thank you",
      heading: "Literacy rarely develops **apart from others**.",
      foot: "{by} · R&B",
      notes: "Both: thank the room. Point them to What We Talk About for resources, and to this deck for slides, notes and sources."
    }
  ]
};
