// The deck: everything about this talk lives here. The stage, the speaker notes, the review and the printed
// backup all read this one file. docs/DECK.md explains every field; node scripts/check.js says what's wrong.
//
// SEAN'S WORKING DRAFT, leadership design revision (2026-11-14), for Andrew to react to. Rebuilt as a working session: the room reads,
// writes and revises, and the evidence is offered as "what we're noticing," not as findings. Audience: literacy
// coaches, literacy leaders and media specialists. [ADD] in a note marks a gap only Andrew or Sean can fill.
// The room's responses go in the Zoom chat (decided 2026-11-15, replacing Padlet). Resources and
// what the room learns afterward are shared through What We Talk About When We Talk About AI.
// Authorship: a joint session by Andrew Rummel and Sean Beaverson. Public copy remains a draft for their review.

export default {
  id: "lirn-literacy-ai",
  title: "Literacy Across Modalities",
  subtitle: "Professional judgment in literacy instruction, text creation, and critical inquiry in an age of AI.",
  by: "Andrew Rummel and Sean Beaverson",
  url: "https://inquiredu.org/lirn-literacy-ai/",   // live once the repo is public and Pages is on
  links: {
    site: "./",
    wwta: "https://inquiredu.org/what-we-talk-about/" // where resources and the room's learning are shared afterward
  },
  theme: "light",

  // Set these once the start time is confirmed; until then the clock waits for T.
  // day: "2026-11-19", start: "HH:MM", timeZone: "America/Chicago",

  // Public-facing copy is a proposed editorial revision for Andrew and Sean to review.
  landing: {
    identity: "LiRN",
    context: "Literacy & artificial intelligence",
    nav: { overview: "Overview", agenda: "Agenda", review: "Read the session" },
    overviewLabel: "A working session for literacy leaders",
    reviewLabel: "Read slides & notes",
    presentLabel: "Open presentation",
    agendaHeading: "Session agenda",
    agendaLabel: "{length} / {parts} parts",
    questions: {
      label: "The inquiry",
      heading: "What does literacy require now?",
      intro: "AI changes how texts are produced and encountered. This session examines what those changes ask of readers, writers, and the educators who support them.",
      items: [
        "What should remain central to literacy instruction as the tools change?",
        "How do we preserve a student's authorship and intellectual work?",
        "What knowledge and evidence do readers need to evaluate AI output?",
        "How can AI support participation in a shared learning community?"
      ]
    },
    aim: {
      label: "Intended outcomes",
      heading: "A basis for professional judgment",
      intro: "Use familiar literacy principles to examine emerging practices and identify what deserves closer study.",
      items: [
        "A working definition of literacy that accounts for AI and multiple modes of meaning.",
        "The Four Resources model as a lens for creating and evaluating texts.",
        "A focused instructional trial, with evidence to examine and a condition for reconsidering it."
      ],
      close: "The aim is a considered next step, grounded in what students need to learn."
    },
    us: {
      label: "About the authors",
      heading: "Experience grounded in schools",
      intro: "Andrew and Sean bring complementary experience in literacy instruction, professional learning, and district technology leadership.",
      people: [
        {
          name: "Andrew Rummel",
          role: "Digital Learning Coordinator",
          organization: "Bloomington Public Schools",
          bio: "Andrew Rummel is a Digital Learning Coordinator for the Bloomington Public Schools. In this role, he leads the secondary digital learning team, the K12 media program, and New Code Academy Middle and High School. With over 25 years in education, he has served as English/Language Arts teacher, Reading and Writing interventionist, and literacy coach. His leadership work includes a range of roles, including K-12 Literacy Coordinator for the Minneapolis Public Schools and Coordinator of the Minneapolis Residency Program. Andrew has designed and taught university courses focused on professional learning and coaching, adolescent reading and literacy leadership, and curriculum design. He has a deep interest in digital literacies and their impact on teaching and learning, and his dedication to advancing literacy practices underscores his commitment to preparing students for success in a rapidly evolving world.",
          links: [
            { label: "District profile", url: "https://www.newcodeacademy.org/about/staff?combine=&field_school_level_target_id=All&page=1" },
            { label: "Selected writing", url: "https://www.eschoolnews.com/digital-learning/2024/04/02/crafting-ethical-ai-landscapes-in-k-12-education/" }
          ]
        },
        {
          name: "Sean Beaverson",
          role: "Director of Technology",
          organization: "Orono Public Schools",
          bio: "Sean Beaverson is the Director of Technology for Orono Public Schools. In this role, he leads district-wide technology integration, infrastructure development, and human-centered AI strategy. With over two decades in education, he has served as a high school English and language arts teacher, instructional technology specialist, and personalized learning specialist across Minnesota school districts. His leadership work includes designing district eLearning plans, coordinating emergency distance learning frameworks, and presenting extensively on educational technology and AI integration. Sean has also served as an adjunct professor at St. Catherine University, designing and teaching courses focused on instructional technology. He has a deep interest in the intersection of emerging technologies and critical inquiry, and his dedication to supporting educators underscores his commitment to preparing students for a rapidly evolving world.",
          links: [
            { label: "Professional background", url: "https://www.mnasa.org/edtalks" },
            { label: "Selected writing", url: "https://search.mnmsba.org/api/download/file-1756959159342-download-AI-Harnessing-Trust-Technology-September-October-2025.pdf" }
          ]
        }
      ]
    },
    resources: {
      heading: "Continue the inquiry",
      body: "Explore the research library and leadership resources at What We Talk About When We Talk About AI.",
      label: "Explore the resources"
    },
    made: "Developed by Andrew Rummel and Sean Beaverson with AI assistance from Gemini and Claude. The presenters retain responsibility for the content and its interpretation."
  },

  parts: [
    { id: "open", title: "Opening inquiry", minutes: 8 },
    { id: "lens", title: "A shared literacy lens", minutes: 11 },
    { id: "making", title: "Creating text with AI", minutes: 16 },
    { id: "navigating", title: "Evaluating AI text", minutes: 10 },
    { id: "social", title: "Literacy as social practice", minutes: 8 },
    { id: "revisit", title: "Implications for practice", minutes: 7 }
  ],

  slides: [
    // ── Opening: read a text, learn how it was made, write a first definition ───────────────────────────
    {
      id: "title", part: "open", kind: "title",
      kicker: "LiRN leadership session", heading: "{title}", sub: "{subtitle}", by: "{by}", sun: false,
      notes: "Both: as people join, ask in the chat for their role, the grades they support, and one word for how AI feels in their building right now. Press T (or Call to order) when you begin; the clock counts {length} from then.\n\nDay-of call on groups, made here and sent to the co-host in a private chat. Count participants, not presenters. 12 or more: breakout rooms for both group pauses (four role rooms, three case rooms). 9 to 11: main room for the roles, breakout rooms for the cases. Under 9: main room throughout. Each group pause has both plans in its notes.\n\nSean: set the frame in two sentences. This is a working session, not a talk, and nothing we show today is a conclusion. Most of the hour belongs to you."
    },
    {
      id: "read-this", part: "open", kind: "pause",
      kicker: "Read it · {mins}",
      heading: "Read this the way a **text analyst** would.",
      body: "“This session explores the intersection of artificial intelligence and literacy instruction, focusing on AI's role as a dynamic text-creation tool and a complex source of texts and content. Rather than viewing AI in isolation, we will examine how these emerging technologies influence and reshape the essential social aspects of learning, literacy instruction, interpersonal connection, and critical inquiry.”",
      foot: "Who made this? How would you know? What is it doing?",
      timer: 3,
      notes: "Andrew: don't say what it is yet. {Mins:words}, alone, then one word in the chat for what the text is doing. Listen for people noticing the stacked abstractions, the confident tone, and the absence of a single concrete example.\n\nIt's the first two sentences of our own session description."
    },
    {
      id: "how-made", part: "open", kind: "steps",
      kicker: "Authorship and process", heading: "How this text was made",
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
      body: "Write one sentence in the chat. You'll come back to it before you leave.",
      foot: "Use this as a working definition to revisit at the close.",
      timer: 2,
      notes: "Sean: {Mins:words}. Ask for one sentence in the chat, held until the timer ends and then sent all at once (a waterfall). Right after, a co-host saves the chat so version 1 is there at the end. Don't read answers aloud yet; we come back to them at the end."
    },

    // ── 1 · A shared lens ─────────────────────────────────────────────────────────────────────────────────
    {
      id: "lens", part: "lens", kind: "section",
      heading: "A shared literacy lens",
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
      notes: "Andrew: the Four Resources model. The roles aren't a sequence, and we aren't ranking them. Luke and Freebody's 1999 update, and later work, adapted it for creating texts in different modes, which matters when AI is the one making text.\n\nCode breaker leads into the next slide: what an early reading platform asks of leaders."
    },
    {
      id: "early-signposts", part: "lens", kind: "list",
      kicker: "Early reading · K–2", heading: "Signposts for an AI reading platform",
      items: [
        { name: "Does practice text stay decodable?", why: "Matched to the sounds and patterns children have been taught, as structured literacy expects." },
        { name: "Does a teacher still hear the child read?", why: "Or does the platform's report stand in for listening?", key: true },
        { name: "Does practice end in talk with a person?", why: "A conversation about the story, not only a score." },
        { name: "What does it record, and where does it go?", why: "A young child's voice and errors are student data." }
      ],
      foot: "Questions a leader asks before adopting, not claims about how to teach decoding.",
      title: "K–2 signposts",
      notes: "Andrew: we said in planning that we won't claim anything about AI and teaching decoding; it isn't our expertise. These are the questions a leader can ask of any platform that promises to help early reading. Sean's signpost question sits under all four: what would tell us it's trading away something the process needs?\n\nMany in this group work under the READ Act's structured-literacy expectations, so the first question will land. Case C comes back to this in Part 2."
    },
    {
      id: "roles-grid", part: "lens", kind: "pause",
      kicker: "In your group · {mins}",
      heading: "When the text came from **AI**, what does each role look like?",
      body: "Take the role you're given. Name one way it changes, and one way it stays the same.",
      foot: "Post it in the chat, starting with your role.",
      timer: 4,
      notes: "Andrew: {Mins:words}.\n\nBreakout rooms (12 or more): the co-host opens four rooms named for the roles and assigns them automatically; spread media specialists across rooms, since they pull toward text analyst. Allow a minute and a half to open and close.\n\nMain room (under 12): give roles by first name. A to F code breaker, G to L text participant, M to R text user, S to Z text analyst. Answers wait for the timer, then go in the chat together.\n\nHear one answer per role out loud before moving on. This is the room's lens for the rest of the hour."
    },
    {
      id: "framings", part: "lens", kind: "cards",
      heading: "Creating and evaluating texts",
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
      heading: "Creating text with AI",
      body: "Authorship, access, and the instructional choices that shape learning.",
      notes: "Andrew: section two, about {making.length}. All three cases are made up, but they'll sound familiar."
    },
    {
      id: "cases", part: "making", kind: "cards",
      heading: "Classroom cases for discussion",
      cards: [
        { kicker: "Case A · Grade 5 · A student writer", heading: "Is the draft **hers**?", body: "A fifth grader asks AI for ideas for her opinion piece. She gets five, picks one, and writes. Her draft is fluent and on topic." },
        { kicker: "Case B · Grade 3 · A teacher adapting text", heading: "Is the easier version enough?", body: "A newcomer joins a third-grade class in October. Her teacher asks AI for an easier version of the science article. It's ready in seconds." },
        { kicker: "Case C · Grade 1 · A reading tutor", heading: "Whose ear is **listening**?", body: "A first-grade teacher is offered an AI tutor. Children read aloud to it, and it marks errors and gives feedback. It promises twenty more minutes of practice a day." }
      ],
      notes: "Andrew reads Case A, Sean reads Case B, Andrew reads Case C. Don't comment yet. Case C picks up the K–2 signposts from Part 1."
    },
    {
      id: "hold-test", part: "making", kind: "pause",
      kicker: "Pause · {mins}",
      heading: "What must we preserve? What should we **test**?",
      body: "Take the case closest to the grades you support. Name one value that shouldn't bend, and one thing you'd try and watch.",
      foot: "Post both in the chat, starting with A, B or C.",
      timer: 6,
      notes: "Sean: {Mins:words}.\n\nBreakout rooms (9 or more): three rooms named Case A, Case B and Case C, with participants choosing their own room (turn on Allow participants to choose room). Allow a minute and a half to open and close.\n\nMain room (under 9): everyone takes the case closest to their grades and answers in the chat when the timer ends.\n\nListen for values (ownership of ideas, every student in the shared text, struggle that builds something) and for tests (what would you look at a month from now?)."
    },
    {
      id: "noticing-a", part: "making", kind: "cards",
      heading: "Case A: learning and authorship",
      cards: [
        { kicker: "Research signal · High school", heading: "Performance and learning", body: "In one high school math experiment, a plain chatbot raised practice scores, and exam scores fell once it was taken away. A version that gave hints instead of answers largely avoided that drop." },
        { kicker: "Evidence gap · Grades 3–5", heading: "Young writers", body: "We found no study of intermediate-grade students drafting with AI, or of what happens to their writing and their sense of ownership." },
        { kicker: "Questions for practice", heading: "Evidence to examine", body: "What would you look for in her next draft, written without AI? What would she say if you asked where the idea came from?", key: true }
      ],
      foot: "Bastani et al. (2025), PNAS 122(26): about 1,000 high school math students in Turkey. Math, not writing.",
      notes: "Sean: present this as something we're noticing, not a finding about writing. The design point may carry over: a tool that answers can stand in for the work; a tool that asks can support it. Then turn it back: what's your evidence?\n\nIf the room wants a worked structure for this, Kit 05 (Curriculum Mapping) on What We Talk About is built to catch AI doing the thinking a standard names."
    },
    {
      id: "noticing-b", part: "making", kind: "cards",
      heading: "Case B: access and text complexity",
      cards: [
        { kicker: "Research signal · Grade 9", heading: "Most read the harder text", body: "293 ninth graders read easy or challenging versions of the same texts for 12 weeks, with support. Most understood both about equally well; a small group well below average, many of them English learners, did better with easier versions." },
        { kicker: "Evidence gap · K–12", heading: "AI-leveled text", body: "No study we found tests AI-leveled texts with K-12 readers, or what an easier version takes away over time." },
        { kicker: "Questions for practice", heading: "Evidence to examine", body: "Does she come back to the shared text? Does she join the discussion? Which words from the original does she use a week later?", key: true }
      ],
      foot: "Lupo, Tortorelli, Invernizzi, Ryoo & Strong (2019), Reading Research Quarterly 54(4). Texts leveled by people, not AI.",
      notes: "Andrew: the students who did better with easier versions look a lot like the newcomer in Case B, which makes this the study closest to her. It still used texts leveled by people, so it can't tell us what an AI version does. One option to name: scaffold the original first (key words taught ahead, glosses, chunking, audio, partner talk), and treat a leveled version as a bridge you plan to leave."
    },
    {
      id: "middle", part: "making", kind: "statement",
      kicker: "Professional dialogue",
      heading: "The judgment behind text adaptation",
      body: "Our perspectives on AI text adaptation differ. We will examine the reasoning, the tradeoffs, and the evidence that would change our positions.",
      notes: "Andrew and Sean: three minutes, unscripted, out loud. Andrew: the grade-level text talking point and the newcomer it doesn't account for. Sean: clarifying our values and norms first, and finding the middle lever we can use intelligently. Disagree where you do. End with what would change your mind."
    },

    // ── 3 · Navigating AI text ───────────────────────────────────────────────────────────────────────────
    {
      id: "navigating", part: "navigating", kind: "section",
      heading: "Evaluating AI text",
      body: "Knowledge, verification, and the limits of a fluent answer.",
      notes: "Sean: section three, about {navigating.length}. Media specialists, this is your home turf; we'll lean on you."
    },
    {
      id: "check-this", part: "navigating", kind: "pause",
      kicker: "Text analysis · {mins}",
      heading: "Check this answer.",
      body: "“Charlotte's Web (1952) by E. B. White follows Wilbur, a runt pig saved first by a girl named Fern and then by Charlotte, a barn spider. With help from Templeton, a greedy goose, Charlotte weaves words into her web to show that Wilbur is special. The first word she writes is ‘Terrific.’ It is the most-assigned chapter book in U.S. fourth-grade classrooms.”",
      foot: "Use what you know. Then mark one claim you couldn't check.",
      timer: 4,
      notes: "Sean: {Mins:words}, alone first, then post the claim you doubt most in the chat. Don't hint. We wrote this answer ourselves to look like a chatbot's, so we'd know exactly where the problems are. [ADD] or generate one live and plant the errors, if you'd rather show the real thing."
    },
    {
      id: "what-was-in-it", part: "navigating", kind: "list",
      heading: "Three claims, different verification demands",
      items: [
        { name: "“Templeton, a greedy goose”", why: "Wrong: Templeton is a rat. Easy to catch if you know the book." },
        { name: "“The first word she writes is ‘Terrific’”", why: "Wrong: it was “Some Pig.” Harder, even for people who know the book well." },
        { name: "“The most-assigned chapter book in fourth grade”", why: "No source. You can't check it from memory at all, and it sounds the most authoritative.", key: true }
      ],
      foot: "Each claim took a different kind of checking.",
      notes: "Sean: ask how people caught each one, and who missed which. Checking depended on what each reader already knew, and the claim that sounded most like a fact was the one nobody could check from memory."
    },
    {
      id: "noticing-nav", part: "navigating", kind: "cards",
      heading: "Evaluating AI output: the evidence",
      cards: [
        { kicker: "Research signal · Ages 6–11, 14–15", heading: "Knowing helps, but isn't enough", body: "21 children, ages 6 to 11, caught a chatbot's errors on puzzles they could solve themselves. 63 students, ages 14 to 15, tended to rate poor chatbot answers to science problems highly." },
        { kicker: "Evidence gap · Grades 4–6", heading: "Chatbot text, younger readers", body: "Lateral reading instruction helped 2,278 Canadian middle and high school students check websites. We found nothing testing checking moves on chatbot text with younger students." },
        { kicker: "Questions for practice", heading: "Evidence to examine", body: "Media specialists: what do your students do now when an answer sounds right? What do they do when they don't know the topic?", key: true }
      ],
      foot: "Dangol et al. (2025), IDC, arXiv 2505.16034 (US). Abdelghani et al. (2025), arXiv 2505.01106 (preprint, France). Brodsky et al. (2023), AERA Open (Canada).",
      notes: "Sean: two small studies, different ages and tasks. The younger children caught errors on puzzles they could solve themselves. The older students relied on the chatbot even on topics they said they knew, and the authors link better judgment to students' awareness of their own understanding. Treat that as a pattern worth testing, not a finding. If it holds, knowing the topic helps but isn't enough: students also need to notice when they don't actually understand.\n\nAccuracy note: the French paper reports 63 students in its abstract and 73 in its methods; its second version is titled The Illusion of Understanding. An earlier draft of this slide credited it to the wrong authors, and our own check caught it."
    },
    {
      id: "moves", part: "navigating", kind: "list",
      kicker: "Instructional approaches to examine", heading: "Verification with intermediate readers",
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
      heading: "Literacy as social practice",
      body: "Literacy rarely develops apart from other people. What happened to talk in each case?",
      notes: "Sean: section four, about {social.length}. This is the reason underneath both framings."
    },
    {
      id: "t-chart", part: "social", kind: "cards",
      heading: "Participation and peer dialogue",
      cards: [
        { kicker: "Potential loss", heading: "Asking each other", body: "“Just ask the chatbot” replaces asking a classmate. Each student prompts alone. Peer feedback gets thinner." },
        { kicker: "Potential support", heading: "Rehearsing first", body: "Private, ungraded practice before speaking. Help drafting a message for a student who finds live interaction costly. A bridge for multilingual learners." }
      ],
      foot: "Discussion hypotheses: the instructional design determines what needs examination.",
      notes: "Sean: a T-chart. [ADD] the University of Minnesota research we planned to bring in. The 'door' column matters as much as the other: for students with social anxiety, or for whom interaction is costly, AI can lower the barrier. Most of the evidence on both sides is small, short and from higher education."
    },
    {
      id: "build-chart", part: "social", kind: "pause",
      kicker: "Collaborative analysis · {mins}",
      heading: "Where might AI reduce or **support participation**?",
      body: "Look back at Case A, Case B, and the answer you just checked. Add one to each side.",
      foot: "Post them in the chat, starting “Loss:” or “Support:”.",
      timer: 4,
      notes: "Andrew: {Mins:words}. Pull two or three from each side out loud, and name where the room's columns differ from our starters."
    },
    {
      id: "bridge", part: "social", kind: "list",
      kicker: "Questions for instructional design",
      heading: "Bridge or substitute?",
      items: [
        { name: "Does it end in a human interaction?", why: "A share, a discussion, a conference. Or does it end with the AI?" },
        { name: "Did the student's own words survive?", why: "Student drafts first and AI coaches, not AI writing the student's message." },
        { name: "Is the AI's output argued over, or just pasted?", why: "One shared AI a group critiques together, rather than each student prompting alone." }
      ],
      foot: "A provisional framework for discussion, not a validated assessment tool.",
      notes: "Sean: the same private rehearsal that helps a student speak up can, set up differently, replace speaking at all. From the doorway they look alike. These questions aren't validated; offer them as something to test."
    },

    // ── Revisit ───────────────────────────────────────────────────────────────────────────────────────────
    {
      id: "v2", part: "revisit", kind: "pause",
      kicker: "Version 2 · {mins}",
      heading: "What does it mean to be **literate now**?",
      body: "Revise your sentence from the start, and post version 2 in the chat. What changed? What didn't?",
      foot: "Notice what stayed the same.",
      timer: 3,
      notes: "Both: {Mins:words}. Then read three or four pairs aloud, version 1 from the saved chat, then version 2. Notice together what stayed the same; that's where the values are."
    },
    {
      id: "signpost", part: "revisit", kind: "statement",
      kicker: "Implications for practice",
      heading: "A next step and the **evidence to examine**",
      body: "Identify one instructional change, the learning it should support, and the evidence you will examine. Name a condition that would lead you to revise or stop the approach.",
      notes: "Sean: the underpinning why, said once. When the next tool arrives, the social nature of learning and the values the room just named are how to evaluate it, not the tool's promises."
    },
    {
      id: "keep-learning", part: "revisit", kind: "statement",
      kicker: "Resources and continued inquiry",
      heading: "Research and leadership resources",
      body: "What We Talk About When We Talk About AI gathers the research library, the leadership kits, and now this session's resources. Bring back what you notice when you try something.",
      foot: "inquiredu.org/what-we-talk-about",
      notes: "Sean: this is where the room's learning lives after today. [ADD] how people send observations back after today (the chat closes with the meeting), and when we'll add the session's resources there. Link for the chat: {links.wwta}"
    },
    {
      id: "way-back", part: "revisit", kind: "link",
      heading: "Today's slides and notes",
      body: "This deck, with speaker notes and sources, to read again or share.",
      notes: "Andrew: paste {url} in the chat and leave this up. The QR code only helps people watching on a second device."
    },
    {
      id: "thanks", part: "revisit", kind: "statement", tone: "night",
      kicker: "Thank you",
      heading: "Literacy rarely develops **apart from others**.",
      body: "Thank you for contributing your experience and professional judgment.",
      foot: "{by}",
      notes: "Both: thank the room. Point them to What We Talk About for resources, and to this deck for slides, notes and sources."
    }
  ]
};
