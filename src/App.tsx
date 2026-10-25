import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { INITIAL_EVENTS } from './data/mockEvents';
import { EventData, BudgetItem, Milestone, VendorPartner, QuoteOption } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { EventHero } from './components/EventHero';
import { FinancialPulse } from './components/FinancialPulse';
import { MilestonesSection } from './components/MilestonesSection';
import { VendorRadar } from './components/VendorRadar';
import { CreativeVault } from './components/CreativeVault';
import { CopilotDrawer } from './components/CopilotDrawer';

// Modals
import { LogExpenseModal } from './components/modals/LogExpenseModal';
import { AddMilestoneModal } from './components/modals/AddMilestoneModal';
import { FullLedgerModal } from './components/modals/FullLedgerModal';
import { ContractAuditModal } from './components/modals/ContractAuditModal';
import { VendorDetailModal } from './components/modals/VendorDetailModal';
import { CocktailBatchModal } from './components/modals/CocktailBatchModal';
import { NewEventModal } from './components/modals/NewEventModal';
import { SearchModal } from './components/modals/SearchModal';
import { RsvpManagerModal } from './components/modals/RsvpManagerModal';
import { AiSavingsModal } from './components/modals/AiSavingsModal';
import { DependencyGraphModal } from './components/modals/DependencyGraphModal';
import { QuoteComparisonModal } from './components/modals/QuoteComparisonModal';
import { CreativeVaultModal } from './components/modals/CreativeVaultModal';
import { CoPlannerModal } from './components/modals/CoPlannerModal';

