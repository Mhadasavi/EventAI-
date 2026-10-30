export interface CopilotContext {
  name?: string;
  date?: string;
  location?: string;
  guestsConfirmed?: number;
  guestCapacity?: number;
  totalBudget?: number;
  committed?: number;
  cushion?: number;
}

export function generateSmartFallback(message: string, context?: CopilotContext) {
  const lower = message.toLowerCase().trim();
  const eventName = context?.name || 'Elena & Marcus Autumn Vineyard Nuptials';
  const cushion = context?.cushion ? `$${context.cushion.toLocaleString()}` : '$6,580';
  const guests = context?.guestsConfirmed || 168;

  let reply = '';
  let emailDraft: { subject: string; body: string; version?: string; savings?: number } | null = null;

  // Greetings check
  const isGreeting =
    /^(hi|hello|hey|greetings|howdy|good\s*(morning|afternoon|evening)|yo)\b/i.test(lower) ||
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey';

  if (isGreeting) {
    reply = `Hello Elena & Marcus! 👋 EventAI Copilot is online and synchronized with your ${eventName}.

Live Event Snapshot:
• 📅 October 18, 2025 • Meadowood Estate, Napa Valley (142 days out)
• 👥 Headcount: ${guests} confirmed of ${context?.guestCapacity || 180} capacity
• 💰 Budget: $45,000 cap ($38,420 committed • ${cushion} safe harbor cushion)
• 🌸 Key Vendor: Sonoma Bloom (imported peony review pending)

How can I assist you right now?
1. ✍️ Draft vendor negotiation correspondence (e.g. Sonoma Bloom peony substitution)
2. 📊 Run RSVP headcount variance scenarios (e.g. dropping to 150 guests)
3. ☔ Napa weather contingency & soft-hold tent specs
4. 💡 3 High-impact DIY cost-cutting alternatives (-$1,500)`;
  } else if (lower.includes('peonies') || lower.includes('sonoma') || lower.includes('floral') || lower.includes('rose') || lower.includes('flower')) {
    reply = `Here is a tailored negotiation draft for Sonoma Bloom that trims ~$750 by substituting greenhouse David Austin garden roses and blush ranunculus while keeping the full lush aesthetic:`;
    emailDraft = {
      subject: 'Nuptials (Oct 18) — Floral Adjustments & Seasonal Blooms',
      version: 'Draft v2',
      body: 'Hi Camille & Sonoma Bloom team,\n\nMarcus and I adore your vision deck and the autumnal color palette! As we finalize line allocations, we noticed imported peony surcharges. Could we substitute locally grown Juliet garden roses and blush ranunculus to maintain our target threshold while preserving the romantic vineyard vibe?\n\nWarm regards,\nElena & Marcus',
      savings: 750,
    };
  } else if (lower.includes('venue') || lower.includes('meadowood') || lower.includes('load-in') || lower.includes('power')) {
    reply = `Here is a polished coordination note for Meadowood Estate confirming load-in schedule and power requirements for the acoustic quartet:`;
    emailDraft = {
      subject: 'Meadowood Nuptials (Oct 18) — Vendor Load-In & Power Specs',
      version: 'Draft v1',
      body: 'Dear Meadowood Events Team,\n\nThank you for the updated estate timeline. Could you confirm 8:00 AM arbor access on the lower lawn and confirm dedicated 20A circuit availability near the olive grove for our acoustic quartet?\n\nBest,\nElena & Marcus',
    };
  } else if (lower.includes('headcount') || lower.includes('150') || lower.includes('rsvp') || lower.includes('guest')) {
    reply = `📊 Headcount Impact Analysis for 150 guests (vs ${guests} current):\n• Catering & Bar: Estimated reduction of $2,340 ($130/plate + bar package).\n• Table Rentals & Linens: 2 fewer tables saved (~$380).\n• Stationery & Escort Cards: Minimal decrease (~$65).\nTotal Capital Unlocked: ~$2,785, which automatically reallocates to your Safe Harbor Cushion (boosting it to ~$9,365)!`;
  } else if (lower.includes('rain') || lower.includes('weather') || lower.includes('contingency') || lower.includes('tent')) {
    reply = `☔ Napa Autumn Rain Contingency Blueprint:\n1. Meadowood Pavilion Tent: Reserve 72-hour soft-hold on clear-top frame tent with bistro strand lighting.\n2. Covered Colonnade Ceremony: Seamless backup to transition 170 guests into the historic stone loggia without guest disruption.\n3. Umbrella Station: 50 matching terracotta/cream windproof umbrellas for guest arrivals.\nAI Cost Impact: Estimated $850 soft-hold deposit covered by current ${cushion} buffer.`;
  } else if (lower.includes('diy') || lower.includes('save') || lower.includes('cut') || lower.includes('alternative') || lower.includes('1500') || lower.includes('1,500') || lower.includes('budget')) {
    reply = `💡 3 High-Impact Cost-Cutting DIY Alternatives (-$1,500 Total Savings):\n1. Repurposed Ceremony Arbors to Reception Stage (-$600): Have venue staff shift the floral arch behind the sweetheart table during cocktail hour.\n2. Curated Signature Cocktail Duo (-$550): Feature 2 bespoke crafted drinks (Golden Orchard Spritz + Rosemary Paloma) instead of a full top-shelf open liquor bar.\n3. Digital RSVP Calligraphy (-$350): Use digital seating charts with wax-sealed escort boards rather than individual engraved cards.`;
  } else if (lower.includes('shuttle') || lower.includes('transport') || lower.includes('bus')) {
    reply = `🚌 Napa Valley Wine Country Shuttle Logistics:\n• Route: Downtown St. Helena hotels ↔ Meadowood Estate.\n• Staggered Departure: 3:15 PM & 3:45 PM arrivals; 10:15 PM & 11:00 PM return runs.\n• Budget Quote: Calistoga Charter ($1,450) vs Napa Valley Sprinters ($1,200). We recommend Napa Valley Sprinters for a $250 net savings.`;
    emailDraft = {
      subject: 'Elena & Marcus Nuptials (Oct 18) — Shuttle Confirmation & Timeline',
      version: 'Draft v1',
      body: 'Hi Napa Valley Sprinters Team,\n\nWe would like to lock in the 2-sprinter package for our Oct 18 wedding at Meadowood Estate. Please confirm the driver contact and staging zone on St. Helena Highway by next Monday.\n\nThank you,\nElena & Marcus',
    };
  } else if (lower.includes('tasting') || lower.includes('catering') || lower.includes('wild thyme') || lower.includes('food') || lower.includes('menu')) {
    reply = `🍽️ Wild Thyme Culinary Tasting Blueprint:\n• Scheduled: July 12 at St. Helena Kitchen\n• Key Tasting Targets: Braised short ribs with heirloom polenta, pan-seared sea bass, and vegan roasted butternut agnolotti.\n• Contract Clause Guard: Wild Thyme offers a flexible 14-day headcount guarantee window—ensure final count is delivered by Oct 4 to avoid overage fees.`;
  } else {
    reply = `I've analyzed "${message}" within your ${eventName} parameters. With 142 days remaining and ${cushion} in your safe harbor cushion, this fits comfortably within your execution schedule. Would you like me to draft a vendor email, calculate financial impacts, or adjust a milestone dependency?`;
  }

  return { reply, draft: emailDraft };
}
