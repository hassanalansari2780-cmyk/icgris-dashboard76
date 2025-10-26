'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/table';

/* ==============================
   Types
============================== */
type PackageCode = 'A' | 'B' | 'C' | 'D' | 'F' | 'G' | 'I2' | 'PMEC';
type Role = 'All' | 'Contracts' | 'Finance' | 'Legal' | 'Project' | 'Operation' | 'PMEC';
type COStatus = 'All' | 'Proposed' | 'In Review' | 'Approved' | 'Rejected';
type ClaimStatus = 'All' | 'Submitted' | 'In Review' | 'Approved' | 'Rejected';

type Contract = {
  pkg: PackageCode;
  title: string;
  contractValue: number; // AED
  paidToDate: number;    // AED
};

type Provisional = {
  pkg: PackageCode;
  used: number;     // %
  approved: number; // %
  pending: number;  // %
};

type ChangeOrder = {
  id: string;
  pkg: PackageCode;
  title: string;
  status: Exclude<COStatus, 'All'>;
  estimated: number; // AED
  actual?: number | null; // AED
};

type Claim = {
  id: string;
  pkg: PackageCode;
  title: string;
  status: Exclude<ClaimStatus, 'All'>;
  claimed: number;           // AED
  certified?: number | null; // AED
  daysOpen: number;          // aging
};

/* ==============================
   Package Colors (Tailwind-safe)
   (tailwind.config.js defines these: pkgA, pkgB, …)
============================== */
const PKG_BG: Record<PackageCode, string> = {
  A: 'bg-pkgA',
  B: 'bg-pkgB',
  C: 'bg-pkgC',
  D: 'bg-pkgD',
  F: 'bg-pkgF',
  G: 'bg-pkgG',
  I2: 'bg-pkgI2',
  PMEC: 'bg-pkgPMEC',
};

const PKG_BORDER: Record<PackageCode, string> = {
  A: 'border-pkgA',
  B: 'border-pkgB',
  C: 'border-pkgC',
  D: 'border-pkgD',
  F: 'border-pkgF',
  G: 'border-pkgG',
  I2: 'border-pkgI2',
  PMEC: 'border-pkgPMEC',
};

/* ==============================
   Demo Data (edit freely)
============================== */
const CONTRACTS: Contract[] = [
  { pkg: 'A',   title: 'Package A - Systems',       contractValue: 120_000_000, paidToDate: 48_000_000 },
  { pkg: 'B',   title: 'Package B - Track',         contractValue: 95_000_000,  paidToDate: 41_000_000 },
  { pkg: 'C',   title: 'Package C - Civil',         contractValue: 180_000_000, paidToDate: 72_000_000 },
  { pkg: 'D',   title: 'Package D - Stations',      contractValue: 85_000_000,  paidToDate: 19_000_000 },
  { pkg: 'F',   title: 'Package F - Rolling Stock', contractValue: 210_000_000, paidToDate: 109_000_000 },
  { pkg: 'G',   title: 'Package G - O&M',           contractValue: 60_000_000,  paidToDate: 9_500_000 },
  { pkg: 'I2',  title: 'Package I2 - Integration',  contractValue: 35_000_000,  paidToDate: 11_000_000 },
  { pkg: 'PMEC',title: 'PMEC - Consulting',         contractValue: 18_000_000,  paidToDate: 7_000_000 },
];

const PROVISIONALS: Provisional[] = [
  { pkg: 'A',   used: 22, approved: 35, pending: 12 },
  { pkg: 'B',   used: 31, approved: 12, pending: 25 },
  { pkg: 'C',   used: 44, approved: 30, pending: 10 },
  { pkg: 'D',   used: 10, approved: 18, pending: 22 },
  { pkg: 'F',   used: 51, approved: 21, pending: 9  },
  { pkg: 'G',   used: 6,  approved: 9,  pending: 19 },
  { pkg: 'I2',  used: 28, approved: 7,  pending: 12 },
  { pkg: 'PMEC',used: 12, approved: 10, pending: 5  },
];

