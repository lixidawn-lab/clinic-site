// English UI copy. This file defines the shape every other locale must match.
// Clinic facts (name, address, hours…) do NOT belong here — they live in src/content.
export const en = {
  langName: 'English',
  a11y: {
    skipToContent: 'Skip to main content',
    mainNav: 'Main',
    switchLanguage: 'Read this page in English',
    bookingBar: 'Book an appointment',
  },
  nav: {
    home: 'Home',
    about: 'About Hanni',
    notes: "Doctor's Notes",
    appointments: 'Appointments & Clinic',
  },
  cta: {
    whatsapp: 'Book on WhatsApp',
    call: 'Call',
  },
  footer: {
    address: 'Address',
    phone: 'Phone',
    hours: 'Opening hours',
    mabApprovalNo: 'MAB approval no.',
  },
  tbc: {
    label: '待补充 · TBC',
    unnumbered: 'checklist no. pending',
  },
  // Per-page <title> and meta description. Placeholders until page copy is written in phase 2.
  pages: {
    home: { title: 'Home', description: 'Psychiatry clinic in Melaka, Malaysia.' },
    about: { title: 'About Hanni', description: 'About Dr. Lau Harn Ni, psychiatrist.' },
    notes: { title: "Doctor's Notes", description: "Articles by Dr. Lau Harn Ni." },
    appointments: { title: 'Appointments & Clinic', description: 'How to book an appointment and find the clinic.' },
  },
  stub: {
    notice: 'This page is a skeleton. Its content will be added in phase 2.',
  },
};

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dict = Widen<typeof en>;
