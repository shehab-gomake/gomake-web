import React, { useEffect, useState, useMemo } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";

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

  const formatCurrency = (v: number) =>
    v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatHours = (v: number) =>
    v.toLocaleString(undefined, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });

  const getDeltaClass = (delta: number) => {
    if (delta < 0) return "text-emerald-600";
    if (delta > 0) return "text-red-600";
    return "text-slate-600";
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Machine Workflows Comparison
            </h1>
            <p className="text-sm text-slate-500">
              Summary of all jobs and their best workflows per printing machine.
            </p>
          </div>
        </div>

        {/* Global summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Total jobs analyzed
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">
              {data.global.totalJobs}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Best mix total cost
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {formatCurrency(data.global.bestMixTotalCost)}{" "}
              <span className="text-sm font-normal text-slate-500">currency</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Each job printed on the cheapest feasible machine.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Best mix total time
            </div>
            <div className="mt-2 text-xl font-semibold text-slate-900">
              {formatHours(data.global.bestMixTotalTime)}{" "}
              <span className="text-sm font-normal text-slate-500">hours</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Sum of minimal production times over all jobs.
            </p>
          </div>
        </div>

        {/* Main layout: machine cards + detail panel */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: machine cards */}
          <div className="space-y-3 lg:col-span-2">
            <h2 className="text-sm font-semibold text-slate-700">
              Machines overview
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {data.machines.map(machine => (
                <button
                  key={machine.machineId}
                  type="button"
                  onClick={() =>
                    setSelectedMachineId(
                      selectedMachineId === machine.machineId ? null : machine.machineId
                    )
                  }
                  className={`text-left rounded-2xl border p-4 shadow-sm transition hover:shadow-md bg-white ${
                    selectedMachineId === machine.machineId
                      ? "border-indigo-500 ring-2 ring-indigo-100"
                      : "border-slate-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {machine.machineName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {machine.jobsFeasible} / {machine.totalJobs} jobs feasible
                      </div>
                    </div>
                    <div className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                      {machine.jobsCheapest} cheapest
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">
                        Good by cost
                      </div>
                      <div className="font-semibold">
                        {machine.jobsGoodByCost} jobs
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">
                        Good by time
                      </div>
                      <div className="font-semibold">
                        {machine.jobsGoodByTime} jobs
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">
                        Scenario cost (all feasible jobs)
                      </div>
                      <div className="font-semibold text-slate-900">
                        {formatCurrency(machine.scenarioTotalCost)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">
                        vs best mix
                      </div>
                      <div className={getDeltaClass(machine.deltaCostVsBestMix) + " font-semibold"}>
                        {machine.deltaCostVsBestMix >= 0 ? "+" : ""}
                        {formatCurrency(machine.deltaCostVsBestMix)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Machines comparison table */}
            <div className="mt-5 rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Machines comparison table
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Machine</th>
                      <th className="px-3 py-2">Feasible</th>
                      <th className="px-3 py-2">Cheapest</th>
                      <th className="px-3 py-2">Fastest</th>
                      <th className="px-3 py-2">Good cost</th>
                      <th className="px-3 py-2">Good time</th>
                      <th className="px-3 py-2">Scenario cost</th>
                      <th className="px-3 py-2">Δ cost vs mix</th>
                      <th className="px-3 py-2">Δ time vs mix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.machines.map(m => (
                      <tr key={m.machineId} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-900">{m.machineName}</td>
                        <td className="px-3 py-2 text-slate-700">
                          {m.jobsFeasible} / {m.totalJobs}
                        </td>
                        <td className="px-3 py-2 text-slate-700">{m.jobsCheapest}</td>
                        <td className="px-3 py-2 text-slate-700">{m.jobsFastest}</td>
                        <td className="px-3 py-2 text-slate-700">{m.jobsGoodByCost}</td>
                        <td className="px-3 py-2 text-slate-700">{m.jobsGoodByTime}</td>
                        <td className="px-3 py-2 text-slate-700">
                          {formatCurrency(m.scenarioTotalCost)}
                        </td>
                        <td className={"px-3 py-2 " + getDeltaClass(m.deltaCostVsBestMix)}>
                          {m.deltaCostVsBestMix >= 0 ? "+" : ""}
                          {formatCurrency(m.deltaCostVsBestMix)}
                        </td>
                        <td className={"px-3 py-2 " + getDeltaClass(m.deltaTimeVsBestMix)}>
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

          {/* Right: selected machine detail */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">
              Machine detail
            </h2>

            {!selectedMachine && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-500">
                Select a machine on the left to see its jobs and scenario details.
              </div>
            )}

            {selectedMachine && (
              <div className="space-y-4">
                {/* Scenario summary */}
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-500">
                        Selected machine
                      </div>
                      <div className="text-base font-semibold text-slate-900">
                        {selectedMachine.machineName}
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {selectedMachine.jobsFeasible} / {selectedMachine.totalJobs} jobs feasible
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">
                        Scenario cost
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatCurrency(selectedMachine.scenarioTotalCost)}
                      </div>
                      <div className={getDeltaClass(selectedMachine.deltaCostVsBestMix) + " text-[11px]"}>
                        {selectedMachine.deltaCostVsBestMix >= 0 ? "+" : ""}
                        {formatCurrency(selectedMachine.deltaCostVsBestMix)} vs best mix
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 px-3 py-2">
                      <div className="text-[10px] uppercase tracking-wide text-slate-400">
                        Scenario time
                      </div>
                      <div className="text-sm font-semibold text-slate-900">
                        {formatHours(selectedMachine.scenarioTotalTime)} h
                      </div>
                      <div className={getDeltaClass(selectedMachine.deltaTimeVsBestMix) + " text-[11px]"}>
                        {selectedMachine.deltaTimeVsBestMix >= 0 ? "+" : ""}
                        {formatHours(selectedMachine.deltaTimeVsBestMix)} h vs best mix
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jobs list for this machine */}
                <div className="rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Jobs for this machine
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      {jobsForSelectedMachine.length} jobs
                    </div>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto">
                    <table className="min-w-full text-left text-xs">
                      <thead className="border-b border-slate-100 bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-3 py-2">Job</th>
                          <th className="px-3 py-2">Product</th>
                          <th className="px-3 py-2">Qty</th>
                          <th className="px-3 py-2">Cost</th>
                          <th className="px-3 py-2">Time</th>
                          <th className="px-3 py-2">Tags</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {jobsForSelectedMachine.map(job => {
                          const m = job.machines.find(x => x.machineId === selectedMachine.machineId)!;
                          return (
                            <tr
                              key={job.jobId}
                              className="cursor-pointer hover:bg-slate-50"
                              onClick={() => setSelectedJob(job)}
                            >
                              <td className="px-3 py-2 text-slate-900">{job.jobName}</td>
                              <td className="px-3 py-2 text-slate-600">
                                {job.productType || "-"}
                              </td>
                              <td className="px-3 py-2 text-slate-600">
                                {job.quantity ?? "-"}
                              </td>
                              <td className="px-3 py-2 text-slate-700">
                                {formatCurrency(m.totalCost)}
                              </td>
                              <td className="px-3 py-2 text-slate-700">
                                {formatHours(m.totalTimeHours)} h
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
                  <p className="mt-2 text-[11px] text-slate-500">
                    Click a job row to compare this job across all machines.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job-level modal */}
        {selectedJob && (
          <JobCompareModal
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
            formatCurrency={formatCurrency}
            formatHours={formatHours}
          />
        )}
      </div>
    </div>
  );
};

type JobModalProps = {
  job: JobCompareSummary;
  onClose: () => void;
  formatCurrency: (v: number) => string;
  formatHours: (v: number) => string;
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
    ? Math.min(...feasibleMachines.map(m => m.totalTimeHours))
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
                  bestTime !== null ? m.totalTimeHours - bestTime : 0;

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
                      {formatHours(m.totalTimeHours)} h
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
