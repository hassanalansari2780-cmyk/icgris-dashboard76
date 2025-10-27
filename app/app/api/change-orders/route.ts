import { NextResponse } from 'next/server';
import { readRange, num, str } from '@/lib/sheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status'); // optional

    const rows = await readRange('change_orders!A1:H');
    let data = rows.map((r: any) => ({
      id: str(r.id),
      pkg: str(r.pkg),
      title: str(r.title),
      status: str(r.status), // 'Proposed' | 'In Review' | 'Approved' | 'Rejected'
      estimated: Number(num(r.estimated) ?? 0),
      actual: num(r.actual) == null ? null : Number(num(r.actual)),
      date: str(r.date),
      description: str(r.description),
    }));

    if (statusFilter && statusFilter !== 'All') {
      data = data.filter((d) => d.status === statusFilter);
    }

    return NextResponse.json({ data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
