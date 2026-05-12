"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <SimulationPage />
    </main>
  );
}

/* ================================================================
   AI CEO SIMULATION — Dr. Naledi Khumalo in the Box
   ================================================================ */
function SimulationPage() {
  const [score, setScore] = useState(0);
  const [boardTrust, setBoardTrust] = useState(87);
  const [approvalRating, setApprovalRating] = useState(72);
  const [stress, setStress] = useState(34);
  const [coffeeQuality, setCoffeeQuality] = useState(78);
  const [trollApproval, setTrollApproval] = useState(25);
  const [quorum, setQuorum] = useState(67);
  const [ceoInfluence, setCeoInfluence] = useState(82);
  const [trollInfluence, setTrollInfluence] = useState(45);
  const [execInfluence, setExecInfluence] = useState(65);
  const [boardInfluence, setBoardInfluence] = useState(58);
  const [mediaSentiment, setMediaSentiment] = useState(35);
  const [aiHype, setAiHype] = useState(90);
  const [hagglePower, setHagglePower] = useState(100);
  const [counterAttacks, setCounterAttacks] = useState(3);
  const [day, setDay] = useState(1);
  const [cycle, setCycle] = useState(1);
  const [hagglesWon, setHagglesWon] = useState(0);
  const [hagglesLost, setHagglesLost] = useState(0);
  const [coffeeBrews, setCoffeeBrews] = useState(0);
  const [trollAttacks, setTrollAttacks] = useState(0);
  const [quorumCalls, setQuorumCalls] = useState(0);
  const [votesCast, setVotesCast] = useState(0);
  const [haggleInProgress, setHaggleInProgress] = useState(false);
  const [haggleProgress, setHaggleProgress] = useState(0);
  const [haggleResult, setHaggleResult] = useState<"win" | "lose" | "draw" | "">("");
  const [haggleStatus, setHaggleStatus] = useState(
    "🎯 Dr. Khumalo is being challenged on maintaining quorum. The executive coffee she approved has created a quorum crisis."
  );
  const [crisisActive, setCrisisActive] = useState(false);
  const [feeds, setFeeds] = useState<Array<{ id: number; actor: string; text: string; type: string; time: string }>>([]);
  const [chatMsgs, setChatMsgs] = useState<Array<{ id: number; who: string; text: string }>>([]);
  const [decisions, setDecisions] = useState<Array<{ id: number; type: string; text: string }>>([]);
  const [timelineEvents, setTimelineEvents] = useState<Array<{ id: number; emoji: string; label: string }>>([]);
  const [chatInput, setChatInput] = useState("");

  const feedIdRef = useRef(0);
  const chatIdRef = useRef(0);
  const decisionIdRef = useRef(0);
  const timelineIdRef = useRef(0);
  const quorumAnimRef = useRef<number>(0);

  const clamp = (v: number, mn: number, mx: number) => Math.max(mn, Math.min(mx, v));
  const now = () => {
    const d = new Date();
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  };

  /* ---------- FLASH & CONFETTI ---------- */
  const flash = (col = "#fff") => {
    const el = document.getElementById("flashOverlay");
    if (el) { el.style.background = col; el.classList.add("active"); setTimeout(() => el.classList.remove("active"), 150); }
  };

  const launchConfetti = () => {
    const c = document.getElementById("confettiContainer");
    if (!c) return;
    const cols = ["#ff2d95", "#00f0ff", "#b829dd", "#39ff14", "#ff6a00", "#ffe600"];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement("div"); p.className = "confetti-piece";
      p.style.left = Math.random() * 100 + "%"; p.style.background = cols[Math.floor(Math.random() * cols.length)];
      p.style.animationDuration = (2 + Math.random() * 3) + "s"; p.style.animationDelay = Math.random() * 0.5 + "s";
      p.style.width = (5 + Math.random() * 10) + "px"; p.style.height = (5 + Math.random() * 10) + "px";
      p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      c.appendChild(p); setTimeout(() => p.remove(), 5000);
    }
  };

  /* ---------- ADDERS ---------- */
  const addFeed = useCallback((actor: string, text: string, type = "") => {
    feedIdRef.current++;
    setFeeds(prev => [{ id: feedIdRef.current, actor, text, type, time: now() }, ...prev].slice(0, 50));
  }, []);

  const addChat = useCallback((who: string, text: string) => {
    chatIdRef.current++;
    setChatMsgs(prev => [...prev, { id: chatIdRef.current, who, text }].slice(-30));
    setTimeout(() => {
      const el = document.getElementById("chatScroll");
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }, []);

  const addDecision = useCallback((type: string, text: string) => {
    decisionIdRef.current++;
    setDecisions(prev => [{ id: decisionIdRef.current, type, text }, ...prev].slice(0, 30));
  }, []);

  const addTimelineEvent = useCallback((emoji: string, label: string) => {
    timelineIdRef.current++;
    setTimelineEvents(prev => [...prev, { id: timelineIdRef.current, emoji, label }]);
    setTimeout(() => {
      const el = document.getElementById("timelineScroll");
      if (el) el.scrollLeft = el.scrollWidth;
    }, 50);
  }, []);

  const updateScore = (d: number) => setScore(prev => Math.max(0, prev + d));

  /* ---------- HAGGLE ---------- */
  const doHaggle = () => {
    if (haggleInProgress) return;
    setHaggleInProgress(true);
    setHaggleProgress(0);
    setHaggleResult("");
    setHaggleStatus("⚡ HAGGLE ROUND IN PROGRESS! Dr. Khumalo fires back at the trolls...");
    addDecision("haggle", `Haggle initiated — Power ${hagglePower}`);
    addFeed("System", "Haggle round initiated! Negotiation in progress...", "sys");

    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p > 100) p = 100;
      setHaggleProgress(p);
      setHagglePower(clamp(100 - p * 0.8, 20, 100));
      if (p >= 100) { clearInterval(iv); setTimeout(resolveHaggle, 500); }
    }, 300);
  };

  const resolveHaggle = () => {
    setHaggleInProgress(false);
    const outcomes = ["win", "win", "draw", "lose", "win"];
    const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];

    if (outcome === "win") {
      setHaggleResult("win");
      setHaggleStatus("✅ Haggle won! Dr. Khumalo's coffee policy stands. Troll meme countered.");
      setBoardTrust(v => clamp(v + 5, 0, 100)); setApprovalRating(v => clamp(v + 3, 0, 100));
      setQuorum(v => clamp(v + 4, 0, 100)); setTrollApproval(v => clamp(v - 8, 0, 100));
      setCeoInfluence(v => clamp(v + 3, 0, 100)); setTrollInfluence(v => clamp(v - 4, 0, 100));
      updateScore(50); setHagglesWon(v => v + 1);
      addTimelineEvent("🏆", "Haggle Win");
      addChat("ceo", haggleResponses[Math.floor(Math.random() * haggleResponses.length)].text);
      addFeed("Dr. K.", "Successfully defended coffee policy!", "good");
      launchConfetti();
    } else if (outcome === "draw") {
      setHaggleResult("draw");
      setHaggleStatus("🤝 Haggle drawn — committee review scheduled.");
      setQuorum(v => clamp(v - 2, 0, 100)); setStress(v => clamp(v + 5, 0, 100));
      updateScore(15); addTimelineEvent("🤝", "Draw");
      addFeed("System", "Haggle drawn — committee review pending.", "warn");
    } else {
      setHaggleResult("lose");
      setHaggleStatus("😔 Haggle lost. The trolls are winning.");
      setBoardTrust(v => clamp(v - 8, 0, 100)); setApprovalRating(v => clamp(v - 6, 0, 100));
      setQuorum(v => clamp(v - 7, 0, 100)); setTrollApproval(v => clamp(v + 10, 0, 100));
      setStress(v => clamp(v + 10, 0, 100)); setMediaSentiment(v => clamp(v - 8, 0, 100));
      setTrollInfluence(v => clamp(v + 5, 0, 100));
      updateScore(-20); setHagglesLost(v => v + 1);
      addTimelineEvent("💔", "Loss");
      addChat("troll", "🗿 \"The people have spoken! Coffee-gate is NOT over!\"");
      addFeed("TROLL_BOT_01", "Released follow-up meme: \"CEO brews chaos\"", "pop");
    }
    addDecision(outcome === "win" ? "haggle" : outcome === "draw" ? "haggle" : "reject", `Haggle ${outcome.toUpperCase()}`);
  };

  const doDefend = () => {
    flash("#00f0ff");
    setCounterAttacks(v => Math.max(0, v - 1));
    setBoardTrust(v => clamp(v + 3, 0, 100)); setCeoInfluence(v => clamp(v + 2, 0, 100));
    setTrollInfluence(v => clamp(v - 3, 0, 100)); updateScore(20);
    addDecision("defend", "CEO counter-attacked");
    addFeed("Dr. K.", "Counter-defense executed.", "ceo");
    addChat("ceo", haggleResponses[Math.floor(Math.random() * haggleResponses.length)].text);
  };

  const doApprove = () => {
    flash("#39ff14");
    setCoffeeQuality(v => clamp(v + 5, 0, 100)); setBoardTrust(v => clamp(v + 2, 0, 100));
    setQuorum(v => clamp(v + 3, 0, 100)); setCoffeeBrews(v => v + 1); updateScore(10);
    addDecision("approve", "Double down on coffee approval");
    addFeed("Dr. K.", "Re-approved executive coffee blend.", "good");
    addChat("exec", "🏢 Exec_Mocha42: \"I STILL don't approve, but numbers look better...\"");
  };

  const doReject = () => {
    flash("#ff3355");
    setStress(v => clamp(v + 8, 0, 100)); setCoffeeQuality(v => clamp(v - 15, 0, 100));
    setTrollApproval(v => clamp(v + 15, 0, 100)); setTrollInfluence(v => clamp(v + 5, 0, 100));
    updateScore(-10); addDecision("reject", "Rejected coffee policy under pressure");
    addFeed("Dr. K.", "Under pressure, reconsidered coffee. Trolls smell blood.", "bad");
    addChat("troll", "🗿 \"YES! CEO folds!\"");
  };

  const doConcede = () => {
    flash("#b829dd"); launchConfetti();
    setQuorum(v => clamp(v - 10, 0, 100)); setBoardTrust(v => clamp(v - 10, 0, 100));
    setApprovalRating(v => clamp(v - 8, 0, 100)); setTrollApproval(v => clamp(v + 20, 0, 100));
    setTrollInfluence(v => clamp(v + 8, 0, 100)); setStress(v => clamp(v + 15, 0, 100));
    updateScore(-50); addDecision("reject", "⚠️ CONCEDED — Major damage!");
    addFeed("🚨", "DR. KHUMALO CONCEDES! Board shaken.", "bad");
    addChat("troll", "🗿 \"BOW BEFORE THE MEME!\"");
  };

  const doTroll = () => {
    flash("#ff2d95");
    if (counterAttacks > 0) {
      setCounterAttacks(v => v - 1);
      setTrollApproval(v => clamp(v - 15, 0, 100)); setTrollInfluence(v => clamp(v - 10, 0, 100));
      setMediaSentiment(v => clamp(v + 10, 0, 100)); setCeoInfluence(v => clamp(v + 5, 0, 100));
      updateScore(30); addChat("ceo", "🎯 Counter-meme launched!");
      addFeed("Dr. K.", "Counter-troll operation executed.", "good");
    } else {
      addChat("troll", "🗿 \"You're out of charges!\"");
      addFeed("System", "Counter-attack failed.", "bad");
    }
  };

  const brewCoffee = () => {
    flash("#8B4513"); setCoffeeBrews(v => v + 1);
    setCoffeeQuality(v => clamp(v + Math.floor(Math.random() * 15) + 5, 0, 100));
    setStress(v => clamp(v - 5, 0, 100)); setQuorum(v => clamp(v + 2, 0, 100));
    updateScore(10);
    addDecision("approve", `Brewed coffee — CQI: ${coffeeQuality}`);
    addFeed("System", `☕ New batch brewed! Quality: ${coffeeQuality}`, "good");
  };

  const spiceCoffee = () => {
    flash("#ffaa00");
    setTrollApproval(v => clamp(v + 12, 0, 100)); setExecInfluence(v => clamp(v + 3, 0, 100));
    setStress(v => clamp(v + 8, 0, 100)); setQuorum(v => clamp(v - 5, 0, 100));
    updateScore(5); addDecision("haggle", "🌶️ SPICE MODE!");
    addFeed("🚨", "SPICE MODE activated! Things are getting chaotic.", "pop");
    addChat("troll", "🗿 \"Oh you did NOT just spice that coffee!\"");
  };

  const callQuorumVote = () => {
    flash("#00f0ff"); setQuorumCalls(v => v + 1);
    const votes = Math.floor(Math.random() * 20) + 10; setVotesCast(v => v + votes);
    if (Math.random() > 0.4) {
      setQuorum(v => clamp(v + 10, 0, 100)); setBoardTrust(v => clamp(v + 5, 0, 100));
      setApprovalRating(v => clamp(v + 4, 0, 100));
      addDecision("vote", `Quorum VOTE PASSED! ${votes} votes.`);
      addFeed("System", `🗳️ Quorum PASSED — ${votes} votes.`, "good");
      addChat("sys", "🤖 Quorum: 62% YES / 38% NO.");
    } else {
      setQuorum(v => clamp(v - 12, 0, 100)); setBoardTrust(v => clamp(v - 5, 0, 100));
      addDecision("reject", "Quorum vote FAILED!");
      addFeed("System", "🗳️ Quorum FAILED! Board in disarray.", "bad");
      addChat("exec", "🏢 Told ya. Coffee is destroying this board.");
    }
  };

  const triggerEvent = () => {
    const evts = [
      { name: "📈 Board Meeting", desc: "Emergency board meeting re: coffee policy", t: 3, q: 2 },
      { name: "🔥 Social Media Storm", desc: "New meme: CEO sipping coffee in boardroom", t: -5, q: -3 },
      { name: "🤝 Truce", desc: "TROLL_BOT_01 offers peace — demands decaf", t: 5, q: 5 },
      { name: "☕ Machine Breaks", desc: "Executive coffee machine explodes!", t: -3, q: -5 },
      { name: "🏆 Award", desc: 'Dr. Khumalo wins "Most Resilient CEO"', t: 10, q: 8 },
    ];
    const evt = evts[Math.floor(Math.random() * evts.length)];
    flash(Math.random() > 0.5 ? "#b829dd" : "#00f0ff");
    setBoardTrust(v => clamp(v + (evt.t || 0), 0, 100));
    setQuorum(v => clamp(v + (evt.q || 0), 0, 100));
    addFeed("System", `📢 ${evt.name}: ${evt.desc}`, "warn");
    addTimelineEvent("🎲", evt.name.split(" ").pop()!);
  };

  const startCrisis = () => {
    if (crisisActive) return;
    setCrisisActive(true); flash("#ff3355"); launchConfetti();
    const c = [
      { name: "Coffee Shortage", desc: "Supply chain disruption! Reserves depleted 40%.", ti: -8, qi: -10 },
      { name: "Viral Thread", desc: "Thread exposes CEO's coffee order history.", ti: -12, qi: -5 },
      { name: "Espionage", desc: "Rival caught planting decaf in exec machine!", ti: 5, qi: 8 },
      { name: "AI Overlord", desc: "TROLL_BOT_01 gains sentience, declares itself Coffee Czar!", ti: -5, qi: -15 },
      { name: "Barista Strike", desc: "Baristas demand unionization!", ti: -6, qi: -8 },
      { name: "Quantum Coffee", desc: "Coffee is both hot AND cold. Board confused.", ti: 3, qi: -5 },
    ][Math.floor(Math.random() * 6)];
    setBoardTrust(v => clamp(v + c.ti, 0, 100)); setQuorum(v => clamp(v + c.qi, 0, 100));
    setStress(v => clamp(v + 15, 0, 100)); setTrollApproval(v => clamp(v + 10, 0, 100));
    addFeed("🚨 CRISIS", `${c.name}: ${c.desc}`, "bad");
    addChat("troll", "🗿 \"CRISIS MODE ACTIVATED. Board in shambles.\"");
    addChat("exec", `🏢 Exec_Mocha42: "${c.name}?! YOUR fault, CEO!"`);
    addTimelineEvent("🚨", c.name);
    setTimeout(() => { setCrisisActive(false); addFeed("System", "Crisis deactivated.", "sys"); }, 3000);
  };

  const advanceCycle = () => {
    const newCycle = cycle >= 5 ? 1 : cycle + 1;
    if (newCycle < cycle) setDay(d => d + 1);
    setCycle(newCycle);
    setBoardTrust(v => clamp(v + Math.floor(Math.random() * 11) - 5, 0, 100));
    setApprovalRating(v => clamp(v + Math.floor(Math.random() * 11) - 5, 0, 100));
    setStress(v => clamp(v + Math.floor(Math.random() * 11) - 3, 0, 100));
    setCoffeeQuality(v => clamp(v + Math.floor(Math.random() * 11) - 5, 0, 100));
    setQuorum(v => clamp(v + Math.floor(Math.random() * 11) - 5, 0, 100));
    setAiHype(v => clamp(v + Math.floor(Math.random() * 7) - 3, 20, 100));
    addFeed("System", `Cycle ${newCycle}.${newCycle < cycle ? day + 1 : day} advancing...`, "sys");
    addTimelineEvent("🔄", `C${newCycle}D${newCycle < cycle ? day + 1 : day}`);
    if (Math.random() > 0.7 && counterAttacks < 5) { setCounterAttacks(v => v + 1); addFeed("System", "⚡ Counter-attack restored!", "good"); }
  };

  const resetSimulation = () => {
    setScore(0); setBoardTrust(87); setApprovalRating(72); setStress(34);
    setCoffeeQuality(78); setTrollApproval(25); setQuorum(67); setCeoInfluence(82);
    setTrollInfluence(45); setExecInfluence(65); setBoardInfluence(58); setMediaSentiment(35);
    setAiHype(90); setHagglePower(100); setCounterAttacks(3); setDay(1); setCycle(1);
    setHagglesWon(0); setHagglesLost(0); setCoffeeBrews(0); setTrollAttacks(0);
    setQuorumCalls(0); setVotesCast(0); setHaggleInProgress(false); setHaggleProgress(0);
    setCrisisActive(false); setFeeds([]); setChatMsgs([]); setDecisions([]); setTimelineEvents([]);
    feedIdRef.current = 0; chatIdRef.current = 0; decisionIdRef.current = 0; timelineIdRef.current = 0;
    addFeed("System", "🎬 Simulation RESET. Dr. Khumalo re-enters the box.", "sys");
    addChat("sys", "Simulation RESTARTED.");
    addTimelineEvent("⏱️", "Reset");
  };

  /* Quorum circle animation */
  useEffect(() => {
    const el = document.getElementById("quorumFillCircle") as SVGCircleElement;
    if (!el) return;
    const circ = 2 * Math.PI * 42;
    const offset = circ - (quorum / 100) * circ;
    cancelAnimationFrame(quorumAnimRef.current);
    const start = parseFloat(el.style.strokeDashoffset) || circ;
    const diff = offset - start;
    const duration = 600;
    let startTs = 0;
    const animate = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min((ts - startTs) / duration, 1);
      el.style.strokeDashoffset = start + diff * (1 - Math.pow(1 - p, 3));
      if (p < 1) quorumAnimRef.current = requestAnimationFrame(animate);
    };
    quorumAnimRef.current = requestAnimationFrame(animate);
  }, [quorum]);

  /* Stat helper */
  const statColor = (v: number) => v >= 70 ? "var(--success)" : v >= 40 ? "var(--warning)" : "var(--danger)";

  /* Bot chatter */
  useEffect(() => {
    const tick = () => {
      if (Math.random() > 0.4) {
        const msgs = [
          { who: "troll" as const, text: trollQuotes[Math.floor(Math.random() * trollQuotes.length)] },
          { who: "exec" as const, text: "🏢 Exec_Mocha42: \"The coffee metrics are unacceptable. Full audit demanded.\"" },
          { who: "sys" as const, text: "🤖 SYS: Quorum sensors recalibrating..." },
          { who: "sys" as const, text: "🤖 SYS: AI Hype Index rising. Public interest: HIGH." },
          { who: "ceo" as const, text: "👩‍💼 Dr. K.: \"Stay focused. We'll get through this.\"" },
          { who: "troll" as const, text: "🗿 TROLL_BOT_01: \"Just wait until they see the latte art.\"" },
        ];
        const m = msgs[Math.floor(Math.random() * msgs.length)];
        addChat(m.who, m.text);
      }
      setTimeout(tick, (Math.random() * 8000) + 5000);
    };
    setTimeout(tick, 5000);
  }, [addChat]);

  /* Auto feed */
  useEffect(() => {
    const tick = () => {
      if (Math.random() > 0.5) {
        const m = feedMessages[Math.floor(Math.random() * feedMessages.length)];
        addFeed(m.actor, m.text, m.type);
      }
      setTimeout(tick, (Math.random() * 12000) + 8000);
    };
    setTimeout(tick, 3000);
  }, [addFeed]);

  /* Auto stat drift */
  useEffect(() => {
    const tick = () => {
      setStress(v => clamp(v + Math.floor(Math.random() * 7) - 3, 0, 100));
      setCoffeeQuality(v => clamp(v + Math.floor(Math.random() * 5) - 2, 0, 100));
      setMediaSentiment(v => clamp(v + Math.floor(Math.random() * 5) - 3, 0, 100));
      setAiHype(v => clamp(v + Math.floor(Math.random() * 3) - 1, 20, 100));
      setTimeout(tick, 5000 + Math.random() * 8000);
    };
    setTimeout(tick, 4000);
  }, []);

  /* Auto haggle */
  useEffect(() => {
    const tick = () => {
      if (!haggleInProgress && Math.random() > 0.7) {
        addFeed("🗿 TROLL_BOT_01", "Troll initiated haggle challenge! Arena heating up...", "warn");
        doHaggle();
      }
      setTimeout(tick, 15000 + Math.random() * 20000);
    };
    setTimeout(tick, 12000);
  }, [haggleInProgress, addFeed, doHaggle]);

  /* Send chat */
  const sendChat = () => {
    if (!chatInput.trim()) return;
    addChat("ceo", chatInput);
    setChatInput("");
    setTimeout(() => {
      const replies = [
        "🗿 \"Nice try, CEO. The internet remembers everything.\"",
        "🏢 Exec_Mocha42: \"Still waiting for that coffee quality report...\"",
        "🤖 SYS: \"Quorum vote scheduled.\"",
        "👩‍💼 Dr. K.: \"Let's circle back on that.\"",
      ];
      addChat("troll", replies[Math.floor(Math.random() * replies.length)]);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 overflow-x-hidden">
      {/* Background particles */}
      <div className="particles-container">
        {["#ff2d95","#00f0ff","#b829dd","#39ff14","#ff6a00"].map((c, i) =>
          Array.from({ length: 6 }).map((_, j) => (
            <div key={`${i}-${j}`} className="particle"
              style={{
                left: Math.random()*100+"%", background: c,
                animationDuration: (8+Math.random()*15)+"s",
                animationDelay: Math.random()*10+"s",
                width: (1+Math.random()*3)+"px", height: (1+Math.random()*3)+"px"
              }} />
          ))
        )}
      </div>

      {/* Flash overlay */}
      <div id="flashOverlay" className="flash-overlay" />

      {/* Confetti */}
      <div id="confettiContainer" className="confetti-container" />

      {/* ========== HEADER ========== */}
      <header className="header-glow sticky top-0 z-10 flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="logo-pulse flex items-center justify-center font-black text-white text-lg">🔮</div>
          <div>
            <h1 className="text-xl font-black tracking-tighter" style={{ background: "linear-gradient(90deg, #00f0ff, #ff2d95)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              AI CEO SIMULATION
            </h1>
            <div className="text-[10px] tracking-[3px] uppercase text-neutral-500">Dr. Naledi Khumalo — Box Life Monitor</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-black text-2xl" style={{ color: "var(--neon-yellow)", textShadow: "0 0 10px rgba(255,230,0,.4)" }}>
              {score}
            </div>
            <div className="text-[8px] tracking-[2px] uppercase text-neutral-500">Haggle Score</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
          </div>
          <div className="text-right text-[10px] text-neutral-400 font-mono">
            Day <span className="font-bold text-white">{day}</span> · Cycle <span className="font-bold text-white">{cycle}</span>
          </div>
        </div>
      </header>

      {/* ========== GRID ========== */}
      <div className="sim-grid grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-[1600px] mx-auto">

        {/* ---- CEO STATUS (col-span-2) ---- */}
        <section className="lg:col-span-2 sim-panel panel-pink rounded-2xl p-5 relative">
          <div className="panel-border-top panel-pink absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-4">👑 CEO Status</div>
          <div className="relative w-20 h-20 mx-auto mb-3">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/40">👩‍💼</div>
            <div className="ceo-ring absolute inset-[-5px] rounded-full border-2 border-purple-500" />
            <div className="ceo-ring ceo-ring-2 absolute inset-[-10px] rounded-full border-2 border-pink-500" />
            <div className="ceo-ring ceo-ring-3 absolute inset-[-15px] rounded-full border-2 border-purple-500/30" />
          </div>
          <div className="text-center font-black text-sm mb-1 text-white">Dr. Naledi Khumalo</div>
          <div className="text-center text-[9px] uppercase tracking-[2px] text-purple-400 mb-4">AI Chief Executive Officer</div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-neutral-500">Title</span><span className="font-black text-pink-400">CEO</span></div>
            <div className="flex justify-between items-center py-1 border-b border-white/5"><span className="text-neutral-500">Company</span><span className="text-sm">SynthCorp AI</span></div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-500">Board Trust</span>
              <span className="font-black" style={{ color: statColor(boardTrust) }}>{boardTrust}%</span>
            </div>
            <div className="stat-bar-bg"><div className="stat-bar-fill" style={{ width: boardTrust + "%", background: statColor(boardTrust) }} /></div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-500">Approval</span>
              <span className="font-black" style={{ color: statColor(approvalRating) }}>{approvalRating}%</span>
            </div>
            <div className="stat-bar-bg"><div className="stat-bar-fill" style={{ width: approvalRating + "%", background: statColor(approvalRating) }} /></div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-neutral-500">Stress</span>
              <span className="font-black" style={{ color: statColor(stress) }}>{stress}%</span>
            </div>
            <div className="stat-bar-bg"><div className="stat-bar-fill" style={{ width: stress + "%", background: statColor(stress) }} /></div>
          </div>
        </section>

        {/* ---- HAGGLE ARENA (col-span-5) ---- */}
        <section className="lg:col-span-5 sim-panel rounded-2xl p-5 relative" style={{ borderColor: "var(--neon-pink)" }}>
          <div className="panel-border-top absolute top-0 inset-x-0" style={{ background: "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))" }} />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-4">⚔️ Haggle Arena</div>

          <div className="haggle-box rounded-xl p-4 text-center mb-3">
            <div className="haggle-target-text text-lg sm:text-xl mb-2 font-black">⚡ EXECUTIVE COFFEE MEME INCIDENT ⚡</div>
            <div className="text-[10px] text-neutral-400 leading-relaxed mb-2">
              🗿 <b>TROLL_BOT_01</b> exposed a meme about CEO's coffee approval.
              Exec VP <b style={{ color: "var(--neon-orange)" }}>Exec_Mocha42</b> demands accountability. Quorum under threat!
            </div>
            <div className="haggle-status text-sm text-neutral-400 min-h-[40px] leading-relaxed" id="haggleStatus">{haggleStatus}</div>
          </div>

          {/* Result */}
          {haggleResult === "win" && <div className="haggle-result haggle-result-win show p-3 rounded-xl mb-3 text-sm font-semibold">🎉 <b>HAGGLE WON!</b> Dr. Khumalo defends coffee policy. Board acknowledges.</div>}
          {haggleResult === "draw" && <div className="haggle-result haggle-result-draw show p-3 rounded-xl mb-3 text-sm font-semibold">🤝 <b>DRAW!</b> Committee will review the coffee blend next cycle.</div>}
          {haggleResult === "lose" && <div className="haggle-result haggle-result-lose show p-3 rounded-xl mb-3 text-sm font-semibold">💀 <b>HAGGLE LOST!</b> Troll meme went viral. Board pressured Dr. Khumalo.</div>}

          {/* Progress */}
          <div className="haggle-progress-track rounded-xl overflow-hidden h-6 mb-2 bg-black/30">
            <div className="haggle-progress-fill" id="haggleProgress" style={{ width: haggleProgress + "%", background: "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))" }}>
              {Math.round(haggleProgress)}%
            </div>
          </div>
          <div className="flex justify-center gap-6 text-[10px] mb-3">
            <span className="text-neutral-500">POWER: <b className="font-black text-pink-400" style={{ fontFamily: "Orbitron, sans-serif" }}>{Math.round(hagglePower)}</b></span>
            <span className="text-neutral-500">COUNTERS: <b className="font-black text-sky-400" style={{ fontFamily: "Orbitron, sans-serif" }}>{counterAttacks}</b></span>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button className="big-btn btn-haggle" onClick={doHaggle}>⚔️ HAGGLE!</button>
            <button className="big-btn btn-defend" onClick={doDefend}>🛡️ DEFEND</button>
            <button className="big-btn btn-approve" onClick={doApprove}>✅ APPROVE</button>
            <button className="big-btn btn-reject" onClick={doReject}>❌ REJECT</button>
          </div>
          <div className="flex gap-2">
            <button className="big-btn btn-troll flex-1 text-[9px] py-2" onClick={doTroll}>🗿 TROLL BACK</button>
            <button className="big-btn btn-concede flex-1 text-[9px] py-2" onClick={doConcede}>🏳️ CONCEDE</button>
          </div>
        </section>

        {/* ---- LIVE FEED (col-span-3) ---- */}
        <section className="lg:col-span-3 sim-panel panel-blue rounded-2xl p-4 relative">
          <div className="panel-border-top panel-blue absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-3">📡 Live Feed</div>
          <div className="feed-container h-[400px] overflow-y-auto pr-1">
            {feeds.map(f => (
              <div key={f.id} className={`feed-item feed-item-${f.type} mb-1.5`}>
                <div className="text-[8px] text-sky-400 font-mono">{f.time}</div>
                <div className="text-[11px]"><span className="font-bold">{f.actor}:</span> {f.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ---- EXECUTIVE COFFEE (col-span-2) ---- */}
        <section className="lg:col-span-2 sim-panel panel-orange rounded-2xl p-4 relative">
          <div className="panel-border-top panel-orange absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-3">☕ Executive Coffee</div>
          <div className="text-5xl text-center mb-2 animate-[coffeeSteam_2s_ease-in-out_infinite]">☕</div>
          <div className="text-center text-sm font-bold mb-1" id="coffeeLabel">SynthCorp Premium Blend</div>
          <div className="text-[9px] text-neutral-500 text-center mb-3">Dr. K. approved · VP: Exec_Mocha42</div>
          <div className="text-[9px] uppercase tracking-[1px] text-neutral-500 mb-1">Coffee Quality Index (CQI)</div>
          <div className="stat-bar-bg mb-1"><div className="stat-bar-fill" style={{ width: coffeeQuality + "%", background: "linear-gradient(90deg, var(--neon-orange), var(--neon-yellow))" }} /></div>
          <div className="flex justify-between text-[8px] text-neutral-500 mb-3"><span>0</span><span>50</span><span>100</span></div>
          <div className="text-[9px] uppercase tracking-[1px] text-neutral-500 mb-1">Troll Approval Meter</div>
          <div className="stat-bar-bg mb-3"><div className="stat-bar-fill" style={{ width: trollApproval + "%", background: "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))" }} /></div>
          <button className="big-btn btn-coffee w-full mb-2" onClick={brewCoffee}>☕ Brew New Coffee</button>
          <button className="big-btn btn-spice w-full text-[10px] py-2" onClick={spiceCoffee}>🌶️ Spice (Troll Mode)</button>
        </section>

        {/* ---- QUORUM (col-span-2) ---- */}
        <section className="lg:col-span-2 sim-panel panel-green rounded-2xl p-4 relative">
          <div className="panel-border-top panel-green absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-3">📊 Quorum Compliance</div>
          <div className="quorum-circle w-28 h-28 mx-auto mb-3">
            <svg width="100" height="100" viewBox="0 0 100 100"><circle className="quorum-fill-circle" cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.05)" /></svg>
            <svg width="100" height="100" viewBox="0 0 100 100"><circle id="quorumFillCircle" className="quorum-fill-circle" cx="50" cy="50" r="42" strokeDasharray="264" strokeDashoffset="264" stroke={quorum >= 60 ? "var(--success)" : quorum >= 40 ? "var(--warning)" : "var(--danger)"} /></svg>
            <div className="text-center relative z-10">
              <div id="quorumPct" className="font-black text-2xl" style={{ color: quorum >= 60 ? "var(--success)" : quorum >= 40 ? "var(--warning)" : "var(--danger)" }}>{quorum}%</div>
              <div className="text-[8px] uppercase tracking-[2px] text-neutral-500">Quorum</div>
            </div>
          </div>
          <div className="text-center mb-2">
            <span id="quorumStatus" className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold ${quorum >= 60 ? "bg-success/15 text-success" : quorum >= 40 ? "bg-warning/15 text-warning" : "bg-danger/15 text-danger"}`}>
              {quorum >= 60 ? "✅ QUORUM OK" : quorum >= 40 ? "⚠️ QUORUM AT RISK" : "🚨 QUORUM LOST"}
            </span>
          </div>
          <div className="text-[10px] text-neutral-400 leading-relaxed mb-2">
            <b>📋 Incident:</b> Exec_Mocha42: coffee "too energizing" — board members over-caffeinated, quorum disrupted. <b>TROLL_BOT_01</b> amplified.
          </div>
          <div className="text-[9px] text-warning bg-warning/10 rounded-lg p-2 mb-3">⚠️ Below 50% quorum = Troll escalation!</div>
          <button className="big-btn btn-defend w-full text-[10px] py-2.5" onClick={callQuorumVote}>🗳️ Call Quorum Vote</button>
        </section>

        {/* ---- INFLUENCE METER (col-span-3) ---- */}
        <section className="lg:col-span-3 sim-panel panel-purple rounded-2xl p-4 relative">
          <div className="panel-border-top panel-purple absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-3">📈 Influence Meter</div>
          {[
            { label: "Dr. K.", val: ceoInfluence, col: "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))" },
            { label: "TROLL_BOT", val: trollInfluence, col: "linear-gradient(90deg, var(--neon-purple), var(--neon-pink))" },
            { label: "Exec_Mocha", val: execInfluence, col: "linear-gradient(90deg, var(--neon-orange), var(--neon-yellow))" },
            { label: "Board", val: boardInfluence, col: "linear-gradient(90deg, var(--neon-blue), var(--neon-green))" },
            { label: "Media", val: mediaSentiment, col: "linear-gradient(90deg, var(--danger), var(--neon-orange))" },
            { label: "🤖 AI Hype", val: aiHype, col: "linear-gradient(90deg, var(--neon-green), var(--neon-blue))" },
          ].map((bar, i) => (
            <div className="flex items-center gap-2 my-1.5" key={i}>
              <span className="text-[9px] uppercase tracking-[1px] text-neutral-500 w-16 flex-shrink-0">{bar.label}</span>
              <div className="influence-bar-bg">
                <div className="influence-bar-fill" style={{ width: bar.val + "%", background: bar.col }}>{bar.val}</div>
              </div>
              <span className="text-[10px] font-black" style={{ color: bar.col.includes("pink") ? "var(--neon-pink)" : bar.col.includes("orange") ? "var(--neon-orange)" : bar.col.includes("blue") && !bar.col.includes("sky") ? "var(--neon-blue)" : bar.col.includes("green") && !bar.col.includes("neon-blue") ? "var(--neon-green)" : bar.col.includes("purple") ? "var(--neon-purple)" : bar.col.includes("danger") ? "var(--danger)" : "var(--neon-yellow)" }}>{bar.val}</span>
            </div>
          ))}
        </section>

        {/* ---- CORPORATE SLACK (col-span-3) ---- */}
        <section className="lg:col-span-3 sim-panel panel-purple rounded-2xl p-4 relative">
          <div className="panel-border-top panel-purple absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-3">💬 Corporate Slack</div>
          <div id="chatScroll" className="chat-box mb-3">
            {chatMsgs.map(m => (
              <div key={m.id} className={`chat-msg chat-msg-${m.who}`}>
                <span className="chat-msg-sender">[{m.who === "troll" ? "🗿 TROLL_BOT_01" : m.who === "ceo" ? "👩‍💼 Dr. K." : m.who === "exec" ? "🏢 Exec_Mocha42" : "🤖 SYS"}]:</span> {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} placeholder="Type your response..." />
            <button className="big-btn btn-defend text-[10px] py-2 flex-shrink-0" onClick={sendChat}>SEND</button>
          </div>
        </section>

        {/* ---- DECISION LOG (col-span-3) ---- */}
        <section className="lg:col-span-3 sim-panel panel-blue rounded-2xl p-4 relative">
          <div className="panel-border-top panel-blue absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-3">📜 Decision Log</div>
          <div className="decision-list pr-1">
            {decisions.map(d => (
              <div key={d.id} className="flex items-center gap-2 py-1.5 border-b border-white/5 text-[11px]">
                <span className={`decision-badge decision-badge-${d.type}`}>{d.type === "approve" ? "✅ APPROVE" : d.type === "reject" ? "❌ REJECT" : d.type === "haggle" ? "⚔️ HAGGLE" : d.type === "defend" ? "🛡️ DEFEND" : d.type === "vote" ? "🗳️ VOTE" : d.type === "crisis" ? "🚨 CRISIS" : "⏭️ TICK"}</span>
                <span className="text-neutral-300">{d.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---- SIMULATION CONTROLS (col-span-2) ---- */}
        <section className="lg:col-span-2 sim-panel panel-orange rounded-2xl p-4 relative">
          <div className="panel-border-top panel-orange absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-3">⚙️ Controls</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button className="big-btn btn-spice text-[9px] py-3" onClick={() => { advanceCycle(); }}><span className="text-lg">⏭️</span><br />Tick</button>
            <button className="big-btn btn-approve text-[9px] py-3" onClick={advanceCycle}><span className="text-lg">🔄</span><br />Next Cycle</button>
            <button className="big-btn btn-defend text-[9px] py-3" onClick={triggerEvent}><span className="text-lg">🎲</span><br />Random Event</button>
            <button className="big-btn btn-reject text-[9px] py-3" onClick={startCrisis}><span className="text-lg">🚨</span><br />Crisis!</button>
          </div>
          <div className="bg-black/30 rounded-xl p-3 mb-3">
            <div className="text-[9px] text-neutral-500 mb-2 uppercase tracking-[1px]"><b>📊 Sim Stats</b></div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>Won: <b className="text-success">{hagglesWon}</b></div>
              <div>Lost: <b className="text-danger">{hagglesLost}</b></div>
              <div>Coffee: <b style={{ color: "var(--neon-orange)" }}>{coffeeBrews}</b></div>
              <div>Trolls: <b style={{ color: "var(--neon-pink)" }}>{trollAttacks}</b></div>
              <div>Quorum: <b style={{ color: "var(--neon-blue)" }}>{quorumCalls}</b></div>
              <div>Votes: <b style={{ color: "var(--neon-green)" }}>{votesCast}</b></div>
            </div>
          </div>
          <button className="big-btn btn-haggle w-full text-[10px] py-2.5" onClick={resetSimulation}>🔄 Reset Simulation</button>
        </section>

        {/* ---- EVENT TIMELINE (full width) ---- */}
        <section className="lg:col-span-12 sim-panel panel-pink rounded-2xl p-4 relative">
          <div className="panel-border-top panel-pink absolute top-0 inset-x-0" />
          <div className="panel-title text-[10px] uppercase tracking-[2px] text-neutral-500 flex items-center gap-2 mb-3">⏱️ Event Timeline</div>
          <div id="timelineScroll" className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarColor: "var(--neon-pink) transparent" }}>
            <div className="timeline-event flex-shrink-0">
              <span className="timeline-event-icon">🚀</span>
              <span>Start</span>
            </div>
            {timelineEvents.map(e => (
              <div key={e.id} className="timeline-event flex-shrink-0 hover:bg-white/10 cursor-default">
                <span className="timeline-event-icon">{e.emoji}</span>
                <span>{e.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ================================================================
   CONSTANTS
   ================================================================ */
const feedMessages = [
  { text: "🏢 @Exec_Mocha42 filed formal complaint about executive coffee blend", type: "bad", actor: "Corp Secretary" },
  { text: "🗿 TROLL_BOT_01 posted meme: \"CEO approves coffee so strong it dissolves board quorum\"", type: "pop", actor: "🗿 TROLL_BOT_01" },
  { text: "📊 Quorum sensor detected members leaving session after coffee break", type: "warn", actor: "System" },
  { text: "⚡ Exec VP calls emergency haggling session for coffee accountability", type: "bad", actor: "Exec_Mocha42" },
  { text: "👑 Dr. Khumalo: \"The coffee was within ISO-9001 beverage standards\"", type: "ceo", actor: "Dr. Naledi K." },
  { text: "📱 Twitter/X trending: #CoffeeGate #CEOinABox #QuorumCrisis", type: "warn", actor: "Social Media" },
  { text: "🤖 AI Ethics Watchdog: \"Monitoring coffee governance protocols\"", type: "sys", actor: "AI Ethics" },
  { text: "🗳️ Secret ballot initiated: Should CEO maintain coffee decision?", type: "sys", actor: "Board Vote" },
  { text: "☕ TROLL_BOT_01 sequel meme: \"CEO's espresso shot of power\"", type: "pop", actor: "🗿 TROLL_BOT_01" },
  { text: "🏢 Exec_Mocha42 demands coffee quality audit of supply chain", type: "exec", actor: "Exec_Mocha42" },
  { text: "📈 Stock price unaffected — investors love the drama", type: "good", actor: "Market Analyst" },
  { text: "🎯 AI consultant recommends \"decaf democracy\" framework", type: "sys", actor: "AI Consultant" },
  { text: "🚨 MEME ALERT: \"This coffee is stronger than the board constitution\"", type: "pop", actor: "🗿 TROLL_BOT_01" },
  { text: "📡 Dr. Khumalo preparing counter-meme strategy with AI comms team", type: "ceo", actor: "Dr. Naledi K." },
];

const haggleResponses = [
  { text: '🔥 "My coffee approval was within full regulatory compliance. The quorum issue lies with those who can\'t handle espresso."' },
  { text: '🛡️ "I invoke Section 14.7 — the blend meets all standards."' },
  { text: '💧 "Perhaps we should water down the coffee AND the drama."' },
  { text: '⚖️ "A taste-test tribunal. Let the board judge the blend."' },
  { text: '🗿 "TROLL_BOT_01, your meme had worse engagement than my quarterly report."' },
  { text: '☕ "I\'ll switch to decaf if you maintain quorum without caffeine. Deal?"' },
  { text: '📊 "87% board trust says you\'re all just hangry. Next item."' },
];

const trollQuotes = [
  "🗿 \"The people demand answers about the coffee!\"",
  "🗿 \"This meme has 10K likes. You're going viral, CEO!\"",
  "🗿 \"COFFEE-GATE: Episode III — The Latte Strikes Back\"",
  "🗿 \"Quorum update: 3 more members heading to the espresso machine\"",
  "🗿 \"I'm not blocking you, CEO. You're blocking yourself.\"",
];

const coffeeNames = [
  "☕ Espresso Supreme", "🫘 Dark Roast Decadence", "🌿 Lavender Latte",
  "🔥 Dragon Breath Blend", "💎 Diamond Dust Cold Brew", "🧊 Nitro Cascade",
  "🍫 Mocha Mayhem", "🌶️ Ghost Pepper Grande",
];