import { listBranches } from '@/lib/engagement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({ branches: listBranches() });
}
