"use client";

import * as React from "react";
import clsx from "clsx";

// --- UI components (your existing shadcn-like components) ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ✅ canonical shadcn table exports (avoids Thead/Tbody reference errors)
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// ------------------ Types ------------------
type Contract = {
  pkg: string; // A, B, C, ...
  title: string;
  contractValue: number;
  paidToDate: number;
};

type Provisional = {
  pkg: string;
  used: number; // percent 0..100
  approved: number; // percent 0..100
  pending: number; // percent 0..100
};

type CO = {
  id: string;
  pkg: string;
  title: string;
  status: "Proposed" | "In Review" | "Approved" | "Rejected" | string;
  estimated: number;
  actual: number | null;
  date: string; // ISO date string
  description?: string;
};

type Claim = {
  id: string;
  pkg: string;
  title: string;
  status: "Submitted" | "In Review" | "Approved" | "Rejected" | string;
  claimed: number;
  certified: number | null;
  daysOpen: number;
  date: string; // ISO
  description?: string;
};

type IPC = {
  pkg: string; // matches Contract.pkg (A, B, ...)
  ipcNo: string;
  date: string; // ISO
  certified: number;
  status: "Certified" | "Submitted" | "In Review";
};

type AdvancePayment = {
  pkg: string;
  amount: number; // total AP granted
  recovered: number; // recovered so far
};

// ------------------ Constants ------------------
const ALL_PKGS = ["A", "B", "C", "D", "F", "G", "I2", "PMEC"] as const;

const ROLES = [
  "All",
  "Contracts",
  "Finance",
  "Legal",
  "Project",
  "Operation",
  "PMEC",
] as const;

const CO_STATUSES = ["All", "Proposed", "In Review", "Approved", "Rejected"] as const;
const CLAIM_STATUSES = ["All", "Submitted", "In Review", "Approved", "Rejected"] as const;

// Per-package color tokens (light/dark friendly)
const packageColor: Record<string, string> = {
  A: "bg-blue-600",
  B: "bg-emerald-600",
  C: "bg-orange-600",
  D: "bg-rose-600",
  F: "bg-violet-600",
  G: "bg-teal-600",
  I2: "bg-amber-600",
  PMEC: "bg-purple-600",
};

// ------------------ MOCK DATA (frontend-only) ------------------
const MOCK_CONTRACTS: Contract[] = [
  { pkg: "A", title: "Package A - Systems", contractValue: 120_000_000, paidToDate: 48_000_000 },
  { pkg: "B", title: "Package B - Track", contractValue: 95_000_000, paidToDate: 41_000_000 },
  { pkg: "C", title: "Package C - Civil", contractValue: 180_000_000, paidToDate: 72_000_000 },
  { pkg: "D", title: "Package D - Stations", contractValue: 85_000_000, paidToDate: 19_000_000 },
  { pkg: "F", title: "Package F - Rolling Stock", contractValue: 210_000_000, paidToDate: 109_000_000 },
  { pkg: "G", title: "Package G - O&M", contractValue: 60_000_000, paidToDate: 9_500_000 },
  { pkg: "I2", title: "Package I2 - Integration", contractValue: 35_000_000, paidToDate: 11_000_000 },
  { pkg: "PMEC", title: "PMEC - Consulting", contractValue: 18_000_000, paidToDate: 7_000_000 },
];

const MOCK_PROVISIONALS: Provisional[] = [
  { pkg: "A", used: 22, approved: 35, pending: 12 },
  { pkg: "B", used: 31, approved: 12, pending: 25 },
  { pkg: "C", used: 44, approved: 30, pending: 10 },
  { pkg: "D", used: 10, approved: 18, pending: 22 },
  { pkg: "F", used: 51, approved: 21, pending: 9 },
  { pkg: "G", used: 6, approved: 9, pending: 19 },
  { pkg: "I2", used: 28, approved: 7, pending: 12 },
  { pkg: "PMEC", used: 12, approved: 10, pending: 5 },
];

