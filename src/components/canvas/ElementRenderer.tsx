import React, { useState } from 'react';
import {
  ResolvedElement,
  ViewportId,
  ResponsiveScope
} from '../../types/template';
import { Sparkles, Edit3, MoveUp, MoveDown, Layers } from 'lucide-react';

interface ElementRendererProps {
  element: ResolvedElement;
  isSelected: boolean;
  activeViewport: ViewportId;
  activeScope: ResponsiveScope;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent: (key: string, value: string) => void;
  children?: React.ReactNode;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  activeViewport,
  activeScope,
  onSelect,
  onUpdateContent,
  children,
}) => {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [tempText, setTempText] = useState('');

  const { styles, content } = element;

  // Convert typed styles object to React.CSSProperties
  const inlineStyles: React.CSSProperties = {
    color: styles.textColor,
    backgroundColor: styles.backgroundColor,
    fontSize: styles.fontSize,
    fontWeight: styles.fontWeight,
    lineHeight: styles.lineHeight,
    letterSpacing: styles.letterSpacing,
    padding: styles.padding,
    margin: styles.margin,
    borderRadius: styles.borderRadius,
    border: styles.border || (styles.borderColor ? `1px solid ${styles.borderColor}` : undefined),
    textAlign: styles.textAlign,
    display: styles.display,
    flexDirection: styles.flexDirection,
    alignItems: styles.alignItems,
    justifyContent: styles.justifyContent,
    gridTemplateColumns: styles.gridColumns,
    gap: styles.gap,
    width: styles.width,
    maxWidth: styles.maxWidth,
    height: styles.height,
    boxShadow: styles.boxShadow,
    opacity: styles.opacity,
    backdropFilter: styles.backdropBlur ? `blur(${styles.backdropBlur})` : undefined,
  };

  const handleDoubleClick = (e: React.MouseEvent, initialText: string) => {
    e.stopPropagation();
    setTempText(initialText);
    setIsInlineEditing(true);
  };

  const saveInlineEdit = (key: string) => {
    setIsInlineEditing(false);
    if (tempText !== undefined) {
      onUpdateContent(key, tempText);
    }
  };

  return (
    <div
      data-element-id={element.id}
      onClick={onSelect}
      style={inlineStyles}
      className={`relative transition-all duration-150 group cursor-pointer ${
        isSelected
          ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-slate-950 z-20'
          : 'hover:ring-1 hover:ring-amber-500/40 hover:ring-offset-1 hover:ring-offset-slate-900'
      }`}
      tabIndex={0}
      role="region"
      aria-label={`${element.name} (${element.type})`}
    >
      {/* Selection Tag Banner */}
      {isSelected && (
        <div className="absolute -top-7 left-0 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-t-md flex items-center gap-1.5 shadow-md z-30 select-none pointer-events-none">
          <span>{element.name}</span>
          <span className="opacity-75 font-mono text-[9px]">#{element.id}</span>
          {element.hasOverrides[activeViewport] && (
            <span className="bg-slate-950 text-amber-400 px-1 py-0.2 rounded text-[8px] font-sans">
              Override
            </span>
          )}
        </div>
      )}

      {/* Render Component Content based on Element Type */}
      {element.type === 'navbar' && (
        <div className="flex items-center justify-between w-full">
          <div
            className="text-lg font-bold tracking-tight cursor-text"
            onDoubleClick={(e) => handleDoubleClick(e, content.title || '')}
          >
            {isInlineEditing ? (
              <input
                type="text"
                value={tempText}
                autoFocus
                onChange={(e) => setTempText(e.target.value)}
                onBlur={() => saveInlineEdit('title')}
                onKeyDown={(e) => e.key === 'Enter' && saveInlineEdit('title')}
                className="bg-slate-900 text-amber-300 px-2 py-1 rounded border border-amber-500 focus:outline-none"
              />
            ) : (
              content.title
            )}
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            {content.items?.map((item, idx) => (
              <span key={idx} className="hover:text-amber-400 transition cursor-pointer">
                {item}
              </span>
            ))}
          </div>

          {content.buttonText && (
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm">
              {content.buttonText}
            </button>
          )}
        </div>
      )}

      {element.type === 'hero' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          {content.badge && (
            <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              {content.badge}
            </div>
          )}

          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 max-w-3xl leading-tight"
            onDoubleClick={(e) => handleDoubleClick(e, content.title || '')}
          >
            {isInlineEditing ? (
              <textarea
                value={tempText}
                autoFocus
                onChange={(e) => setTempText(e.target.value)}
                onBlur={() => saveInlineEdit('title')}
                className="w-full bg-slate-900 text-amber-300 p-2 rounded border border-amber-500 focus:outline-none text-2xl"
                rows={2}
              />
            ) : (
              content.title
            )}
          </h1>

          <p
            className="text-base sm:text-lg text-slate-400 max-w-2xl font-light"
            onDoubleClick={(e) => handleDoubleClick(e, content.subtitle || '')}
          >
            {content.subtitle}
          </p>

          {content.buttonText && (
            <div className="pt-4">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-sm shadow-glow transition active:scale-95">
                {content.buttonText}
              </button>
            </div>
          )}
        </div>
      )}

      {element.type === 'grid' && (
        <div className="w-full space-y-6">
          {(content.title || content.subtitle) && (
            <div className="text-center space-y-2 mb-6">
              {content.title && <h2 className="text-2xl font-bold text-slate-100">{content.title}</h2>}
              {content.subtitle && <p className="text-sm text-slate-400 max-w-xl mx-auto">{content.subtitle}</p>}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: styles.gridColumns, gap: styles.gap }}>
            {children}
          </div>
        </div>
      )}

      {element.type === 'card' && (
        <div className="flex flex-col justify-between h-full space-y-3">
          {content.badge && (
            <div className="self-start text-[11px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 px-2.5 py-0.5 rounded-md">
              {content.badge}
            </div>
          )}

          <div>
            {content.title && (
              <h3 className="text-lg font-bold text-slate-100 mb-1">
                {content.title}
              </h3>
            )}
            {content.tagline && (
              <div className="text-xs text-amber-400 font-mono mb-2">
                {content.tagline}
              </div>
            )}
            {content.price && (
              <div className="text-xl font-extrabold text-amber-300 font-mono my-2">
                {content.price}
              </div>
            )}
            {content.text && (
              <p className="text-xs text-slate-300 leading-relaxed font-light">
                {content.text}
              </p>
            )}
          </div>

          {content.buttonText && (
            <button className="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700 py-2 rounded-lg text-xs font-semibold transition mt-3">
              {content.buttonText}
            </button>
          )}
        </div>
      )}

      {element.type === 'section' && (
        <div className="w-full space-y-4">
          {(content.title || content.subtitle) && (
            <div className="text-center space-y-2 mb-6">
              {content.badge && (
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-full">
                  {content.badge}
                </span>
              )}
              {content.title && <h2 className="text-3xl font-extrabold text-slate-100">{content.title}</h2>}
              {content.subtitle && <p className="text-sm text-slate-400 max-w-xl mx-auto">{content.subtitle}</p>}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {children}
          </div>
        </div>
      )}

      {element.type === 'testimonial' && (
        <div className="flex flex-col items-center text-center space-y-3">
          {content.badge && (
            <div className="text-xs font-semibold text-amber-400">
              {content.badge}
            </div>
          )}
          <blockquote className="text-lg sm:text-xl font-serif italic text-slate-200 leading-relaxed">
            {content.title}
          </blockquote>
          <cite className="text-xs text-amber-400 font-medium not-italic">
            {content.subtitle}
          </cite>
        </div>
      )}

      {element.type === 'container' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          {content.title && <h2 className="text-2xl font-bold text-amber-200">{content.title}</h2>}
          {content.subtitle && <p className="text-sm text-amber-100/80 max-w-lg text-center">{content.subtitle}</p>}
          {content.buttonText && (
            <button className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs shadow-md transition">
              {content.buttonText}
            </button>
          )}
        </div>
      )}

      {element.type === 'footer' && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
            {content.items?.map((item, i) => (
              <span key={i} className="hover:text-slate-200 cursor-pointer">{item}</span>
            ))}
          </div>
          <div className="text-xs text-slate-500">
            {content.text}
          </div>
        </div>
      )}
    </div>
  );
};
