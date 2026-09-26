import { listNotifications } from '@/lib/engagement';
import type { NotificationType } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const VALID_TYPES: Array<NotificationType | 'all'> = ['all', 'order', 'offer', 'support', 'system'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get('type') ?? 'all') as NotificationType | 'all';
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const limit = Number(searchParams.get('limit') ?? 50);

  if (!VALID_TYPES.includes(type)) {
    return Response.json({ error: 'نوع اعلان نامعتبر است.' }, { status: 400 });
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    return Response.json({ error: 'محدودیت تعداد نامعتبر است.' }, { status: 400 });
  }

  return Response.json(listNotifications({ type, unreadOnly, limit }));
}
