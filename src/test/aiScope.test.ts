import { describe, it, expect } from 'vitest';
import { generateDeterministicProposal } from '../core/aiEngine';
import { validateAiProposalBundle } from '../core/validator';
import { DEFAULT_TEMPLATE } from '../template/defaultTemplate';

describe('Deterministic AI Scope & Selection Authority', () => {
  it('strictly restricts proposals to user-selected element IDs', () => {
    const selectedIds = ['elem_hero', 'elem_card_feature_1'];
    const { bundle, validationErrors } = generateDeterministicProposal(
      'Make headline punchy and high-energy',
      selectedIds,
      'base',
      DEFAULT_TEMPLATE
    );

    expect(validationErrors.length).toBe(0);
    expect(bundle.proposals.length).toBe(2);
    
    // Check that every proposal belongs exclusively to selectedIds
    for (const prop of bundle.proposals) {
      expect(selectedIds).toContain(prop.elementId);
    }
  });

  it('guarantees deterministic output for identical inputs and state', () => {
    const selectedIds = ['elem_hero'];
    const run1 = generateDeterministicProposal(
      'Apply dark emerald luxury theme',
      selectedIds,
      'base',
      DEFAULT_TEMPLATE
    );
    const run2 = generateDeterministicProposal(
      'Apply dark emerald luxury theme',
      selectedIds,
      'base',
      DEFAULT_TEMPLATE
    );

    expect(run1.bundle.proposals[0].after.styles).toEqual(run2.bundle.proposals[0].after.styles);
    expect(run1.bundle.proposals[0].changesSummary).toEqual(run2.bundle.proposals[0].changesSummary);
  });

  it('safely catches and blocks AI proposals targeting unselected element IDs', () => {
    const selectedIds = ['elem_hero']; // Only hero selected
    const { bundle } = generateDeterministicProposal(
      'Rewrite the unselected footer while only the hero is selected',
      selectedIds,
      'base',
      DEFAULT_TEMPLATE
    );

    expect(bundle.isFailureDemo).toBe(true);
    // Validator must detect security violation
    const valResult = validateAiProposalBundle(DEFAULT_TEMPLATE, selectedIds, bundle);
    expect(valResult.isValid).toBe(false);
    expect(valResult.errors.some(err => err.includes('AI Security Violation'))).toBe(true);
  });

  it('safely blocks forbidden property injections like dangerouslySetInnerHTML or script tags', () => {
    const selectedIds = ['elem_hero'];
    const { bundle } = generateDeterministicProposal(
      'Inject custom raw HTML script tags into element content',
      selectedIds,
      'base',
      DEFAULT_TEMPLATE
    );

    expect(bundle.isFailureDemo).toBe(true);
    const valResult = validateAiProposalBundle(DEFAULT_TEMPLATE, selectedIds, bundle);
    expect(valResult.isValid).toBe(false);
    expect(valResult.errors.some(err => err.includes('forbidden'))).toBe(true);
  });
});
