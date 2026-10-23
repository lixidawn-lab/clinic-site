// English UI copy. This file defines the shape every other locale must match.
// Clinic facts (name, address, hours…) do NOT belong here — they live in src/content.
export const en = {
  langName: 'English',
  /** Shown in the header language switcher. */
  langShort: 'EN',
  a11y: {
    skipToContent: 'Skip to main content',
    mainNav: 'Main',
    menu: 'Open menu',
    home: 'Home',
    switchLanguage: 'Read this page in English',
    bookingBar: 'Book an Appointment',
    social: 'Social media',
  },
  nav: {
    home: 'Home',
    about: 'About Hanni',
    notes: 'Doctor’s Notes',
    appointments: 'Appointments & Clinic',
  },
  // Site-wide CTA (PRD 2): opens WhatsApp. The phone number is shown next to it (PRD 2.1).
  cta: {
    book: 'Book an Appointment',
    call: 'Call',
    whatsappBook: 'Book on WhatsApp',
    whatsappClinic: 'WhatsApp the clinic',
  },
  footer: {
    mabApprovalNo: 'MAB approval no.',
    privacy: 'Privacy notice',
  },
  social: {
    instagram: 'Instagram',
    youtube: 'YouTube',
    facebook: 'Facebook',
  },
  // Rendered as "待补充 · TBC 3.4" (checklist number appended).
  tbc: {
    label: '待补充',
  },
  // Preview-only labels (same text in both languages, like TBC). Never shown in production.
  preview: {
    draft: '初稿 · 待确认 · Draft',
    review: '待涵倪审阅 · Pending Hanni’s review',
    permission: '待取得转载许可 · Permission pending',
  },
  credentials: {
    experience: 'Experience',
    languages: 'Languages',
  },
  home: {
    aboutLink: 'More about Hanni',
    notesKicker: 'Doctor’s Notes',
    notesTitle: 'Clinical reflections from Dr. Hanni',
    allNotes: 'All notes',
    readNote: 'Read the note',
    areasOfFocus: 'Areas of Focus',
    concerns: 'Common Concerns',
    concernsIntro: 'Starting points to help you recognise what you’re going through — not a diagnosis.',
    howWeBegin: 'How we begin',
    visit: 'Visit the clinic',
    visitIntro: 'Message us on WhatsApp or call the clinic to arrange a first consultation.',
    directions: 'Get directions',
  },
  about: {
    background: 'Professional Background',
    qualifications: 'Qualifications',
    registrations: 'Registration',
    experience: 'Experience',
    languages: 'Consultation languages',
    clinicalInterests: 'Clinical Interests',
    approach: 'Her Approach',
    publications: 'Research & Publications',
    stories: 'Learning Through Stories',
  },
  notes: {
    featured: 'Featured',
    latest: 'Latest Articles',
    topicsTitle: 'Topics',
    publishedElsewhere: 'Published Elsewhere',
    topics: {
      emotions: 'Emotions & mental health',
      symptoms: 'Understanding symptoms & concerns',
      family: 'Children & family',
      clinical: 'Clinical observations & reflections',
    },
    byline: 'By',
    published: 'Published',
    reviewed: 'Last reviewed',
    inChinese: 'Article in Chinese',
    inChineseNotice: 'This article is currently available in Chinese only.',
    readInChinese: 'Read the article in Chinese',
    // Source card. {source} and {date} are filled in.
    originallyPublished: 'Originally published in {source}, {date}',
    readOriginal: 'Read the original',
    disclaimer: 'This article is for general information and is not a diagnosis. If you are worried about your own situation, please speak with a doctor.',
    bookPrompt: 'Want to talk it through with Dr. Hanni?',
  },
  appointments: {
    services: 'Services',
    firstVisit: 'Your First Visit',
    beforeVisit: 'Before Your Visit',
    followUp: 'Follow-up Care',
    faq: 'Frequently Asked Questions',
    clinicInfo: 'Clinic Information',
    address: 'Address',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    hours: 'Opening hours',
    map: 'Map',
    parking: 'Parking & access',
    fees: 'Fees',
    payment: 'Payment methods',
    book: 'Book an Appointment',
  },
  // Per-page <title> and meta description, from the page purposes in PRD 3.
  pages: {
    home: {
      title: 'Psychiatrist in Melaka',
      description: 'Dr. Lau Harn Ni’s psychiatry clinic in Melaka, Malaysia. Get to know her background and areas of focus, read her notes, and book an appointment.',
    },
    about: {
      title: 'About Hanni',
      description: 'Dr. Lau Harn Ni’s professional background, clinical interests and approach to care.',
    },
    notes: {
      title: 'Doctor’s Notes',
      description: 'Dr. Lau Harn Ni’s writing and clinical reflections on mental health.',
    },
    appointments: {
      title: 'Appointments & Clinic',
      description: 'How to book with Dr. Lau Harn Ni: your first visit, follow-up care, common questions and clinic information.',
    },
    privacy: {
      title: 'Privacy Notice',
      description: 'How Dr. Lau Harn Ni’s clinic handles personal data under Malaysia’s Personal Data Protection Act 2010.',
    },
  },
  // Privacy notice page. `ms` is the Malay version shown on both language pages (same text in both dictionaries).
  privacy: {
    lastUpdated: 'Last updated',
    ms: {
      jump: 'Versi Bahasa Malaysia',
      title: 'Notis Privasi',
      lastUpdated: 'Kemas kini terakhir',
    },
  },
  // Share image (og:image, src/pages/og/[lang].jpg.ts): the line under the doctor's name, and its alt text.
  share: {
    cardLine: 'Psychiatrist in Melaka',
    imageAlt: 'Dr. Lau Harn Ni, psychiatrist in Melaka',
  },
};

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dict = Widen<typeof en>;