export default function App() {
  const [events, setEvents] = useState<EventData[]>(INITIAL_EVENTS);
  const [currentEventId, setCurrentEventId] = useState<string>(INITIAL_EVENTS[0].id);

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Copilot Drawer
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>(undefined);

  // Modals state
  const [isLogExpenseOpen, setIsLogExpenseOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isFullLedgerOpen, setIsFullLedgerOpen] = useState(false);
  const [isContractAuditOpen, setIsContractAuditOpen] = useState(false);
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<VendorPartner | null>(null);
  const [isCocktailModalOpen, setIsCocktailModalOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isAiSavingsOpen, setIsAiSavingsOpen] = useState(false);
  const [isDependencyGraphOpen, setIsDependencyGraphOpen] = useState(false);
  const [isQuoteComparisonOpen, setIsQuoteComparisonOpen] = useState(false);
  const [isCreativeVaultOpen, setIsCreativeVaultOpen] = useState(false);
  const [isCoPlannerOpen, setIsCoPlannerOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rebalance state tracking per event
  const [rebalancedEvents, setRebalancedEvents] = useState<Record<string, boolean>>({});
  const [dismissedAnomalies, setDismissedAnomalies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Global ⌘K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  };

  const currentEvent = useMemo(
    () => events.find((e) => e.id === currentEventId) || events[0],
    [events, currentEventId]
  );
  const isCurrentRebalanced = !!rebalancedEvents[currentEvent.id];
  const isCurrentAnomalyDismissed = !!dismissedAnomalies[currentEvent.id];

  // 1-Click Anomaly Rebalance Action
  const handleApplyRebalance = () => {
    setRebalancedEvents((prev) => ({ ...prev, [currentEvent.id]: true }));

    // Reallocate funds from Stationery to Florals in state
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== currentEvent.id) return evt;
        const updatedCategories = evt.categories.map((cat) => {
          if (cat.name.includes('Decor') || cat.name.includes('Floral')) {
            return { ...cat, allocated: cat.allocated + 700 };
          }
          if (cat.name.includes('Stationery')) {
            return { ...cat, allocated: Math.max(0, cat.allocated - 700) };
          }
          return cat;
        });

        return {
          ...evt,
          categories: updatedCategories,
          aiDetectedGains: evt.aiDetectedGains + 700,
        };
      })
    );

    triggerToast('Rebalance applied: $700 surplus reallocated from Stationery to Floral & Decor.');
  };

  const handleDismissAnomaly = () => {
    setDismissedAnomalies((prev) => ({ ...prev, [currentEvent.id]: true }));
    triggerToast('Anomaly banner dismissed.');
  };

  // Add Expense
  const handleAddExpense = (newItem: BudgetItem) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== currentEvent.id) return evt;
        const newCommitted = evt.committedBudget + newItem.actual;
        const newCushion = Math.max(0, evt.totalBudget - newCommitted);

        // Update categories
        const updatedCats = evt.categories.map((c) => {
          if (c.name === newItem.category) {
            const newAlloc = c.allocated + newItem.actual;
            return { ...c, allocated: newAlloc, percentage: Math.round((newAlloc / evt.totalBudget) * 100) };
          }
          return c;
        });

        return {
          ...evt,
          committedBudget: newCommitted,
          safeHarborCushion: newCushion,
          items: [newItem, ...evt.items],
          categories: updatedCats,
        };
      })
    );

    triggerToast(`Expense logged: $${newItem.actual.toLocaleString()} for ${newItem.name}`);
  };

  // Add Milestone
  const handleAddMilestone = (newMs: Milestone) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== currentEvent.id) return evt;
        return {
          ...evt,
          totalMilestones: evt.totalMilestones + 1,
          milestones: [newMs, ...evt.milestones],
        };
      })
    );
    triggerToast(`Milestone scheduled: "${newMs.title}"`);
  };

  // Toggle Milestone completion
  const handleToggleMilestone = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== currentEvent.id) return evt;
        let change = 0;
        const updatedMs = evt.milestones.map((m) => {
          if (m.id === id) {
            const nextStatus = m.status === 'Completed' ? 'Pending' : 'Completed';
            change = nextStatus === 'Completed' ? 1 : -1;
            return { ...m, status: nextStatus as any };
          }
          return m;
        });

        const newVerified = Math.max(0, evt.verifiedMilestones + change);
        const newScore = Math.min(100, Math.round((newVerified / evt.totalMilestones) * 100));

        return {
          ...evt,
          milestones: updatedMs,
          verifiedMilestones: newVerified,
          readinessScore: newScore,
        };
      })
    );
  };

  // Create New Event
  const handleCreateNewEvent = (newEvent: EventData) => {
    setEvents((prev) => [newEvent, ...prev]);
    setCurrentEventId(newEvent.id);
  };

  // Approve Quote Handler
  const handleApproveQuote = (quote: QuoteOption) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== currentEvent.id) return evt;
        const updatedMs = evt.milestones.map((m) => {
          if (m.title.toLowerCase().includes('shuttle') || m.id === 'ms-1') {
            return {
              ...m,
              status: 'Completed' as const,
              relativeDays: 'Booked & Confirmed • ' + quote.vendorName,
            };
          }
          return m;
        });

        const newVerified = evt.verifiedMilestones + 1;
        const newScore = Math.min(100, Math.round((newVerified / evt.totalMilestones) * 100));

        return {
          ...evt,
          milestones: updatedMs,
          verifiedMilestones: newVerified,
          readinessScore: newScore,
        };
      })
    );
    triggerToast(`Approved & Confirmed: ${quote.vendorName} ($${quote.amount.toLocaleString()})!`);
  };

  // Update Headcount Handler
  const handleUpdateGuests = (newCount: number) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === currentEvent.id ? { ...evt, guestCount: newCount } : evt))
    );
  };

  // Draft negotiation in Copilot
  const handleDraftNegotiationInCopilot = (vendorName: string, promptText: string) => {
    setIsCopilotOpen(true);
    setCopilotInitialPrompt(promptText);
    triggerToast(`Drafting outreach message to ${vendorName} in Copilot...`);
  };

  // Search Action Dispatcher
  const handleSearchAction = (actionType: string, payload?: string | number | Record<string, unknown> | VendorPartner) => {
    if (actionType === 'log-expense') setIsLogExpenseOpen(true);
    else if (actionType === 'add-milestone') setIsAddMilestoneOpen(true);
    else if (actionType === 'audit-contracts') setIsContractAuditOpen(true);
    else if (actionType === 'full-ledger') setIsFullLedgerOpen(true);
    else if (actionType === 'vendor-detail' && payload && typeof payload === 'object') setSelectedVendor(payload as VendorPartner);
    else if (actionType === 'ask-copilot' && typeof payload === 'string') {
      setIsCopilotOpen(true);
      setCopilotInitialPrompt(payload);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-full flex flex-col bg-[#f9f9fb] dark:bg-[#121316] text-neutral-800 dark:text-neutral-100 font-sans antialiased transition-colors duration-300">
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-xl focus:shadow-xl focus:font-semibold text-xs"
        >
          Skip to main content
        </a>

        {/* Top Global Navigation Bar */}
        <Header
          events={events}
          currentEvent={currentEvent}
          onSelectEvent={(e) => {
            setCurrentEventId(e.id);
            triggerToast(`Switched workspace to ${e.shortName}`);
          }}
          onOpenNewEventModal={() => setIsNewEventOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
          onToggleCopilot={() => setIsCopilotOpen((prev) => !prev)}
          isCopilotOpen={isCopilotOpen}
        />

        {/* Master Workspace Container */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Main Scrollable Content */}
          <main
            id="main-content"
            tabIndex={-1}
            aria-label="Event Planning Workspace"
            className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-all duration-300 focus:outline-none"
          >
          <div className="max-w-[1720px] mx-auto space-y-6">
            {/* 1. Hero Banner & Quick Actions Ribbon */}
            <EventHero
              event={currentEvent}
              onLogExpense={() => setIsLogExpenseOpen(true)}
              onAddMilestone={() => setIsAddMilestoneOpen(true)}
              onDraftVendorMessage={() => {
                setIsCopilotOpen(true);
                setCopilotInitialPrompt(
                  `Draft a formal contract review request to Wild Thyme Catering regarding the 5-course tasting menu.`
                );
              }}
              onAuditContracts={() => setIsContractAuditOpen(true)}
              onOpenRsvp={() => setIsRsvpOpen(true)}
              onOpenSavings={() => setIsAiSavingsOpen(true)}
              onOpenCoPlanner={() => setIsCoPlannerOpen(true)}
              onToast={triggerToast}
            />

            {/* 2-Column Operational Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Operational Command (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <FinancialPulse
                  event={currentEvent}
                  onOpenLedger={() => setIsFullLedgerOpen(true)}
                  onApplyRebalance={handleApplyRebalance}
                  isRebalanced={isCurrentRebalanced}
                  onDismissAnomaly={handleDismissAnomaly}
                  isAnomalyDismissed={isCurrentAnomalyDismissed}
                />

                <MilestonesSection
                  milestones={currentEvent.milestones}
                  onToggleMilestone={handleToggleMilestone}
                  onViewDependency={() => setIsDependencyGraphOpen(true)}
                  onViewQuotes={() => setIsQuoteComparisonOpen(true)}
                  onApproveQuotes={() => setIsQuoteComparisonOpen(true)}
                  onToast={triggerToast}
                  onOpenCopilot={(prompt) => {
                    setIsCopilotOpen(true);
                    setCopilotInitialPrompt(prompt);
                  }}
                />
              </div>

              {/* Right Column: Intelligence & Curation (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <VendorRadar
                  vendors={currentEvent.vendors}
                  onSelectVendor={(v) => setSelectedVendor(v)}
                />

                <CreativeVault
                  creativeVault={currentEvent.creativeVault}
                  onOpenBatchModal={() => setIsCocktailModalOpen(true)}
                  onOpenVaultModal={() => setIsCreativeVaultOpen(true)}
                  onToast={triggerToast}
                />
              </div>
            </div>
          </div>
        </main>

        {/* Persistent Copilot Drawer */}
        <CopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          event={currentEvent}
          onToast={triggerToast}
          initialPrompt={copilotInitialPrompt}
          onClearInitialPrompt={() => setCopilotInitialPrompt(undefined)}
        />
      </div>

      {/* Modals */}
      <LogExpenseModal
        isOpen={isLogExpenseOpen}
        onClose={() => setIsLogExpenseOpen(false)}
        categories={currentEvent.categories}
        onAddExpense={handleAddExpense}
      />

      <AddMilestoneModal
        isOpen={isAddMilestoneOpen}
        onClose={() => setIsAddMilestoneOpen(false)}
        onAddMilestone={handleAddMilestone}
      />

      <FullLedgerModal
        isOpen={isFullLedgerOpen}
        onClose={() => setIsFullLedgerOpen(false)}
        items={currentEvent.items}
        totalBudget={currentEvent.totalBudget}
        committedBudget={currentEvent.committedBudget}
        safeHarborCushion={currentEvent.safeHarborCushion}
        categories={currentEvent.categories}
      />

      <ContractAuditModal
        isOpen={isContractAuditOpen}
        onClose={() => setIsContractAuditOpen(false)}
        vendors={currentEvent.vendors}
        onDraftNegotiation={handleDraftNegotiationInCopilot}
      />

      <VendorDetailModal
        vendor={selectedVendor}
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        onDraftMessage={handleDraftNegotiationInCopilot}
      />

      <CocktailBatchModal
        cocktail={currentEvent.creativeVault.cocktail}
        guestCount={currentEvent.guestCount}
        isOpen={isCocktailModalOpen}
        onClose={() => setIsCocktailModalOpen(false)}
        onToast={triggerToast}
      />

      <NewEventModal
        isOpen={isNewEventOpen}
        onClose={() => setIsNewEventOpen(false)}
        onCreateEvent={handleCreateNewEvent}
        onToast={triggerToast}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        event={currentEvent}
        onSelectAction={handleSearchAction}
      />

      <RsvpManagerModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        guestCount={currentEvent.guestCount}
        guestCapacity={currentEvent.guestCapacity}
        onUpdateGuests={handleUpdateGuests}
        onToast={triggerToast}
      />

      <AiSavingsModal
        isOpen={isAiSavingsOpen}
        onClose={() => setIsAiSavingsOpen(false)}
        totalSavings={currentEvent.aiDetectedGains}
        onOpenCopilot={(prompt) => {
          setIsCopilotOpen(true);
          setCopilotInitialPrompt(prompt);
        }}
      />

      <DependencyGraphModal
        isOpen={isDependencyGraphOpen}
        onClose={() => setIsDependencyGraphOpen(false)}
        onToast={triggerToast}
      />

      <QuoteComparisonModal
        isOpen={isQuoteComparisonOpen}
        onClose={() => setIsQuoteComparisonOpen(false)}
        onApproveQuote={handleApproveQuote}
      />

      <CreativeVaultModal
        isOpen={isCreativeVaultOpen}
        onClose={() => setIsCreativeVaultOpen(false)}
        onToast={triggerToast}
        onOpenBatchModal={() => setIsCocktailModalOpen(true)}
      />

      <CoPlannerModal
        isOpen={isCoPlannerOpen}
        onClose={() => setIsCoPlannerOpen(false)}
        partnerOrHost={currentEvent.partnerOrHost}
        onToast={triggerToast}
      />

      {/* Toast Notification Container */}
      <div
        className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ${
          toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      </div>
    </div>
  </ErrorBoundary>
  );
}
