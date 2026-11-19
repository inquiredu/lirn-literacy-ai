# The research library

`library.html` is where someone the session leaves curious goes next: the studies the talk cites, the older research each slide leans on, and what has been learned since generative AI arrived. Its words and entries are in `library.js`, which `deck.js` imports as `deck.library`. The rules for checking, filtering and shelving it are in `present/core.js`, with tests; `present/library.js` only draws.

Hidden for now (November 19): nothing links to it but a ✦ at the end of the landing page's credits. `HANDOFF.md` says how to bring it back.

## The rule

Every entry is a real source that a reader can open and confirm. Nothing goes in from memory, and nothing goes in because it sounds right. Before adding one:

1. Open its record: Crossref or OpenAlex for a DOI, ERIC, arXiv, Open Library, or the publisher's or producer's own page.
2. Take the authors, year, title, journal, volume and pages from that record, not from a reference list or a summary.
3. Write `adds` from the abstract or description you read. Say who was studied only as far as the record says. No numbers you didn't see there.
4. Check that the link works. For a DOI, `https://doi.org/<doi>` must redirect.
5. Ask whether the connection to the session is plain. If it takes a paragraph to explain, leave it out.

`node scripts/check.js` (part of `check-all.js`) fails an entry with a missing field, a link that isn't https, a repeated id or address, a topic or slide the deck doesn't have, or no `checked` date. It cannot tell whether a source is real. That part is a person's.

## Fields