const COS: ChangeOrder[] = [
  { id: 'CO-A-001',   pkg: 'A',   title: 'Scope Interface Adjustment', status: 'In Review', estimated: 3_200_000, actual: null },
  { id: 'CO-A-002',   pkg: 'A',   title: 'Cybersecurity Upgrade',     status: 'Proposed',  estimated: 1_150_000, actual: null },
  { id: 'CO-B-001',   pkg: 'B',   title: 'Ballast Spec Update',       status: 'Approved',  estimated: 2_000_000, actual: 1_850_000 },
  { id: 'CO-C-004',   pkg: 'C',   title: 'Retaining Wall Change',     status: 'Approved',  estimated: 4_900_000, actual: 5_200_000 },
  { id: 'CO-D-003',   pkg: 'D',   title: 'Station Canopy Redesign',   status: 'In Review', estimated: 2_700_000, actual: null },
  { id: 'CO-F-002',   pkg: 'F',   title: 'Brake System Mod',          status: 'Proposed',  estimated: 6_000_000, actual: null },
  { id: 'CO-G-005',   pkg: 'G',   title: 'Maintenance Tooling',       status: 'Approved',  estimated: 800_000,   actual: 780_000 },
  { id: 'CO-I2-002',  pkg: 'I2',  title: 'Interface Test Extension',  status: 'Proposed',  estimated: 450_000,   actual: null },
  { id: 'CO-PMEC-001',pkg: 'PMEC',title: 'Additional Studies',        status: 'Approved',  estimated: 300_000,   actual: 290_000 },
];

const CLAIMS: Claim[] = [
  { id: 'CLM-A-001',  pkg: 'A',   title: 'Interface Delay (Vendor A)',   status: 'In Review', claimed: 1_200_000, certified: null,     daysOpen: 24 },
  { id: 'CLM-B-002',  pkg: 'B',   title: 'Ballast Rework',               status: 'Submitted', claimed: 850_000,   certified: null,     daysOpen: 11 },
  { id: 'CLM-C-003',  pkg: 'C',   title: 'Unforeseen Utilities',         status: 'Approved',  claimed: 2_100_000, certified: 1_950_000, daysOpen: 39 },
  { id: 'CLM-D-001',  pkg: 'D',   title: 'Design Change Impacts',        status: 'Rejected',  claimed: 900_000,   certified: 0,        daysOpen: 51 },
  { id: 'CLM-F-004',  pkg: 'F',   title: 'Supplier Late Deliveries',     status: 'In Review', claimed: 1_750_000, certified: null,     daysOpen: 17 },
  { id: 'CLM-G-002',  pkg: 'G',   title: 'O&M Mobilization Overlaps',    status: 'Submitted', claimed: 300_000,   certified: null,     daysOpen: 9  },
  { id: 'CLM-I2-001', pkg: 'I2',  title: 'Integration Test Overruns',    status: 'Approved',  claimed: 600_000,   certified: 540_000,  daysOpen: 28 },
  { id: 'CLM-PMEC-1', pkg: 'PMEC',title: 'Additional Study Hours',       status: 'Approved',  claimed: 200_000,   certified: 190_000,  daysOpen: 14 },
];

/* ==============================
   Helpers
============================== */
const currency = (n: number) =>
  new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(n);

function pctPaid(c: Contract) {
  return (c.paidToDate / c.contractValue) * 100;
}

function sum<T>(arr: T[], map: (x: T) => number): number {
  return arr.reduce((acc, v) => acc + map(v), 0);
}

