import React, { useState } from 'react';
import {
  TemplateModel,
  ViewportId,
  ResponsiveScope,
  ElementStyles,
  ElementContent
} from '../../types/template';
import { resolveElement, isPropertyOverridden } from '../../core/resolutionEngine';
import {
  Sliders,
  Type,
  Palette,
  Layout,
  Layers,
  ArrowUpRight,
  Trash2,
  CheckCircle,
  Copy,
} from 'lucide-react';

interface PropertyInspectorProps {
  template: TemplateModel;
  selectedIds: string[];
  activeViewport: ViewportId;
  activeScope: ResponsiveScope;
  setActiveScope: (scope: ResponsiveScope) => void;
  onCommitProperty: (elementId: string, kind: 'styles' | 'content', key: string, value: unknown, desc?: string) => void;
  onCommitBatch: (patches: Array<{ elementId: string; styles?: Partial<ElementStyles>; content?: Partial<ElementContent> }>, desc: string) => void;
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  template,
  selectedIds,
  activeViewport,
  activeScope,
  setActiveScope,
  onCommitProperty,
  onCommitBatch,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout' | 'overrides'>('content');

  if (selectedIds.length === 0) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 p-6 flex flex-col items-center justify-center text-center select-none text-slate-500 h-full">
        <Sliders className="w-8 h-8 mb-3 text-slate-600 animate-pulse" />
        <h3 className="text-sm font-bold text-slate-300 mb-1">No Element Selected</h3>
        <p className="text-xs text-slate-500">
          Click an element on the canvas or select from the left sidebar to inspect and edit its properties.
        </p>
      </aside>
    );
  }

  // If multiple elements selected, show batch editor
  if (selectedIds.length > 1) {
    return (
      <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none overflow-y-auto">
        <div className="p-3.5 border-b border-slate-800 bg-amber-950/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-400">BATCH PROPERTY EDIT</span>
            <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">
              {selectedIds.length} Items Selected
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Applying changes will update all {selectedIds.length} selected elements at scope:{' '}
            <strong className="text-amber-300">{activeScope}</strong>.
          </p>
        </div>

        <div className="p-4 space-y-5">
          {/* Quick theme actions */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Quick Uniform Background</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { bg: '#0b1120', name: 'Dark Navy' },
                { bg: '#06281e', name: 'Emerald' },
                { bg: '#1c1917', name: 'Warm Charcoal' },
                { bg: '#1e1b4b', name: 'Deep Indigo' },
              ].map(c => (
                <button
                  key={c.bg}
                  onClick={() => {
                    const patches = selectedIds.map(id => ({
                      elementId: id,
                      styles: { backgroundColor: c.bg },
                    }));
                    onCommitBatch(patches, `Batch set background to ${c.name} (${activeScope})`);
                  }}
                  style={{ backgroundColor: c.bg }}
                  className="h-8 rounded-lg border border-slate-700 hover:border-amber-400 transition"
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Uniform Border Radius</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['0px', '0.5rem', '1rem', '9999px'].map(r => (
                <button
                  key={r}
                  onClick={() => {
                    const patches = selectedIds.map(id => ({
                      elementId: id,
                      styles: { borderRadius: r },
                    }));
                    onCommitBatch(patches, `Batch set border radius to ${r}`);
                  }}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 py-1.5 rounded text-[11px] text-slate-300 font-mono transition"
                >
                  {r === '9999px' ? 'Pill' : r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Batch Text Alignment</label>
            <div className="grid grid-cols-3 gap-2">
              {(['left', 'center', 'right'] as const).map(align => (
                <button
                  key={align}
                  onClick={() => {
                    const patches = selectedIds.map(id => ({
                      elementId: id,
                      styles: { textAlign: align },
                    }));
                    onCommitBatch(patches, `Batch set alignment to ${align}`);
                  }}
                  className="bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500 py-1.5 rounded text-xs text-slate-300 capitalize transition"
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // Single element selected
  const primaryId = selectedIds[0];
  const element = template.elements[primaryId];
  if (!element) return null;

  const resolved = resolveElement(element, activeViewport, activeScope);

  const renderOverrideBadge = (kind: 'styles' | 'content', key: string) => {
    const isOverridden = isPropertyOverridden(element, activeViewport, kind, key);
    if (isOverridden) {
      return (
        <span className="text-[9px] bg-sky-950 text-sky-400 border border-sky-800/60 px-1 py-0.2 rounded font-mono font-medium">
          {activeViewport} override
        </span>
      );
    }
    return (
      <span className="text-[9px] bg-slate-950 text-slate-500 border border-slate-800 px-1 py-0.2 rounded font-mono">
        shared base
      </span>
    );
  };

  return (
    <aside className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full select-none overflow-y-auto">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 truncate">
            <span className="text-amber-400">❖</span>
            <span className="truncate">{element.name}</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-amber-400 font-mono px-2 py-0.5 rounded border border-slate-700">
            Rev {element.revision}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 font-mono">
          ID: {element.id} • Type: {element.type}
        </div>
      </div>

      {/* Scope Target Selector for this element */}
      <div className="px-3 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Layers className="w-3 h-3 text-amber-400" />
          Edit Target:
        </span>
        <select
          value={activeScope}
          onChange={(e) => setActiveScope(e.target.value as ResponsiveScope)}
          className="bg-slate-900 text-amber-300 text-[11px] border border-slate-700 rounded px-2 py-1 font-medium focus:outline-none focus:border-amber-500"
        >
          <option value="base">🌐 Base (All Views)</option>
          <option value="desktop">🖥️ Desktop Only</option>
          <option value="tablet">📱 Tablet Only</option>
          <option value="mobile">📲 Mobile Only</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-800 text-xs font-medium bg-slate-950">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-2 text-center border-b-2 transition ${
            activeTab === 'content'
              ? 'border-amber-500 text-amber-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab('style')}
          className={`py-2 text-center border-b-2 transition ${
            activeTab === 'style'
              ? 'border-amber-500 text-amber-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Style
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`py-2 text-center border-b-2 transition ${
            activeTab === 'layout'
              ? 'border-amber-500 text-amber-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Layout
        </button>
        <button
          onClick={() => setActiveTab('overrides')}
          className={`py-2 text-center border-b-2 transition ${
            activeTab === 'overrides'
              ? 'border-amber-500 text-amber-400 bg-slate-900'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Overrides
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-4 space-y-4 flex-1">
        {activeTab === 'content' && (
          <div className="space-y-4">
            {resolved.content.title !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Title / Heading</label>
                  {renderOverrideBadge('content', 'title')}
                </div>
                <textarea
                  value={resolved.content.title || ''}
                  rows={2}
                  onChange={(e) => onCommitProperty(element.id, 'content', 'title', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {resolved.content.subtitle !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Subtitle / Tagline</label>
                  {renderOverrideBadge('content', 'subtitle')}
                </div>
                <textarea
                  value={resolved.content.subtitle || ''}
                  rows={3}
                  onChange={(e) => onCommitProperty(element.id, 'content', 'subtitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {resolved.content.badge !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Badge Text</label>
                  {renderOverrideBadge('content', 'badge')}
                </div>
                <input
                  type="text"
                  value={resolved.content.badge || ''}
                  onChange={(e) => onCommitProperty(element.id, 'content', 'badge', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {resolved.content.buttonText !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Button CTA Text</label>
                  {renderOverrideBadge('content', 'buttonText')}
                </div>
                <input
                  type="text"
                  value={resolved.content.buttonText || ''}
                  onChange={(e) => onCommitProperty(element.id, 'content', 'buttonText', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {resolved.content.text !== undefined && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-300">Body Paragraph</label>
                  {renderOverrideBadge('content', 'text')}
                </div>
                <textarea
                  value={resolved.content.text || ''}
                  rows={4}
                  onChange={(e) => onCommitProperty(element.id, 'content', 'text', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* Typography */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Font Size</label>
                {renderOverrideBadge('styles', 'fontSize')}
              </div>
              <input
                type="text"
                value={resolved.styles.fontSize || ''}
                placeholder="e.g. 1.5rem, 24px"
                onChange={(e) => onCommitProperty(element.id, 'styles', 'fontSize', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            {/* Colors */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Background Color</label>
                {renderOverrideBadge('styles', 'backgroundColor')}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={resolved.styles.backgroundColor?.startsWith('#') ? resolved.styles.backgroundColor : '#0b1120'}
                  onChange={(e) => onCommitProperty(element.id, 'styles', 'backgroundColor', e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={resolved.styles.backgroundColor || ''}
                  onChange={(e) => onCommitProperty(element.id, 'styles', 'backgroundColor', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Text Color</label>
                {renderOverrideBadge('styles', 'textColor')}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={resolved.styles.textColor?.startsWith('#') ? resolved.styles.textColor : '#f8fafc'}
                  onChange={(e) => onCommitProperty(element.id, 'styles', 'textColor', e.target.value)}
                  className="w-8 h-8 rounded border border-slate-700 bg-slate-950 cursor-pointer p-0"
                />
                <input
                  type="text"
                  value={resolved.styles.textColor || ''}
                  onChange={(e) => onCommitProperty(element.id, 'styles', 'textColor', e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                />
              </div>
            </div>

            {/* Borders & Radius */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Border Radius</label>
                {renderOverrideBadge('styles', 'borderRadius')}
              </div>
              <input
                type="text"
                value={resolved.styles.borderRadius || ''}
                placeholder="e.g. 1rem, 9999px"
                onChange={(e) => onCommitProperty(element.id, 'styles', 'borderRadius', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Padding</label>
                {renderOverrideBadge('styles', 'padding')}
              </div>
              <input
                type="text"
                value={resolved.styles.padding || ''}
                placeholder="e.g. 3rem 2rem"
                onChange={(e) => onCommitProperty(element.id, 'styles', 'padding', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Max Width</label>
                {renderOverrideBadge('styles', 'maxWidth')}
              </div>
              <input
                type="text"
                value={resolved.styles.maxWidth || ''}
                placeholder="e.g. 1200px"
                onChange={(e) => onCommitProperty(element.id, 'styles', 'maxWidth', e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-300">Text Align</label>
                {renderOverrideBadge('styles', 'textAlign')}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['left', 'center', 'right'] as const).map(align => (
                  <button
                    key={align}
                    onClick={() => onCommitProperty(element.id, 'styles', 'textAlign', align)}
                    className={`py-1.5 rounded text-xs capitalize border transition ${
                      resolved.styles.textAlign === align
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overrides' && (
          <div className="space-y-4">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-amber-400">Viewport Overrides Audit</h4>
              <p className="text-[11px] text-slate-400">
                Shows exact custom overrides defined for Desktop, Tablet, and Mobile.
              </p>

              {(['desktop', 'tablet', 'mobile'] as const).map(vp => {
                const ov = element.overrides[vp];
                const hasOv = Boolean(ov && (Object.keys(ov.styles || {}).length > 0 || Object.keys(ov.content || {}).length > 0));

                return (
                  <div key={vp} className="border border-slate-800/80 rounded p-2 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 capitalize">{vp} Viewport</span>
                      {hasOv ? (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded">
                          Active Override
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Inherits Base</span>
                      )}
                    </div>

                    {hasOv && (
                      <pre className="text-[10px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded overflow-x-auto">
                        {JSON.stringify(ov, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