const MOCK_COS: CO[] = [
  { id: "CO-A-001", pkg: "A", title: "Scope Interface Adjustment", status: "In Review", estimated: 3_200_000, actual: null, date: "2025-09-05" },
  { id: "CO-A-002", pkg: "A", title: "Cybersecurity Upgrade", status: "Proposed", estimated: 1_150_000, actual: null, date: "2025-10-10" },
  { id: "CO-B-001", pkg: "B", title: "Ballast Spec Update", status: "Approved", estimated: 2_000_000, actual: 1_850_000, date: "2025-07-22" },
  { id: "CO-C-004", pkg: "C", title: "Retaining Wall Change", status: "Approved", estimated: 4_900_000, actual: 5_200_000, date: "2025-03-30" },
  { id: "CO-D-003", pkg: "D", title: "Station Canopy Redesign", status: "In Review", estimated: 2_700_000, actual: null, date: "2025-09-18" },
  { id: "CO-F-002", pkg: "F", title: "Brake System Mod", status: "Proposed", estimated: 6_000_000, actual: null, date: "2025-10-08" },
  { id: "CO-G-005", pkg: "G", title: "Maintenance Tooling", status: "Approved", estimated: 800_000, actual: 780_000, date: "2025-05-11" },
  { id: "CO-I2-002", pkg: "I2", title: "Interface Test Extension", status: "Proposed", estimated: 450_000, actual: null, date: "2025-09-29" },
  { id: "CO-PMEC-001", pkg: "PMEC", title: "Additional Studies", status: "Approved", estimated: 300_000, actual: 290_000, date: "2025-02-14" },
];

const MOCK_CLAIMS: Claim[] = [
  { id: "CLM-A-001", pkg: "A", title: "Interface Delay (Vendor A)", status: "In Review", claimed: 1_200_000, certified: null, daysOpen: 24, date: "2025-10-02" },
  { id: "CLM-B-002", pkg: "B", title: "Ballast Rework", status: "Submitted", claimed: 850_000, certified: null, daysOpen: 11, date: "2025-10-15" },
  { id: "CLM-C-003", pkg: "C", title: "Unforeseen Utilities", status: "Approved", claimed: 2_100_000, certified: 1_950_000, daysOpen: 39, date: "2025-08-21" },
  { id: "CLM-D-001", pkg: "D", title: "Design Change Impacts", status: "Rejected", claimed: 900_000, certified: 0, daysOpen: 51, date: "2025-07-03" },
  { id: "CLM-F-004", pkg: "F", title: "Supplier Late Deliveries", status: "In Review", claimed: 1_750_000, certified: null, daysOpen: 17, date: "2025-10-10" },
  { id: "CLM-G-002", pkg: "G", title: "O&M Mobilization Overlaps", status: "Submitted", claimed: 300_000, certified: null, daysOpen: 9, date: "2025-10-17" },
  { id: "CLM-I2-001", pkg: "I2", title: "Integration Test Overruns", status: "Approved", claimed: 600_000, certified: 540_000, daysOpen: 28, date: "2025-09-05" },
  { id: "CLM-PMEC-1", pkg: "PMEC", title: "Additional Study Hours", status: "Approved", claimed: 200_000, certified: 190_000, daysOpen: 14, date: "2025-10-08" },
];

const MOCK_IPCS: IPC[] = [
  { pkg: "A", ipcNo: "IPC 05", date: "2025-09-20", certified: 325_000, status: "Certified" },
  { pkg: "A", ipcNo: "IPC 06", date: "2025-10-21", certified: 510_207.176, status: "Certified" },
  { pkg: "B", ipcNo: "IPC 07", date: "2025-10-15", certified: 375_000, status: "Certified" },
  { pkg: "C", ipcNo: "IPC 03", date: "2025-09-30", certified: 250_000, status: "In Review" },
  { pkg: "PMEC", ipcNo: "IPC 09", date: "2025-10-05", certified: 180_000, status: "Certified" },
];

