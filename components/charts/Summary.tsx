'use client';
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

type PaymentsDatum = { pkg: string; paidPct: number };
type StatusDatum = { name: string; value: number };

export function PaymentsByPackageChart({ data, colors }: { data: PaymentsDatum[]; colors: Record<string,string> }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="pkg" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="paidPct">
            {data.map((d, i) => <Cell key={i} fill={colors[d.pkg] ?? '#0ea5e9'} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusPie({ data, color }: { data: StatusDatum[]; color?: string }) {
  const palette = ['#22c55e', '#eab308', '#ef4444', '#64748b', '#0ea5e9']; // simple fallback
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <PieChart>
          <Pie dataKey="value" data={data} outerRadius={90} label>
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={palette[idx % palette.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
