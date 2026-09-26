import { validateNewsletter } from '@/lib/engagement';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: unknown = null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'بدنه درخواست نامعتبر است.' }, { status: 400 });
  }

  const result = validateNewsletter(body);
  if ('error' in result) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(
    { ok: true, phone: result.phone, message: 'عضویت شما در خبرنامه ثبت شد.' },
    { status: 201 }
  );
}
