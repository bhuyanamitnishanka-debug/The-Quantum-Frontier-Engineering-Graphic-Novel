/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { ParallaxGraphicNovel } from './components/ParallaxGraphicNovel';
import { FurnaceTimelineRamp } from './components/FurnaceTimelineRamp';
import { ThreeLatticeScene } from './components/ThreeLatticeScene';
import { PhysicsChallenges } from './components/PhysicsChallenges';
import { DataExtractorAgent } from './components/DataExtractorAgent';
import { soundFx } from './services/soundFx';
import { 
  Zap, 
  Atom, 
  Flame, 
  Layers, 
  ArrowDown, 
  Sparkles, 
  BookOpen, 
  ChevronRight,
  ShieldAlert,
  Activity
} from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('novel');
  const [activeChallengeTab, setActiveChallengeTab] = useState<'ballistic-run' | 'furnace-puzzle' | 'band-structure'>('ballistic-run');
  const [defectSeverity, setDefectSeverity] = useState<number>(85);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    soundFx.playBlip(650);
  };

  const handleNovelChallengeLaunch = (target: '3d-lattice' | 'ballistic-run' | 'furnace-puzzle' | 'extractor' | 'furnace-timeline') => {
    if (target === '3d-lattice') {
      scrollToSection('3d-lattice');
    } else if (target === 'furnace-timeline') {
      scrollToSection('furnace-timeline');
    } else if (target === 'ballistic-run') {
      setActiveChallengeTab('ballistic-run');
      scrollToSection('challenges');
    } else if (target === 'furnace-puzzle') {
      setActiveChallengeTab('furnace-puzzle');
      scrollToSection('challenges');
    } else if (target === 'extractor') {
      scrollToSection('extractor');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* 3-Zone Sticky Navigation Bar */}
      <HeaderNav activeSection={activeSection} onNavigate={scrollToSection} />

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-20">
        
        {/* =========================================================================
            HERO INTRODUCTION SECTION
            ========================================================================= */}
        <section className="relative pt-6 pb-12 flex flex-col items-center text-center">
          {/* Subtle Halftone Aura */}
          <div className="absolute inset-0 max-w-4xl mx-auto comic-halftone opacity-40 rounded-full blur-2xl pointer-events-none" />

          {/* Clean Unboxed Metadata (Zero-Pill Compliance) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
            <span>Chapter 1</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400 font-semibold">The Synthesis Bottleneck</span>
            <span aria-hidden="true">·</span>
            <span>Quantum Transport Graphic Novel</span>
          </div>

          {/* Editorial Display Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl text-balance leading-none mb-6">
            The Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Frontier</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl max-w-2xl leading-relaxed text-balance mb-8">
            Step inside a carbon nanotube conduit with <strong className="text-cyan-300">Spin</strong>—an electron wave packet racing at Fermi velocity down an atomic highway. When CVD furnace fluctuations cause catastrophic structural vacancies, only materials science can heal the quantum path.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection('novel')}
              className="px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-400/25 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read Graphic Novel</span>
            </button>
            <button
              onClick={() => scrollToSection('3d-lattice')}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-medium text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Atom className="w-4 h-4 text-cyan-400" />
              <span>Explore 3D Rigged Lattice</span>
            </button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="mt-12 flex flex-col items-center gap-2 text-xs font-mono text-slate-500">
            <span>Scroll down to navigate the atomic highway</span>
            <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
          </div>
        </section>

        {/* =========================================================================
            SECTION 1: PARALLAX GRAPHIC NOVEL READER & TIMELINE ENGINE
            ========================================================================= */}
        <section id="novel" className="scroll-mt-20 space-y-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                Episode 01: The Synthesis Bottleneck
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Interactive Engineering Graphic Novel
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>6 Panels</span>
              <span aria-hidden="true">·</span>
              <span>Audio Synthesizer Ready</span>
            </div>
          </div>

          <ParallaxGraphicNovel onSelectChallenge={handleNovelChallengeLaunch} />

          {/* Interactive Furnace Ramp Rate & Defect Evolution Timeline Component */}
          <div id="furnace-timeline" className="scroll-mt-24 pt-4">
            <FurnaceTimelineRamp />
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: 3D RIGGED CHARACTER & CRYSTAL LATTICE SCENE
            ========================================================================= */}
        <section id="3d-lattice" className="scroll-mt-20 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                WebGL 3D Studio & Rigged Character
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                3D Hexagonal Lattice Highway & Spin Rigging
              </h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
                Real-time 3D reconstruction of the featured crystal conduit. Inspect the rigged electron character with orthogonal precession rings, de Broglie trail, and the crimson vacancy fracture cluster.
              </p>
            </div>

            {/* Defect Density Controller */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs">
              <span className="text-slate-400 font-mono">Defect Severity:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={defectSeverity}
                onChange={(e) => setDefectSeverity(parseInt(e.target.value))}
                className="w-24 accent-red-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="font-mono text-red-400 tabular-nums font-bold">
                {defectSeverity}%
              </span>
            </div>
          </div>

          <ThreeLatticeScene
            defectSeverity={defectSeverity}
            onDefectHit={() => {
              // Notification or sound handled in component
            }}
          />
        </section>

        {/* =========================================================================
            SECTION 3: EMBEDDED PHYSICS-BASED PUZZLE CHALLENGES
            ========================================================================= */}
        <section id="challenges" className="scroll-mt-20">
          <PhysicsChallenges initialChallenge={activeChallengeTab} />
        </section>

        {/* =========================================================================
            SECTION 4: MATERIALS SCIENCE DATA EXTRACTION AGENT & SCRIPTWRITER
            ========================================================================= */}
        <section id="extractor" className="scroll-mt-20">
          <DataExtractorAgent />
        </section>

      </main>

      {/* =========================================================================
          FOOTER (Clean & Quiet, No Ornamental Telemetry Tickers)
          ========================================================================= */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-300">The Quantum Frontier</span>
            <span className="mx-2">·</span>
            <span>Interactive Engineering Graphic Novel & Materials Science Simulator</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Landauer Formalism G = 2e²/h</span>
            <span>CVD Arrhenius Kinetics</span>
            <span>Dirac-Weyl Hamiltonian</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