const MOCK_AP: AdvancePayment[] = [
  { pkg: "A", amount: 750_000, recovered: 480_000 },
  { pkg: "B", amount: 900_000, recovered: 660_000 },
  { pkg: "C", amount: 600_000, recovered: 120_000 },
  { pkg: "F", amount: 1_500_000, recovered: 930_000 },
];

// ------------------ Utils ------------------
const currency = (v: number) => `AED ${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const pct = (num: number, den: number) => (den > 0 ? Math.round((num / den) * 100) : 0);
const variance = (est: number, act: number | null) => (act == null ? null : act - est);

const isWithinRange = (iso: string, range: string) => {
  if (range === "All") return true;
  const d = new Date(iso).getTime();
  const now = Date.now();
  const MS = 24 * 3600 * 1000;
  if (range === "30d") return d >= now - 30 * MS;
  if (range === "90d") return d >= now - 90 * MS;
  if (range === "365d") return d >= now - 365 * MS;
  return true;
};

function downloadCSV(filename: string, rows: any[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (s: any) =>
    `"${String(s ?? "").replaceAll('"', '""').replaceAll(/\r?\n/g, " ")}"`;
  const csv = [headers.join(",")]
    .concat(rows.map((r) => headers.map((h) => esc(r[h])).join(",")))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ------------------ Page ------------------
