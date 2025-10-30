"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// ---------------- UI Primitives (local, no external shadcn deps) ----------------
function Card({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>{children}</div>
  );
}
function CardHeader({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-4 border-b border-gray-100 ${className}`}>{children}</div>;
}
function CardTitle({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;
}
function CardContent({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

// simple button
function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  disabled = false,
}: React.PropsWithChildren<{
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  disabled?: boolean;
}>) {
  const palette: Record<string, string> = {
    primary:
      "bg-gray-900 text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-900",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400",
    ghost:
      "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl px-4 h-10 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${palette[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// table primitives
function Table({ className = "", children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse min-w-[720px]">
        {children}
      </table>
    </div>
  );
}
function THead({ children }: React.PropsWithChildren) {
  return <thead className="text-xs uppercase text-gray-500">{children}</thead>;
}
function TBody({ children }: React.PropsWithChildren) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}
function TR({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <tr className={className}>{children}</tr>;
}
function TH({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <th className={`py-3 px-3 font-medium ${className}`}>{children}</th>;
}
function TD({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <td className={`py-3 px-3 ${className}`}>{children}</td>;
}

// Simple Modal (no external lib)
function Modal({ open, onClose, title, children }: React.PropsWithChildren<{ open: boolean; onClose: () => void; title?: string }>) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h4 className="text-base font-semibold">{title}</h4>
            <Button variant="ghost" onClick={onClose}>Close</Button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Types ----------------
export type Currency = "AED" | "OMR";
export type IPC = { no: number; date: string; claimed: number; certified: number };
export type AdvancePayment = { description: string; amount: number; recoveredToDate: number };
export type Contract = {
  id: string;
  pkg: string; // E2301.. etc
  name: string;
  currency: Currency;
  contractValue: number;
  paidToDate: number; // certified paid (for gauge)
  psUtilizationPct: number; // 0..100
  changeOrders: { estimated: number; actual: number }[];
  claimsCount: number;
  payments: { ipcs: IPC[]; advances: AdvancePayment[] };
};

// ---------------- Mock Data (can swap with live) ----------------
const contracts: Contract[] = [
  {
    id: "E2301",
    pkg: "E2301",
    name: "Package A",
    currency: "AED",
    contractValue: 200_000_000,
    paidToDate: 62_000_000,
    psUtilizationPct: 48,
    changeOrders: [
      { estimated: 4_200_000, actual: 3_900_000 },
      { estimated: 1_200_000, actual: 900_000 },
    ],
    claimsCount: 5,
    payments: {
      ipcs: [
        { no: 1, date: "2025-01-10", claimed: 12_000_000, certified: 10_000_000 },
        { no: 2, date: "2025-02-15", claimed: 16_500_000, certified: 15_000_000 },
        { no: 3, date: "2025-03-12", claimed: 22_000_000, certified: 18_000_000 },
        { no: 4, date: "2025-04-20", claimed: 20_000_000, certified: 19_000_000 },
      ],
      advances: [
        { description: "Advance #1", amount: 20_000_000, recoveredToDate: 6_000_000 },
      ],
    },
  },
  {
    id: "E2302",
    pkg: "E2302",
    name: "Package B",
    currency: "AED",
    contractValue: 150_000_000,
    paidToDate: 55_000_000,
    psUtilizationPct: 35,
    changeOrders: [{ estimated: 3_500_000, actual: 2_800_000 }],
    claimsCount: 2,
    payments: {
      ipcs: [
        { no: 1, date: "2025-01-28", claimed: 9_000_000, certified: 8_000_000 },
        { no: 2, date: "2025-03-04", claimed: 13_000_000, certified: 12_000_000 },
      ],
      advances: [
        { description: "Advance #1", amount: 15_000_000, recoveredToDate: 4_000_000 },
      ],
    },
  },
  {
    id: "E2303",
    pkg: "E2303",
    name: "Package C",
    currency: "AED",
    contractValue: 180_000_000,
    paidToDate: 80_000_000,
    psUtilizationPct: 52,
    changeOrders: [{ estimated: 2_000_000, actual: 1_400_000 }],
    claimsCount: 4,
    payments: {
      ipcs: [
        { no: 1, date: "2025-02-10", claimed: 10_000_000, certified: 9_000_000 },
        { no: 2, date: "2025-04-10", claimed: 18_000_000, certified: 16_000_000 },
      ],
      advances: [
        { description: "Advance #1", amount: 18_000_000, recoveredToDate: 5_000_000 },
      ],
    },
  },
  {
    id: "E2304",
    pkg: "E2304",
    name: "Package D",
    currency: "AED",
    contractValue: 120_000_000,
    paidToDate: 44_000_000,
    psUtilizationPct: 28,
    changeOrders: [{ estimated: 1_200_000, actual: 1_000_000 }],
    claimsCount: 1,
    payments: {
      ipcs: [
        { no: 1, date: "2025-03-10", claimed: 7_500_000, certified: 6_800_000 },
      ],
      advances: [
        { description: "Advance #1", amount: 12_000_000, recoveredToDate: 3_500_000 },
      ],
    },
  },
  {
    id: "E2305",
    pkg: "E2305",
    name: "Package E",
    currency: "AED",
    contractValue: 95_000_000,
    paidToDate: 31_000_000,
    psUtilizationPct: 22,
    changeOrders: [{ estimated: 800_000, actual: 650_000 }],
    claimsCount: 0,
    payments: {
      ipcs: [
        { no: 1, date: "2025-02-02", claimed: 4_000_000, certified: 3_800_000 },
      ],
      advances: [
        { description: "Advance #1", amount: 9_500_000, recoveredToDate: 2_500_000 },
      ],
    },
  },
  {
    id: "E2306",
    pkg: "E2306",
    name: "Package F",
    currency: "AED",
    contractValue: 110_000_000,
    paidToDate: 20_000_000,
    psUtilizationPct: 14,
    changeOrders: [{ estimated: 1_700_000, actual: 1_100_000 }],
    claimsCount: 3,
    payments: {
      ipcs: [
        { no: 1, date: "2025-01-15", claimed: 6_000_000, certified: 5_000_000 },
      ],
      advances: [
        { description: "Advance #1", amount: 11_000_000, recoveredToDate: 1_000_000 },
      ],
    },
  },
  {
    id: "E2307",
    pkg: "E2307",
    name: "Package G",
    currency: "AED",
    contractValue: 60_000_000,
    paidToDate: 12_000_000,
    psUtilizationPct: 9,
    changeOrders: [],
    claimsCount: 1,
    payments: {
      ipcs: [
        { no: 1, date: "2025-02-01", claimed: 2_500_000, certified: 2_300_000 },
      ],
      advances: [
        { description: "Advance #1", amount: 6_000_000, recoveredToDate: 1_250_000 },
      ],
    },
  },
  {
    id: "E2311",
    pkg: "I2",
    name: "Package I2",
    currency: "OMR",
    contractValue: 35_000_000,
    paidToDate: 5_000_000,
    psUtilizationPct: 12,
    changeOrders: [{ estimated: 300_000, actual: 250_000 }],
    claimsCount: 0,
    payments: {
      ipcs: [
        { no: 1, date: "2025-05-03", claimed: 800_000, certified: 700_000 },
      ],
      advances: [
        { description: "Advance #1", amount: 3_500_000, recoveredToDate: 600_000 },
      ],
    },
  },
];

// ---------------- Utils ----------------
const fmt = (amount: number, currency: Currency) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);

const pct = (num: number, den: number) => (den === 0 ? 0 : Math.round((num / den) * 100));

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

function exportCSV(filename: string, rows: string[][]) {
  const csv = rows
    .map((r) =>
      r
        .map((cell) => String(cell).replaceAll(/\n/g, " ").replaceAll(/"/g, '""'))
        .map((cell) => (cell.includes(",") || cell.includes("\n") ? `"${cell}"` : cell))
        .join(",")
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ---------------- Dev sanity tests (non-breaking) ----------------
function runDevTests() {
  try {
    console.assert(fmt(1000, "AED").startsWith("AED"), "fmt AED prefix");
    console.assert(fmt(1000, "OMR").startsWith("OMR"), "fmt OMR prefix");
    console.assert(pct(50, 200) === 25, "pct basic");
    console.assert(sum([1, 2, 3]) === 6, "sum basic");
  } catch (e) {
    // no-op; just keep it quiet in prod
  }
}

// ---------------- Main Page ----------------
export default function Page() {
  useEffect(() => runDevTests(), []);

  // Filters — kept compact and placed above the main table as per your screenshots
  const [pkgFilter, setPkgFilter] = useState<string>("All");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      const pkgOk = pkgFilter === "All" || c.pkg === pkgFilter || c.id === pkgFilter;
      const roleOk = roleFilter === "All" ? true : true; // placeholder for future role logic
      const q = search.trim().toLowerCase();
      const searchOk = q === "" || c.name.toLowerCase().includes(q) || c.pkg.toLowerCase().includes(q);
      return pkgOk && roleOk && searchOk;
    });
  }, [pkgFilter, roleFilter, search]);

  // KPI quick totals
  const totals = useMemo(() => {
    const cv = sum(contracts.map((c) => c.contractValue));
    const paid = sum(contracts.map((c) => c.paidToDate));
    const cosEst = sum(contracts.flatMap((c) => c.changeOrders.map((co) => co.estimated)));
    const cosAct = sum(contracts.flatMap((c) => c.changeOrders.map((co) => co.actual)));
    const claims = sum(contracts.map((c) => c.claimsCount));
    return { cv, paid, cosEst, cosAct, claims };
  }, []);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [tab, setTab] = useState<"ipcs" | "adv">("ipcs");

  const openDetails = (c: Contract) => {
    setSelected(c);
    setTab("ipcs");
    setOpen(true);
  };

  // Chart data
  const paymentPieData = useMemo(
    () =>
      contracts.map((c) => ({
        name: c.pkg,
        value: pct(c.paidToDate, c.contractValue),
      })),
    []
  );

  const psBarData = useMemo(
    () =>
      contracts.map((c) => ({
        name: c.pkg,
        PS: c.psUtilizationPct,
      })),
    []
  );

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="container mx-auto max-w-7xl px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">ICGRIS Dashboard</h1>
          <p className="text-sm text-gray-500">Contracts • Change Orders • Payments • Claims</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Contract Value</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">AED {new Intl.NumberFormat("en-US").format(totals.cv)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Paid</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">AED {new Intl.NumberFormat("en-US").format(totals.paid)}</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Change Orders (Est → Act)</CardTitle>
            </CardHeader>
            <CardContent className="text-base font-medium">
              AED {new Intl.NumberFormat("en-US").format(totals.cosEst)} → AED {new Intl.NumberFormat("en-US").format(totals.cosAct)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Claims</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{totals.claims}</CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Payments % by Contract</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={paymentPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    label={(d) => `${d.name}: ${d.value}%`}
                  >
                    {paymentPieData.map((_, i) => (
                      <Cell key={i} />
                    ))}
                  </Pie>
                  <ReTooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Provisional Sum Utilization</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={psBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Legend />
                  <Bar dataKey="PS" />
                  <ReTooltip formatter={(v: number) => `${v}%`} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Payments by Contract Card (with Details modal trigger) */}
        <div className="mt-8">
          <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle>Payments by Contract</CardTitle>

              {/* Filters row — at the top of this table */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="h-10 rounded-2xl border border-gray-200 px-3 text-sm"
                >
                  {(["All", "Contracts", "Finance", "Legal", "Project", "Operation"] as const).map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>

                <select
                  value={pkgFilter}
                  onChange={(e) => setPkgFilter(e.target.value)}
                  className="h-10 rounded-2xl border border-gray-200 px-3 text-sm"
                >
                  {["All", ...contracts.map((c) => c.pkg)] as const
                  ).map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search…"
                  className="h-10 rounded-2xl border border-gray-200 px-3 text-sm w-44"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <THead>
                  <TR>
                    <TH>Package</TH>
                    <TH>Contract</TH>
                    <TH>Contract Value</TH>
                    <TH>Paid to Date</TH>
                    <TH>Paid %</TH>
                    <TH>Details</TH>
                  </TR>
                </THead>
                <TBody>
                  {filtered.map((c) => (
                    <TR key={c.id} className="hover:bg-gray-50">
                      <TD className="font-medium">{c.pkg}</TD>
                      <TD>{c.name}</TD>
                      <TD>{fmt(c.contractValue, c.currency)}</TD>
                      <TD>{fmt(c.paidToDate, c.currency)}</TD>
                      <TD>{pct(c.paidToDate, c.contractValue)}%</TD>
                      <TD>
                        <Button variant="secondary" onClick={() => openDetails(c)}>
                          Details
                        </Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Claims (placeholder table to match layout) */}
        <div className="mt-10">
          <Card>
            <CardHeader>
              <CardTitle>Claims Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <THead>
                  <TR>
                    <TH>Package</TH>
                    <TH>Active Claims</TH>
                    <TH>Notes</TH>
                  </TR>
                </THead>
                <TBody>
                  {contracts.map((c) => (
                    <TR key={`claims-${c.id}`} className="hover:bg-gray-50">
                      <TD className="font-medium">{c.pkg}</TD>
                      <TD>{c.claimsCount}</TD>
                      <TD className="text-gray-500">—</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Details Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={selected ? `${selected.pkg} — ${selected.name} • Payments Details` : "Payments Details"}
      >
        {selected && (
          <div className="space-y-4">
            {/* tabs (local) */}
            <div className="flex items-center gap-2">
              <Button variant={tab === "ipcs" ? "primary" : "secondary"} onClick={() => setTab("ipcs")}>
                IPCs
              </Button>
              <Button variant={tab === "adv" ? "primary" : "secondary"} onClick={() => setTab("adv")}>
                Advance Payment
              </Button>
            </div>

            {tab === "ipcs" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold">Interim Payment Certificates</h5>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const rows: string[][] = [["IPC No.", "Date", "Claimed", "Certified"]];
                      selected.payments.ipcs.forEach((i) => {
                        rows.push([
                          `#${i.no}`,
                          i.date,
                          fmt(i.claimed, selected.currency),
                          fmt(i.certified, selected.currency),
                        ]);
                      });
                      const totals = [
                        "Totals",
                        "",
                        fmt(sum(selected.payments.ipcs.map((i) => i.claimed)), selected.currency),
                        fmt(sum(selected.payments.ipcs.map((i) => i.certified)), selected.currency),
                      ];
                      rows.push(totals);
                      exportCSV(`${selected.pkg}-ipcs.csv`, rows);
                    }}
                  >
                    Export CSV
                  </Button>
                </div>

                <Table>
                  <THead>
                    <TR>
                      <TH>IPC No.</TH>
                      <TH>Date</TH>
                      <TH>Claimed</TH>
                      <TH>Certified</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {selected.payments.ipcs.map((ipc) => (
                      <TR key={`ipc-${ipc.no}`} className="hover:bg-gray-50">
                        <TD className="font-medium">#{ipc.no}</TD>
                        <TD>{ipc.date}</TD>
                        <TD>{fmt(ipc.claimed, selected.currency)}</TD>
                        <TD>{fmt(ipc.certified, selected.currency)}</TD>
                      </TR>
                    ))}
                    <TR className="bg-gray-50">
                      <TD className="font-semibold">Totals</TD>
                      <TD />
                      <TD className="font-semibold">
                        {fmt(sum(selected.payments.ipcs.map((i) => i.claimed)), selected.currency)}
                      </TD>
                      <TD className="font-semibold">
                        {fmt(sum(selected.payments.ipcs.map((i) => i.certified)), selected.currency)}
                      </TD>
                    </TR>
                  </TBody>
                </Table>
              </div>
            )}

            {tab === "adv" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-semibold">Advance Payment</h5>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      const rows: string[][] = [["Description", "Amount", "Recovered to Date", "Outstanding"]];
                      selected.payments.advances.forEach((a) => {
                        const outstanding = a.amount - a.recoveredToDate;
                        rows.push([
                          a.description,
                          fmt(a.amount, selected.currency),
                          fmt(a.recoveredToDate, selected.currency),
                          fmt(outstanding, selected.currency),
                        ]);
                      });
                      exportCSV(`${selected.pkg}-advance.csv`, rows);
                    }}
                  >
                    Export CSV
                  </Button>
                </div>

                <Table>
                  <THead>
                    <TR>
                      <TH>Description</TH>
                      <TH>Amount</TH>
                      <TH>Recovered to Date</TH>
                      <TH>Outstanding</TH>
                    </TR>
                  </THead>
                  <TBody>
                    {selected.payments.advances.map((a, idx) => {
                      const outstanding = a.amount - a.recoveredToDate;
                      return (
                        <TR key={`adv-${idx}`} className="hover:bg-gray-50">
                          <TD className="font-medium">{a.description}</TD>
                          <TD>{fmt(a.amount, selected.currency)}</TD>
                          <TD>{fmt(a.recoveredToDate, selected.currency)}</TD>
                          <TD>{fmt(outstanding, selected.currency)}</TD>
                        </TR>
                      );
                    })}
                  </TBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
