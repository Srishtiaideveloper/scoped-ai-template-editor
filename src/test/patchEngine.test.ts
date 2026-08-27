import { describe, it, expect } from 'vitest';
import { applyEditCommand } from '../core/patchEngine';
import { DEFAULT_TEMPLATE } from '../template/defaultTemplate';
import { EditCommand } from '../types/template';

describe('Patch Engine & View-Specific Isolation', () => {
  it('applies base edits universally and increments revisions', () => {
    const command: EditCommand = {
      id: 'cmd_1',
      source: 'canvas',
      timestamp: new Date().toISOString(),
      targetElementIds: ['elem_hero'],
      scope: 'base',
      baseRevision: DEFAULT_TEMPLATE.revision,
      description: 'Update hero title on base',
      patches: [
        {
          elementId: 'elem_hero',
          content: { title: 'Updated Universal Hero' },
          styles: { backgroundColor: '#112233' },
        },
      ],
    };

    const result = applyEditCommand(DEFAULT_TEMPLATE, command);
    expect(result.success).toBe(true);
    expect(result.nextTemplate.revision).toBe(DEFAULT_TEMPLATE.revision + 1);
    expect(result.nextTemplate.elements['elem_hero'].baseContent.title).toBe('Updated Universal Hero');
    expect(result.nextTemplate.elements['elem_hero'].baseStyles.backgroundColor).toBe('#112233');
    expect(result.newHistoryEntries.length).toBe(1);
    expect(result.newHistoryEntries[0].elementId).toBe('elem_hero');
  });

  it('guarantees View-Specific Isolation: mobile edits do not modify base or other viewports', () => {
    const originalBaseTitle = DEFAULT_TEMPLATE.elements['elem_hero'].baseContent.title;
    
    const command: EditCommand = {
      id: 'cmd_mobile_iso',
      source: 'canvas',
      timestamp: new Date().toISOString(),
      targetElementIds: ['elem_hero'],
      scope: 'mobile',
      baseRevision: DEFAULT_TEMPLATE.revision,
      description: 'Update hero title strictly for Mobile view',
      patches: [
        {
          elementId: 'elem_hero',
          content: { title: 'Mobile Only Custom Title' },
        },
      ],
    };

    const result = applyEditCommand(DEFAULT_TEMPLATE, command);
    expect(result.success).toBe(true);
    
    const updatedHero = result.nextTemplate.elements['elem_hero'];
    // Base content must remain completely unchanged
    expect(updatedHero.baseContent.title).toBe(originalBaseTitle);
    // Mobile override must contain the change
    expect(updatedHero.overrides.mobile?.content?.title).toBe('Mobile Only Custom Title');
    // Desktop and Tablet overrides must not exist or be altered
    expect(updatedHero.overrides.desktop?.content?.title).toBeUndefined();
    expect(updatedHero.overrides.tablet?.content?.title).toBeUndefined();
  });

  it('rejects commands targeting non-existent element IDs', () => {
    const badCommand: EditCommand = {
      id: 'cmd_bad',
      source: 'canvas',
      timestamp: new Date().toISOString(),
      targetElementIds: ['non_existent_element_999'],
      scope: 'base',
      baseRevision: 1,
      description: 'Bad target',
      patches: [
        {
          elementId: 'non_existent_element_999',
          styles: { backgroundColor: '#ffffff' },
        },
      ],
    };

    const result = applyEditCommand(DEFAULT_TEMPLATE, badCommand);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('non_existent_element_999');
  });
});