export default function Page() {
  // Frontend-only: start with MOCK_* arrays (no /api fetch)
  const [contracts] = React.useState<Contract[]>(MOCK_CONTRACTS);
  const [provisionals] = React.useState<Provisional[]>(MOCK_PROVISIONALS);
  const [cos, setCos] = React.useState<CO[]>(MOCK_COS);
  const [claims] = React.useState<Claim[]>(MOCK_CLAIMS);

  // UI state
  const [role, setRole] = React.useState<(typeof ROLES)[number]>("All");
  const [activePkgs, setActivePkgs] = React.useState<string[]>([...ALL_PKGS]);
  const [search, setSearch] = React.useState("");
  const [coStatus, setCoStatus] = React.useState<"All" | "Proposed" | "In Review" | "Approved" | "Rejected">("All");
  const [claimStatus, setClaimStatus] = React.useState<"All" | "Submitted" | "In Review" | "Approved" | "Rejected">("All");
  const [timeRange, setTimeRange] = React.useState<"All" | "30d" | "90d" | "365d">("All");
  const [detailsFor, setDetailsFor] = React.useState<Contract | null>(null);

  // --- tiny self-tests (non-fatal). Helps catch regressions.
  React.useEffect(() => {
    try {
      console.assert(pct(50, 100) === 50, "pct basic");
      console.assert(variance(100, 120) === 20, "variance +");
      console.assert(variance(100, null) === null, "variance null");
      const csvEscaped = String('a\n"b"').replaceAll('"', '""').replaceAll(/\r?\n/g, " ");
      console.assert(csvEscaped === 'a ""b""', "csv escape");
    } catch (e) {
      console.warn("ICGRIS self-tests: non-fatal issue", e);
    }
  }, []);

  // -------- Derived filters --------
  const filteredContracts = React.useMemo(
    () =>
      contracts
        .filter((c) => activePkgs.includes(c.pkg))
        .filter((c) => c.title.toLowerCase().includes(search.toLowerCase())),
    [contracts, activePkgs, search]
  );

  const filteredProv = React.useMemo(() => provisionals.filter((p) => activePkgs.includes(p.pkg)), [provisionals, activePkgs]);

  const filteredCOs = React.useMemo(
    () =>
      cos
        .filter((co) => (coStatus === "All" ? true : co.status === coStatus))
        .filter((co) => activePkgs.includes(co.pkg))
        .filter((co) => co.title.toLowerCase().includes(search.toLowerCase()))
        .filter((co) => isWithinRange(co.date, timeRange)),
    [cos, coStatus, activePkgs, search, timeRange]
  );

  React.useEffect(() => {
    // simulate status filtering over mock data
    setCos(coStatus === "All" ? MOCK_COS : MOCK_COS.filter((r) => r.status === coStatus));
  }, [coStatus]);

  const filteredClaims = React.useMemo(
    () =>
      claims
        .filter((cl) => (claimStatus === "All" ? true : cl.status === claimStatus))
        .filter((cl) => activePkgs.includes(cl.pkg))
        .filter((cl) => cl.title.toLowerCase().includes(search.toLowerCase()))
        .filter((cl) => isWithinRange(cl.date, timeRange)),
    [claims, claimStatus, activePkgs, search, timeRange]
  );

  // -------- KPIs --------
  const totalValue = React.useMemo(() => filteredContracts.reduce((acc, c) => acc + (c.contractValue || 0), 0), [filteredContracts]);
  const totalPaid = React.useMemo(() => filteredContracts.reduce((acc, c) => acc + (c.paidToDate || 0), 0), [filteredContracts]);
  const paidPct = pct(totalPaid, totalValue);

  // ---------- Chart data ----------
  const paymentsPctByPkg = React.useMemo(
    () => ALL_PKGS.map((p) => {
      const c = contracts.find((x) => x.pkg === p);
      const val = c ? pct(c.paidToDate, c.contractValue) : 0;
      return { pkg: p, value: val };
    }),
    [contracts]
  );

  const coStatusCounts = React.useMemo(() => {
    const m: Record<string, number> = { Proposed: 0, "In Review": 0, Approved: 0, Rejected: 0 };
    MOCK_COS.forEach((x) => (m[x.status] = (m[x.status] ?? 0) + 1));
    return m;
  }, []);

  const claimStatusCounts = React.useMemo(() => {
    const m: Record<string, number> = { Submitted: 0, "In Review": 0, Approved: 0, Rejected: 0 };
    MOCK_CLAIMS.forEach((x) => (m[x.status] = (m[x.status] ?? 0) + 1));
    return m;
  }, []);

  // ---------- Handlers ----------
  const togglePkg = (pkg: string) =>
    setActivePkgs((prev) => (prev.includes(pkg) ? prev.filter((p) => p !== pkg) : [...prev, pkg]));
  const selectAllPkgs = () => setActivePkgs([...ALL_PKGS]);
  const selectNonePkgs = () => setActivePkgs([]);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">ICGRIS Dashboard</h1>
          <p className="text-sm text-muted-foreground">Integrated Contract Governance & Risk Intelligence System</p>
        </div>
        <div className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-600">Frontend demo • Mock data only</div>
      </div>

      {/* Filters (global) */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-500">Role</div>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <Button key={r} size="sm" variant={role === r ? "default" : "secondary"} onClick={() => setRole(r)}>
                    {r}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <div className="text-xs font-medium text-slate-500">Packages</div>
              <div className="flex flex-wrap items-center gap-2">
                {ALL_PKGS.map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={activePkgs.includes(p) ? "default" : "secondary"}
                    className={clsx("px-3", activePkgs.includes(p) ? "" : "opacity-80")}
                    onClick={() => togglePkg(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button size="sm" variant="ghost" onClick={selectAllPkgs}>
                  All
                </Button>
                <Button size="sm" variant="ghost" onClick={selectNonePkgs}>
                  None
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Time range only – CO/Claim status filters moved into their own sections */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-500">Time</div>
              <div className="flex flex-wrap gap-2">
                {([
                  { k: "All", label: "All" },
                  { k: "30d", label: "Last 30d" },
                  { k: "90d", label: "Last 90d" },
                  { k: "365d", label: "Last Year" },
                ] as const).map(({ k, label }) => (
                  <Button key={k} size="sm" variant={timeRange === k ? "default" : "secondary"} onClick={() => setTimeRange(k)}>
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search titles…" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Total Contract Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{currency(totalValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Paid to Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{currency(totalPaid)}</div>
            <div className="mt-3 space-y-1">
              <Progress value={paidPct} />
              <div className="text-xs text-slate-500">Overall % paid — {paidPct}%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Change Orders (COs)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{filteredCOs.length}</div>
            <div className="text-xs text-muted-foreground">{Object.entries(coStatusCounts).filter(([k]) => k === "Approved").map(([,v]) => `${v} approved`)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Active Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{activePkgs.length} / {ALL_PKGS.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Visual Summary (simple SVG charts to avoid deps) */}
      <div className="mt-8">
        <h2 className="mb-3 text-xl font-semibold">Visual Summary</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Payments by Package (% Paid)</CardTitle>
            </CardHeader>
            <CardContent>
              <svg viewBox="0 0 900 260" className="w-full">
                {/* axes */}
                <line x1="40" y1="20" x2="40" y2="230" stroke="#999" />
                <line x1="40" y1="230" x2="880" y2="230" stroke="#999" />
                {paymentsPctByPkg.map((d, i) => {
                  const barWidth = 60;
                  const gap = 40;
                  const x = 60 + i * (barWidth + gap);
                  const h = (d.value / 65) * 200; // normalize to 65%
                  const y = 230 - h;
                  return (
                    <g key={d.pkg}>
                      <rect x={x} y={y} width={barWidth} height={h} fill="#3b82f6" />
                      <text x={x + barWidth / 2} y={245} textAnchor="middle" fontSize="14">{d.pkg}</text>
                    </g>
                  );
                })}
              </svg>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">COs by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie counts={coStatusCounts} labels={["Approved","In Review","Proposed","Rejected"]} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Claims by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Pie counts={claimStatusCounts} labels={["Approved","In Review","Submitted","Rejected"]} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payments by Contract */}
      <div className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Payments by Contract</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredContracts.map((c) => {
            const per = pct(c.paidToDate, c.contractValue);
            const color = packageColor[c.pkg] || "bg-slate-600";
            return (
              <Card key={`${c.pkg}-${c.title}`}>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {c.title}
                    <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-white" style={{ background: "none" }}>
                      <span className={clsx("inline-block h-6 w-6 rounded-full", color)} />
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{per}%</div>
                  <div className="mt-3 space-y-1">
                    <Progress value={per} />
                    <div className="text-xs text-slate-500">Paid: {currency(c.paidToDate)} • Value: {currency(c.contractValue)}</div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline" onClick={() => setDetailsFor(c)}>
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Provisional Sum Utilization */}
      <div className="mt-10">
        <h2 className="mb-3 text-xl font-semibold">Provisional Sum Utilization</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredProv.map((p) => {
            const color = packageColor[p.pkg] || "bg-slate-600";
            const Bar = ({ value }: { value: number }) => (
              <div className="flex items-center gap-3">
                <div className="h-2 w-full rounded bg-slate-200">
                  <div className={clsx("h-2 rounded", color)} style={{ width: `${value}%` }} />
                </div>
                <div className="w-10 text-right text-xs">{value}%</div>
              </div>
            );
            return (
              <Card key={`prov-${p.pkg}`}>
                <CardHeader>
                  <CardTitle className="text-sm">Package {p.pkg}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-xs text-slate-500">Used</div>
                  <Bar value={Math.round(p.used)} />
                  <div className="text-xs text-slate-500">Approved</div>
                  <Bar value={Math.round(p.approved)} />
                  <div className="text-xs text-slate-500">Pending</div>
                  <Bar value={Math.round(p.pending)} />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Change Orders */}
      <div className="mt-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Change Orders (COs)</h2>
          <div className="flex flex-wrap items-center gap-2">
            {CO_STATUSES.map((s) => (
              <Button key={s} size="sm" variant={coStatus === s ? "default" : "secondary"} onClick={() => setCoStatus(s)}>
                {s}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                downloadCSV(
                  "change_orders.csv",
                  filteredCOs.map((r) => ({
                    id: r.id,
                    pkg: r.pkg,
                    title: r.title,
                    status: r.status,
                    estimated: r.estimated,
                    actual: r.actual ?? "",
                    variance: variance(r.estimated, r.actual) ?? "",
                    date: r.date,
                  }))
                )
              }
            >
              Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CO ID</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Estimated</TableHead>
                  <TableHead className="text-right">Actual</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCOs.map((r) => {
                  const v = variance(r.estimated, r.actual);
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>
                        <span className={clsx("inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white", packageColor[r.pkg] || "bg-slate-600")}>{r.pkg}</span>
                      </TableCell>
                      <TableCell className="max-w-[380px] truncate">{r.title}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{r.status}</span>
                      </TableCell>
                      <TableCell className="text-right">{currency(r.estimated)}</TableCell>
                      <TableCell className="text-right">{r.actual == null ? "—" : currency(r.actual)}</TableCell>
                      <TableCell className={clsx("text-right", v == null ? "" : v > 0 ? "text-rose-600" : "text-emerald-600")}>{v == null ? "—" : `${v > 0 ? "AED " : "-AED "}${Math.abs(v).toLocaleString("en-US")}`}</TableCell>
                      <TableCell className="text-right">{r.date}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Claims */}
      <div className="mt-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Claims</h2>
          <div className="flex flex-wrap items-center gap-2">
            {CLAIM_STATUSES.map((s) => (
              <Button key={s} size="sm" variant={claimStatus === s ? "default" : "secondary"} onClick={() => setClaimStatus(s)}>
                {s}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() =>
                downloadCSV(
                  "claims.csv",
                  filteredClaims.map((r) => ({
                    id: r.id,
                    pkg: r.pkg,
                    title: r.title,
                    status: r.status,
                    claimed: r.claimed,
                    certified: r.certified ?? "",
                    variance: r.certified == null ? "" : r.certified - r.claimed,
                    daysOpen: r.daysOpen,
                    date: r.date,
                  }))
                )
              }
            >
              Export CSV
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Claimed</TableHead>
                  <TableHead className="text-right">Certified</TableHead>
                  <TableHead className="text-right">Variance</TableHead>
                  <TableHead className="text-right">Days Open</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.map((r) => {
                  const v = r.certified == null ? null : r.certified - r.claimed;
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>
                        <span className={clsx("inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white", packageColor[r.pkg] || "bg-slate-600")}>{r.pkg}</span>
                      </TableCell>
                      <TableCell className="max-w-[380px] truncate">{r.title}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{r.status}</span>
                      </TableCell>
                      <TableCell className="text-right">{currency(r.claimed)}</TableCell>
                      <TableCell className="text-right">{r.certified == null ? "—" : currency(r.certified)}</TableCell>
                      <TableCell className={clsx("text-right", v == null ? "" : v > 0 ? "text-rose-600" : "text-emerald-600")}>{v == null ? "—" : `${v > 0 ? "AED " : "-AED "}${Math.abs(v).toLocaleString("en-US")}`}</TableCell>
                      <TableCell className="text-right">{r.daysOpen}</TableCell>
                      <TableCell className="text-right">{r.date}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-10 pb-10 text-center text-xs text-slate-500">Local/static UI. No /app/api calls. Switchable to Google Sheets later.</footer>

      {/* Payments → Details Modal (IPCs & Advance Payment) */}
      <PaymentsDetailsModal open={!!detailsFor} onOpenChange={(v) => !v && setDetailsFor(null)} contract={detailsFor} />
    </div>
  );
}

// ------------------ Modal ------------------
function PaymentsDetailsModal({
  open,
  onOpenChange,
  contract,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
}) {
  const ipcs = React.useMemo(() => (contract ? MOCK_IPCS.filter((i) => i.pkg === contract.pkg) : []), [contract]);
  const ap = React.useMemo(() => (contract ? MOCK_AP.find((a) => a.pkg === contract.pkg) : undefined), [contract]);
  const apPct = ap ? pct(ap.recovered, ap.amount) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Payments Details</DialogTitle>
          <DialogDescription>
            {contract ? (
              <div className="mt-1 text-sm">
                <div className="font-medium text-foreground">Package {contract.pkg}</div>
                <div className="text-muted-foreground">{contract.title}</div>
              </div>
            ) : (
              <span className="text-muted-foreground">—</span>
            )}
          </DialogDescription>
        </DialogHeader>
        {/* Simple local tab switcher (removes dependency on '@/components/ui/tabs') */}
        {(() => {
          const [tab, setTab] = React.useState<'ipcs' | 'advance'>(() => 'ipcs');
          // We must return a React element from an IIFE, so wrap stateful content in a component
          function Body() {
            const [activeTab, setActiveTab] = React.useState<'ipcs' | 'advance'>(tab);
            React.useEffect(() => setActiveTab(tab), [tab]);
            return (
              <div className="mt-2">
                <div className="mb-3 inline-flex items-center gap-2">
                  <div className="inline-flex rounded-lg border p-1">
                    <Button size="sm" variant={activeTab === 'ipcs' ? 'default' : 'ghost'} onClick={() => setTab('ipcs')}>IPCs</Button>
                    <Button size="sm" variant={activeTab === 'advance' ? 'default' : 'ghost'} onClick={() => setTab('advance')}>Advance Payment</Button>
                  </div>
                </div>

                {activeTab === 'ipcs' ? (
                  ipcs.length > 0 ? (
                    <div className="rounded-xl border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>IPC No.</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Certified</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ipcs.map((i) => (
                            <TableRow key={i.ipcNo}>
                              <TableCell className="font-medium">{i.ipcNo}</TableCell>
                              <TableCell>{new Date(i.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })}</TableCell>
                              <TableCell className="text-right">{currency(i.certified)}</TableCell>
                              <TableCell>{i.status}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No IPCs recorded for this package.</div>
                  )
                ) : (
                  ap ? (
                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <Metric label="Advance Amount" value={currency(ap.amount)} />
                        <Metric label="Recovered" value={currency(ap.recovered)} />
                        <Metric label="Outstanding" value={currency(ap.amount - ap.recovered)} />
                      </div>
                      <div>
                        <div className="mb-2 flex items-center justify-between">
                          <div className="text-sm font-medium">Recovery Progress</div>
                          <div className="text-sm text-muted-foreground">{apPct}%</div>
                        </div>
                        <Progress value={apPct} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No advance payment data for this package.</div>
                  )
                )}
              </div>
            );
          }
          return <Body />;
        })()}


        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

// --- tiny SVG pie chart helper (keeps project dependency-free for demo) ---
function Pie({ counts, labels }: { counts: Record<string, number>; labels: string[] }) {
  const total = labels.reduce((acc, k) => acc + (counts[k] ?? 0), 0) || 1;
  const colors = ["#22c55e", "#eab308", "#ef4444", "#64748b"]; // green, amber, red, slate
  let angle = 0;
  const radius = 90;
  const cx = 140;
  const cy = 120;
  const slices = labels.map((k, i) => {
    const value = counts[k] ?? 0;
    const theta = (value / total) * Math.PI * 2;
    const x1 = cx + radius * Math.cos(angle);
    const y1 = cy + radius * Math.sin(angle);
    angle += theta;
    const x2 = cx + radius * Math.cos(angle);
    const y2 = cy + radius * Math.sin(angle);
    const largeArc = theta > Math.PI ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    return { path, fill: colors[i % colors.length], label: k, value };
  });
  return (
    <svg viewBox="0 0 280 240" className="w-full">
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.fill} />
      ))}
      {/* simple legend */}
      {slices.map((s, i) => (
        <g key={`lg-${i}`} transform={`translate(210, ${30 + i * 24})`}>
          <rect width="14" height="14" fill={s.fill} rx="2" />
          <text x="20" y="12" fontSize="12">{s.label} ({s.value})</text>
        </g>
      ))}
    </svg>
  );
}
