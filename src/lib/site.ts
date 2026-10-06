// Site-wide facts. Pages read these instead of restating them, so a change lands everywhere at once.

export const SITE = {
  name: 'SpaceToReno',
  url: 'https://spacetoreno.com',
  description:
    'A plain-English guide to renovating a home in Singapore, from the first plan to the end of the works, written by the OurKampung team.',
} as const;

export type HubKey = 'planning' | 'rules' | 'hiring' | 'during' | 'rooms';

export interface Hub {
  key: HubKey;
  /** URL segment: /{path}/ is the hub, /{path}/{guide}/ its guides. A one-way door once live. */
  path: string;
  navLabel: string;
  title: string;
  lede: string;
  metaTitle: string;
  description: string;
  /** Illustration in public/illo/ (no extension), shown on the hub card and hub page. */
  illo: string;
  illoAlt: string;
}

export const HUBS: Record<HubKey, Hub> = {
  planning: {
    key: 'planning',
    path: 'planning-and-budget',
    navLabel: 'Planning',
    title: 'Planning and budget',
    lede: 'What happens in a renovation and in what order, what drives the cost, and how to plan a budget that survives surprises.',
    metaTitle: 'Planning a Home Renovation in Singapore | SpaceToReno',
    description:
      'Plan a Singapore home renovation in the right order: the stages from brief to handover, what drives the cost, and how to set and protect a budget.',
    illo: 'hub-planning',
    illoAlt: 'A floor plan on a table with a pencil, a tape measure and paint swatches.',
  },
  rules: {
    key: 'rules',
    path: 'rules-and-permits',
    navLabel: 'Rules and permits',
    title: 'Rules and permits',
    lede: 'What HDB, your condo’s management, URA and BCA need to approve before the works start, and which trades must be licensed.',
    metaTitle: 'Renovation Rules and Permits in Singapore | SpaceToReno',
    description:
      'Which renovation works need approval in Singapore: HDB permits, condo by-laws, URA and BCA approval for landed homes, and the licensed trades.',
    illo: 'hub-rules',
    illoAlt: 'A permit form with an approval stamp beside a hard hat.',
  },
  hiring: {
    key: 'hiring',
    path: 'hiring',
    navLabel: 'Hiring',
    title: 'Hiring: designers, contractors, quotes and contracts',
    lede: 'Interior designer or contractor, comparing quotes like for like, what the contract should say, and how payments are staged.',
    metaTitle: 'Hiring for a Renovation: ID, Contractor, Quote | SpaceToReno',
    description:
      'Choose between an interior designer and a contractor, compare renovation quotes like for like, and know what your contract and payment schedule should say.',
    illo: 'hub-hiring',
    illoAlt: 'Two quotes side by side with a magnifying glass over one line item.',
  },
  during: {
    key: 'during',
    path: 'during-the-works',
    navLabel: 'During the works',
    title: 'During the works',
    lede: 'Working hours and neighbours, hacking and debris, living elsewhere while the work goes on, and what to do when something goes wrong.',
    metaTitle: 'During a Renovation: Hours, Debris, Disputes | SpaceToReno',
    description:
      'What to expect while your Singapore renovation is under way: permitted working hours, neighbours, hacking debris, moving out, and handling disputes.',
    illo: 'hub-during',
    illoAlt: 'A doorway with a protective floor covering, a toolbox and a stack of tiles.',
  },
  rooms: {
    key: 'rooms',
    path: 'room-by-room',
    navLabel: 'Room by room',
    title: 'Room by room',
    lede: 'The kitchen, the bathroom, bedrooms and living spaces, windows and the household shelter: each room’s rules and trades.',
    metaTitle: 'Renovating Room by Room in Singapore | SpaceToReno',
    description:
      'Room-by-room renovation guides for Singapore homes: the kitchen, bathrooms, bedrooms and living areas, windows and the household shelter.',
    illo: 'hub-rooms',
    illoAlt: 'A cut-away flat showing a kitchen, a bathroom and a bedroom.',
  },
};

export const HUB_ORDER: HubKey[] = ['planning', 'rules', 'hiring', 'during', 'rooms'];

export function hubUrl(hub: HubKey): string {
  return `/${HUBS[hub].path}/`;
}

export function guideUrl(hub: HubKey, slug: string): string {
  return `/${HUBS[hub].path}/${slug}/`;
}

/**
 * The enquiry form (family rule, 30 Sep 2026: every family site except OurKampung takes enquiries on its own
 * FormSubmit form). The details go to the OurKampung team, who pass them to the partner who'll quote (independence
 * brief, 6 Oct 2026). The form isn't a
 * brand link, so it doesn't count towards the two-per-guide limit.
 */
export const ENQUIRY = {
  /** GA4 event sent once, only after FormSubmit confirms delivery. The property's only key event. */
  event: 'generate_lead',
  propertyTypes: ['HDB flat (new)', 'HDB flat (resale)', 'Condo or apartment', 'Landed house', 'Other'],
  scopes: [
    'Whole home',
    'Kitchen',
    'Bathroom(s)',
    'Bedrooms',
    'Living and dining',
    'Flooring',
    'Carpentry',
    'Painting',
    'Electrical and lighting',
    'Hacking or removal',
  ],
  timings: [
    'As soon as possible',
    'In the next 3 months',
    'In 3 to 6 months',
    'Later: still planning',
    'The works have started',
  ],
} as const;
