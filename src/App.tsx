import { useState, useEffect } from 'react';
import { VendorPartner } from './types';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { EventHero } from './components/EventHero';
import { FinancialPulse } from './components/FinancialPulse';
import { MilestonesSection } from './components/MilestonesSection';
import { VendorRadar } from './components/VendorRadar';
import { CreativeVault } from './components/CreativeVault';
import { CopilotDrawer } from './components/CopilotDrawer';
import { ModalManager } from './components/ModalManager';
import { useDarkMode } from './hooks/useDarkMode';
import { useToast } from './hooks/useToast';
import { useEventManager } from './hooks/useEventManager';

export type ActiveModal =
  | 'expense'
  | 'milestone'
  | 'ledger'
  | 'newEvent'
  | 'contractAudit'
  | 'vendorDetail'
  | 'cocktail'
  | 'search'
  | 'rsvp'
  | 'aiSavings'
  | 'dependencyGraph'
  | 'quoteComparison'
  | 'creativeVault'
  | 'coPlanner'
  | null;

export default function App() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { toastMessage, triggerToast } = useToast();
  const eventManager = useEventManager(triggerToast);

  // Copilot Drawer
  const [isCopilotOpen, setIsCopilotOpen] = useState(true);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>(undefined);

  // Unified Modal Manager
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorPartner | null>(null);

  // Global ⌘K shortcut listener & Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveModal((prev) => (prev === 'search' ? null : 'search'));
      } else if (e.key === 'Escape' && activeModal !== null) {
        e.preventDefault();
        setActiveModal(null);
        setSelectedVendor(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  const handleDraftNegotiationInCopilot = (vendorName: string, promptText: string) => {
    setIsCopilotOpen(true);
    setCopilotInitialPrompt(promptText);
    triggerToast(`Drafting outreach message to ${vendorName} in Copilot...`);
  };

  const handleSearchAction = (
    actionType: string,
    payload?: string | number | Record<string, unknown> | VendorPartner
  ) => {
    if (actionType === 'log-expense') setActiveModal('expense');
    else if (actionType === 'add-milestone') setActiveModal('milestone');
    else if (actionType === 'audit-contracts') setActiveModal('contractAudit');
    else if (actionType === 'full-ledger') setActiveModal('ledger');
    else if (actionType === 'vendor-detail' && payload && typeof payload === 'object') {
      setSelectedVendor(payload as VendorPartner);
      setActiveModal('vendorDetail');
    } else if (actionType === 'ask-copilot' && typeof payload === 'string') {
      setIsCopilotOpen(true);
      setCopilotInitialPrompt(payload);
    }
  };

  const { currentEvent } = eventManager;

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
          events={eventManager.events}
          currentEvent={currentEvent}
          onSelectEvent={(e) => {
            eventManager.setCurrentEventId(e.id);
            triggerToast(`Switched workspace to ${e.shortName}`);
          }}
          onOpenNewEventModal={() => setActiveModal('newEvent')}
          onOpenSearch={() => setActiveModal('search')}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
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
                onLogExpense={() => setActiveModal('expense')}
                onAddMilestone={() => setActiveModal('milestone')}
                onDraftVendorMessage={() => {
                  setIsCopilotOpen(true);
                  setCopilotInitialPrompt(
                    'Draft a formal contract review request to Wild Thyme Catering regarding the 5-course tasting menu.'
                  );
                }}
                onAuditContracts={() => setActiveModal('contractAudit')}
                onOpenRsvp={() => setActiveModal('rsvp')}
                onOpenSavings={() => setActiveModal('aiSavings')}
                onOpenCoPlanner={() => setActiveModal('coPlanner')}
                onToast={triggerToast}
              />

              {/* 2-Column Operational Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Operational Command (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <FinancialPulse
                    event={currentEvent}
                    onOpenLedger={() => setActiveModal('ledger')}
                    onApplyRebalance={eventManager.handleApplyRebalance}
                    isRebalanced={eventManager.isCurrentRebalanced}
                    onDismissAnomaly={eventManager.handleDismissAnomaly}
                    isAnomalyDismissed={eventManager.isCurrentAnomalyDismissed}
                  />

                  <MilestonesSection
                    milestones={currentEvent.milestones}
                    onToggleMilestone={eventManager.handleToggleMilestone}
                    onViewDependency={() => setActiveModal('dependencyGraph')}
                    onViewQuotes={() => setActiveModal('quoteComparison')}
                    onApproveQuotes={() => setActiveModal('quoteComparison')}
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
                    onSelectVendor={(v) => {
                      setSelectedVendor(v);
                      setActiveModal('vendorDetail');
                    }}
                  />

                  <CreativeVault
                    creativeVault={currentEvent.creativeVault}
                    onOpenBatchModal={() => setActiveModal('cocktail')}
                    onOpenVaultModal={() => setActiveModal('creativeVault')}
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

        {/* Unified Modals */}
        <ModalManager
          activeModal={activeModal}
          onClose={() => {
            setActiveModal(null);
            setSelectedVendor(null);
          }}
          currentEvent={currentEvent}
          selectedVendor={selectedVendor}
          onClearVendor={() => setSelectedVendor(null)}
          onAddExpense={eventManager.handleAddExpense}
          onAddMilestone={eventManager.handleAddMilestone}
          onCreateEvent={eventManager.handleCreateNewEvent}
          onApproveQuote={eventManager.handleApproveQuote}
          onUpdateGuests={eventManager.handleUpdateGuests}
          onDraftNegotiation={handleDraftNegotiationInCopilot}
          onSearchAction={handleSearchAction}
          onToast={triggerToast}
          onOpenCopilot={(prompt) => {
            setIsCopilotOpen(true);
            setCopilotInitialPrompt(prompt);
          }}
          setActiveModal={setActiveModal}
        />

        {/* Toast Notification Container */}
        <div
          role="status"
          aria-live="polite"
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
