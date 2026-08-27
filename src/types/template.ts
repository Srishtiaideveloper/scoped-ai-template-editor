// Canonical Data Model for Scoped AI Template Editor

export type ViewportId = 'desktop' | 'tablet' | 'mobile';
export type ResponsiveScope = 'base' | ViewportId;

export type ElementType =
  | 'section'
  | 'container'
  | 'hero'
  | 'heading'
  | 'text'
  | 'button'
  | 'card'
  | 'grid'
  | 'image'
  | 'badge'
  | 'navbar'
  | 'footer'
  | 'testimonial';

export interface ElementStyles {
  textColor?: string;
  backgroundColor?: string;
  fontSize?: string;
  fontWeight?: string;
  lineHeight?: string;
  letterSpacing?: string;
  padding?: string;
  margin?: string;
  borderRadius?: string;
  border?: string;
  borderColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  display?: 'block' | 'flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  gridColumns?: string;
  gap?: string;
  width?: string;
  maxWidth?: string;
  height?: string;
  boxShadow?: string;
  opacity?: string;
  backdropBlur?: string;
  customClass?: string;
}

export interface ElementContent {
  text?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
  imageAlt?: string;
  badge?: string;
  price?: string;
  tagline?: string;
  items?: string[];
  meta?: Record<string, unknown>;
}

export interface ViewportOverride {
  styles?: Partial<ElementStyles>;
  content?: Partial<ElementContent>;
}

export interface TemplateElement {
  id: string;                      // Stable unique ID
  type: ElementType;
  parentId: string | null;
  name: string;                    // Human-readable element label
  baseStyles: ElementStyles;
  baseContent: ElementContent;
  overrides: {
    desktop?: ViewportOverride;
    tablet?: ViewportOverride;
    mobile?: ViewportOverride;
  };
  revision: number;                // Monotonic revision counter
  updatedAt: string;
  isLocked?: boolean;
}

export interface TemplateModel {
  id: string;
  version: string;
  title: string;
  description: string;
  rootElementIds: string[];
  elements: Record<string, TemplateElement>;
  globalSettings: {
    fontFamily: string;
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
  revision: number;
  lastModified: string;
}

// Resolved Element for rendering in a specific viewport
export interface ResolvedElement {
  id: string;
  type: ElementType;
  parentId: string | null;
  name: string;
  styles: ElementStyles;
  content: ElementContent;
  revision: number;
  hasOverrides: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  activeScope: ResponsiveScope;
}

// Edit Commands & History
export type EditSource = 'canvas' | 'code' | 'ai-demo' | 'history-restore' | 'reset';

export interface EditCommand {
  id: string;
  source: EditSource;
  timestamp: string;
  targetElementIds: string[];
  scope: ResponsiveScope;
  baseRevision: number;
  description: string;
  patches: Array<{
    elementId: string;
    styles?: Partial<ElementStyles>;
    content?: Partial<ElementContent>;
    orderIndex?: number;
    newParentId?: string;
  }>;
}

export interface HistoryEntry {
  id: string;
  elementId: string;
  scope: ResponsiveScope;
  revision: number;
  timestamp: string;
  source: EditSource;
  description: string;
  snapshot: {
    baseStyles: ElementStyles;
    baseContent: ElementContent;
    overrides: {
      desktop?: ViewportOverride;
      tablet?: ViewportOverride;
      mobile?: ViewportOverride;
    };
  };
}

// AI Demo Proposal Types
export interface AiElementProposal {
  elementId: string;
  elementName: string;
  scope: ResponsiveScope;
  baseRevision: number;
  before: {
    styles: ElementStyles;
    content: ElementContent;
  };
  after: {
    styles: ElementStyles;
    content: ElementContent;
  };
  changesSummary: string[];
  status: 'pending' | 'accepted' | 'rejected';
}

export interface AiProposalBundle {
  id: string;
  instruction: string;
  scope: ResponsiveScope;
  targetElementIds: string[];
  scenarioKey: string;
  timestamp: string;
  proposals: AiElementProposal[];
  warnings?: string[];
  isFailureDemo?: boolean;
  errorMessage?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
