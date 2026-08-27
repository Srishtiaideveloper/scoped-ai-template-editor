import React from 'react';
import {
  AiProposalBundle,
  AiElementProposal,
  ResponsiveScope
} from '../../types/template';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  X,
  Layers
} from 'lucide-react';

interface ProposalReviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  proposalBundle: AiProposalBundle | null;
  onAcceptElement: (elementId: string) => void;
  onRejectElement: (elementId: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
}

export const ProposalReviewDrawer: React.FC<ProposalReviewDrawerProps> = ({
  isOpen,
  onClose,
  proposalBundle,
  onAcceptElement,
  onRejectElement,
  onAcceptAll,
  onRejectAll,
}) => {
  if (!isOpen || !proposalBundle) return null;

  const { proposals, instruction, scope, isFailureDemo, errorMessage } = proposalBundle;
  const pendingCount = proposals.filter(p => p.status === 'pending').length;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              AI PROPOSAL STAGING REVIEW
              <span className="text-[10px] bg-slate-800 text-amber-400 px-1.5 py-0.2 rounded font-mono">
                {proposals.length} Elements
              </span>
            </h2>
            <p className="text-[10px] text-slate-400 truncate max-w-sm">
              "{instruction}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <>
              <button
                onClick={onAcceptAll}
                className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-2.5 py-1 rounded text-xs transition"
              >
                Accept All ({pendingCount})
              </button>
              <button
                onClick={onRejectAll}
                className="bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 px-2 py-1 rounded text-xs transition border border-slate-700"
              >
                Reject All
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scope banner */}
      <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px] flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          Target Scope: <strong className="text-amber-300 uppercase">{scope}</strong>
        </span>
        <span className="text-[10px] text-slate-500 font-mono">
          Nothing changes until you explicitly accept.
        </span>
      </div>

      {/* Failure Demo / Error Notice */}
      {isFailureDemo && (
        <div className="m-4 p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-200 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Safe Failure Demo Triggered</span>
          </div>
          <p className="text-[11px] text-red-300">
            {errorMessage || 'The safe scenario engine blocked this invalid operation to preserve template integrity.'}
          </p>
        </div>
      )}

      {/* Proposals List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {proposals.map((proposal) => {
          const isPending = proposal.status === 'pending';
          const isAccepted = proposal.status === 'accepted';
          const isRejected = proposal.status === 'rejected';

          return (
            <div
              key={proposal.elementId}
              className={`border rounded-xl p-3.5 transition ${
                isAccepted
                  ? 'bg-emerald-950/20 border-emerald-800/60'
                  : isRejected
                  ? 'bg-red-950/10 border-red-900/40 opacity-60'
                  : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/50'
              }`}
            >
              {/* Proposal Element Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-200">
                    {proposal.elementName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    #{proposal.elementId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isAccepted && (
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Accepted
                    </span>
                  )}
                  {isRejected && (
                    <span className="text-[10px] bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Rejected
                    </span>
                  )}
                  {isPending && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onAcceptElement(proposal.elementId)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-3 py-1 rounded text-xs transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => onRejectElement(proposal.elementId)}
                        className="bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300 px-2.5 py-1 rounded text-xs transition border border-slate-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Changes Summary Pills */}
              <div className="flex flex-wrap gap-1 mb-3">
                {proposal.changesSummary.map((sum, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded"
                  >
                    ✓ {sum}
                  </span>
                ))}
              </div>

              {/* Side-by-side Before vs After Diff Preview */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                {/* Before */}
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    Current (Before)
                  </div>
                  {proposal.before.content.title && (
                    <div className="text-slate-400 truncate">
                      <strong className="text-slate-500">title:</strong> {proposal.before.content.title}
                    </div>
                  )}
                  {proposal.before.styles.backgroundColor && (
                    <div className="text-slate-400 flex items-center gap-1 truncate">
                      <strong className="text-slate-500">bg:</strong>
                      <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-700" style={{ backgroundColor: proposal.before.styles.backgroundColor }} />
                      {proposal.before.styles.backgroundColor}
                    </div>
                  )}
                </div>

                {/* After */}
                <div className="bg-slate-900 p-2.5 rounded-lg border border-amber-500/30 space-y-1 bg-amber-950/10">
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Proposed (After)
                  </div>
                  {proposal.after.content.title && (
                    <div className="text-amber-200 truncate">
                      <strong className="text-amber-500">title:</strong> {proposal.after.content.title}
                    </div>
                  )}
                  {proposal.after.styles.backgroundColor && (
                    <div className="text-amber-200 flex items-center gap-1 truncate">
                      <strong className="text-amber-500">bg:</strong>
                      <span className="w-2.5 h-2.5 rounded-full inline-block border border-slate-700" style={{ backgroundColor: proposal.after.styles.backgroundColor }} />
                      {proposal.after.styles.backgroundColor}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
