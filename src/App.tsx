import React, { useState, useEffect } from 'react';
import { INITIAL_EVENTS } from './data/mockEvents';
import { EventData, BudgetItem, Milestone, VendorPartner } from './types';
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

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rebalance state tracking per event
  const [rebalancedEvents, setRebalancedEvents] = useState<Record<string, boolean>>({});
  const [dismissedAnomalies, setDismissedAnomalies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
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

  const currentEvent = events.find((e) => e.id === currentEventId) || events[0];
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

  // Draft negotiation in Copilot
  const handleDraftNegotiationInCopilot = (vendorName: string, promptText: string) => {
    setIsCopilotOpen(true);
    setCopilotInitialPrompt(promptText);
    triggerToast(`Drafting outreach message to ${vendorName} in Copilot...`);
  };

  // Search Action Dispatcher
  const handleSearchAction = (actionType: string, payload?: any) => {
    if (actionType === 'log-expense') setIsLogExpenseOpen(true);
    else if (actionType === 'add-milestone') setIsAddMilestoneOpen(true);
    else if (actionType === 'audit-contracts') setIsContractAuditOpen(true);
    else if (actionType === 'full-ledger') setIsFullLedgerOpen(true);
    else if (actionType === 'vendor-detail' && payload) setSelectedVendor(payload);
    else if (actionType === 'ask-copilot' && payload) {
      setIsCopilotOpen(true);
      setCopilotInitialPrompt(payload);
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-[#f9f9fb] dark:bg-[#121316] text-neutral-800 dark:text-neutral-100 font-sans antialiased transition-colors duration-300">
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
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-all duration-300">
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
  );
}
