import React, { useState } from 'react';
import {
  TemplateModel,
  ResponsiveScope,
  ViewportId
} from '../../types/template';
import { PREDEFINED_SCENARIOS, PredefinedScenario } from '../../core/aiEngine';
import {
  Sparkles,
  X,
  Send,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Layers,
  HelpCircle
} from 'lucide-react';

interface AiDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  template: TemplateModel;
  activeScope: ResponsiveScope;
  onRequestProposal: (instruction: string, forcedScope?: ResponsiveScope) => void;
}

export const AiDemoModal: React.FC<AiDemoModalProps> = ({
  isOpen,
  onClose,
  selectedIds,
  template,
  activeScope,
  onRequestProposal,
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedScope, setSelectedScope] = useState<ResponsiveScope>(activeScope);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const handleRunScenario = (scenario: PredefinedScenario) => {
    setCustomPrompt(scenario.promptExample);
    setSelectedScope(scenario.recommendedScope);
    onRequestProposal(scenario.promptExample, scenario.recommendedScope);
    onClose();
  };

  const handleRunCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    onRequestProposal(customPrompt, selectedScope);
    onClose();
  };

  const filteredScenarios = activeCategory === 'all'
    ? PREDEFINED_SCENARIOS
    : PREDEFINED_SCENARIOS.filter(s => s.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Deterministic Scoped AI Demo
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-normal">
                  Selection Authority Enforced
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                AI outputs proposals strictly confined to the currently selected elements & scope.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selection Authority Context Bar */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Selected Targets ({selectedIds.length}):</span>
            <div className="flex flex-wrap gap-1">
              {selectedIds.length > 0 ? (
                selectedIds.slice(0, 3).map(id => (
                  <span key={id} className="bg-amber-950/70 text-amber-300 border border-amber-800/40 text-[10px] px-1.5 py-0.2 rounded font-mono">
                    {template.elements[id]?.name || id}
                  </span>
                ))
              ) : (
                <span className="text-red-400 text-[11px] font-semibold">⚠️ No elements selected! Please select on canvas.</span>
              )}
              {selectedIds.length > 3 && (
                <span className="text-slate-500 text-[10px]">+{selectedIds.length - 3} more</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" />
              Scope:
            </span>
            <select
              value={selectedScope}
              onChange={(e) => setSelectedScope(e.target.value as ResponsiveScope)}
              className="bg-slate-900 text-amber-300 text-xs border border-slate-700 rounded px-2 py-0.5 focus:outline-none"
            >
              <option value="base">🌐 Base (All Views)</option>
              <option value="desktop">🖥️ Desktop Only</option>
              <option value="tablet">📱 Tablet Only</option>
              <option value="mobile">📲 Mobile Only</option>
            </select>
          </div>
        </div>

        {/* Modal Body / Predefined Scenarios */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {/* Category Tabs */}
          <div className="flex gap-1 border-b border-slate-800/80 pb-2 text-[11px]">
            {[
              { id: 'all', label: 'All Scenarios' },
              { id: 'content', label: '1. Content Rewrite' },
              { id: 'style', label: '2. Style & Theme' },
              { id: 'layout', label: '3. Layout & Reorder' },
              { id: 'responsive', label: '4. Responsive (Mobile)' },
              { id: 'multi', label: '5. Multi-Element' },
              { id: 'failure', label: '6. Safe Failure Checks' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-2.5 py-1 rounded-md transition ${
                  activeCategory === tab.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scenario Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {filteredScenarios.map(sc => (
              <div
                key={sc.id}
                onClick={() => handleRunScenario(sc)}
                className={`p-3 rounded-xl border text-left cursor-pointer transition hover:scale-[1.01] ${
                  sc.isFailureDemo
                    ? 'bg-red-950/20 border-red-900/50 hover:bg-red-950/40 hover:border-red-600'
                    : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800 hover:border-amber-500/60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${sc.isFailureDemo ? 'text-red-300' : 'text-amber-300'}`}>
                    {sc.label}
                  </span>
                  <span className="text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800 font-mono uppercase">
                    {sc.recommendedScope}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mb-2">
                  {sc.description}
                </p>
                <div className="text-[10px] text-slate-500 font-mono bg-slate-900/80 p-1.5 rounded border border-slate-800/50 truncate">
                  "{sc.promptExample}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Prompt Input Form */}
        <form onSubmit={handleRunCustom} className="p-4 border-t border-slate-800 bg-slate-950 flex gap-2">
          <input
            type="text"
            placeholder="Or type a custom instruction (e.g. 'Make headline punchy', 'Apply dark emerald luxury theme')..."
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={!customPrompt.trim()}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Generate</span>
          </button>
        </form>
      </div>
    </div>
  );
};
