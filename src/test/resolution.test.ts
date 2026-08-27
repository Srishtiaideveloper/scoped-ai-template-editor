import { describe, it, expect } from 'vitest';
import { resolveElement, isPropertyOverridden, getPropertyOrigin } from '../core/resolutionEngine';
import { TemplateElement } from '../types/template';

describe('Viewport Resolution & Inheritance Engine', () => {
  const baseElement: TemplateElement = {
    id: 'hero_1',
    type: 'hero',
    parentId: null,
    name: 'Main Hero',
    revision: 1,
    updatedAt: new Date().toISOString(),
    baseStyles: {
      fontSize: '48px',
      backgroundColor: '#000000',
      textColor: '#ffffff',
    },
    baseContent: {
      title: 'Universal Coffee Roasters',
      subtitle: 'Best coffee in town',
    },
    overrides: {
      mobile: {
        styles: {
          fontSize: '24px', // Mobile overrides font size
        },
        content: {
          title: 'Mobile Coffee', // Mobile overrides title
        },
      },
    },
  };

  it('resolves base styles and content when no override exists (Desktop View)', () => {
    const resolvedDesktop = resolveElement(baseElement, 'desktop');
    expect(resolvedDesktop.styles.fontSize).toBe('48px');
    expect(resolvedDesktop.styles.backgroundColor).toBe('#000000');
    expect(resolvedDesktop.content.title).toBe('Universal Coffee Roasters');
    expect(resolvedDesktop.content.subtitle).toBe('Best coffee in town');
    expect(resolvedDesktop.hasOverrides.desktop).toBe(false);
  });

  it('resolves base styles and content for Tablet View inheriting Base', () => {
    const resolvedTablet = resolveElement(baseElement, 'tablet');
    expect(resolvedTablet.styles.fontSize).toBe('48px');
    expect(resolvedTablet.content.title).toBe('Universal Coffee Roasters');
  });

  it('correctly applies Mobile-only overrides while preserving untouched base properties', () => {
    const resolvedMobile = resolveElement(baseElement, 'mobile');
    expect(resolvedMobile.styles.fontSize).toBe('24px'); // Overridden
    expect(resolvedMobile.content.title).toBe('Mobile Coffee'); // Overridden
    expect(resolvedMobile.styles.backgroundColor).toBe('#000000'); // Inherited from base
    expect(resolvedMobile.content.subtitle).toBe('Best coffee in town'); // Inherited from base
    expect(resolvedMobile.hasOverrides.mobile).toBe(true);
  });

  it('correctly identifies property override origins', () => {
    expect(isPropertyOverridden(baseElement, 'mobile', 'styles', 'fontSize')).toBe(true);
    expect(isPropertyOverridden(baseElement, 'mobile', 'styles', 'backgroundColor')).toBe(false);
    expect(isPropertyOverridden(baseElement, 'desktop', 'styles', 'fontSize')).toBe(false);

    const originMobileFont = getPropertyOrigin(baseElement, 'mobile', 'styles', 'fontSize');
    expect(originMobileFont.isOverridden).toBe(true);
    expect(originMobileFont.source).toBe('mobile');
    expect(originMobileFont.value).toBe('24px');

    const originMobileBg = getPropertyOrigin(baseElement, 'mobile', 'styles', 'backgroundColor');
    expect(originMobileBg.isOverridden).toBe(false);
    expect(originMobileBg.source).toBe('base');
    expect(originMobileBg.value).toBe('#000000');
  });
});
