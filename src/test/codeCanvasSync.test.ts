import { describe, it, expect } from 'vitest';
import { validateTemplateJson } from '../core/validator';
import { applyEditCommand } from '../core/patchEngine';
import { DEFAULT_TEMPLATE } from '../template/defaultTemplate';
import { EditCommand } from '../types/template';

describe('Canvas-Code State Consistency & Resilience', () => {
  it('validates canonical template JSON structure cleanly', () => {
    const validJsonString = JSON.stringify(DEFAULT_TEMPLATE, null, 2);
    const result = validateTemplateJson(validJsonString);
    expect(result.isValid).toBe(true);
    expect(result.parsed?.id).toBe(DEFAULT_TEMPLATE.id);
  });

  it('rejects invalid JSON syntax without damaging last valid state', () => {
    const brokenJson = '{ "id": "template_test", "elements": { "elem_hero": { syntax_error } }';
    const result = validateTemplateJson(brokenJson);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Syntax Error');
  });

  it('rejects JSON missing required schema properties', () => {
    const missingFieldsJson = JSON.stringify({
      id: 'template_bad',
      elements: {
        elem_hero: {
          id: 'elem_hero',
          // missing 'type', 'baseStyles', etc.
        }
      }
    });
    const result = validateTemplateJson(missingFieldsJson);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('missing required');
  });

  it('maintains bidirectional sync when applying valid code edits', () => {
    const cloned = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
    cloned.elements['elem_hero'].baseContent.title = 'Title Modified via Code Surface';

    const command: EditCommand = {
      id: 'cmd_code_sync',
      source: 'code',
      timestamp: new Date().toISOString(),
      targetElementIds: ['elem_hero'],
      scope: 'base',
      baseRevision: DEFAULT_TEMPLATE.revision,
      description: 'Modified via Code Surface',
      patches: [{
        elementId: 'elem_hero',
        content: cloned.elements['elem_hero'].baseContent,
      }],
    };

    const applyResult = applyEditCommand(DEFAULT_TEMPLATE, command);
    expect(applyResult.success).toBe(true);
    expect(applyResult.nextTemplate.elements['elem_hero'].baseContent.title).toBe('Title Modified via Code Surface');
  });
});
