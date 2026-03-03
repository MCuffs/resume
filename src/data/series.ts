export type SeriesSlot = {
  slug: string;
  creatorName: string;
  creatorHandle: string;
  avatarUrl?: string;
  category: 'Tech' | 'Beauty' | 'Lifestyle' | 'Food' | 'Education' | 'Finance' | 'Other';
  cadence: string; // e.g. "2 posts/week"
  format: string; // e.g. "Q&A thread, checklist, hot takes"
  sponsorGets: string[]; // benefits, no performance promises
  audienceNotes: string;
  exampleLinks: { label: string; url: string }[];
  startingPriceNote: string; // e.g. "from ₩500,000 / 4 weeks"
  availability: string; // e.g. "Next slot: Mar 2026"
};

export const SERIES_SLOTS: SeriesSlot[] = [
  {
    slug: 'operator-notes',
    creatorName: 'Arthur',
    creatorHandle: '@arthurian_studio',
    avatarUrl: '/influencers/KakaoTalk_20260125_204145544.jpg',
    category: 'Tech',
    cadence: '2 posts/week',
    format: 'Operator notes + Q&A thread',
    sponsorGets: [
      'Sponsor credit line (top of each post)',
      'Pinned comment with brand context (approved copy)',
      '1 dedicated “AMA prompt” seeded by sponsor (optional)',
    ],
    audienceNotes: 'Startup, PM, creator economy, early adopter audience. Text-first engagement.',
    exampleLinks: [
      { label: 'Sample thread', url: 'https://www.threads.net' },
    ],
    startingPriceNote: 'from ₩500,000 / 4 weeks',
    availability: 'Next slot: upon request',
  },
  {
    slug: 'beauty-essentials',
    creatorName: '요아🎀',
    creatorHandle: '@7.rosie_s',
    avatarUrl: '/influencers/요아.jpg',
    category: 'Beauty',
    cadence: '3 posts/week',
    format: 'Routine breakdown + short reviews',
    sponsorGets: [
      'Sponsor credit line (top of each post)',
      'Product mention within routine context (no exaggerated claims)',
      '1 recap post at end of month (optional)',
    ],
    audienceNotes: 'Beauty, fashion, daily life. High comment-driven discovery.',
    exampleLinks: [
      { label: 'Sample thread', url: 'https://www.threads.net' },
    ],
    startingPriceNote: 'from ₩350,000 / 4 weeks',
    availability: 'Next slot: upon request',
  },
  {
    slug: 'taste-log',
    creatorName: 'x_ox_o__z',
    creatorHandle: '@x_ox_o__z',
    avatarUrl: '/influencers/x_ox_o__z.png',
    category: 'Food',
    cadence: '2 posts/week',
    format: 'Taste log + honest notes',
    sponsorGets: [
      'Sponsor credit line (top of each post)',
      'Sampling-based review (disclosure included)',
      '1 “where to buy” link in pinned comment (optional)',
    ],
    audienceNotes: 'Food/lifestyle readers looking for straightforward recommendations.',
    exampleLinks: [
      { label: 'Sample thread', url: 'https://www.threads.net' },
    ],
    startingPriceNote: 'from ₩300,000 / 4 weeks',
    availability: 'Next slot: upon request',
  },
];

