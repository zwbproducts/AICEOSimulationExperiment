import SimulationCanvas from "@/components/SimulationCanvas";
import StatsPanel from "@/components/StatsPanel";
import ControlsPanel from "@/components/ControlsPanel";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center font-bold text-black text-lg">
              AI
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">AICEOSimulationExperiment</h1>
              <p className="text-xs text-neutral-500">AI Life in a Box</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-neutral-400 font-mono">LIVE</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold tracking-tight mb-4">
          Simulate AI Life
          <span className="block text-3xl mt-2 text-neutral-400 font-normal">
            in a Box
          </span>
        </h2>
        <p className="text-neutral-400 max-w-2xl mx-auto mb-8 text-lg">
          A full simulation of an AI life with realistic interactivity, gamified experience,
          and emergent behaviors. Watch your digital organisms evolve, learn, and adapt.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold transition-colors">
            ▶ Start Simulation
          </button>
          <button className="px-6 py-3 rounded-xl border border-neutral-700 hover:border-neutral-500 transition-colors">
            ⚙ Settings
          </button>
        </div>
      </section>

      {/* Simulation Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SimulationCanvas />
          </div>
          <div className="flex flex-col gap-6">
            <StatsPanel />
            <ControlsPanel />
          </div>
        </div>
      </section>
    </main>
  );
}