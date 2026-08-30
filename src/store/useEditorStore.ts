import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TemplateModel,
  ViewportId,
  ResponsiveScope,
  HistoryEntry,
  AiProposalBundle,
  EditSource,
  ElementStyles,
  ElementContent,
  EditCommand
} from '../types/template';
import { DEFAULT_TEMPLATE } from '../template/defaultTemplate';
import { applyEditCommand } from '../core/patchEngine';
import { generateDeterministicProposal } from '../core/aiEngine';
import { restoreElementSnapshot } from '../core/historyEngine';
import { validateTemplateJson } from '../core/validator';

const STORAGE_KEY = 'scoped_ai_template_editor_state_v2';
const STORAGE_HISTORY_KEY = 'scoped_ai_template_editor_history_v2';

export type ViewMode = 'canvas' | 'code' | 'split';

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export function useEditorState() {
  // 1. Template Model State (with localStorage persistence)
  const [template, setTemplate] = useState<TemplateModel>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id && parsed.elements) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load saved template from localStorage:', e);
    }
    return DEFAULT_TEMPLATE;
  });

  // 2. History Journal (element-level)
  const [historyJournal, setHistoryJournal] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HISTORY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load history journal:', e);
    }
    return [];
  });

  // 3. Editor Viewport & Scope State
  const [activeViewport, setActiveViewport] = useState<ViewportId>('desktop');
  const [activeScope, setActiveScope] = useState<ResponsiveScope>('base');
  const [viewMode, setViewMode] = useState<ViewMode>('canvas');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // 4. Selection State (Set of stable element IDs)
  const [selectedIds, setSelectedIds] = useState<string[]>(['elem_hero']);

  // 5. Staging AI Proposal State
  const [activeProposalBundle, setActiveProposalBundle] = useState<AiProposalBundle | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState<boolean>(false);
  const [isProposalDrawerOpen, setIsProposalDrawerOpen] = useState<boolean>(false);

  // 6. Notifications / Toast
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(historyJournal));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }, [template, historyJournal]);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({
      id: `${Date.now()}_${Math.random()}`,
      message,
      type,
    });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // --- SELECTION ACTIONS ---
  const selectElement = useCallback((id: string, isAdditive: boolean = false) => {
    setSelectedIds(prev => {
      if (isAdditive) {
        if (prev.includes(id)) {
          return prev.filter(item => item !== id);
        } else {
          return [...prev, id];
        }
      }
      return [id];
    });
  }, []);

  const selectMultipleElements = useCallback((ids: string[], isAdditive: boolean = false) => {
    setSelectedIds(prev => {
      if (isAdditive) {
        const combined = new Set([...prev, ...ids]);
        return Array.from(combined);
      }
      return ids;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  // --- COMMIT / EDIT PIPELINE ---
  const commitEdit = useCallback((
    patches: Array<{
      elementId: string;
      styles?: Partial<ElementStyles>;
      content?: Partial<ElementContent>;
    }>,
    description: string,
    source: EditSource = 'canvas'
  ) => {
    const targetIds = patches.map(p => p.elementId);
    const command: EditCommand = {
      id: `cmd_${Date.now()}`,
      source,
      timestamp: new Date().toISOString(),
      targetElementIds: targetIds,
      scope: activeScope,
      baseRevision: template.revision,
      description,
      patches,
    };

    const result = applyEditCommand(template, command);
    if (!result.success) {
      showToast(`Edit failed: ${result.errors.join(', ')}`, 'error');
      return false;
    }

    setTemplate(result.nextTemplate);
    setHistoryJournal(prev => [...result.newHistoryEntries, ...prev]);
    return true;
  }, [template, activeScope, showToast]);

  const commitDirectProperty = useCallback((
    elementId: string,
    kind: 'styles' | 'content',
    key: string,
    value: unknown,
    description?: string
  ) => {
    const patch = kind === 'styles'
      ? { elementId, styles: { [key]: value } }
      : { elementId, content: { [key]: value } };

    return commitEdit(
      [patch],
      description || `Modified ${kind}.${key} on ${elementId} (${activeScope})`,
      'canvas'
    );
  }, [commitEdit, activeScope]);

  // Code Editor JSON Commit
  const commitCodeJson = useCallback((rawJson: string): { success: boolean; error?: string } => {
    const val = validateTemplateJson(rawJson);
    if (!val.isValid || !val.parsed) {
      showToast(`Invalid Code JSON: ${val.error}`, 'error');
      return { success: false, error: val.error };
    }

    const command: EditCommand = {
      id: `cmd_code_${Date.now()}`,
      source: 'code',
      timestamp: new Date().toISOString(),
      targetElementIds: Object.keys(val.parsed.elements),
      scope: 'base',
      baseRevision: template.revision,
      description: 'Applied JSON Code Editor update',
      patches: Object.entries(val.parsed.elements).map(([id, el]) => ({
        elementId: id,
        styles: el.baseStyles,
        content: el.baseContent,
      })),
    };

    const result = applyEditCommand(template, command);
    if (result.success) {
      setTemplate(val.parsed);
      setHistoryJournal(prev => [...result.newHistoryEntries, ...prev]);
      showToast('Code edits applied successfully!', 'success');
      return { success: true };
    } else {
      showToast(`Code update failed: ${result.errors.join(', ')}`, 'error');
      return { success: false, error: result.errors.join(', ') };
    }
  }, [template, showToast]);

  // --- DETERMINISTIC AI PROPOSAL PIPELINE ---
  const requestAiProposal = useCallback((instruction: string, forcedScope?: ResponsiveScope) => {
    const targetScope = forcedScope || activeScope;
    const { bundle, validationErrors } = generateDeterministicProposal(
      instruction,
      selectedIds,
      targetScope,
      template
    );

    setActiveProposalBundle(bundle);
    setIsProposalDrawerOpen(true);

    if (bundle.isFailureDemo) {
      showToast(`AI Scenario Notice: ${bundle.errorMessage || 'Failure test condition triggered.'}`, 'warning');
    } else if (validationErrors.length > 0) {
      showToast(`AI Proposal Validation Warning: ${validationErrors.join(', ')}`, 'warning');
    } else {
      showToast(`Generated deterministic AI proposal for ${bundle.proposals.length} element(s).`, 'info');
    }

    return bundle;
  }, [activeScope, selectedIds, template, showToast]);

  const acceptProposalElement = useCallback((elementId: string) => {
    if (!activeProposalBundle) return;

    const proposal = activeProposalBundle.proposals.find(p => p.elementId === elementId);
    if (!proposal || proposal.status === 'accepted') return;

    const success = commitEdit(
      [{
        elementId: proposal.elementId,
        styles: proposal.after.styles,
        content: proposal.after.content,
      }],
      `Accepted AI Proposal: ${proposal.changesSummary.join(', ')}`,
      'ai-demo'
    );

    if (success) {
      setActiveProposalBundle(prev => {
        if (!prev) return null;
        return {
          ...prev,
          proposals: prev.proposals.map(p => p.elementId === elementId ? { ...p, status: 'accepted' } : p),
        };
      });
      showToast(`Accepted AI changes for ${proposal.elementName}`, 'success');
    }
  }, [activeProposalBundle, commitEdit, showToast]);

  const rejectProposalElement = useCallback((elementId: string) => {
    if (!activeProposalBundle) return;

    setActiveProposalBundle(prev => {
      if (!prev) return null;
      return {
        ...prev,
        proposals: prev.proposals.map(p => p.elementId === elementId ? { ...p, status: 'rejected' } : p),
      };
    });
    showToast(`Rejected proposal for ${elementId}`, 'info');
  }, [activeProposalBundle, showToast]);

  const acceptAllProposals = useCallback(() => {
    if (!activeProposalBundle) return;

    const pending = activeProposalBundle.proposals.filter(p => p.status === 'pending');
    if (pending.length === 0) return;

    const patches = pending.map(p => ({
      elementId: p.elementId,
      styles: p.after.styles,
      content: p.after.content,
    }));

    const success = commitEdit(
      patches,
      `Accepted Batch AI Proposals (${pending.length} elements)`,
      'ai-demo'
    );

    if (success) {
      setActiveProposalBundle(prev => {
        if (!prev) return null;
        return {
          ...prev,
          proposals: prev.proposals.map(p => ({ ...p, status: 'accepted' })),
        };
      });
      showToast(`Accepted all ${pending.length} AI proposals!`, 'success');
    }
  }, [activeProposalBundle, commitEdit, showToast]);

  const rejectAllProposals = useCallback(() => {
    if (!activeProposalBundle) return;
    setActiveProposalBundle(prev => {
      if (!prev) return null;
      return {
        ...prev,
        proposals: prev.proposals.map(p => ({ ...p, status: 'rejected' })),
      };
    });
    showToast('Rejected all AI proposals.', 'info');
  }, [activeProposalBundle, showToast]);

  // --- RECOVERY / HISTORY RESTORATION ---
  const restoreHistorySnapshot = useCallback((
    elementId: string,
    historyEntry: HistoryEntry,
    scopeToRestore: ResponsiveScope = 'base'
  ) => {
    const result = restoreElementSnapshot(template, elementId, historyEntry, scopeToRestore);
    if (!result.success) {
      showToast(`Recovery failed: ${result.error}`, 'error');
      return false;
    }

    setTemplate(result.nextTemplate);
    if (result.newHistoryEntry) {
      setHistoryJournal(prev => [result.newHistoryEntry!, ...prev]);
    }
    showToast(`Restored ${elementId} (${scopeToRestore}) independently!`, 'success');
    return true;
  }, [template, showToast]);

  // Factory Reset
  const resetToDefaultTemplate = useCallback(() => {
    if (window.confirm('Reset template to original state? This will clear all manual and AI changes.')) {
      setTemplate(DEFAULT_TEMPLATE);
      setHistoryJournal([]);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_HISTORY_KEY);
      setSelectedIds(['elem_hero']);
      showToast('Template successfully reset to initial default state.', 'info');
    }
  }, [showToast]);

  return {
    template,
    historyJournal,
    activeViewport,
    activeScope,
    viewMode,
    zoomLevel,
    selectedIds,
    activeProposalBundle,
    isAiModalOpen,
    isRecoveryModalOpen,
    isProposalDrawerOpen,
    toast,
    setTemplate,
    setActiveViewport,
    setActiveScope,
    setViewMode,
    setZoomLevel,
    setSelectedIds,
    setIsAiModalOpen,
    setIsRecoveryModalOpen,
    setIsProposalDrawerOpen,
    selectElement,
    selectMultipleElements,
    clearSelection,
    commitEdit,
    commitDirectProperty,
    commitCodeJson,
    requestAiProposal,
    acceptProposalElement,
    rejectProposalElement,
    acceptAllProposals,
    rejectAllProposals,
    restoreHistorySnapshot,
    resetToDefaultTemplate,
    showToast,
  };
}
