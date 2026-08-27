import React from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  History,
  RotateCcw,
  Code2,
  Layout,
  Columns,
  Layers,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { ViewportId, ResponsiveScope } from '../../types/template';
import { ViewMode } from '../../store/useEditorStore';

interface TopNavProps {
  activeViewport: ViewportId;
  setActiveViewport: (vp: ViewportId) => void;
  activeScope: ResponsiveScope;
  setActiveScope: (scope: ResponsiveScope) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedCount: number;
  openAiModal: () => void;
  openRecoveryModal: () => void;
  openProposalDrawer: () => void;
  hasActiveProposals: boolean;
  pendingProposalCount: number;
  onReset: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeViewport,
  setActiveViewport,
  activeScope,
  setActiveScope,
  viewMode,
  setViewMode,
  selectedCount,
  openAiModal,
  openRecoveryModal,
  openProposalDrawer,
  hasActiveProposals,
  pendingProposalCount,
  onReset,
}) => {
  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold px-2.5 py-1 rounded-md text-xs shadow-sm">
          <span className="text-sm">✦</span>
          <span>SCOPED AI</span>
        </div>
        <div className="hidden md:flex flex-col">
          <span className="text-xs font-semibold text-slate-200">Lumina Template Editor</span>
          <span className="text-[10px] text-slate-400">JASTRO Technical Assessment</span>
        </div>
      </div>

      {/* Center: Viewport Controls & Responsive Scope Selector */}
      <div className="flex items-center gap-4">
        {/* Device Viewport Selector */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveViewport('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-medium transition-all ${
              activeViewport === 'desktop'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Desktop Viewport (~1440px)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desktop</span>
            <span className="text-[10px] opacity-75">1440px</span>
          </button>

          <button
            onClick={() => setActiveViewport('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-medium transition-all ${
              activeViewport === 'tablet'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Tablet Viewport (~768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
            <span className="text-[10px] opacity-75">768px</span>
          </button>

          <button
            onClick={() => setActiveViewport('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md font-medium transition-all ${
              activeViewport === 'mobile'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
            title="Mobile Viewport (~375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mobile</span>
            <span className="text-[10px] opacity-75">375px</span>
          </button>
        </div>

        {/* Responsive Scope Selector */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-400" />
            Target Scope:
          </span>
          <select
            value={activeScope}
            onChange={(e) => setActiveScope(e.target.value as ResponsiveScope)}
            className="bg-slate-900 text-slate-200 text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none focus:border-amber-500 font-medium cursor-pointer"
          >
            <option value="base">🌐 All Views (Shared Base)</option>
            <option value="desktop">🖥️ Desktop Only Override</option>
            <option value="tablet">📱 Tablet Only Override</option>
            <option value="mobile">📲 Mobile Only Override</option>
          </select>
        </div>
      </div>

      {/* Right Controls: AI Demo, Code/Canvas, History, Reset */}
      <div className="flex items-center gap-2">
        {/* Proposal Staging Drawer button if proposals active */}
        {hasActiveProposals && (
          <button
            onClick={openProposalDrawer}
            className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 px-2.5 py-1.5 rounded-lg text-xs font-semibold animate-pulse transition"
            title="Review AI Proposals"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Review AI ({pendingProposalCount})</span>
          </button>
        )}

        {/* Deterministic AI Button */}
        <button
          onClick={openAiModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-glow transition active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Scoped Edit</span>
          {selectedCount > 0 && (
            <span className="bg-slate-950 text-amber-400 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {selectedCount}
            </span>
          )}
        </button>

        {/* View Surface Switcher */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewMode('canvas')}
            className={`p-1.5 rounded text-xs transition ${
              viewMode === 'canvas' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Visual Canvas Surface"
          >
            <Layout className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`p-1.5 rounded text-xs transition ${
              viewMode === 'split' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split Canvas + Code"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`p-1.5 rounded text-xs transition ${
              viewMode === 'code' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Code Surface"
          >
            <Code2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recovery & History Button */}
        <button
          onClick={openRecoveryModal}
          className="flex items-center gap-1 text-slate-300 hover:text-amber-400 bg-slate-950 hover:bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-xs transition"
          title="Element-Level Recovery & History"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">History</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="text-slate-400 hover:text-red-400 bg-slate-950 hover:bg-slate-900 border border-slate-800 p-1.5 rounded-lg text-xs transition"
          title="Reset to Factory Template"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
