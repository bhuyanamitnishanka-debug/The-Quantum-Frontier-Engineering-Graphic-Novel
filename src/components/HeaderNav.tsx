import React, { useState } from 'react';
import { soundFx } from '../services/soundFx';
import { Volume2, VolumeX, Sparkles, BookOpen, Layers } from 'lucide-react';

interface HeaderNavProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ activeSection, onNavigate }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(!soundFx.isMuted);

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setSoundEnabled(!muted);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#novel"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('novel');
          }}
          className="text-lg md:text-xl font-extrabold tracking-tight text-white flex items-center gap-2 group cursor-pointer"
        >
          <span className="text-cyan-400 group-hover:text-cyan-300 transition-colors">The Quantum</span>
          <span className="text-slate-100">Frontier</span>
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button
            onClick={() => onNavigate('novel')}
            className={`transition-colors cursor-pointer hover:text-white ${
              activeSection === 'novel' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Graphic Novel
          </button>
          <button
            onClick={() => onNavigate('3d-lattice')}
            className={`transition-colors cursor-pointer hover:text-white ${
              activeSection === '3d-lattice' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            3D Lattice Rig
          </button>
          <button
            onClick={() => onNavigate('challenges')}
            className={`transition-colors cursor-pointer hover:text-white ${
              activeSection === 'challenges' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Physics Challenges
          </button>
          <button
            onClick={() => onNavigate('extractor')}
            className={`transition-colors cursor-pointer hover:text-white ${
              activeSection === 'extractor' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Data Extractor
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-slate-900 border-cyan-500/40 text-cyan-400 hover:bg-slate-800'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onNavigate('challenges')}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-sm shadow-cyan-400/20"
          >
            Play Challenges
          </button>
        </div>
      </div>
    </header>
  );
};
