import React, { useState } from 'react';
import {
  TemplateModel,
  ViewportId,
  ElementType
} from '../../types/template';
import {
  Layers,
  Search,
  CheckSquare,
  Square,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  MousePointerClick,
} from 'lucide-react';

interface SidebarProps {
  template: TemplateModel;
  selectedIds: string[];
  activeViewport: ViewportId;
  onSelectElement: (id: string, isAdditive: boolean) => void;
  onSelectMultiple: (ids: string[], isAdditive: boolean) => void;
  onClearSelection: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  template,
  selectedIds,
  activeViewport,
  onSelectElement,
  onSelectMultiple,
  onClearSelection,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const elementsList = Object.values(template.elements);

  const filteredElements = elementsList.filter(el =>
    el.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    el.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allFilteredIds = filteredElements.map(el => el.id);
  const isAllSelected = allFilteredIds.length > 0 && allFilteredIds.every(id => selectedIds.includes(id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      onClearSelection();
    } else {
      onSelectMultiple(allFilteredIds, false);
    }
  };

  const getElementIcon = (type: ElementType) => {
    switch (type) {
      case 'hero': return '👑';
      case 'navbar': return '🧭';
      case 'card': return '🃏';
      case 'grid': return '▦';
      case 'button': return '🔘';
      case 'testimonial': return '💬';
      case 'footer': return '⚓';
      default: return '📦';
    }
  };

  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-full select-none shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>ELEMENT HIERARCHY</span>
        </div>
        <div className="text-[11px] text-amber-400 font-mono bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded-full">
          {selectedIds.length} Selected
        </div>
      </div>

      {/* Search & Batch Actions */}
      <div className="p-2.5 space-y-2 border-b border-slate-800/60 bg-slate-950/40">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter elements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
          <button
            onClick={handleToggleSelectAll}
            className="flex items-center gap-1 hover:text-amber-400 transition"
          >
            {isAllSelected ? <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> : <Square className="w-3.5 h-3.5" />}
            <span>{isAllSelected ? 'Deselect All' : 'Select All'}</span>
          </button>
          {selectedIds.length > 0 && (
            <button
              onClick={onClearSelection}
              className="text-slate-400 hover:text-red-400 transition underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Tree list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredElements.map((el) => {
          const isSelected = selectedIds.includes(el.id);
          const hasDesktopOverride = Boolean(el.overrides.desktop && Object.keys(el.overrides.desktop).length > 0);
          const hasTabletOverride = Boolean(el.overrides.tablet && Object.keys(el.overrides.tablet).length > 0);
          const hasMobileOverride = Boolean(el.overrides.mobile && Object.keys(el.overrides.mobile).length > 0);

          return (
            <div
              key={el.id}
              onClick={(e) => onSelectElement(el.id, e.shiftKey || e.ctrlKey || e.metaKey)}
              className={`group flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer border transition-all ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-500/50 text-amber-200 font-medium'
                  : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span className="text-sm shrink-0">{getElementIcon(el.type)}</span>
                <div className="truncate">
                  <div className="truncate text-slate-200 group-hover:text-amber-300 transition">
                    {el.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    #{el.id} • Rev {el.revision}
                  </div>
                </div>
              </div>

              {/* Viewport override badges */}
              <div className="flex items-center gap-1 shrink-0">
                {hasDesktopOverride && (
                  <span title="Has Desktop Override" className="text-[9px] bg-sky-950 text-sky-400 border border-sky-800/60 px-1 rounded">
                    D
                  </span>
                )}
                {hasTabletOverride && (
                  <span title="Has Tablet Override" className="text-[9px] bg-purple-950 text-purple-400 border border-purple-800/60 px-1 rounded">
                    T
                  </span>
                )}
                {hasMobileOverride && (
                  <span title="Has Mobile Override" className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 px-1 rounded">
                    M
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selection shortcut helper footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1 text-slate-300 font-semibold">
          <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
          <span>Selection Authority</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          Hold <kbd className="bg-slate-800 px-1 py-0.5 rounded text-amber-300 border border-slate-700">Shift</kbd> or drag canvas marquee to multi-select. AI edits strictly target selected IDs.
        </p>
      </div>
    </aside>
  );
};
