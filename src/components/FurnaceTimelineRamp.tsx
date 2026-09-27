import React, { useState, useEffect, useRef, useMemo } from 'react';
import { soundFx } from '../services/soundFx';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Flame, 
  Activity, 
  Clock, 
  Layers, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Thermometer,
  Zap,
  ShieldCheck
} from 'lucide-react';

export interface TemperatureProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  maxRampRate: number; // C / min
  targetTemp: number; // C
  color: string;
  // Function to calculate temp (C) at time t (0 to 60 mins)
  getTempAt: (t: number) => number;
  // Function to calculate instantaneous ramp rate dT/dt at time t
  getRampRateAt: (t: number) => number;
  // Function to calculate defect density (10^12 cm^-2) at time t
  getDefectDensityAt: (t: number) => number;
  // Projected conductance % (0 to 100)
  getConductanceAt: (t: number) => number;
}

export const TEMPERATURE_PROFILES: TemperatureProfile[] = [
  {
    id: 'shock',
    name: 'Flash Ramp (Thermal Shock)',
    tagline: 'High Stress · Rapid Vacancy Clustering',
    description: 'Aggressive 55°C/min heating causes severe localized radial thermal strain, generating multi-atom vacancies and Stone-Wales 7-5 dislocations.',
    maxRampRate: 55,
    targetTemp: 1050,
    color: '#ef4444',
    getTempAt: (t: number) => {
      if (t < 5) return 25 + t * 40;
      if (t < 22) return 225 + (t - 5) * 52;
      if (t < 45) return 1050; // hold
      return Math.max(25, 1050 - (t - 45) * 65); // rapid crash cool
    },
    getRampRateAt: (t: number) => {
      if (t < 5) return 40;
      if (t < 22) return 52;
      if (t < 45) return 0;
      return -65;
    },
    getDefectDensityAt: (t: number) => {
      if (t < 10) return 0.2;
      if (t < 25) return 0.2 + (t - 10) * 0.38; // rises sharply to ~5.9
      if (t < 45) return 5.9 + (t - 25) * 0.05; // slight clustering
      return 6.8; // frozen in by fast quench
    },
    getConductanceAt: (t: number) => {
      if (t < 15) return 95;
      if (t < 30) return Math.max(5, 95 - (t - 15) * 5.8);
      return 8; // severe Anderson localization
    },
  },
  {
    id: 'nominal',
    name: 'Standard Nominal CVD',
    tagline: 'Moderate Rate · Intermediate Quality',
    description: 'Standard single-slope 30°C/min ramp to 950°C. Lower vacancy density than thermal shock, but residual point vacancies remain.',
    maxRampRate: 30,
    targetTemp: 950,
    color: '#f59e0b',
    getTempAt: (t: number) => {
      if (t < 32) return 25 + t * 29;
      if (t < 50) return 950; // growth dwell
      return Math.max(25, 950 - (t - 50) * 35);
    },
    getRampRateAt: (t: number) => {
      if (t < 32) return 29;
      if (t < 50) return 0;
      return -35;
    },
    getDefectDensityAt: (t: number) => {
      if (t < 20) return 0.2;
      if (t < 40) return 0.2 + (t - 20) * 0.12;
      if (t < 50) return 2.6 - (t - 40) * 0.04;
      return 2.2;
    },
    getConductanceAt: (t: number) => {
      if (t < 25) return 95;
      if (t < 45) return Math.max(35, 95 - (t - 25) * 2.8);
      return 42;
    },
  },
  {
    id: 'optimized',
    name: 'Multi-Stage Anneal & Quench',
    tagline: 'Controlled Thermodynamics · Defect-Free Coherence',
    description: 'Staged 18°C/min ramp with hydrogen degassing plateau, slow approach to 1020°C, and atomic vacancy self-healing under carrier gas flux.',
    maxRampRate: 18,
    targetTemp: 1020,
    color: '#10b981',
    getTempAt: (t: number) => {
      if (t < 15) return 25 + t * 25; // to 400C
      if (t < 22) return 400; // plateau for gas equilibrium
      if (t < 40) return 400 + (t - 22) * 18; // steady to 724C
      if (t < 52) return 1020; // high-temp sp2 stitch & anneal
      return Math.max(25, 1020 - (t - 52) * 20); // controlled quench
    },
    getRampRateAt: (t: number) => {
      if (t < 15) return 25;
      if (t < 22) return 0;
      if (t < 40) return 18;
      if (t < 52) return 0;
      return -20;
    },
    getDefectDensityAt: (t: number) => {
      if (t < 25) return 0.3;
      if (t < 38) return 0.3 + (t - 25) * 0.08; // small rise during initial growth
      if (t < 52) return Math.max(0.04, 1.34 - (t - 38) * 0.09); // active vacancy annihilation!
      return 0.04; // pristine ballistic limit
    },
    getConductanceAt: (t: number) => {
      if (t < 35) return 90;
      if (t < 45) return 75;
      if (t < 55) return Math.min(100, 75 + (t - 45) * 2.5); // recovery to 100%
      return 100;
    },
  },
];

