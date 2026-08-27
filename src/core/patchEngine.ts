import {
  TemplateModel,
  EditCommand,
  HistoryEntry,
  TemplateElement,
  ViewportId
} from '../types/template';
import { validateEditCommand } from './validator';

export interface ApplyResult {
  success: boolean;
  nextTemplate: TemplateModel;
  newHistoryEntries: HistoryEntry[];
  errors: string[];
}

/**
 * Applies a typed EditCommand through the canonical commit boundary
 */
export function applyEditCommand(
  template: TemplateModel,
  command: EditCommand
): ApplyResult {
  const validation = validateEditCommand(template, command);
  if (!validation.isValid) {
    return {
      success: false,
      nextTemplate: template,
      newHistoryEntries: [],
      errors: validation.errors,
    };
  }

  const nextElements: Record<string, TemplateElement> = { ...template.elements };
  const newHistoryEntries: HistoryEntry[] = [];
  const now = new Date().toISOString();

  for (const patch of command.patches) {
    const targetEl = nextElements[patch.elementId];
    if (!targetEl) continue;

    // Snapshot current element state for history journal
    const historyEntry: HistoryEntry = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      elementId: targetEl.id,
      scope: command.scope,
      revision: targetEl.revision,
      timestamp: now,
      source: command.source,
      description: command.description || `Updated ${targetEl.name} (${command.scope})`,
      snapshot: {
        baseStyles: { ...targetEl.baseStyles },
        baseContent: { ...targetEl.baseContent },
        overrides: {
          desktop: targetEl.overrides.desktop ? {
            styles: { ...(targetEl.overrides.desktop.styles || {}) },
            content: { ...(targetEl.overrides.desktop.content || {}) },
          } : undefined,
          tablet: targetEl.overrides.tablet ? {
            styles: { ...(targetEl.overrides.tablet.styles || {}) },
            content: { ...(targetEl.overrides.tablet.content || {}) },
          } : undefined,
          mobile: targetEl.overrides.mobile ? {
            styles: { ...(targetEl.overrides.mobile.styles || {}) },
            content: { ...(targetEl.overrides.mobile.content || {}) },
          } : undefined,
        },
      },
    };
    newHistoryEntries.push(historyEntry);

    // Apply patch according to responsive scope
    const updatedEl: TemplateElement = {
      ...targetEl,
      revision: targetEl.revision + 1,
      updatedAt: now,
      baseStyles: { ...targetEl.baseStyles },
      baseContent: { ...targetEl.baseContent },
      overrides: {
        desktop: targetEl.overrides.desktop ? { ...targetEl.overrides.desktop } : undefined,
        tablet: targetEl.overrides.tablet ? { ...targetEl.overrides.tablet } : undefined,
        mobile: targetEl.overrides.mobile ? { ...targetEl.overrides.mobile } : undefined,
      },
    };

    if (command.scope === 'base') {
      // Apply directly to shared Base
      if (patch.styles) {
        updatedEl.baseStyles = { ...updatedEl.baseStyles, ...patch.styles };
      }
      if (patch.content) {
        updatedEl.baseContent = { ...updatedEl.baseContent, ...patch.content };
      }
    } else {
      // Apply as viewport-specific override (desktop, tablet, or mobile)
      const vp = command.scope as ViewportId;
      const currentVpOverride = updatedEl.overrides[vp] || {};
      
      updatedEl.overrides[vp] = {
        styles: patch.styles
          ? { ...(currentVpOverride.styles || {}), ...patch.styles }
          : currentVpOverride.styles,
        content: patch.content
          ? { ...(currentVpOverride.content || {}), ...patch.content }
          : currentVpOverride.content,
      };
    }

    nextElements[patch.elementId] = updatedEl;
  }

  const nextTemplate: TemplateModel = {
    ...template,
    revision: template.revision + 1,
    lastModified: now,
    elements: nextElements,
  };

  return {
    success: true,
    nextTemplate,
    newHistoryEntries,
    errors: [],
  };
}
