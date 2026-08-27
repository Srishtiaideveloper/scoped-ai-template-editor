import {
  TemplateModel,
  HistoryEntry,
  TemplateElement,
  ResponsiveScope,
  ViewportId
} from '../types/template';

/**
 * Element-level Independent Recovery Engine
 * 
 * Guarantees:
 * 1. Restoring element A does not alter element B in any way.
 * 2. Restoring a specific viewport override (e.g. mobile) does not overwrite base or desktop.
 * 3. Recovery creates a new explicit forward revision rather than destructive history mutation.
 */

export function restoreElementSnapshot(
  template: TemplateModel,
  elementId: string,
  historyEntry: HistoryEntry,
  scopeToRestore: ResponsiveScope = 'base'
): { success: boolean; nextTemplate: TemplateModel; newHistoryEntry?: HistoryEntry; error?: string } {
  const currentEl = template.elements[elementId];
  if (!currentEl) {
    return { success: false, nextTemplate: template, error: `Element "${elementId}" not found in template.` };
  }

  const now = new Date().toISOString();

  // Snapshot before restoring for rollback safety
  const recoveryEntry: HistoryEntry = {
    id: `hist_restore_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    elementId: currentEl.id,
    scope: scopeToRestore,
    revision: currentEl.revision,
    timestamp: now,
    source: 'history-restore',
    description: `Restored to state from ${new Date(historyEntry.timestamp).toLocaleTimeString()} (${historyEntry.description})`,
    snapshot: {
      baseStyles: { ...currentEl.baseStyles },
      baseContent: { ...currentEl.baseContent },
      overrides: {
        desktop: currentEl.overrides.desktop ? {
          styles: { ...(currentEl.overrides.desktop.styles || {}) },
          content: { ...(currentEl.overrides.desktop.content || {}) },
        } : undefined,
        tablet: currentEl.overrides.tablet ? {
          styles: { ...(currentEl.overrides.tablet.styles || {}) },
          content: { ...(currentEl.overrides.tablet.content || {}) },
        } : undefined,
        mobile: currentEl.overrides.mobile ? {
          styles: { ...(currentEl.overrides.mobile.styles || {}) },
          content: { ...(currentEl.overrides.mobile.content || {}) },
        } : undefined,
      },
    },
  };

  const nextEl: TemplateElement = {
    ...currentEl,
    revision: currentEl.revision + 1,
    updatedAt: now,
  };

  if (scopeToRestore === 'base') {
    // Restore base styles & content from snapshot
    nextEl.baseStyles = { ...historyEntry.snapshot.baseStyles };
    nextEl.baseContent = { ...historyEntry.snapshot.baseContent };
  } else {
    // Restore only the specific viewport override from snapshot
    const vp = scopeToRestore as ViewportId;
    const snapOverride = historyEntry.snapshot.overrides[vp];
    nextEl.overrides = {
      ...nextEl.overrides,
      [vp]: snapOverride ? {
        styles: snapOverride.styles ? { ...snapOverride.styles } : undefined,
        content: snapOverride.content ? { ...snapOverride.content } : undefined,
      } : undefined,
    };
  }

  const nextElements = {
    ...template.elements,
    [elementId]: nextEl,
  };

  const nextTemplate: TemplateModel = {
    ...template,
    revision: template.revision + 1,
    lastModified: now,
    elements: nextElements,
  };

  return {
    success: true,
    nextTemplate,
    newHistoryEntry: recoveryEntry,
  };
}

/**
 * Filter and group history entries by element ID and scope
 */
export function getElementHistory(
  allHistory: HistoryEntry[],
  elementId: string,
  scopeFilter?: ResponsiveScope
): HistoryEntry[] {
  return allHistory
    .filter(entry => entry.elementId === elementId && (!scopeFilter || scopeFilter === 'base' || entry.scope === scopeFilter || entry.scope === 'base'))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
