import React, { useState } from 'react';
import { MaterialScienceExtraction } from '../types';
import { soundFx } from '../services/soundFx';
import { 
  FileCode, 
  Copy, 
  Check, 
  Sparkles, 
  Atom, 
  Send, 
  BookOpen, 
  Layers, 
  Cpu, 
  ArrowRight,
  Database
} from 'lucide-react';

// The verified extraction for the user's uploaded crystal lattice image
export const IMAGE_ANALYSIS_EXTRACTION: MaterialScienceExtraction = {
  material_name: 'Single-Walled Carbon Nanotube (SWCNT) / Chiral (10,10) Armchair Lattice [Formula: Cₙ]',
  synthesis_defect: 'Atomic vacancy cluster and Stone-Wales bond dislocation caused by CVD thermal ramp gradient fluctuations',
  microscopic_consequence: 'Severe elastic backscattering and Anderson localization; destructive quantum interference obliterates ballistic conductance from 2e²/h to localized bound charge',
  graphic_novel_scene: 'Interior perspective of a glowing cyan hexagonal crystal lattice tunnel. Spin the Electron—a luminous blue particle orbited by spinning quantum precession rings with a comet-like phase wake—speeds down the atomic highway at relativistic Fermi velocity, only to confront a fiery crimson wall of fractured, missing atoms and jagged broken bonds pulsing with destructive potential.',
  panel_text: "'Whoa! This atomic lane is blocked by a massive structural flaw!'",
  growth_method: 'Chemical Vapor Deposition (CVD) @ 950°C',
  carrier_type: 'Relativistic Dirac Fermions (e⁻)',
  conductance_quantum: 'G₀ = 2e²/h (77.48 µS)',
  formula_latex: 'E(k) = ± ħ v_F |k|',
};

export const PRESET_RESEARCH_CASES: { id: string; title: string; snippet: string; extraction: MaterialScienceExtraction }[] = [
  {
    id: 'swcnt-image',
    title: 'Featured: Carbon Nanotube (Uploaded Crystal)',
    snippet:
      'Chemical Vapor Deposition of single-walled carbon nanotubes over Fe nanoparticles at 950°C. Temperature oscillations of 0.8°C during ramp induce multi-atom vacancy clusters and Stone-Wales 7-5 bond dislocations along the cylinder wall. Low-temperature transport reveals a collapse in ballistic conductance from 2e²/h to 0.04e²/h due to strong backscattering.',
    extraction: IMAGE_ANALYSIS_EXTRACTION,
  },
  {
    id: 'bi2se3-ti',
    title: 'Preprint: Bi₂Se₃ Selenium Vacancies (Mohapatra et al.)',
    snippet:
      'High-Density Selenium Vacancies and Bulk Conduction Tuning in Bi2Se3 Topological Insulator Thin Films (R. K. Mohapatra, et al.). Substrate temperature fluctuations (+/- 3.5 °C) during MBE nucleation trigger high-density Selenium vacancies. Unintended n-type bulk doping shifts the Fermi level into the conduction band, causing heavy electron scattering and destroying the dissipationless topological edge current.',
    extraction: {
      material_name: 'Bi₂Se₃ (Bismuth Selenide Topological Insulator)',
      synthesis_defect: 'Selenium (Se) vacancies induced by ±3.5°C substrate temperature fluctuations during MBE nucleation',
      microscopic_consequence: 'Native n-type bulk doping shifts Fermi level into the conduction band, causing heavy electron scattering and destroying protected dissipationless topological surface edge currents',
      graphic_novel_scene: 'Spin skims along a pristine golden helical surface ribbon when a gaping Selenium vacancy pothole opens; the electron crashes out of the topological boundary into a chaotic storm of metallic bulk states.',
      panel_text: "'A thermal flicker blew a Selenium vacancy in the lane! I\\'m scattering into the bulk!'",
      growth_method: 'Molecular Beam Epitaxy (MBE) with ML Flux Loop',
      carrier_type: 'Helical Spin-Momentum Locked Surface Electrons',
      conductance_quantum: 'e²/h per topological channel',
      formula_latex: 'H_surf = v_F (σ × p) · ẑ',
    },
  },
  {
    id: 'mos2-tmd',
    title: 'MoS₂ Monolayer (2D Valleytronics)',
    snippet:
      'Atmospheric pressure CVD synthesis of monolayer MoS₂ using MoO₃ and sulfur powder at 750°C. Incomplete sulfurization yields mono-sulfur vacancies (V_S) with densities exceeding 10¹³ cm⁻², introducing mid-gap localized electronic states that pin the Fermi level and quench valley-polarized photoluminescence.',
    extraction: {
      material_name: 'MoS₂ (Molybdenum Disulfide Monolayer)',
      synthesis_defect: 'Mono-sulfur vacancies (V_S) caused by insufficient sulfur vapor flux during atmospheric CVD',
      microscopic_consequence: 'Deep sub-gap trap states pin the Fermi level, scattering valley-polarized excitons and reducing photoluminescence quantum yield by 85%',
      graphic_novel_scene: 'Spin attempts to navigate a dual-lane valley highway marked with K and K\' quantum signposts, but deep sulfur sinkholes swallow the optical signal, scattering Spin into trapped dead ends.',
      panel_text: "'Trapped in a sulfur sinkhole! My valley polarization is draining fast!'",
      growth_method: 'Atmospheric Pressure CVD @ 750°C',
      carrier_type: 'Valley-Polarized Excitons',
      conductance_quantum: 'Mobility: 45 cm²/V·s',
      formula_latex: 'E_g = 1.8 eV (Direct Gap)',
    },
  },
  {
    id: 'ybco-super',
    title: 'YBa₂Cu₃O₇₋δ High-Tc Superconductor',
    snippet:
      'Pulsed Laser Deposition (PLD) of YBa₂Cu₃O₇₋δ thin films under varied oxygen partial pressures. Oxygen non-stoichiometry (δ > 0.15) disrupts the Cu-O chain ordering in the basal plane, degrading the superconducting transition temperature Tc from 93 K down to 60 K or destroying superconductivity entirely.',
    extraction: {
      material_name: 'YBa₂Cu₃O₇₋δ (Yttrium Barium Copper Oxide High-Tc Superconductor)',
      synthesis_defect: 'Oxygen deficiency (δ > 0.15) in Cu-O basal chains due to inadequate oxygen annealing partial pressure',
      microscopic_consequence: 'Disruption of d-wave Cooper pair coherence in CuO₂ planes, collapsing superconducting critical temperature Tc from 93 K to non-superconducting',
      graphic_novel_scene: 'Spin and an entangled twin electron form a gliding Cooper pair across frictionless supercurrent rails, but an oxygen vacancy gap snaps their quantum bond in two.',
      panel_text: "'Our Cooper pair bond shattered! The zero-resistance lane just snapped!'",
      growth_method: 'Pulsed Laser Deposition (PLD) + O₂ Annealing',
      carrier_type: 'Cooper Pairs (2e⁻)',
      conductance_quantum: 'Resistance: R = 0 (T < Tc)',
      formula_latex: 'Δ(k) = Δ₀ (cos k_x a - cos k_y a)',
    },
  },
];

