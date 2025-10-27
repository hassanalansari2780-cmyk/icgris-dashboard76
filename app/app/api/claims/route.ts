import { NextResponse } from 'next/server';
import { readRange, num, str } from '@/lib/sheets';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status'); // optional

    const rows = await readRange('claims!A1:I');
    let data = rows.map((r: any) => ({
      id: str(r.id),
      pkg: str(r.pkg),
      title: str(r.title),
      status: str(r.status), // 'Submitted' | 'In Review' | 'Approved' | 'Rejected'
      claimed: Number(num(r.claimed) ?? 0),
      certified: num(r.certified) == null ? null : Number(num(r.certified)),
      daysOpen: Number(num(r.daysOpen) ?? 0),
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
