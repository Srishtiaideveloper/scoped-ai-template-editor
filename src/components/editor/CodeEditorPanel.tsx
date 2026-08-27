import React, { useState, useEffect } from 'react';
import { TemplateModel } from '../../types/template';
import { Code2, AlertTriangle, CheckCircle2, Copy, RefreshCw } from 'lucide-react';

interface CodeEditorPanelProps {
  template: TemplateModel;
  selectedIds: string[];
  onCommitCode: (rawJson: string) => { success: boolean; error?: string };
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  template,
  selectedIds,
  onCommitCode,
}) => {
  const [codeMode, setCodeMode] = useState<'full' | 'selected'>('full');
  const [codeText, setCodeText] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Sync state to editor when template or selectedIds change (unless user is actively typing dirty edits)
  useEffect(() => {
    if (!isDirty) {
      if (codeMode === 'full') {
        setCodeText(JSON.stringify(template, null, 2));
      } else {
        const selectedSlice = selectedIds.reduce((acc, id) => {
          if (template.elements[id]) {
            acc[id] = template.elements[id];
          }
          return acc;
        }, {} as Record<string, any>);
        setCodeText(JSON.stringify(selectedSlice, null, 2));
      }
      setValidationError(null);
    }
  }, [template, selectedIds, codeMode, isDirty]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCodeText(val);
    setIsDirty(true);

    // Live validation
    try {
      JSON.parse(val);
      setValidationError(null);
    } catch (err: any) {
      setValidationError(`JSON Syntax Error: ${err.message}`);
    }
  };

  const handleApply = () => {
    if (codeMode === 'selected') {
      try {
        const parsed = JSON.parse(codeText);
        const updatedFull = {
          ...template,
          elements: {
            ...template.elements,
            ...parsed,
          },
        };
        const result = onCommitCode(JSON.stringify(updatedFull, null, 2));
        if (result.success) {
          setIsDirty(false);
          setValidationError(null);
        } else {
          setValidationError(result.error || 'Failed to apply slice.');
        }
      } catch (err: any) {
        setValidationError(`Invalid JSON slice: ${err.message}`);
      }
      return;
    }

    const result = onCommitCode(codeText);
    if (result.success) {
      setIsDirty(false);
      setValidationError(null);
    } else {
      setValidationError(result.error || 'Validation error.');
    }
  };

  const handleResetToCanonical = () => {
    if (codeMode === 'full') {
      setCodeText(JSON.stringify(template, null, 2));
    } else {
      const selectedSlice = selectedIds.reduce((acc, id) => {
        if (template.elements[id]) acc[id] = template.elements[id];
        return acc;
      }, {} as Record<string, any>);
      setCodeText(JSON.stringify(selectedSlice, null, 2));
    }
    setIsDirty(false);
    setValidationError(null);
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(codeText);
      setCodeText(JSON.stringify(parsed, null, 2));
      setValidationError(null);
    } catch (err: any) {
      setValidationError(`Cannot format invalid JSON: ${err.message}`);
    }
  };

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full border-r border-slate-800 select-text font-mono">
      {/* Code Editor Header */}
      <div className="h-11 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <Code2 className="w-4 h-4" />
            <span>CANONICAL CODE SURFACE</span>
          </div>

          <div className="flex items-center bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => { setCodeMode('full'); setIsDirty(false); }}
              className={`px-2 py-0.5 rounded text-[11px] font-sans transition ${
                codeMode === 'full' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Entire Template JSON
            </button>
            <button
              onClick={() => { setCodeMode('selected'); setIsDirty(false); }}
              className={`px-2 py-0.5 rounded text-[11px] font-sans transition ${
                codeMode === 'selected' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Selected Element Slice ({selectedIds.length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-[10px] text-amber-400 font-sans animate-pulse">
              ● Unsaved edits
            </span>
          )}

          <button
            onClick={handleFormatJson}
            className="text-[11px] font-sans text-slate-300 hover:text-amber-400 bg-slate-950 border border-slate-800 px-2 py-1 rounded transition"
          >
            Format JSON
          </button>

          <button
            onClick={handleResetToCanonical}
            className="text-[11px] font-sans text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 p-1 rounded transition"
            title="Discard changes and reload state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleApply}
            disabled={Boolean(validationError)}
            className={`text-xs font-sans font-bold px-3 py-1 rounded transition ${
              validationError
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm'
            }`}
          >
            Apply Code Edits
          </button>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="bg-red-950/90 border-b border-red-800 px-4 py-2 text-xs text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span className="font-mono text-[11px]">{validationError}</span>
        </div>
      )}

      {/* Code Textarea Surface */}
      <div className="flex-1 p-4 bg-slate-950 flex flex-col relative overflow-hidden">
        <textarea
          value={codeText}
          onChange={handleTextChange}
          spellCheck={false}
          className="w-full h-full bg-slate-900/90 text-amber-300/90 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
        />
      </div>
    </div>
  );
};
