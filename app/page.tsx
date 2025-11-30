"use client";

import * as React from "react";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Search, Paperclip } from "lucide-react";

// ==========================================
// Types
// ==========================================
export type StageKey =
  | "PRC"
  | "CC_OUTCOME"
  | "CEO_OR_BOARD_MEMO"
  | "EI"
  | "CO_V_VOS"
  | "AA_SA";

export type PackageId =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "I2"
  | "PMEC";

export type PcrTarget = "EI" | "CO" | "EI+CO" | "VOS" | "TBC" | "AA";

export interface Reviewer {
  role: string;
  name: string;
  date?: string;
  decision?: string;
}

export interface Signer {
  role: string;
  name: string;
  date?: string;
  signed?: boolean;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface ChangeRecord {
  id: string; // CO / PRC ID
  type: "PRC" | "EI" | "CO" | "Determination";
  package: PackageId;
  title: string;
  estimated?: number; // AED
  actual?: number; // AED
  stageKey: StageKey; // must match STAGES keys exactly
  subStatus?: string;
  stageStartDate: string; // ISO date
  overallStartDate: string; // ISO
  outcome?: "Approved" | "Rejected" | "Withdrawn" | "Superseded";
  target?: PcrTarget;
  sponsor?: string;
  reviewList?: Reviewer[];
  signatureList?: Signer[];
  links?: LinkItem[];
  prcTarget?: PcrTarget;
  ccPlannedForNext?: boolean;
  ccPreviousMeeting?: number;
}

// ==========================================
// Lifecycle & options
// ==========================================
const STAGES: {
  order: number;
  key: StageKey;
  name: string;
  short: string;
  slaDays: number;
  color: string;
}[] = [
  {
    order: 1,
    key: "PRC",
    name: "PRC",
    short: "PRC",
    slaDays: 5,
    color: "bg-sky-100 text-sky-900",
  },
  {
    order: 2,
    key: "CC_OUTCOME",
    name: "CC Outcome",
    short: "CC",
    slaDays: 3,
    color: "bg-indigo-100 text-indigo-900",
  },
  {
    order: 3,
    key: "CEO_OR_BOARD_MEMO",
    name: "CEO / Board Memo",
    short: "CEO/Board",
    slaDays: 2,
    color: "bg-purple-100 text-purple-900",
  },
  {
    order: 4,
    key: "EI",
    name: "EI",
    short: "EI",
    slaDays: 2,
    color: "bg-amber-100 text-amber-900",
  },
  {
    order: 5,
    key: "CO_V_VOS",
    name: "CO/V/VOS",
    short: "CO/V/VOS",
    slaDays: 7,
    color: "bg-emerald-100 text-emerald-900",
  },
  {
    order: 6,
    key: "AA_SA",
    name: "AA/SA",
    short: "AA/SA",
    slaDays: 0,
    color: "bg-gray-200 text-gray-900",
  },
];

const fmt = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});
const fmtShort = new Intl.NumberFormat("en-US");

const NEXT_CC_MEETING_NO = 12;

// ==========================================
// Utils
// ==========================================
function daysBetween(startIso?: string, endIso?: string) {
  if (!startIso) return 0;
  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : new Date();
  const diff = Math.round(
    (end.getTime() - start.getTime()) / (24 * 3600 * 1000),
  );
  return Math.max(diff, 0);
}

function clsx(...xs: (string | false | null | undefined)[]) {
  return xs.filter(Boolean).join(" ");
}

function stageInfo(key: StageKey) {
  const s = STAGES.find((x) => x.key === key);
  if (!s) {
    console.error(`Stage not found for key: ${key}`);
    return {
      order: 0,
      key,
      name: String(key),
      short: String(key),
      slaDays: 0,
      color: "bg-gray-200 text-gray-900",
    };
  }
  return s;
}

function variance(estimated?: number, actual?: number) {
  if (typeof estimated !== "number" || typeof actual !== "number") return null;
  return actual - estimated;
}

function issuedItemLabel(r: ChangeRecord) {
  if (r.stageKey === "EI" || r.type === "EI") return "EI";
  if (r.stageKey === "CO_V_VOS") return "CO / V / VOS";
  if (r.stageKey === "AA_SA") return "AA / SA";
  return r.type;
}

