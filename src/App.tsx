import React, { useCallback } from 'react';
import { useEditorState } from './store/useEditorStore';
import { TopNav } from './components/editor/TopNav';
import { Sidebar } from './components/editor/Sidebar';
import { CanvasRoot } from './components/canvas/CanvasRoot';
import { PropertyInspector } from './components/editor/PropertyInspector';
import { CodeEditorPanel } from './components/editor/CodeEditorPanel';
import { AiDemoModal } from './components/editor/AiDemoModal';
import { ProposalReviewDrawer } from './components/editor/ProposalReviewDrawer';
import { ElementRecoveryModal } from './components/editor/ElementRecoveryModal';
import { AddedCapabilityBanner } from './components/editor/AddedCapabilityBanner';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ViewportId } from './types/template';

export function App() {
  const {
    template,
    historyJournal,
    activeViewport,
    activeScope,
    viewMode,
    selectedIds,
    activeProposalBundle,
    isAiModalOpen,
    isRecoveryModalOpen,
    isProposalDrawerOpen,
    toast,
    setActiveViewport,
    setActiveScope,
    setViewMode,
    setIsAiModalOpen,
    setIsRecoveryModalOpen,
    setIsProposalDrawerOpen,
    selectElement,
    selectMultipleElements,
    clearSelection,
    commitDirectProperty,
    commitEdit,
    commitCodeJson,
    requestAiProposal,
    acceptProposalElement,
    rejectProposalElement,
    acceptAllProposals,
    rejectAllProposals,
    restoreHistorySnapshot,
    resetToDefaultTemplate,
    showToast,
  } = useEditorState();

  const pendingProposalCount = activeProposalBundle
    ? activeProposalBundle.proposals.filter(p => p.status === 'pending').length
    : 0;

  // Custom addition: Promote Viewport Override to Universal Base
  const handlePromoteOverrideToBase = useCallback((elementId: string, viewport: ViewportId) => {
    const el = template.elements[elementId];
    if (!el || !el.overrides[viewport]) return;

    const vpOverride = el.overrides[viewport];
    commitEdit([
      {
        elementId,
        styles: vpOverride?.styles,
        content: vpOverride?.content,
      }
    ], `Promoted ${viewport} override to universal Base`, 'canvas');

    showToast(`Promoted ${viewport} override on "${el.name}" to universal Base!`, 'success');
  }, [template, commitEdit, showToast]);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Global Navigation Top Bar */}
      <TopNav
        activeViewport={activeViewport}
        setActiveViewport={setActiveViewport}
        activeScope={activeScope}
        setActiveScope={setActiveScope}
        viewMode={viewMode}
        setViewMode={setViewMode}
        selectedCount={selectedIds.length}
        openAiModal={() => setIsAiModalOpen(true)}
        openRecoveryModal={() => setIsRecoveryModalOpen(true)}
        openProposalDrawer={() => setIsProposalDrawerOpen(true)}
        hasActiveProposals={Boolean(activeProposalBundle && activeProposalBundle.proposals.length > 0)}
        pendingProposalCount={pendingProposalCount}
        onReset={resetToDefaultTemplate}
      />

      {/* 2. Main Workbench Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Hierarchy Sidebar */}
        <Sidebar
          template={template}
          selectedIds={selectedIds}
          activeViewport={activeViewport}
          onSelectElement={selectElement}
          onSelectMultiple={selectMultipleElements}
          onClearSelection={clearSelection}
        />

        {/* Center Workspace (Canvas / Code / Split) */}
        <main className="flex-1 flex overflow-hidden relative">
          {(viewMode === 'canvas' || viewMode === 'split') && (
            <CanvasRoot
              template={template}
              activeViewport={activeViewport}
              activeScope={activeScope}
              selectedIds={selectedIds}
              onSelectElement={selectElement}
              onSelectMultiple={selectMultipleElements}
              onClearSelection={clearSelection}
              onUpdateContent={(elementId, key, val) =>
                commitDirectProperty(elementId, 'content', key, val)
              }
            />
          )}

          {(viewMode === 'code' || viewMode === 'split') && (
            <CodeEditorPanel
              template={template}
              selectedIds={selectedIds}
              onCommitCode={commitCodeJson}
            />
          )}
        </main>

        {/* Right Property Inspector Panel */}
        <PropertyInspector
          template={template}
          selectedIds={selectedIds}
          activeViewport={activeViewport}
          activeScope={activeScope}
          setActiveScope={setActiveScope}
          onCommitProperty={commitDirectProperty}
          onCommitBatch={(patches, desc) => commitEdit(patches, desc, 'canvas')}
        />
      </div>

      {/* 3. Added Innovation Footer Banner */}
      <AddedCapabilityBanner
        template={template}
        selectedIds={selectedIds}
        activeViewport={activeViewport}
        onPromoteOverrideToBase={handlePromoteOverrideToBase}
      />

      {/* 4. Modals and Drawers */}
      <AiDemoModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        selectedIds={selectedIds}
        template={template}
        activeScope={activeScope}
        onRequestProposal={requestAiProposal}
      />

      <ProposalReviewDrawer
        isOpen={isProposalDrawerOpen}
        onClose={() => setIsProposalDrawerOpen(false)}
        proposalBundle={activeProposalBundle}
        onAcceptElement={acceptProposalElement}
        onRejectElement={rejectProposalElement}
        onAcceptAll={acceptAllProposals}
        onRejectAll={rejectAllProposals}
      />

      <ElementRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
        template={template}
        historyJournal={historyJournal}
        selectedIds={selectedIds}
        onRestore={restoreHistorySnapshot}
      />

      {/* 5. Toast Notification Portal */}
      {toast && (
        <div className="fixed bottom-12 right-6 z-50 animate-bounce-short">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-2xl border text-xs font-medium backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 text-amber-200 border-amber-700'
                : toast.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-700'
                : 'bg-slate-900/90 text-slate-200 border-slate-700'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