| Field | What it holds |
| --- | --- |
| `id` | Kebab-case, unique. Also the entry's address: `library.html#lupo-2019` |
| `era` | `foundations` (doesn't depend on generative AI) or `ai` (studies AI, or rethinks literacy because of it). Filed by subject, not date: a 2024 review of the baseball studies is `foundations`; a 2020 paper on bots and critical literacy is `ai` |
| `form` | `research`, `report` (an agency's or organization's report, guide or lesson), `reflection` (a book or essay for a wide audience), `media` (listen or watch). Everything but research wears a filled label on the page |
| `peer` | Research only. `true` for work published in a scholarly journal, proceedings or academic press; `false` for a preprint, which the page marks "not peer reviewed" |
| `kind` | The word shown: Study, Meta-analysis, Research review, Preprint, Book, Podcast series… |
| `topics` | One or more shelf ids from `topics`. The first is the entry's home shelf |
| `authors`, `year`, `title`, `venue` | As the record gives them |
| `url` | Where a reader goes: the DOI link when there is one |
| `free`, `freeUrl` | Whether anyone can read or play it without paying, and a second address when a free version lives elsewhere |
| `adds` | One to three sentences on what it reports or argues, and why it's here |
| `who`, `caution` | Who was studied; what to keep in mind (a preprint, a correction, adults not students) |
| `slides` | Slide ids where the session cites it. The page links each to the review |
| `seen` | `record` (its registry record was opened) or `listing` (found in a search listing of the publisher's or producer's page, which couldn't be opened) |
| `checked` | The day it was checked |

## How the first 70 were checked (November 19, 2026)

A first pass by search confirmed that every candidate existed but could not open any publisher or registry page, so nothing was accepted on it. A second pass opened the records directly:

- **55 DOIs** looked up in Crossref and OpenAlex (authors, title, journal, volume, issue, pages, corrections, retractions, abstract), and each tested at doi.org. All 55 resolve. None is retracted.
- **ERIC** for the two What Works Clearinghouse guides, the National Reading Panel report, *Bringing Words to Life*, *Leveled Reading, Leveled Lives*, and the abstracts of older articles (Lewison, Cheatham and Allor, Mostow, Ruíz, Graham and Hebert).
- **arXiv** for the two preprints and for the comment on one of them.
- **Open Library** for three books.

### Nine to open by hand

These are `seen: "listing"`. Their publishers' or producers' pages were out of reach from the environment the library was built in (its network allows registries only, and a request to add these hosts was refused). Each was confirmed in a search listing of the page itself. Open each once, and change `seen` to `record`:

| Entry | Address | What to confirm |
| --- | --- | --- |
| `freebody-luke-1990` | https://eprints.qut.edu.au/49099/ | Volume 5(3), pages 7–16; that the PDF opens |
| `street-2003` | https://doi.org/10.52214/cice.v5i2.11369 | The DOI is confirmed and resolves. The summary is general, because the article has no abstract |
| `janks-2010` | https://openlibrary.org/works/OL9245742W | The catalog record is confirmed. The four orientations come from the publisher's description, seen in a listing. Open Library gives 2009 as first publication; the book is cited as 2010 |
| `sold-a-story-2022` | https://features.apmreports.org/sold-a-story/ | The page loads |
| `warner-2025` | https://openlibrary.org/works/OL42508897W | The catalog record is confirmed. The summary follows the publisher's description, seen in a listing |
| `caulfield-wineburg-2023` | https://openlibrary.org/works/OL34966218W | As above; the postscript on large language models is in the publisher's contents list |
| `crash-course-navigating-digital-information` | https://thecrashcourse.com/topic/navigatingdigitalinfo/ | The page loads; the year (2019) |
| `dig-ai-chatbot-claims` | https://cor.inquirygroup.org/curriculum/lessons/ai-chatbot-claims | The page loads; whether a free account is needed; a publication year, if it gives one |
| `shanahan-podcast-2026` | https://shanahan-on-literacy.cohostpodcasting.com/episodes/ai-and-reading-comprehension | The episode plays |

## Left out, and why

| Source | Why |
| --- | --- |
| Luke & Freebody (1999), "Further notes on the four resources model" | No stable address: *Reading Online* is gone, and no record was found for the *Practically Primary* version |
| Beck, McKeown, Hamilton & Kucan (1997), *Questioning the Author* | The book the session cites is out of print with no publisher page. The 1996 study is in its place |
| Graham & Hebert (2010), *Writing to Read* (Carnegie report) | The session cites the report; its address couldn't be confirmed. The 2011 journal article is in its place |
| Scarborough (2001), the reading rope | A chapter with no address of its own |
| UNESCO (2023), *Guidance for generative AI in education and research* | Reports disagree on whether it recommends a minimum age of 13 or only notes one; the document couldn't be opened to settle it |
| Chiang, "ChatGPT is a blurry JPEG of the web" and "Why A.I. isn't going to make art" (*The New Yorker*) | Real and worth reading; the magazine's pages couldn't be opened to confirm the addresses |
| Ezra Klein Show episodes with Maryanne Wolf and with Rebecca Winthrop | Confirmed only on a podcast directory; the episode with Wolf carries two titles and is for subscribers |
| Brookings (2026), *A new direction for students in an AI world* | Exists; its summary wasn't read |
| Common Sense Media (2024), *The dawn of the AI era* | Exists; its page wasn't opened, and it is about teenagers' use in general |
| Lee et al. (2025), on knowledge workers; Jakesch, Hancock & Naaman (2023), on spotting AI text | Confirmed, but about adults at work and online. The connection to K–12 literacy was a stretch |
| Tate et al. (2023); Cope & Kalantzis (2024); Robinson (2023); Xu et al. (2021) | Confirmed, but a preprint or paywalled work whose ground another entry covers, or with no abstract to summarize from |
| Vygotsky (1978), *Mind in Society* | The session doesn't cite it, and its catalog record has no description to summarize from |

Two gaps the session names stayed gaps. We found one study of elementary students writing with generative AI (LaMear & von Gillern, 2025: one school, two weeks) and none that tests AI-leveled text with K–12 readers. A single search pass is not proof that none exists.

## What the check found about the deck

For Andrew and Sean. Nothing here was changed in `deck.js`.

| Slide | Finding |
| --- | --- |
| `noticing-a` | Bastani et al. is right as cited. PNAS published a correction to it in 2025 (122(34), e2518204122); what it corrects wasn't read. The abstract says "nearly a thousand" students and doesn't name Turkey, which comes from the paper or its coverage |
| `noticing-nav`, `evidence-map` | Abdelghani et al. call their 14- and 15-year-olds middle-schoolers; the evidence map files them under 9–12. The abstract of the current version says 63 students. Still a preprint |
| `noticing-nav` | Dangol et al. is two participatory design sessions with 21 children, not an experiment. "Caught a chatbot's errors on puzzles they could solve themselves" is stronger than the abstract, which reports how children identified errors and judged the AI's answers |
| `noticing-nav` | Brodsky et al.: all 2,278 students took the curriculum, but the comparison with control classes rests on 316 of them against 287 |
| `basics-checking` | Recht & Leslie is right as cited (64 junior high students). A 2024 review in *Reading Research Quarterly* (Reynolds, Hattan & Markham) questions how the baseball studies measured knowledge and how they are cited. It's in the library beside the study |
| `basics-thinking` | Murphy et al.: discussion raised comprehension of the text in several approaches, but few approaches raised critical thinking and reasoning. "Structured talk builds comprehension" holds; "argue with the text" is the part the meta-analysis found hardest to get |
| `basics-thinking` | The foot cites Graham & Hebert's 2010 report and Beck et al.'s 1997 book. The library links their peer-reviewed counterparts (2011, 1996) because those have records |
| `moves` | Shieh et al. is right as described. Its peer-reviewed form is a two-page extended abstract (AIES 2025); a companion paper on 150,000 classroom stories (Vassel et al., 2024) is closer to "ask for a story about a student" |
| `roles-now` | Janks (2010) and Lewison, Flint & Van Sluys (2002, *Language Arts* 79(5), 382–392) are confirmed. The names of Lewison's four dimensions weren't in the abstract read |
| `four-roles` | Freebody & Luke: 5(3), 7–16, by the authors' repository record |
