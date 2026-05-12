"use client";

import { useEffect, useRef, useState } from "react";

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  energy: number;
  type: "herbivore" | "carnivore" | "plant";
  size: number;
  age: number;
}

const COLORS = {
  herbivore: "#4ade80",
  carnivore: "#f87171",
  plant: "#facc15",
};

export default function SimulationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [paused, setPaused] = useState(false);
  const statsRef = useRef({ herbivores: 0, carnivores: 0, plants: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initAgents = () => {
      const newAgents: Agent[] = [];
      for (let i = 0; i < 30; i++) {
        newAgents.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          energy: 50 + Math.random() * 50,
          type: "herbivore",
          size: 3 + Math.random() * 3,
          age: 0,
        });
      }
      for (let i = 0; i < 15; i++) {
        newAgents.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          energy: 60 + Math.random() * 40,
          type: "carnivore",
          size: 4 + Math.random() * 2,
          age: 0,
        });
      }
      for (let i = 0; i < 50; i++) {
        newAgents.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          energy: 100,
          type: "plant",
          size: 2 + Math.random() * 2,
          age: 0,
        });
      }
      setAgents(newAgents);
    };

    initAgents();

    let animationId: number;
    const animate = () => {
      if (!paused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update & draw
        setAgents((prev) => {
          const updated = prev.map((agent) => {
            const updatedAgent = { ...agent, age: agent.age + 1 };

            if (agent.type === "plant") {
              updatedAgent.energy = Math.min(100, agent.energy + 0.1);
              const drawX = agent.x + Math.sin(agent.age * 0.05) * 2;
              ctx.beginPath();
              ctx.arc(drawX, agent.y, agent.size, 0, Math.PI * 2);
              ctx.fillStyle = COLORS.plant;
              ctx.globalAlpha = 0.6 + Math.sin(agent.age * 0.1) * 0.2;
              ctx.fill();
              ctx.globalAlpha = 1;
              return updatedAgent;
            }

            if (agent.type === "herbivore") {
              // Seek nearest plant
              let nearestPlant = prev.find(
                (a) => a.type === "plant" && a.energy > 0
              );
              let minDist = Infinity;
              prev.forEach((a) => {
                if (a.type === "plant" && a.energy > 0) {
                  const d = Math.hypot(a.x - agent.x, a.y - agent.y);
                  if (d < minDist) {
                    minDist = d;
                    nearestPlant = a;
                  }
                }
              });

              if (nearestPlant && minDist < 100) {
                const angle = Math.atan2(
                  nearestPlant.y - agent.y,
                  nearestPlant.x - agent.x
                );
                updatedAgent.vx = Math.cos(angle) * 1.5;
                updatedAgent.vy = Math.sin(angle) * 1.5;
              } else {
                updatedAgent.vx += (Math.random() - 0.5) * 0.2;
                updatedAgent.vy += (Math.random() - 0.5) * 0.2;
                const speed = Math.hypot(updatedAgent.vx, updatedAgent.vy);
                if (speed > 2) {
                  updatedAgent.vx = (updatedAgent.vx / speed) * 2;
                  updatedAgent.vy = (updatedAgent.vy / speed) * 2;
                }
              }

              updatedAgent.x += updatedAgent.vx;
              updatedAgent.y += updatedAgent.vy;
              updatedAgent.energy -= 0.15;

              // Wrap edges
              if (updatedAgent.x < 0) updatedAgent.x = canvas.width;
              if (updatedAgent.x > canvas.width) updatedAgent.x = 0;
              if (updatedAgent.y < 0) updatedAgent.y = canvas.height;
              if (updatedAgent.y > canvas.height) updatedAgent.y = 0;

              // Eat plant if close
              prev.forEach((p) => {
                if (
                  p.type === "plant" &&
                  p.energy > 0 &&
                  Math.hypot(p.x - updatedAgent.x, p.y - updatedAgent.y) <
                    agent.size + p.size
                ) {
                  p.energy = 0;
                  updatedAgent.energy = Math.min(100, updatedAgent.energy + 15);
                }
              });

              ctx.beginPath();
              ctx.arc(agent.x, agent.y, agent.size, 0, Math.PI * 2);
              ctx.fillStyle = COLORS.herbivore;
              ctx.globalAlpha = Math.min(1, agent.energy / 30);
              ctx.fill();
              ctx.globalAlpha = 1;
              return updatedAgent;
            }

            if (agent.type === "carnivore") {
              // Seek nearest herbivore
              let nearestHerb = prev.find((a) => a.type === "herbivore");
              let minDist = Infinity;
              prev.forEach((a) => {
                if (a.type === "herbivore") {
                  const d = Math.hypot(a.x - agent.x, a.y - agent.y);
                  if (d < minDist) {
                    minDist = d;
                    nearestHerb = a;
                  }
                }
              });

              if (nearestHerb && minDist < 150) {
                const angle = Math.atan2(
                  nearestHerb.y - agent.y,
                  nearestHerb.x - agent.x
                );
                updatedAgent.vx = Math.cos(angle) * 2;
                updatedAgent.vy = Math.sin(angle) * 2;
              } else {
                updatedAgent.vx += (Math.random() - 0.5) * 0.15;
                updatedAgent.vy += (Math.random() - 0.5) * 0.15;
                const speed = Math.hypot(updatedAgent.vx, updatedAgent.vy);
                if (speed > 1.8) {
                  updatedAgent.vx = (updatedAgent.vx / speed) * 1.8;
                  updatedAgent.vy = (updatedAgent.vy / speed) * 1.8;
                }
              }

              updatedAgent.x += updatedAgent.vx;
              updatedAgent.y += updatedAgent.vy;
              updatedAgent.energy -= 0.2;

              if (updatedAgent.x < 0) updatedAgent.x = canvas.width;
              if (updatedAgent.x > canvas.width) updatedAgent.x = 0;
              if (updatedAgent.y < 0) updatedAgent.y = canvas.height;
              if (updatedAgent.y > canvas.height) updatedAgent.y = 0;

              // Eat herbivore if close
              prev.forEach((h) => {
                if (
                  h.type === "herbivore" &&
                  Math.hypot(h.x - updatedAgent.x, h.y - updatedAgent.y) <
                    agent.size + h.size
                ) {
                  h.energy = 0;
                  updatedAgent.energy = Math.min(100, updatedAgent.energy + 25);
                }
              });

              ctx.beginPath();
              ctx.arc(agent.x, agent.y, agent.size + 2, 0, Math.PI * 2);
              ctx.fillStyle = COLORS.carnivore;
              ctx.globalAlpha = Math.min(1, agent.energy / 30);
              ctx.fill();
              ctx.globalAlpha = 1;
              return updatedAgent;
            }

            return updatedAgent;
          });

          // Remove dead agents
          let hCount = 0,
            cCount = 0,
            pCount = 0;
          const alive = updated.filter((a) => {
            if (a.type === "herbivore") hCount++;
            if (a.type === "carnivore") cCount++;
            if (a.type === "plant") pCount++;
            return a.energy > 0 && a.age < 5000;
          });
          statsRef.current = {
            herbivores: hCount,
            carnivores: cCount,
            plants: pCount,
          };

          // Respawn plants
          if (pCount < 20) {
            alive.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              vx: 0,
              vy: 0,
              energy: 100,
              type: "plant",
              size: 2 + Math.random() * 2,
              age: 0,
            });
          }

          return alive;
        });

        animationId = requestAnimationFrame(animate);
      } else {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [paused]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
      <canvas
        ref={canvasRef}
        width={680}
        height={480}
        className="w-full h-auto aspect-[4/3] block"
      />
      <div className="absolute top-3 left-3 flex gap-2">
        <span className="px-2 py-1 rounded-lg bg-neutral-900/80 backdrop-blur text-xs font-mono text-rose-400">
          Herbivores: {statsRef.current.herbivores}
        </span>
        <span className="px-2 py-1 rounded-lg bg-neutral-900/80 backdrop-blur text-xs font-mono text-emerald-400">
          Plants: {statsRef.current.plants}
        </span>
        <span className="px-2 py-1 rounded-lg bg-neutral-900/80 backdrop-blur text-xs font-mono text-amber-400">
          Carnivores: {statsRef.current.carnivores}
        </span>
      </div>
      <button
        onClick={() => setPaused(!paused)}
        className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-neutral-900/80 backdrop-blur text-xs font-mono border border-neutral-700 hover:border-neutral-500 transition-colors"
      >
        {paused ? "▶ Play" : "⏸ Pause"}
      </button>
    </div>
  );
}