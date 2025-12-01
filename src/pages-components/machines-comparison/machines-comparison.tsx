import React, { useEffect, useState, useMemo } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import styles from "./hp-comparison.module.css"; // أو machines-comparison.module.css لو فضلت

import {
  MachinesCompareResult,
  MachineSummary,
  JobCompareSummary,
} from "./interfaces";

// ---------------------
// Main wrapper component
// ---------------------
export default function MachineComparisonReport() {
  const { callApi } = useGomakeAxios();
  const [data, setData] = useState<MachinesCompareResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend API
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await callApi(
          "POST",
          "/v1/erp-service/run-comparison",
          {},
          true
        );

        // Backend response structure: { status: "success", data: { data: {...} } }
        // After api-request: res.data = backend response body
        // So we need: res.data.data.data (the innermost data)
        const backendResponse = res?.data;
        const actualData = backendResponse?.data?.data;
        
        // Check if request was successful
        const isSuccess = res?.success === true && actualData;
        
        if (isSuccess) {

          setData(actualData);
        } else {
          console.error("❌ Failed to load data:", {
            resSuccess: res?.success,
            backendStatus: backendResponse?.status,
            hasBackendData: !!backendResponse?.data,
            hasNestedData: !!backendResponse?.data?.data,
            hasActualData: !!actualData,
            message: res?.message || backendResponse?.message,
            fullResponse: res,
          });
          throw new Error(
            res?.message || backendResponse?.message || "Failed to load machinescomparison"
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to load machines comparison.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="w-full flex justify-center p-10 text-slate-500">
        Loading machine comparison…
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="w-full flex justify-center p-10 text-red-600">
        {error ?? "Unable to load data"}
      </div>
    );
  }

  // If data loaded → render the actual report UI
  return <MachineComparisonReportUI data={data} />;
}

// -------------------------------------
// UI Component (everything from before)
// -------------------------------------
type UIProps = {
  data: MachinesCompareResult;
};

