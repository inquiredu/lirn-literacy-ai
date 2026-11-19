// The research library: where to read next, for anyone the session leaves curious. deck.js imports this file
// as deck.library, so the library page, the landing page and the checks all read it from the deck.
//
// The rule for this file: every entry is a real source that someone can open and confirm. Each one was checked
// against its publisher's, DOI's or producer's own record on the day in `checked`, and `adds` says only what
// that record's abstract or description supports. Nothing goes in from memory. docs/LIBRARY.md has the
// fields, how an entry was checked, and what was left out and why.
//
// era:   "foundations" is literacy and learning research that doesn't depend on generative AI.
//        "ai" is work that studies AI, or rethinks literacy because of it.
// form:  "research" (scholarly work; peer says whether it was peer reviewed), "report" (an agency's or
//        organization's report or guide), "reflection" (a book or essay for a wide audience),
//        "media" (something to listen to or watch). Only research is shown without a filled label.
// In the words below, [n], [total] and [part] are filled in by the page.

const words = {
  eyebrow: "Continue the inquiry",
  title: "Research library",
  lead: "The studies behind this session, and where to read next. Each source is filed by the question it helps with, and by whether it comes from before generative AI or from the years since.",
  sources: "[n] sources",
  eras: {
    foundations: {
      name: "Foundations",
      short: "Before generative AI",
      about: "Literacy and learning research that doesn't depend on AI: how people learn to read, write, check and talk about texts. Most of what the session asks of AI text was first asked here."
    },
    ai: {
      name: "AI era",
      short: "Since generative AI",
      about: "Research on AI itself, and literacy scholarship rethinking its own ideas because of it. Much of it is recent, small, and about older students than the ones this session's cases describe."
    }
  },
  forms: {
    research: { name: "Academic research", badge: "Research" },
    report: { name: "Reports & guides", badge: "Report" },
    reflection: { name: "Reflections", badge: "Reflection" },
    media: { name: "Listen & watch", badge: "Listen or watch" }
  },
  filtersLabel: "Filter the library",
  filters: { era: "When", form: "Kind of source", topic: "Question", search: "Search", free: "Free to read or play" },
  all: "All",
  clear: "Clear filters",
  showingAll: "All [n] sources",
  showing: "[n] of [total] sources",
  none: "Nothing in the library matches those filters. Clear one to see more.",
  notReviewed: "not peer reviewed",
  who: "Who was studied:",
  caution: "Keep in mind:",
  free: "Free to read or play.",
  paid: "Behind a paywall, or a book to buy or borrow.",
  freeCopy: "A free copy",
  cited: "In the session:",
  inTalk: "[part], in the session",
  method: {
    label: "About this library",
    heading: "How each source was checked",
    body: []
  }
};

// The shelves, in the order the session raises them. part links a shelf to that part of the talk.
const topics = [
  { id: "what-literacy-is", name: "What literacy is", part: "lens",
    about: "The four roles of the reader, literacy in more than one mode, and literacy as something people do together." },
  { id: "reading-critically", name: "Reading critically", part: "lens",
    about: "Who made this text, who is in it, and what it is doing. Critical literacy, and what AI text assumes by default." },
  { id: "learning-to-read", name: "Learning to read", part: "lens",
    about: "The foundation nothing in the session replaces: decoding, language and knowledge, and software that listens to children read." },
  { id: "writing", name: "Writing and authorship", part: "making",
    about: "What writing does for a writer, and what happens to learning and ownership when a tool supplies the ideas or the words." },
  { id: "complex-text", name: "Text complexity and access", part: "making",
    about: "Easier versions, harder texts with support, and the tools that give a reader a way in." },
  { id: "checking", name: "Knowledge and checking", part: "navigating",
    about: "What a reader has to know and do to judge a fluent answer, from prior knowledge to leaving the page." },
  { id: "talk", name: "Talk and participation", part: "social",
    about: "Learning with other people: discussion, a partner to read with, and where a machine takes that place or opens a door to it." }
];

const entries = [];

export default { words, topics, entries };
