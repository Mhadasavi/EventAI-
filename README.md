# CelebrateAI — Unified Master Command Dashboard

> **Enterprise-Grade GenAI-Powered Event Planning & Capital Command System**  
> *Empathetic, hyper-organized, and fiscally disciplined orchestration for bespoke weddings, milestone celebrations, and community galas.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![Gemini 3.8-Flash](https://img.shields.io/badge/Google%20GenAI-gemini--3.8--flash-orange.svg)](https://ai.google.dev/)
[![Tests Passing](https://img.shields.io/badge/Tests-20%2F20%20Passing-brightgreen.svg)]()

---

## 🌐 Live Deployments & Preview Links

- **Shared Applet URL:** [https://ais-pre-mcztp25cvsoekttxsgu2ka-208031861137.asia-east1.run.app](https://ais-pre-mcztp25cvsoekttxsgu2ka-208031861137.asia-east1.run.app)
- **Development Applet URL:** [https://ais-dev-mcztp25cvsoekttxsgu2ka-208031861137.asia-east1.run.app](https://ais-dev-mcztp25cvsoekttxsgu2ka-208031861137.asia-east1.run.app)

---

## 📑 Table of Contents
1. [What is CelebrateAI?](#1-what-is-celebrateai)
2. [Why CelebrateAI? (Core Value Pillars)](#2-why-celebrateai-core-value-pillars)
3. [System Architecture & Security](#3-system-architecture--security)
4. [API Endpoints Specification](#4-api-endpoints-specification)
5. [How-To: Quick Start Guide](#5-how-to-quick-start-guide)
6. [Feature-by-Feature Operational Walkthrough](#6-feature-by-feature-operational-walkthrough)
7. [Key Domain Assumptions & Planning Rules](#7-key-domain-assumptions--planning-rules)
8. [Automated Test Suite Breakdown (20 Tests)](#8-automated-test-suite-breakdown-20-tests)
9. [Production Deployment & Environment Setup](#9-production-deployment--environment-setup)

---

## 1. What is CelebrateAI?

### **The Problem**
Event hosts, couples, and celebration organizers carry immense cognitive load. They juggle fragmented spreadsheets, disjointed chat threads, opaque vendor contracts with hidden fees (e.g. $4.50/bottle corkage, weekend strike surcharges), uncoordinated milestone deadlines, and unpredictable budget creep. Most planning apps are either glorified static checklists or simple balance calculators that provide zero strategic or empathetic guidance.

### **The Solution**
**CelebrateAI** is a full-stack, autonomous master command center. It unifies high-touch editorial design with data-backed fiscal rigor and generative intelligence:
- **Autonomous Budget Pacing:** Continuously guards a dedicated Safe Harbor capital cushion (10–15%) and detects line-item creep with 1-click surplus rebalancing.
- **Reverse-Engineered Milestone Execution:** Milestones are calculated backward from the event date (T-minus countdown) and locked with prerequisite dependency rules (e.g., Rule DEP-882 locks stationery printing until RSVPs lock).
- **Vendor Contract Audit & Value-Engineered Negotiation:** Automatically audits contracts for hidden liability clauses and drafts polite, value-engineered substitution requests.
- **Sensory Creative Vault:** Algorithmic cocktail batch scaling (by exact guest headcount), curated seasonal palettes with click-to-copy hex tokens, and ambient soundscapes.
- **Multi-Event Workspace Switching:** Instant, zero-friction toggle between distinct events (Weddings, 40th Milestone Birthdays, Charity Community Galas) plus on-demand GenAI blueprint creation.

---

## 2. Why CelebrateAI? (Core Value Pillars)

| Feature Pillar | The Traditional Way | The CelebrateAI Way |
| :--- | :--- | :--- |
| **Budget Control** | Spreadsheet formulas break; overages cause panic or debt. | **Safe Harbor Buffer** + **1-Click AI Surplus Rebalance** without depleting reserves. |
| **Milestone Planning** | Static to-do list; tasks are done out of order, causing reprint waste. | **Reverse-Engineered Critical Path** with **Dependency Locks (Rule DEP-882)**. |
| **Vendor Contracts** | Fine print is skipped; hidden fees and cancellation traps surprise hosts. | **Autonomous Contract & Fee Scanner** surfaces hidden clauses and draft negotiations. |
| **Vendor Negotiations** | Aggressive bargaining damages relationships or lowers quality. | **Empathetic Value Engineering** proposes creative substitutions (e.g., garden roses for peonies). |
| **Bar & Logistics Scaling** | Guesswork leads to costly liquor overstock or mid-party shortages. | **Algorithmic Batch Scaler** converts guest count directly into ounces, bottles, and garnishes. |
| **Multi-Event Workspaces** | Siloed folders or separate logins for different celebrations. | **Unified Master Switcher** supporting multi-vertical celebrations and GenAI blueprinting. |

---

## 3. System Architecture & Security

CelebrateAI follows a resilient full-stack architecture that keeps secrets completely isolated from the client bundle.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Client: React 19 SPA                           │
│  • EventHero & Readiness Ring   • FinancialPulse & 1-Click Rebalance   │
│  • Milestone Dependency Graph   • Vendor Radar & Contract Audit        │
│  • Creative Vault & Batch Scaler • CelebrateAI Copilot Drawer          │
│  • Global Spotlight Search (⌘K) • Dark/Light Mode Engine              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON (Client Proxy)
┌───────────────────────────────────▼────────────────────────────────────┐
│                    Express Full-Stack Server (server.ts)               │
│  • Port 3000 iFrame Compatible    • Security & Anti-Sniffing Headers   │
│  • Input Sanitation (3,000 char)  • Gzip / Brotli Compression          │
│  • Resilient Gemini AI Controller • Context-Aware Heuristic Fallback   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ @google/genai SDK (Server-Side Only)
┌───────────────────────────────────▼────────────────────────────────────┐
│                  Google Gemini 3.8-Flash Endpoint                      │
│      Strict Budget Math • Empathetic Tone • Zero Hallucination         │
└────────────────────────────────────────────────────────────────────────┘
```

### **Security Hardening**
1. **Zero Client-Side API Key Exposure:** The Google Gemini API key (`process.env.GEMINI_API_KEY`) is read exclusively by `server.ts`. No keys are bundled into Vite client assets.
2. **HTTP Security Response Headers:**
   - `X-Content-Type-Options: nosniff`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - Frame authorization configured to enable seamless AI Studio container embedding.
3. **Payload Sanitization:** Rejects payload injections, strips illegal tags, and caps input prompt lengths at 3,000 characters to prevent prompt injection or buffer bloat.
4. **Self-Healing Fallback Engine:** If an API key is unconfigured, rate-limited, or network drops, the backend automatically transitions to a localized semantic rules engine. The user interface remains 100% operational with zero broken states.

---

## 4. API Endpoints Specification

### 1. `POST /api/gemini/chat`
Conversational endpoint powering the persistent Copilot Drawer.
- **Request Body:**
  ```json
  {
    "message": "Draft a contract review for Wild Thyme Catering regarding dietary options.",
    "context": {
      "eventName": "Elena & Marcus Autumn Vineyard Nuptials",
      "budget": 45000,
      "guestCount": 168
    }
  }
  ```
- **Response:**
  ```json
  {
    "reply": "Subject: Contract Review & Plated Tasting Adjustments...\n\nHi Chef Julian...",
    "source": "gemini-3.8-flash"
  }
  ```

### 2. `POST /api/gemini/generate-plan`
Generates a complete, tailored event blueprint from a high-level natural language prompt.
- **Request Body:**
  ```json
  {
    "prompt": "40th Birthday Cocktail Soiree for Julian in Miami with 65 guests and $18,500 budget",
    "eventType": "birthday"
  }
  ```
- **Response:** Complete `EventData` object with reversed milestones, itemized budget tranches, vendor radar cards, and scaled cocktail recipes.

### 3. `POST /api/gemini/audit-contract`
Audits vendor contracts, detecting hidden fees, cancellation policies, and savings opportunities.
- **Request Body:**
  ```json
  {
    "vendorName": "Meadowood Estate",
    "contractText": "..."
  }
  ```
- **Response:**
  ```json
  {
    "flags": ["$4.50/bottle corkage fee detected", "Weekend dismantle surcharge ($850)"],
    "potentialSavings": 1150,
    "suggestedAction": "Request waiver of corkage fee in exchange for purchasing house white wine."
  }
  ```

---

## 5. How-To: Quick Start Guide

### **Prerequisites**
- **Node.js:** `v20.x` or higher
- **Package Manager:** `npm` (v10+)
- **OS:** macOS, Linux, or Windows WSL

### **Installation**
Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd celebrateai
npm install
```

### **Environment Configuration**
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Optional: If omitted, CelebrateAI automatically operates using its built-in heuristic AI engine
GEMINI_API_KEY="your-gemini-api-key-here"

# Application host URL (defaults to http://localhost:3000)
APP_URL="http://localhost:3000"
```

### **Running in Development**
Start the full-stack development server (Express + Vite on Port 3000):
```bash
npm run dev
```
Open your browser to `http://localhost:3000`.

### **Running the Test Battery**
Run the native Node test runner across all 20 automated test suites:
```bash
npm test
```

### **Typechecking & Linting**
Validate strict TypeScript compilation:
```bash
npm run lint
```

### **Compiling for Production**
Build the optimized client bundle and verify deployment readiness:
```bash
npm run build
npm start
```

---

## 6. Feature-by-Feature Operational Walkthrough

### **A. Switching Event Workspaces**
1. Click the **Event Workspace Badge** in the top navigation bar (e.g. *Elena & Marcus Vineyard Nuptials*).
2. The dropdown opens showing all active events with vertical badges (`wedding`, `birthday`, `community`), full dates, guest counts, and location previews.
3. Select any event (e.g. *Julian's Mid-Century Havana Nights 40th* or *Oakwood Harvest Community Festival*).
4. The entire application (Hero banner, countdown timer, budget pacing, milestone checklist, vendor radar, and Copilot context) updates instantaneously.

### **B. Creating a New Event with GenAI**
1. Open the Event Selector dropdown and click **"+ Create New Event with GenAI"** (or use `⌘K` -> Create New Event).
2. Enter the celebration name, select the vertical (Wedding, Birthday, Gala, Corporate, Custom), set target guest count and budget cap.
3. Click **"Generate Master Blueprint"**.
4. CelebrateAI synthesizes reverse-engineered milestones, proportional budget tranches, vendor radar cards, and signature cocktail specs into a new interactive workspace.

### **C. Resolving Budget Creep via 1-Click Rebalance**
1. Navigate to the **Financial Pulse** card.
2. When a category overage occurs (e.g., Sonoma Bloom's upgraded floral arbor exceeding target by $700), the amber **AI Fiscal Anomaly Detected** banner appears.
3. The engine highlights uncommitted surplus in another category (e.g. $1,300 in Printed Stationery).
4. Click **"Rebalance $700 Surplus"**.
5. $700 is instantly reallocated from Stationery to Floral & Decor in real-time, the anomaly is resolved, and the full $6,580 Safe Harbor Cushion remains untouched.

### **D. Milestone Prerequisite Locks (Rule DEP-882)**
1. Inspect the **Milestones Section**.
2. Notice the milestone *"Print Escort Cards & Finalize Place Settings"* is marked with a red **Blocked** badge.
3. Click the info icon or **"View Dependency Graph"** to inspect the dependency flowchart:
   - This task is hard-locked until *"Finalize RSVP Headcount & Dietary Tally"* is verified.
   - Prevents unrecoverable printing waste ($480+) from late guest RSVP drops.

### **E. Approving Vendor Quotes**
1. On the milestone *"Book Guest Shuttles & St. Helena Charter Vans"*, click **"Review Quotes (3 Available)"**.
2. The **Quote Comparison Modal** appears, comparing Napa Valley Sprinters ($1,850), St. Helena Wine Country Charters ($2,100), and Bay Area Luxury Coach ($2,450).
3. Click **"Approve & Confirm Quote"** on the recommended vendor.
4. The contract is committed, the milestone is marked Completed, and the Celebration Readiness ring advances.

### **F. Algorithmic Cocktail Batch Scaler**
1. In the **Creative Vault**, view the Signature Cocktail Card (*Smoked Honey & Thyme French 75*).
2. Click **"Scale Recipe for Batching"**.
3. The modal calculates proportional requirements for the exact confirmed guest count (168 guests):
   - 28 bottles of Brut Champagne
   - 10.5 bottles of Botanical Gin
   - 126 oz of Fresh Meyer Lemon Juice
   - 84 oz of Smoked Thyme Honey Syrup
   - 168 torched fresh thyme sprigs
4. Adjust the guest count slider to observe instantaneous real-time recalculation.

### **G. Spotlight Search (⌘K / Ctrl+K)**
1. Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) or click the search bar in the header.
2. Quickly query vendors, line items, payment milestones, or trigger AI actions with keyboard navigation.

---

## 7. Key Domain Assumptions & Planning Rules

1. **Safe Harbor Buffer Allocation (10–15%):**
   - Standard event planning wisdom mandates a minimum 10% to 15% liquid buffer for weather-related contingencies, late overtime charges, and gratuity adjustments. CelebrateAI assumes a baseline 14.7% ($6,580) cushion for Napa harvest-season events.
2. **Stationery Dependency Lead-Time (Rule DEP-882):**
   - Assumes catering and stationery final locks require an 18-day lead time before the event date to prevent costly reprinting fees or unrecoverable plate commitments.
3. **Vendor Payment Tranche Standard:**
   - Structured on industry norms: 30–50% initial retainer upon contract signing, optional 25% tasting/planning installment, and final balance settled the week of the event.
4. **Resilient AI Execution:**
   - The application does not hard-fail if external API quotas are exhausted or internet connectivity is intermittent. The built-in heuristic engine ensures continuous 100% uptime for event managers in field environments.

---

## 8. Automated Test Suite Breakdown (20 Tests)

Run `npm test` to execute all 20 test specifications:

```
TAP version 13
# Subtest: validates payload sanitation and budget integrity logic (ok 1)
# Subtest: validates minimum and maximum guest constraints (ok 2)
# Subtest: validates budget distribution percentages total exactly 100% (ok 3)
# Subtest: validates message length rejection for inputs exceeding 3000 characters (ok 4)
# Subtest: validates contract audit findings structure and savings calculation (ok 5)
# Subtest: validates RSVP guest matrix calculations match capacity limits (ok 6)
# Subtest: rebalanceBudget successfully reallocates surplus without altering total cap (ok 7)
# Subtest: calculatePacing accurately computes percentages and safe harbor cushion (ok 8)
# Subtest: scaleCocktailBatch scales ingredients proportionally by guest count (ok 9)
# Subtest: checkMilestoneDependencies tracks verification and readiness percentage (ok 10)
# Subtest: calculatePacing handles over-budget state and zero total budget safely (ok 11)
# Subtest: rebalanceBudget handles zero transfer and non-matching category gracefully (ok 12)
# Subtest: checkMilestoneDependencies handles empty array and 100% completion cleanly (ok 13)
# Subtest: validates initial events cover Wedding, Birthday, and Community Gala verticals (ok 14)
# Subtest: verifies each event has a valid non-empty budget, vendor radar, and creative vault (ok 15)
# Subtest: verifies Rule DEP-882 dependency lock exists in default wedding event (ok 16)
# Subtest: verifies event ID uniqueness and workspace switching lookup integrity (ok 17)
# Subtest: validates security response headers configuration (ok 18)
# Subtest: validates prevention of malicious script injection in user prompt sanitization (ok 19)
# Subtest: validates server-side API key isolation without client leaking (ok 20)
1..20
# tests 20
# pass 20
# fail 0
```

---

## 9. Production Deployment & Environment Setup

- **Production Port:** Configured on port `3000` for container execution.
- **Build Output:** Static client files compile to `/dist`, served directly by Express with gzip compression enabled.
- **Entrypoint:** `node server.ts` (configured under `"start"` in `package.json`).
- **Dev Server:** `"dev": "tsx server.ts"` with Vite dev middleware for seamless development without hot-reload conflicts.

---

*CelebrateAI Studio Master • Crafted for unforgettable, fiscally sound celebrations.*
