import React, { useState } from 'react';
import {
  TemplateModel,
  HistoryEntry,
  ResponsiveScope
} from '../../types/template';
import { getElementHistory } from '../../core/historyEngine';
import {
  History,
  RotateCcw,
  X,
  Clock,
  Sparkles,
  Edit3,
  CheckCircle2,
  Filter,
  Layers
} from 'lucide-react';

interface ElementRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: TemplateModel;
  historyJournal: HistoryEntry[];
  selectedIds: string[];
  onRestore: (elementId: string, entry: HistoryEntry, scope: ResponsiveScope) => void;
}

export const ElementRecoveryModal: React.FC<ElementRecoveryModalProps> = ({
  isOpen,
  onClose,
  template,
  historyJournal,
  selectedIds,
  onRestore,
}) => {
  const [filterElementId, setFilterElementId] = useState<string>(selectedIds[0] || 'all');
  const [filterScope, setFilterScope] = useState<ResponsiveScope>('base');

  if (!isOpen) return null;

  const allElements = Object.values(template.elements);

  const filteredEntries = historyJournal.filter((entry) => {
    const matchEl = filterElementId === 'all' || entry.elementId === filterElementId;
    return matchEl;
  });

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'ai-demo':
        return (
          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
            <Sparkles className="w-3 h-3" /> AI Proposal Accepted
          </span>
        );
      case 'canvas':
        return (
          <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded flex items-center gap-1">
            <Edit3 className="w-3 h-3" /> Manual Canvas Edit
          </span>
        );
      case 'code':
        return (
          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded flex items-center gap-1">
            💻 Code JSON Edit
          </span>
        );
      case 'history-restore':
        return (
          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
            <RotateCcw className="w-3 h-3" /> Prior State Restored
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden select-none">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Granular Element History & Recovery
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-normal">
                  Isolated Rollback
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Restore any prior revision for one element and one viewport scope without rolling back unrelated elements or views.
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

        {/* Filters Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-400 font-medium">Filter by Element:</span>
            <select
              value={filterElementId}
              onChange={(e) => setFilterElementId(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Elements ({allElements.length})</option>
              {allElements.map(el => (
                <option key={el.id} value={el.id}>
                  {el.name} (#{el.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Restore Target Scope:
            </span>
            <select
              value={filterScope}
              onChange={(e) => setFilterScope(e.target.value as ResponsiveScope)}
              className="bg-slate-900 text-amber-300 text-xs border border-slate-700 rounded px-2 py-1 font-medium focus:outline-none"
            >
              <option value="base">🌐 Base (Universal)</option>
              <option value="desktop">🖥️ Desktop Only</option>
              <option value="tablet">📱 Tablet Only</option>
              <option value="mobile">📲 Mobile Only</option>
            </select>
          </div>
        </div>

        {/* Timeline Entries List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-700" />
              <p className="text-xs">No recorded revision history yet for this filter.</p>
              <p className="text-[11px] text-slate-600">
                Make manual edits, run AI proposals, or adjust properties to generate history checkpoints.
              </p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const targetEl = template.elements[entry.elementId];
              return (
                <div
                  key={entry.id}
                  className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">
                        {targetEl?.name || entry.elementId}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        #{entry.elementId}
                      </span>
                      {getSourceBadge(entry.source)}
                      <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800 font-mono">
                        Scope: {entry.scope}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      {entry.description}
                    </p>

                    <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      <span>• Rev {entry.revision}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRestore(entry.elementId, entry, filterScope)}
                    className="shrink-0 flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm active:scale-95"
                    title={`Restore this element's snapshot to scope: ${filterScope}`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restore Element</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Total history journal entries: {historyJournal.length}</span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-lg text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
