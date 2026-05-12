"use client";

import { useState } from "react";

export default function ControlsPanel() {
  const [speed, setSpeed] = useState(1);
  const [mutationRate, setMutationRate] = useState(5);
  const [spawnRate, setSpawnRate] = useState(50);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
          Controls
        </h3>

        <div className="space-y-4">
          <div>
            <label className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Simulation Speed</span>
              <span className="font-mono text-white">{speed}x</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Mutation Rate</span>
              <span className="font-mono text-white">{mutationRate}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={50}
              value={mutationRate}
              onChange={(e) => setMutationRate(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Spawn Rate</span>
              <span className="font-mono text-white">{spawnRate}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              value={spawnRate}
              onChange={(e) => setSpawnRate(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div>
            <label className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>World Size</span>
              <span className="font-mono text-white">Medium</span>
            </label>
            <div className="flex gap-2">
              {["Small", "Medium", "Large"].map((size) => (
                <button
                  key={size}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    size === "Medium"
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 font-semibold text-sm transition-colors">
            🔄 Reset Simulation
          </button>
        </div>
      </div>

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #34d399;
          cursor: pointer;
          border: 2px solid #064e3b;
        }
        .slider-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #34d399;
          cursor: pointer;
          border: 2px solid #064e3b;
        }
      `}</style>
    </div>
  );
}