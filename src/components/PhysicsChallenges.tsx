import React, { useState, useEffect, useRef } from 'react';
import { soundFx } from '../services/soundFx';
import confetti from 'canvas-confetti';
import { 
  Zap, 
  Flame, 
  RotateCcw, 
  Sparkles, 
  Trophy, 
  Sliders, 
  Gauge, 
  Activity, 
  AlertTriangle,
  Play,
  Pause,
  Layers
} from 'lucide-react';

interface PhysicsChallengesProps {
  initialChallenge?: 'ballistic-run' | 'furnace-puzzle' | 'band-structure';
}

export const PhysicsChallenges: React.FC<PhysicsChallengesProps> = ({
  initialChallenge = 'ballistic-run',
}) => {
  const [activeTab, setActiveTab] = useState<'ballistic-run' | 'furnace-puzzle' | 'band-structure'>(initialChallenge);

  useEffect(() => {
    setActiveTab(initialChallenge);
  }, [initialChallenge]);

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-4 md:p-8 shadow-2xl">
      {/* Tab Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono text-cyan-400 mb-1">
            LABORATORY SIMULATIONS & PHYSICAL BENCHMARKS
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Embedded Physics Challenges
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('ballistic-run');
              soundFx.playBlip(750);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ballistic-run'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Ballistic Wave-Packet Run
          </button>
          <button
            onClick={() => {
              setActiveTab('furnace-puzzle');
              soundFx.playBlip(850);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'furnace-puzzle'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            CVD Furnace Recalibration
          </button>
          <button
            onClick={() => {
              setActiveTab('band-structure');
              soundFx.playBlip(950);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'band-structure'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Dirac Cone & Band Dispersion
          </button>
        </div>
      </div>

      {/* Render Active Challenge */}
      <div className="mt-6">
        {activeTab === 'ballistic-run' && <BallisticRunnerMiniGame />}
        {activeTab === 'furnace-puzzle' && <FurnaceRecalibrationPuzzle />}
        {activeTab === 'band-structure' && <BandStructureExplorer />}
      </div>
    </div>
  );
};

/* =========================================================================
   CHALLENGE 1: BALLISTIC WAVE-PACKET RUN (ARCADE PHYSICS ENGINE)
   ========================================================================= */

const BallisticRunnerMiniGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(0);
  const [conductance, setConductance] = useState<number>(100); // 100% = 2e^2/h
  const [coherenceGauge, setCoherenceGauge] = useState<number>(100);
  const [isTunneling, setIsTunneling] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);

  const gameState = useRef({
    playerY: 150,
    targetY: 150,
    lane: 1, // 0 (top), 1 (mid), 2 (bottom)
    speed: 3.5,
    obstacles: [] as { x: number; lane: number; width: number; type: 'vacancy' | 'cluster' | 'phonon' }[],
    tunneling: false,
    coherence: 100,
    distanceRun: 0,
    totalConductance: 100,
    animId: 0,
  });

  const lanePositions = [60, 150, 240];

  const handleLaneChange = (laneDelta: number) => {
    const nextLane = Math.max(0, Math.min(2, gameState.current.lane + laneDelta));
    gameState.current.lane = nextLane;
    gameState.current.targetY = lanePositions[nextLane];
    soundFx.playBlip(600 + nextLane * 150);
  };

  const handleTunnel = () => {
    if (gameState.current.coherence > 25 && !gameState.current.tunneling) {
      gameState.current.tunneling = true;
      setIsTunneling(true);
      soundFx.playTriumph();
      setTimeout(() => {
        gameState.current.tunneling = false;
        setIsTunneling(false);
      }, 1200);
    }
  };

  const startGame = () => {
    gameState.current = {
      playerY: 150,
      targetY: 150,
      lane: 1,
      speed: 4,
      obstacles: [
        { x: 500, lane: 0, width: 30, type: 'vacancy' },
        { x: 750, lane: 1, width: 45, type: 'cluster' },
        { x: 1000, lane: 2, width: 30, type: 'vacancy' },
        { x: 1300, lane: 1, width: 30, type: 'phonon' },
        { x: 1600, lane: 0, width: 45, type: 'cluster' },
        { x: 1850, lane: 2, width: 45, type: 'cluster' },
      ],
      tunneling: false,
      coherence: 100,
      distanceRun: 0,
      totalConductance: 100,
      animId: 0,
    };
    setDistance(0);
    setConductance(100);
    setCoherenceGauge(100);
    setIsGameOver(false);
    setWon(false);
    setIsPlaying(true);
    soundFx.playWhoosh();
  };

  const setIsGameOver = (val: boolean) => setGameOver(val);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleLaneChange(-1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleLaneChange(1);
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTunnel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAnimId = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background lattice grid
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.lineWidth = 1;
      const offset = (gameState.current.distanceRun * 2) % 40;

      for (let x = -offset; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw the 3 atomic highway conduits
      lanePositions.forEach((y, i) => {
        ctx.strokeStyle = i === gameState.current.lane ? 'rgba(34, 211, 238, 0.45)' : 'rgba(51, 65, 85, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      if (isPlaying) {
        gameState.current.distanceRun += gameState.current.speed * 0.2;
        setDistance(Math.floor(gameState.current.distanceRun));

        // Smooth lane interpolation
        gameState.current.playerY += (gameState.current.targetY - gameState.current.playerY) * 0.2;

        // Drain coherence if tunneling
        if (gameState.current.tunneling) {
          gameState.current.coherence = Math.max(0, gameState.current.coherence - 0.7);
          setCoherenceGauge(Math.floor(gameState.current.coherence));
        } else {
          // Slowly recharge
          gameState.current.coherence = Math.min(100, gameState.current.coherence + 0.15);
          setCoherenceGauge(Math.floor(gameState.current.coherence));
        }

        // Spawn / Move obstacles
        gameState.current.obstacles.forEach((obs) => {
          obs.x -= gameState.current.speed;

          // Draw obstacle
          const obsY = lanePositions[obs.lane];
          if (obs.type === 'phonon') {
            // Energy booster
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(obs.x, obsY, 10, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px monospace';
            ctx.fillText('+ħω', obs.x - 9, obsY + 3);
          } else {
            // Defect / vacancy
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 15;
            ctx.beginPath();
            ctx.roundRect(obs.x - obs.width / 2, obsY - 14, obs.width, 28, 6);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.fillStyle = '#fee2e2';
            ctx.font = 'bold 10px monospace';
            ctx.fillText('DEFECT', obs.x - 20, obsY + 3);
          }

          // Collision detection with player
          const playerX = 90;
          const dist = Math.abs(obs.x - playerX);
          if (dist < 26 && gameState.current.lane === obs.lane) {
            if (obs.type === 'phonon') {
              // Collected coherent boost
              obs.x = -100;
              gameState.current.coherence = Math.min(100, gameState.current.coherence + 30);
              soundFx.playTriumph();
            } else if (!gameState.current.tunneling) {
              // Elastic backscattering crash!
              obs.x = -100;
              gameState.current.totalConductance = Math.max(10, gameState.current.totalConductance - 28);
              setConductance(gameState.current.totalConductance);
              soundFx.playScatter();

              if (gameState.current.totalConductance <= 20) {
                // Game over
                setIsPlaying(false);
                setIsGameOver(true);
              }
            }
          }
        });

        // Remove offscreen & re-spawn
        gameState.current.obstacles = gameState.current.obstacles.filter((obs) => obs.x > -50);
        if (gameState.current.obstacles.length < 5) {
          const randomLane = Math.floor(Math.random() * 3);
          const isPhonon = Math.random() < 0.25;
          gameState.current.obstacles.push({
            x: canvas.width + Math.random() * 200 + 100,
            lane: randomLane,
            width: Math.random() > 0.5 ? 45 : 30,
            type: isPhonon ? 'phonon' : 'vacancy',
          });
        }

        // Win condition: 500 Angstroms
        if (gameState.current.distanceRun >= 500) {
          setIsPlaying(false);
          setWon(true);
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          soundFx.playTriumph();
        }
      }

      // Draw Player: "Spin the Electron"
      const pX = 90;
      const pY = gameState.current.playerY;

      // Trailing wave speed lines
      ctx.strokeStyle = gameState.current.tunneling ? '#fbbf24' : '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pX - 40, pY);
      ctx.lineTo(pX - 12, pY);
      ctx.stroke();

      // Electron core
      ctx.shadowColor = gameState.current.tunneling ? '#f59e0b' : '#06b6d4';
      ctx.shadowBlur = gameState.current.tunneling ? 25 : 15;
      ctx.fillStyle = gameState.current.tunneling ? '#fde047' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(pX, pY, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbital ring
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(pX, pY, 20, 8, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      // Text label
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('e⁻', pX - 6, pY + 4);

      localAnimId = requestAnimationFrame(render);
    };

    localAnimId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(localAnimId);
    };
  }, [isPlaying]);

  return (
    <div className="flex flex-col gap-4">
      {/* Simulation Telemetry Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-0.5">Ballistic Distance</span>
          <span className="text-lg font-mono font-bold text-white tabular-nums">
            {distance} <span className="text-xs text-slate-500 font-normal">Å (Goal: 500)</span>
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-0.5">Landauer Conductance</span>
          <span className={`text-lg font-mono font-bold tabular-nums ${
            conductance > 60 ? 'text-emerald-400' : conductance > 30 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {(conductance * 0.01 * 2).toFixed(2)} <span className="text-xs font-normal">e²/h</span>
          </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[11px] text-slate-400 block mb-0.5">Coherence Gauge</span>
          <div className="w-full bg-slate-800 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className={`h-full transition-all ${
                coherenceGauge > 30 ? 'bg-cyan-400' : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${coherenceGauge}%` }}
            />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block">Status</span>
            <span className="text-xs font-mono font-bold text-cyan-300">
              {won ? 'COHERENCE ACHIEVED' : gameOver ? 'LOCALIZATION CRASH' : isTunneling ? 'TUNNELING ACTIVE' : isPlaying ? 'BALLISTIC RUN' : 'STANDBY'}
            </span>
          </div>
          <button
            onClick={isPlaying ? () => setIsPlaying(false) : startGame}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause' : won || gameOver ? 'Play Again' : 'Start Run'}
          </button>
        </div>
      </div>

      {/* 2D Canvas Simulator Frame */}
      <div className="relative w-full h-[300px] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-900/40">
        <canvas ref={canvasRef} width={800} height={300} className="w-full h-full block" />

        {/* Start / Overlay Screen */}
        {!isPlaying && !won && !gameOver && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Ballistic Wave-Packet Obstacle Run
            </h3>
            <p className="text-slate-400 text-xs md:text-sm max-w-md mb-6 leading-relaxed">
              Steer Spin the Electron across atomic hexagonal lanes to dodge vacancy clusters. Activate <strong className="text-amber-400">Quantum Phase Tunneling</strong> to phase straight through barriers without scattering!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Zap className="w-4 h-4" />
              Engage Fermi Drive (Space/Up/Down)
            </button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-red-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <AlertTriangle className="w-10 h-10 text-red-400 mb-2 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-1">Decoherence & Localization</h3>
            <p className="text-red-200 text-xs max-w-md mb-5">
              Elastic backscattering depleted the electron's quantum coherence. The wavefunction collapsed into a localized bound state.
            </p>
            <button
              onClick={startGame}
              className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Recalibrate Wavefunction & Retry
            </button>
          </div>
        )}

        {/* Win Screen */}
        {won && (
          <div className="absolute inset-0 bg-emerald-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <Trophy className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-1">Ballistic Superhighway Restored!</h3>
            <p className="text-emerald-200 text-xs max-w-md mb-5">
              Spin maintained ballistic transport across 500 Å with pristine conductance G ≈ 2e²/h! Unitary transmission verified.
            </p>
            <button
              onClick={startGame}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              Run Another Quantum Channel
            </button>
          </div>
        )}
      </div>

      {/* Control Instruction Affordances */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="font-mono text-cyan-400 font-semibold">Controls:</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">W</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">▲</kbd> Lane Up</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">S</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300">▼</kbd> Lane Down</span>
          <span><kbd className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-amber-300 font-mono">SPACE</kbd> Quantum Tunnel</span>
        </div>

        {/* Touch/Mouse Quick Buttons for Mobile */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLaneChange(-1)}
            disabled={!isPlaying}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono disabled:opacity-50"
          >
            ▲ Up
          </button>
          <button
            onClick={() => handleLaneChange(1)}
            disabled={!isPlaying}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono disabled:opacity-50"
          >
            ▼ Down
          </button>
          <button
            onClick={handleTunnel}
            disabled={!isPlaying || coherenceGauge < 25}
            className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded font-mono font-semibold disabled:opacity-40"
          >
            ⚡ Tunnel
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   CHALLENGE 2: CVD FURNACE RECALIBRATION (MATERIALS SCIENCE ANNEALER)
   ========================================================================= */

const FurnaceRecalibrationPuzzle: React.FC = () => {
  const [temp, setTemp] = useState<number>(850); // Celsius
  const [rampRate, setRampRate] = useState<number>(35); // C / min
  const [ch4Ratio, setCh4Ratio] = useState<number>(0.5); // CH4 : H2
  const [dwellTime, setDwellTime] = useState<number>(15); // min
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [growthComplete, setGrowthComplete] = useState<boolean>(false);

  // Calculate Materials Science Metrics based on physical models:
  // Ideal CVD conditions for defect-free SWCNTs:
  // Temp: 980-1050 C, RampRate: 15-25 C/min, CH4 ratio: 0.2 - 0.4 (high H2 suppresses amorphous carbon)
  const tempDeviation = Math.abs(temp - 1000) / 1000;
  const rampDeviation = Math.abs(rampRate - 20) / 40;
  const gasDeviation = Math.abs(ch4Ratio - 0.3) / 1.5;

  // Raman I_D / I_G Defect Metric (Ideal < 0.08)
  const id_ig = Math.max(0.03, (0.04 + tempDeviation * 0.45 + rampDeviation * 0.35 + gasDeviation * 0.5)).toFixed(3);
  
  // Carrier Mobility mu (Ideal > 100,000 cm^2/V s)
  const mobility = Math.max(1200, Math.floor(180000 / (1 + parseFloat(id_ig) * 15)));

  // Defect Density per um^2
  const defectDensity = Math.max(2, Math.floor(parseFloat(id_ig) * 120));

  // Conductance %
  const conductancePercent = Math.max(8, Math.min(100, Math.floor(100 - parseFloat(id_ig) * 90)));

  const handleTestGrowth = () => {
    setIsSimulating(true);
    setGrowthComplete(false);
    soundFx.playHum();

    setTimeout(() => {
      setIsSimulating(false);
      setGrowthComplete(true);
      if (parseFloat(id_ig) < 0.12) {
        soundFx.playTriumph();
        confetti({ particleCount: 70, spread: 60 });
      } else {
        soundFx.playScatter();
      }
    }, 1800);
  };

  const isOptimal = parseFloat(id_ig) < 0.12;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Column: Parameter Controls (6 Cols) */}
      <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Furnace Thermodynamic Controls
            </h3>
            <span className="font-mono text-xs text-slate-400">
              Arrhenius Annealing Model
            </span>
          </div>

          <div className="space-y-5">
            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Growth Temperature (T)</span>
                <span className="font-mono text-cyan-300 tabular-nums font-bold">{temp} °C</span>
              </div>
              <input
                type="range"
                min="700"
                max="1150"
                step="10"
                value={temp}
                onChange={(e) => {
                  setTemp(parseInt(e.target.value));
                  soundFx.playBlip(500 + (parseInt(e.target.value) - 700));
                }}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>700°C (Amorphous)</span>
                <span className="text-emerald-400">1000°C (Optimal)</span>
                <span>1150°C (Catalyst Ripening)</span>
              </div>
            </div>

            {/* Ramp Rate Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Thermal Ramp Rate (β)</span>
                <span className="font-mono text-cyan-300 tabular-nums font-bold">{rampRate} °C/min</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={rampRate}
                onChange={(e) => {
                  setRampRate(parseInt(e.target.value));
                  soundFx.playBlip(700);
                }}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>5°C/min (Slow)</span>
                <span className="text-emerald-400">20°C/min (Ideal)</span>
                <span>60°C/min (Thermal Shock)</span>
              </div>
            </div>

            {/* Precursor Gas Flow Ratio */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Precursor Gas Ratio (CH₄ : H₂)</span>
                <span className="font-mono text-cyan-300 tabular-nums font-bold">{ch4Ratio.toFixed(2)} : 1</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.5"
                step="0.05"
                value={ch4Ratio}
                onChange={(e) => {
                  setCh4Ratio(parseFloat(e.target.value));
                  soundFx.playBlip(800);
                }}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>0.1 (H₂ rich / etching)</span>
                <span className="text-emerald-400">0.3 (Stoichiometric)</span>
                <span>1.5 (Soot / Vacancy trap)</span>
              </div>
            </div>

            {/* Dwell Time */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-medium">Annealing Dwell Time (t)</span>
                <span className="font-mono text-cyan-300 tabular-nums font-bold">{dwellTime} min</span>
              </div>
              <input
                type="range"
                min="5"
                max="45"
                step="5"
                value={dwellTime}
                onChange={(e) => {
                  setDwellTime(parseInt(e.target.value));
                  soundFx.playBlip(850);
                }}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleTestGrowth}
          disabled={isSimulating}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {isSimulating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Simulating Quartz Chamber Annealing (t = 30m)...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              <span>Execute CVD Growth & Raman Spectroscopy</span>
            </>
          )}
        </button>
      </div>

      {/* Right Column: Physical Spectrometry & Crystal Healing Visualizer (6 Cols) */}
      <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Synthesized Crystal Quality Metrics
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
              isOptimal ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}>
              {isOptimal ? 'PRISTINE CRYSTAL' : 'DEFECTIVE LATTICE'}
            </span>
          </div>

          {/* Real-time Spectrometry Card */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Raman Defect Peak (I_D / I_G)</span>
              <span className={`text-xl font-mono font-bold tabular-nums ${
                parseFloat(id_ig) < 0.12 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {id_ig}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Benchmark: &lt; 0.08</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Ballistic Mobility (µ)</span>
              <span className="text-xl font-mono font-bold text-cyan-300 tabular-nums">
                {mobility.toLocaleString()} <span className="text-xs text-slate-500 font-normal">cm²/Vs</span>
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Benchmark: &gt; 100,000</span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Vacancy Defect Density</span>
              <span className="text-lg font-mono font-bold text-amber-300 tabular-nums">
                {defectDensity} <span className="text-xs text-slate-500 font-normal">vacancies/µm²</span>
              </span>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">Quantum Conductance G</span>
              <span className={`text-lg font-mono font-bold tabular-nums ${
                conductancePercent > 75 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {conductancePercent}% <span className="text-xs font-normal">of 2e²/h</span>
              </span>
            </div>
          </div>

          {/* Microscopic Crystal Healing Preview (Hexagonal Rings Lattice) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-400 block mb-2">
              Lattice Topography (Direct STEM Preview):
            </span>
            <div className="h-28 flex items-center justify-center relative overflow-hidden rounded-lg bg-slate-900 border border-slate-800">
              <div className="grid grid-cols-8 gap-2 p-2 w-full justify-items-center">
                {Array.from({ length: 24 }).map((_, i) => {
                  const isBroken = !isOptimal && (i === 10 || i === 11 || i === 18);
                  return (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-md transition-all duration-700 flex items-center justify-center text-[10px] font-mono ${
                        isBroken
                          ? 'bg-red-500/30 border border-red-500 text-red-300 animate-pulse shadow-[0_0_10px_#ef4444]'
                          : 'bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      }`}
                    >
                      {isBroken ? '!' : 'C'}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
          isOptimal
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
            : 'bg-slate-950 border-slate-800 text-slate-400'
        }`}>
          {isOptimal ? (
            <p>
              🎉 <strong>Thermodynamic Equilibrium Attained!</strong> Low ramp rate prevented thermal shock, and stoichiometric hydrogen etched amorphous clusters. Vacancy self-healing completed!
            </p>
          ) : (
            <p>
              ⚠️ <strong>Defect Concentration High:</strong> Tune temperature closer to 1000°C and set ramp rate around 20°C/min to activate vacancy migration and bond relaxation.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   CHALLENGE 3: DIRAC CONE & BAND DISPERSION EXPLORER
   ========================================================================= */

const BandStructureExplorer: React.FC = () => {
  const [defectState, setDefectState] = useState<'pristine' | 'vacancy'>('vacancy');
  const [fermiLevel, setFermiLevel] = useState<number>(0.15); // eV (-1.0 to +1.0)
  const [carrierType, setCarrierType] = useState<'electrons' | 'holes'>('electrons');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const midX = canvas.width / 2;
    const midY = canvas.height / 2;

    // Coordinate axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    // k-axis
    ctx.beginPath();
    ctx.moveTo(30, midY);
    ctx.lineTo(canvas.width - 30, midY);
    ctx.stroke();

    // Energy E-axis
    ctx.beginPath();
    ctx.moveTo(midX, 20);
    ctx.lineTo(midX, canvas.height - 20);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('k (Wavevector)', canvas.width - 95, midY - 8);
    ctx.fillText('Energy E (eV)', midX + 8, 30);
    ctx.fillText('Dirac Point K', midX - 35, midY + 16);

    // Draw Pristine Dirac Cone Bands (Linear E = ± ħ v_F |k|)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;

    // Upper Conduction Band
    ctx.beginPath();
    ctx.moveTo(midX - 140, midY - 110);
    ctx.lineTo(midX, midY);
    ctx.lineTo(midX + 140, midY - 110);
    ctx.stroke();

    // Lower Valence Band
    ctx.beginPath();
    ctx.moveTo(midX - 140, midY + 110);
    ctx.lineTo(midX, midY);
    ctx.lineTo(midX + 140, midY + 110);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // If defect state active: draw mid-gap bound states / bandgap opening
    if (defectState === 'vacancy') {
      // Localized trap flat band in the middle
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(midX - 70, midY - 18);
      ctx.lineTo(midX + 70, midY - 18);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('Mid-Gap Vacancy Trap State', midX + 80, midY - 15);
    }

    // Draw Fermi Level EF
    const fermiY = midY - fermiLevel * 80;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(40, fermiY);
    ctx.lineTo(canvas.width - 40, fermiY);
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`E_F = ${fermiLevel > 0 ? '+' : ''}${fermiLevel.toFixed(2)} eV`, 45, fermiY - 6);
  }, [defectState, fermiLevel]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left: Interactive Canvas (7 Cols) */}
      <div className="lg:col-span-7 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-cyan-400">
            DISPERSION RELATION E(k) // DIRAC CONE
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setDefectState('pristine');
                soundFx.playBlip(900);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                defectState === 'pristine'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Pristine Cone
            </button>
            <button
              onClick={() => {
                setDefectState('vacancy');
                soundFx.playBlip(700);
              }}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                defectState === 'vacancy'
                  ? 'bg-red-500 text-white font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              Vacancy Trap Cone
            </button>
          </div>
        </div>

        <canvas ref={canvasRef} width={640} height={320} className="w-full h-[280px] block rounded-xl bg-slate-900/60 border border-slate-800" />

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Electrostatic Gate Voltage (Fermi Tuning E_F)</span>
              <span className="font-mono text-amber-300 font-bold">{fermiLevel.toFixed(2)} eV</span>
            </div>
            <input
              type="range"
              min="-0.8"
              max="0.8"
              step="0.05"
              value={fermiLevel}
              onChange={(e) => setFermiLevel(parseFloat(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Right: Quantum Physics Rigor (5 Cols) */}
      <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            Electronic Bandgap Analysis
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed mb-4">
            In an ideal carbon lattice or topological insulator, conduction and valence bands meet linearly at the Dirac point with massless dispersion: <span className="font-mono text-cyan-300">E = ± ħ v_F |k|</span>.
          </p>

          <div className="space-y-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Carrier Density (n)</span>
              <span className="font-mono text-sm text-cyan-300 font-bold">
                {(Math.pow(Math.abs(fermiLevel), 2) * 3.4).toFixed(2)} × 10¹² cm⁻²
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">Defect State Impact</span>
              <span className={`text-xs font-semibold block ${
                defectState === 'vacancy' ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {defectState === 'vacancy'
                  ? 'Mid-gap resonance traps charge, causing high backscattering'
                  : 'Zero gap, perfect linear crossing, ballistic transmission'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-cyan-900/30 text-xs font-mono text-slate-400">
          Governing Relation: <span className="text-cyan-300">v_F = 1/ħ · ∂E/∂k ≈ 10⁶ m/s</span>
        </div>
      </div>
    </div>
  );
};
