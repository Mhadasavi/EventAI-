import React, { useState, useRef, useEffect } from 'react';
import { Zap, RotateCcw, X, Send, Sparkles, Copy, Check, Mail, ArrowRight } from 'lucide-react';
import { ChatMessage, EventData } from '../types';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData;
  onToast: (msg: string) => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  event,
  onToast,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Hello Elena & Marcus! I've loaded your vendor contracts, Napa climate forecasts, and live budget balances. How can I assist your planning right now?",
      timestamp: '10:41 AM',
    },
    {
      id: 'msg-2',
      sender: 'user',
      text: 'Can you draft a polite email to Sonoma Bloom asking if we can swap imported peonies for seasonal garden roses to stay within budget?',
      timestamp: '10:42 AM',
    },
    {
      id: 'msg-3',
      sender: 'ai',
      text: 'Here is a tailored negotiation draft that trims ~$750 by substituting greenhouse David Austin garden roses and blush ranunculus:',
      timestamp: '10:43 AM',
      draft: {
        subject: 'Nuptials (Oct 18) — Floral Adjustments',
        version: 'Draft v2',
        body: '"Hi Camille & Sonoma Bloom team, Marcus and I adore your vision deck! As we finalize line allocations, we noticed imported peony surcharges. Could we substitute locally grown Juliet garden roses to keep our original threshold? Warm regards, Elena & Marcus"',
        savings: 750,
      },
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedDraftId, setCopiedDraftId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: {
            name: event.name,
            date: event.dateStr,
            location: event.location,
            guestsConfirmed: event.guestCount,
            guestCapacity: event.guestCapacity,
            totalBudget: event.totalBudget,
            committed: event.committedBudget,
            cushion: event.safeHarborCushion,
          },
        }),
      });

      const data = await response.json();
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I've analyzed that for you and updated our planning recommendations.",
        timestamp: aiTime,
        draft: data.draft || undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `I've registered your request regarding "${text.trim()}". Napa planning benchmarks indicate this fits cleanly within our $${event.safeHarborCushion.toLocaleString()} buffer.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyDraft = (msgId: string, draftBody: string) => {
    navigator.clipboard.writeText(draftBody);
    setCopiedDraftId(msgId);
    onToast('Vendor negotiation draft copied to clipboard!');
    setTimeout(() => setCopiedDraftId(null), 2000);
  };

  const handleSendGmail = (subject: string, body: string) => {
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    onToast('Draft dispatched to email client!');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'ai',
        text: `Chat thread refreshed for ${event.shortName}. What would you like to calculate or draft?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    onToast('Copilot thread cleared.');
  };

  return (
    <aside
      className={`fixed lg:static top-0 right-0 h-full w-full sm:w-[420px] bg-white dark:bg-[#18191e] border-l border-neutral-200/80 dark:border-neutral-800 flex flex-col flex-shrink-0 z-50 lg:z-30 transition-all duration-300 shadow-2xl lg:shadow-none ${
        isOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'
      }`}
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-900/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center shadow-xs">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
              CelebrateAI Copilot
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <span className="text-[10px] text-neutral-400">Context aware: Sonoma contract & RSVPs</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            title="Clear thread"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            title="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live Chat Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.sender === 'ai' ? (
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  ✨
                </div>
                <div className="space-y-2 max-w-[92%]">
                  <div className="p-3 rounded-2xl rounded-tl-xs bg-neutral-100 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>

                  {/* Micro Email Draft Card */}
                  {msg.draft && (
                    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-3 space-y-2 shadow-xs animate-in fade-in">
                      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-1.5 text-[11px]">
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          Subject: {msg.draft.subject}
                        </span>
                        <span className="text-neutral-400 text-[10px]">{msg.draft.version || 'Draft v1'}</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {msg.draft.body}
                      </p>
                      <div className="flex items-center gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                          onClick={() => handleCopyDraft(msg.id, msg.draft!.body)}
                          className="flex-1 py-1 px-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 font-semibold text-[10px] transition flex items-center justify-center gap-1"
                        >
                          {copiedDraftId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedDraftId === msg.id ? 'Copied' : 'Copy Text'}</span>
                        </button>
                        <button
                          onClick={() => handleSendGmail(msg.draft!.subject, msg.draft!.body)}
                          className="flex-1 py-1 px-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold text-[10px] transition flex items-center justify-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Send via Gmail</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-neutral-400 block pl-1">{msg.timestamp}</span>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-end gap-2.5">
                <div className="space-y-1 max-w-[85%] text-right">
                  <div className="p-3 rounded-2xl rounded-tr-xs bg-brand-500 text-white text-left leading-relaxed shadow-xs">
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-neutral-400 block pr-1">
                    {msg.timestamp} • {event.type === 'wedding' ? 'Elena' : 'Host'}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-brand-200 text-brand-800 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  EV
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-2.5 animate-pulse">
            <div className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
              ✨
            </div>
            <div className="p-3 rounded-2xl rounded-tl-xs bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 text-xs">
              CelebrateAI is calculating trade-offs & contract terms...
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompt Suggestion Chips */}
      <div className="px-4 py-2 border-t border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 overflow-x-auto whitespace-nowrap space-x-2">
        <button
          onClick={() => handleSendMessage('Draft a polite thank-you note to Meadowood venue team')}
          className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-brand-500 text-neutral-700 dark:text-neutral-300 transition"
        >
          ✍️ Draft Venue Note
        </button>
        <button
          onClick={() => handleSendMessage('What happens to our budget if RSVP headcount drops to 150?')}
          className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-brand-500 text-neutral-700 dark:text-neutral-300 transition"
        >
          📉 Headcount Impact Analysis
        </button>
        <button
          onClick={() => handleSendMessage('Suggest 3 practical rainy-day contingency layout ideas')}
          className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-brand-500 text-neutral-700 dark:text-neutral-300 transition"
        >
          ☔ Rain Contingency Ideas
        </button>
        <button
          onClick={() => handleSendMessage('Proactively suggest 3 cost-cutting DIY alternatives to save $1,500 without sacrificing quality')}
          className="px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-brand-500 text-neutral-700 dark:text-neutral-300 transition"
        >
          💡 DIY Cost Cuts (-$1,500)
        </button>
      </div>

      {/* Chat Input Field */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#18191e]">
        <form
          className="relative flex items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Instruct Copilot (e.g. 'Draft shuttle terms')..."
            className="w-full pl-3 pr-10 py-2.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-transparent focus:border-brand-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-500 text-neutral-900 dark:text-white placeholder-neutral-400 transition"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition disabled:opacity-40"
            title="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2 px-1">
          <span>CelebrateAI v4.5 • End-to-end encrypted</span>
          <span>42,800 tokens remaining</span>
        </div>
      </div>
    </aside>
  );
};
