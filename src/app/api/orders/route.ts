import { buildOrder, validateOrder } from '@/lib/engagement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'بدنه درخواست نامعتبر است.' }, { status: 400 });
  }

  const result = validateOrder(body);
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  const order = buildOrder(result.items, result.addressId, result.paymentMethod);
  return Response.json({ order }, { status: 201 });
}
