import {
  TemplateElement,
  TemplateModel,
  ViewportId,
  ResolvedElement,
  ElementStyles,
  ElementContent,
  ResponsiveScope
} from '../types/template';

/**
 * Viewport Resolution Engine
 * 
 * Resolution Contract:
 * 1. Base values apply universally across all viewports (desktop, tablet, mobile).
 * 2. Viewport-specific overrides (desktop, tablet, mobile) take precedence for that viewport only.
 * 3. Fallback / Merge Order: Resolved = Merge(Base, Overrides[ActiveViewport])
 * 4. Isolation Guarantee: Modifying an override on viewport V does not affect other viewports or Base.
 */

export function resolveElement(
  element: TemplateElement,
  viewport: ViewportId,
  activeScope: ResponsiveScope = 'base'
): ResolvedElement {
  const override = element.overrides[viewport];

  // Deep clone & merge styles: Base styles are overridden by viewport-specific styles
  const resolvedStyles: ElementStyles = {
    ...element.baseStyles,
    ...(override?.styles || {})
  };

  // Deep clone & merge content: Base content is overridden by viewport-specific content
  const resolvedContent: ElementContent = {
    ...element.baseContent,
    ...(override?.content || {})
  };

  return {
    id: element.id,
    type: element.type,
    parentId: element.parentId,
    name: element.name,
    styles: resolvedStyles,
    content: resolvedContent,
    revision: element.revision,
    hasOverrides: {
      desktop: Boolean(element.overrides.desktop && (Object.keys(element.overrides.desktop.styles || {}).length > 0 || Object.keys(element.overrides.desktop.content || {}).length > 0)),
      tablet: Boolean(element.overrides.tablet && (Object.keys(element.overrides.tablet.styles || {}).length > 0 || Object.keys(element.overrides.tablet.content || {}).length > 0)),
      mobile: Boolean(element.overrides.mobile && (Object.keys(element.overrides.mobile.styles || {}).length > 0 || Object.keys(element.overrides.mobile.content || {}).length > 0)),
    },
    activeScope
  };
}

export function resolveTemplate(
  template: TemplateModel,
  viewport: ViewportId,
  activeScope: ResponsiveScope = 'base'
): Record<string, ResolvedElement> {
  const resolved: Record<string, ResolvedElement> = {};
  for (const [id, el] of Object.entries(template.elements)) {
    resolved[id] = resolveElement(el, viewport, activeScope);
  }
  return resolved;
}

/**
 * Check if a specific property path has an explicit override on a viewport
 */
export function isPropertyOverridden(
  element: TemplateElement,
  viewport: ViewportId,
  kind: 'styles' | 'content',
  key: string
): boolean {
  const override = element.overrides[viewport];
  if (!override) return false;
  if (kind === 'styles' && override.styles) {
    return key in override.styles && override.styles[key as keyof ElementStyles] !== undefined;
  }
  if (kind === 'content' && override.content) {
    return key in override.content && override.content[key as keyof ElementContent] !== undefined;
  }
  return false;
}

/**
 * Get the source value of a property (Base value vs Viewport Override value)
 */
export function getPropertyOrigin(
  element: TemplateElement,
  viewport: ViewportId,
  kind: 'styles' | 'content',
  key: string
): { isOverridden: boolean; source: 'base' | ViewportId; value: unknown } {
  const isOverridden = isPropertyOverridden(element, viewport, kind, key);
  if (isOverridden) {
    const val = kind === 'styles' 
      ? element.overrides[viewport]?.styles?.[key as keyof ElementStyles]
      : element.overrides[viewport]?.content?.[key as keyof ElementContent];
    return { isOverridden: true, source: viewport, value: val };
  }

  const baseVal = kind === 'styles'
    ? element.baseStyles[key as keyof ElementStyles]
    : element.baseContent[key as keyof ElementContent];
  return { isOverridden: false, source: 'base', value: baseVal };
}
