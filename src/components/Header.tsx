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
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const eventDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (eventDropdownRef.current && !eventDropdownRef.current.contains(target)) {
        setIsEventDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(target)) {
        setIsProfileDropdownOpen(false);
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
          <div className="relative" ref={eventDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsProfileDropdownOpen(false);
                setIsEventDropdownOpen((prev) => !prev);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200/60 dark:border-neutral-700/60 text-xs font-medium cursor-pointer hover:bg-neutral-200/60 dark:hover:bg-neutral-800 transition focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              aria-label="Switch Event"
              aria-expanded={isEventDropdownOpen}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 max-w-[160px] sm:max-w-[240px] truncate">
                {currentEvent.shortName}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500 hidden sm:inline">
                • {currentEvent.dateStr.split(',')[1] || currentEvent.dateStr}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 ml-0.5 transition-transform duration-200 ${isEventDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isEventDropdownOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#1a1b20] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-400 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span>Select Event Workspace</span>
                  <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold">{events.length} Active Events</span>
                </div>
                <div className="p-1 space-y-1 max-h-[360px] overflow-y-auto">
                  {events.map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectEvent(evt);
                        setIsEventDropdownOpen(false);
                      }}
                      className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition cursor-pointer ${
                        evt.id === currentEvent.id
                          ? 'bg-brand-50/90 dark:bg-brand-950/50 text-brand-950 dark:text-brand-100 ring-1 ring-brand-500/30'
                          : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 pr-2 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                            evt.type === 'wedding'
                              ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                              : evt.type === 'birthday'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {evt.type}
                          </span>
                          <span className="text-xs font-bold truncate text-neutral-900 dark:text-white">{evt.name}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-neutral-400" />
                            <span>{evt.dateStr}</span>
                          </span>
                          <span>•</span>
                          <span>{evt.guestCount} guests</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      </div>
                      {evt.id === currentEvent.id && (
                        <div className="p-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 flex-shrink-0 mt-0.5">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-1 border-t border-neutral-100 dark:border-neutral-800 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEventDropdownOpen(false);
                      onOpenNewEventModal();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition cursor-pointer"
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

          {/* Profile Avatar & Interactive Menu */}
          <div className="relative pl-1 border-l border-neutral-200 dark:border-neutral-800" ref={profileDropdownRef}>
            <button
              type="button"
              onClick={() => {
                setIsEventDropdownOpen(false);
                setIsProfileDropdownOpen((prev) => !prev);
              }}
              className="relative cursor-pointer group flex items-center focus:outline-none"
              title={`${currentEvent.partnerOrHost || 'Elena Vasquez'} • Studio Master`}
              aria-label="User Profile"
              aria-expanded={isProfileDropdownOpen}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-500 to-amber-400 flex items-center justify-center text-white text-xs font-bold ring-2 ring-brand-500/30 hover:ring-brand-500/60 transition">
                {currentEvent.type === 'wedding' ? 'EV' : currentEvent.type === 'birthday' ? 'JH' : 'MS'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#18191e]"></span>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1a1b20] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="font-bold text-xs text-neutral-900 dark:text-white truncate">
                    {currentEvent.partnerOrHost || 'Elena Vasquez'}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                    {currentEvent.shortName} • Lead
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Active Workspace</span>
                  </div>
                </div>
                <div className="p-1 space-y-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenNewEventModal();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-brand-500" />
                    <span>Create New Event</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenSearch();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-neutral-400" />
                    <span>Global Search (⌘K)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
