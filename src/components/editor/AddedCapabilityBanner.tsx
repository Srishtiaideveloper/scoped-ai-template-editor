import React, { useState } from 'react';
import { TemplateModel, ViewportId } from '../../types/template';
import { ArrowUpRight, Sparkles, Layers, CheckCircle2, ChevronDown, ChevronUp, Eye } from 'lucide-react';

interface AddedCapabilityBannerProps {
  template: TemplateModel;
  selectedIds: string[];
  activeViewport: ViewportId;
  onPromoteOverrideToBase: (elementId: string, viewport: ViewportId) => void;
}

export const AddedCapabilityBanner: React.FC<AddedCapabilityBannerProps> = ({
  template,
  selectedIds,
  activeViewport,
  onPromoteOverrideToBase,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedEl = selectedIds.length === 1 ? template.elements[selectedIds[0]] : null;
  const hasCurrentOverride = selectedEl && selectedEl.overrides[activeViewport] && (
    Object.keys(selectedEl.overrides[activeViewport]?.styles || {}).length > 0 ||
    Object.keys(selectedEl.overrides[activeViewport]?.content || {}).length > 0
  );

  return (
    <div className="bg-slate-900 border-t border-slate-800 text-xs text-slate-300">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition bg-slate-950/40"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-bold text-slate-200">
            Added Innovation Feature:
          </span>
          <span className="text-amber-400 font-semibold">
            Responsive Cascade & Override Promotion Engine
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700 font-mono">
            PRODUCT_NOTES.md
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] hidden sm:inline">
            {isOpen ? 'Collapse' : 'Expand Inspector'}
          </span>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 bg-slate-950/90 border-t border-slate-800/80 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                1. Safe Cascade Audit
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Base property edits automatically cascade across desktop, tablet, and mobile, unless a viewport override explicitly shadows it.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5" />
                2. One-Click Override Promotion
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Tested a great look on Mobile/Tablet? Promote that viewport override directly to become the new universal Base with 1 click.
              </p>
            </div>

            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
              <span className="text-amber-400 font-bold text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                3. Zero Unintended Side Effects
              </span>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Clear visual indicators prevent users from accidentally modifying single viewports when intending universal changes.
              </p>
            </div>
          </div>

          {selectedEl && hasCurrentOverride && (
            <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-3 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-amber-300">
                  Active Override on "{selectedEl.name}" ({activeViewport} view)
                </div>
                <div className="text-[11px] text-slate-400">
                  Would you like to promote this {activeViewport} override to become the new global Base for all screens?
                </div>
              </div>

              <button
                onClick={() => onPromoteOverrideToBase(selectedEl.id, activeViewport)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition shrink-0 shadow-sm"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>Promote to Global Base</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
