export type ActiveModal = 'expense' | 'milestone' | 'ledger' | 'newEvent' | 'contractAudit' | 'vendorDetail' | 'cocktail' | 'search' | 'rsvp' | 'aiSavings' | 'dependencyGraph' | 'quoteComparison' | 'creativeVault' | 'coPlanner' | null;

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  vendorName?: string;
  allocated: number;
  actual: number;
  status: 'Estimated' | 'Quoted' | 'Committed' | 'Paid';
  notes?: string;
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  color: string;
  percentage: number;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  relativeDays: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Blocked';
  category: string;
  blockedBy?: string; // Prerequisite milestone rule
  quoteDetails?: {
    count: number;
    amount: number;
    vendor: string;
  };
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  status: 'Confirmed' | 'Declined' | 'Awaiting';
  partySize: number;
  dietaryRestrictions?: string;
  table?: string;
}

export interface QuoteOption {
  id: string;
  vendorName: string;
  amount: number;
  vehicleFleet: string;
  rating: number;
  inclusions: string[];
  isRecommended?: boolean;
}

export interface VendorPartner {
  id: string;
  name: string;
  category: string;
  role: string;
  status: 'Signed' | 'Review' | 'Deposit Paid' | 'Proposed';
  totalContract: number;
  paidAmount: number;
  statusNote: string;
  contactName: string;
  contactEmail: string;
  phone?: string;
  keyDeliverables: string[];
  nextMilestone: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  role: string;
}

export interface CocktailRecipe {
  name: string;
  tagline: string;
  costPerGuest: number;
  matchScore: number;
  description: string;
  ingredients: { name: string; perDrink: string; forBatch168: string }[];
  instructions: string;
}

export interface CreativeDeck {
  cocktail: CocktailRecipe;
  paletteName: string;
  paletteId: string;
  swatches: ColorSwatch[];
  paletteUsageNotes: string;
  soundtrackVibe: string;
}

export interface EventData {
  id: string;
  type: 'wedding' | 'birthday' | 'community' | 'gala';
  name: string;
  shortName: string;
  dateStr: string;
  daysRemaining: number;
  location: string;
  venueName: string;
  partnerOrHost: string;
  guestCount: number;
  guestCapacity: number;
  summary: string;
  readinessScore: number;
  verifiedMilestones: number;
  totalMilestones: number;
  totalBudget: number;
  committedBudget: number;
  safeHarborCushion: number;
  aiDetectedGains: number;
  categories: BudgetCategory[];
  items: BudgetItem[];
  anomaly?: {
    category: string;
    overage: number;
    percentage: number;
    donorCategory: string;
    donorSurplus: number;
    description: string;
  };
  milestones: Milestone[];
  vendors: VendorPartner[];
  creativeVault: CreativeDeck;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  draft?: {
    subject: string;
    body: string;
    version?: string;
    savings?: number;
  };
  actionCard?: {
    type: 'rebalance' | 'milestone' | 'audit';
    title: string;
    details: string;
    buttonLabel: string;
    data?: Record<string, unknown>;
  };
}

export interface GeneratedPlanCategory {
  category: string;
  amount: number;
  percentage: number;
  tip?: string;
}

export interface GeneratedPlanMilestone {
  title: string;
  daysBefore?: number;
  priority?: 'High' | 'Medium' | 'Low';
  dependency?: string;
}

export interface GeneratedPlanVendor {
  name: string;
  category: string;
  estimatedCost: number;
  status?: string;
  action?: string;
}

export interface GeneratedEventPlan {
  name: string;
  summary: string;
  budgetBreakdown: GeneratedPlanCategory[];
  milestones: GeneratedPlanMilestone[];
  vendors: GeneratedPlanVendor[];
  creativeVault?: {
    cocktail?: {
      name: string;
      description: string;
      costPerGuest: number;
    };
    palette?: { name: string; hex: string }[];
  };
}

