import React, { useState } from 'react';
import {
  ResolvedElement,
  ViewportId,
  ResponsiveScope
} from '../../types/template';
import { Sparkles, Coffee, Flame, Sprout, PackageCheck, Star, Award, HeartHandshake } from 'lucide-react';

interface ElementRendererProps {
  element: ResolvedElement;
  isSelected: boolean;
  activeViewport: ViewportId;
  activeScope?: ResponsiveScope;
  onSelect: (e: React.MouseEvent) => void;
  onUpdateContent: (key: string, value: string) => void;
  children?: React.ReactNode;
}

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  element,
  isSelected,
  activeViewport,
  onSelect,
  onUpdateContent,
  children,
}) => {
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [tempText, setTempText] = useState('');
  const [imageError, setImageError] = useState(false);

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

  // Safe image component with automatic fallback
  const renderCardMedia = () => {
    if (content.imageUrl && !imageError) {
      return (
        <div className="w-full h-44 rounded-xl overflow-hidden mb-3 relative group/img border border-slate-800/80 shadow-md">
          <img
            src={content.imageUrl}
            alt={content.imageAlt || content.title || 'Specialty Coffee'}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
        </div>
      );
    }

    // Zero-error fallback vector illustrations
    if (element.id.includes('feature_1')) {
      return (
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
          <Sprout className="w-6 h-6" />
        </div>
      );
    }
    if (element.id.includes('feature_2')) {
      return (
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
      );
    }
    if (element.id.includes('feature_3')) {
      return (
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-2">
          <PackageCheck className="w-6 h-6" />
        </div>
      );
    }
    if (element.id.includes('product_card_1')) {
      return (
        <div className="w-full h-36 rounded-lg bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/20 flex flex-col items-center justify-center relative overflow-hidden mb-3">
          <Coffee className="w-10 h-10 text-amber-400 mb-1.5 z-10" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold z-10">
            Washed Micro-Lot
          </span>
        </div>
      );
    }
    if (element.id.includes('product_card_2')) {
      return (
        <div className="w-full h-36 rounded-lg bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col items-center justify-center relative overflow-hidden mb-3">
          <Award className="w-10 h-10 text-amber-300 mb-1.5 z-10 animate-bounce-short" />
          <span className="text-[10px] uppercase font-mono tracking-widest text-amber-200 font-bold z-10">
            Pink Bourbon Reserve
          </span>
        </div>
      );
    }
    return null;
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
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 w-full">
          <div
            className="text-base sm:text-lg font-extrabold tracking-tight cursor-text flex items-center gap-2 text-amber-300 shrink-0"
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

          <div className="hidden lg:flex items-center gap-6 text-sm text-slate-300 shrink-0">
            {content.items?.map((item, idx) => (
              <span key={idx} className="hover:text-amber-400 transition cursor-pointer">
                {item}
              </span>
            ))}
          </div>

          {content.buttonText && (
            <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm shrink-0 whitespace-nowrap">
              {content.buttonText}
            </button>
          )}
        </div>
      )}

      {element.type === 'hero' && (
        <div className="flex flex-col items-center justify-center space-y-4">
          {content.badge && (
            <div className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{content.badge}</span>
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

          {/* REAL MOVING STEAM COFFEE CUP SHOWCASE */}
          <div className="my-4 relative flex flex-col items-center justify-center">
            {/* Ambient Radial Golden Glow */}
            <div className="absolute w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

            {/* Steaming Wisps Rising Above Cup */}
            <div className="relative w-32 h-16 pointer-events-none flex justify-center items-end gap-3 mb-1">
              <div className="w-1.5 h-8 bg-gradient-to-t from-amber-200/60 to-transparent rounded-full blur-[1px] animate-steam-1" />
              <div className="w-2 h-10 bg-gradient-to-t from-white/70 to-transparent rounded-full blur-[1px] animate-steam-2" />
              <div className="w-1.5 h-7 bg-gradient-to-t from-amber-200/50 to-transparent rounded-full blur-[1px] animate-steam-3" />
            </div>

            {/* Real Photographic Steaming Artisan Cup with Glassmorphism Frame */}
            <div className="relative w-72 h-44 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl group/cup">
              <img
                src={content.imageUrl || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'}
                alt="Real artisan pour of steaming specialty coffee"
                loading="eager"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover/cup:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-amber-300">
                <span className="flex items-center gap-1 font-bold">
                  <Coffee className="w-3.5 h-3.5" /> Freshly Brewed Batch #26
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-200 px-1.5 py-0.2 rounded border border-amber-500/30">
                  94°C Extraction
                </span>
              </div>
            </div>
          </div>

          {content.buttonText && (
            <div className="pt-2">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-sm shadow-glow transition active:scale-95 flex items-center gap-2">
                <span>{content.buttonText}</span>
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
          {/* Card Media (Real Photography with Safe Vector Fallback) */}
          {renderCardMedia()}

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
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-950/60 border border-amber-800/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
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
          {content.imageUrl && (
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-lg mb-1">
              <img
                src={content.imageUrl}
                alt="Marcus Vance Q-Grader"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          )}
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