/* ==============================
   Component
============================== */
export default function Page() {
  const ROLES: Role[] = ['All', 'Contracts', 'Finance', 'Legal', 'Project', 'Operation', 'PMEC'];
  const PACKAGES: PackageCode[] = ['A', 'B', 'C', 'D', 'F', 'G', 'I2', 'PMEC'];

  // Global filters
  const [role, setRole] = React.useState<Role>('All');
  const [activePkgs, setActivePkgs] = React.useState<PackageCode[]>([...PACKAGES]);
  const [search, setSearch] = React.useState<string>('');

  // Status filters
  const [coStatus, setCoStatus] = React.useState<COStatus>('All');
  const [claimStatus, setClaimStatus] = React.useState<ClaimStatus>('All');

  // Filtered datasets (respect package, search, and status filters)
  const filteredContracts = CONTRACTS
    .filter(c => activePkgs.includes(c.pkg))
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  const filteredCOs = COS
    .filter(co => activePkgs.includes(co.pkg))
    .filter(co => co.title.toLowerCase().includes(search.toLowerCase()))
    .filter(co => coStatus === 'All' || co.status === coStatus);

  const filteredProv = PROVISIONALS.filter(p => activePkgs.includes(p.pkg));

  const filteredClaims = CLAIMS
    .filter(cl => activePkgs.includes(cl.pkg))
    .filter(cl => cl.title.toLowerCase().includes(search.toLowerCase()))
    .filter(cl => claimStatus === 'All' || cl.status === claimStatus);

  // Summaries
  const totalContract = sum(filteredContracts, c => c.contractValue);
  const totalPaid = sum(filteredContracts, c => c.paidToDate);
  const overallPaidPct = totalContract ? (totalPaid / totalContract) * 100 : 0;

  const totalCOs = filteredCOs.length;
  const approvedCOs = filteredCOs.filter(c => c.status === 'Approved').length;

  const totalClaims = filteredClaims.length;
  const openClaims = filteredClaims.filter(cl => cl.status === 'Submitted' || cl.status === 'In Review').length;
  const approvedClaims = filteredClaims.filter(cl => cl.status === 'Approved').length;
  const totalClaimedAED = sum(filteredClaims, c => c.claimed);
  const totalCertifiedAED = sum(filteredClaims, c => c.certified ?? 0);

  function togglePackage(p: PackageCode) {
    setActivePkgs(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  }
  function selectAllPkgs() { setActivePkgs([...PACKAGES]); }
  function clearPkgs() { setActivePkgs([]); }

  return (
    <main className="container-max py-6 space-y-6">
      {/* Topbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ICGRIS Dashboard</h1>
          <p className="text-sm text-gray-600">Integrated Contract Governance & Risk Intelligence System</p>
        </div>
        <div className="flex gap-2">
          <span className="badge">Frontend demo • Local data</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">Role:</span>
            <div className="flex flex-wrap gap-2">
              {ROLES.map(r => (
                <Button
                  key={r}
                  size="sm"
                  variant={role === r ? 'primary' : 'secondary'}
                  onClick={() => setRole(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">Packages:</span>
            <div className="flex flex-wrap gap-2">
              {PACKAGES.map(p => {
                const active = activePkgs.includes(p);
                return (
                  <Button
                    key={p}
                    size="sm"
                    variant={active ? 'primary' : 'secondary'}
                    onClick={() => togglePackage(p)}
                  >
                    {p}
                  </Button>
                );
              })}
              <Button size="sm" variant="ghost" onClick={selectAllPkgs}>All</Button>
              <Button size="sm" variant="ghost" onClick={clearPkgs}>None</Button>
            </div>
            <div className="ml-auto w-full sm:w-64">
              <Input placeholder="Search titles…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {role !== 'All' && (
            <div className="text-xs text-gray-600">
              <span className="badge">Scoped view: {role}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="kpi">
          <div className="text-xs text-gray-500">Total Contract Value</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{currency(totalContract)}</div>
        </div>
        <div className="kpi">
          <div className="text-xs text-gray-500">Paid to Date</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{currency(totalPaid)}</div>
          <Progress className="mt-3" value={overallPaidPct} label="Overall % paid" />
        </div>
        <div className="kpi">
          <div className="text-xs text-gray-500">Change Orders (COs)</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{totalCOs}</div>
          <div className="mt-1 text-xs text-gray-500">{approvedCOs} approved</div>
        </div>
        <div className="kpi">
          <div className="text-xs text-gray-500">Claims</div>
          <div className="mt-1 text-xl font-semibold tabular-nums">{totalClaims}</div>
          <div className="mt-1 text-xs text-gray-500">{openClaims} open • {approvedClaims} approved</div>
        </div>
        <div className="kpi">
          <div className="text-xs text-gray-500">Claims (AED)</div>
          <div className="mt-1 text-sm text-gray-700">
            Claimed: <span className="font-semibold tabular-nums">{currency(totalClaimedAED)}</span>
          </div>
          <div className="text-sm text-gray-700">
            Certified: <span className="font-semibold tabular-nums">{currency(totalCertifiedAED)}</span>
          </div>
        </div>
      </div>

      {/* Payments by Contract */}
      <section className="space-y-3">
        <h2 className="section-title">Payments by Contract</h2>
        <div className="grid-cards">
          {filteredContracts.map(c => (
            <Card key={c.pkg} className={`border-t-4 ${PKG_BORDER[c.pkg]} bg-white`}>
              <CardHeader>
                <CardTitle>{c.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between">
                  <div className="text-2xl font-semibold tabular-nums">{(pctPaid(c)).toFixed(0)}%</div>
                  <div className="text-xs text-gray-600">
                    <div>Paid: <span className="tabular-nums">{currency(c.paidToDate)}</span></div>
                    <div>Value: <span className="tabular-nums">{currency(c.contractValue)}</span></div>
                  </div>
                </div>
                <Progress value={pctPaid(c)} barClassName={PKG_BG[c.pkg]} />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Provisional Sum Utilization */}
      <section className="space-y-3">
        <h2 className="section-title">Provisional Sum Utilization</h2>
        <div className="grid-cards">
          {filteredProv.map(p => (
            <Card key={p.pkg} className={`border-t-4 ${PKG_BORDER[p.pkg]} bg-white`}>
              <CardHeader>
                <CardTitle>Package {p.pkg}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={p.used}     barClassName={PKG_BG[p.pkg]} label="Used" />
                <Progress value={p.approved} barClassName={PKG_BG[p.pkg]} label="Approved" />
                <Progress value={p.pending}  barClassName={PKG_BG[p.pkg]} label="Pending" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Change Orders */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Change Orders (COs)</h2>
          <div className="text-xs text-gray-600">Each CO includes Estimated and Actual cost.</div>
        </div>

        {/* CO Status Filter */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>Filter by Status:</span>
          {(['All','Proposed','In Review','Approved','Rejected'] as COStatus[]).map(st => (
            <Button
              key={st}
              size="sm"
              variant={coStatus === st ? 'primary' : 'secondary'}
              onClick={() => setCoStatus(st)}
            >
              {st}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>CO ID</TH>
                  <TH>Package</TH>
                  <TH>Title</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Estimated</TH>
                  <TH className="text-right">Actual</TH>
                  <TH className="text-right">Variance</TH>
                </TR>
              </THead>
              <TBody>
                {filteredCOs.map(co => {
                  const variance = co.actual != null ? (co.actual - co.estimated) : null;
                  return (
                    <TR key={co.id}>
                      <TD className="font-medium">{co.id}</TD>
                      <TD><span className={`badge text-white ${PKG_BG[co.pkg]}`}>{co.pkg}</span></TD>
                      <TD className="max-w-[32ch] truncate">{co.title}</TD>
                      <TD><span className="badge">{co.status}</span></TD>
                      <TD className="text-right tabular-nums">{currency(co.estimated)}</TD>
                      <TD className="text-right tabular-nums">{co.actual != null ? currency(co.actual) : '—'}</TD>
                      <TD className={"text-right tabular-nums " + (variance != null ? (variance > 0 ? "text-red-600" : "text-green-700") : "text-gray-400")}>
                        {variance != null ? currency(variance) : '—'}
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Claims */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Claims</h2>
          <div className="text-xs text-gray-600">Claimed vs Certified amounts and aging.</div>
        </div>

        {/* Claims Status Filter */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>Filter by Status:</span>
          {(['All','Submitted','In Review','Approved','Rejected'] as ClaimStatus[]).map(st => (
            <Button
              key={st}
              size="sm"
              variant={claimStatus === st ? 'primary' : 'secondary'}
              onClick={() => setClaimStatus(st)}
            >
              {st}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Claim ID</TH>
                  <TH>Package</TH>
                  <TH>Title</TH>
                  <TH>Status</TH>
                  <TH className="text-right">Claimed</TH>
                  <TH className="text-right">Certified</TH>
                  <TH className="text-right">Variance</TH>
                  <TH className="text-right">Days Open</TH>
                </TR>
              </THead>
              <TBody>
                {filteredClaims.map(cl => {
                  const variance = cl.certified != null ? (cl.certified - cl.claimed) : null;
                  const varianceClass =
                    variance == null ? 'text-gray-400'
                    : variance > 0 ? 'text-green-700'
                    : variance < 0 ? 'text-red-600'
                    : 'text-gray-700';
                  const agingClass =
                    cl.daysOpen >= 60 ? 'text-red-600' :
                    cl.daysOpen >= 30 ? 'text-amber-600' : 'text-gray-900';

                  return (
                    <TR key={cl.id}>
                      <TD className="font-medium">{cl.id}</TD>
                      <TD><span className={`badge text-white ${PKG_BG[cl.pkg]}`}>{cl.pkg}</span></TD>
                      <TD className="max-w-[36ch] truncate">{cl.title}</TD>
                      <TD><span className="badge">{cl.status}</span></TD>
                      <TD className="text-right tabular-nums">{currency(cl.claimed)}</TD>
                      <TD className="text-right tabular-nums">{cl.certified != null ? currency(cl.certified) : '—'}</TD>
                      <TD className={`text-right tabular-nums ${varianceClass}`}>
                        {variance != null ? currency(variance) : '—'}
                      </TD>
                      <TD className={`text-right tabular-nums ${agingClass}`}>{cl.daysOpen}</TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <footer className="py-8 text-center text-xs text-gray-500">
        Frontend-only demo • Deploy to Vercel. Edit data in <code>/app/page.tsx</code>.
      </footer>
    </main>
  );
}
