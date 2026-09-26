import { buildMessage, getThread, validateMessage } from '@/lib/engagement';
import type { ChatMessage, MessageThread } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get('threadId') ?? '';
  const thread = getThread(threadId);
  if (!thread) {
    return Response.json({ error: 'گفتگو یافت نشد.' }, { status: 404 });
  }
  return Response.json({ thread });
}

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'بدنه درخواست نامعتبر است.' }, { status: 400 });
  }

  const result = validateMessage(body);
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  const existing = getThread(result.threadId);
  const thread: MessageThread = existing ?? {
    id: result.threadId,
    title: 'گفتگوی جدید',
    subject: 'گفتگو با پشتیبانی مون مارکت',
    status: 'open',
    unreadCount: 0,
    updatedAt: new Date().toISOString(),
    messages: [],
  };

  const message = buildMessage(thread.id, result.text);
  const autoReply: ChatMessage = {
    id: `${message.id}-reply`,
    threadId: thread.id,
    author: 'support',
    body: 'پیام شما دریافت شد. کارشناس پشتیبانی به‌زودی پاسخ می‌دهد. برای پیگیری سریع‌تر می‌توانید با ۰۲۱-۹۱۰۰۱۲۳۴ تماس بگیرید.',
    createdAt: new Date().toISOString(),
    status: 'sent',
  };

  return Response.json(
    {
      thread: { ...thread, messages: [...thread.messages, message, autoReply], updatedAt: autoReply.createdAt },
      message,
      autoReply,
    },
    { status: existing ? 200 : 201 }
  );
}