// ==========================================
// Demo data (clean, compact)
// ==========================================
const DEMO: ChangeRecord[] = [
  // ===== PCRs → EI =====
  {
    id: "PCR-A-030",
    type: "PRC",
    package: "A",
    title: "Ventilation Fan Adjustment in Tunnel A-02 (PCR)",
    estimated: 520000,
    stageKey: "PRC",
    subStatus: "In Preparation",
    stageStartDate: "2026-02-11",
    overallStartDate: "2026-02-11",
    target: "EI",
    sponsor: "Pkg A PM – Eng. Nasser Al-Rawahi",
  },
  {
    id: "PCR-C-033",
    type: "PRC",
    package: "C",
    title: "Emergency Lighting Cable Protection (PCR)",
    estimated: 980000,
    stageKey: "CC_OUTCOME",
    subStatus: "Approved",
    stageStartDate: "2026-02-09",
    overallStartDate: "2026-01-28",
    target: "EI",
    sponsor: "Pkg C PM – Eng. Khalid Al-Harthy",
  },
  {
    id: "PCR-D-029",
    type: "PRC",
    package: "D",
    title: "Platform Emergency Call Box Relocation (PCR)",
    estimated: 240000,
    actual: 235000,
    stageKey: "CEO_OR_BOARD_MEMO",
    subStatus: "In Approval",
    stageStartDate: "2026-02-12",
    overallStartDate: "2026-01-30",
    target: "EI",
    sponsor: "Pkg D PM – Eng. Younis Al-Maamari",
  },
  {
    id: "PCR-E-015",
    type: "PRC",
    package: "E",
    title: "Workshop Vertical Clearance Improvement (PCR)",
    estimated: 300000,
    stageKey: "EI",
    subStatus: "Ready",
    stageStartDate: "2026-02-10",
    overallStartDate: "2026-01-29",
    target: "EI",
    sponsor: "Assets Manager – Eng. Hamad Al-Hinai",
  },
  {
    id: "PCR-F-009",
    type: "PRC",
    package: "F",
    title: "Signalling Panel Earthing Correction (PCR)",
    estimated: 150000,
    actual: 155000,
    stageKey: "EI",
    subStatus: "To be Issued to Contractor",
    stageStartDate: "2026-02-14",
    overallStartDate: "2026-02-01",
    target: "EI",
    sponsor: "Signalling Manager – Eng. Talal Al-Balushi",
  },
  // flagged for next CC (EI)
  {
    id: "PCR-C-021",
    type: "PRC",
    package: "C",
    title: "Drainage Rerouting at Station C-05 (PCR)",
    estimated: 1200000,
    stageKey: "PRC",
    subStatus: "Ready for CC",
    stageStartDate: "2026-01-18",
    overallStartDate: "2026-01-10",
    target: "EI",
    sponsor: "Pkg C PM – Eng. Khalid Al-Harthy",
    ccPlannedForNext: true,
  },

  // ===== PCRs → CO / VOS / AA =====
  {
    id: "PCR-B-020",
    type: "PRC",
    package: "B",
    title: "Drainage Channel Reinforcement (PCR)",
    estimated: 780000,
    stageKey: "CO_V_VOS",
    subStatus: "To be Prepared",
    stageStartDate: "2026-02-13",
    overallStartDate: "2026-02-13",
    target: "CO",
    sponsor: "Pkg B PM – Eng. Rashid Al-Siyabi",
  },
  {
    id: "PCR-G-017",
    type: "PRC",
    package: "G",
    title: "Trackside Fencing Optimization (PCR)",
    estimated: 1100000,
    actual: 1050000,
    stageKey: "CO_V_VOS",
    subStatus: "Under Review",
    stageStartDate: "2026-02-10",
    overallStartDate: "2026-02-01",
    target: "VOS",
    sponsor: "Track Engineering Manager",
  },
  {
    id: "PCR-D-031",
    type: "PRC",
    package: "D",
    title: "Passenger Flow Adjustment at Station D-07 (PCR)",
    estimated: 450000,
    stageKey: "CO_V_VOS",
    subStatus: "In Circulation",
    stageStartDate: "2026-02-09",
    overallStartDate: "2026-01-30",
    target: "CO",
    sponsor: "Pkg D PM – Eng. Younis Al-Maamari",
  },
  {
    id: "PCR-E-024",
    type: "PRC",
    package: "E",
    title: "Maintenance Yard Gate Relocation (PCR)",
    estimated: 600000,
    actual: 590000,
    stageKey: "AA_SA",
    subStatus: "In Approval",
    stageStartDate: "2026-02-11",
    overallStartDate: "2026-02-02",
    target: "AA",
    sponsor: "Assets Manager – Eng. Hamad Al-Hinai",
  },
  {
    id: "PCR-F-012",
    type: "PRC",
    package: "F",
    title: "Signalling Room Cooling Improvement (PCR)",
    estimated: 900000,
    actual: 920000,
    stageKey: "CO_V_VOS",
    subStatus: "To be Issued to Contractor",
    stageStartDate: "2026-02-14",
    overallStartDate: "2026-02-05",
    target: "CO",
    sponsor: "Signalling Manager – Eng. Talal Al-Balushi",
  },
  {
    id: "PCR-A-018",
    type: "PRC",
    package: "A",
    title: "Handrail Height Adjustment (PCR)",
    estimated: 650000,
    actual: 700000,
    stageKey: "PRC",
    subStatus: "In Preparation",
    stageStartDate: "2026-01-12",
    overallStartDate: "2026-01-12",
    target: "CO",
    sponsor: "HSSE Manager – Eng. Salim Al-Harthy",
    ccPlannedForNext: true,
    ccPreviousMeeting: 11,
  },

  // ===== Completed EIs / COs =====
  {
    id: "EI-A-011",
    type: "EI",
    package: "A",
    title: "Tunnel Lighting Rectification (EI)",
    estimated: 0,
    stageKey: "EI",
    subStatus: "Issued",
    stageStartDate: "2025-11-20",
    overallStartDate: "2025-11-10",
    sponsor: "Pkg A PM – Eng. Nasser Al-Rawahi",
  },
  {
    id: "CO-C-045",
    type: "CO",
    package: "C",
    title: "Station C-09 Canopy Strengthening (Final)",
    estimated: 1300000,
    actual: 1275000,
    outcome: "Approved",
    stageKey: "CO_V_VOS",
    subStatus: "Done",
    stageStartDate: "2025-12-18",
    overallStartDate: "2025-12-01",
    sponsor: "Pkg C PM – Eng. Khalid Al-Harthy",
  },
  {
    id: "CO-D-014",
    type: "CO",
    package: "D",
    title: "Platform Canopy Extension (Final)",
    estimated: 500000,
    actual: 520000,
    outcome: "Approved",
    stageKey: "CO_V_VOS",
    subStatus: "Done",
    stageStartDate: "2025-06-10",
    overallStartDate: "2025-05-20",
    sponsor: "Pkg D PM – Eng. Younis Al-Maamari",
  },
  {
    id: "CO-E-003",
    type: "CO",
    package: "E",
    title: "Workshop Drainage Improvement (Final)",
    estimated: 300000,
    actual: 295000,
    outcome: "Approved",
    stageKey: "CO_V_VOS",
    subStatus: "Done",
    stageStartDate: "2025-10-01",
    overallStartDate: "2025-09-05",
    sponsor: "Assets Manager – Eng. Hamad Al-Hinai",
  },
];

