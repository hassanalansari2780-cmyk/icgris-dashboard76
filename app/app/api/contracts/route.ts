import { NextResponse } from 'next/server';
import { readRange, num, str } from '@/lib/sheets';

export async function GET() {
  try {
    const rows = await readRange('contracts!A1:D');
    const data = rows.map((r: any) => ({
      pkg: str(r.pkg),
      title: str(r.title),
      contractValue: Number(num(r.contractValue) ?? 0),
      paidToDate: Number(num(r.paidToDate) ?? 0),
    }));
    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
