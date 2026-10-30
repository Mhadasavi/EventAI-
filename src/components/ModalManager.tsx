import React from 'react';
import { ActiveModal, EventData, BudgetItem, Milestone, VendorPartner, QuoteOption } from '../types';

// Modals
import { LogExpenseModal } from './modals/LogExpenseModal';
import { AddMilestoneModal } from './modals/AddMilestoneModal';
import { FullLedgerModal } from './modals/FullLedgerModal';
import { ContractAuditModal } from './modals/ContractAuditModal';
import { VendorDetailModal } from './modals/VendorDetailModal';
import { CocktailBatchModal } from './modals/CocktailBatchModal';
import { NewEventModal } from './modals/NewEventModal';
import { SearchModal } from './modals/SearchModal';
import { RsvpManagerModal } from './modals/RsvpManagerModal';
import { AiSavingsModal } from './modals/AiSavingsModal';
import { DependencyGraphModal } from './modals/DependencyGraphModal';
import { QuoteComparisonModal } from './modals/QuoteComparisonModal';
import { CreativeVaultModal } from './modals/CreativeVaultModal';
import { CoPlannerModal } from './modals/CoPlannerModal';

interface ModalManagerProps {
  activeModal: ActiveModal;
  onClose: () => void;
  currentEvent: EventData;
  selectedVendor: VendorPartner | null;
  onClearVendor: () => void;
  onAddExpense: (item: BudgetItem) => void;
  onAddMilestone: (ms: Milestone) => void;
  onCreateEvent: (newEvent: EventData) => void;
  onApproveQuote: (quote: QuoteOption) => void;
  onUpdateGuests: (count: number) => void;
  onDraftNegotiation: (vendorName: string, promptText: string) => void;
  onSearchAction: (actionType: string, payload?: string | number | Record<string, unknown> | VendorPartner) => void;
  onToast: (msg: string) => void;
  onOpenCopilot: (prompt: string) => void;
  setActiveModal: (modal: ActiveModal) => void;
}

export const ModalManager: React.FC<ModalManagerProps> = ({
  activeModal,
  onClose,
  currentEvent,
  selectedVendor,
  onClearVendor,
  onAddExpense,
  onAddMilestone,
  onCreateEvent,
  onApproveQuote,
  onUpdateGuests,
  onDraftNegotiation,
  onSearchAction,
  onToast,
  onOpenCopilot,
  setActiveModal,
}) => {
  return (
    <>
      <LogExpenseModal
        isOpen={activeModal === 'expense'}
        onClose={onClose}
        categories={currentEvent.categories}
        onAddExpense={onAddExpense}
      />

      <AddMilestoneModal
        isOpen={activeModal === 'milestone'}
        onClose={onClose}
        onAddMilestone={onAddMilestone}
      />

      <FullLedgerModal
        isOpen={activeModal === 'ledger'}
        onClose={onClose}
        items={currentEvent.items}
        totalBudget={currentEvent.totalBudget}
        committedBudget={currentEvent.committedBudget}
        safeHarborCushion={currentEvent.safeHarborCushion}
        categories={currentEvent.categories}
      />

      <ContractAuditModal
        isOpen={activeModal === 'contractAudit'}
        onClose={onClose}
        vendors={currentEvent.vendors}
        onDraftNegotiation={onDraftNegotiation}
      />

      <VendorDetailModal
        vendor={selectedVendor}
        isOpen={activeModal === 'vendorDetail' && !!selectedVendor}
        onClose={() => {
          onClose();
          onClearVendor();
        }}
        onDraftMessage={onDraftNegotiation}
      />

      <CocktailBatchModal
        cocktail={currentEvent.creativeVault.cocktail}
        guestCount={currentEvent.guestCount}
        isOpen={activeModal === 'cocktail'}
        onClose={onClose}
        onToast={onToast}
      />

      <NewEventModal
        isOpen={activeModal === 'newEvent'}
        onClose={onClose}
        onCreateEvent={onCreateEvent}
        onToast={onToast}
      />

      <SearchModal
        isOpen={activeModal === 'search'}
        onClose={onClose}
        event={currentEvent}
        onSelectAction={onSearchAction}
      />

      <RsvpManagerModal
        isOpen={activeModal === 'rsvp'}
        onClose={onClose}
        guestCount={currentEvent.guestCount}
        guestCapacity={currentEvent.guestCapacity}
        onUpdateGuests={onUpdateGuests}
        onToast={onToast}
      />

      <AiSavingsModal
        isOpen={activeModal === 'aiSavings'}
        onClose={onClose}
        totalSavings={currentEvent.aiDetectedGains}
        onOpenCopilot={onOpenCopilot}
      />

      <DependencyGraphModal
        isOpen={activeModal === 'dependencyGraph'}
        onClose={onClose}
        onToast={onToast}
      />

      <QuoteComparisonModal
        isOpen={activeModal === 'quoteComparison'}
        onClose={onClose}
        onApproveQuote={onApproveQuote}
      />

      <CreativeVaultModal
        isOpen={activeModal === 'creativeVault'}
        onClose={onClose}
        onToast={onToast}
        onOpenBatchModal={() => setActiveModal('cocktail')}
      />

      <CoPlannerModal
        isOpen={activeModal === 'coPlanner'}
        onClose={onClose}
        partnerOrHost={currentEvent.partnerOrHost}
        onToast={onToast}
      />
    </>
  );
};
