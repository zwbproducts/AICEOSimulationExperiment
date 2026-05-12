"use client";

import { useEffect, useState } from "react";

interface Stat {
  label: string;
  value: string;
  change: number;
}

export default function StatsPanel() {
  const [stats, setStats] = useState<Stat[]>([
    { label: "Population", value: "0", change: 0 },
    { label: "Generations", value: "0", change: 0 },
    { label: "Avg Energy", value: "0", change: 0 },
    { label: "Ecosystem Balance", value: "0%", change: 0 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((s) => ({
          ...s,
          value: (
            parseInt(s.value) + Math.floor(Math.random() * 5) - 1
          ).toString(),
          change: Math.round((Math.random() - 0.4) * 10),
        }))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
        Simulation Stats
      </h3>
      <div className="space-y-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between p-3 rounded-xl bg-neutral-800/50"
          >
            <span className="text-sm text-neutral-400">{stat.label}</span>
            <span className="text-lg font-bold font-mono text-white">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}