// ==========================================
// CSV helpers
// ==========================================
function buildCSV(rows: ChangeRecord[]): string {
  const headers = [
    "ID",
    "Type",
    "Package",
    "Title",
    "Estimated",
    "Actual",
    "Variance",
    "Stage",
    "SubStatus",
    "PRCTarget",
    "Sponsor",
    "DaysInStage",
    "OverallDays",
  ];

  const body = rows.map((r) => {
    const st = stageInfo(r.stageKey);
    const vr = variance(r.estimated, r.actual);
    const safeTitle = '"' + r.title.replaceAll('"', '""') + '"';

    return [
      r.id,
      r.type,
      r.package,
      safeTitle,
      r.estimated ?? "",
      r.actual ?? "",
      vr ?? "",
      st.name,
      r.subStatus ?? "",
      r.prcTarget ?? "",
      r.sponsor ?? "",
      daysBetween(r.stageStartDate),
      daysBetween(r.overallStartDate),
    ].join(",");
  });

  return [headers.join(","), ...body].join("\n");
}

function exportCSV(rows: ChangeRecord[]) {
  const csv = buildCSV(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `change-orders-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ==========================================
// Summary card
// ==========================================
function computeSummary(rows: ChangeRecord[]) {
  const total = rows.length;

  const pcrs = rows.filter((r) => r.type === "PRC");
  const pcrToEI = pcrs.filter((r) => r.target === "EI").length;
  const pcrToCO = pcrs.filter(
    (r) => r.target === "CO" || r.target === "VOS" || r.target === "AA",
  ).length;

  const completed = rows.filter((r) => {
    const isEICompleted =
      r.stageKey === "EI" &&
      (r.subStatus === "Issued" ||
        r.subStatus === "To be Issued to Contractor");
    const isCOOrAACompleted =
      (r.stageKey === "CO_V_VOS" && r.subStatus === "Done") ||
      (r.stageKey === "AA_SA" && r.subStatus === "Done");
    return isEICompleted || isCOOrAACompleted;
  }).length;

  return { total, pcrToEI, pcrToCO, completed };
}

function SummaryCard({ rows }: { rows: ChangeRecord[] }) {
  const s = useMemo(() => computeSummary(rows), [rows]);

  return (
    <Card className="rounded-2xl shadow-sm h-[180px]">
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Change Items</div>
          <div className="text-4xl font-semibold mt-1">
            {fmtShort.format(s.total)}
          </div>
        </div>

        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>PCR → EI</span>
            <span>{s.pcrToEI}</span>
          </div>
          <div className="flex justify-between">
            <span>PCR → CO</span>
            <span>{s.pcrToCO}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed (EI / CO/V/VOS / AA/SA)</span>
            <span>{s.completed}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==========================================
// Next CC Meeting – summary & modal
// ==========================================
type NextCcSummary = {
  nextCcNo: number;
  total: number;
  eiCount: number;
  coCount: number;
  firstTimeCount: number;
  carryOverCount: number;
  rows: ChangeRecord[];
};

function computeNextCcSummary(rows: ChangeRecord[]): NextCcSummary {
  const ccRows = rows.filter((r) => r.type === "PRC" && r.ccPlannedForNext);

  const eiCount = ccRows.filter((r) => r.target === "EI").length;
  const coCount = ccRows.filter(
    (r) => r.target === "CO" || r.target === "VOS",
  ).length;

  const carryOverRows = ccRows.filter(
    (r) => typeof r.ccPreviousMeeting === "number",
  );
  const firstTimeRows = ccRows.filter(
    (r) => typeof r.ccPreviousMeeting !== "number",
  );

  return {
    nextCcNo: NEXT_CC_MEETING_NO,
    total: ccRows.length,
    eiCount,
    coCount,
    firstTimeCount: firstTimeRows.length,
    carryOverCount: carryOverRows.length,
    rows: ccRows,
  };
}

function NextCcCard({
  rows,
  onOpenDetails,
}: {
  rows: ChangeRecord[];
  onOpenDetails: () => void;
}) {
  const summary = useMemo(() => computeNextCcSummary(rows), [rows]);

  return (
    <Card className="rounded-2xl shadow-sm h-full">
      <CardContent className="p-4 h-full flex flex-col justify-between">
        <div>
          <div className="text-sm text-muted-foreground">Next CC Meeting</div>
          <div className="text-xl font-semibold mt-1">
            {summary.nextCcNo
              ? `CC-${summary.nextCcNo.toString().padStart(2, "0")}`
              : "—"}
          </div>

          <div className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total PCRs on agenda</span>
              <span>{summary.total || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>PCRs targeting EI</span>
              <span>{summary.eiCount || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>PCRs targeting CO / V / VOS</span>
              <span>{summary.coCount || 0}</span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-2xl px-3 py-1 text-xs self-start mt-4"
          onClick={onOpenDetails}
          disabled={summary.total === 0}
        >
          Details
        </Button>
      </CardContent>
    </Card>
  );
}

function NextCcModal({
  rows,
  onClose,
}: {
  rows: ChangeRecord[];
  onClose: () => void;
}) {
  const summary = useMemo(() => computeNextCcSummary(rows), [rows]);
  const ccRows = summary.rows;

  if (ccRows.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">
              Change Committee
            </div>
            <div className="text-xl font-semibold">
              Next CC Meeting –{" "}
              {`CC-${summary.nextCcNo.toString().padStart(2, "0")}`}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        {/* Top summary block */}
        <div className="px-6 py-3 border-b">
          <div className="rounded-2xl bg-neutral-50 px-4 py-3 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Total PCRs on agenda
              </span>
              <span className="font-medium">{summary.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PCRs targeting EI</span>
              <span className="font-medium">{summary.eiCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                PCRs targeting CO / V / VOS
              </span>
              <span className="font-medium">{summary.coCount}</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="px-6 py-4 overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground border-b">
              <tr className="align-middle">
                <th className="py-2 pr-3 whitespace-nowrap">Ref ID</th>
                <th className="py-2 pr-3 whitespace-nowrap">Pkg</th>
                <th className="py-2 pr-3">Title</th>
                <th className="py-2 pr-3 whitespace-nowrap">Target</th>
                <th className="py-2 pr-3 whitespace-nowrap text-right">
                  Est. value
                </th>
                <th className="py-2 pr-3 w-56">Sponsor</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {ccRows.map((r) => {
                const targetLabel =
                  r.target === "EI" ? "EI" : "CO / V / VOS";
                const isCarryOver = typeof r.ccPreviousMeeting === "number";
                const statusLabel = isCarryOver
                  ? `Carry-over (from CC-${r.ccPreviousMeeting
                      ?.toString()
                      .padStart(2, "0")})`
                  : "First time in this CC";

                return (
                  <tr key={r.id} className="align-top">
                    <td className="py-2 pr-3 font-medium whitespace-nowrap">
                      {r.id}
                    </td>
                    <td className="py-2 pr-3">
                      <span className="inline-flex w-7 h-7 rounded-full bg-muted items-center justify-center text-xs font-semibold">
                        {r.package}
                      </span>
                    </td>
                    <td className="py-2 pr-3">
                      <div className="leading-snug">{r.title}</div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {statusLabel}
                      </div>
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-medium">
                        {targetLabel}
                      </span>
                    </td>
                    <td className="py-2 pr-3 whitespace-nowrap text-right tabular-nums">
                      {typeof r.estimated === "number"
                        ? fmt.format(r.estimated)
                        : "—"}
                    </td>
                    <td className="py-2 pr-3 w-56 align-top">
                      <div className="leading-snug max-w-sm break-words">
                        {r.sponsor ?? "—"}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="px-6 py-3 border-t text-xs text-muted-foreground">
          Note: PCRs are grouped based on whether they are{" "}
          <span className="font-medium">first time</span> in this CC or{" "}
          <span className="font-medium">carry-over</span> from previous CC
          meetings (using the <code>ccPreviousMeeting</code> field).
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Path timeline (for each table section)
// ==========================================
type PathTimelineProps = {
  label: string;
  stages: string[];
};

function PathTimeline({ label, stages }: PathTimelineProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 pt-4 pb-2 gap-2">
      <div className="text-sm font-semibold text-neutral-800">{label}</div>
      <div className="flex items-center gap-2 text-[11px] text-neutral-700 flex-wrap">
        {stages.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-900 font-medium">
              {s}
            </span>
            {i < stages.length - 1 && (
              <span className="text-neutral-300 text-base leading-none">
                →
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// Common table headers
// ==========================================
function ChangeTableHeader({
  showMiddleColumn = false,
  middleLabel = "Issued Item",
}: {
  showMiddleColumn?: boolean;
  middleLabel?: string;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-neutral-500 bg-white border-y">
      <div className="col-span-1">Ref ID</div>
      <div className="col-span-1">Package</div>
      <div className="col-span-2">Title</div>
      <div className="col-span-2">Stage</div>

      <div
        className={clsx(
          "col-span-1",
          !showMiddleColumn && "hidden",
        )}
      >
        {showMiddleColumn ? middleLabel : null}
      </div>

      <div className="col-span-2">Sponsor</div>
      <div className="col-span-1 text-right">Estimated</div>
      <div className="col-span-1 text-right">Actual</div>
      <div className="col-span-1 text-right">Variance</div>
    </div>
  );
}

function CompletedTableHeader() {
  return (
    <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-neutral-500 bg-white border-y">
      <div className="col-span-1">Ref ID</div>
      <div className="col-span-1">Package</div>
      <div className="col-span-3">Title</div>
      <div className="col-span-2">Issued Item</div>
      <div className="col-span-2">Sponsor</div>
      <div className="col-span-1 text-right">Estimated</div>
      <div className="col-span-1 text-right">Actual</div>
      <div className="col-span-1 text-right">Variance</div>
    </div>
  );
}

// ==========================================
// Package chips
// ==========================================
const PKG_COLORS: Record<PackageId, string> = {
  A: "bg-blue-500",
  B: "bg-teal-600",
  C: "bg-orange-500",
  D: "bg-rose-600",
  E: "bg-gray-500",
  F: "bg-violet-600",
  G: "bg-emerald-600",
  I2: "bg-orange-700",
  PMEC: "bg-violet-700",
};

function PackageChips({
  selected,
  onSelect,
}: {
  selected: PackageId | "All";
  onSelect: (p: PackageId | "All") => void;
}) {
  const items: PackageId[] = ["A", "B", "C", "D", "E", "F", "G", "I2", "PMEC"];

  return (
    <div className="flex items-center gap-3 justify-between rounded-2xl border p-3">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-sm text-foreground/80 mr-1">Packages:</span>
        {items.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onSelect(p)}
            className={clsx(
              "w-9 h-9 rounded-full text-white text-[11px] font-semibold grid place-items-center",
              PKG_COLORS[p],
              selected === p
                ? "ring-2 ring-offset-2 ring-gray-900"
                : "opacity-90 hover:opacity-100",
            )}
            title={`Package ${p}`}
          >
            {p}
          </button>
        ))}
        <button
          type="button"
          className="text-sm underline-offset-2 hover:underline"
          onClick={() => onSelect("All")}
        >
          All
        </button>
        <button
          type="button"
          className="text-sm underline-offset-2 hover:underline"
          onClick={() => onSelect("All")}
        >
          None
        </button>
      </div>
    </div>
  );
}

// ==========================================
// Filters
// ==========================================
function Filters({
  q,
  setQ,
  onExport,
}: {
  q: string;
  setQ: (s: string) => void;
  onExport: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ID / title / sponsor"
            className="pl-8 rounded-2xl min-w-[220px]"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onExport} className="rounded-2xl" variant="secondary">
          Export CSV
        </Button>
      </div>
    </div>
  );
}

// ==========================================
// Row + details
// ==========================================
type RowMode = "pcr" | "completed";

function Row({
  r,
  showMiddleColumn,
  mode,
}: {
  r: ChangeRecord;
  showMiddleColumn: boolean;
  mode: RowMode;
}) {
  const s = stageInfo(r.stageKey);
  const days = daysBetween(r.stageStartDate);

  const hasDocs = (r.links?.length ?? 0) > 0;

  const varianceValue =
    typeof r.estimated === "number" && typeof r.actual === "number"
      ? r.actual - r.estimated
      : null;

  return (
    <div className="border-b last:border-b-0 bg-white">
      <div className="grid grid-cols-12 gap-4 px-6 py-3 items-start">
        {/* Ref ID + documents */}
        <div className="col-span-1">
          <div className="text-sm font-medium">{r.id}</div>
          {hasDocs && (
            <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
              {r.links!.map((lnk, i) => (
                <a
                  key={i}
                  href={lnk.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="truncate">{lnk.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Package */}
        <div className="col-span-1">
          <div className="w-8 h-8 rounded-full bg-muted grid place-items-center text-sm font-semibold">
            {r.package}
          </div>
        </div>

        {/* Title */}
        <div className="col-span-2">
          <div className="text-sm leading-snug break-words max-w-xs">
            {r.title}
          </div>
        </div>

        {/* Stage */}
        <div className="col-span-2">
          <div className="inline-flex items-center gap-2 mb-1">
            <span
              className={clsx(
                "px-2 py-1 rounded-2xl text-xs font-semibold",
                s.color,
              )}
            >
              {s.name}
            </span>
            {r.subStatus && (
              <Badge className="rounded-2xl bg-neutral-100 text-neutral-900 border">
                {r.subStatus}
              </Badge>
            )}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Day {days} / SLA {s.slaDays}
          </div>
        </div>

        {/* Middle column (Issued Item in completed table) */}
        <div
          className={clsx(
            "col-span-1",
            !showMiddleColumn && "hidden",
          )}
        >
          {showMiddleColumn && mode === "completed" && (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-medium">
              {issuedItemLabel(r)}
            </span>
          )}
        </div>

        {/* Sponsor */}
        <div className="col-span-2 text-sm leading-snug break-words max-w-xs">
          {r.sponsor ?? "—"}
        </div>

        {/* Estimated */}
        <div className="col-span-1 text-right">
          <div className="text-sm tabular-nums">
            {typeof r.estimated === "number" ? fmt.format(r.estimated) : "—"}
          </div>
        </div>

        {/* Actual */}
        <div className="col-span-1 text-right">
          <div className="text-sm tabular-nums">
            {typeof r.actual === "number" ? fmt.format(r.actual) : "—"}
          </div>
        </div>

        {/* Variance */}
        <div className="col-span-1 text-right">
          <div className="text-sm tabular-nums">
            {varianceValue === null
              ? "—"
              : `${varianceValue > 0 ? "+" : varianceValue < 0 ? "-" : ""}${fmt.format(
                  Math.abs(varianceValue),
                )}`}
          </div>
        </div>
      </div>
    </div>
  );
}

function CompletedRow({ r }: { r: ChangeRecord }) {
  const varianceValue =
    typeof r.estimated === "number" && typeof r.actual === "number"
      ? r.actual - r.estimated
      : null;

  return (
    <div className="border-b last:border-b-0 bg-white">
      <div className="grid grid-cols-12 gap-4 px-6 py-3 items-start">
        {/* Ref ID */}
        <div className="col-span-1">
          <div className="text-sm font-medium">{r.id}</div>
          {(r.links?.length ?? 0) > 0 && (
            <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground">
              {r.links!.map((lnk, i) => (
                <a
                  key={i}
                  href={lnk.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span className="truncate">{lnk.label}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Package */}
        <div className="col-span-1">
          <div className="w-8 h-8 rounded-full bg-muted grid place-items-center text-sm font-semibold">
            {r.package}
          </div>
        </div>

        {/* Title */}
        <div className="col-span-3">
          <div className="text-sm leading-snug break-words">{r.title}</div>
        </div>

        {/* Issued Item */}
        <div className="col-span-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-medium">
            {issuedItemLabel(r)}
          </span>
        </div>

        {/* Sponsor */}
        <div className="col-span-2 text-sm leading-snug break-words">
          {r.sponsor ?? "—"}
        </div>

        {/* Estimated */}
        <div className="col-span-1 text-right">
          <div className="text-sm tabular-nums">
            {typeof r.estimated === "number" ? fmt.format(r.estimated) : "—"}
          </div>
        </div>

        {/* Actual */}
        <div className="col-span-1 text-right">
          <div className="text-sm tabular-nums">
            {typeof r.actual === "number" ? fmt.format(r.actual) : "—"}
          </div>
        </div>

        {/* Variance */}
        <div className="col-span-1 text-right">
          <div className="text-sm tabular-nums">
            {varianceValue === null
              ? "—"
              : `${varianceValue > 0 ? "+" : varianceValue < 0 ? "-" : ""}${fmt.format(
                  Math.abs(varianceValue),
                )}`}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// Project KPIs row (3 cards + Next CC card)
// ==========================================
function ProjectKPIs({
  rows,
  onOpenNextCc,
}: {
  rows: ChangeRecord[];
  onOpenNextCc: () => void;
}) {
  const TOTAL_PROJECT_VALUE = 500_000_000;
  const ALLOWED_LIMIT_PERCENT = 10;

  const kpis = useMemo(() => {
    const approved = rows.filter(
      (r) => r.target === "CO" || r.target === "VOS",
    );

    const totalApprovedValue = approved.reduce(
      (sum, r) => sum + (r.actual ?? 0),
      0,
    );

    const percentageOfProject =
      TOTAL_PROJECT_VALUE > 0
        ? (totalApprovedValue / TOTAL_PROJECT_VALUE) * 100
        : 0;

    const limitValue = (TOTAL_PROJECT_VALUE * ALLOWED_LIMIT_PERCENT) / 100;
    const percentOfLimit =
      limitValue > 0 ? (totalApprovedValue / limitValue) * 100 : 0;

    return {
      totalApprovedValue,
      percentageOfProject,
      percentOfLimit,
    };
  }, [rows]);

  const formatCurrency = (val: number) =>
    `AED ${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
      {/* TOTAL PROJECT VALUE */}
      <Card className="rounded-2xl h-full">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div>
            <p className="text-sm text-muted-foreground">Total Project Value</p>
            <p className="text-xl font-semibold mt-1">
              {formatCurrency(TOTAL_PROJECT_VALUE)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="self-start mt-4"
            onClick={() => {
              alert("Later this can show breakdown by package (A, B, C, etc.)");
            }}
          >
            Details
          </Button>
        </CardContent>
      </Card>

      {/* TOTAL APPROVED CHANGE VALUE */}
      <Card className="rounded-2xl h-full">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div>
            <p className="text-sm text-muted-foreground">
              Total Approved Change Value
            </p>
            <p className="text-xl font-semibold mt-1">
              {formatCurrency(kpis.totalApprovedValue)}
            </p>

            <p className="text-xs text-muted-foreground mt-2">
              of {formatCurrency((TOTAL_PROJECT_VALUE * 10) / 100)} limit (10%
              of project)
            </p>

            <div className="mt-2">
              <Progress value={kpis.percentOfLimit} />
              <p className="text-xs mt-1">
                {kpis.percentOfLimit.toFixed(1)}% of allowed envelope used
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="self-start mt-4"
            onClick={() => {
              alert("Later this can open a list of approved CO/VOS items.");
            }}
          >
            Details
          </Button>
        </CardContent>
      </Card>

      {/* CHANGE % OF PROJECT */}
      <Card className="rounded-2xl h-full">
        <CardContent className="p-4 flex flex-col justify-between h-full">
          <div>
            <p className="text-sm text-muted-foreground">Change % of Project</p>
            <p className="text-xl font-semibold mt-1">
              {kpis.percentageOfProject.toFixed(2)}%
            </p>

            <p className="text-xs text-muted-foreground mt-2">of 10% limit</p>

            <div className="mt-2">
              <Progress value={kpis.percentageOfProject} />
              <p className="text-xs mt-1">
                {kpis.percentageOfProject.toFixed(1)}% of percentage limit used
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* NEXT CC MEETING */}
      <NextCcCard rows={rows} onOpenDetails={onOpenNextCc} />
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================
export default function ChangeOrdersDashboard({
  initial,
}: {
  initial?: ChangeRecord[];
}) {
  const [stage] = useState<StageKey | "All">("All");
  const [pkg, setPkg] = useState<PackageId | "All">("All");
  const [q, setQ] = useState("");
  const [rows] = useState<ChangeRecord[]>(initial ?? DEMO);
  const [showNextCc, setShowNextCc] = useState(false);

  const view = useMemo(
    () =>
      rows
        .filter((r) => (stage === "All" ? true : r.stageKey === stage))
        .filter((r) => (pkg === "All" ? true : r.package === pkg))
        .filter((r) =>
          q
            ? `${r.id} ${r.title} ${r.sponsor ?? ""}`
                .toLowerCase()
                .includes(q.toLowerCase())
            : true,
        ),
    [rows, stage, pkg, q],
  );

  const pcrRows = useMemo(
    () => view.filter((r) => r.type === "PRC"),
    [view],
  );
  const pcrToEiRows = useMemo(
    () => pcrRows.filter((r) => r.target === "EI"),
    [pcrRows],
  );
  const pcrToCoRows = useMemo(
    () =>
      pcrRows.filter(
        (r) => r.target === "CO" || r.target === "VOS" || r.target === "AA",
      ),
    [pcrRows],
  );

  const completedRows = useMemo(
    () =>
      view.filter((r) => {
        const isEICompleted =
          r.stageKey === "EI" &&
          (r.subStatus === "Issued" ||
            r.subStatus === "To be Issued to Contractor");
        const isCOOrAACompleted =
          (r.stageKey === "CO_V_VOS" && r.subStatus === "Done") ||
          (r.stageKey === "AA_SA" && r.subStatus === "Done");
        return isEICompleted || isCOOrAACompleted;
      }),
    [view],
  );

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Title */}
      <div className="w-full text-center text-3xl font-semibold tracking-tight mb-2">
        Change Management Dashboard
      </div>

      {/* Summary + KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
        <SummaryCard rows={view} />
        <div className="md:col-span-3">
          <ProjectKPIs
            rows={view}
            onOpenNextCc={() => setShowNextCc(true)}
          />
        </div>
      </div>

      {/* Search + export */}
      <Filters q={q} setQ={setQ} onExport={() => exportCSV(view)} />

      {/* Main table + package filter */}
      <Card className="rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {/* Package chips */}
          <div className="px-4 pt-4 pb-2 bg-white">
            <PackageChips selected={pkg} onSelect={setPkg} />
          </div>

          {/* PCR → EI section */}
          <Card className="rounded-2xl border shadow-sm mb-6">
            <CardContent className="p-0">
              <section>
                <PathTimeline
                  label="PCRs → EI"
                  stages={["PRC", "CC Outcome", "CEO / Board Memo", "EI"]}
                />
                <ChangeTableHeader />
                {pcrToEiRows.length > 0 ? (
                  pcrToEiRows.map((r) => (
                    <Row
                      key={r.id}
                      r={r}
                      mode="pcr"
                      showMiddleColumn={false}
                    />
                  ))
                ) : (
                  <div className="px-4 py-4 text-xs text-neutral-500">
                    No PCRs currently tagged as PCR → EI under the current
                    filters.
                  </div>
                )}
              </section>
            </CardContent>
          </Card>

          {/* PCR → CO / V / VOS / AA-SA section */}
          <Card className="rounded-2xl border shadow-sm mb-6">
            <CardContent className="p-0">
              <section>
                <PathTimeline
                  label="PCRs → CO / V / VOS / AA-SA"
                  stages={[
                    "PRC",
                    "CC Outcome",
                    "CEO / Board Memo",
                    "CO / V / VOS or AA / SA",
                  ]}
                />
                <ChangeTableHeader />
                {pcrToCoRows.length > 0 ? (
                  pcrToCoRows.map((r) => (
                    <Row
                      key={r.id}
                      r={r}
                      mode="pcr"
                      showMiddleColumn={false}
                    />
                  ))
                ) : (
                  <div className="px-4 py-4 text-xs text-neutral-500">
                    No PCRs currently tagged as PCR → CO / V / VOS / AA-SA after
                    filters.
                  </div>
                )}
              </section>
            </CardContent>
          </Card>

          {/* Completed items section */}
          <Card className="rounded-2xl border shadow-sm mb-6">
            <CardContent className="p-0">
              <section>
                <PathTimeline
                  label="Completed (EI / CO / V / VOS or AA / SA Issued)"
                  stages={[
                    "PRC",
                    "CC Outcome",
                    "CEO / Board Memo",
                    "Issued Item (EI / CO / V / VOS / AA / SA)",
                  ]}
                />
                <CompletedTableHeader />
                {completedRows.length > 0 ? (
                  completedRows.map((r) => <CompletedRow key={r.id} r={r} />)
                ) : (
                  <div className="px-4 py-4 text-xs text-neutral-500">
                    No completed changes under the current filters.
                  </div>
                )}
              </section>
            </CardContent>
          </Card>

          {pcrRows.length === 0 && view.length > 0 && (
            <div className="px-4 py-4 text-xs text-neutral-500">
              Current filters match only non-PCR records (EI / CO etc.).
            </div>
          )}

          {view.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No records match the current filters.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next CC Modal */}
      {showNextCc && (
        <NextCcModal
          rows={view}
          onClose={() => setShowNextCc(false)}
        />
      )}

      {/* Footer note */}
      <div className="text-xs text-muted-foreground">
        Lifecycle covered: PRC → CC Outcome → CEO / Board Memo → EI →
        CO/V/VOS → AA/SA. SLA &amp; progress are derived directly from the
        stage and dates. PCRs are grouped by their path (PCRs → EI and PCRs → CO
        / V / VOS / AA-SA), while the last table shows completed issued items
        (EI / CO / V / VOS / AA / SA).
      </div>
    </div>
  );
}
