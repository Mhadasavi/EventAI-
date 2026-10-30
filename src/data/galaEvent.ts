import { EventData } from '../types';

export const galaEvent: EventData = {
  id: 'oakwood-harvest-gala',
  type: 'community',
  name: 'Oakwood Harvest Community Festival & Charity Gala',
  shortName: 'Oakwood Harvest Charity Gala',
  dateStr: 'Saturday, Sep 27, 2025',
  daysRemaining: 121,
  location: 'Oakwood Community Commons & Amphitheater • Portland, OR',
  venueName: 'Oakwood Community Amphitheater',
  partnerOrHost: 'Mayor Council & Community Board',
  guestCount: 320,
  guestCapacity: 400,
  summary:
    'Civic non-profit fundraiser: 320 attendees, 12 regional micro-breweries & farm-to-table popups, live silent auction with automated bidding.',
  readinessScore: 68,
  verifiedMilestones: 18,
  totalMilestones: 30,
  totalBudget: 60000,
  committedBudget: 46200,
  safeHarborCushion: 13800,
  aiDetectedGains: 4300,
  categories: [
    { name: 'Tenting & Staging', allocated: 22000, color: '#964330', percentage: 36.6 },
    { name: 'Local Culinary & Cider', allocated: 16000, color: '#c86d56', percentage: 26.7 },
    { name: 'Auction Platform & AV', allocated: 9000, color: '#f59e0b', percentage: 15.0 },
    { name: 'Permits & Waste Management', allocated: 5500, color: '#10b981', percentage: 9.2 },
    { name: 'Signage & Community Outreach', allocated: 3500, color: '#8c6b32', percentage: 5.8 },
  ],
  items: [
    {
      id: 'og-1',
      category: 'Tenting',
      name: 'Clearspan Heated Festival Marquee',
      vendorName: 'Pacific Tent Co.',
      allocated: 22000,
      actual: 22000,
      status: 'Committed',
      notes: 'ADA ramps, emergency power generators included',
    },
  ],
  milestones: [
    {
      id: 'og-m1',
      title: 'Finalize City Sound Variance & Park Cleanliness Permit',
      description: 'Portland Parks & Rec approval pending public notice period.',
      dueDate: 'July 05, 2025',
      relativeDays: 'Due July 05',
      priority: 'High',
      status: 'Pending',
      category: 'Permits',
    },
  ],
  vendors: [
    {
      id: 'ov-1',
      name: 'Pacific Tent & Structure',
      category: 'Tenting',
      role: 'Marquee & Power Infrastructure',
      status: 'Signed',
      totalContract: 22000,
      paidAmount: 11000,
      statusNote: '50% Deposit Paid',
      contactName: 'Brian McAllister',
      contactEmail: 'brian@pacifictent.com',
      keyDeliverables: ['80x40 Clearspan marquee', 'Industrial green generators', 'ADA flooring throughout'],
      nextMilestone: 'Site inspection with Fire Marshall on Aug 04',
    },
  ],
  creativeVault: {
    cocktail: {
      name: 'Willamette Valley Spiced Honey Cider',
      tagline: 'Community Charity Toast',
      costPerGuest: 5.40,
      matchScore: 96,
      description:
        'Heirloom honeycrisp cider, ginger-star anise reduction, roasted cinnamon, splash of Hood River apple brandy.',
      ingredients: [
        { name: 'Organic Honeycrisp Cider', perDrink: '5.0 oz', forBatch168: '60 gallons' },
        { name: 'Local Clover Spiced Honey', perDrink: '0.5 oz', forBatch168: '2.5 gallons' },
        { name: 'Hood River Apple Brandy', perDrink: '1.0 oz', forBatch168: '22 bottles' },
      ],
      instructions: 'Serve warm in biodegradable kraft mugs with cinnamon swizzle stick.',
    },
    paletteName: 'Pacific Harvest: "Spruce, Cider & Gold"',
    paletteId: '#PH-801',
    swatches: [
      { name: 'Spruce Needle', hex: '#203A2B', role: 'Main signage' },
      { name: 'Warm Cider', hex: '#A85A2A', role: 'Hero accents' },
      { name: 'Hay Bale Gold', hex: '#CBA142', role: 'Lantern warmth' },
      { name: 'River Stone', hex: '#E3DFD5', role: 'Background linens' },
    ],
    paletteUsageNotes:
      'Earthy, welcoming civic palette tuned to Portland autumn woodland environment.',
    soundtrackVibe:
      'Pacific Northwest indie bluegrass, community brass ensemble, and evening swing band.',
  },
};
