/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";

type Pill = { key: string; label: string };

function PillBar({
  pills,
  active,
  onChange,
}: {
  pills: Pill[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="flex gap-4 flex-wrap">
      {pills.map((p) => {
        const isActive = p.key === active;
        return (
          <button
            key={p.key}
            onClick={() => onChange(p.key)}
            className={[
              "px-6 py-3 rounded-full text-base font-semibold transition-colors",
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200",
            ].join(" ")}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

/** --------------------------
 * Utilities
 * -------------------------- */
const fmtCurr = (n?: number | null) =>
  n == null ? "—" : `AED ${n.toLocaleString("en-US")}`;

const fmtPct = (n: number) => `${Math.round(n)}%`;

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

type Status =
  | "Proposed"
  | "In Review"
  | "Approved"
  | "Rejected"
  | "Submitted"
  | "Certified";

/** --------------------------
 * Small UI Primitives
 * -------------------------- */
const Card = ({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({
  title,
  right,
}: {
  title?: string;
  right?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between px-5 py-4">
    {title ? <h3 className="font-semibold text-gray-900">{title}</h3> : <div />}
    {right}
  </div>
);

const CardBody = ({
  children,
  className = "",
}: React.PropsWithChildren<{ className?: string }>) => (
  <div className={`px-5 pb-5 ${className}`}>{children}</div>
);

const Pill = ({
  children,
  active,
  onClick,
}: React.PropsWithChildren<{ active?: boolean; onClick?: () => void }>) => (
  <button
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
      active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

const StatusPill = ({ status }: { status: Status }) => {
  const map: Record<Status, string> = {
    Proposed: "bg-amber-100 text-amber-800",
    "In Review": "bg-blue-100 text-blue-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-rose-100 text-rose-800",
    Submitted: "bg-gray-100 text-gray-700",
    Certified: "bg-zinc-100 text-zinc-700",
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${map[status]}`}>
      {status}
    </span>
  );
};

const Progress = ({ value }: { value: number }) => (
  <div className="h-2 w-full rounded-full bg-gray-200">
    <div
      className="h-2 rounded-full bg-gray-900"
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

/** --------------------------
 * Demo Data
 * -------------------------- */
type IPC = {
  id: string;
  date: string; // ISO
  claimed?: number | null; // Claimed (requested)
  certified?: number | null; // Certified (approved)
  status: Status;
};

type AdvancePayment = {
  amount: number;
  recovered: number;
  balance: number;
  status: "Not Started" | "Ongoing" | "Fully Recovered";
  guaranteeNo?: string;
  startIPC?: string;
};

type PaymentPkg = {
  id: "A" | "B" | "C" | "D" | "F" | "G" | "I2" | "PMEC";
  title: string;
  value: number;
  paid: number;
  color: string;
  ipcs: IPC[];
  ap: AdvancePayment; // NEW
};

const payments: PaymentPkg[] = [
  {
    id: "A",
    title: "Package A - Systems",
    value: 120_000_000,
    paid: 48_000_000,
    color: "ring-blue-500",
    ipcs: [
      { id: "IPC 05", date: "2025-09-20", claimed: 360000, certified: 325000, status: "Certified" },
      { id: "IPC 06", date: "2025-10-21", claimed: 525000, certified: 510207, status: "Certified" },
    ],
    ap: {
      amount: 2_000_000,
      recovered: 835_207,
      balance: 1_164_793,
      status: "Ongoing",
      guaranteeNo: "HSBC-APG-0001",
      startIPC: "IPC 05",
    },
  },
  {
    id: "B",
    title: "Package B - Track",
    value: 95_000_000,
    paid: 41_000_000,
    color: "ring-emerald-600",
    ipcs: [
      { id: "IPC 03", date: "2025-08-11", claimed: 410000, certified: 390000, status: "Certified" },
      { id: "IPC 04", date: "2025-09-27", claimed: 275000, certified: 260000, status: "Certified" },
    ],
    ap: {
      amount: 1_500_000,
      recovered: 650_000,
      balance: 850_000,
      status: "Ongoing",
      guaranteeNo: "HSBC-APG-0002",
      startIPC: "IPC 03",
    },
  },
  {
    id: "C",
    title: "Package C - Civil",
    value: 180_000_000,
    paid: 72_000_000,
    color: "ring-orange-600",
    ipcs: [{ id: "IPC 07", date: "2025-08-30", claimed: 900000, certified: 870000, status: "Certified" }],
    ap: { amount: 2_700_000, recovered: 2_700_000, balance: 0, status: "Fully Recovered", guaranteeNo: "HSBC-APG-0003", startIPC: "IPC 06" },
  },
  {
    id: "D",
    title: "Package D - Stations",
    value: 85_000_000,
    paid: 19_000_000,
    color: "ring-red-600",
    ipcs: [{ id: "IPC 05", date: "2025-07-12", claimed: 220000, certified: 200000, status: "Certified" }],
    ap: { amount: 1_000_000, recovered: 240_000, balance: 760_000, status: "Ongoing", guaranteeNo: "HSBC-APG-0004", startIPC: "IPC 04" },
  },
  {
    id: "F",
    title: "Package F - Rolling Stock",
    value: 210_000_000,
    paid: 109_000_000,
    color: "ring-violet-600",
    ipcs: [{ id: "IPC 10", date: "2025-09-05", claimed: 1_200_000, certified: 1_150_000, status: "Certified" }],
    ap: { amount: 3_500_000, recovered: 1_500_000, balance: 2_000_000, status: "Ongoing", guaranteeNo: "HSBC-APG-0005", startIPC: "IPC 08" },
  },
  {
    id: "G",
    title: "Package G - O&M",
    value: 60_000_000,
    paid: 9_500_000,
    color: "ring-teal-600",
    ipcs: [{ id: "IPC 02", date: "2025-10-10", claimed: 300000, certified: 290000, status: "Certified" }],
    ap: { amount: 800_000, recovered: 80_000, balance: 720_000, status: "Ongoing", guaranteeNo: "HSBC-APG-0006", startIPC: "IPC 02" },
  },
  {
    id: "I2",
    title: "Package I2 - Integration",
    value: 35_000_000,
    paid: 11_000_000,
    color: "ring-orange-600",
    ipcs: [{ id: "IPC 04", date: "2025-09-18", claimed: 450000, certified: 430000, status: "Certified" }],
    ap: { amount: 500_000, recovered: 0, balance: 500_000, status: "Not Started", guaranteeNo: "HSBC-APG-0007" },
  },
  {
    id: "PMEC",
    title: "PMEC - Consulting",
    value: 18_000_000,
    paid: 7_000_000,
    color: "ring-violet-600",
    ipcs: [{ id: "IPC 06", date: "2025-10-08", claimed: 200000, certified: 190000, status: "Certified" }],
    ap: { amount: 250_000, recovered: 190_000, balance: 60_000, status: "Ongoing", guaranteeNo: "HSBC-APG-0008", startIPC: "IPC 05" },
  },
];

type CO = {
  id: string;
  pkg: PaymentPkg["id"];
  title: string;
  status: Status;
  estimated?: number | null;
  actual?: number | null;
  date: string; // ISO
};
const cos: CO[] = [
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

type Claim = {
  id: string;
  pkg: PaymentPkg["id"];
  title: string;
  status: Status | "Submitted";
  claimed: number;
  certified?: number | null;
  date: string;
};

const claims: Claim[] = [
  { id: "CLM-A-001", pkg: "A", title: "Interface Delay (Vendor A)", status: "In Review", claimed: 1_200_000, certified: null, date: "2025-10-02" },
  { id: "CLM-B-002", pkg: "B", title: "Ballast Rework", status: "Submitted", claimed: 850_000, certified: null, date: "2025-10-15" },
  { id: "CLM-C-003", pkg: "C", title: "Unforeseen Utilities", status: "Approved", claimed: 2_100_000, certified: 1_950_000, date: "2025-08-21" },
  { id: "CLM-D-001", pkg: "D", title: "Design Change Impacts", status: "Rejected", claimed: 900_000, certified: 0, date: "2025-07-03" },
  { id: "CLM-F-004", pkg: "F", title: "Supplier Late Deliveries", status: "In Review", claimed: 1_750_000, certified: null, date: "2025-10-10" },
  { id: "CLM-G-002", pkg: "G", title: "O&M Mobilization Overlaps", status: "Submitted", claimed: 300_000, certified: null, date: "2025-10-17" },
  { id: "CLM-I2-001", pkg: "I2", title: "Integration Test Overruns", status: "Approved", claimed: 600_000, certified: 540_000, date: "2025-09-05" },
  { id: "CLM-PMEC-1", pkg: "PMEC", title: "Additional Study Hours", status: "Approved", claimed: 200_000, certified: 190_000, date: "2025-10-08" },
];

/** --------------------------
 * IPCs + Advance Payment Modal
 * -------------------------- */
function IPCsModal({
  open,
  onClose,
  pkg,
}: {
  open: boolean;
  onClose: () => void;
  pkg: PaymentPkg | null;
}) {
  const [tab, setTab] = React.useState<"ipcs" | "ap">("ipcs");
  React.useEffect(() => {
    if (open) setTab("ipcs");
  }, [open]);

  if (!open || !pkg) return null;

  // AP status visual color
  const apColor =
    pkg.ap.status === "Fully Recovered"
      ? "text-emerald-700"
      : pkg.ap.status === "Ongoing"
      ? "text-amber-700"
      : "text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-lg font-semibold">{pkg.title}</h3>
          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b px-6 pt-3">
          <button
            onClick={() => setTab("ipcs")}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${
              tab === "ipcs" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500"
            }`}
          >
            IPCs
          </button>
          <button
            onClick={() => setTab("ap")}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${
              tab === "ap" ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500"
            }`}
          >
            Advance Payment
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {tab === "ipcs" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="py-3">IPC No.</th>
                    <th className="py-3">Date</th>
                    <th className="py-3">Claimed</th>
                    <th className="py-3">Certified</th>
                    <th className="py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pkg.ipcs.map((r) => (
                    <tr key={r.id} className="border-t text-sm">
                      <td className="py-3 font-medium">{r.id}</td>
                      <td className="py-3">{fmtDate(r.date)}</td>
                      <td className="py-3">{fmtCurr(r.claimed)}</td>
                      <td className="py-3">{fmtCurr(r.certified)}</td>
                      <td className="py-3">
                        <StatusPill status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary tiles */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader title="Advance Amount" />
                  <CardBody>
                    <div className="text-xl font-bold">{fmtCurr(pkg.ap.amount)}</div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader title="Recovered to Date" />
                  <CardBody>
                    <div className="text-xl font-bold">{fmtCurr(pkg.ap.recovered)}</div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader title="Balance" />
                  <CardBody>
                    <div className="text-xl font-bold">{fmtCurr(pkg.ap.balance)}</div>
                  </CardBody>
                </Card>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-600">Status: </span>
                  <span className={`font-semibold ${apColor}`}>{pkg.ap.status}</span>
                </div>
                {pkg.ap.guaranteeNo && (
                  <div>
                    <span className="text-gray-600">Guarantee: </span>
                    <span className="font-semibold">{pkg.ap.guaranteeNo}</span>
                  </div>
                )}
                {pkg.ap.startIPC && (
                  <div>
                    <span className="text-gray-600">Recovery started from: </span>
                    <span className="font-semibold">{pkg.ap.startIPC}</span>
                  </div>
                )}
              </div>

              {/* Tiny breakdown list (optional) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-sm text-gray-600">
                      <th className="py-3">Reference</th>
                      <th className="py-3">Description</th>
                      <th className="py-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t text-sm">
                      <td className="py-3">AP Granted</td>
                      <td className="py-3">Advance payment principal</td>
                      <td className="py-3">{fmtCurr(pkg.ap.amount)}</td>
                    </tr>
                    <tr className="border-t text-sm">
                      <td className="py-3">Recovered</td>
                      <td className="py-3">Deductions across IPCs</td>
                      <td className="py-3">{fmtCurr(pkg.ap.recovered)}</td>
                    </tr>
                    <tr className="border-t text-sm">
                      <td className="py-3">Balance</td>
                      <td className="py-3">Remaining to be recovered</td>
                      <td className="py-3">{fmtCurr(pkg.ap.balance)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** --------------------------
 * Main Page
 * -------------------------- */
export default function Page() {
  const [selectedPkgs, setSelectedPkgs] = React.useState<PaymentPkg["id"][]>(
    ["A", "B", "C", "D", "F", "G", "I2", "PMEC"]
  );
  const [search, setSearch] = React.useState("");
const [time, setTime] = React.useState<"All" | "30d" | "60d" | "90d" | "YTD">("All");
const inTimeRange = React.useCallback((iso: string) => {
  if (time === "All") return true;

  const d = new Date(iso);
  const now = new Date();

  if (time === "YTD") {
    const jan1 = new Date(now.getFullYear(), 0, 1);
    return d >= jan1 && d <= now;
  }

  const days = time === "30d" ? 30 : time === "60d" ? 60 : 90;
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);
  return d >= cutoff && d <= now;
}, [time]);
  
const TIME_OPTIONS = [
  { label: "All",      key: "All"  as const },
  { label: "Last 30d", key: "30d"  as const },
  { label: "Last 60d", key: "60d"  as const },
  { label: "Last 90d", key: "90d"  as const },
  { label: "YTD",      key: "YTD"  as const },
] as const;
  
  // IPCs Modal
  const [modalPkg, setModalPkg] = React.useState<PaymentPkg | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const openIPCs = (pkg: PaymentPkg) => {
    setModalPkg(pkg);
    setOpenModal(true);
  };
  
// --- CO filter state ---
const CO_STATUSES = ["All", "Proposed", "In Review", "Approved", "Rejected"] as const;
const [coFilter, setCoFilter] = React.useState<(typeof CO_STATUSES)[number]>("All");

// --- CLAIMS filter state ---
const CLAIM_STATUSES = ["All", "Submitted", "In Review", "Approved", "Rejected"] as const;
const [claimFilter, setClaimFilter] =
  React.useState<(typeof CLAIM_STATUSES)[number]>("All");

// ONE unified filtered array for COs: package + search + status pill
const cosFiltered = React.useMemo(() => {
  return cos.filter((c) =>
    selectedPkgs.includes(c.pkg) &&
    (search ? c.title.toLowerCase().includes(search.toLowerCase()) : true) &&
    (coFilter === "All" ? true : (c.status || "").trim() === coFilter)
  );
}, [cos, selectedPkgs, search, coFilter]);

// ONE unified filtered array for Claims: package + search + status pill
const claimsFiltered = React.useMemo(() => {
  return claims.filter((c) =>
    selectedPkgs.includes(c.pkg) &&
    (search ? c.title.toLowerCase().includes(search.toLowerCase()) : true) &&
    (claimFilter === "All" ? true : (c.status || "").trim() === claimFilter) &&
    inTimeRange(c.date) // ✅ NEW
  );
}, [claims, selectedPkgs, search, claimFilter, time]);




  // derived totals
  const visiblePkgs = payments.filter((p) => selectedPkgs.includes(p.id));
  const totalValue = visiblePkgs.reduce((s, p) => s + p.value, 0);
  const totalPaid = visiblePkgs.reduce((s, p) => s + p.paid, 0);
  const percentPaid = (totalPaid / totalValue) * 100;

  const togglePkg = (id: PaymentPkg["id"]) => {
    setSelectedPkgs((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allPkgs = [
    "A",
    "B",
    "C",
    "D",
    "F",
    "G",
    "I2",
    "PMEC",
  ] as PaymentPkg["id"][];

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto max-w-7xl px-6 pt-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          ICGRIS Dashboard
        </h1>
        <p className="mt-1 text-gray-600">
          Integrated Contract Governance &amp; Risk Intelligence System
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20">
{/* Filters */}
<Card className="mt-6">
  <CardBody className="pt-5">
    <div className="mt-5 flex flex-wrap items-center gap-2">
      <div className="mr-2 font-semibold">Packages:</div>

      {allPkgs.map((p) => {
        const active = selectedPkgs.includes(p);
        return (
          <button
            key={p}
            onClick={() => togglePkg(p)}
            className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
              active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
          >
            {p}
          </button>
        );
      })}

      <button
        className="ml-2 rounded-full px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        onClick={() => setSelectedPkgs(allPkgs)}
      >
        All
      </button>
      <button
        className="rounded-full px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
        onClick={() => setSelectedPkgs([])}
      >
        None
      </button>

      {/* search + time pills */}
      <div className="ml-auto flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search titles..."
          className="w-72 rounded-xl border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-gray-900"
        />

        <div className="hidden items-center gap-2 md:flex">
          {TIME_OPTIONS.map((t) => (
            <Pill
              key={t.key}
              active={time === t.key}
              onClick={() => setTime(t.key)}
            >
              {t.label}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  </CardBody>
</Card>

        {/* KPI Cards */}
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader title="Total Contract Value" />
            <CardBody>
              <div className="text-2xl font-bold">{fmtCurr(totalValue)}</div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Paid to Date" />
            <CardBody>
              <div className="text-2xl font-bold">{fmtCurr(totalPaid)}</div>
              <div className="mt-2 text-sm text-gray-500">Overall % paid</div>
              <div className="mt-1 flex items-center gap-3">
                <div className="w-full">
                  <Progress value={(totalPaid / totalValue) * 100} />
                </div>
                <div className="w-12 text-right text-sm font-semibold">
                  {fmtPct(percentPaid)}
                </div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Change Orders (COs)" />
            <CardBody>
              <div className="text-2xl font-bold">{cosFiltered.length}</div>
              <div className="mt-1 text-sm text-gray-500">
                {cosFiltered.filter((c) => c.status === "Approved").length} approved
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Claims" />
            <CardBody>
              <div className="text-2xl font-bold">{claimsFiltered.length}</div>
              <div className="mt-1 text-sm text-gray-500">
                {
                  claimsFiltered.filter(
                    (c) => c.status === "In Review" || c.status === "Submitted"
                  ).length
                }{" "}
                open •{" "}
                {claimsFiltered.filter((c) => c.status === "Approved").length} approved
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Payments by Contract */}
        <h2 className="mt-10 text-2xl font-bold">Payments by Contract</h2>
        <div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {visiblePkgs.map((p) => {
            const pct = (p.paid / p.value) * 100;
            return (
              <Card key={p.id} className={`ring-1 ${p.color}`}>
                <CardBody className="pt-5">
                  <div className="mb-2 text-lg font-semibold text-gray-900">
                    {p.title}
                  </div>
                  <div className="flex items-baseline gap-3">
                    <div className="text-4xl font-bold">{fmtPct(pct)}</div>
                  </div>
                  <div className="mt-4">
                    <Progress value={pct} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      Paid:{" "}
                      <span className="font-semibold text-gray-900">
                        {fmtCurr(p.paid)}
                      </span>
                    </div>
                    <div>
                      Value:{" "}
                      <span className="font-semibold text-gray-900">
                        {fmtCurr(p.value)}
                      </span>
                    </div>
                  </div>

                  {/* Details button opens modal (IPCs + Advance Payment) */}
                  <div className="mt-4">
                    <button
                      onClick={() => openIPCs(p)}
                      className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                      aria-label={`Open details for ${p.title}`}
                    >
                      Details
                    </button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Provisional Sum Utilization */}
        <h2 className="mt-12 text-2xl font-bold">Provisional Sum Utilization</h2>
<div className="mt-4 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
  {visiblePkgs.map((p) => {
    // Total PS amount per package (edit these to your real totals)
    const totalPS =
      ({ A: 10_000_000, B: 7_500_000, C: 12_000_000, D: 4_000_000, F: 8_500_000, G: 2_500_000, I2: 3_200_000, PMEC: 1_800_000 } as Record<string, number>)[p.id] ?? 0;

    // Percentages
    const usedPct =      ({ A: 22, B: 31, C: 44, D: 10, F: 51, G: 6, I2: 28, PMEC: 12 } as Record<string, number>)[p.id] ?? 0;
    const inReviewPct =  ({ A: 35, B: 12, C: 30, D: 18, F: 21, G: 9, I2: 7,  PMEC: 10 } as Record<string, number>)[p.id] ?? 0;
    const remainingPct = Math.max(0, 100 - usedPct - inReviewPct);

    // Amounts
    const usedAmt = Math.round((totalPS * usedPct) / 100);
    const inReviewAmt = Math.round((totalPS * inReviewPct) / 100);
    const remainingAmt = Math.max(0, totalPS - usedAmt - inReviewAmt);

    return (
      <Card key={`psu-${p.id}`} className={`ring-1 ${p.color}`}>
        <CardBody className="pt-5">
          <div className="mb-2 text-lg font-semibold text-gray-900">
            {p.id === "PMEC" ? "Package PMEC" : `Package ${p.id}`}
          </div>

          {/* Total Provisional Sum */}
          <div className="text-sm text-gray-500">Total Provisional Sum</div>
          <div className="text-xl font-bold mb-4">{fmtCurr(totalPS)}</div>

          {/* Used */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">Used</span>
            <span className="font-semibold">
              {fmtCurr(usedAmt)} • {usedPct}%
            </span>
          </div>
          <Progress value={usedPct} />

          {/* In Review */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-700">In Review</span>
            <span className="font-semibold">
              {fmtCurr(inReviewAmt)} • {inReviewPct}%
            </span>
          </div>
          <Progress value={inReviewPct} />

          {/* Remaining */}
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-700">Remaining</span>
            <span className="font-semibold">
              {fmtCurr(remainingAmt)} • {remainingPct}%
            </span>
          </div>
          <Progress value={remainingPct} />
        </CardBody>
      </Card>
    );
  })}
</div>

   {/* Change Orders (COs) */}
<h2 className="mt-12 text-2xl font-bold">Change Orders (COs)</h2>

<Card className="mt-4">
  <CardHeader
    right={
      <div className="flex gap-2">
        {CO_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setCoFilter(s)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              coFilter === s
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200",
            ].join(" ")}
          >
            {s}
          </button>
        ))}

        <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200">
          Export CSV
        </button>
      </div>
    }
  />

  <CardBody className="pt-0">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-3">CO ID</th>
            <th className="py-3">Package</th>
            <th className="py-3">Title</th>
            <th className="py-3">Status</th>
            <th className="py-3">Estimated</th>
            <th className="py-3">Actual</th>
            <th className="py-3">Variance</th>
            <th className="py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {cosFiltered.map((c) => {
            const variance =
              c.actual == null || c.estimated == null ? null : c.actual - c.estimated;

            return (
              <tr key={c.id} className="border-t">
                <td className="py-3 font-semibold">{c.id}</td>

                <td className="py-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-semibold">
                    {c.pkg}
                  </span>
                </td>

                <td className="py-3">{c.title}</td>

                <td className="py-3">
                  <StatusPill status={c.status as Status} />
                </td>

                <td className="py-3">{fmtCurr(c.estimated ?? null)}</td>
                <td className="py-3">{fmtCurr(c.actual ?? null)}</td>

                <td
                  className={`py-3 ${
                    variance != null
                      ? variance > 0
                        ? "text-rose-600"
                        : "text-emerald-600"
                      : "text-gray-900"
                  }`}
                >
                  {variance == null
                    ? "—"
                    : `${variance > 0 ? "AED " : "-AED "}${Math.abs(variance).toLocaleString(
                        "en-US"
                      )}`}
                </td>

                <td className="py-3">{fmtDate(c.date)}</td>
              </tr>
            );
          })}

          {cosFiltered.length === 0 && (
            <tr>
              <td colSpan={8} className="py-6 text-center text-gray-500 font-medium">
                No change orders found for “{coFilter}”.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </CardBody>
</Card>

{/* Claims */}
<h2 className="mt-12 text-2xl font-bold">Claims</h2>

<Card className="mt-4">
  <CardHeader
    right={
      <div className="flex gap-2">
        {CLAIM_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setClaimFilter(s)}
            className={[
              "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
              claimFilter === s
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-900 hover:bg-gray-200",
            ].join(" ")}
          >
            {s}
          </button>
        ))}

        <button className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold hover:bg-gray-200">
          Export CSV
        </button>
      </div>
    }
  />

  <CardBody className="pt-0">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-3">Claim ID</th>
            <th className="py-3">Package</th>
            <th className="py-3">Title</th>
            <th className="py-3">Status</th>
            <th className="py-3">Claimed</th>
            <th className="py-3">Certified</th>
            <th className="py-3">Variance</th>
            <th className="py-3">Days Open</th>
            <th className="py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {claimsFiltered.map((c) => {
            const variance = c.certified == null ? null : c.certified - c.claimed;
            const daysOpen = Math.max(
              0,
              Math.round((Date.now() - new Date(c.date).getTime()) / (1000 * 60 * 60 * 24))
            );

            return (
              <tr key={c.id} className="border-t">
                <td className="py-3 font-semibold">{c.id}</td>

                <td className="py-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-semibold">
                    {c.pkg}
                  </span>
                </td>

                <td className="py-3">{c.title}</td>

                <td className="py-3">
                  <StatusPill status={c.status as Status} />
                </td>

                <td className="py-3">{fmtCurr(c.claimed)}</td>
                <td className="py-3">{fmtCurr(c.certified ?? null)}</td>

                <td
                  className={`py-3 ${
                    variance != null
                      ? variance > 0
                        ? "text-rose-600"
                        : "text-emerald-600"
                      : "text-gray-900"
                  }`}
                >
                  {variance == null
                    ? "—"
                    : `${variance > 0 ? "AED " : "-AED "}${Math.abs(variance).toLocaleString(
                        "en-US"
                      )}`}
                </td>

                <td className="py-3">
                  <span
                    className={`font-semibold ${
                      daysOpen > 40 ? "text-amber-600" : "text-gray-900"
                    }`}
                  >
                    {daysOpen}
                  </span>
                </td>

                <td className="py-3">{fmtDate(c.date)}</td>
              </tr>
            );
          })}

          {claimsFiltered.length === 0 && (
            <tr>
              <td colSpan={9} className="py-6 text-center text-gray-500 font-medium">
                No claims found for “{claimFilter}”.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </CardBody>
</Card>

</main>

{/* Modal stays outside <main> but inside the page wrapper */}
<IPCsModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  pkg={modalPkg}
/>

</div>
);
}

