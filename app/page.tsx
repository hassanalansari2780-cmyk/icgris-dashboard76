"use client";

import * as React from "react";
import clsx from "clsx";

// --- UI components (your existing shadcn-like components) ---
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// ---- Lightweight table wrappers (local, to avoid export name mismatch) ----
const Table = (p: React.HTMLAttributes<HTMLTableElement>) => (
  <table {...p} className={clsx("w-full text-sm", p.className)} />
);
const Thead = (p: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead {...p} className={clsx("bg-slate-50", p.className)} />
);
const Tbody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p} />;
const Tr = (p: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr {...p} className={clsx("border-b last:border-b-0", p.className)} />
);
const Th = (p: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    {...p}
    className={clsx(
      "px-4 py-3 text-left font-medium text-slate-600 whitespace-nowrap",
      p.className
    )}
  />
);
const Td = (p: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    {...p}
    className={clsx("px-4 py-3 align-middle whitespace-nowrap", p.className)}
  />
);

// ------------------ Types ------------------
type Contract = {
  pkg: string;
  title: string;
  contractValue: number;
  paidToDate: number;
};

type Provisional = {
  pkg: string;
  used: number;      // percent 0..100
  approved: number;  // percent 0..100
  pending: number;   // percent 0..100
};

type CO = {
  id: string;
  pkg: string;
  title: string;
  status: "Proposed" | "In Review" | "Approved" | "Rejected" | string;
  estimated: number;
  actual: number | null;
  date: string; // ISO
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

// Per-package color tokens
const packageColor: Record<string, string> = {
  A: "bg-blue-600",
  B: "bg-emerald-600",
  C: "bg-violet-600",
  D: "bg-rose-600",
  F: "bg-amber-600",
  G: "bg-cyan-600",
  I2: "bg-indigo-600",
  PMEC: "bg-slate-700",
};

// ------------------ Mock Data (safe to demo) ------------------
const MOCK_CONTRACTS: Contract[] = [
  { pkg: "A", title: "Package A - Systems",     contractValue: 120_000_000, paidToDate: 48_000_000 },
  { pkg: "B", title: "Package B - Track",       contractValue: 95_000_000,  paidToDate: 41_000_000 },
  { pkg: "C", title: "Package C - Civil",       contractValue: 180_000_000, paidToDate: 72_000_000 },
  { pkg: "D", title: "Package D - Stations",    contractValue: 85_000_000,  paidToDate: 19_000_000 },
  { pkg: "F", title: "Package F - Rolling Stock", contractValue: 210_000_000, paidToDate: 109_000_000 },
  { pkg: "G", title: "Package G - O&M",         contractValue: 60_000_000,  paidToDate: 9_500_000 },
  { pkg: "I2", title: "Package I2 - Integration", contractValue: 35_000_000, paidToDate: 11_000_000 },
  { pkg: "PMEC", title: "PMEC - Consulting",    contractValue: 18_000_000,  paidToDate: 7_000_000 },
];

const MOCK_PROV: Provisional[] = [
  { pkg: "A", used: 30, approved: 22, pending: 8 },
  { pkg: "B", used: 45, approved: 35, pending: 10 },
  { pkg: "C", used: 50, approved: 45, pending: 5 },
  { pkg: "D", used: 18, approved: 16, pending: 2 },
  { pkg: "F", used: 55, approved: 52, pending: 3 },
  { pkg: "G", used: 20, approved: 16, pending: 4 },
  { pkg: "I2", used: 35, approved: 31, pending: 4 },
  { pkg: "PMEC", used: 40, approved: 39, pending: 1 },
];

const MOCK_COS: CO[] = [
  { id: "CO-A-001", pkg: "A",  title: "Scope Interface Adjustment", status: "In Review", estimated: 3_200_000, actual: null,       date: "2025-09-05" },
  { id: "CO-A-002", pkg: "A",  title: "Cybersecurity Upgrade",      status: "Proposed",  estimated: 1_150_000, actual: null,       date: "2025-10-10" },
  { id: "CO-B-001", pkg: "B",  title: "Ballast Spec Update",        status: "Approved",  estimated: 2_000_000, actual: 1_850_000,  date: "2025-07-22" },
  { id: "CO-C-004", pkg: "C",  title: "Retaining Wall Change",      status: "Approved",  estimated: 4_900_000, actual: 5_200_000,  date: "2025-03-30" },
  { id: "CO-D-003", pkg: "D",  title: "Station Canopy Redesign",    status: "In Review", estimated: 2_700_000, actual: null,       date: "2025-09-18" },
  { id: "CO-F-002", pkg: "F",  title: "Brake System Mod",           status: "Proposed",  estimated: 6_000_000, actual: null,       date: "2025-10-08" },
  { id: "CO-G-005", pkg: "G",  title: "Maintenance Tooling",        status: "Approved",  estimated:   800_000, actual:   780_000,  date: "2025-05-11" },
  { id: "CO-I2-002", pkg: "I2", title: "Interface Test Extension",  status: "Proposed",  estimated:   450_000, actual: null,       date: "2025-09-29" },
  { id: "CO-PMEC-001", pkg: "PMEC", title: "Additional Studies",    status: "Approved",  estimated:   300_000, actual:   290_000,  date: "2025-02-14" },
];

const MOCK_CLAIMS: Claim[] = [
  { id: "CL-A-007", pkg: "A", title: "IPCs 5–7 Adjustments", status: "In Review", claimed: 2_400_000, certified: null,     daysOpen: 14, date: "2025-10-13" },
  { id: "CL-B-003", pkg: "B", title: "Track Weld Overbreak", status: "Submitted", claimed: 1_050_000, certified: null,     daysOpen: 4,  date: "2025-10-26" },
  { id: "CL-C-011", pkg: "C", title: "Concrete Rework",      status: "Approved",  claimed: 3_150_000, certified: 3_060_000,daysOpen: 0,  date: "2025-09-09" },
  { id: "CL-F-004", pkg: "F", title: "OEM Inspection Delay", status: "Rejected",  claimed:   600_000, certified: 0,        daysOpen: 0,  date: "2025-08-01" },
];

// ------------------ Utils ------------------
const currency = (v: number) =>
  `AED ${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

const pct = (num: number, den: number) =>
  den > 0 ? Math.round((num / den) * 100) : 0;

const variance = (est: number, act: number | null) =>
  act == null ? null : act - est;

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
    `"${String(s ?? "").replaceAll(`"`, `""`).replaceAll(/\n/g, " ")}"`;
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
  // NOTE: Local state seeded from mock data (no fetch /api/* needed)
  const [contracts] = React.useState<Contract[]>(MOCK_CONTRACTS);
  const [provisionals] = React.useState<Provisional[]>(MOCK_PROV);
  const [cos] = React.useState<CO[]>(MOCK_COS);
  const [claims] = React.useState<Claim[]>(MOCK_CLAIMS);

  // UI state
  const [role, setRole] = React.useState<(typeof ROLES)[number]>("All");
  const [activePkgs, setActivePkgs] = React.useState<string[]>([...ALL_PKGS]);
  const [search, setSearch] = React.useState("");
  const [coStatus, setCoStatus] = React.useState<
    "All" | "Proposed" | "In Review" | "Approved" | "Rejected"
  >("All");
  const [claimStatus, setClaimStatus] = React.useState<
    "All" | "Submitted" | "In Review" | "Approved" | "Rejected"
  >("All");
  const [timeRange, setTimeRange] = React.useState<"All" | "30d" | "90d" | "365d">("All");

  // -------- Derived filters --------
  const filteredContracts = React.useMemo(
    () =>
      contracts
        .filter((c) => activePkgs.includes(c.pkg))
        .filter((c) => c.title.toLowerCase().includes(search.toLowerCase())),
    [contracts, activePkgs, search]
  );

  const filteredProv = React.useMemo(
    () => provisionals.filter((p) => activePkgs.includes(p.pkg)),
    [provisionals, activePkgs]
  );

  const filteredCOs = React.useMemo(
    () =>
      cos
        .filter((co) => activePkgs.includes(co.pkg))
        .filter((co) => (coStatus === "All" ? true : co.status === coStatus))
        .filter((co) => co.title.toLowerCase().includes(search.toLowerCase()))
        .filter((co) => isWithinRange(co.date, timeRange)),
    [cos, activePkgs, search, timeRange, coStatus]
  );

  const filteredClaims = React.useMemo(
    () =>
      claims
        .filter((cl) => activePkgs.includes(cl.pkg))
        .filter((cl) => (claimStatus === "All" ? true : cl.status === claimStatus))
        .filter((cl) => cl.title.toLowerCase().includes(search.toLowerCase()))
        .filter((cl) => isWithinRange(cl.date, timeRange)),
    [claims, activePkgs, search, timeRange, claimStatus]
  );

  // -------- KPIs --------
  const totalValue = React.useMemo(
    () => filteredContracts.reduce((acc, c) => acc + (c.contractValue || 0), 0),
    [filteredContracts]
  );
  const totalPaid = React.useMemo(
    () => filteredContracts.reduce((acc, c) => acc + (c.paidToDate || 0), 0),
    [filteredContracts]
  );
  const paidPct = pct(totalPaid, totalValue);

  // ---------- Handlers ----------
  const togglePkg = (pkg: string) =>
    setActivePkgs((prev) =>
      prev.includes(pkg) ? prev.filter((p) => p !== pkg) : [...prev, pkg]
    );

  const selectAllPkgs = () => setActivePkgs([...ALL_PKGS]);
  const selectNonePkgs = () => setActivePkgs([]);

  // ---------- UI ----------
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">ICGRIS Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Integrated Contract Governance & Risk Intelligence System
          </p>
        </div>

        <div className="text-xs rounded-full bg-slate-100 px-3 py-1 text-slate-600">
          Frontend demo • Local mock data (no API)
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-500">Role</div>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <Button
                    key={r}
                    size="sm"
                    variant={role === r ? "default" : "secondary"}
                    onClick={() => setRole(r)}
                  >
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
            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-500">CO Status</div>
              <div className="flex flex-wrap gap-2">
                {(["All", "Proposed", "In Review", "Approved", "Rejected"] as const).map(
                  (s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={coStatus === s ? "default" : "secondary"}
                      onClick={() => setCoStatus(s)}
                    >
                      {s}
                    </Button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-500">Claim Status</div>
              <div className="flex flex-wrap gap-2">
                {(["All", "Submitted", "In Review", "Approved", "Rejected"] as const).map(
                  (s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={claimStatus === s ? "default" : "secondary"}
                      onClick={() => setClaimStatus(s)}
                    >
                      {s}
                    </Button>
                  )
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-medium text-slate-500">Time</div>
              <div className="flex flex-wrap gap-2">
                {([
                  { k: "All", label: "All" },
                  { k: "30d", label: "Last 30d" },
                  { k: "90d", label: "Last 90d" },
                  { k: "365d", label: "Last Year" },
                ] as const).map(({ k, label }) => (
                  <Button
                    key={k}
                    size="sm"
                    variant={timeRange === k ? "default" : "secondary"}
                    onClick={() => setTimeRange(k)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles…"
            />
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-500">Active Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {activePkgs.length} / {ALL_PKGS.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments by Contract */}
      <div className="mt-8">
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
                    <span
                      className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs text-white"
                      style={{ background: "none" }}
                    >
                      <span className={clsx("inline-block h-6 w-6 rounded-full", color)} />
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">{per}%</div>
                  <div className="mt-3 space-y-1">
                    <Progress value={per} />
                    <div className="text-xs text-slate-500">
                      Paid: {currency(c.paidToDate)} • Value: {currency(c.contractValue)}
                    </div>
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Change Orders (COs)</h2>
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

        <Card>
          <CardContent className="px-0">
            <Table>
              <Thead>
                <Tr>
                  <Th>CO ID</Th>
                  <Th>Package</Th>
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Estimated</Th>
                  <Th className="text-right">Actual</Th>
                  <Th className="text-right">Variance</Th>
                  <Th className="text-right">Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredCOs.map((r) => {
                  const v = variance(r.estimated, r.actual);
                  return (
                    <Tr key={r.id}>
                      <Td className="font-medium">{r.id}</Td>
                      <Td>
                        <span
                          className={clsx(
                            "inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white",
                            packageColor[r.pkg] || "bg-slate-600"
                          )}
                        >
                          {r.pkg}
                        </span>
                      </Td>
                      <Td className="max-w-[380px] truncate">{r.title}</Td>
                      <Td>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                          {r.status}
                        </span>
                      </Td>
                      <Td className="text-right">{currency(r.estimated)}</Td>
                      <Td className="text-right">
                        {r.actual == null ? "—" : currency(r.actual)}
                      </Td>
                      <Td
                        className={clsx(
                          "text-right",
                          v == null ? "" : v > 0 ? "text-rose-600" : "text-emerald-600"
                        )}
                      >
                        {v == null ? "—" : `${v > 0 ? "AED " : "-AED "}${Math.abs(v).toLocaleString("en-US")}`}
                      </Td>
                      <Td className="text-right">{r.date}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Claims */}
      <div className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Claims</h2>
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

        <Card>
          <CardContent className="px-0">
            <Table>
              <Thead>
                <Tr>
                  <Th>Claim ID</Th>
                  <Th>Package</Th>
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Claimed</Th>
                  <Th className="text-right">Certified</Th>
                  <Th className="text-right">Variance</Th>
                  <Th className="text-right">Days Open</Th>
                  <Th className="text-right">Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredClaims.map((r) => {
                  const v = r.certified == null ? null : r.certified - r.claimed;
                  return (
                    <Tr key={r.id}>
                      <Td className="font-medium">{r.id}</Td>
                      <Td>
                        <span
                          className={clsx(
                            "inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white",
                            packageColor[r.pkg] || "bg-slate-600"
                          )}
                        >
                          {r.pkg}
                        </span>
                      </Td>
                      <Td className="max-w-[380px] truncate">{r.title}</Td>
                      <Td>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">
                          {r.status}
                        </span>
                      </Td>
                      <Td className="text-right">{currency(r.claimed)}</Td>
                      <Td className="text-right">
                        {r.certified == null ? "—" : currency(r.certified)}
                      </Td>
                      <Td
                        className={clsx(
                          "text-right",
                          v == null ? "" : v > 0 ? "text-rose-600" : "text-emerald-600"
                        )}
                      >
                        {v == null ? "—" : `${v > 0 ? "AED " : "-AED "}${Math.abs(v).toLocaleString("en-US")}`}
                      </Td>
                      <Td className="text-right">{r.daysOpen}</Td>
                      <Td className="text-right">{r.date}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-10 pb-10 text-center text-xs text-slate-500">
        Local/static UI. When ready, we’ll swap mock arrays for Google Sheets via /api/*.
      </footer>
    </div>
  );
}
