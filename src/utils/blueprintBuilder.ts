import {
  EventData,
  GeneratedPlanCategory,
  GeneratedPlanMilestone,
  GeneratedPlanVendor,
} from '../types';

export interface BlueprintInput {
  eventType: EventData['type'];
  title: string;
  dateStr: string;
  location: string;
  guestCount: number;
  budget: number;
  vibe: string;
}

export function buildEventFromBlueprint(
  input: BlueprintInput,
  plan: {
    summary?: string;
    budgetBreakdown?: GeneratedPlanCategory[];
    milestones?: GeneratedPlanMilestone[];
    vendors?: GeneratedPlanVendor[];
    creativeVault?: {
      cocktail?: {
        name: string;
        tagline?: string;
        costPerGuest?: number;
        matchScore?: number;
        description?: string;
        ingredients?: { name: string; perDrink: string; forBatch168: string }[];
        instructions?: string;
      };
      palette?: { name: string; hex: string }[];
    };
  }
): EventData {
  const { eventType, title, dateStr, location, guestCount, budget, vibe } = input;
  const daysRemaining = Math.max(
    1,
    Math.ceil((new Date(dateStr).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    id: `event-${Date.now()}`,
    type: eventType,
    name: title.trim(),
    shortName: title.trim().split(' ').slice(0, 4).join(' '),
    dateStr: new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    daysRemaining,
    location: location.trim(),
    venueName: location.split('•')[0]?.trim() || location,
    partnerOrHost: 'Host & Planning Committee',
    guestCount,
    guestCapacity: Math.round(guestCount * 1.15),
    summary: plan.summary || `GenAI autonomous master plan tailored for ${guestCount} guests in ${location}.`,
    readinessScore: 65,
    verifiedMilestones: 8,
    totalMilestones: 20,
    totalBudget: budget,
    committedBudget: Math.round(budget * 0.4),
    safeHarborCushion: Math.round(budget * 0.15),
    aiDetectedGains: 1200,
    categories: (plan.budgetBreakdown || []).map((b: GeneratedPlanCategory, idx: number) => ({
      name: b.category,
      allocated: b.amount,
      color: ['#964330', '#c86d56', '#f59e0b', '#10b981', '#8c6b32', '#6366f1'][idx % 6],
      percentage: b.percentage,
    })),
    items: (plan.budgetBreakdown || []).map((b: GeneratedPlanCategory, idx: number) => ({
      id: `item-gen-${idx}`,
      category: b.category,
      name: `${b.category} Core Allocation`,
      allocated: b.amount,
      actual: b.amount,
      status: 'Estimated' as const,
      notes: b.tip,
    })),
    milestones: (plan.milestones || []).map((m: GeneratedPlanMilestone, idx: number) => ({
      id: `ms-gen-${idx}`,
      title: m.title,
      dueDate: 'Milestone Date',
      relativeDays: `T-minus ${m.daysBefore || 60} days`,
      priority: m.priority || 'High',
      status: 'Pending' as const,
      category: 'Execution',
      blockedBy: m.dependency !== 'None' ? m.dependency : undefined,
    })),
    vendors: (plan.vendors || []).map((v: GeneratedPlanVendor, idx: number) => ({
      id: `v-gen-${idx}`,
      name: v.name,
      category: v.category,
      role: v.category,
      status: (v.status as any) || 'Proposed',
      totalContract: v.estimatedCost,
      paidAmount: 0,
      statusNote: v.action || 'Review quote',
      contactName: 'Partner Representative',
      contactEmail: 'contact@partner.com',
      keyDeliverables: ['Contracted deliverables package'],
      nextMilestone: 'Initial vendor qualification call',
    })),
    creativeVault: {
      cocktail: {
        name: plan.creativeVault?.cocktail?.name || 'Sunset Spritz',
        tagline: plan.creativeVault?.cocktail?.tagline || 'Signature Toast',
        costPerGuest: plan.creativeVault?.cocktail?.costPerGuest || 7.5,
        matchScore: plan.creativeVault?.cocktail?.matchScore || 97,
        description:
          plan.creativeVault?.cocktail?.description ||
          'Botanical aperitif, sparkling prosecco, blood orange and thyme sprig.',
        ingredients: plan.creativeVault?.cocktail?.ingredients || [
          { name: 'Sparkling Prosecco', perDrink: '4.0 oz', forBatch168: '24 bottles' },
          { name: 'Blood Orange Syrup', perDrink: '0.75 oz', forBatch168: '1 gallon' },
        ],
        instructions:
          plan.creativeVault?.cocktail?.instructions || 'Stir over ice and serve chilled with orange wheel.',
      },
      paletteName: `${vibe.split(' ')[0]} Palette`,
      paletteId: '#GEN-902',
      swatches: plan.creativeVault?.palette
        ? plan.creativeVault.palette.map((p: { name: string; hex: string }, i: number) => ({
            name: p.name,
            hex: p.hex,
            role: ['Hero', 'Secondary', 'Linen', 'Accent'][i % 4],
          }))
        : [
            { name: 'Primary Terracotta', hex: '#C86D56', role: 'Hero' },
            { name: 'Olive Leaf', hex: '#8C6B32', role: 'Secondary' },
            { name: 'Blush Sand', hex: '#F2D8CC', role: 'Linen' },
            { name: 'Deep Spruce', hex: '#1D5249', role: 'Accent' },
          ],
      paletteUsageNotes: 'Optimized for high emotional impact and tactile stationery.',
      soundtrackVibe: 'Curated ambient acoustic melodies with upbeat evening transitions.',
    },
  };
}
