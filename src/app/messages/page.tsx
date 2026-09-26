'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CategoryHeader, BottomNavbar, MessagePanel } from '@/components';

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadId = searchParams.get('thread');

  return (
    <main className="min-h-screen pb-24 md:pb-12 transition-colors duration-300">
      <CategoryHeader title="پیام‌ها و پشتیبانی" onBack={() => router.push('/')} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-5">
        <MessagePanel initialThreadId={threadId} />
      </div>

      <BottomNavbar activeTab="profile" />
    </main>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">در حال بارگذاری...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
