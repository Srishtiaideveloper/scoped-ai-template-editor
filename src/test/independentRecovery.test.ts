import { describe, it, expect } from 'vitest';
import { applyEditCommand } from '../core/patchEngine';
import { restoreElementSnapshot } from '../core/historyEngine';
import { DEFAULT_TEMPLATE } from '../template/defaultTemplate';
import { EditCommand } from '../types/template';

describe('Independent Element Recovery & Granular Rollback', () => {
  it('restores Element A without rolling back unrelated edits on Element B', () => {
    const originalHeroTitle = DEFAULT_TEMPLATE.elements['elem_hero'].baseContent.title;
    const originalCardTitle = DEFAULT_TEMPLATE.elements['elem_card_feature_1'].baseContent.title;

    // Step 1: Modify Hero (Element A)
    const cmd1: EditCommand = {
      id: 'cmd_edit_hero',
      source: 'canvas',
      timestamp: new Date().toISOString(),
      targetElementIds: ['elem_hero'],
      scope: 'base',
      baseRevision: DEFAULT_TEMPLATE.revision,
      description: 'Modified Hero Title',
      patches: [{
        elementId: 'elem_hero',
        content: { title: 'Modified Hero Title V2' },
      }],
    };
    const res1 = applyEditCommand(DEFAULT_TEMPLATE, cmd1);
    expect(res1.success).toBe(true);
    const heroHistorySnapshot = res1.newHistoryEntries[0];

    // Step 2: Modify Feature Card 1 (Element B)
    const cmd2: EditCommand = {
      id: 'cmd_edit_card',
      source: 'canvas',
      timestamp: new Date().toISOString(),
      targetElementIds: ['elem_card_feature_1'],
      scope: 'base',
      baseRevision: res1.nextTemplate.revision,
      description: 'Modified Card Title',
      patches: [{
        elementId: 'elem_card_feature_1',
        content: { title: 'Modified Feature Card Title V2' },
      }],
    };
    const res2 = applyEditCommand(res1.nextTemplate, cmd2);
    expect(res2.success).toBe(true);

    // Verify current state has both A and B modified
    expect(res2.nextTemplate.elements['elem_hero'].baseContent.title).toBe('Modified Hero Title V2');
    expect(res2.nextTemplate.elements['elem_card_feature_1'].baseContent.title).toBe('Modified Feature Card Title V2');

    // Step 3: Independently Restore Element A (Hero) back to original snapshot
    const recoveryResult = restoreElementSnapshot(
      res2.nextTemplate,
      'elem_hero',
      heroHistorySnapshot,
      'base'
    );

    expect(recoveryResult.success).toBe(true);
    
    // GUARANTEE 1: Element A (Hero) is restored back to original title
    expect(recoveryResult.nextTemplate.elements['elem_hero'].baseContent.title).toBe(originalHeroTitle);
    
    // GUARANTEE 2: Element B (Card) REMAINS at its modified V2 title without rolling back!
    expect(recoveryResult.nextTemplate.elements['elem_card_feature_1'].baseContent.title).toBe('Modified Feature Card Title V2');
  });

  it('restores a specific Viewport Override (e.g. Mobile) without changing Base or Desktop', () => {
    // Start with a template having a custom mobile override
    const initialTemplate = JSON.parse(JSON.stringify(DEFAULT_TEMPLATE));
    initialTemplate.elements['elem_hero'].baseStyles.fontSize = '48px';
    initialTemplate.elements['elem_hero'].overrides = {
      mobile: { styles: { fontSize: '20px' } },
      desktop: { styles: { fontSize: '52px' } },
    };

    // Step 1: User edits Mobile override to 14px
    const cmdMobile: EditCommand = {
      id: 'cmd_mob_change',
      source: 'canvas',
      timestamp: new Date().toISOString(),
      targetElementIds: ['elem_hero'],
      scope: 'mobile',
      baseRevision: 1,
      description: 'Shrank font on mobile',
      patches: [{
        elementId: 'elem_hero',
        styles: { fontSize: '14px' },
      }],
    };
    const res = applyEditCommand(initialTemplate, cmdMobile);
    expect(res.success).toBe(true);
    const snap = res.newHistoryEntries[0];

    // Step 2: User now restores mobile override from snap
    const restoreRes = restoreElementSnapshot(res.nextTemplate, 'elem_hero', snap, 'mobile');
    expect(restoreRes.success).toBe(true);

    const recoveredHero = restoreRes.nextTemplate.elements['elem_hero'];
    // Mobile is restored to 20px
    expect(recoveredHero.overrides.mobile?.styles?.fontSize).toBe('20px');
    // Base is untouched (48px)
    expect(recoveredHero.baseStyles.fontSize).toBe('48px');
    // Desktop override is untouched (52px)
    expect(recoveredHero.overrides.desktop?.styles?.fontSize).toBe('52px');
  });
});
