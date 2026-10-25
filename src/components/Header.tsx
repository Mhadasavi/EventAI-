import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Search, Sun, Moon, Zap, ChevronDown, Check, Plus, Calendar, MapPin } from 'lucide-react';
import { EventData } from '../types';

interface HeaderProps {
  events: EventData[];
  currentEvent: EventData;
  onSelectEvent: (event: EventData) => void;
  onOpenNewEventModal: () => void;
  onOpenSearch: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleCopilot: () => void;
  isCopilotOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  events,
  currentEvent,
  onSelectEvent,
  onOpenNewEventModal,
  onOpenSearch,
  isDarkMode,
  onToggleDarkMode,
  onToggleCopilot,
  isCopilotOpen,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#18191e]/90 frosted-glass border-b border-neutral-200/80 dark:border-neutral-800/80 px-4 sm:px-6 py-3 transition-colors duration-300">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        {/* Brand & Event Switcher */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Celebrate<span className="text-brand-500">AI</span>
              </span>
              <span className="hidden md:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50">
                Studio Master
              </span>
            </div>
          </div>

          <div className="h-5 w-[1px] bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>

          {/* Event Selector Badge & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200/60 dark:border-neutral-700/60 text-xs font-medium cursor-pointer hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition"
              aria-label="Switch Event"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 max-w-[160px] sm:max-w-[240px] truncate">
                {currentEvent.shortName}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500 hidden sm:inline">
                • {currentEvent.dateStr.split(',')[1] || currentEvent.dateStr}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 ml-0.5" />
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-[#1a1b20] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                  Select Event Workspace
                </div>
                <div className="p-1 space-y-1">
                  {events.map((evt) => (
                    <button
                      key={evt.id}
                      onClick={() => {
                        onSelectEvent(evt);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition ${
                        evt.id === currentEvent.id
                          ? 'bg-brand-50/80 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0 pr-2">
                        <div className="text-xs font-bold truncate">{evt.name}</div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3" />
                          <span>{evt.dateStr}</span>
                          <span>•</span>
                          <span>{evt.guestCount} guests</span>
                        </div>
                      </div>
                      {evt.id === currentEvent.id && (
                        <Check className="w-4 h-4 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-1 border-t border-neutral-100 dark:border-neutral-800 mt-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenNewEventModal();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Create New Event with GenAI</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Search / Spotlight Trigger */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between pl-3 pr-2 py-1.5 text-xs bg-neutral-100/80 dark:bg-neutral-800/80 border border-transparent hover:border-brand-500/30 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-neutral-400" />
              <span>Search budget tranches, vendor contracts, or ask AI...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-400">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Live AI Status Badge */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>GenAI Live Engine: Active</span>
          </div>

          {/* Search Trigger for Mobile */}
          <button
            onClick={onOpenSearch}
            className="lg:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Light/Dark Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition"
            aria-label="Toggle Theme"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Ask Copilot Button */}
          <button
            onClick={onToggleCopilot}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-sm shadow-brand-500/25 text-xs font-semibold tracking-wide transition transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Ask Copilot</span>
            <span className="w-2 h-2 rounded-full bg-white animate-ping sm:hidden"></span>
          </button>

          {/* Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-neutral-200 dark:border-neutral-800">
            <div className="relative cursor-pointer group" title="Elena Vasquez (Bride / Host)">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-brand-500/30">
                EV
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#18191e]"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
