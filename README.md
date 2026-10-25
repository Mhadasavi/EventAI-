# CelebrateAI — Unified Master Command Dashboard
> **Hackathon Submission: GenAI-Powered Event Planning Assistant**  
> *Empathetic, hyper-organized, and intelligent decision-making for weddings, milestone birthdays, and community gatherings.*

---

## 1. Chosen Vertical

### **Primary Vertical: Bespoke Milestone Weddings & Nuptials**
- **Hero Case Study:** *Elena & Marcus Autumn Vineyard Nuptials* (Napa Valley, CA — 168 Confirmed Guests, $45,000 Budget Cap).
- **Cross-Vertical Architectural Support:** CelebrateAI includes built-in multi-event capability with instant workspace switching and dynamic GenAI generation for:
  - **Milestone Birthdays:** *Julian's Mid-Century Havana Nights 40th* (Miami, FL — 65 Guests, $18,500 Budget).
  - **Civic & Community Gatherings:** *Oakwood Harvest Community Festival & Charity Gala* (Portland, OR — 320 Attendees, $60,000 Budget).
  - **Custom GenAI Blueprinting:** Users can generate tailored blueprints for any event type on demand.

### **Target Persona & User Need**
Couples and celebration hosts often face high cognitive load, emotional stress, opaque vendor markups, hidden corkage fees, and conflicting logistical timelines. CelebrateAI serves as an empathetic concierge that replaces disconnected spreadsheets with an autonomous master command center.

---

## 2. Approach & Strategic Logic

CelebrateAI combines **data-backed fiscal discipline** with **concierge-grade editorial elegance**:

### **A. Reverse-Engineered Milestone Timeline**
- Rather than static to-do lists, milestones are calculated backward from the event date (T-minus days) and prioritized into **Critical Path (High Priority)**, **Operational (Medium Priority)**, and **Locked Dependencies**.
- **Automated Prerequisite Blocker (Rule DEP-882):** Tasks with hard dependencies (such as *Print Escort Cards & Seating Charts*) remain locked until their prerequisite (*Finalize RSVP Headcount*) reaches closure. This eliminates costly reprint wastage caused by last-minute cancellations.

### **B. Capital Pacing & Safe Harbor Reserve**
- The financial engine maintains an untouchable **Safe Harbor Cushion** (10–15% of the total budget).
- When line-item creep occurs (e.g., upgraded florals exceeding target by $700), the **AI Fiscal Anomaly Engine** identifies uncommitted surplus in other categories (such as stationery) and offers a **1-Click Rebalance** that neutralizes the overage without dipping into the reserve cushion.

### **C. Empathetic, Value-Engineered Vendor Negotiation**
- When budgets are strained, CelebrateAI does not recommend low-quality cuts. Instead, it provides **tactful, value-engineered substitution proposals** (e.g., swapping air-freighted Dutch peonies for locally cultivated Juliet garden roses to trim ~$750 while preserving the identical lush aesthetic).

