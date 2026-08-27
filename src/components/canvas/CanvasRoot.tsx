import React, { useRef, useState, useEffect } from 'react';
import {
  TemplateModel,
  ViewportId,
  ResponsiveScope
} from '../../types/template';
import { resolveElement } from '../../core/resolutionEngine';
import { ElementRenderer } from './ElementRenderer';
import { MousePointer, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface CanvasRootProps {
  template: TemplateModel;
  activeViewport: ViewportId;
  activeScope: ResponsiveScope;
  selectedIds: string[];
  onSelectElement: (id: string, isAdditive: boolean) => void;
  onSelectMultiple: (ids: string[], isAdditive: boolean) => void;
  onClearSelection: () => void;
  onUpdateContent: (elementId: string, key: string, value: string) => void;
}

export const CanvasRoot: React.FC<CanvasRootProps> = ({
  template,
  activeViewport,
  activeScope,
  selectedIds,
  onSelectElement,
  onSelectMultiple,
  onClearSelection,
  onUpdateContent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Marquee Drag Selection State
  const [isMarqueeActive, setIsMarqueeActive] = useState(false);
  const [marqueeStart, setMarqueeStart] = useState<{ x: number; y: number } | null>(null);
  const [marqueeCurrent, setMarqueeCurrent] = useState<{ x: number; y: number } | null>(null);

  // Viewport Device Frame Widths
  const getViewportWidth = (vp: ViewportId): string => {
    switch (vp) {
      case 'desktop': return '1200px';
      case 'tablet': return '768px';
      case 'mobile': return '375px';
      default: return '100%';
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start marquee if clicking directly on background container or canvas wrapper
    const target = e.target as HTMLElement;
    if (target.dataset.elementId) return;

    if (e.button !== 0) return; // Left mouse only

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const startPos = {
        x: e.clientX - rect.left + containerRef.current.scrollLeft,
        y: e.clientY - rect.top + containerRef.current.scrollTop,
      };
      setMarqueeStart(startPos);
      setMarqueeCurrent(startPos);
      setIsMarqueeActive(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMarqueeActive || !marqueeStart || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    setMarqueeCurrent({
      x: e.clientX - rect.left + containerRef.current.scrollLeft,
      y: e.clientY - rect.top + containerRef.current.scrollTop,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isMarqueeActive || !marqueeStart || !marqueeCurrent || !containerRef.current) {
      setIsMarqueeActive(false);
      setMarqueeStart(null);
      setMarqueeCurrent(null);
      return;
    }

    const minX = Math.min(marqueeStart.x, marqueeCurrent.x);
    const maxX = Math.max(marqueeStart.x, marqueeCurrent.x);
    const minY = Math.min(marqueeStart.y, marqueeCurrent.y);
    const maxY = Math.max(marqueeStart.y, marqueeCurrent.y);

    // If drag was tiny, treat as clear selection or background click
    if (Math.abs(maxX - minX) < 5 && Math.abs(maxY - minY) < 5) {
      if (!e.shiftKey && !e.ctrlKey && !e.metaKey) {
        onClearSelection();
      }
      setIsMarqueeActive(false);
      setMarqueeStart(null);
      setMarqueeCurrent(null);
      return;
    }

    // Find intersecting element DOM nodes
    const foundIds: string[] = [];
    const containerRect = containerRef.current.getBoundingClientRect();

    const elementNodes = containerRef.current.querySelectorAll('[data-element-id]');
    elementNodes.forEach((node) => {
      const nodeRect = node.getBoundingClientRect();
      const nodeBox = {
        left: nodeRect.left - containerRect.left + containerRef.current!.scrollLeft,
        right: nodeRect.right - containerRect.left + containerRef.current!.scrollLeft,
        top: nodeRect.top - containerRect.top + containerRef.current!.scrollTop,
        bottom: nodeRect.bottom - containerRect.top + containerRef.current!.scrollTop,
      };

      // Check bounding box intersection
      if (
        nodeBox.left < maxX &&
        nodeBox.right > minX &&
        nodeBox.top < maxY &&
        nodeBox.bottom > minY
      ) {
        const id = (node as HTMLElement).dataset.elementId;
        if (id) foundIds.push(id);
      }
    });

    if (foundIds.length > 0) {
      onSelectMultiple(foundIds, e.shiftKey || e.ctrlKey || e.metaKey);
    }

    setIsMarqueeActive(false);
    setMarqueeStart(null);
    setMarqueeCurrent(null);
  };

  // Keyboard navigation for selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        onClearSelection();
      } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        onSelectMultiple(Object.keys(template.elements), false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [template, onClearSelection, onSelectMultiple]);

  // Compute Marquee Box Coordinates
  const marqueeBoxStyle: React.CSSProperties = marqueeStart && marqueeCurrent ? {
    left: `${Math.min(marqueeStart.x, marqueeCurrent.x)}px`,
    top: `${Math.min(marqueeStart.y, marqueeCurrent.y)}px`,
    width: `${Math.abs(marqueeCurrent.x - marqueeStart.x)}px`,
    height: `${Math.abs(marqueeCurrent.y - marqueeStart.y)}px`,
  } : {};

  // Render elements tree
  const rootElements = template.rootElementIds.map(id => template.elements[id]).filter(Boolean);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="flex-1 bg-slate-950 overflow-auto relative p-6 flex flex-col items-center select-none"
    >
      {/* Marquee Selection Drag Overlay */}
      {isMarqueeActive && marqueeStart && marqueeCurrent && (
        <div
          style={marqueeBoxStyle}
          className="absolute border-2 border-amber-500 bg-amber-500/10 pointer-events-none z-50 rounded"
        />
      )}

      {/* Device Frame Wrapper */}
      <div
        ref={canvasRef}
        style={{ width: getViewportWidth(activeViewport) }}
        className={`transition-all duration-300 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto shrink-0 flex flex-col relative ${
          activeViewport === 'mobile' ? 'ring-4 ring-slate-800 rounded-[2.5rem] border-8 border-slate-950 p-2' : ''
        }`}
      >
        {/* Device Top Speaker Notch for Mobile View */}
        {activeViewport === 'mobile' && (
          <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-800 mr-2" />
            <div className="w-8 h-1 rounded-full bg-slate-800" />
          </div>
        )}

        {/* Template Element Render Stream */}
        <div className="w-full flex flex-col space-y-4 p-4">
          {rootElements.map((element) => {
            const resolvedEl = resolveElement(element, activeViewport, activeScope);
            const isSelected = selectedIds.includes(element.id);

            // If it's a container/grid/section with children, render children
            const childElements = Object.values(template.elements).filter(
              (child) => child.parentId === element.id
            );

            return (
              <ElementRenderer
                key={element.id}
                element={resolvedEl}
                isSelected={isSelected}
                activeViewport={activeViewport}
                activeScope={activeScope}
                onSelect={(e) => {
                  e.stopPropagation();
                  onSelectElement(element.id, e.shiftKey || e.ctrlKey || e.metaKey);
                }}
                onUpdateContent={(key, val) => onUpdateContent(element.id, key, val)}
              >
                {childElements.map((child) => {
                  const resolvedChild = resolveElement(child, activeViewport, activeScope);
                  const isChildSelected = selectedIds.includes(child.id);

                  return (
                    <ElementRenderer
                      key={child.id}
                      element={resolvedChild}
                      isSelected={isChildSelected}
                      activeViewport={activeViewport}
                      activeScope={activeScope}
                      onSelect={(e) => {
                        e.stopPropagation();
                        onSelectElement(child.id, e.shiftKey || e.ctrlKey || e.metaKey);
                      }}
                      onUpdateContent={(key, val) => onUpdateContent(child.id, key, val)}
                    />
                  );
                })}
              </ElementRenderer>
            );
          })}
        </div>
      </div>
    </div>
  );
};
