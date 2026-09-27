import React, { useState, useEffect } from 'react';
import { GraphicNovelPanel } from '../types';
import { soundFx } from '../services/soundFx';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Atom, 
  Flame, 
  Activity, 
  Sparkles, 
  Zap, 
  Layers, 
  BookOpen,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ParallaxGraphicNovelProps {
  onSelectChallenge: (challenge: '3d-lattice' | 'ballistic-run' | 'furnace-puzzle' | 'extractor' | 'furnace-timeline') => void;
}

export const GRAPHIC_NOVEL_PANELS: GraphicNovelPanel[] = [
  {
    id: 'panel-1',
    chapter: 1,
    chapterTitle: 'The Synthesis Bottleneck',
    panelNumber: 1,
    badge: 'STAGE 01 // CVD INCEPTION',
    headline: 'Awakening in the Atomic Conduit',
    narration:
      'Inside the quartz tube furnace, vaporized methane decomposes over iron nanoparticles at 950°C. Hexagonal carbon bonds stitch together at blazing speed, rolling into a seamless single-walled carbon nanotube.',
    dialogue: {
      speaker: 'Spin the Electron',
      avatar: 'e⁻',
      text: 'Lattice parameters locked! Hexagonal honeycomb clear. Time to accelerate to Fermi speed!',
      type: 'speech',
    },
    sfx: 'WHUUUUUUM',
    scientificContext: {
      phenomenon: 'Chemical Vapor Deposition (CVD)',
      equation: 'CH₄(g) ➔ C(lattice) + 2H₂(g)',
      metric: 'Lattice Parameter a₀',
      metricValue: '2.46 Å',
    },
    visualTheme: 'pristine',
    interactiveActionLabel: 'Inspect 3D Lattice Highway',
    actionTarget: '3d-lattice',
  },
  {
    id: 'panel-2',
    chapter: 1,
    chapterTitle: 'The Synthesis Bottleneck',
    panelNumber: 2,
    badge: 'STAGE 02 // FERMI VELOCITY',
    headline: 'Relativistic Velocity Run',
    narration:
      'Electrons in low-dimensional carbon lattices behave like massless Dirac fermions. Spin streaks down the hollow cylinder without losing energy to phonon heat—a state of pure ballistic quantum transport.',
    dialogue: {
      speaker: 'System AI',
      avatar: 'HUD',
      text: 'Conductance locked at fundamental quantum limit: G = 2e²/h. Mean free path exceeding 1 micron!',
      type: 'hud',
    },
    sfx: 'ZZZZZZZZT!',
    scientificContext: {
      phenomenon: 'Ballistic Conductance',
      equation: 'G₀ = 2e² / h ≈ 77.48 µS',
      metric: 'Fermi Velocity (v_F)',
      metricValue: '1.0 × 10⁶ m/s',
    },
    visualTheme: 'pristine',
    interactiveActionLabel: 'Launch Ballistic Simulator',
    actionTarget: 'ballistic-run',
  },
  {
    id: 'panel-3',
    chapter: 1,
    chapterTitle: 'The Synthesis Bottleneck',
    panelNumber: 3,
    badge: 'STAGE 03 // VACANCY ALERT',
    headline: 'The Crimson Fracture',
    narration:
      'During thermal ramp-up, a slight 0.8°C thermal gradient provoked missing carbon atoms. A jagged vacancy cluster and Stone-Wales 7-5 bond dislocation loom directly in the conduit path.',
    dialogue: {
      speaker: 'Spin the Electron',
      avatar: 'e⁻',
      text: 'Whoa! This atomic lane is blocked by a massive structural flaw!',
      type: 'speech',
    },
    sfx: 'KRAAA-KSH!',
    scientificContext: {
      phenomenon: 'Lattice Defect Formation',
      equation: 'ρ_def = ρ₀ · exp(-E_form / k_B·T)',
      metric: 'Defect Density',
      metricValue: '4.8 × 10¹² cm⁻²',
    },
    visualTheme: 'hazard',
    interactiveActionLabel: 'View Defect in 3D',
    actionTarget: '3d-lattice',
  },
  {
    id: 'panel-4',
    chapter: 1,
    chapterTitle: 'The Synthesis Bottleneck',
    panelNumber: 4,
    badge: 'STAGE 04 // QUANTUM COLLISION',
    headline: 'Catastrophic Scattering',
    narration:
      'Impact! The pristine wave packet collides against the broken covalent bonds. Elastic backscattering scatters the electron into localized bound states, extinguishing the ballistic quantum current.',
    dialogue: {
      speaker: 'Dr. Aris (Materials Lead)',
      avatar: '🔬',
      text: 'Current dropped to zero! Anderson localization has trapped our electron! We need to recalibrate the furnace!',
      type: 'speech',
    },
    sfx: 'SCATTERRRR!',
    scientificContext: {
      phenomenon: 'Anderson Localization & Decoherence',
      equation: 'T(E) ➔ 0 as L ≫ ξ_loc',
      metric: 'Mobility Degradation',
      metricValue: '-94.2%',
    },
    visualTheme: 'hazard',
    interactiveActionLabel: 'Repair via Furnace Recalibration',
    actionTarget: 'furnace-puzzle',
  },
  {
    id: 'panel-5',
    chapter: 2,
    chapterTitle: 'Atomic Healing & Coherence',
    panelNumber: 5,
    badge: 'STAGE 05 // THERMAL ANNEALING',
    headline: 'Igniting the Annealing Crucible',
    narration:
      'The engineering team adjusts furnace gas partial pressures and introduces atomic hydrogen flux to etch away amorphous clusters, supplying activation energy to re-hybridize carbon atoms into perfect sp² hexagons.',
    dialogue: {
      speaker: 'Dr. Aris (Materials Lead)',
      avatar: '🔬',
      text: 'Ramping to 1020°C with hydrogen carrier flux. Watch the vacancy boundaries migrate and self-heal!',
      type: 'speech',
    },
    sfx: 'SSSSSHHH-GLOW',
    scientificContext: {
      phenomenon: 'Defect Migration & Re-hybridization',
      equation: 'D = D₀ · exp(-E_migration / k_B·T)',
      metric: 'Raman I_D / I_G Ratio',
      metricValue: '0.04 (Pristine)',
    },
    visualTheme: 'furnace',
    interactiveActionLabel: 'Solve CVD Furnace Puzzle',
    actionTarget: 'furnace-puzzle',
  },
  {
    id: 'panel-6',
    chapter: 2,
    chapterTitle: 'Atomic Healing & Coherence',
    panelNumber: 6,
    badge: 'STAGE 06 // QUANTUM TRIUMPH',
    headline: 'The Coherent Superhighway',
    narration:
      'Flawless synthesis achieved. With all structural vacancies healed, the quantum phase coherence is restored across the entire device channel. Spin bursts through at the speed of light.',
    dialogue: {
      speaker: 'Spin the Electron',
      avatar: 'e⁻',
      text: 'Unobstructed ballistic highway! Zero resistance, pure quantum coherence forever!',
      type: 'speech',
    },
    sfx: 'COHERENCE-CHIME!',
    scientificContext: {
      phenomenon: 'Unbounded Ballistic Transmission',
      equation: 'T(E) = 1.0 (Unitary Transmission)',
      metric: 'Mean Free Path',
      metricValue: '> 10.0 µm',
    },
    visualTheme: 'quantum-triumph',
    interactiveActionLabel: 'Extract Research JSON',
    actionTarget: 'extractor',
  },
];

