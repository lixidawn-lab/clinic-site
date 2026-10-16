// English UI copy. This file defines the shape every other locale must match.
// Clinic facts (name, address, hours…) do NOT belong here — they live in src/content.
export const en = {
  langName: 'English',
  a11y: {
    skipToContent: 'Skip to main content',
    mainNav: 'Main',
    switchLanguage: 'Read this page in English',
    bookingBar: 'Book an Appointment',
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
  },
  footer: {
    address: 'Address',
    phone: 'Phone',
    whatsapp: 'WhatsApp',
    hours: 'Opening hours',
    mabApprovalNo: 'MAB approval no.',
    privacy: 'Privacy notice',
    social: 'Follow Dr. Hanni',
  },
  social: {
    instagram: 'Instagram',
    youtube: 'YouTube',
    facebook: 'Facebook',
  },
  tbc: {
    label: '待补充 · TBC',
  },
  // Preview-only marker for drafted content Hanni hasn't confirmed yet (same text in both languages, like TBC).
  draft: {
    label: '初稿 · 待确认 · Draft',
  },
  home: {
    areasOfFocus: 'Areas of Focus',
    howWeBegin: 'How We Begin',
    latestNotes: 'Latest Doctor’s Notes',
    allNotes: 'All notes',
    clinicInfo: 'Clinic Information',
    aboutLink: 'More about Hanni',
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
    topics: {
      emotions: 'Emotions & mental health',
      symptoms: 'Understanding symptoms & concerns',
      family: 'Children & family',
      clinical: 'Clinical observations & reflections',
    },
    byline: 'By',
    published: 'Published',
    reviewed: 'Last reviewed',
    topic: 'Topic',
    inChinese: 'Article in Chinese',
    inChineseNotice: 'This article is currently available in Chinese only.',
    readInChinese: 'Read the article in Chinese',
    disclaimer: 'This article is for general information and is not a diagnosis. If you are worried about your own situation, please speak with a doctor.',
    bookPrompt: 'Want to talk it through with Dr. Hanni?',
  },
  appointments: {
    services: 'Services',
    faq: 'Frequently Asked Questions',
    clinicInfo: 'Clinic Information',
    map: 'Map',
    parking: 'Parking & access',
    fees: 'Fees',
    payment: 'Payment methods',
  },
  // Per-page <title> and meta description, from the page purposes in PRD 3. The page batches may refine them.
  pages: {
    home: {
      title: 'Home',
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
  },
};

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dict = Widen<typeof en>;
