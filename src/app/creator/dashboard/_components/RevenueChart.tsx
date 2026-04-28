'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

// Deterministic 30-day revenue data — avoids hydration mismatch
const DAILY_VALUES = [
  85, 120, 95, 140, 110, 75, 180, 95, 125, 160,
  85, 200, 115, 95, 175, 145, 120, 90, 185, 155,
  170, 140, 95, 165, 200, 175, 155, 185, 205, 340,
]

const REVENUE_DATA = DAILY_VALUES.map((revenue, i) => {
  // Anchor to Apr 2026 so labels are stable regardless of render time
  const d = new Date(2026, 2, 30 + i) // starts ~30 Mar 2026
  const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  return { date: label, revenue }
})

const MINT = 'oklch(78% 0.175 160)'
const GRID = '#2A2A2A'
const TICK_STYLE = {
  fill: 'oklch(35% 0.009 240)',
  fontSize: 10,
  fontFamily: "'Martian Mono', monospace",
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={REVENUE_DATA} margin={{ top: 5, right: 8, bottom: 5, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} vertical={false} />
        <XAxis
          dataKey="date"
          interval={8}
          tick={TICK_STYLE}
          tickLine={false}
          axisLine={false}
        />
        <YAxis hide />
        <Tooltip
          contentStyle={{
            background: 'oklch(11% 0.008 245)',
            border: '1px solid oklch(22% 0.009 245)',
            borderRadius: 0,
            color: 'oklch(93% 0.005 240)',
            fontSize: 11,
            fontFamily: "'Martian Mono', monospace",
          }}
          formatter={(value) => [`£${value ?? 0}`, 'Revenue']}
          labelStyle={{ color: 'oklch(58% 0.010 240)' }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={MINT}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: MINT, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
