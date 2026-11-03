// ─────────────────────────────────────────────────────────────
// Content for the footer pages. Each page renders through InfoPage.jsx.
// Blocks: { h: 'Heading' } | { p: 'Paragraph' } | { ul: ['item', ...] } | { cards: [{ title, body }] }
//
// REVIEW: the Legal & Policy pages are a sensible starting template. Have them
// checked by your legal / finance team before publishing (refund windows,
// ISA terms and SLA timelines are business commitments).
// ─────────────────────────────────────────────────────────────

const LAST_UPDATED = '3 November 2026';

export const PAGES = {
  // ── Resources ──────────────────────────────────────────────
  'career-reports': {
    group: 'Resources',
    title: 'Career Reports',
    lead: 'What happens after CareerCore — how our learners prepare, interview and move into new roles.',
    cta: 'counsel',
    blocks: [
      { cards: [
        { title: '96%', body: 'of learners rated themselves interview-ready at the end of their track.' },
        { title: '1:1', body: 'dedicated mentor for every learner, from first module to final mock interview.' },
        { title: '100%', body: 'of programs finish with a hands-on capstone you can show recruiters.' },
      ] },
      { h: 'How we measure outcomes' },
      { p: 'Every cohort is tracked from enrollment through placement support. We record capstone completion, mock-interview scores, resume reviews and the interviews learners attend, so mentors can step in early when someone needs extra help.' },
      { h: 'Request the latest report' },
      { p: 'Detailed cohort reports (roles, companies and salary bands) are shared during a counseling call so we can walk you through what is realistic for your background. Book a free call and ask for the report for the track you are considering.' },
    ],
  },
  'projects-hub': {
    group: 'Resources',
    title: 'Student Projects Hub',
    lead: 'Capstones built by CareerCore learners — production-style projects that go straight into a portfolio.',
    cta: 'enroll',
    blocks: [
      { cards: [
        { title: 'Full Stack', body: 'E-commerce platforms, real-time chat apps and SaaS dashboards with auth, payments and CI/CD.' },
        { title: 'AI & ML', body: 'RAG chatbots, recommendation engines and computer-vision apps deployed behind real APIs.' },
        { title: 'Cloud & DevOps', body: 'Kubernetes microservices, infrastructure-as-code pipelines and observability stacks.' },
        { title: 'Product & Design', body: 'PRDs, user research synthesis, high-fidelity Figma prototypes and usability studies.' },
      ] },
      { h: 'What makes a CareerCore capstone' },
      { ul: [
        'Scoped like a real industry brief, with requirements and acceptance criteria.',
        'Reviewed by a mentor at each milestone — code review, design critique or PRD review.',
        'Deployed or published so recruiters can open it, not just read about it.',
      ] },
    ],
  },
  workshops: {
    group: 'Resources',
    title: 'Free Coding Workshops',
    lead: 'Live, beginner-friendly sessions run by CareerCore mentors. Free to join — no enrollment needed.',
    cta: 'counsel',
    blocks: [
      { cards: [
        { title: 'Build your first React app', body: 'Components, state and deploying to the web in 90 minutes.' },
        { title: 'Intro to Python for AI', body: 'From notebooks to your first machine-learning model.' },
        { title: 'Git & GitHub essentials', body: 'Branches, pull requests and collaborating like a real team.' },
        { title: 'Cracking the tech interview', body: 'How DSA rounds work and how to practise for them.' },
      ] },
      { h: 'How to join' },
      { p: 'Workshops run every month. Request a callback or message us on WhatsApp and we will share the next schedule and joining link.' },
    ],
  },
  'interview-prep': {
    group: 'Resources',
    title: 'Interview Cheat Sheets',
    lead: 'Concise revision guides our mentors use in mock interviews.',
    cta: 'counsel',
    blocks: [
      { h: 'Data structures & algorithms' },
      { ul: ['Arrays & two pointers, sliding window', 'Hash maps and sets', 'Trees, BFS / DFS and graphs', 'Dynamic programming patterns', 'Big-O cheat sheet'] },
      { h: 'System design' },
      { ul: ['Load balancing and caching', 'SQL vs NoSQL trade-offs', 'Queues and event-driven design', 'Designing for scale: a 6-step framework'] },
      { h: 'Behavioural rounds' },
      { ul: ['The STAR method with examples', 'Talking about your capstone project', 'Questions to ask your interviewer'] },
      { p: 'Enrolled learners get the full downloadable set inside the Student Portal. Not enrolled yet? Book a counseling call and we will send a sample.' },
    ],
  },
  syllabus: {
    group: 'Resources',
    title: 'Syllabus Download',
    lead: 'Week-by-week curriculum for every CareerCore program. Download any syllabus as a PDF.',
    type: 'syllabus',
  },
  alumni: {
    group: 'Resources',
    title: 'Alumni Network',
    lead: 'Graduates stay part of CareerCore — for referrals, mentorship and lifelong learning.',
    cta: 'enroll',
    blocks: [
      { ul: [
        'Private alumni community for job referrals and peer reviews.',
        'Invitations to alumni meetups, AMAs and hiring events.',
        'Continued access to updated course material after you graduate.',
        'Opportunities to come back as a teaching assistant or mentor.',
      ] },
    ],
  },

  // ── Company ────────────────────────────────────────────────
  about: {
    group: 'Company',
    title: 'About CareerCore',
    lead: 'CareerCore Edutech helps students and working professionals build industry-ready skills and real careers.',
    cta: 'enroll',
    blocks: [
      { p: 'We started CareerCore because too many capable learners finish courses without the projects, feedback and confidence employers look for. Our programs combine live teaching, 1-on-1 mentorship and production-style capstones so every learner graduates with proof of what they can do.' },
      { cards: [
        { title: 'Mentor-led', body: 'Learn from practising engineers, designers and product leaders.' },
        { title: 'Project-first', body: 'Every module ends in something you build, ship and present.' },
        { title: 'Career-focused', body: 'Resume reviews, mock interviews and referrals are built into each track.' },
      ] },
    ],
  },
  mission: {
    group: 'Company',
    title: 'Our Mission & Vision',
    lead: 'Make high-quality, career-changing tech education accessible to every ambitious learner.',
    cta: 'enroll',
    blocks: [
      { h: 'Mission' },
      { p: 'To close the gap between learning and employment by teaching the skills industry actually uses — through mentorship, real projects and honest feedback.' },
      { h: 'Vision' },
      { p: 'A future where anyone, from any college or background, can build a thriving tech career on the strength of their skills and portfolio.' },
      { h: 'What we value' },
      { ul: ['Learners first — outcomes over vanity metrics.', 'Practical depth over surface-level theory.', 'Transparency in pricing, curriculum and results.', 'Continuous improvement, driven by student feedback.'] },
    ],
  },
  careers: {
    group: 'Company',
    title: 'Careers — We’re Hiring Mentors',
    lead: 'Share what you know, shape the next generation of engineers, and get paid for it.',
    cta: 'counsel',
    ctaTopic: 'Mentor application',
    blocks: [
      { h: 'Open roles' },
      { cards: [
        { title: 'Full Stack Mentor', body: 'React, Node.js and databases. 3+ years of industry experience. Part-time, remote.' },
        { title: 'AI / ML Mentor', body: 'Python, PyTorch, LLMs & RAG. Experience shipping ML to production. Part-time, remote.' },
        { title: 'Cloud & DevOps Mentor', body: 'AWS/GCP, Kubernetes, Terraform. Part-time, remote.' },
        { title: 'Product / UX Mentor', body: 'PMs and designers who enjoy reviewing work and coaching. Part-time, remote.' },
      ] },
      { p: 'Interested? Request a callback with the topic “Mentor application” and tell us your stack and experience in the message box.' },
    ],
  },
  press: {
    group: 'Company',
    title: 'Press & Media',
    lead: 'Resources for journalists, partners and event organisers.',
    cta: 'counsel',
    ctaTopic: 'Press enquiry',
    blocks: [
      { h: 'About CareerCore in one paragraph' },
      { p: 'CareerCore Edutech is an Indian edtech company offering mentor-led programs in Full Stack Development, AI & Machine Learning, Cloud & DevOps, Product Management, Business Analysis and UI/UX Design, with hands-on capstones and dedicated career support.' },
      { h: 'Media enquiries' },
      { p: `For interviews, brand assets or partnership enquiries, call ${'+91 83418 76728'} or request a callback with the topic “Press enquiry”.` },
    ],
  },
  events: {
    group: 'Company',
    title: 'Community Events',
    lead: 'Hackathons, demo days and meetups for the CareerCore community.',
    cta: 'counsel',
    blocks: [
      { cards: [
        { title: 'Demo Days', body: 'Cohorts present their capstones to mentors and hiring partners.' },
        { title: 'Hack Weekends', body: '48-hour team builds with prizes and mentor support.' },
        { title: 'AMA Sessions', body: 'Live Q&A with engineers and recruiters from leading tech companies.' },
      ] },
      { p: 'Ask our team for the upcoming calendar — events are announced first to our newsletter subscribers and on Instagram.' },
    ],
  },
  contact: {
    group: 'Company',
    title: 'Contact & Counseling',
    lead: 'Talk to a counselor about the right program, fees, EMI options or your career plan.',
    type: 'contact',
  },

  // ── Legal & Policy ─────────────────────────────────────────
  'privacy-policy': {
    group: 'Legal & Policy',
    title: 'Privacy Policy',
    updated: LAST_UPDATED,
    legal: true,
    blocks: [
      { p: 'This policy explains what personal information CareerCore Edutech Private Limited (“CareerCore”, “we”) collects when you use our website and learning platform, how we use it, and the choices you have.' },
      { h: '1. Information we collect' },
      { ul: [
        'Account details you provide at registration: name, username, email, mobile number, date of birth and selected program.',
        'Learning activity: course progress, submissions, quiz results, feedback and reviews you post.',
        'Enquiries: details you share in counseling or newsletter forms.',
        'Technical data: device, browser and usage information needed to run and secure the platform.',
      ] },
      { h: '2. How we use it' },
      { ul: ['To create and manage your account and deliver courses.', 'To contact you about your enrollment, classes and career support.', 'To improve our curriculum and platform.', 'To send newsletters you have subscribed to (you can unsubscribe at any time).'] },
      { h: '3. Sharing' },
      { p: 'We do not sell your personal data. We share it only with service providers that help us run the platform (for example hosting and video delivery), with hiring partners when you opt in to placement support, or when required by law.' },
      { h: '4. Data retention & security' },
      { p: 'We keep your data for as long as your account is active and as required for legal or accounting purposes, and protect it with access controls and encryption in transit.' },
      { h: '5. Your rights' },
      { p: 'You can request access to, correction of, or deletion of your personal data by contacting our team. We will respond within a reasonable time as required by applicable Indian law, including the Digital Personal Data Protection Act, 2023.' },
    ],
  },
  terms: {
    group: 'Legal & Policy',
    title: 'Terms & Conditions',
    updated: LAST_UPDATED,
    legal: true,
    blocks: [
      { p: 'By creating an account or enrolling in a CareerCore program you agree to these terms.' },
      { h: '1. Accounts' },
      { ul: ['You must be at least 16 years old to register.', 'Provide accurate information and keep your login credentials private.', 'Accounts are personal and may not be shared; access may be suspended for misuse.'] },
      { h: '2. Course content' },
      { p: 'All videos, notes and materials are licensed to you for personal learning only. Recording, downloading, redistributing or reselling course content is prohibited.' },
      { h: '3. Payments' },
      { p: 'Program fees, instalment plans and any applicable taxes are communicated before enrollment. Refunds are governed by our Tuition Refund Policy.' },
      { h: '4. Conduct' },
      { p: 'Treat mentors and fellow learners with respect. Plagiarism in assignments or capstones may lead to removal from the program without refund.' },
      { h: '5. Changes' },
      { p: 'We may update curricula, schedules or these terms to improve the program. Material changes will be communicated to enrolled learners.' },
    ],
  },
  'refund-policy': {
    group: 'Legal & Policy',
    title: 'Tuition Refund Policy',
    updated: LAST_UPDATED,
    legal: true,
    blocks: [
      { h: 'Cooling-off period' },
      { p: 'If the program is not right for you, request a refund within 7 days of your batch start date and before completing 20% of the course content to receive a full refund of fees paid.' },
      { h: 'After the cooling-off period' },
      { p: 'Fees are non-refundable after the cooling-off period. In genuine circumstances (medical or family emergencies) you may request a transfer to a later batch at no extra cost.' },
      { h: 'How to request' },
      { p: 'Contact the enrollment desk with your registered mobile number. Approved refunds are processed to the original payment method within 7–10 working days.' },
    ],
  },
  'isa-terms': {
    group: 'Legal & Policy',
    title: 'ISA Terms',
    updated: LAST_UPDATED,
    legal: true,
    blocks: [
      { p: 'Some programs may offer an Income Share Agreement (ISA) or deferred-payment plan. Where offered, the exact terms are set out in a separate written agreement that you sign before enrollment.' },
      { h: 'What the agreement covers' },
      { ul: ['The percentage of income and the payment period.', 'The minimum income threshold below which no payments are due.', 'The maximum total amount payable (payment cap).', 'What happens if you are not employed within the agreed window.'] },
      { p: 'No ISA obligation applies unless you have signed a written agreement. Please speak to a counselor to check availability for your program.' },
    ],
  },
  'career-support-sla': {
    group: 'Legal & Policy',
    title: 'Career Support SLA',
    updated: LAST_UPDATED,
    legal: true,
    blocks: [
      { p: 'Our commitment on the career support included with every program.' },
      { h: 'What you get' },
      { ul: ['Resume and LinkedIn profile review within 5 working days of submission.', 'At least two 1-on-1 mock interviews with a mentor.', 'Access to job and referral openings shared with the cohort.', 'Mentor doubt resolution within 48 hours on working days.'] },
      { h: 'Eligibility' },
      { p: 'Career support starts once you have completed the core modules and your capstone, and remains available for 6 months after your program ends.' },
    ],
  },
};

export const FOOTER_SECTIONS = [
  {
    title: 'Resources',
    links: [
      { label: 'Career Reports', to: '/career-reports' },
      { label: 'Student Projects Hub', to: '/projects-hub' },
      { label: 'Free Coding Workshops', to: '/workshops' },
      { label: 'Interview Cheat Sheets', to: '/interview-prep' },
      { label: 'Syllabus Download', to: '/syllabus' },
      { label: 'Alumni Network', to: '/alumni' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About CareerCore', to: '/about' },
      { label: 'Our Mission & Vision', to: '/mission' },
      { label: 'Careers (Hiring Mentors)', to: '/careers' },
      { label: 'Press & Media', to: '/press' },
      { label: 'Community Events', to: '/events' },
      { label: 'Contact Counseling', to: '/contact' },
    ],
  },
  {
    title: 'Legal & Policy',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Tuition Refund Policy', to: '/refund-policy' },
      { label: 'ISA Terms', to: '/isa-terms' },
      { label: 'Career Support SLA', to: '/career-support-sla' },
    ],
  },
];

export const PAGE_SLUGS = Object.keys(PAGES);