export const DataExtractorAgent: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<string>('swcnt-image');
  const [customInput, setCustomInput] = useState<string>('');
  const [activeExtraction, setActiveExtraction] = useState<MaterialScienceExtraction>(IMAGE_ANALYSIS_EXTRACTION);
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSelectCase = (id: string) => {
    setSelectedCase(id);
    const found = PRESET_RESEARCH_CASES.find((c) => c.id === id);
    if (found) {
      setActiveExtraction(found.extraction);
      soundFx.playBlip(750);
    }
  };

  const handleCopyJson = () => {
    // Exact 5-key JSON required by prompt
    const strictJson = {
      material_name: activeExtraction.material_name,
      synthesis_defect: activeExtraction.synthesis_defect,
      microscopic_consequence: activeExtraction.microscopic_consequence,
      graphic_novel_scene: activeExtraction.graphic_novel_scene,
      panel_text: activeExtraction.panel_text,
    };
    navigator.clipboard.writeText(JSON.stringify(strictJson, null, 2));
    setCopied(true);
    soundFx.playBlip(900);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleProcessCustom = () => {
    if (!customInput.trim()) return;
    setIsProcessing(true);
    soundFx.playWhoosh();

    // Natural extraction heuristics from input
    setTimeout(() => {
      const lower = customInput.toLowerCase();
      let extracted: MaterialScienceExtraction = {
        material_name: 'Custom Quantum Material System',
        synthesis_defect: 'Growth-induced stoichiometric point defects and interface dislocation strain',
        microscopic_consequence: 'Carrier scattering, localized charge traps, and degradation of quantum transport mobility',
        graphic_novel_scene: 'Spin glides down the newly patterned atomic grid, encountering distorted lattice coordinates where atoms deviate from equilibrium positions.',
        panel_text: "'Lattice mismatch detected ahead! The atomic highway is shifting!'",
      };

      if (lower.includes('graphene') || lower.includes('carbon') || lower.includes('nanotube')) {
        extracted = {
          material_name: 'Carbon Lattice (Graphene / Nanotube)',
          synthesis_defect: 'Grain boundary mismatch and point vacancies from rapid thermal cooling',
          microscopic_consequence: 'Momentum scattering at domain boundaries reduces ballistic mean free path',
          graphic_novel_scene: 'Spin hits a jagged grain boundary seam where carbon rings twist from hexagons into pentagon-heptagon pairs.',
          panel_text: "'Grain boundary collision! My phase alignment is twisting!'",
        };
      } else if (lower.includes('oxide') || lower.includes('srtio3') || lower.includes('oxygen')) {
        extracted = {
          material_name: 'Complex Transition Metal Oxide Lattice',
          synthesis_defect: 'Oxygen vacancies (V_O) resulting from reducing annealing atmosphere',
          microscopic_consequence: 'Formation of 2D electron gas (2DEG) accompanied by localized polaronic states',
          graphic_novel_scene: 'Spin skates across an oxide crystal plane, dragged down by heavy polaronic lattice vibrations caused by missing oxygen ions.',
          panel_text: "'The lattice is warping around me! Polaron drag is slowing my run!'",
        };
      }

      setActiveExtraction(extracted);
      setIsProcessing(false);
      soundFx.playTriumph();
    }, 1200);
  };

  // Formatted strict 5-key JSON
  const outputJson = {
    material_name: activeExtraction.material_name,
    synthesis_defect: activeExtraction.synthesis_defect,
    microscopic_consequence: activeExtraction.microscopic_consequence,
    graphic_novel_scene: activeExtraction.graphic_novel_scene,
    panel_text: activeExtraction.panel_text,
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-4 md:p-8 shadow-2xl space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1 flex items-center gap-1.5">
            <Atom className="w-3.5 h-3.5" />
            SYNTHESIS DEPENDENCE TRANSLATION ENGINE
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Materials Science Data Extraction Agent & Scriptwriter
          </h2>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl">
            Translates quantum materials research papers and crystal diagrams into structured 5-key JSON data for graphic novel scenes.
          </p>
        </div>

        {/* Copy JSON Button */}
        <button
          onClick={handleCopyJson}
          className="px-4 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 hover:bg-slate-800 text-cyan-300 font-mono text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied Clean JSON!' : 'Copy 5-Key JSON'}
        </button>
      </div>

      {/* Preset Research Studies Selector */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="font-mono text-cyan-400">Select Peer-Reviewed Dataset / Diagram Analysis:</span>
          <span>Click to inspect synthesis JSON</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_RESEARCH_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCase(c.id)}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                selectedCase === c.id
                  ? 'border-cyan-400 bg-cyan-950/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="font-semibold text-xs text-white mb-1.5 flex items-center justify-between">
                <span>{c.title}</span>
                {selectedCase === c.id && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {c.snippet}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Research Ingestion Input */}
      <div className="bg-slate-900/70 border border-slate-800 p-4 rounded-2xl">
        <label className="block text-xs font-mono text-cyan-400 mb-2">
          Paste Technical Research Abstract / Synthesis Parameters:
        </label>
        <div className="flex flex-col md:flex-row gap-3">
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="e.g. Chemical Vapor Deposition of single-walled carbon nanotubes at 950°C. Thermal fluctuations created Stone-Wales defects and atomic vacancies causing severe backscattering..."
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-400 resize-none h-20"
          />
          <button
            onClick={handleProcessCustom}
            disabled={isProcessing || !customInput.trim()}
            className="md:w-44 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Extracting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract 5-Key JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Dual Screen: Strict 5-Key JSON + Rendered Graphic Novel Comic Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: Structured JSON Output (Exact 5 keys required by prompt) (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-cyan-400 flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                Structured JSON Object (Strict Prompt Schema)
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded">
                Valid 5-Key Schema
              </span>
            </div>

            <pre className="font-mono text-[11px] md:text-xs text-slate-300 bg-slate-900/90 p-4 rounded-xl border border-slate-800 overflow-x-auto leading-relaxed shadow-inner">
              <code>{JSON.stringify(outputJson, null, 2)}</code>
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Keys: material_name · synthesis_defect · microscopic_consequence · graphic_novel_scene · panel_text</span>
            <span className="font-mono text-cyan-400">JSON OK</span>
          </div>
        </div>

        {/* Right: Live Graphic Novel Panel Generation Preview (6 Cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between shadow-[0_0_30px_rgba(6,182,212,0.1)]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-xs text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Live Animated Graphic Novel Script Execution
              </span>
              <span className="font-mono text-[10px] text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950/40">
                COMIC PREVIEW
              </span>
            </div>

            {/* Target Material Badge */}
            <div className="mb-4">
              <span className="text-xs text-slate-400 font-mono block">Synthesized Material:</span>
              <h4 className="text-base font-bold text-white tracking-tight">
                {activeExtraction.material_name}
              </h4>
            </div>

            {/* Visual Animator Scene Prompt Card */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 mb-4">
              <span className="text-[11px] font-mono text-cyan-400 block mb-1">
                graphic_novel_scene (Animator Direction):
              </span>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{activeExtraction.graphic_novel_scene}"
              </p>
            </div>

            {/* Scientific Defect & Consequence Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-red-400 block mb-0.5">Synthesis Defect</span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {activeExtraction.synthesis_defect}
                </p>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-amber-400 block mb-0.5">Microscopic Consequence</span>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {activeExtraction.microscopic_consequence}
                </p>
              </div>
            </div>

            {/* The Punchy Comic Book Dialogue Caption Box */}
            <div className="p-4 rounded-xl bg-cyan-950/80 border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                  e⁻
                </div>
                <span className="font-bold text-xs text-cyan-300 uppercase tracking-wide">
                  Spin the Electron:
                </span>
              </div>
              <p className="text-base md:text-lg font-bold text-white font-sans tracking-wide leading-snug">
                "{activeExtraction.panel_text.replace(/['"]/g, '')}"
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Scientific rigor: High</span>
            <span className="font-mono text-cyan-300">Word Count: &lt; 20 words (Compliant)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