### **D. Multi-Sensory Creative Vault**
- Celebrations are sensory experiences. CelebrateAI synthesizes cohesive **Creative Vault Decks** featuring:
  - Scaled signature cocktail batch formulas (automatically scaling ingredients by verified guest count).
  - Curated color swatches with copyable hex tokens (#C86D56 Terracotta, #8C6B32 Warm Olive, #F2D8CC Blush Clay, #1D5249 Forest Evergreen).
  - Curated acoustic and jazz vinyl soundscapes.

---

## 3. How the Solution Works

### **Architecture Overview**
CelebrateAI is built as a production-grade full-stack web application:
- **Frontend:** React 19 + TypeScript + Tailwind CSS v4 + Lucide Icons + Motion.
- **Backend Entry Point:** Node.js Express server (`server.ts`) hosting Vite middleware in development and serving static production builds.
- **AI Intelligence:** Powered by Google's `@google/genai` TypeScript SDK using `gemini-3.8-flash`.

```
┌────────────────────────────────────────────────────────┐
│                   CelebrateAI UI                       │
│  (Event Hero • Financial Pulse • Milestones • Radar)   │
└──────────────────────────┬─────────────────────────────┘
                           │ Client-to-Server Fetch
┌──────────────────────────▼─────────────────────────────┐
│             Express Backend (server.ts)                │
│    /api/gemini/chat       • /api/gemini/generate-plan  │
│    /api/gemini/audit-contract                          │
└──────────────────────────┬─────────────────────────────┘
                           │ @google/genai (Server-Only)
┌──────────────────────────▼─────────────────────────────┐
│                 Gemini 3.8-Flash API                   │
│   (Context-Aware Planning, Audits & Negotiation)       │
└────────────────────────────────────────────────────────┘
```

### **Core Interactive Modules**

1. **Master Event Ribbon & Celebration Readiness Engine**
   - Dynamic SVG progress ring tracking verified milestones against completion targets.
   - Live RSVP ratio (`168 / 180`) connected to an interactive **Guest RSVP & Dietary Matrix**.
   - Detected AI Savings pill (`+$2,140`) opening detailed savings attribution.
   - Co-planning presence manager for shared partner collaboration.

2. **Financial Pulse & 1-Click Rebalance**
   - Live tracking of Budget Cap ($45,000), Committed/Settled Capital ($38,420), and Safe Harbor Cushion ($6,580).
   - Multi-segment pacing progress bar showing category allocations.
   - Anomaly banner with **"Rebalance $700 Surplus"** that updates category balances and visual indicators in real time.
   - **Full Ledger Drawer:** Itemized line-item transactions with category filters, payment statuses, and CSV export.

3. **Critical Milestones & Dependency System**
   - Interactive milestone checklist that updates readiness scores upon completion.
   - **View Dependency Graph Modal:** Visual flowchart explaining prerequisite locks and unlock dates.
   - **Quote Comparison Modal:** Multi-vendor quote analysis (e.g. 3 shuttle quotes) with one-click approval and direct milestone completion.

4. **Vendor Radar & Autonomous Contract Audit**
   - Status cards for tier-one event partners (Signed, Review, Deposit Paid).
   - **Vendor Detail Modal:** Deep contract review, payment tranche schedules, and 1-click Copilot drafting.
   - **Contract & Fee Audit Modal:** Proactive AI scanning for hidden corkage fees, weekend dismantling surcharges, and cancellation clauses.

5. **Creative Vault & Batch Scaler**
   - Signature Cocktail Card with scaled bar specs for the exact guest count (bottles of brut, syrup volume, rosemary sprigs).
   - Click-to-copy hex swatches and **Browse All 14** modal detailing linens, ambient lighting, music suites, and culinary pairings.

6. **CelebrateAI Copilot Drawer**
   - Persistent, context-aware conversational planning assistant.
   - Generates actionable negotiation email cards with **"Copy Text"** and **"Send via Gmail"** actions.
   - Suggestion chips for venue notes, headcount drop simulations, rain contingency layouts, and cost-cutting DIY strategies.

7. **Spotlight Search & Ergonomics**
   - Global search (`⌘K` or `Ctrl+K`) across vendors, budget items, milestones, and AI actions.
   - Class-based Light / Dark mode toggle with persistent local storage.

---

## 4. Key Assumptions Made

1. **Safe Harbor Buffer Allocation:**
   - Standard event planning wisdom recommends a 10% to 15% liquid buffer for weather-related contingencies, late overtime charges, and gratuity adjustments. CelebrateAI assumes a baseline 14.7% ($6,580) safe harbor cushion for Napa harvest-season events.

2. **Stationery Dependency Window (Rule DEP-882):**
   - Assumes catering and stationery final locks require an 18-day lead time before the event date to prevent costly reprinting fees or unrecoverable plate commitments.

3. **Vendor Payment Tranches:**
   - Assumes standard industry milestone payment structure: 30–50% initial retainer upon signing, optional 25% tasting/planning installment, and final balance settled on the week of the event.

4. **Security & API Keys:**
   - In accordance with enterprise best practices, the Gemini API key is strictly server-side (`process.env.GEMINI_API_KEY`) and never exposed to the client bundle.
   - If the API key is not configured during offline evaluation, CelebrateAI gracefully falls back to an intelligent context engine, ensuring the app remains 100% interactive and operational without downtime.

---

## 5. Technical Stack & Scripts

| Package | Purpose |
| :--- | :--- |
| `react` & `react-dom` (v19) | Modern component architecture & hooks |
| `express` (v4) | Server-side API endpoints & proxy routes |
| `@google/genai` (v2.4) | Official Gemini SDK (model: `gemini-3.8-flash`) |
| `tailwindcss` (v4) | Styling with custom `@custom-variant dark` support |
| `lucide-react` | Unified iconography across all command modules |
| `tsx` & `vite` | Fast TypeScript execution and development bundling |

### **Available Scripts**
- `npm run dev`: Starts the full-stack server running Express with Vite middleware on port 3000.
- `npm run build`: Builds the production bundle to `dist/`.
- `npm run lint`: Validates TypeScript typing (`tsc --noEmit`).
