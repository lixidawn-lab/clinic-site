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
  },
  tbc: {
    label: '待补充 · TBC',
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
  stub: {
    notice: 'This page is a skeleton. Its content will be added in a later batch.',
  },
};

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dict = Widen<typeof en>;
