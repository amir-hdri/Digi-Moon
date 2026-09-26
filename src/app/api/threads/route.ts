import { listThreads } from '@/lib/engagement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ threads: listThreads() });
}
