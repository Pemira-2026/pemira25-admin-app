/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

export function ResultsChart({ data }: { data: any[] }) {
     return (
          <ResponsiveContainer width="100%" height={350}>
               <BarChart data={data}>
                    <XAxis
                         dataKey="name"
                         stroke="#888888"
                         fontSize={12}
                         tickLine={false}
                         axisLine={false}
                    />
                    <YAxis
                         stroke="#888888"
                         fontSize={12}
                         tickLine={false}
                         axisLine={false}
                         tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                         cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                         contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         labelStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend />
                    <Bar dataKey="onlineVotes" name="Online" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="offlineVotes" name="Manual/Offline" stackId="a" fill="hsl(var(--chart-offline))" radius={[4, 4, 0, 0]} />
               </BarChart>
          </ResponsiveContainer>
     );
}
