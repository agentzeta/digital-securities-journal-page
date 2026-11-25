import React, { useState } from 'react';
import { COMPLIANCE_DUTIES, LIFECYCLE_STAGES } from '../data/journalData';

export const StandardsWorkbench: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'entitlement' | 'privacy'>('entitlement');
  const [stageIdx, setStageIdx] = useState(1);

  // Brumelle dual-registry exposure calculator state
  const [arrivalRate, setArrivalRate] = useState(100); // transfers/hr
  const [delayHours, setDelayHours] = useState(2); // mean propagation hours
  const [meanSize, setMeanSize] = useState(1000); // mean units
  const [complianceCov, setComplianceCov] = useState(400); // Cov(S, W) unit-hours

  // Disclosure budget adaptive threshold simulator
  const [maxBalance, setMaxBalance] = useState(1_000_000_000);
  const [queries, setQueries] = useState(20);
  const [dpEpsilon, setDpEpsilon] = useState(1.0);
  const [dpSensitivity, setDpSensitivity] = useState(100);
  const [dpAlpha, setDpAlpha] = useState(0.01);

  const stage = LIFECYCLE_STAGES[stageIdx];
  const baseExposure = arrivalRate * delayHours * meanSize;
  const totalExposure = arrivalRate * (delayHours * meanSize + complianceCov);
  const l1Bound = 2 * totalExposure;

  const intervalWidth = maxBalance * Math.pow(2, -queries);
  const dpMargin = (dpSensitivity / dpEpsilon) * Math.log(1 / (2 * dpAlpha));

  return (
    <section className="max-w-6xl mx-auto px-6 py-14" aria-labelledby="standards-heading">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E2DBD0]">
        <div>
          <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
            Proposed Architecture &amp; Working Standards
          </div>
          <h2
            id="standards-heading"
            className="font-display text-3xl sm:text-4xl font-semibold text-[#1C1917] mt-2"
          >
            Institutional Reference Standards
          </h2>
          <p className="text-[#57534E] mt-3 max-w-2xl leading-relaxed">
            Interactive specifications translating our working papers into testable market-structure invariants for custodians, CSDs, and regulatory supervisors.
          </p>
        </div>

        {/* Clean segmented control (functional buttons) */}
        <div className="inline-flex p-1 bg-[#F3EFE6] border border-[#E2DBD0] rounded-md self-start shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('entitlement')}
            className={`px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'entitlement'
                ? 'bg-[#1C1917] text-[#FBF9F5]'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Token Entitlement Governance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-[#1C1917] text-[#FBF9F5]'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Privacy-Preserving Compliance
          </button>
        </div>
      </div>

      {activeTab === 'entitlement' ? (
        <div className="mt-10 space-y-12">
          {/* 1. Six Categories & Guarded Lifecycle */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest text-[#57534E] mb-3">
                01. Corporate-Action State Machine
              </div>
              {LIFECYCLE_STAGES.map((item, idx) => (
                <button
                  key={item.state}
                  type="button"
                  onClick={() => setStageIdx(idx)}
                  className={`w-full text-left p-4 border transition-colors cursor-pointer ${
                    stageIdx === idx
                      ? 'bg-[#F3EFE6] border-[#1C1917]'
                      : 'bg-[#FBF9F5] border-[#E2DBD0] hover:border-[#57534E]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-lg font-semibold text-[#1C1917]">
                      {idx + 1}. {item.state}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#57534E]">
                      {stageIdx === idx ? 'Selected' : 'Inspect'}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 bg-[#F3EFE6] border border-[#E2DBD0] p-7 space-y-6">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-[#1E3A8A]">
                  Active State · {stage.state}
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1.5">
                  State Semantics &amp; Transition Guard
                </h3>
                <p className="text-[#1C1917] mt-3 leading-relaxed">{stage.summary}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-[#E2DBD0]">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-[#57534E]">
                    Transition Guard
                  </div>
                  <p className="text-sm text-[#1C1917] mt-1.5 leading-relaxed">{stage.guard}</p>
                </div>
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-[#57534E]">
                    Enforced Invariant
                  </div>
                  <p className="text-sm text-[#1C1917] mt-1.5 leading-relaxed">{stage.invariant}</p>
                </div>
              </div>

              <div className="pt-5 border-t border-[#E2DBD0]">
                <div className="font-mono text-[11px] uppercase tracking-widest text-[#78350F]">
                  Mutated Right Categories (Out of 6)
                </div>
                <p className="text-sm font-medium text-[#1C1917] mt-1.5">
                  {stage.mutatedCategories.join(' · ')}
                </p>
              </div>
            </div>
          </div>

          {/* 2. Brumelle Covariance-Corrected Exposure Bound */}
          <div className="border-t border-[#E2DBD0] pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5">
                <div className="font-mono text-xs uppercase tracking-widest text-[#57534E]">
                  02. Dual-Registry Exposure Bound
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-2">
                  Brumelle Record-Date Break Estimator
                </h3>
                <p className="text-sm text-[#57534E] mt-3 leading-relaxed">
                  When legacy book-entry ledgers and DLT sub-ledgers propagate transfers concurrently, expected mis-attributed volume at a record-date cutoff scales with arrival rate, mean delay, and size-delay covariance: E[delta] = lambda * (w * s_bar + Cov(S, W)).
                </p>
              </div>

              <div className="lg:col-span-7 bg-[#F3EFE6] border border-[#E2DBD0] p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="font-mono text-xs text-[#57534E]">
                      Transfer Rate lambda (tx/hr): <strong className="text-[#1C1917] tabular-nums">{arrivalRate}</strong>
                    </span>
                    <input
                      type="range"
                      min={10}
                      max={500}
                      step={10}
                      value={arrivalRate}
                      onChange={(e) => setArrivalRate(Number(e.target.value))}
                      className="w-full mt-2 accent-[#1E3A8A]"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-xs text-[#57534E]">
                      Mean Propagation Delay w (hrs): <strong className="text-[#1C1917] tabular-nums">{delayHours}</strong>
                    </span>
                    <input
                      type="range"
                      min={0.5}
                      max={8}
                      step={0.5}
                      value={delayHours}
                      onChange={(e) => setDelayHours(Number(e.target.value))}
                      className="w-full mt-2 accent-[#1E3A8A]"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-xs text-[#57534E]">
                      Mean Transfer Size s_bar (units): <strong className="text-[#1C1917] tabular-nums">{meanSize.toLocaleString()}</strong>
                    </span>
                    <input
                      type="range"
                      min={100}
                      max={5000}
                      step={100}
                      value={meanSize}
                      onChange={(e) => setMeanSize(Number(e.target.value))}
                      className="w-full mt-2 accent-[#1E3A8A]"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-xs text-[#57534E]">
                      Compliance-Hold Cov(S,W): <strong className="text-[#1C1917] tabular-nums">{complianceCov.toLocaleString()}</strong>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={3000}
                      step={100}
                      value={complianceCov}
                      onChange={(e) => setComplianceCov(Number(e.target.value))}
                      className="w-full mt-2 accent-[#78350F]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-[#E2DBD0]">
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#57534E]">
                      Uncorrelated Exposure
                    </div>
                    <div className="font-mono text-xl font-medium text-[#1C1917] tabular-nums mt-1">
                      {Math.round(baseExposure).toLocaleString()} units
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#78350F]">
                      Covariance-Adjusted E[delta]
                    </div>
                    <div className="font-mono text-xl font-medium text-[#78350F] tabular-nums mt-1">
                      {Math.round(totalExposure).toLocaleString()} units
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-[11px] uppercase tracking-wider text-[#1E3A8A]">
                      Max L1 Account Discrepancy
                    </div>
                    <div className="font-mono text-xl font-medium text-[#1E3A8A] tabular-nums mt-1">
                      {Math.round(l1Bound).toLocaleString()} units
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {/* 1. Adaptive Threshold Erosion & DP Tail Bound */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-6 space-y-5">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-[#78350F]">
                  01. Outcome-Leakage Bound
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1.5">
                  Adaptive Threshold Query Erosion
                </h3>
                <p className="text-sm text-[#57534E] mt-2 leading-relaxed">
                  Zero-knowledge hides the witness transcript, not the predicate answer. After T adaptive threshold queries ("balance &ge; q"), an unbudgeted verifier shrinks uncertainty to B &middot; 2^(-T).
                </p>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="font-mono text-xs text-[#57534E]">
                    Upper Balance Bound B: <strong className="text-[#1C1917] tabular-nums">{maxBalance.toLocaleString()}</strong>
                  </span>
                  <select
                    value={maxBalance}
                    onChange={(e) => setMaxBalance(Number(e.target.value))}
                    className="mt-1.5 w-full bg-[#FBF9F5] border border-[#E2DBD0] px-3 py-2 text-sm text-[#1C1917]"
                  >
                    <option value={1_000_000}>1,000,000 units</option>
                    <option value={100_000_000}>100,000,000 units</option>
                    <option value={1_000_000_000}>1,000,000,000 units</option>
                  </select>
                </label>

                <label className="block">
                  <span className="font-mono text-xs text-[#57534E]">
                    Adaptive Queries Issued (T): <strong className="text-[#1C1917] tabular-nums">{queries}</strong>
                  </span>
                  <input
                    type="range"
                    min={1}
                    max={32}
                    value={queries}
                    onChange={(e) => setQueries(Number(e.target.value))}
                    className="w-full mt-2 accent-[#1E3A8A]"
                  />
                </label>
              </div>

              <div className="pt-4 border-t border-[#E2DBD0] flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#57534E]">
                  Remaining Uncertainty Interval
                </span>
                <span className="font-mono text-xl font-medium text-[#1E3A8A] tabular-nums">
                  {intervalWidth >= 1
                    ? `${Math.ceil(intervalWidth).toLocaleString()} units`
                    : `${intervalWidth.toFixed(4)} units (Pinpointed)`}
                </span>
              </div>
            </div>

            <div className="bg-[#F3EFE6] border border-[#E2DBD0] p-6 space-y-5">
              <div>
                <div className="font-mono text-xs uppercase tracking-widest text-[#1E3A8A]">
                  02. Differential Privacy Calibration
                </div>
                <h3 className="font-display text-2xl font-semibold text-[#1C1917] mt-1.5">
                  Laplace Exposure Limit Tail Margin
                </h3>
                <p className="text-sm text-[#57534E] mt-2 leading-relaxed">
                  Under epsilon-DP aggregate reporting with sensitivity Delta, keeping false-alarm probability below alpha requires safety margin m &ge; (Delta / epsilon) &middot; ln(1 / 2alpha).
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <label className="block">
                  <span className="font-mono text-[11px] text-[#57534E]">Privacy eps</span>
                  <input
                    type="number"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={dpEpsilon}
                    onChange={(e) => setDpEpsilon(Math.max(0.1, Number(e.target.value)))}
                    className="mt-1 w-full bg-[#FBF9F5] border border-[#E2DBD0] px-2.5 py-1.5 text-sm font-mono tabular-nums"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[11px] text-[#57534E]">Sensitivity Delta</span>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    step={10}
                    value={dpSensitivity}
                    onChange={(e) => setDpSensitivity(Math.max(1, Number(e.target.value)))}
                    className="mt-1 w-full bg-[#FBF9F5] border border-[#E2DBD0] px-2.5 py-1.5 text-sm font-mono tabular-nums"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[11px] text-[#57534E]">Error cap alpha</span>
                  <select
                    value={dpAlpha}
                    onChange={(e) => setDpAlpha(Number(e.target.value))}
                    className="mt-1 w-full bg-[#FBF9F5] border border-[#E2DBD0] px-2 py-1.5 text-sm font-mono tabular-nums"
                  >
                    <option value={0.05}>0.05 (5%)</option>
                    <option value={0.01}>0.01 (1%)</option>
                    <option value={0.001}>0.001 (0.1%)</option>
                  </select>
                </label>
              </div>

              <div className="pt-4 border-t border-[#E2DBD0] flex items-baseline justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-wider text-[#57534E]">
                  Minimum Distinguishable Margin (m)
                </span>
                <span className="font-mono text-xl font-medium text-[#78350F] tabular-nums">
                  {dpMargin.toFixed(1)} units
                </span>
              </div>
            </div>
          </div>

          {/* 2. Standards Mapping Table */}
          <div className="border-t border-[#E2DBD0] pt-8">
            <h3 className="font-display text-2xl font-semibold text-[#1C1917] mb-5">
              Regulatory Duty to Cryptographic Primitive Matrix (2025–2026)
            </h3>
            <div className="overflow-x-auto border border-[#E2DBD0]">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F3EFE6] border-b border-[#E2DBD0] font-mono text-xs uppercase tracking-wider text-[#57534E]">
                    <th className="py-3.5 px-4 font-medium">Compliance Duty</th>
                    <th className="py-3.5 px-4 font-medium">Governing Standard</th>
                    <th className="py-3.5 px-4 font-medium">Cryptographic Technique</th>
                    <th className="py-3.5 px-4 font-medium">Principal Operational Limit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DBD0]">
                  {COMPLIANCE_DUTIES.map((row) => (
                    <tr key={row.duty} className="align-top">
                      <td className="py-4 px-4 font-medium text-[#1C1917]">{row.duty}</td>
                      <td className="py-4 px-4 text-[#57534E]">{row.standard}</td>
                      <td className="py-4 px-4 text-[#1C1917]">{row.technique}</td>
                      <td className="py-4 px-4 text-[#57534E]">{row.limit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