export const ParallaxGraphicNovel: React.FC<ParallaxGraphicNovelProps> = ({ onSelectChallenge }) => {
  const [activePanelIdx, setActivePanelIdx] = useState<number>(2); // Start on the featured prompt panel (Panel 3: The Crimson Fracture)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(!soundFx.isMuted);

  const currentPanel = GRAPHIC_NOVEL_PANELS[activePanelIdx];

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActivePanelIdx((prev) => {
        const next = (prev + 1) % GRAPHIC_NOVEL_PANELS.length;
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleNext = () => {
    const nextIdx = (activePanelIdx + 1) % GRAPHIC_NOVEL_PANELS.length;
    setActivePanelIdx(nextIdx);
    soundFx.playWhoosh();
  };

  const handlePrev = () => {
    const prevIdx = (activePanelIdx - 1 + GRAPHIC_NOVEL_PANELS.length) % GRAPHIC_NOVEL_PANELS.length;
    setActivePanelIdx(prevIdx);
    soundFx.playWhoosh();
  };

  const handleSelectPanel = (idx: number) => {
    setActivePanelIdx(idx);
    soundFx.playBlip(700);
  };

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setSoundEnabled(!muted);
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-4 md:p-8 relative">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Chapter {currentPanel.chapter}: {currentPanel.chapterTitle}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-cyan-400">Panel {currentPanel.panelNumber} of {GRAPHIC_NOVEL_PANELS.length}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {currentPanel.headline}
            </h2>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          {/* Furnace Ramp Rate Timeline Quick Launch */}
          <button
            onClick={() => onSelectChallenge('furnace-timeline')}
            className="px-3 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Inspect Furnace Ramp Rate Timeline"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ramp Timeline</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'bg-slate-900 border-cyan-500/40 text-cyan-400 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Autoplay Toggle */}
          <button
            onClick={() => {
              setIsAutoPlaying(!isAutoPlaying);
              soundFx.playBlip(800);
            }}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isAutoPlaying
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isAutoPlaying ? 'Pause Auto' : 'Auto Scroll'}
          </button>

          {/* Prev / Next navigation */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs px-2 text-slate-400 tabular-nums">
              {activePanelIdx + 1}/{GRAPHIC_NOVEL_PANELS.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next Panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Comic Spread Layout */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Visual Comic Art Canvas with Parallax & Comic FX (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className={`relative min-h-[380px] md:min-h-[440px] rounded-2xl overflow-hidden border-2 flex flex-col justify-between p-6 transition-all duration-500 ${
            currentPanel.visualTheme === 'hazard'
              ? 'border-red-500/50 bg-gradient-to-br from-red-950/40 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(239,68,68,0.15)]'
              : currentPanel.visualTheme === 'furnace'
              ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(245,158,11,0.15)]'
              : currentPanel.visualTheme === 'quantum-triumph'
              ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/40 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
              : 'border-cyan-500/50 bg-gradient-to-br from-cyan-950/40 via-slate-950 to-slate-900 shadow-[0_0_40px_rgba(6,182,212,0.15)]'
          }`}>
            
            {/* Background Parallax Layer: Quantum Coordinate Matrix */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(34, 211, 238, 0.4) 2px, transparent 0)',
              backgroundSize: '40px 40px'
            }} />

            {/* Scientific Formulas Hologram Watermark in Artwork */}
            <div className="absolute top-4 right-6 font-mono text-[10px] text-cyan-400/30 select-none pointer-events-none text-right">
              <div>iħ ∂Ψ/∂t = ĤΨ</div>
              <div>E(k) = ± v_F · ħ|k|</div>
              <div>G = 2e²/h · Σ T_n</div>
            </div>

            {/* Comic Header Stamp */}
            <div className="relative z-10 flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold tracking-wider uppercase border ${
                currentPanel.visualTheme === 'hazard'
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : currentPanel.visualTheme === 'furnace'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : currentPanel.visualTheme === 'quantum-triumph'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              }`}>
                {currentPanel.badge}
              </span>

              {/* Dramatic Comic Sound FX Text */}
              {currentPanel.sfx && (
                <span className="font-comic text-2xl md:text-3xl text-amber-400 rotate-[-6deg] drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] tracking-wider">
                  {currentPanel.sfx}
                </span>
              )}
            </div>

            {/* Center Dynamic Visual: Schematic Crystal Lattice Highway */}
            <div className="relative z-10 my-8 py-6 flex flex-col items-center justify-center">
              {/* Conduit Tube Schematic */}
              <div className="w-full relative h-28 flex items-center justify-center">
                {/* Upper and lower boundary lines */}
                <div className="absolute top-2 inset-x-4 h-0.5 border-t border-dashed border-cyan-500/40" />
                <div className="absolute bottom-2 inset-x-4 h-0.5 border-b border-dashed border-cyan-500/40" />

                {/* Atomic Hexagonal Nodes Chain */}
                <div className="w-full flex items-center justify-between px-6 z-10">
                  {[0, 1, 2, 3, 4, 5, 6].map((nodeIdx) => {
                    const isDefectPos = nodeIdx === 4;
                    const isPassed = activePanelIdx > 2;

                    if (isDefectPos && currentPanel.visualTheme === 'hazard') {
                      return (
                        <div key={nodeIdx} className="relative group">
                          <div className="w-9 h-9 rounded-lg bg-red-600/30 border-2 border-dashed border-red-500 flex items-center justify-center animate-pulse shadow-[0_0_20px_#ef4444]">
                            <span className="text-red-400 font-mono text-xs font-bold">VAC</span>
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-red-400">
                            Vacancy Cluster
                          </span>
                        </div>
                      );
                    }

                    if (isDefectPos && currentPanel.visualTheme === 'furnace') {
                      return (
                        <div key={nodeIdx} className="relative group">
                          <div className="w-9 h-9 rounded-full bg-amber-500/30 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_20px_#f59e0b]">
                            <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
                          </div>
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-mono text-amber-300">
                            Annealing 1020°C
                          </span>
                        </div>
                      );
                    }

                    return (
                      <div key={nodeIdx} className="relative">
                        <div className="w-6 h-6 rounded-full bg-cyan-400/20 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_12px_#22d3ee]">
                          <span className="w-2 h-2 rounded-full bg-cyan-300" />
                        </div>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-400/60">
                          C(sp²)
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Animated Character Avatar: Spin the Electron */}
                <div
                  className={`absolute z-20 transition-all duration-700 ease-out flex items-center justify-center ${
                    activePanelIdx === 0
                      ? 'left-[10%] top-[40%]'
                      : activePanelIdx === 1
                      ? 'left-[38%] top-[38%]'
                      : activePanelIdx === 2
                      ? 'left-[55%] top-[32%]'
                      : activePanelIdx === 3
                      ? 'left-[59%] top-[12%] rotate-45' // Collided & scattered upward!
                      : activePanelIdx === 4
                      ? 'left-[60%] top-[42%]'
                      : 'left-[88%] top-[40%]' // Made it through!
                  }`}
                >
                  <div className={`relative flex items-center justify-center rounded-full font-bold text-xs shadow-lg transition-transform ${
                    currentPanel.visualTheme === 'hazard'
                      ? 'w-10 h-10 bg-red-500 text-white shadow-[0_0_25px_#ef4444] animate-bounce'
                      : currentPanel.visualTheme === 'quantum-triumph'
                      ? 'w-11 h-11 bg-emerald-400 text-slate-950 shadow-[0_0_30px_#10b981]'
                      : 'w-10 h-10 bg-cyan-400 text-slate-950 shadow-[0_0_25px_#22d3ee]'
                  }`}>
                    {/* Character Precession Ring */}
                    <div className="absolute inset-[-4px] rounded-full border border-cyan-200/80 animate-spin" />
                    e⁻
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Comic Dialogue Bubble */}
            {currentPanel.dialogue && (
              <div className={`relative z-10 p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all ${
                currentPanel.dialogue.speaker === 'System AI'
                  ? 'bg-slate-900/90 border-cyan-500/40 text-cyan-200 font-mono text-xs'
                  : currentPanel.visualTheme === 'hazard'
                  ? 'bg-red-950/90 border-red-500/50 text-red-100'
                  : 'bg-slate-900/90 border-cyan-500/40 text-slate-100'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[11px]">
                    {currentPanel.dialogue.avatar}
                  </span>
                  <span className="font-semibold text-xs tracking-wide text-cyan-400">
                    {currentPanel.dialogue.speaker}:
                  </span>
                </div>
                <p className="font-medium text-sm md:text-base leading-snug">
                  "{currentPanel.dialogue.text}"
                </p>
              </div>
            )}
          </div>

          {/* Interactive Challenge Launcher Button */}
          {currentPanel.interactiveActionLabel && currentPanel.actionTarget && (
            <button
              onClick={() => onSelectChallenge(currentPanel.actionTarget!)}
              className="mt-3 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>{currentPanel.interactiveActionLabel}</span>
              <span className="text-cyan-200 text-xs">➔</span>
            </button>
          )}
        </div>

        {/* Right Column: Narrative Breakdown & Materials Science Rigor (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Prose Narration Card */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl">
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Atom className="w-3.5 h-3.5" />
              Narrative Script & Engineering Context
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {currentPanel.narration}
            </p>
          </div>

          {/* Materials Science Quantitative Telemetry */}
          <div className="bg-slate-900/70 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Quantum Transport & Defect Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">Phenomenon</span>
                <span className="text-xs font-semibold text-white block">
                  {currentPanel.scientificContext.phenomenon}
                </span>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block mb-1">{currentPanel.scientificContext.metric}</span>
                <span className="text-xs font-mono font-bold text-cyan-300 block">
                  {currentPanel.scientificContext.metricValue}
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-cyan-900/30 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">Governing Invariant:</span>
              <span className="font-mono text-xs text-amber-300 font-semibold">
                {currentPanel.scientificContext.equation}
              </span>
            </div>
          </div>

          {/* Panel Strip Thumbnails Selector */}
          <div className="bg-slate-900/70 border border-slate-800 p-3 rounded-2xl">
            <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-between">
              <span>Chapter Timeline</span>
              <span>Select Panel</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {GRAPHIC_NOVEL_PANELS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPanel(idx)}
                  className={`h-12 rounded-lg border flex flex-col items-center justify-center p-1 transition-all ${
                    idx === activePanelIdx
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-2 ring-cyan-500/30'
                      : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold">P{idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full mt-1 bg-current" />
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
