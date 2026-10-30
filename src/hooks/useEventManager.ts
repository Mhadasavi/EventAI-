import { useState, useMemo } from 'react';
import { INITIAL_EVENTS } from '../data/mockEvents';
import { EventData, BudgetItem, Milestone, QuoteOption } from '../types';

export function useEventManager(onToast: (msg: string) => void) {
  const [events, setEvents] = useState<EventData[]>(INITIAL_EVENTS);
  const [currentEventId, setCurrentEventId] = useState<string>(INITIAL_EVENTS[0].id);
  const [rebalancedEvents, setRebalancedEvents] = useState<Record<string, boolean>>({});
  const [dismissedAnomalies, setDismissedAnomalies] = useState<Record<string, boolean>>({});

  const currentEvent = useMemo(
    () => events.find((e) => e.id === currentEventId) || events[0],
    [events, currentEventId]
  );
  const isCurrentRebalanced = !!rebalancedEvents[currentEvent.id];
  const isCurrentAnomalyDismissed = !!dismissedAnomalies[currentEvent.id];

  // 1-Click Anomaly Rebalance Action
  const handleApplyRebalance = () => {
    setRebalancedEvents((prev) => ({ ...prev, [currentEvent.id]: true }));

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

    onToast('Rebalance applied: $700 surplus reallocated from Stationery to Floral & Decor.');
  };

  const handleDismissAnomaly = () => {
    setDismissedAnomalies((prev) => ({ ...prev, [currentEvent.id]: true }));
    onToast('Anomaly banner dismissed.');
  };

  // Add Expense
  const handleAddExpense = (newItem: BudgetItem) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== currentEvent.id) return evt;
        const newCommitted = evt.committedBudget + newItem.actual;
        const newCushion = Math.max(0, evt.totalBudget - newCommitted);

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

    onToast(`Expense logged: $${newItem.actual.toLocaleString()} for ${newItem.name}`);
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
    onToast(`Milestone scheduled: "${newMs.title}"`);
  };

  // Toggle Milestone completion
  const handleToggleMilestone = (id: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== currentEvent.id) return evt;
        let change = 0;
        const updatedMs = evt.milestones.map((m) => {
          if (m.id === id) {
            const nextStatus: Milestone['status'] = m.status === 'Completed' ? 'Pending' : 'Completed';
            change = nextStatus === 'Completed' ? 1 : -1;
            return { ...m, status: nextStatus };
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
    onToast(`Approved & Confirmed: ${quote.vendorName} ($${quote.amount.toLocaleString()})!`);
  };

  // Update Headcount Handler
  const handleUpdateGuests = (newCount: number) => {
    setEvents((prev) =>
      prev.map((evt) => (evt.id === currentEvent.id ? { ...evt, guestCount: newCount } : evt))
    );
  };

  return {
    events,
    currentEvent,
    currentEventId,
    setCurrentEventId,
    isCurrentRebalanced,
    isCurrentAnomalyDismissed,
    handleApplyRebalance,
    handleDismissAnomaly,
    handleAddExpense,
    handleAddMilestone,
    handleToggleMilestone,
    handleCreateNewEvent,
    handleApproveQuote,
    handleUpdateGuests,
  };
}
