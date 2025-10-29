"use client";
import * as React from "react";
import clsx from "clsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type IPCRow = {
  pkg: string;
  ipcNo: string;
  date: string;          // YYYY-MM-DD
  claimed: number;
  certified: number;
  status?: string;
  notes?: string;
};

type AdvanceRow = {
  pkg: string;
  advanceTotal: number;
  advancePaidToDate: number;
  recoveryToDate: number;
  percentPaid: number;   // precomputed for demo
  notes?: string;
};

type Props = {
  pkg: string;
  title: string;
  value: number;          // contractValue
  paid: number;           // paidToDate
  colorClass: string;     // Tailwind bg-* for the package color
  ipcs: IPCRow[];         // already filtered for this pkg
  advance: AdvanceRow | null;
};

const currency = (v: number) => `AED ${v.toLocaleString("en-US")}`;
const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

export default function PaymentCard({
  pkg, title, value, paid, colorClass, ipcs, advance,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const per = pct(paid, value);

  const totalClaimed = ipcs.reduce((a, r) => a + (Number(r.claimed) || 0), 0);
  const totalCertified = ipcs.reduce((a, r) => a + (Number(r.certified) || 0), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>{title}</span>
          <div className="flex items-center gap-2">
            <span className={clsx("inline-block h-3 w-3 rounded-full", colorClass)} />
            <Button size="sm" variant="outline" onClick={() => setOpen(v => !v)}>
              {open ? "Hide details" : "Details"}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-semibold">{per}%</div>
        <div className="mt-3 space-y-1">
          <Progress value={per} />
          <div className="text-xs text-slate-500">
            Paid: {currency(paid)} • Value: {currency(value)}
          </div>
        </div>

        {open && (
          <div className="mt-5 rounded-lg border bg-slate-50 p-3">
            {/* Advance payment */}
            <div className="mb-3">
              <div className="text-xs font-semibold mb-1">Advance Payment</div>
              {advance ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Advance % Paid</span>
                    <span>{advance.percentPaid}%</span>
                  </div>
                  <Progress value={advance.percentPaid} />
                  <div className="text-xs text-slate-500">
                    Paid {currency(advance.advancePaidToDate)} / Total {currency(advance.advanceTotal)}
                    {" • "}Recovery {currency(advance.recoveryToDate)}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500">No advance data.</div>
              )}
            </div>

            {/* IPCs */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-semibold">
                  IPCs — {ipcs.length} records
                </div>
                <div className="text-xs text-slate-500">
                  Total Claimed {currency(totalClaimed)} • Certified {currency(totalCertified)}
                </div>
              </div>

              {ipcs.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-slate-500">
                        <th className="py-1 pr-3">IPC</th>
                        <th className="py-1 pr-3">Date</th>
                        <th className="py-1 pr-3 text-right">Claimed</th>
                        <th className="py-1 pr-3 text-right">Certified</th>
                        <th className="py-1 pr-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ipcs.slice(0, 5).map((r, i) => (
                        <tr key={`${pkg}-ipc-${i}`} className="border-t">
                          <td className="py-1 pr-3">#{r.ipcNo}</td>
                          <td className="py-1 pr-3">{r.date}</td>
                          <td className="py-1 pr-3 text-right">{currency(Number(r.claimed || 0))}</td>
                          <td className="py-1 pr-3 text-right">{currency(Number(r.certified || 0))}</td>
                          <td className="py-1 pr-3">{r.status || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ipcs.length > 5 && (
                    <div className="mt-1 text-[11px] text-slate-500">Showing latest 5</div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500">No IPCs yet.</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
