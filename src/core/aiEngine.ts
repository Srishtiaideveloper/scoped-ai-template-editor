import {
  TemplateModel,
  AiProposalBundle,
  AiElementProposal,
  ResponsiveScope,
  ElementStyles,
  ElementContent
} from '../types/template';
import { validateAiProposalBundle } from './validator';

export interface PredefinedScenario {
  id: string;
  label: string;
  category: 'content' | 'style' | 'layout' | 'responsive' | 'multi' | 'failure';
  description: string;
  promptExample: string;
  recommendedScope: ResponsiveScope;
  expectedTargetType?: string;
  isFailureDemo?: boolean;
}

export const PREDEFINED_SCENARIOS: PredefinedScenario[] = [
  {
    id: 'content_punchy',
    label: '1. Content Rewrite: Punchy & High-Conversion Copy',
    category: 'content',
    description: 'Rewrites headlines and subheadings to be action-oriented, punchy, and modern.',
    promptExample: 'Make the headline punchy, high-energy, and focused on craft quality.',
    recommendedScope: 'base',
  },
  {
    id: 'content_translate_es',
    label: '1b. Content Translation: Localize to Spanish',
    category: 'content',
    description: 'Translates titles, subtitles, and CTA buttons into authentic Spanish.',
    promptExample: 'Translate selected content to Spanish for international customers.',
    recommendedScope: 'base',
  },
  {
    id: 'style_emerald_luxury',
    label: '2. Style Change: Dark Emerald & Gold Luxury Theme',
    category: 'style',
    description: 'Applies deep emerald backgrounds, warm gold typography, and subtle border radiance.',
    promptExample: 'Change styling to luxury dark emerald aesthetic with warm amber gold borders.',
    recommendedScope: 'base',
  },
  {
    id: 'style_glowing_pills',
    label: '2b. Style Change: Glowing Neon CTA Buttons',
    category: 'style',
    description: 'Morphs buttons into rounded-full pills with glowing box-shadow and high-contrast text.',
    promptExample: 'Make selected buttons glowing neon pills with high contrast.',
    recommendedScope: 'base',
  },
  {
    id: 'layout_reorder_expand',
    label: '3. Move/Resize/Reorder: Expand Hero Spacing & Center Align',
    category: 'layout',
    description: 'Increases vertical padding, centers typography alignment, and adjusts max-width.',
    promptExample: 'Center-align hero content, expand vertical padding to 6rem, and max-width.',
    recommendedScope: 'base',
  },
  {
    id: 'responsive_mobile_compact',
    label: '4. One-Viewport Responsive: Mobile-Only Typography & Spacing',
    category: 'responsive',
    description: 'Applies compact font sizes and tighter margins STRICTLY to Mobile viewport without affecting Desktop.',
    promptExample: 'Optimize font size to 24px and tighten padding for mobile screen view only.',
    recommendedScope: 'mobile',
  },
  {
    id: 'multi_card_glassmorphism',
    label: '5. Multi-Element Edit: Frosted Glassmorphism on All Selected Cards',
    category: 'multi',
    description: 'Applies cohesive frosted glass background, 1px subtle border, and rounded corners across all selected elements.',
    promptExample: 'Apply modern frosted glass styling with golden accent badge to all selected cards.',
    recommendedScope: 'base',
  },
  // Safe Failure Scenarios
  {
    id: 'failure_unselected_target',
    label: '6a. Safe Failure: AI Attempts to Modify Unselected Element',
    category: 'failure',
    description: 'Demonstrates Selection Authority safety check rejecting an unauthorized target ID.',
    promptExample: 'Rewrite the unselected footer while only the hero is selected.',
    recommendedScope: 'base',
    isFailureDemo: true,
  },
  {
    id: 'failure_stale_revision',
    label: '6b. Safe Failure: Stale Base Revision Conflict Simulation',
    category: 'failure',
    description: 'Demonstrates stale revision conflict prevention when an edit is based on an outdated revision.',
    promptExample: 'Apply edit based on revision 0 when element is at revision 5.',
    recommendedScope: 'base',
    isFailureDemo: true,
  },
  {
    id: 'failure_invalid_field',
    label: '6c. Safe Failure: Forbidden Script / HTML Injection Attempt',
    category: 'failure',
    description: 'Demonstrates runtime schema validation blocking forbidden properties like dangerouslySetInnerHTML.',
    promptExample: 'Inject custom raw HTML script tags into element content.',
    recommendedScope: 'base',
    isFailureDemo: true,
  },
  {
    id: 'failure_unsupported_prompt',
    label: '6d. Safe Failure: Ambiguous / Unsupported AI Instruction',
    category: 'failure',
    description: 'Demonstrates graceful error boundary feedback when user instruction cannot be deterministically mapped.',
    promptExample: 'Turn the website into a 3D video game engine.',
    recommendedScope: 'base',
    isFailureDemo: true,
  },
];

