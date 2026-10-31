/**
 * English UI strings, the source for every other language. Case text lives with each case in
 * content/cases/<case>/<locale>.json.
 */
export const en = {
  appName: 'CASEFILE',
  appSubtitle: 'FIVE MINUTES',
  tagline: 'Real evidence. Real reasoning.',
  tabs: { cases: 'Cases', settings: 'Settings' },
  library: {
    filters: { all: 'All cases', available: 'Available', upcoming: 'Coming soon' },
    start: 'Start investigation',
    resume: 'Resume investigation',
    replay: 'Review case',
    comingSoon: 'Coming soon',
    minutes: (min: number, max: number) => `${min}–${max} min`,
    evidenceItems: (count: number) => `${count} evidence items`,
    status: { new: 'New', active: 'In progress', solved: 'Solved' },
    empty: 'No cases here yet.',
    /** Titles of planned cases that aren't authored yet, by case number. */
    upcomingTitles: {
      3: 'The Empty Room',
      4: '21:37',
      5: 'The Forged Signature',
      6: 'Silent Alarm',
      7: 'The Wrong Photograph',
      8: 'Dead Air',
      9: 'The Final Passenger',
      10: 'Paper Trail',
    },
  },
  difficulty: { rookie: 'Rookie', detective: 'Detective', inspector: 'Inspector' },
  briefing: {
    back: 'Case library',
    caseOf: (n: number, total: number) => `Case ${String(n).padStart(2, '0')} of ${total}`,
    tabs: { briefing: 'Briefing', people: 'People' },
    incidentReport: 'Incident report',
    date: 'Date',
    location: 'Location',
    objective: 'Your objective',
    evidence: 'Evidence items',
    deductions: 'Key deductions',
    people: 'People of interest',
    begin: 'Begin investigation',
    resume: 'Resume investigation',
    review: 'Review investigation',
  },
  evidence: {
    title: 'Evidence',
    back: 'Briefing',
    /** Detail can be opened from the workspace or the board, so the label stays generic. */
    detailBack: 'Back',
    filters: {
      all: 'All',
      testimony: 'Testimony',
      documents: 'Documents',
      digital: 'Digital',
      photos: 'Photos',
      physical: 'Physical',
    },
    types: {
      testimony: 'Testimony',
      document: 'Document',
      timeline: 'Timeline',
      digital: 'Digital record',
      photograph: 'Photograph',
      physical: 'Physical evidence',
    },
    status: { new: 'New', inspected: 'Inspected' },
    empty: 'No evidence of this kind yet.',
    discoveries: (links: number, deductions: number) =>
      `${links} ${links === 1 ? 'link' : 'links'} · ${deductions} ${deductions === 1 ? 'deduction' : 'deductions'}`,
    facts: 'Extracted facts',
    factsHint: 'Select two facts, from any evidence, to compare them.',
    selectFact: 'Select fact for comparison',
    compare: (count: number) =>
      count === 2 ? 'Compare facts' : `Select facts to compare (${count}/2)`,
    clear: 'Clear selection',
    trayEmpty: 'Open any evidence and pick a fact to start a comparison.',
    trayOne: 'Pick a second fact — from this or any other evidence.',
    chooseFromAll: 'Choose from all facts',
    selectedInCard: (n: number) => (n === 1 ? '1 fact selected' : `${n} facts selected`),
    tipTitle: 'How to investigate',
    tip: 'Every statement and record contains facts. Pick one fact, then pick a second one from any evidence — the same person, a different witness or a log — and compare them. Contradictions between people are often where cases break open.',
    tipDismiss: 'Got it',
  },
  compare: {
    title: 'Compare facts',
    intro:
      'Do these two facts support each other, contradict each other, or describe the same thing?',
    factA: 'Fact A',
    factB: 'Fact B',
    question: 'What is the relationship?',
    relations: {
      supports: { label: 'Supports', description: 'Both can be true' },
      contradicts: { label: 'Contradicts', description: 'They cannot both be true' },
      same_event: { label: 'Same event', description: 'They refer to the same thing' },
    },
    analyze: 'Analyze',
    close: 'Close',
    done: 'Back to evidence',
    tryAgain: 'Try another link',
    results: {
      valid: 'Link established',
      validBody: 'The evidence backs this up.',
      not_established: 'Not established',
      not_establishedBody:
        'The evidence doesn\x27t establish that relationship between these facts. Nothing is lost — try a different pairing or relationship.',
      already_discovered: 'Already established',
      already_discoveredBody: 'You\x27ve already linked these two facts.',
      not_available: 'Not available',
      not_availableBody: 'Inspect the evidence behind both facts first.',
      invalid_input: 'Pick two different facts',
      invalid_inputBody: 'A fact can\x27t be compared with itself.',
      requires_more_investigation: 'Not established',
      requires_more_investigationBody: 'The evidence doesn\x27t establish that relationship yet.',
    },
    newDeductions: 'New deduction',
    missing: 'Select a fact first.',
    chooseB: 'Choose Fact B',
    chooseBHint:
      'Any fact from evidence you have inspected. Comparing different sources is often the key.',
    change: 'Change',
  },
  board: {
    title: 'Deduction board',
    open: 'Board',
    back: 'Evidence',
    confirmed: 'Confirmed',
    optional: 'Optional',
    empty: 'No deductions yet. Compare facts from the evidence to build your case.',
    remaining: (n: number) =>
      n === 0
        ? 'All key deductions uncovered. You can file your report.'
        : `${n} key ${n === 1 ? 'deduction' : 'deductions'} still to uncover.`,
    actionsTitle: 'Next step',
    performAction: 'Request it',
    actionDone: 'Done',
    revealed: 'New evidence obtained',
    viewEvidence: 'View evidence',
    report: 'File final report',
    reportLocked: 'Uncover every key deduction to file your report.',
    hint: {
      title: 'Need a hint?',
      ask: 'Get a hint',
      more: 'Show the two facts',
      reveal: 'Establish the link for me',
      focus: 'Compare these two facts:',
      revealed: 'Link established by hint.',
      none: 'No hint right now. Try inspecting new evidence or taking the next step.',
      used: (n: number) => `Hints used: ${n}`,
    },
  },
  report: {
    title: 'Final report',
    back: 'Board',
    intro: 'Identify the most likely explanation and support it with evidence.',
    evidenceStep: 'Which evidence supports your conclusion?',
    evidenceHint:
      'Select the evidence that proves your answers. Irrelevant evidence weakens a report.',
    submit: 'Submit report',
    incomplete: 'Answer every question and select at least one piece of evidence.',
    results: {
      not_established:
        'The report isn\x27t supported yet. Check your answers and the evidence you selected, then try again. Your investigation is unchanged.',
      requires_more_investigation: 'You haven\x27t uncovered enough yet. Return to the board.',
      not_available: 'Some selected evidence hasn\x27t been inspected.',
      invalid_input: 'Answer every question first.',
      already_discovered: 'This case is already closed.',
    },
  },
  resolution: {
    closed: 'Case closed',
    rating: (stars: number) => `Rating: ${stars} of 3`,
    missedTitle: 'Insights you missed',
    missedNone: 'You found every optional insight.',
    statsTitle: 'Case statistics',
    hints: 'Hints used',
    wrongReports: 'Wrong reports',
    library: 'Back to case library',
    replay: 'Replay case',
  },
  settings: {
    title: 'Settings',
    version: (v: string) => `Version ${v}`,
    language: 'Language',
    sound: 'Sound effects',
    soundOptions: { off: 'Off', on: 'On' },
    soundHint: 'Subtle cues when a link holds, a lead falls through or a case closes.',
    motion: 'Motion',
    motionOptions: { system: 'System', reduced: 'Reduced', full: 'Full' },
    motionHint: 'Reduced swaps sliding screen transitions for a gentle fade.',
  },
  notFound: 'This case could not be found.',
} as const;

/** Shape every translation must match: same keys and same formatter signatures as English. */
type Strings<T> = T extends string
  ? string
  : T extends (...args: infer A) => string
    ? (...args: A) => string
    : { readonly [K in keyof T]: Strings<T[K]> };

export type UiStrings = Strings<typeof en>;
