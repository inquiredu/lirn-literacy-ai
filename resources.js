// The sources behind the talk, each looked at three ways. deck.js brings this in as deck.resources, so every
// view still reads the deck; resources.html shows it. docs/DECK.md describes the fields, and present/core.js
// (resourceProblems) checks them: three checks on every entry, a known status on each, https links only.
//
// SEAN'S WORKING LIST (2026-11-14), for Andrew and Sean to keep, cut or rewrite. Nothing here is settled.
// It started from the research document ("Literacy Across Different Modalities"), which was drafted with Gemini.
// That document is where we started looking, not a source: every entry below was traced to the work itself.
//
// The three checks:
//   found:  is it real, and is it what the citation says (authors, year, title, venue)?
//   says:   does the work itself say the thing we'd use it for?
//   others: does someone other than the authors describe it the same way, review it, or build on it?
// Status: "yes", "partly", "no", or "open" (not checked yet). A note says what was looked at; a link goes there.
// from:    "deck" (behind a slide), "doc" (cited in the research document), "added" (found for this page)
// verdict: "stands" (we'd stand on it), "care" (use with the caveat), "aside" (set aside for now)

export default {
  checked: "2026-11-14",
  intro: "Everything we lean on in the session, and a few things we found along the way. Each source was looked at three ways: whether it's real and cited right, whether it says what we'd say it says, and whether anyone besides its authors sees it the same way. Some passed all three. Some passed two, and the note says why. The ones we couldn't stand behind are at the end, with the reason.",
  doc: "We started from a long research document, drafted with Gemini, and traced its sources back to the work itself. The document is where we began looking, not something we cite. …",

  entries: [
    // ── A shared lens: what literacy is, and the frameworks people are using now ─────────────────────────
    {
      id: "four-resources", verdict: "stands", from: "deck", parts: ["lens"], kind: "Article",
      title: "Literacies programs: Debates and demands in cultural context",
      who: "Peter Freebody and Allan Luke", year: 1990, where: "Prospect: Australian Journal of TESOL 5(3)",
      what: "Where the four roles of the reader come from: code breaker, text participant, text user, text analyst.",
      use: "The lens for part 1. None of the four is enough alone, and they're developed together rather than in order.",
      careful: "We read descriptions of the model and the authors' later restatement, not the 1990 article, which we couldn't find online.",
      checks: {
        found: { status: "partly", note: "The citation (Prospect 5, 7–16, with the 1999 'Further notes on the four resources model' in Practically Primary 4(2)) matches in Victoria's Literacy Teaching Toolkit. Page ranges differ by a page across sources.", link: "https://www.education.vic.gov.au/school/teachers/teachingresources/discipline/english/literacy/writing/Pages/fourres.aspx" },
        says: { status: "partly", note: "Descriptions agree on the four roles and on developing them together. We haven't read the 1990 text itself.", link: "https://palms.org.au/2021/05/03/the-four-resource-model-a-useful-framework-for-planning-programs-both-inside-and-outside-the-classroom-in-development-education/" },
        others: { status: "yes", note: "Victoria builds its writing and early-childhood literacy guidance on it; Palms Australia describes it as influential in curricula across Australia and beyond.", link: "https://vic.gov.au/early-childhood-literacy-teaching-toolkit-explained" }
      }
    },
    {
      id: "multiliteracies", verdict: "stands", from: "doc", parts: ["open", "lens"], kind: "Article",
      title: "A Pedagogy of Multiliteracies: Designing Social Futures",
      who: "The New London Group", year: 1996, where: "Harvard Educational Review 66(1), 60–92",
      url: "https://newlearningonline.com/files/2009/03/multiliteracies_her_vol_66_1996.pdf",
      what: "The argument that literacy has to cover many modes and many Englishes, and that readers are designers of meaning.",
      use: "Why 'modalities' isn't a new idea: people have been widening what counts as reading for thirty years.",
      checks: {
        found: { status: "yes", note: "The University of Technology Sydney's repository lists it at Harvard Educational Review 66(1), 60–92, January 1996.", link: "https://opus.lib.uts.edu.au/handle/10453/13882" },
        says: { status: "yes", note: "The full text names the multiplicity of channels and growing cultural and linguistic diversity as the reasons to rethink literacy teaching.", link: "https://newlearningonline.com/files/2009/03/multiliteracies_her_vol_66_1996.pdf" },
        others: { status: "yes", note: "TESL Ontario's overview describes its idea of design and its four pedagogical components the same way.", link: "https://contact.teslontario.org/?p=393" }
      }
    },
    {
      id: "transliteracy", verdict: "stands", from: "doc", parts: ["open", "lens"], kind: "Article",
      title: "Transliteracy: Crossing divides",
      who: "Sue Thomas, Chris Joseph, Jess Laccetti, Bruce Mason, Simon Mills, Simon Perril and Kate Pullinger", year: 2007, where: "First Monday 12(12)",
      url: "https://firstmonday.org/ojs/index.php/fm/article/view/2060/1908",
      what: "Literacy as moving across platforms, from speech and handwriting through print, film and social networks.",
      use: "Language media specialists already use for what we're describing: one reader, many kinds of text.",
      careful: "We read the definition in the authors' own later chapter; we didn't open the First Monday article itself.",
      checks: {
        found: { status: "yes", note: "Co-author Chris Joseph's site announces the First Monday article from the De Montfort PART group, December 2007.", link: "https://chrisjoseph.org/transliteracy-crossing-divides-by-sue-thomas-chris-joseph-jess-laccetti-bruce-mason-simon-mills-simon-perril-and-kate-pullinger/" },
        says: { status: "partly", note: "The same group's book chapter gives the definition and says it was first set out in the 2007 First Monday piece.", link: "https://www.igi-global.com/chapter/transliteracy-unifying-perspective/21388" },
        others: { status: "yes", note: "In the Library with the Lead Pipe traces how the idea reached libraries, and cautions against treating it as settled.", link: "https://inthelibrarywiththeleadpipe.org/?p=5300" }
      }
    },
    {
      id: "long-magerko", verdict: "stands", from: "doc", parts: ["lens"], kind: "Conference paper",
      title: "What is AI Literacy? Competencies and Design Considerations",
      who: "Duri Long and Brian Magerko", year: 2020, where: "CHI 2020 (ACM)",
      url: "https://aiunplugged.lmc.gatech.edu/wp-content/uploads/sites/36/2020/08/CHI-2020-AI-Literacy-Paper-Camera-Ready.pdf",
      what: "An early, widely used definition of AI literacy, with competencies grouped under questions like what AI can do and how it works.",
      use: "A plain starting definition, and a reminder that 'AI literacy' was being defined before chatbots arrived.",
      careful: "An exploratory review that included grey literature, and it doesn't say how to assess any of it.",
      checks: {
        found: { status: "yes", note: "The camera-ready paper is on Georgia Tech's site, marked CHI '20, Honolulu.", link: "https://aiunplugged.lmc.gatech.edu/wp-content/uploads/sites/36/2020/08/CHI-2020-AI-Literacy-Paper-Camera-Ready.pdf" },
        says: { status: "yes", note: "Barton Community College's guide lists the model's themes and numbered competencies, through competency 17.", link: "https://docs.bartonccc.edu/stuservices/library/artificial-intelligence-literacy/artifical-intelligence-literacy.pdf" },
        others: { status: "yes", note: "A California State University review describes it as five themes and 17 competencies, notes the grey literature, and says it doesn't address assessment.", link: "https://genai.calstate.edu/node/66" }
      }
    },
    {
      id: "unesco-students", verdict: "stands", from: "doc", parts: ["lens", "revisit"], kind: "Framework",
      title: "AI competency framework for students",
      who: "UNESCO (drafting led by Fengchun Miao, with Kelly Shiohira)", year: 2024, where: "UNESCO, Paris. ISBN 978-92-3-100709-5",
      url: "https://doi.org/10.54675/JKJB9835",
      what: "Twelve competencies in four dimensions (human-centred mindset, ethics of AI, AI techniques and applications, AI system design), at three levels: understand, apply, create.",
      use: "One of two international frameworks a district is likely to be handed. Useful for its human-centred dimension.",
      careful: "The research document cited a Scribd copy. Link UNESCO's own record instead.",
      checks: {
        found: { status: "yes", note: "UNESCO's record gives the DOI, the ISBN and 80 pages; MIT's RAISE initiative hosts the PDF.", link: "https://raise.mit.edu/wp-content/uploads/2025/04/391105eng.pdf" },
        says: { status: "yes", note: "The short summary inside the document states the 12 competencies, four dimensions and three levels.", link: "https://raise.mit.edu/wp-content/uploads/2025/04/391105eng.pdf" },
        others: { status: "yes", note: "Commbox's document record reproduces the table of contents and the same structure.", link: "https://commbox.org/document/ai-competency-framework-for-students" }
      }
    },
    {
      id: "ailit-framework", verdict: "stands", from: "added", parts: ["lens", "revisit"], kind: "Framework",
      title: "Empowering Learners for the Age of AI: An AI Literacy Framework for Primary and Secondary Education",
      who: "European Commission and OECD, with CodeAI (formerly Code.org)", year: 2026, where: "Final version, launched June 18, 2026 (review draft May 2025)",
      url: "https://ailiteracyframework.org/blog/empowering-learners-for-the-age-of-ai-literacy-framework/",
      what: "AI literacy in four domains: Engage with AI, Create with AI, Manage AI, Shape AI, with ethics running through all four.",
      use: "The newest of the big frameworks, and the one tied to the PISA 2029 media and AI literacy assessment.",
      careful: "Names and counts changed between the 2025 draft (Designing AI; 22 competences, per BABL AI) and the 2026 final (Shape AI; 19, per Jérémie Rostan). Quote the final, and count for ourselves before saying a number.",
      checks: {
        found: { status: "yes", note: "The framework's own site announces the final version, launched June 18, 2026, after the May 2025 draft.", link: "https://ailiteracyframework.org/blog/empowering-learners-for-the-age-of-ai-literacy-framework/" },
        says: { status: "yes", note: "The same page names the four domains and says ethics is built into every domain rather than taught on its own.", link: "https://ailiteracyframework.org/blog/empowering-learners-for-the-age-of-ai-literacy-framework/" },
        others: { status: "yes", note: "Jérémie Rostan's summary of the final and BABL AI's report on the draft describe the same domains; BABL notes the link to PISA 2029.", link: "https://jeremierostan.substack.com/p/your-ailit-framework-is-here" }
      }
    },
    {
      id: "glat", verdict: "care", from: "doc", parts: ["lens"], kind: "Study",
      title: "GLAT: The Generative AI Literacy Assessment Test",
      who: "Yueqiao Jin, Roberto Martinez-Maldonado, Dragan Gašević and Lixiang Yan", year: 2025, where: "Computers and Education: Artificial Intelligence 9, 100436",
      url: "https://arxiv.org/abs/2411.00283",
      what: "A 20-item multiple-choice test of generative AI literacy, built with 355 university students.",
      use: "Evidence that self-reported AI skill and tested AI skill aren't the same thing.",
      careful: "University students in Australia, not K–12. The research document cited AI-written summaries of it; cite the paper.",
      checks: {
        found: { status: "yes", note: "infoDOCKET (Library Journal) noted its publication in June 2025 with the DOI 10.1016/j.caeai.2025.100436.", link: "https://www.infodocket.com/2025/06/10/journal-article-glat-the-generative-ai-literacy-assessment-test/" },
        says: { status: "yes", note: "The paper reports good reliability, and that test scores predicted performance on AI-supported tasks better than self-reported ChatGPT skill.", link: "https://arxiv.org/pdf/2411.00283" },
        others: { status: "partly", note: "Listed in Stanford SCALE's research repository. We found no independent review of it yet.", link: "https://scale.stanford.edu/ai/repository/glat-generative-ai-literacy-assessment-test" }
      }
    },

    // ── Opening: reading, screens, and what changed ─────────────────────────────────────────────────────
    {
      id: "dehaene-recycling", verdict: "stands", from: "doc", parts: ["open"], kind: "Review article",
      title: "Cultural recycling of cortical maps",
      who: "Stanislas Dehaene and Laurent Cohen", year: 2007, where: "Neuron 56, 384–398",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3704307",
      what: "The neuronal recycling idea: reading is too new to have its own brain circuits, so it takes over areas built for recognizing objects.",
      use: "Reading is learned, not natural, which is why how we read can change and why it takes teaching.",
      careful: "The research document goes on to claims about AI and the prefrontal cortex that this work doesn't make. The visual word form area at the heart of it has critics.",
      checks: {
        found: { status: "yes", note: "A copy of the published review shows Neuron 56, October 25, 2007, from page 384.", link: "https://www.Gwern.net/doc/culture/2007-cohen.pdf" },
        says: { status: "yes", note: "Dehaene's own explainer for general readers describes the 'letterbox' area and the recycling idea he introduced with Cohen.", link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3704307" },
        others: { status: "yes", note: "Cognition and Culture discusses it the same way; Wikipedia's article also summarizes the main criticism, about how specific the word-form area is.", link: "https://en.wikipedia.org/wiki/Neuronal_recycling_hypothesis" }
      }
    },
    {
      id: "wolf-reader-come-home", verdict: "stands", from: "doc", parts: ["open"], kind: "Book",
      title: "Reader, Come Home: The Reading Brain in a Digital World",
      who: "Maryanne Wolf", year: 2018, where: "Harper. ISBN 978-0-06-238878-0",
      url: "https://www.publishersweekly.com/9780062388780",
      what: "Letters on deep reading: what it builds, what quick screen reading might cost, and a 'biliterate brain' that reads both ways well.",
      use: "A reading researcher's case for protecting slow reading, without treating screens as the enemy.",
      careful: "A book of argument, not a study. The research document cited interviews with Wolf; cite the book.",
      checks: {
        found: { status: "yes", note: "Publishers Weekly lists it (Harper, 2018, ISBN above); a public library catalog shows the chapters, including 'Building a Biliterate Brain.'", link: "https://search.icpl.org/Record/1527409" },
        says: { status: "yes", note: "Publishers Weekly's review describes the deep reading circuit, what quick reading may cost, and her acknowledgment of what digital reading does well.", link: "https://www.publishersweekly.com/9780062388780" },
        others: { status: "yes", note: "The Free Beacon's review takes her seriously and doubts that print and screen reading can be kept as separate habits.", link: "https://freebeacon.com/?p=1045558" }
      }
    },
    {
      id: "delgado-2018", verdict: "stands", from: "doc", parts: ["open"], kind: "Meta-analysis",
      title: "Don't throw away your printed books: A meta-analysis on the effects of reading media on reading comprehension",
      who: "Pablo Delgado, Cristina Vargas, Rakefet Ackerman and Ladislao Salmerón", year: 2018, where: "Educational Research Review 25, 23–38",
      url: "https://doi.org/10.1016/j.edurev.2018.09.003",
      what: "Studies from 2000 to 2017 comparing the same texts on paper and on screen: a small advantage for paper.",
      use: "The paper advantage is real and small, and it depends on conditions: bigger under time pressure and for informational text, not found for narrative alone.",
      careful: "Most studies used adults and computers. The effect is small (about a fifth of a standard deviation).",
      checks: {
        found: { status: "yes", note: "The University of Haifa's research portal lists it: Educational Research Review 25, 23–38, November 2018, peer reviewed.", link: "https://cris.haifa.ac.il/en/publications/dont-throw-away-your-printed-books-a-meta-analysis-on-the-effects/" },
        says: { status: "yes", note: "The abstract reports 54 study designs with 171,055 participants, Hedges' g = −0.21 favoring paper, and the three moderators.", link: "https://fitforthem.unipa.it/rep:6533b86dfe1ef96bd12c9e22" },
        others: { status: "yes", note: "Tes magazine (Alex Quigley, 2018) explains the same findings for teachers.", link: "https://www.tes.com/magazine/archive/hold-your-hardbacks" }
      }
    },
    {
      id: "salmeron-handheld", verdict: "stands", from: "doc", parts: ["open"], kind: "Meta-analysis",
      title: "Reading comprehension on handheld devices versus on paper: A narrative review and meta-analysis of the medium effect and its moderators",
      who: "Ladislao Salmerón, Lidia Altamura, Pablo Delgado, Anastasia Karagiorgi and Cristina Vargas", year: 2024, where: "Journal of Educational Psychology 116(2), 153–172",
      url: "https://doi.org/10.1037/edu0000830",
      what: "The same question for tablets and phones, the devices schools actually hand out.",
      use: "Readers understand slightly better in print than on a handheld device.",
      careful: "The research document dated it 2023 (the manuscript). We read the accepted manuscript, not the final article.",
      checks: {
        found: { status: "yes", note: "The University of Valencia's record lists Journal of Educational Psychology 116(2), 153–172, 2024.", link: "https://producciocientifica.uv.es/documentos/65c35c59d2edca1267d69549?lang=de" },
        says: { status: "yes", note: "The accepted manuscript says readers comprehend slightly better in print than on a handheld device.", link: "https://roderic.uv.es/bitstreams/b45d219f-30e3-4117-9102-0bd9248ae1f6/download" },
        others: { status: "no", note: "We found it listed beside related meta-analyses, but no outside review or summary yet.", link: "https://www.bohrium.com/paper-details/comparison-of-reading-performance-on-screen-and-on-paper-a-meta-analysis/813036300343967744-9279" }
      }
    },
    {
      id: "screen-reasoning", verdict: "care", from: "doc", parts: ["open"], kind: "Study",
      title: "The screen inferiority depends on test format in reasoning and meta-reasoning tasks",
      who: "Xun Wang, Luyao Chen, Xinyue Liu, Cai Wang, Zhenxin Zhang and Qun Ye", year: 2023, where: "Frontiers in Psychology 14, 1067577",
      url: "https://www.frontiersin.org/articles/10.3389/fpsyg.2023.1067577/full",
      what: "Reasoning puzzles on screen and on paper: worse scores on screen in both test formats; worse self-monitoring only with multiple choice.",
      use: "A small sign that the screen effect reaches past reading, into how well people judge their own answers.",
      careful: "One lab study using short reasoning puzzles, not reading.",
      checks: {
        found: { status: "yes", note: "PubMed Central lists it: Frontiers in Psychology, March 9, 2023, DOI 10.3389/fpsyg.2023.1067577.", link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10033594/" },
        says: { status: "yes", note: "The abstract reports screen inferiority in reasoning scores regardless of format, and in meta-reasoning only for multiple choice.", link: "https://www.pubmed.gov/36968734/" },
        others: { status: "no", note: "Rakefet Ackerman, whose work it builds on, was a reviewer, so she isn't independent. We found no outside appraisal.", link: "https://public-pages-files-2025.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1067577/xml" }
      }
    },
    {
      id: "risko-gilbert", verdict: "stands", from: "doc", parts: ["open"], kind: "Review article",
      title: "Cognitive offloading",
      who: "Evan F. Risko and Sam J. Gilbert", year: 2016, where: "Trends in Cognitive Sciences 20(9), 676–688",
      url: "https://doi.org/10.1016/j.tics.2016.07.002",
      what: "Using the world (notes, phones, gestures) to lighten what the mind has to hold, and how people decide when to do it.",
      use: "People offload when they believe it's more efficient, and that belief can be wrong. That's the AI question in an older frame.",
      careful: "The authors said the long-term effects of offloading were largely unstudied. The research document's stronger claims don't come from here.",
      checks: {
        found: { status: "yes", note: "UCL Discovery lists it with the volume, pages and DOI, open access.", link: "https://discovery-pp.ucl.ac.uk/id/eprint/1508770" },
        says: { status: "yes", note: "Cell Press's release summarizes the review: people offload when they think it's more efficient, and those beliefs don't always match reality.", link: "https://www.sciencedaily.com/releases/2016/08/160816134021.htm" },
        others: { status: "yes", note: "A Cambridge English faculty essay works with the same definition and argument.", link: "https://www.english.cam.ac.uk/research/cogblog/?p=1692" }
      }
    },
    {
      id: "pisa-2025", verdict: "stands", from: "doc", parts: ["open"], kind: "Report",
      title: "PISA 2025 Results, Volume I: United States country note",
      who: "OECD", year: 2026, where: "Released September 8, 2026",
      url: "https://www.oecd.org/en/publications/pisa-2025-results-volume-i-country-notes_2d4ff9ea-en/united-states_0c8cbc7c-en.html",
      what: "Fifteen-year-olds' reading, math and science, with new questions about AI use for schoolwork.",
      use: "U.S. reading fell from 2022 and is among the lowest PISA has recorded for the U.S., while still above the OECD average.",
      careful: "The OECD says U.S. participation fell short of its standards and bias can't be ruled out. The research document cited blogs about PISA; cite the OECD. We haven't read the AI-use findings.",
      checks: {
        found: { status: "yes", note: "The OECD's own country note for the United States.", link: "https://www.oecd.org/en/publications/pisa-2025-results-volume-i-country-notes_2d4ff9ea-en/united-states_0c8cbc7c-en.html" },
        says: { status: "yes", note: "The note says U.S. reading was lower than in 2022 and among the lowest observed, and that student response and school participation fell short of targets.", link: "https://read.oecd-ilibrary.org/en/publications/pisa-2025-results-volume-i-country-notes_2d4ff9ea-en/united-states_0c8cbc7c-en.html" },
        others: { status: "yes", note: "Chalkbeat reported the same results and the OECD's warning about possible bias.", link: "https://www.chalkbeat.org/2026/09/08/pisa-results-2025-show-us-gaining-as-other-countries-decline/" }
      }
    },

    // ── Making text with AI: leveled texts, and who it helps ────────────────────────────────────────────
    {
      id: "lupo-2019", verdict: "stands", from: "doc", parts: ["making"], kind: "Study",
      title: "An Exploration of Text Difficulty and Knowledge Support on Adolescents' Comprehension",
      who: "Sarah M. Lupo, Laura Tortorelli, Marcia Invernizzi, Ji Hoon Ryoo and John Z. Strong", year: 2019, where: "Reading Research Quarterly 54(4), 457–479",
      url: "https://doi.org/10.1002/rrq.247",
      what: "293 ninth graders randomly given easier or harder versions of the same texts for 12 weeks, with teacher support either way.",
      use: "The closest test of what AI leveling does: with support, most students understood the harder versions about as well.",
      careful: "Ninth graders, human-leveled texts (Newsela), and support in both groups. It's about leveling, not about AI.",
      checks: {
        found: { status: "yes", note: "The University at Buffalo's research portal lists it: Reading Research Quarterly 54(4), 457–479, October 2019.", link: "https://researchconnect.buffalo.edu/en/publications/an-exploration-of-text-difficulty-andknowledge-support-on-adolesc/" },
        says: { status: "yes", note: "The abstract says comprehension of easy and challenging versions was similar for most students when support came with the text.", link: "https://www.adlit.org/adlit-101/research-reports-and-guides/exploration-text-difficulty-and-knowledge-support-adolescents" },
        others: { status: "yes", note: "Timothy Shanahan described it the same way on Reading Rockets in 2019.", link: "https://www.readingrockets.org/blogs/shanahan-on-literacy/cool-new-study-text-difficulty-and-adolescent-literacy" }
      }
    },
    {
      id: "amendum-2018", verdict: "stands", from: "doc", parts: ["making"], kind: "Research synthesis",
      title: "Does Text Complexity Matter in the Elementary Grades? A Research Synthesis of Text Difficulty and Elementary Students' Reading Fluency and Comprehension",
      who: "Steven J. Amendum, Kristin Conradi and Elfrieda H. Hiebert", year: 2018, where: "Educational Psychology Review 30, 121–151",
      url: "https://doi.org/10.1007/s10648-017-9398-2",
      what: "Twenty-six studies on what harder text does to elementary students' fluency and comprehension.",
      use: "For the younger grades the picture is less clear than for older students, and the authors say so.",
      careful: "We read the introduction and framing, not the full findings. Read before quoting a result from it.",
      checks: {
        found: { status: "yes", note: "The published article shows Educ Psychol Rev (2018) 30:121–151 and the DOI.", link: "https://springerlink.bibliotecabuap.elogim.com/content/pdf/10.1007/s10648-017-9398-2.pdf" },
        says: { status: "partly", note: "The co-author's page confirms 26 studies were reviewed. We haven't yet read the findings section closely.", link: "https://works.bepress.com/kristinconradi/14" },
        others: { status: "partly", note: "TextProject (Hiebert's own organization, so not independent) hosts the accepted manuscript. No outside review found yet.", link: "https://textproject.org/paper/does-text-complexity-matter-in-the-elementary-grades" }
      }
    },
    {
      id: "day-simplify", verdict: "care", from: "doc", parts: ["making"], kind: "Preprint",
      title: "Evaluating GenAI for Simplifying Texts for Education: Improving Accuracy and Consistency for Enhanced Readability",
      who: "Stephanie L. Day and colleagues (with Ben D. Sawyer)", year: 2025, where: "arXiv 2501.09158 (not peer reviewed)",
      url: "https://arxiv.org/abs/2501.09158",
      what: "Sixty informational passages taken from 12th-grade level down to 8th, 6th and 4th by different models and prompts.",
      use: "Getting to a 4th-grade level was where models and prompts were least reliable, both on level and on keeping key ideas.",
      careful: "A preprint, and model versions change fast. The abstract gives no numbers.",
      checks: {
        found: { status: "yes", note: "On arXiv, submitted January 15, 2025, and listed in Stanford SCALE's repository.", link: "https://scale.stanford.edu/ai/repository/evaluating-genai-simplifying-texts-education-improving-accuracy-and-consistency" },
        says: { status: "yes", note: "The abstract says models and prompts showed variable accuracy and consistency when leveling to 4th grade.", link: "https://aitopics.org/doc/arxivorg:69555A38" },
        others: { status: "yes", note: "A 2026 NLP4CALL paper (ACL Anthology) cites it as finding large variability across models and prompts, especially at lower grade levels.", link: "https://aclanthology.org/2026.nlp4call-1.13.pdf" }
      }
    },
    {
      id: "shanahan-ai-1", verdict: "stands", from: "added", parts: ["making"], kind: "Blog",
      title: "AI and Reading Comprehension",
      who: "Timothy Shanahan", year: 2026, where: "Shanahan on Literacy, May 9, 2026",
      url: "https://www.shanahanonliteracy.com/blog/ai-and-reading-comprehension",
      what: "A reading researcher on why rewriting texts down to students' levels with AI may skip the very work that builds comprehension.",
      use: "The strongest version of the worry about AI leveling, from someone who has studied text difficulty for decades.",
      careful: "An expert's argument, not a study. Other researchers (Allington, for one) weigh text level differently.",
      checks: {
        found: { status: "yes", note: "On his own blog, dated May 9, 2026, and syndicated on Reading Rockets.", link: "https://www.readingrockets.org/blogs/shanahan-on-literacy/ai-and-reading-comprehension" },
        says: { status: "yes", note: "He argues that using AI to revise texts to students' supposed levels avoids teaching comprehension rather than scaffolding it.", link: "https://www.shanahanonliteracy.com/blog/ai-and-reading-comprehension" },
        others: { status: "partly", note: "KQED MindShift's review of his book reports the same position on leveled texts and the research behind it. It's about the book, not this post.", link: "https://www.kqed.org/mindshift/65925/why-one-reading-expert-says-just-right-books-are-all-wrong" }
      }
    },
    {
      id: "shanahan-ai-2", verdict: "stands", from: "doc", parts: ["making"], kind: "Blog",
      title: "AI and the Teaching of Reading Comprehension Part 2",
      who: "Timothy Shanahan", year: 2026, where: "Shanahan on Literacy, May 23, 2026",
      url: "https://www.shanahanonliteracy.com/blog/ai-and-the-teaching-of-reading-comprehension-part-2",
      what: "The constructive half: AI to help the teacher spot hard sentences, cohesive links and themes worth teaching.",
      use: "\"An assistant to the teacher — not to the reader.\" A use of AI in literacy we can say yes to.",
      careful: "His own tests, described informally. Useful as practice, not as evidence.",
      checks: {
        found: { status: "yes", note: "On his blog, dated May 23, 2026.", link: "https://shanahanonliteracy.com/blog?page=2" },
        says: { status: "yes", note: "Reading Rockets' copy carries the line, and says AI hasn't yet been shown to rewrite a text down a few grades without losing content.", link: "https://www.readingrockets.org/blogs/shanahan-on-literacy/ai-and-reading-comprehension-instruction-part-2" },
        others: { status: "no", note: "A Substack critique by Terry Underwood engages with his comprehension advice generally, not this post. No direct response found.", link: "https://terryu.substack.com/p/what-we-forgot-about-teaching-reading" }
      }
    },
    {
      id: "gallup-teachers", verdict: "care", from: "doc", parts: ["making"], kind: "Survey",
      title: "Teaching for Tomorrow: Unlocking Six Weeks a Year With AI",
      who: "Gallup and the Walton Family Foundation", year: 2025, where: "June 25, 2025. Web survey of 2,232 U.S. public K–12 teachers, March–April 2025",
      url: "https://news.gallup.com/poll/691967/three-teachers-weekly-saving-six-weeks-year.aspx",
      what: "How many teachers use AI, for what, and how much time they think it saves.",
      use: "Six in ten teachers used AI for their work in 2024–25, much of it for planning and making materials; weekly users estimate 5.9 hours saved a week.",
      careful: "Time saved is teachers' own estimate. Walton funds the survey, and only about one in five teachers worked at a school with an AI policy.",
      checks: {
        found: { status: "yes", note: "Gallup's release gives the dates, the method and the sample of 2,232.", link: "https://news.gallup.com/poll/691967/three-teachers-weekly-saving-six-weeks-year.aspx" },
        says: { status: "yes", note: "The report states the six in ten and the 5.9 hours a week, and the 19% with a school AI policy.", link: "https://static.waltonfamilyfoundation.org/df/fb/eba12807470a9402d7433cc47dba/teaching-for-tomorrow-unlocking-six-weeks-a-year-with-ai-report.pdf" },
        others: { status: "yes", note: "CRPE's early analysis reports the same figures and asks whether the time is real.", link: "https://crpe.substack.com/p/the-ai-dividenddoes-ai-create-more" }
      }
    },
    {
      id: "wwc-english-learners", verdict: "stands", from: "doc", parts: ["making"], kind: "Practice guide",
      title: "Teaching Academic Content and Literacy to English Learners in Elementary and Middle School (NCEE 2014-4012)",
      who: "Scott Baker, Nonie Lesaux and colleagues, What Works Clearinghouse", year: 2014, where: "Institute of Education Sciences, U.S. Department of Education",
      url: "https://ies.ed.gov/ncee/wwc/PracticeGuide/19",
      what: "Four recommendations: teach academic vocabulary intensively, build oral and written language into content, give structured writing practice, and offer small-group help.",
      use: "What to protect for multilingual learners when a text gets simplified: the language and the content, not just the reading level.",
      careful: "From 2014, before generative AI. Evidence ratings differ by recommendation.",
      checks: {
        found: { status: "yes", note: "The guide itself (via Reading Rockets) shows the title, NCEE number, April 2014 and the panel.", link: "https://Www.readingrockets.org/sites/default/files/guide/AcademicContentELLs.pdf" },
        says: { status: "yes", note: "The WWC webinar slides list the four recommendations and rate integrating oral and written language into content as strong evidence.", link: "https://ies.ed.gov/ncee/WWC/Docs/PracticeGuide/wwc_ellwebinarslides_052114.pdf" },
        others: { status: "yes", note: "The National Center on Improving Literacy summarizes the same recommendations for literacy leaders.", link: "https://improvingliteracy.org/resource/teaching-academic-content-and-literacy-to-english-learners-in-elementary-and-middle-school/" }
      }
    },

    // ── Navigating AI text: checking what a machine wrote ───────────────────────────────────────────────
    {
      id: "lateral-reading-expertise", verdict: "stands", from: "doc", parts: ["navigating"], kind: "Study",
      title: "Lateral Reading and the Nature of Expertise: Reading Less and Learning More When Evaluating Digital Information",
      who: "Sam Wineburg and Sarah McGrew", year: 2019, where: "Teachers College Record 121(11), 1–40",
      url: "https://journals.sagepub.com/doi/10.1177/016146811912101102",
      what: "Ten fact checkers, ten historians and 25 Stanford undergraduates evaluating live websites.",
      use: "Fact checkers left the page to see what others said about it, and got to better answers faster. Historians and students stayed on the page.",
      careful: "45 people, all skilled adults. The move it names is the one schools now teach.",
      checks: {
        found: { status: "yes", note: "SAGE's page for the article, first published November 2019, gives the sample of 45.", link: "https://journals.sagepub.com/doi/10.1177/016146811912101102" },
        says: { status: "yes", note: "The abstract says historians and students read vertically while fact checkers read laterally and reached sounder conclusions in a fraction of the time.", link: "https://katalog.lib.cas.cz/KNAV/EdsRecord/edsair,edsair.doi...........72e150dbd81d607240c180d16df52dde" },
        others: { status: "yes", note: "The History News Network reported the same contrast between lateral and vertical reading.", link: "https://www.historynewsnetwork.org/article/study-historians-arent-very-good-at-detecting-fake" }
      }
    },
    {
      id: "lateral-reading-district", verdict: "stands", from: "doc", parts: ["navigating"], kind: "Study",
      title: "Lateral Reading on the Open Internet: A District-Wide Field Study in High School Government Classes",
      who: "Sam Wineburg, Joel Breakstone, Sarah McGrew, Mark D. Smith and Teresa Ortega", year: 2022, where: "Journal of Educational Psychology",
      url: "https://cor.inquirygroup.org/research/lateral-reading-on-the-open-internet",
      what: "About 500 high schoolers in an urban Midwestern district, six lessons in a required government course, compared with classes that didn't get them.",
      use: "Students who got the lessons were about twice as likely to spot questionable websites. It can be taught in a few class periods.",
      careful: "Funded by Google.org and run by the curriculum's developers. The research document also notes that students still earned only about half the possible points.",
      checks: {
        found: { status: "yes", note: "The APA's supplemental materials carry the full title and author list for the Journal of Educational Psychology.", link: "https://supp.apa.org/psycarticles/supplemental/edu0000740/EDU_2020_0630_Supplemental_Materials.pdf" },
        says: { status: "yes", note: "Stanford's announcement gives the six 50-minute lessons, about 500 students, and twice as likely to spot questionable sites.", link: "https://ed.stanford.edu/news/it-doesn-t-take-long-learn-how-spot-misinformation-online-stanford-study-finds" },
        others: { status: "partly", note: "The SSRC's MediaWell indexes it with the same design. The independent check here is thin; most reporting comes from Stanford.", link: "https://mediawell.ssrc.org/?p=510382" }
      }
    },
    {
      id: "ctrl-f", verdict: "stands", from: "doc", parts: ["navigating"], kind: "Study",
      title: "Instruction Increases Canadian Students' Preference for and Use of Lateral Reading Strategies to Fact-Check Online Information",
      who: "Jessica E. Brodsky, Patricia J. Brooks, Dimitri Pavlounis and Jessica Leigh Johnston", year: 2023, where: "AERA Open 9",
      url: "https://doi.org/10.1177/23328584231192106",
      what: "2,278 Canadian students in grades 7–12 taught to read laterally with the CTRL-F curriculum.",
      use: "The closest study to our grades: after instruction, students used lateral reading far more than controls, and age didn't change that much.",
      careful: "Web sources, not chatbot answers. CIVIX built the curriculum; the authors evaluated it.",
      checks: {
        found: { status: "yes", note: "DOAJ lists it in AERA Open, August 2023, with all four authors.", link: "https://doaj.org/article/1d6b92861ccb44f981bfc5bb2d7a0c44" },
        says: { status: "yes", note: "The abstract reports that preference rarely became use before instruction, and that CTRL-F students used lateral reading more than controls after.", link: "https://doaj.org/article/1d6b92861ccb44f981bfc5bb2d7a0c44" },
        others: { status: "partly", note: "Indexed in ERIC (EJ1405236). The independent appraisal we found is of the same team's earlier college studies, not this one.", link: "https://searchworks.jioinstitute.edu.in/articles/eric__EJ1405236" }
      }
    },
    {
      id: "lateral-reading-college", verdict: "care", from: "doc", parts: ["navigating"], kind: "Study",
      title: "Lateral reading: College students learn to critically evaluate internet sources in an online course",
      who: "Joel Breakstone, Mark Smith, Priscilla Connors, Teresa Ortega, Darby Kerr and Sam Wineburg", year: 2021, where: "Harvard Kennedy School Misinformation Review",
      url: "https://misinforeview.hks.harvard.edu/?p=6029",
      what: "College students taught lateral reading in an online course, tested before and after.",
      use: "Lateral reading went from rare to common after the course, taught entirely online.",
      careful: "No comparison group and no later retest. The research document's figures (87 students; 3.4% to 77%) we haven't checked against the paper.",
      checks: {
        found: { status: "yes", note: "Published and peer reviewed in the HKS Misinformation Review; listed on the Digital Inquiry Group's publications page.", link: "https://www.inquirygroup.org/publications" },
        says: { status: "partly", note: "The article reports significant growth and far more lateral reading at posttest. The exact numbers are still to check.", link: "https://misinforeview.hks.harvard.edu/?p=6029" },
        others: { status: "open", note: "Not looked for yet." }
      }
    },
    {
      id: "verified", verdict: "stands", from: "doc", parts: ["navigating"], kind: "Book",
      title: "Verified: How to Think Straight, Get Duped Less, and Make Better Decisions about What to Believe Online",
      who: "Mike Caulfield and Sam Wineburg", year: 2023, where: "University of Chicago Press. ISBN 978-0-226-82206-8",
      url: "https://www.booksamillion.com/p/Verified/Mike-Caulfield/9780226822068",
      what: "SIFT (stop, investigate the source, find better coverage, trace claims to their origin) and lateral reading, for general readers.",
      use: "The source for SIFT. The research document cited copies of SIFT handouts; cite the book.",
      careful: "Written before most school AI use; the authors expect the moves to hold up with AI.",
      checks: {
        found: { status: "yes", note: "Library catalogs list the University of Chicago Press edition, 2023, with the ISBN.", link: "https://brookline.minlib.net/Record/.b42215286" },
        says: { status: "yes", note: "The table of contents opens with getting quick context, cheap signals and lateral reading.", link: "https://search.centrecountylibrary.org/Record/485940/TOC" },
        others: { status: "yes", note: "Reviewed in College & Research Libraries (ACRL) and by the American Association of Law Libraries; Oregon State Ecampus reviewed it with AI in mind.", link: "https://crl.acrl.org/index.php/crl/article/view/26234" }
      }
    },
    {
      id: "civic-online-reasoning", verdict: "stands", from: "added", parts: ["navigating"], kind: "Curriculum",
      title: "Civic Online Reasoning curriculum",
      who: "Digital Inquiry Group (formerly the Stanford History Education Group)", year: 2026, where: "Free lessons and assessments; account required",
      url: "https://cor.inquirygroup.org/curriculum/collections/teaching-lateral-reading",
      what: "Free lessons built on three questions: who's behind the information, what's the evidence, what do other sources say?",
      use: "Ready-made lateral reading lessons for middle and high school, and a free course for teachers.",
      careful: "Made by the same researchers whose studies support it. Lessons are for web sources; adapting them to AI answers is ours to try.",
      checks: {
        found: { status: "yes", note: "The Digital Inquiry Group's own curriculum site.", link: "https://cor.inquirygroup.org/blog/get-started-now" },
        says: { status: "yes", note: "The Teaching Lateral Reading collection describes modeling lateral reading and contrasting it with staying on the page.", link: "https://cor.inquirygroup.org/curriculum/collections/teaching-lateral-reading" },
        others: { status: "yes", note: "EdSource described the curriculum and its classroom testing in 2019; the Council of Europe's Histolab lists it as a resource.", link: "https://edsource.org/2019/stanford-researchers-design-new-lessons-for-students-to-sort-facts-from-lies-on-the-internet/620870" }
      }
    },
    {
      id: "common-sense-ai", verdict: "stands", from: "added", parts: ["navigating", "revisit"], kind: "Curriculum",
      title: "AI Literacy Lessons for Grades K–12",
      who: "Common Sense Education", year: 2026, where: "Free lesson collection",
      url: "https://www.commonsense.org/education/collections/ai-literacy-lessons-for-grades-k-12",
      what: "Short lessons on how AI learns, bias, chatbots designed to feel human, creativity and authorship, and how to SIFT with AI.",
      use: "Quick lessons a media specialist can run tomorrow, including one on checking information when AI makes anything look credible.",
      careful: "A lesson collection, not evidence that the lessons work.",
      checks: {
        found: { status: "yes", note: "Common Sense Education's own collection page.", link: "https://www.commonsense.org/education/collections/ai-literacy-lessons-for-grades-k-12" },
        says: { status: "yes", note: "The collection lists 'How to SIFT with AI' for grades 9–12, with lessons on AI bias, chatbots and creativity.", link: "https://www.commonsense.org/education/collections/ai-literacy-for-grades-6-12-lessons" },
        others: { status: "yes", note: "EdTech Innovation Hub reported the completed K–12 curriculum and its AI literacy strand.", link: "https://www.edtechinnovationhub.com/news/common-sense-media-completes-k-12-digital-literacy-curriculum-as-70-of-teens-use-ai-for-schoolwork" }
      }
    },
    {
      id: "fabricated-citations", verdict: "stands", from: "doc", parts: ["navigating"], kind: "Study",
      title: "Fabrication and errors in the bibliographic citations generated by ChatGPT",
      who: "William H. Walters and Esther Isabelle Wilder", year: 2023, where: "Scientific Reports 13, 14045",
      url: "https://doi.org/10.1038/s41598-023-41032-5",
      what: "636 citations from 84 short literature reviews written by GPT-3.5 and GPT-4, each checked against library databases.",
      use: "55% of GPT-3.5's citations and 18% of GPT-4's were invented. A real-looking reference is a claim to look up.",
      careful: "Older models; rates have changed. The point that survives is the habit of checking.",
      checks: {
        found: { status: "yes", note: "PubMed Central lists it: Scientific Reports, September 7, 2023.", link: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10484980/" },
        says: { status: "yes", note: "The abstract (via CUNY Academic Works) gives 55% and 18% fabricated, and 43% and 24% of real citations with substantive errors.", link: "https://academicworks.cuny.edu/gc_pubs/1119" },
        others: { status: "yes", note: "A 2026 arXiv survey of citation errors describes it as the first systematic study and reports the same figures.", link: "https://arxiv.org/pdf/2604.03173" }
      }
    },
    {
      id: "fabricated-citations-2025", verdict: "stands", from: "doc", parts: ["navigating"], kind: "Study",
      title: "Influence of Topic Familiarity and Prompt Specificity on Citation Fabrication in Mental Health Research Using Large Language Models",
      who: "Jake Linardon and colleagues", year: 2025, where: "JMIR Mental Health 12, e80371",
      url: "https://mental.jmir.org/2025/1/e80371",
      what: "GPT-4o asked for six literature reviews in June 2025; all 176 citations checked.",
      use: "A newer model, the same lesson: 19.9% invented, and more invented on less familiar topics.",
      careful: "One model, one field. The topics were mental health conditions; the finding we use is about citations, not the topics.",
      checks: {
        found: { status: "yes", note: "Deakin University's repository lists it in JMIR Mental Health, volume 12.", link: "https://dro.deakin.edu.au/articles/journal_contribution/Influence_of_Topic_Familiarity_and_Prompt_Specificity_on_Citation_Fabrication_in_Mental_Health_Research_Using_Large_Language_Models_Experimental_Study/30616028" },
        says: { status: "yes", note: "The article reports 35 of 176 citations (19.9%) fabricated and 45.4% of real ones with errors.", link: "https://mental.jmir.org/2025//e80371/" },
        others: { status: "yes", note: "Tech.co reported the same figures.", link: "https://tech.co/news/chatgpt-fabricates-references-half-the-time" }
      }
    },
    {
      id: "ai-search-citations", verdict: "stands", from: "doc", parts: ["navigating"], kind: "Report",
      title: "AI Search Has a Citation Problem",
      who: "Klaudia Jaźwińska and Aisvarya Chandrasekar, Tow Center for Digital Journalism", year: 2025, where: "Columbia Journalism Review, March 6, 2025",
      url: "https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php",
      what: "Eight AI search tools asked to identify the source of real news excerpts.",
      use: "Collectively wrong on more than 60% of queries, and rarely saying they weren't sure. Search built in doesn't make an answer checked.",
      careful: "A narrow task (finding a news article) on early-2025 tools.",
      checks: {
        found: { status: "yes", note: "The Tow Center's own article in CJR.", link: "https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php" },
        says: { status: "yes", note: "The article says the tools collectively gave incorrect answers to more than 60% of queries.", link: "https://www.cjr.org/tow_center/we-compared-eight-ai-search-engines-theyre-all-bad-at-citing-news.php" },
        others: { status: "yes", note: "Nieman Lab (Harvard) reported the study, its 200 tests and its findings.", link: "https://www.niemanlab.org/2025/03/ai-search-engines-fail-to-produce-accurate-citations-in-over-60-of-tests/" }
      }
    },
    {
      id: "why-hallucinate", verdict: "care", from: "doc", parts: ["navigating"], kind: "Preprint",
      title: "Why Language Models Hallucinate",
      who: "Adam Tauman Kalai, Ofir Nachum, Santosh S. Vempala and Edwin Zhang", year: 2025, where: "arXiv 2509.04664",
      url: "https://arxiv.org/abs/2509.04664",
      what: "An account of why models state wrong things confidently: training and tests reward guessing over saying 'I don't know.'",
      use: "Helps explain to students why a fluent answer can be wrong, in terms they know from taking tests.",
      careful: "Three of the four authors work at OpenAI. A theoretical argument, not a classroom study.",
      checks: {
        found: { status: "yes", note: "On arXiv, submitted September 4, 2025.", link: "https://arxiv.org/abs/2509.04664" },
        says: { status: "yes", note: "The abstract says training and evaluation reward guessing over acknowledging uncertainty.", link: "https://arxiv.org/abs/2509.04664" },
        others: { status: "partly", note: "A Substack critique questions its framing. The one we found was written with ChatGPT, so it carries little weight.", link: "https://aichats.substack.com/p/why-language-models-hallucinate" }
      }
    },
    {
      id: "ai-puzzlers", verdict: "care", from: "doc", parts: ["navigating"], kind: "Study",
      title: "\"AI just keeps guessing\": Using ARC Puzzles to Help Children Identify Reasoning Errors in Generative AI",
      who: "Aayushi Dangol, Runhua Zhao, Robert Wolfe, Trushaa Ramanan, Julie A. Kientz and Jason Yip", year: 2025, where: "Interaction Design and Children (IDC) 2025; arXiv 2505.16034",
      url: "https://arxiv.org/abs/2505.16034",
      what: "21 children aged 6–11 played a puzzle game where they could solve the puzzle themselves and then watch AI try.",
      use: "Even young children caught AI's mistakes when they could check the answer for themselves.",
      careful: "Two co-design sessions with 21 children and no comparison group. Visual puzzles, not text.",
      checks: {
        found: { status: "yes", note: "On arXiv (May 2025), presented at IDC 2025 in Reykjavik.", link: "https://arxiv.org/abs/2505.16034" },
        says: { status: "yes", note: "The abstract describes two participatory design sessions with 21 children and how they identified errors in AI reasoning.", link: "https://arxiv.org/abs/2505.16034v1" },
        others: { status: "partly", note: "Coverage in Neuroscience News and EducationHQ restates the university's release; the University of Washington piece is from the authors' own department.", link: "https://educationhq.com/news/outsmarting-the-machine-the-puzzle-game-showing-kids-how-theyre-smarter-than-ai-195944/" }
      }
    },
    {
      id: "illusion-of-understanding", verdict: "care", from: "doc", parts: ["navigating"], kind: "Preprint",
      title: "The Illusion of Understanding: How Middle-Schoolers Fail to Regulate Inquiry with ChatGPT in a Science Task",
      who: "Rania Abdelghani, Kou Murayama, Celeste Kidd, Hélène Sauzéon and Pierre-Yves Oudeyer", year: 2025, where: "arXiv 2505.01106 (v2, March 2026; first titled 'Investigating Middle School Students' Question-Asking and Answer-Evaluation Skills…')",
      url: "https://arxiv.org/abs/2505.01106",
      what: "63 French students aged 14–15 used ChatGPT on six science investigation tasks.",
      use: "Students had trouble telling good answers from poor ones and rarely followed up. Those with stronger metacognition did better; those most positive about AI did worse.",
      careful: "A preprint with a small sample. The title changed between versions; cite the version you read.",
      checks: {
        found: { status: "yes", note: "On arXiv; version 2 dated March 2, 2026 carries the new title and the same authors.", link: "https://arxiv.org/html/2505.01106v2" },
        says: { status: "yes", note: "The abstract reports over-reliance, trouble judging responses, and metacognition predicting better sensitivity to prompt quality.", link: "https://arxiv.org/html/2505.01106v1" },
        others: { status: "partly", note: "AI for Education summarized it with further figures we haven't matched to the paper.", link: "https://www.aiforeducation.io/blog/the-ai-confidence-trap" }
      }
    },
    {
      id: "detector-bias", verdict: "stands", from: "added", parts: ["navigating", "social"], kind: "Study",
      title: "GPT detectors are biased against non-native English writers",
      who: "Weixin Liang, Mert Yuksekgonul, Yining Mao, Eric Wu and James Zou", year: 2023, where: "Patterns 4(7), 100779",
      url: "https://doi.org/10.1016/j.patter.2023.100779",
      what: "Seven AI-writing detectors run on 91 TOEFL essays by non-native English writers and on U.S. eighth graders' essays.",
      use: "More than half the TOEFL essays were flagged as AI-written; the eighth graders' were classified accurately. Why we don't lean on detectors.",
      careful: "Detectors have changed since 2023. The bias it found comes from how detectors work (word predictability), which is why it still matters.",
      checks: {
        found: { status: "yes", note: "A library record lists Patterns 4(7), 100779, July 2023, with the DOI.", link: "https://ersearch2.cvtisr.sk/vufind/SummonRecord/FETCH-LOGICAL-c464t-cecae953805acd6f31d62fc883178129ffe8bc6de7e57a5d4fa4a4c4b569aced3?lng=en" },
        says: { status: "yes", note: "The paper reports the detectors consistently misclassified non-native writing as AI-generated while classifying native writing accurately.", link: "https://arxiv.org/html/2304.02819v3" },
        others: { status: "yes", note: "Times Higher Education reported the 91 essays, seven detectors and an average false-positive rate of 61.3%.", link: "https://timeshighereducation.com/node/727071" }
      }
    },

    // ── The social thread: what happens to talk between people ─────────────────────────────────────────
    {
      id: "all-roads", verdict: "care", from: "doc", parts: ["social"], kind: "Study",
      title: "\"All Roads Lead to ChatGPT\": How Generative AI is Eroding Social Interactions and Student Learning Communities",
      who: "Irene Hou, Owen Man, Kate Hamilton, Srishty Muthusekaran, Jeffin Johnykutty, Leili Zadeh and Stephen MacNeil", year: 2025, where: "ITiCSE 2025; arXiv 2504.09779",
      url: "https://arxiv.org/abs/2504.09779",
      what: "Interviews with 17 undergraduate computing students at seven universities about asking for help.",
      use: "Students described questions to classmates being redirected to ChatGPT, and feeling more alone. It's one voice, and an early one.",
      careful: "17 college students in one field. It describes what they told interviewers, not how often it happens. One voice stays one voice.",
      checks: {
        found: { status: "yes", note: "On arXiv, April 2025, to appear in the ITiCSE 2025 proceedings.", link: "https://export.arxiv.org/abs/2504.09779" },
        says: { status: "yes", note: "The abstract describes 17 interviews, help-seeking mediated by AI, and students feeling isolated.", link: "https://arxiv.org/abs/2504.09779" },
        others: { status: "partly", note: "Listed in Stanford SCALE's repository. The summaries we found elsewhere are AI-written, so they don't count.", link: "https://scale.stanford.edu/ai/repository/all-roads-lead-chatgpt-how-generative-al-eroding-social-interactions-and-student" }
      }
    },
    {
      id: "bastani-guardrails", verdict: "stands", from: "doc", parts: ["social", "making"], kind: "Study",
      title: "Generative AI without guardrails can harm learning: Evidence from high school mathematics",
      who: "Hamsa Bastani, Osbert Bastani, Alp Sungu, Haosen Ge, Özge Kabakcı and Rei Mariman", year: 2025, where: "PNAS 122(26), e2422633122",
      url: "https://doi.org/10.1073/pnas.2422633122",
      what: "Nearly 1,000 high school math students in Turkey with a plain ChatGPT-style tutor, a tutor with guardrails, or neither.",
      use: "Unguarded access raised practice scores and lowered later exam grades; the guarded tutor largely avoided the harm. How a tool is built matters.",
      careful: "Math, not reading, in one country. The research document notes a later correction to the PNAS article, which we haven't read.",
      checks: {
        found: { status: "yes", note: "RePEc lists it in PNAS volume 122, 2025, with the DOI.", link: "https://ideas.repec.org/a/nas/journl/v122y2025pe2422633122.html" },
        says: { status: "yes", note: "The abstract reports a 17% drop in grades for the plain tutor once access was removed, largely mitigated by the guarded tutor.", link: "https://econpapers.repec.org/RePEc:nas:journl:v:122:y:2025:p:e2422633122" },
        others: { status: "partly", note: "Knowledge at Wharton (the authors' school) and PsyPost (with an author interview) describe it the same way; neither is a fully independent appraisal.", link: "https://www.psypost.org/unrestricted-generative-ai-harms-high-school-math-learning-by-acting-as-a-crutch/" }
      }
    },
    {
      id: "tutor-copilot", verdict: "stands", from: "doc", parts: ["social"], kind: "Study",
      title: "Tutor CoPilot: A Human-AI Approach for Scaling Real-Time Expertise",
      who: "Rose E. Wang, Ana T. Ribeiro, Carly D. Robinson, Susanna Loeb and Dora Demszky", year: 2025, where: "arXiv 2410.03017 (v2); EdWorkingPapers",
      url: "https://arxiv.org/abs/2410.03017",
      what: "A preregistered trial: 900 tutors and 1,800 K–12 students in Title I schools, with AI suggesting moves to the human tutor.",
      use: "AI aimed at strengthening a human conversation helped: students were 4 points more likely to master topics, 9 points with lower-rated tutors.",
      careful: "Math tutoring, not peer talk or reading. Tutors said some suggestions weren't at grade level.",
      checks: {
        found: { status: "yes", note: "On arXiv (v1 October 2024, v2 January 2025), with the preregistration linked.", link: "https://arxiv.org/abs/2410.03017" },
        says: { status: "yes", note: "The paper reports the 4-point gain, the 9-point gain for lower-rated tutors, and tutors' concerns about grade-level language.", link: "https://arxiv.org/html/2410.03017v1" },
        others: { status: "yes", note: "The University of Warwick's education project page describes the trial and results the same way.", link: "https://warwick.ac.uk/fac/cross_fac/eduport/edufund/projects/yang/projects/tutor-copilot-a-human-ai-approach-for-scaling-real-time-expertise/" }
      }
    },
    {
      id: "scale-evidence", verdict: "stands", from: "doc", parts: ["social", "revisit"], kind: "Review",
      title: "The Evidence Base on AI in K-12: A 2026 Review",
      who: "Lily Fesler, J. Martinez, C. Agnew and Susanna Loeb, SCALE Initiative, Stanford University", year: 2026, where: "AI Hub for Education",
      url: "https://scale.stanford.edu/research-in-action/understanding-evidence-base-ai-k12-education",
      what: "Of more than 800 papers on AI in K–12 education, 20 high-quality causal studies.",
      use: "None of the 20 studied students using AI in U.S. K–12 classrooms. The honest frame for everything else on this page.",
      careful: "Education Week (November 2026) describes a larger follow-up review: 52 studies that tested interventions, 10 with U.S. K–12 students or educators. We haven't read it yet.",
      checks: {
        found: { status: "yes", note: "SCALE's report gives the citation and the October 2025 repository count.", link: "https://scale.stanford.edu/sites/default/files/The%20Evidence%20Base%20on%20AI%20in%20K-12%20Report.pdf" },
        says: { status: "yes", note: "The summary says there are no high-quality causal studies of student AI use in U.S. K–12 classrooms.", link: "https://scale.stanford.edu/research-in-action/understanding-evidence-base-ai-k12-education" },
        others: { status: "yes", note: "EdTech Innovation Hub reported the same counts and the same gap.", link: "https://www.edtechinnovationhub.com/news/stanford-report-finds-limited-evidence-behind-ai-impact-in-k-12-classrooms" }
      }
    },

    // ── Revisit: guidance close to home ─────────────────────────────────────────────────────────────────
    {
      id: "mde-guidance", verdict: "care", from: "doc", parts: ["revisit"], kind: "Guidance",
      title: "Artificial Intelligence in Education: Guiding Principles",
      who: "Minnesota Department of Education", year: 2024, where: "PDF updated July 17, 2024",
      url: "https://education.mn.gov/MDE/dse/tech/AI/",
      what: "Minnesota's guiding principles for AI in schools, with a list of resources.",
      use: "What our own state says. The research document couldn't read it; we found it, and it still needs a careful read.",
      careful: "Based on the 2023 U.S. Department of Education report. We've read only its opening and resource list so far.",
      checks: {
        found: { status: "yes", note: "A copy of the PDF dated July 17, 2024 carries the title and principles section.", link: "https://ballotpedia.s3.amazonaws.com/images/e/e6/Minnesota_AI_guidance.pdf" },
        says: { status: "partly", note: "It says its principles are based on the U.S. Department of Education's 2023 report and points schools to the TeachAI toolkit. The principles themselves are still to read.", link: "https://ballotpedia.s3.amazonaws.com/images/e/e6/Minnesota_AI_guidance.pdf" },
        others: { status: "yes", note: "The Center for Democracy & Technology's review of state guidance cites Minnesota's as saying AI can improve access, through translation and audio descriptions.", link: "https://cdt.org/insights/looking-back-at-ai-guidance-across-state-education-agencies-and-looking-forward/" }
      }
    },
    {
      id: "teachai-toolkit", verdict: "stands", from: "added", parts: ["revisit"], kind: "Toolkit",
      title: "AI Guidance for Schools Toolkit",
      who: "TeachAI (Code.org, ETS, ISTE, Khan Academy and the World Economic Forum), co-authored with CoSN, Digital Promise, the European EdTech Alliance and PACE", year: 2023, where: "First released October 2023; updated since",
      url: "https://www.teachai.org/toolkit",
      what: "Seven principles for school AI guidance, with sample language for policies, letters to staff and classroom rules.",
      use: "What many districts, and Minnesota's own guidance, start from.",
      careful: "Written by organizations that include AI and ed-tech companies. Sample language is meant to be adapted, not copied.",
      checks: {
        found: { status: "yes", note: "TeachAI's release (PR Newswire, October 17, 2023) names the partners and co-authors.", link: "https://prnewswire.com/news-releases/schools-now-have-access-to-ai-guidance-toolkit-released-by-education-leaders-and-tech-experts-301959466.html" },
        says: { status: "yes", note: "The toolkit says it's organized around seven principles and isn't meant to be copied verbatim.", link: "https://www.teachai.org/toolkit" },
        others: { status: "partly", note: "The summaries we found come from partners (PACE is a co-author). Minnesota's guidance points schools to it, which tells us it's in use, not that it's right.", link: "https://edpolicyinca.org/publications/ai-policy-guidance-schools?page=0" }
      }
    },

    // ── Set aside for now: cited in the research document, not something we'd stand on ─────────────────
    {
      id: "cognitive-sovereignty", verdict: "aside", from: "doc", parts: [], kind: "Preprint",
      title: "The Cognitive Sovereignty Threshold: An Interdisciplinary Humanities and Sciences Framework for Human Agency in Generative AI-Assisted Knowledge Work",
      who: "Not confirmed", year: 2026, where: "ResearchGate upload",
      what: "A framework the research document leans on heavily, with its own measure.",
      use: "Nothing, until we can find where it was published and who reviewed it.",
      careful: "A different, published paper uses similar words: Klein and Klein's 'The extended hollowed mind' (Frontiers in AI, 2025). Don't mix them up.",
      checks: {
        found: { status: "no", note: "We found only ResearchGate uploads, no journal or conference. Searching the title turned up other uses of 'cognitive sovereignty' instead, like the Klein paper." },
        says: { status: "open", note: "Not read." },
        others: { status: "no", note: "No review, citation or response found." }
      }
    },
    {
      id: "verification-sufficiency", verdict: "aside", from: "doc", parts: [], kind: "Article",
      title: "When Is Checking Enough? Verification Sufficiency Calibration as a Missing Construct in Generative-AI-Supported Higher Education",
      who: "Not confirmed", year: 2026, where: "ResearchGate, and a small journal (ujssh.com)",
      what: "The idea of 'verification sufficiency calibration' that closes the research document.",
      use: "The question in the title is a good one; the term isn't established.",
      checks: {
        found: { status: "partly", note: "Listed on ResearchGate and in one small journal we can't vouch for. Searching the term found no other use of it." },
        says: { status: "open", note: "Not read." },
        others: { status: "no", note: "No review, citation or response found. Related work uses other words for the same worry (a 'verification deficit' in a 2026 AJET study)." }
      }
    },
    {
      id: "doc-secondhand", verdict: "aside", from: "doc", parts: [], kind: "Secondhand pages",
      title: "Blogs, summaries and copies the research document cited",
      who: "Various", year: null, where: "Glasp, Neurosity, Piggypik, Superprof, PicoBuddy, U.S. School Index, JobCannon, Emergent Mind, Scribd copies",
      what: "Commercial blogs, AI-written summaries and uploaded copies of other people's work.",
      use: "Nothing directly. Each one pointed at a primary source, and where it mattered we went to that source instead (Delgado, Salmerón, PISA, UNESCO, GLAT, Long and Magerko).",
      checks: {
        found: { status: "partly", note: "They exist, but they aren't the work being cited." },
        says: { status: "open", note: "Not read: we read the primary sources instead." },
        others: { status: "no", note: "Not the kind of source anyone reviews." }
      }
    },
    {
      id: "doc-small-journals", verdict: "aside", from: "doc", parts: [], kind: "Articles",
      title: "Articles in journals we couldn't vouch for",
      who: "Various", year: null, where: "GRS Journal, Bioresscientia, IRE Journals, Wisvora, and similar",
      what: "Papers on cognitive offloading, AI dependence and AI literacy that the research document cited for strong claims.",
      use: "Nothing for now. Where they make a claim we care about, we'd want it from a source with known review.",
      checks: {
        found: { status: "partly", note: "The pages exist; we didn't confirm how the journals review work." },
        says: { status: "open", note: "Not read." },
        others: { status: "open", note: "Not looked for." }
      }
    },
    {
      id: "brain-mapping-ai", verdict: "aside", from: "doc", parts: [], kind: "Preprint",
      title: "Mapping generative AI use in the human brain: divergent neural, academic and mental health profiles of functional versus socio-emotional AI use",
      who: "Not confirmed", year: null, where: "ResearchGate upload",
      what: "Behind the research document's claims about what AI use does in the brain.",
      use: "Nothing until we know where, or whether, it was published.",
      checks: {
        found: { status: "partly", note: "A ResearchGate upload; we didn't find a journal." },
        says: { status: "open", note: "Not read." },
        others: { status: "open", note: "Not looked for." }
      }
    }
  ]
};
