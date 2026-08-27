import {
  TemplateModel,
  EditCommand,
  ValidationResult,
  AiProposalBundle
} from '../types/template';

const FORBIDDEN_PROPERTY_KEYS = new Set([
  '__proto__',
  'prototype',
  'constructor',
  'dangerouslySetInnerHTML',
  'eval',
  'script',
]);

/**
 * Validate an EditCommand against current template state
 */
export function validateEditCommand(
  template: TemplateModel,
  command: EditCommand
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!command.targetElementIds || command.targetElementIds.length === 0) {
    errors.push('Edit command contains no target element IDs.');
    return { isValid: false, errors, warnings };
  }

  for (const targetId of command.targetElementIds) {
    const element = template.elements[targetId];
    if (!element) {
      errors.push(`Target element with ID "${targetId}" does not exist in template.`);
      continue;
    }

    // Stale revision check (only if baseRevision was specified > 0)
    if (command.baseRevision > 0 && command.baseRevision < element.revision) {
      warnings.push(`Element "${element.name}" (ID: ${targetId}) was modified concurrently (current rev ${element.revision} > base rev ${command.baseRevision}).`);
    }
  }

  // Validate patch fields
  for (const patch of command.patches) {
    if (!template.elements[patch.elementId]) {
      errors.push(`Patch references nonexistent element ID "${patch.elementId}".`);
    }

    if (patch.styles) {
      for (const key of Object.keys(patch.styles)) {
        if (FORBIDDEN_PROPERTY_KEYS.has(key)) {
          errors.push(`Forbidden style property "${key}" rejected.`);
        }
      }
    }

    if (patch.content) {
      for (const key of Object.keys(patch.content)) {
        if (FORBIDDEN_PROPERTY_KEYS.has(key)) {
          errors.push(`Forbidden content property "${key}" rejected.`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate AI Proposal Bundle strictly enforcing Selection Authority
 */
export function validateAiProposalBundle(
  template: TemplateModel,
  selectedIds: string[],
  bundle: AiProposalBundle
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const selectedSet = new Set(selectedIds);

  if (bundle.proposals.length === 0 && !bundle.isFailureDemo) {
    errors.push('AI proposal bundle contains zero element proposals.');
  }

  for (const proposal of bundle.proposals) {
    // SELECTION AUTHORITY CHECK: AI cannot touch unselected elements
    if (!selectedSet.has(proposal.elementId)) {
      errors.push(`AI Security Violation: Proposal targets element "${proposal.elementId}" which is NOT currently selected by user.`);
    }

    const currentEl = template.elements[proposal.elementId];
    if (!currentEl) {
      errors.push(`AI Proposal targets non-existent element ID "${proposal.elementId}".`);
      continue;
    }

    // Check for forbidden keys in after styles
    if (proposal.after.styles) {
      for (const key of Object.keys(proposal.after.styles)) {
        if (FORBIDDEN_PROPERTY_KEYS.has(key)) {
          errors.push(`AI Proposal contains forbidden style property "${key}".`);
        }
      }
    }

    // Check for forbidden keys in after content
    if (proposal.after.content) {
      for (const key of Object.keys(proposal.after.content)) {
        if (FORBIDDEN_PROPERTY_KEYS.has(key)) {
          errors.push(`AI Proposal contains forbidden content property "${key}".`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate raw code JSON edited by user in Code Surface
 */
export function validateTemplateJson(rawJson: string): { isValid: boolean; parsed?: TemplateModel; error?: string } {
  try {
    const parsed = JSON.parse(rawJson);
    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'JSON root must be a valid object.' };
    }

    if (!parsed.id || !parsed.elements || typeof parsed.elements !== 'object') {
      return { isValid: false, error: 'Template must contain "id" and "elements" dictionary.' };
    }

    // Validate that all elements have an ID and type
    for (const [key, el] of Object.entries(parsed.elements as Record<string, any>)) {
      if (!el.id || el.id !== key) {
        return { isValid: false, error: `Element key "${key}" does not match its internal id "${el.id}".` };
      }
      if (!el.type) {
        return { isValid: false, error: `Element "${key}" is missing required field "type".` };
      }
      if (!el.baseStyles || !el.baseContent || !el.overrides) {
        return { isValid: false, error: `Element "${key}" is missing required properties: baseStyles, baseContent, or overrides.` };
      }
    }

    return { isValid: true, parsed: parsed as TemplateModel };
  } catch (err: any) {
    return { isValid: false, error: `Syntax Error: ${err.message}` };
  }
}
