import React from 'react';
import { Copy, Check, Mail } from 'lucide-react';
import { ChatMessage, EventData } from '../../types';

interface CopilotMessageItemProps {
  msg: ChatMessage;
  event: EventData;
  copiedDraftId: string | null;
  onCopyDraft: (msgId: string, draftBody: string) => void;
  onSendGmail: (subject: string, body: string) => void;
}

export const CopilotMessageItem: React.FC<CopilotMessageItemProps> = ({
  msg,
  event,
  copiedDraftId,
  onCopyDraft,
  onSendGmail,
}) => {
  if (msg.sender === 'ai') {
    return (
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
                  onClick={() => onCopyDraft(msg.id, msg.draft!.body)}
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
                  onClick={() => onSendGmail(msg.draft!.subject, msg.draft!.body)}
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
    );
  }

  return (
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
  );
};