/**
 * Deterministic AI Scenario Engine
 * Takes user instruction, selected element IDs, active scope, and current template state.
 * Returns a typed proposal bundle (or validation error) without mutating template state.
 */
export function generateDeterministicProposal(
  instruction: string,
  selectedIds: string[],
  scope: ResponsiveScope,
  template: TemplateModel
): { bundle: AiProposalBundle; validationErrors: string[] } {
  const normInstruction = instruction.toLowerCase().trim();
  const bundleId = `prop_bundle_${Date.now()}`;
  const now = new Date().toISOString();

  // Guard: Selection required
  if (selectedIds.length === 0) {
    const errorBundle: AiProposalBundle = {
      id: bundleId,
      instruction,
      scope,
      targetElementIds: [],
      scenarioKey: 'error_no_selection',
      timestamp: now,
      proposals: [],
      isFailureDemo: true,
      errorMessage: 'Selection Authority Error: Please select at least one element on the canvas or sidebar before requesting an AI edit.',
    };
    return { bundle: errorBundle, validationErrors: ['No elements selected.'] };
  }

  // Check for Failure Demos triggered either by prompt keywords or specific scenario tests
  if (normInstruction.includes('unselected') || normInstruction.includes('unauthorized') || normInstruction.includes('footer while only')) {
    // Deliberately fabricate an unselected element target to prove safety validator catches it
    const allIds = Object.keys(template.elements);
    const unselectedId = allIds.find(id => !selectedIds.includes(id)) || 'unselected_external_footer';
    
    const unselectedProposal: AiElementProposal = {
      elementId: unselectedId,
      elementName: template.elements[unselectedId]?.name || 'Unselected Footer Block',
      scope,
      baseRevision: 1,
      before: { styles: {}, content: {} },
      after: { styles: { backgroundColor: '#ff0000' }, content: { text: 'Compromised unauthorized text' } },
      changesSummary: ['Unauthorized modification attempt'],
      status: 'rejected',
    };

    const bundle: AiProposalBundle = {
      id: bundleId,
      instruction,
      scope,
      targetElementIds: selectedIds,
      scenarioKey: 'failure_unselected_target',
      timestamp: now,
      proposals: [unselectedProposal],
      isFailureDemo: true,
      errorMessage: `Selection Authority Blocked: AI attempted to patch unselected target ID "${unselectedId}". The proposal has been safely discarded.`,
    };

    const valResult = validateAiProposalBundle(template, selectedIds, bundle);
    return { bundle, validationErrors: valResult.errors };
  }

  if (normInstruction.includes('forbidden') || normInstruction.includes('inject') || normInstruction.includes('script') || normInstruction.includes('html tag')) {
    const targetId = selectedIds[0];
    const targetEl = template.elements[targetId];
    const bundle: AiProposalBundle = {
      id: bundleId,
      instruction,
      scope,
      targetElementIds: selectedIds,
      scenarioKey: 'failure_invalid_field',
      timestamp: now,
      proposals: [{
        elementId: targetId,
        elementName: targetEl?.name || targetId,
        scope,
        baseRevision: targetEl?.revision || 1,
        before: { styles: targetEl?.baseStyles || {}, content: targetEl?.baseContent || {} },
        after: {
          styles: { textColor: '#ffffff', dangerouslySetInnerHTML: '<script>alert(1)</script>' } as any,
          content: { text: 'Injected malicious content' },
        },
        changesSummary: ['Attempted to inject forbidden property dangerouslySetInnerHTML'],
        status: 'rejected',
      }],
      isFailureDemo: true,
      errorMessage: 'Schema Validator Blocked: Proposal contained forbidden property key "dangerouslySetInnerHTML".',
    };

    const valResult = validateAiProposalBundle(template, selectedIds, bundle);
    return { bundle, validationErrors: valResult.errors };
  }

  if (normInstruction.includes('stale') || normInstruction.includes('revision 0')) {
    const targetId = selectedIds[0];
    const targetEl = template.elements[targetId];
    const bundle: AiProposalBundle = {
      id: bundleId,
      instruction,
      scope,
      targetElementIds: selectedIds,
      scenarioKey: 'failure_stale_revision',
      timestamp: now,
      proposals: [{
        elementId: targetId,
        elementName: targetEl?.name || targetId,
        scope,
        baseRevision: 0, // Deliberately stale
        before: { styles: targetEl?.baseStyles || {}, content: targetEl?.baseContent || {} },
        after: { styles: { ...targetEl?.baseStyles, fontSize: '32px' }, content: targetEl?.baseContent || {} },
        changesSummary: ['Stale revision modification'],
        status: 'rejected',
      }],
      isFailureDemo: true,
      warnings: [`Element "${targetEl?.name}" current revision is ${targetEl?.revision}, but proposal was prepared against stale revision 0.`],
      errorMessage: 'Stale Revision Detected: Current element state has evolved since this proposal was requested.',
    };
    return { bundle, validationErrors: [] };
  }

  if (normInstruction.includes('video game') || normInstruction.includes('3d') || normInstruction.includes('unsupported')) {
    const bundle: AiProposalBundle = {
      id: bundleId,
      instruction,
      scope,
      targetElementIds: selectedIds,
      scenarioKey: 'failure_unsupported_prompt',
      timestamp: now,
      proposals: [],
      isFailureDemo: true,
      errorMessage: 'Unsupported Instruction: The deterministic AI engine cannot map this instruction to valid template styles or content fields. Please specify content, style, layout, or responsive modifications.',
    };
    return { bundle, validationErrors: ['Instruction unsupported by schema.'] };
  }

  // --- DETERMINISTIC SCENARIO MAPPING ---
  const proposals: AiElementProposal[] = [];

  for (const elementId of selectedIds) {
    const element = template.elements[elementId];
    if (!element) continue;

    const beforeStyles = { ...element.baseStyles };
    const beforeContent = { ...element.baseContent };
    let afterStyles: ElementStyles = { ...beforeStyles };
    let afterContent: ElementContent = { ...beforeContent };
    const changesSummary: string[] = [];

    // Path 1: Content Rewrite (Punchy / Conversion)
    if (normInstruction.includes('punchy') || normInstruction.includes('energy') || normInstruction.includes('craft') || normInstruction.includes('rewrite')) {
      if (element.type === 'hero' || element.type === 'heading') {
        afterContent.title = 'Artisanal Mastery in Every Single Cup.';
        afterContent.subtitle = 'Ethically sourced, precision-roasted single-origin beans delivered fresh to your door daily.';
        changesSummary.push('Headline updated to punchy, craft-focused message');
        changesSummary.push('Subtitle sharpened for value proposition');
      } else if (element.type === 'button') {
        afterContent.buttonText = 'Claim Fresh Roast ➔';
        changesSummary.push('Button CTA updated to active verb');
      } else if (element.type === 'card' || element.type === 'container') {
        afterContent.title = 'Single-Origin Reserve';
        afterContent.subtitle = 'Limited release micro-lots curated by master roasters.';
        changesSummary.push('Card text rewritten for premium clarity');
      } else {
        afterContent.text = 'Handcrafted with unyielding dedication to flavor, sustainability, and quality.';
        changesSummary.push('Body copy condensed and invigorated');
      }
    }
    // Path 1b: Translation (Spanish)
    else if (normInstruction.includes('spanish') || normInstruction.includes('translate') || normInstruction.includes('espanol')) {
      if (element.type === 'hero' || element.type === 'heading') {
        afterContent.title = 'Café Artesanal de Especialidad y Excelencia';
        afterContent.subtitle = 'Granos selectos tostados a mano diariamente con envío directo a tu hogar.';
        changesSummary.push('Traducido título y subtítulo al español');
      } else if (element.type === 'button') {
        afterContent.buttonText = 'Ordenar Ahora ➔';
        changesSummary.push('Botón traducido a "Ordenar Ahora"');
      } else if (element.type === 'badge') {
        afterContent.badge = 'Tostado Diario';
        changesSummary.push('Badge traducido a "Tostado Diario"');
      } else {
        afterContent.text = 'Elaborado artesanalmente con pasión por el sabor excepcional y la sostenibilidad.';
        changesSummary.push('Texto traducido al español');
      }
    }
    // Path 2: Dark Emerald Luxury Theme
    else if (normInstruction.includes('emerald') || normInstruction.includes('luxury') || normInstruction.includes('gold') || normInstruction.includes('dark')) {
      afterStyles.backgroundColor = '#06281e';
      afterStyles.textColor = '#f0fdf4';
      afterStyles.borderColor = '#d4aa4f';
      afterStyles.borderRadius = '1rem';
      afterStyles.boxShadow = '0 10px 30px -5px rgba(212, 170, 79, 0.15)';
      changesSummary.push('Applied Deep Emerald background (#06281e)');
      changesSummary.push('Applied Gold accent border (#d4aa4f)');
      changesSummary.push('Enhanced ambient box shadow');
    }
    // Path 2b: Glowing Neon CTA Buttons
    else if (normInstruction.includes('glowing') || normInstruction.includes('neon') || normInstruction.includes('pill') || (normInstruction.includes('button') && normInstruction.includes('style'))) {
      afterStyles.backgroundColor = '#c59132';
      afterStyles.textColor = '#0f172a';
      afterStyles.borderRadius = '9999px';
      afterStyles.fontWeight = '700';
      afterStyles.boxShadow = '0 0 25px 4px rgba(197, 145, 50, 0.6)';
      changesSummary.push('Rounded to pill shape (9999px radius)');
      changesSummary.push('Added intense golden glow shadow');
      changesSummary.push('Set bold contrasting text');
    }
    // Path 3: Move / Resize / Reorder / Spacing
    else if (normInstruction.includes('center') || normInstruction.includes('padding') || normInstruction.includes('reorder') || normInstruction.includes('spacing') || normInstruction.includes('size')) {
      afterStyles.textAlign = 'center';
      afterStyles.padding = '5rem 2rem';
      afterStyles.maxWidth = '900px';
      afterStyles.margin = '0 auto';
      changesSummary.push('Centered text alignment');
      changesSummary.push('Expanded padding to 5rem vertical');
      changesSummary.push('Centered container with max-width 900px');
    }
    // Path 4: One-Viewport Responsive Adjustment (e.g. Mobile)
    else if (normInstruction.includes('mobile') || normInstruction.includes('viewport') || scope === 'mobile') {
      afterStyles.fontSize = '22px';
      afterStyles.padding = '1.25rem 1rem';
      afterStyles.gap = '1rem';
      afterStyles.flexDirection = 'column';
      changesSummary.push('Mobile-only: Scaled font size to 22px');
      changesSummary.push('Mobile-only: Compacted padding to 1.25rem');
      changesSummary.push('Mobile-only: Forced vertical stacked layout');
    }
    // Path 5: Multi-Element Glassmorphism Cards
    else if (normInstruction.includes('glass') || normInstruction.includes('card') || selectedIds.length > 1) {
      afterStyles.backgroundColor = 'rgba(15, 23, 42, 0.75)';
      afterStyles.backdropBlur = '12px';
      afterStyles.borderColor = 'rgba(212, 170, 79, 0.35)';
      afterStyles.border = '1px solid rgba(212, 170, 79, 0.35)';
      afterStyles.borderRadius = '1.25rem';
      afterStyles.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.37)';
      changesSummary.push('Applied frosted glass background with backdrop blur');
      changesSummary.push('Added subtle gold hairline border');
      changesSummary.push('Enhanced ambient depth shadow');
    }
    // Fallback sensible modern enhancement
    else {
      afterStyles.borderColor = '#c59132';
      afterStyles.borderRadius = '0.75rem';
      changesSummary.push('Applied refined accent border and rounded geometry');
    }

    proposals.push({
      elementId,
      elementName: element.name,
      scope,
      baseRevision: element.revision,
      before: { styles: beforeStyles, content: beforeContent },
      after: { styles: afterStyles, content: afterContent },
      changesSummary,
      status: 'pending',
    });
  }

  const bundle: AiProposalBundle = {
    id: bundleId,
    instruction,
    scope,
    targetElementIds: selectedIds,
    scenarioKey: 'custom_generated',
    timestamp: now,
    proposals,
    isFailureDemo: false,
  };

  const validationResult = validateAiProposalBundle(template, selectedIds, bundle);
  return { bundle, validationErrors: validationResult.errors };
}
