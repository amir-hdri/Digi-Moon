'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, MessageCircle, Plus, RotateCcw, Send } from 'lucide-react';
import { useMessageStore } from '@/stores/useMessageStore';
import { useShallow } from 'zustand/react/shallow';
import { useToastStore } from '@/stores/useToastStore';
import { timeAgoFa, toPersianDigits } from '@/lib/persian';

interface MessagePanelProps {
  initialThreadId?: string | null;
}

export const MessagePanel: React.FC<MessagePanelProps> = ({ initialThreadId = null }) => {
  const { threads, activeThreadId, loading, sending, error } = useMessageStore(
    useShallow((s) => ({
      threads: s.threads,
      activeThreadId: s.activeThreadId,
      loading: s.loading,
      sending: s.sending,
      error: s.error,
    }))
  );
  const fetchThreads = useMessageStore((s) => s.fetchThreads);
  const openThread = useMessageStore((s) => s.openThread);
  const newThread = useMessageStore((s) => s.newThread);
  const sendMessage = useMessageStore((s) => s.sendMessage);
  const clearError = useMessageStore((s) => s.clearError);
  const [draft, setDraft] = useState('');
  const [sendingFailed, setSendingFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void fetchThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialThreadId) void openThread(initialThreadId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialThreadId]);

  const activeThread = threads.find((t) => t.id === activeThreadId) ?? threads[0] ?? null;

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [activeThread?.messages.length, activeThreadId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThread || sending) return;
    if (draft.trim().length === 0) {
      useToastStore.getState().show({
        title: 'پیام خالی',
        message: 'لطفاً ابتدا متن پیام را بنویسید.',
        type: 'warning',
      });
      return;
    }
    if (draft.trim().length > 1000) {
      useToastStore.getState().show({
        title: 'پیام طولانی',
        message: 'متن پیام حداکثر ۱۰۰۰ نویسه مجاز است.',
        type: 'warning',
      });
      return;
    }
    const text = draft;
    setDraft('');
    setSendingFailed(false);
    const ok = await sendMessage(activeThread.id, text);
    if (!ok) {
      setDraft(text);
      setSendingFailed(true);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[15rem,1fr] gap-3">
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-slate-100 dark:border-zinc-800">
          <span className="text-xs font-black text-slate-800 dark:text-zinc-100">گفتگوها</span>
          <button
            type="button"
            onClick={() => newThread()}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>جدید</span>
          </button>
        </div>
        <div className="max-h-64 md:max-h-[26rem] overflow-y-auto custom-scrollbar divide-y divide-slate-100 dark:divide-zinc-800/70">
          {loading && threads.length === 0 ? (
            <p className="p-4 text-center text-[11px] text-slate-400">در حال دریافت گفتگوها...</p>
          ) : threads.length === 0 ? (
            <p className="p-4 text-center text-[11px] text-slate-400">گفتگویی وجود ندارد.</p>
          ) : (
            threads.map((thread) => {
              const isActive = thread.id === activeThread?.id;
              return (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => void openThread(thread.id)}
                  className={`w-full p-3.5 text-right transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/[0.07]'
                      : 'hover:bg-slate-50 dark:hover:bg-zinc-800/60'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 truncate">
                      {thread.title}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center tabular-nums shrink-0">
                        {toPersianDigits(thread.unreadCount)}
                      </span>
                    )}
                  </span>
                  <span className="block text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-1">
                    {thread.messages[thread.messages.length - 1]?.body ?? thread.subject}
                  </span>
                  <span className="block text-[10px] text-slate-400 dark:text-zinc-500 mt-1">
                    {timeAgoFa(thread.updatedAt)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col min-h-[24rem]">
        {!activeThread ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageCircle className="w-10 h-10 text-slate-300 dark:text-zinc-600 mb-2" />
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              یک گفتگو را انتخاب کنید یا گفتگوی جدید بسازید.
            </p>
          </div>
        ) : (
          <>
            <div className="px-4 py-3 border-b border-slate-100 dark:border-zinc-800">
              <h2 className="text-sm font-black text-slate-800 dark:text-zinc-100">
                {activeThread.title}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                {activeThread.subject}
              </p>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2.5 max-h-[24rem]">
              <AnimatePresence initial={false}>
                {activeThread.messages.map((message) => {
                  const mine = message.author === 'user';
                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      className={`flex ${mine ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                          mine
                            ? 'rounded-tr-md bg-emerald-600 text-white shadow-sm shadow-emerald-600/25'
                            : 'rounded-tl-md bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200'
                        }`}
                      >
                        <p>{message.body}</p>
                        <span
                          className={`block text-[9px] mt-1 ${
                            mine ? 'text-emerald-100/80' : 'text-slate-400 dark:text-zinc-500'
                          }`}
                        >
                          {timeAgoFa(message.createdAt)}
                          {message.status === 'sending' && ' · در حال ارسال'}
                          {message.status === 'failed' && ' · ناموفق'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              {activeThread.messages.length === 0 && (
                <p className="text-center text-[11px] text-slate-400 py-8">
                  هنوز پیامی ثبت نشده است. اولین پیام را بنویسید.
                </p>
              )}
            </div>

            {error && (
              <div className="mx-4 mb-2 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={clearError}
                  className="underline cursor-pointer"
                >
                  بستن
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-100 dark:border-zinc-800">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={1}
                  maxLength={1000}
                  placeholder="پیام خود را بنویسید..."
                  aria-label="متن پیام"
                  className="flex-1 max-h-28 px-3.5 py-2.5 rounded-xl bg-slate-100/80 dark:bg-zinc-800/80 border border-transparent focus:border-emerald-500 text-xs text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={sending}
                  aria-label="ارسال پیام"
                  className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 disabled:opacity-60 transition-colors shrink-0 cursor-pointer"
                >
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 -scale-x-100" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 px-1">
                <span className="text-[10px] text-slate-400">
                  {toPersianDigits(draft.length)} / {toPersianDigits(1000)}
                </span>
                {sendingFailed && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500">
                    <RotateCcw className="w-3 h-3" />
                    ارسال ناموفق بود؛ دوباره تلاش کنید
                  </span>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagePanel;