export const FurnaceTimelineRamp: React.FC = () => {
  const [selectedProfileId, setSelectedProfileId] = useState<string>('shock');
  const [currentTime, setCurrentTime] = useState<number>(20); // Minutes (0 to 60)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeProfile = useMemo(() => {
    return TEMPERATURE_PROFILES.find((p) => p.id === selectedProfileId) || TEMPERATURE_PROFILES[0];
  }, [selectedProfileId]);

  // Real-time calculated metrics at current timeline position
  const currentTemp = Math.round(activeProfile.getTempAt(currentTime));
  const currentRampRate = Math.round(activeProfile.getRampRateAt(currentTime));
  const currentDefectDensity = activeProfile.getDefectDensityAt(currentTime).toFixed(2);
  const currentConductance = Math.round(activeProfile.getConductanceAt(currentTime));

  // Determine current process stage
  const currentStage = useMemo(() => {
    if (currentTime < 5) return 'Pre-Purge & Inert Carrier Inflow (Ar/H₂)';
    if (currentTime < 25) return 'Thermal Ramp-Up Stage (dTs/dt Active)';
    if (currentTime < 48) return 'Precursor Decomposition & sp² Stitching (CH₄)';
    return 'Exhaust Phase & Controlled Thermal Quench';
  }, [currentTime]);

  // Live dynamic thermal intensity and color shifting state reflecting furnace profile & current heat
  const thermalIntensity = useMemo(() => {
    const tempRatio = Math.min(1, Math.max(0, currentTemp / 1200));
    const isShock = activeProfile.id === 'shock';
    const isNominal = activeProfile.id === 'nominal';

    if (isShock || (currentTemp > 900 && currentRampRate > 35)) {
      return {
        badgeText: 'CRITICAL THERMAL SHOCK',
        subText: 'High Strain Rate · Atomic Fracture Risk',
        color: '#ef4444',
        accentClass: 'text-red-400',
        borderClass: 'border-red-500/80',
        bgClass: 'bg-red-950/90',
        glowClass: 'shadow-[0_0_35px_rgba(239,68,68,0.5)] ring-1 ring-red-500/60',
        gradientBar: 'from-orange-500 via-rose-500 to-red-500',
        intensityLevel: 'EXTREME',
        percent: Math.round(tempRatio * 100),
        pulseClass: 'animate-pulse',
      };
    } else if (isNominal || (currentTemp > 650 && currentTemp <= 900)) {
      return {
        badgeText: 'ELEVATED THERMAL FLUX',
        subText: 'Linear CVD Ramp · Moderate Vacancy Drift',
        color: '#f59e0b',
        accentClass: 'text-amber-400',
        borderClass: 'border-amber-500/80',
        bgClass: 'bg-amber-950/90',
        glowClass: 'shadow-[0_0_28px_rgba(245,158,11,0.4)] ring-1 ring-amber-500/60',
        gradientBar: 'from-amber-500 to-yellow-400',
        intensityLevel: 'MODERATE',
        percent: Math.round(tempRatio * 100),
        pulseClass: '',
      };
    } else {
      return {
        badgeText: 'HOMOGENEOUS ANNEALING',
        subText: 'Thermodynamic Equilibrium · Vacancy Self-Healing',
        color: '#10b981',
        accentClass: 'text-emerald-400',
        borderClass: 'border-emerald-500/80',
        bgClass: 'bg-emerald-950/90',
        glowClass: 'shadow-[0_0_28px_rgba(16,185,129,0.4)] ring-1 ring-emerald-500/60',
        gradientBar: 'from-cyan-400 via-teal-400 to-emerald-400',
        intensityLevel: 'OPTIMIZED',
        percent: Math.round(tempRatio * 100),
        pulseClass: '',
      };
    }
  }, [currentTemp, currentRampRate, activeProfile]);

  // Normalized coordinate percentages on graph (0 to 100%) for live HUD tracking
  const padLeft = 55;
  const padRight = 30;
  const padTop = 25;
  const padBottom = 35;
  const graphW = 720 - padLeft - padRight; // 635
  const graphH = 300 - padTop - padBottom; // 240

  const trackerXPercent = Math.max(0, Math.min(100, ((padLeft + (currentTime / 60) * graphW) / 720) * 100));
  const trackerYPercent = Math.max(0, Math.min(100, ((padTop + graphH - (currentTemp / 1200) * graphH) / 300) * 100));

  // Dynamic real-time Defect Threshold state:
  // Dynamically transitions from Cool Cyan (optimal) -> Warning Amber (approaching defect threshold) -> Critical Red (threshold exceeded)
  const defectThreshold = useMemo(() => {
    const defectNum = parseFloat(currentDefectDensity);
    const absRamp = Math.abs(currentRampRate);

    // Calculate real-time proximity percentage to critical Selenium vacancy (V_Se) formation threshold
    // Selenium has high vapor pressure; thermal fluctuations above 380°C or ramp rates > 20°C/min trigger severe chalcogen desorption
    const tempFactor = Math.min(100, Math.max(0, ((currentTemp - 25) / (900 - 25)) * 100));
    const defectFactor = Math.min(100, (defectNum / 3.5) * 100);
    const rampFactor = Math.min(100, (absRamp / 40) * 100);
    const proximity = Math.max(0, Math.min(100, Math.round(tempFactor * 0.40 + defectFactor * 0.35 + rampFactor * 0.25)));

    if (proximity >= 68 || defectNum >= 2.8 || absRamp > 32 || (activeProfile.id === 'shock' && currentTime > 12)) {
      return {
        level: 'critical',
        badge: 'ALERT: V_Se DEFECT THRESHOLD EXCEEDED',
        status: 'Severe Selenium Vacancy Cascade',
        color: '#ef4444',
        accentClass: 'text-red-400',
        borderClass: 'border-red-500/80',
        bgClass: 'bg-red-950/95',
        glowClass: 'shadow-[0_0_32px_rgba(239,68,68,0.6)] ring-1 ring-red-500/60',
        dotClass: 'bg-red-500 animate-ping',
        subtext: 'High thermal flux drives massive Selenium sublimation. Severe n-type bulk doping drowns topological channels.',
        proximityPercent: proximity,
        proximityLabel: 'CRITICAL V_Se CASCADE',
      };
    } else if (proximity >= 38 || defectNum >= 1.0 || currentTemp >= 420 || absRamp > 18) {
      return {
        level: 'warning',
        badge: 'WARNING: APPROACHING V_Se THRESHOLD',
        status: 'Selenium Desorption Inception',
        color: '#f59e0b',
        accentClass: 'text-amber-400',
        borderClass: 'border-amber-400/80',
        bgClass: 'bg-amber-950/95',
        glowClass: 'shadow-[0_0_28px_rgba(245,158,11,0.5)] ring-1 ring-amber-400/60',
        dotClass: 'bg-amber-400 animate-pulse',
        subtext: 'Thermal energy nearing V_Se sublimation barrier (E_a ≈ 1.2 eV). Atomic point vacancy nucleation rising.',
        proximityPercent: proximity,
        proximityLabel: 'V_Se FORMATION RISK',
      };
    } else {
      return {
        level: 'safe',
        badge: 'OPTIMAL: PRISTINE QUANTUM REGIME',
        status: 'Sub-Threshold Stoichiometry',
        color: '#22d3ee',
        accentClass: 'text-cyan-400',
        borderClass: 'border-cyan-400/80',
        bgClass: 'bg-cyan-950/95',
        glowClass: 'shadow-[0_0_24px_rgba(34,211,238,0.45)] ring-1 ring-cyan-400/60',
        dotClass: 'bg-cyan-400',
        subtext: 'Substrate within safe stoichiometric window (<380°C). Intact Dirac cone and protected helical surface states.',
        proximityPercent: proximity,
        proximityLabel: 'STABLE STOICHIOMETRY',
      };
    }
  }, [currentDefectDensity, currentRampRate, currentTemp, activeProfile, currentTime]);

  // Auto-play animation timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= 60) {
          setIsPlaying(false);
          soundFx.playTriumph();
          return 60;
        }
        return Math.min(60, prev + 0.3 * playbackSpeed);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // Draw the Temperature Profile Timeline Graph
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const padLeft = 55;
    const padRight = 30;
    const padTop = 25;
    const padBottom = 35;
    const graphW = w - padLeft - padRight;
    const graphH = h - padTop - padBottom;

    // Helper coordinates
    const timeToX = (t: number) => padLeft + (t / 60) * graphW;
    const tempToY = (tempVal: number) => padTop + graphH - (tempVal / 1200) * graphH;

    // 1. Draw Background Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Horizontal temp grid lines (0, 300, 600, 900, 1200 C)
    [0, 300, 600, 900, 1200].forEach((tVal) => {
      const y = tempToY(tVal);
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${tVal}°C`, padLeft - 8, y + 3);
    });

    // Vertical time grid lines (0, 15, 30, 45, 60 min)
    [0, 15, 30, 45, 60].forEach((tMin) => {
      const x = timeToX(tMin);
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${tMin}m`, x, h - padBottom + 16);
    });

    // 2. Draw Ramp Rate Safety Gradient Zones
    // Stress zone above 40 C/min
    const stressTopY = tempToY(1200);
    const stressBotY = tempToY(800);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.04)';
    ctx.fillRect(padLeft, stressTopY, graphW, stressBotY - stressTopY);

    // 3. Draw All Profile Curves in Background (faint)
    TEMPERATURE_PROFILES.forEach((prof) => {
      if (prof.id === activeProfile.id) return;
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let t = 0; t <= 60; t += 0.5) {
        const x = timeToX(t);
        const y = tempToY(prof.getTempAt(t));
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // 4. Draw Active Profile Temperature Curve with Glowing Gradient
    ctx.strokeStyle = activeProfile.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = activeProfile.color;
    ctx.shadowBlur = 12;

    ctx.beginPath();
    for (let t = 0; t <= 60; t += 0.5) {
      const x = timeToX(t);
      const y = tempToY(activeProfile.getTempAt(t));
      if (t === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Gradient fill under curve
    const grad = ctx.createLinearGradient(0, padTop, 0, h - padBottom);
    grad.addColorStop(0, `${activeProfile.color}25`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(timeToX(0), tempToY(0));
    for (let t = 0; t <= 60; t += 0.5) {
      ctx.lineTo(timeToX(t), tempToY(activeProfile.getTempAt(t)));
    }
    ctx.lineTo(timeToX(60), tempToY(0));
    ctx.closePath();
    ctx.fill();

    // 5. Draw Live Scrub Head (Playhead)
    const scrubX = timeToX(currentTime);
    const scrubY = tempToY(activeProfile.getTempAt(currentTime));

    // Vertical playhead line color-coded to defect threshold
    ctx.strokeStyle = defectThreshold.color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(scrubX, padTop);
    ctx.lineTo(scrubX, h - padBottom);
    ctx.stroke();

    // Horizontal guideline to temperature axis
    ctx.strokeStyle = `${defectThreshold.color}50`;
    ctx.beginPath();
    ctx.moveTo(padLeft, scrubY);
    ctx.lineTo(scrubX, scrubY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Glowing radiating halo at curve intersection
    ctx.strokeStyle = `${defectThreshold.color}80`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(scrubX, scrubY, 12, 0, Math.PI * 2);
    ctx.stroke();

    // Core glowing dot at intersection
    ctx.fillStyle = defectThreshold.color;
    ctx.shadowColor = defectThreshold.color;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(scrubX, scrubY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Time readout pill above scrub point
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(scrubX - 35, padTop - 18, 70, 16);
    ctx.strokeStyle = defectThreshold.color;
    ctx.lineWidth = 1;
    ctx.strokeRect(scrubX - 35, padTop - 18, 70, 16);

    ctx.fillStyle = defectThreshold.color;
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${currentTime.toFixed(1)} min`, scrubX, padTop - 6);

  }, [activeProfile, currentTime, defectThreshold]);

  const handleProfileChange = (id: string) => {
    setSelectedProfileId(id);
    soundFx.playBlip(750);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const resetTimeline = () => {
    setCurrentTime(0);
    setIsPlaying(false);
    soundFx.playWhoosh();
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl space-y-6">
      
      {/* Top Header & Context */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>THERMAL SYNTHESIS KINETICS ENGINE</span>
            <span aria-hidden="true">·</span>
            <span>REAL-TIME LATTICE DEFECT COUPLING</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Furnace Ramp Rate & Defect Evolution Timeline
          </h3>
          <p className="text-slate-400 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
            Toggle between heating profiles to observe how temperature ramp rates (dT/dt) dictate atomic vacancy formation and self-healing across the 60-minute CVD growth cycle.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundFx.playBlip(600);
            }}
            className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
            title={isPlaying ? 'Pause Timeline' : 'Play Timeline'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          
          <button
            onClick={resetTimeline}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Reset to 0m"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
            {[1, 2, 4].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`px-2 py-1 rounded transition-colors ${
                  playbackSpeed === spd ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Temperature Profile Selection Tabs (Zero-Pill Compliance: Clean interactive button group) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {TEMPERATURE_PROFILES.map((profile) => {
          const isSelected = profile.id === selectedProfileId;
          return (
            <button
              key={profile.id}
              onClick={() => handleProfileChange(profile.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {profile.name}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: profile.color }}
                  />
                </div>
                <div className="text-[11px] text-slate-400 font-mono mb-2">
                  {profile.tagline}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {profile.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-500">Max Ramp:</span>
                <span className="font-bold tabular-nums" style={{ color: profile.color }}>
                  {profile.maxRampRate}°C/min
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Dual Viewport: Interactive Timeline Canvas + Atomic STEM Lattice Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Temperature vs Time Coordinate Graph (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              TEMPERATURE (T) VS TIME (t) PROFILE
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Target: <strong className="text-white">{activeProfile.targetTemp}°C</strong>
            </span>
          </div>

          {/* Canvas Chart with Persistent Live Color-Coded Temperature HUD */}
          <div className="relative rounded-xl overflow-hidden bg-slate-900/60 border border-slate-800/80">
            <canvas
              ref={canvasRef}
              width={720}
              height={300}
              className="w-full h-[260px] block cursor-ew-resize"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, (clickX - 55) / (rect.width - 85)));
                setCurrentTime(ratio * 60);
                soundFx.playBlip(700);
              }}
            />

            {/* PERSISTENT, COLOR-CODED TEMPERATURE HUD */}
            <div
              className={`absolute top-3 right-3 backdrop-blur-xl border ${defectThreshold.borderClass} ${defectThreshold.bgClass} ${defectThreshold.glowClass} p-3.5 rounded-xl transition-all duration-300 w-[240px] sm:w-[270px] shadow-2xl pointer-events-none select-none z-20`}
            >
              {/* Header status: cool cyan -> warning amber -> high-defect red */}
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-wider uppercase text-white truncate">
                  <span
                    className={`w-2 h-2 rounded-full ${defectThreshold.dotClass}`}
                    style={{ backgroundColor: defectThreshold.color }}
                  />
                  {defectThreshold.badge}
                </span>
                <span
                  className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded shrink-0"
                  style={{
                    backgroundColor: `${defectThreshold.color}25`,
                    color: defectThreshold.color,
                  }}
                >
                  {defectThreshold.level.toUpperCase()}
                </span>
              </div>

              {/* Main Persistent Temperature & Ramp Rate Display */}
              <div className="flex items-baseline justify-between gap-2">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl md:text-3xl font-mono font-extrabold tracking-tight tabular-nums transition-colors duration-200"
                    style={{ color: defectThreshold.color }}
                  >
                    {currentTemp}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">°C</span>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[9px] text-slate-400">Ramp Rate dT/dt</div>
                  <div
                    className="text-xs font-bold tabular-nums"
                    style={{ color: defectThreshold.color }}
                  >
                    {currentRampRate > 0 ? `+${currentRampRate}` : currentRampRate}°C/min
                  </div>
                </div>
              </div>

              {/* Selected Profile Name & Defect Density readout */}
              <div className="mt-2 pt-2 border-t border-white/10 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 truncate max-w-[130px]">{activeProfile.name}:</span>
                  <span className="font-bold tabular-nums" style={{ color: defectThreshold.color }}>
                    ρ = {currentDefectDensity} × 10¹²
                  </span>
                </div>

                {/* Real-time Proximity to Defect Threshold Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-mono">
                    <span className="text-slate-400">Defect Proximity:</span>
                    <span className="font-extrabold tabular-nums" style={{ color: defectThreshold.color }}>
                      {defectThreshold.proximityPercent}% · {defectThreshold.proximityLabel}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-950/80 overflow-hidden border border-white/10">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${defectThreshold.proximityPercent}%`,
                        backgroundColor: defectThreshold.color,
                        boxShadow: `0 0 8px ${defectThreshold.color}`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic State Description */}
              <p className="text-[9px] text-slate-300 mt-1.5 leading-snug">
                {defectThreshold.subtext}
              </p>
            </div>
          </div>

          {/* Interactive Scrub Slider */}
          <div className="mt-4 pt-2">
            <div className="flex justify-between text-xs text-slate-400 font-mono mb-1.5">
              <span className="flex items-center gap-1 text-cyan-300">
                <Clock className="w-3.5 h-3.5" />
                Scrub Timeline: {currentTime.toFixed(1)} / 60.0 min
              </span>
              <span>{currentStage}</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="0.1"
              value={currentTime}
              onChange={handleScrub}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Real-time Defect Coupling & Atomic STEM Lattice (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Coupled Microscopic State (t = {currentTime.toFixed(1)}m)
              </h4>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                parseFloat(currentDefectDensity) < 1.0
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : parseFloat(currentDefectDensity) < 3.5
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}>
                {parseFloat(currentDefectDensity) < 1.0 ? 'PRISTINE SP²' : parseFloat(currentDefectDensity) < 3.5 ? 'MODERATE DEFECTS' : 'HEAVY VACANCIES'}
              </span>
            </div>

            {/* Real-Time Telemetry Quadrant */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">Chamber Temp</span>
                <span className="text-lg font-mono font-bold text-white tabular-nums">
                  {currentTemp} <span className="text-xs text-slate-500 font-normal">°C</span>
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">Ramp Rate (dT/dt)</span>
                <span className={`text-lg font-mono font-bold tabular-nums ${
                  currentRampRate > 35 ? 'text-red-400' : currentRampRate > 20 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {currentRampRate > 0 ? `+${currentRampRate}` : currentRampRate} <span className="text-xs font-normal">°C/min</span>
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">Defect Density (ρ)</span>
                <span className="text-base font-mono font-bold text-amber-300 tabular-nums">
                  {currentDefectDensity} <span className="text-[10px] text-slate-400 font-normal">×10¹² cm⁻²</span>
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono block">Ballistic G</span>
                <span className={`text-base font-mono font-bold tabular-nums ${
                  currentConductance > 70 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {currentConductance}% <span className="text-[10px] font-normal">of 2e²/h</span>
                </span>
              </div>
            </div>

            {/* Dynamic STEM Hexagonal Lattice Visualization */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                <span>STEM Lattice Cross-Section:</span>
                <span className="text-cyan-400">{currentStage.split(' ')[0]}</span>
              </div>

              <div className="h-28 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden">
                {/* Visual atoms showing defects popping in or healing */}
                <div className="grid grid-cols-7 gap-1.5 w-full justify-items-center">
                  {Array.from({ length: 21 }).map((_, i) => {
                    const defectThreshold = parseFloat(currentDefectDensity);
                    // Higher defect threshold breaks more atoms
                    const isVacancy = (i === 4 && defectThreshold > 1.0) ||
                                      (i === 10 && defectThreshold > 2.0) ||
                                      (i === 11 && defectThreshold > 3.5) ||
                                      (i === 16 && defectThreshold > 5.0);

                    return (
                      <div
                        key={i}
                        className={`w-5 h-5 rounded-md transition-all duration-300 flex items-center justify-center text-[9px] font-mono ${
                          isVacancy
                            ? 'bg-red-500/30 border border-red-500 text-red-300 animate-pulse shadow-[0_0_8px_#ef4444]'
                            : 'bg-cyan-500/20 border border-cyan-400/70 text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.25)]'
                        }`}
                      >
                        {isVacancy ? '!' : 'C'}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Comic Dialogue Reactive Bubble */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-900/40 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                e⁻
              </span>
              <span className="font-bold text-cyan-300 text-[11px]">Spin the Electron:</span>
            </div>
            <p className="text-slate-300 italic">
              {parseFloat(currentDefectDensity) > 4.0
                ? '"Ouch! Thermal shock created multi-atom potholes! My path is completely blocked!"'
                : parseFloat(currentDefectDensity) > 1.5
                ? '"I can squeeze through, but scattered momentum is bleeding my coherence."'
                : '"Pristine sp² honeycomb! Zero thermal vacancies. Full speed ahead!"'}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