export const MachineComparisonReportUI: React.FC<UIProps> = ({ data }) => {
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobCompareSummary | null>(null);

  const selectedMachine: MachineSummary | undefined = useMemo(
    () => data.machines.find((m) => m.machineId === selectedMachineId),
    [selectedMachineId, data.machines]
  );

  const jobsForSelectedMachine = useMemo(() => {
    if (!selectedMachineId) return [];
    return data.jobs.filter((job) =>
      job.machines.some((m) => m.machineId === selectedMachineId && m.isFeasible)
    );
  }, [data.jobs, selectedMachineId]);

  const formatCurrency = (v: number | undefined | null) => {
    if (v === undefined || v === null || isNaN(v)) {
      return "0.00";
    }
    return v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatHours = (v: number | undefined | null) => {
    if (v === undefined || v === null || isNaN(v)) {
      return "0.0";
    }
    return v.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };

  const getDeltaClass = (delta: number) => {
    if (delta < 0) return "text-emerald-600";
    if (delta > 0) return "text-red-600";
    return "text-slate-600";
  };

  return (
    <div className={styles.mcRoot}>
      <div className={styles.mcContainer}>
        {/* HEADER */}
        <header className={styles.mcHeader}>
          <div>
            <h1 className={styles.mcTitle}>Machine Workflows Comparison</h1>
            <p className={styles.mcSubtitle}>
              Summary of all jobs and their best workflows per printing machine.
            </p>
          </div>
        </header>

        {/* SUMMARY CARDS */}
        <section className={styles.mcSummarySection}>
          <div className={styles.mcSummaryCard}>
            <div className={styles.mcSummaryLabel}>Total jobs analyzed</div>
            <div className={styles.mcSummaryValue}>{data.global.totalJobs}</div>
          </div>

          <div className={styles.mcSummaryCard}>
            <div className={styles.mcSummaryLabel}>Best mix total cost</div>
            <div className={styles.mcSummaryValue}>
              {formatCurrency(data.global.bestMixTotalCost)}
              <span className={styles.mcSummaryUnit}> currency</span>
            </div>
            <div className={styles.mcSummaryHint}>
              Each job printed on the cheapest feasible machine.
            </div>
          </div>

          <div className={styles.mcSummaryCard}>
            <div className={styles.mcSummaryLabel}>Best mix total time</div>
            <div className={styles.mcSummaryValue}>
              {formatHours(data.global.bestMixTotalTime)}
              <span className={styles.mcSummaryUnit}> hours</span>
            </div>
            <div className={styles.mcSummaryHint}>
              Sum of minimal production times over all jobs.
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className={styles.mcMainGrid}>
          {/* Machines overview (cards) */}
          <div className={styles.mcMachinesColumn}>
            <h2 className={styles.mcSectionTitle}>Machines overview</h2>
            <div className={styles.mcMachinesGrid}>
              {data.machines.map(machine => (
                <button
                  key={machine.machineId}
                  type="button"
                  className={`${styles.mcMachineCard} ${
                    selectedMachineId === machine.machineId ? styles.mcMachineCardActive : ""
                  }`}
                  onClick={() =>
                    setSelectedMachineId(
                      selectedMachineId === machine.machineId ? null : machine.machineId
                    )
                  }
                >
                  <div className={styles.mcMachineCardHeader}>
                    <div>
                      <div className={styles.mcMachineName}>{machine.machineName}</div>
                      <div className={styles.mcMachineFeasible}>
                        {machine.jobsFeasible} / {machine.totalJobs} jobs feasible
                      </div>
                    </div>
                    <span className={styles.mcBadgePrimary}>
                      {machine.jobsCheapest} cheapest
                    </span>
                  </div>

                  <div className={styles.mcMachineStatsRow}>
                    <div className={styles.mcMiniStat}>
                      <div className={styles.mcMiniStatLabel}>Good by cost</div>
                      <div className={styles.mcMiniStatValue}>{machine.jobsGoodByCost}</div>
                    </div>
                    <div className={styles.mcMiniStat}>
                      <div className={styles.mcMiniStatLabel}>Good by time</div>
                      <div className={styles.mcMiniStatValue}>{machine.jobsGoodByTime}</div>
                    </div>
                  </div>

                  <div className={styles.mcMachineFooter}>
                    <div>
                      <div className={styles.mcMiniStatLabel}>Scenario cost</div>
                      <div className={styles.mcMiniStatValue}>
                        {formatCurrency(machine.scenarioTotalCost)}
                      </div>
                    </div>
                    <div className={styles.mcMachineDelta}>
                      <div className={styles.mcMiniStatLabel}>vs best mix</div>
                      <div className={getDeltaClass(machine.deltaCostVsBestMix)}>
                        {machine.deltaCostVsBestMix >= 0 ? "+" : ""}
                        {formatCurrency(machine.deltaCostVsBestMix)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Table */}
            <div className={styles.mcTableWrapper}>
              <h3 className={styles.mcSectionTitle}>Machines comparison table</h3>
              <div className={styles.mcTableScroll}>
                <table className={styles.mcTable}>
                  <thead>
                    <tr>
                      <th>Machine</th>
                      <th>Feasible</th>
                      <th>Cheapest</th>
                      <th>Fastest</th>
                      <th>Good cost</th>
                      <th>Good time</th>
                      <th>Scenario cost</th>
                      <th>Δ cost vs mix</th>
                      <th>Δ time vs mix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.machines.map(m => (
                      <tr key={m.machineId}>
                        <td>{m.machineName}</td>
                        <td>
                          {m.jobsFeasible} / {m.totalJobs}
                        </td>
                        <td>{m.jobsCheapest}</td>
                        <td>{m.jobsFastest}</td>
                        <td>{m.jobsGoodByCost}</td>
                        <td>{m.jobsGoodByTime}</td>
                        <td>{formatCurrency(m.scenarioTotalCost)}</td>
                        <td className={getDeltaClass(m.deltaCostVsBestMix)}>
                          {m.deltaCostVsBestMix >= 0 ? "+" : ""}
                          {formatCurrency(m.deltaCostVsBestMix)}
                        </td>
                        <td className={getDeltaClass(m.deltaTimeVsBestMix)}>
                          {m.deltaTimeVsBestMix >= 0 ? "+" : ""}
                          {formatHours(m.deltaTimeVsBestMix)} h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column: machine detail */}
          <div className={styles.mcDetailColumn}>
            <h2 className={styles.mcSectionTitle}>Machine detail</h2>
            {!selectedMachine && (
              <div className={styles.mcEmptyDetail}>
                Select a machine on the left to see its jobs and scenario details.
              </div>
            )}

            {selectedMachine && (
              <>
                <div className={styles.mcDetailCard}>
                  <div className={styles.mcDetailHeader}>
                    <div>
                      <div className={styles.mcDetailLabel}>Selected machine</div>
                      <div className={styles.mcDetailMachineName}>
                        {selectedMachine.machineName}
                      </div>
                      <div className={styles.mcDetailSub}>
                        {selectedMachine.jobsFeasible} / {selectedMachine.totalJobs} jobs feasible
                      </div>
                    </div>
                  </div>

                  <div className={styles.mcDetailStatsRow}>
                    <div className={styles.mcMiniStat}>
                      <div className={styles.mcMiniStatLabel}>Scenario cost</div>
                      <div className={styles.mcMiniStatValue}>
                        {formatCurrency(selectedMachine.scenarioTotalCost)}
                      </div>
                      <div className={getDeltaClass(selectedMachine.deltaCostVsBestMix)}>
                        {selectedMachine.deltaCostVsBestMix >= 0 ? "+" : ""}
                        {formatCurrency(selectedMachine.deltaCostVsBestMix)} vs best mix
                      </div>
                    </div>
                    <div className={styles.mcMiniStat}>
                      <div className={styles.mcMiniStatLabel}>Scenario time</div>
                      <div className={styles.mcMiniStatValue}>
                        {formatHours(selectedMachine.scenarioTotalTime)} h
                      </div>
                      <div className={getDeltaClass(selectedMachine.deltaTimeVsBestMix)}>
                        {selectedMachine.deltaTimeVsBestMix >= 0 ? "+" : ""}
                        {formatHours(selectedMachine.deltaTimeVsBestMix)} h vs best mix
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.mcJobsCard}>
                  <div className={styles.mcJobsHeader}>
                    <span className={styles.mcDetailLabel}>Jobs for this machine</span>
                    <span className={styles.mcJobsCount}>
                      {jobsForSelectedMachine.length} jobs
                    </span>
                  </div>
                  <div className={styles.mcTableScroll}>
                    <table className={styles.mcTableSmall}>
                      <thead>
                        <tr>
                          <th>Job</th>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Cost</th>
                          <th>Time</th>
                          <th>Tags</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobsForSelectedMachine.map(job => {
                          const m = job.machines.find(
                            x => x.machineId === selectedMachine.machineId
                          )!;
                          return (
                            <tr
                              key={job.jobId}
                              onClick={() => setSelectedJob(job)}
                              className={styles.mcJobRow}
                            >
                              <td>{job.jobName}</td>
                              <td>{job.productType || "-"}</td>
                              <td>{job.quantity ?? "-"}</td>
                              <td>{formatCurrency(m.totalCost)}</td>
                              <td>{formatHours(m.totalTimeInMinutes)} h</td>
                              <td>
                                <div className={styles.mcTagRow}>
                                  {m.isBestCost && (
                                    <span className={`${styles.mcTag} ${styles.mcTagBestCost}`}>
                                      Best cost
                                    </span>
                                  )}
                                  {m.isBestTime && (
                                    <span className={`${styles.mcTag} ${styles.mcTagBestTime}`}>
                                      Best time
                                    </span>
                                  )}
                                  {m.isGoodCost && !m.isBestCost && (
                                    <span className={`${styles.mcTag} ${styles.mcTagGood}`}>
                                      Good cost
                                    </span>
                                  )}
                                  {m.isGoodTime && !m.isBestTime && (
                                    <span className={`${styles.mcTag} ${styles.mcTagInfo}`}>
                                      Good time
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className={styles.mcJobsHint}>
                    Click a job row to compare this job across all machines.
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

type JobModalProps = {
  job: JobCompareSummary;
  onClose: () => void;
  formatCurrency: (v: number | undefined | null) => string;
  formatHours: (v: number | undefined | null) => string;
};

const JobCompareModal: React.FC<JobModalProps> = ({
  job,
  onClose,
  formatCurrency,
  formatHours,
}) => {
  const feasibleMachines = job.machines.filter(m => m.isFeasible);
  const bestCost = feasibleMachines.length
    ? Math.min(...feasibleMachines.map(m => m.totalCost))
    : null;
  const bestTime = feasibleMachines.length
    ? Math.min(...feasibleMachines.map(m => m.totalTimeInMinutes))
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40">
      <div className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Job comparison
            </div>
            <div className="text-sm font-semibold text-slate-900">{job.jobName}</div>
            <div className="text-[11px] text-slate-500">
              {job.productType && <span>{job.productType} • </span>}
              {typeof job.quantity === "number" && <span>Qty: {job.quantity}</span>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 py-3">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-3 py-2">Machine</th>
                <th className="px-3 py-2">Cost</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Δ cost vs best</th>
                <th className="px-3 py-2">Δ time vs best</th>
                <th className="px-3 py-2">Tags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {job.machines.map(m => {
                if (!m.isFeasible) {
                  return (
                    <tr key={m.machineId} className="bg-slate-50/60">
                      <td className="px-3 py-2 text-slate-500">{m.machineName}</td>
                      <td className="px-3 py-2 text-slate-400" colSpan={5}>
                        Not feasible for this job
                      </td>
                    </tr>
                  );
                }

                const deltaCost =
                  bestCost !== null ? m.totalCost - bestCost : 0;
                const deltaTime =
                  bestTime !== null ? m.totalTimeInMinutes - bestTime : 0;

                const deltaCostClass =
                  deltaCost < 0
                    ? "text-emerald-600"
                    : deltaCost > 0
                    ? "text-red-600"
                    : "text-slate-700";

                const deltaTimeClass =
                  deltaTime < 0
                    ? "text-emerald-600"
                    : deltaTime > 0
                    ? "text-red-600"
                    : "text-slate-700";

                return (
                  <tr key={m.machineId} className="hover:bg-slate-50">
                    <td className="px-3 py-2 text-slate-900">{m.machineName}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {formatCurrency(m.totalCost)}
                    </td>
                    <td className="px-3 py-2 text-slate-700">
                      {formatHours(m.totalTimeInMinutes)} h
                    </td>
                    <td className={"px-3 py-2 " + deltaCostClass}>
                      {deltaCost >= 0 ? "+" : ""}
                      {formatCurrency(deltaCost)}
                    </td>
                    <td className={"px-3 py-2 " + deltaTimeClass}>
                      {deltaTime >= 0 ? "+" : ""}
                      {formatHours(deltaTime)} h
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex flex-wrap gap-1">
                        {m.isBestCost && (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                            Best cost
                          </span>
                        )}
                        {m.isBestTime && (
                          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] text-sky-700">
                            Best time
                          </span>
                        )}
                        {m.isGoodCost && !m.isBestCost && (
                          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] text-amber-700">
                            Good cost
                          </span>
                        )}
                        {m.isGoodTime && !m.isBestTime && (
                          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700">
                            Good time
                          </span>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
