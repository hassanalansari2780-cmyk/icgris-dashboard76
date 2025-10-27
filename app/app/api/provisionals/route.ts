import { NextResponse } from 'next/server';
import { readRange, num, str } from '@/lib/sheets';

export async function GET() {
  try {
    const rows = await readRange('provisionals!A1:D');
    const data = rows.map((r: any) => ({
      pkg: str(r.pkg),
      used: Number(num(r.used) ?? 0),
      approved: Number(num(r.approved) ?? 0),
      pending: Number(num(r.pending) ?? 0),
    }));
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
