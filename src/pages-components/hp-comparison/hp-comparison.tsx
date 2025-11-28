import { useState, useEffect } from "react";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { HpComparisonResponseDto } from "./interfaces";
import { formatCurrency, formatMinutesToHours } from "./utils";
import styles from "./hp-comparison.module.css";

const HpComparisonWidget = () => {
  const { callApi } = useGomakeAxios();
  const [data, setData] = useState<HpComparisonResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        
        console.log("🔵 HP Comparison: Full API Response:", JSON.stringify(res, null, 2));
        console.log("🔵 HP Comparison: res.success:", res?.success);
        console.log("🔵 HP Comparison: res.data:", res?.data);
        console.log("🔵 HP Comparison: res.data.status:", res?.data?.status);
        console.log("🔵 HP Comparison: res.data.data:", res?.data?.data);
        console.log("🔵 HP Comparison: res.data.data.data:", res?.data?.data?.data);
        
        // Backend response structure: { status: "success", data: { data: {...} } }
        // After api-request: res.data = backend response body
        // So we need: res.data.data.data (the innermost data)
        const backendResponse = res?.data;
        const actualData = backendResponse?.data?.data;
        
        // Check if request was successful
        const isSuccess = res?.success === true && actualData;
        
        if (isSuccess) {
          console.log("✅ HP Comparison: Setting data:", actualData);
          console.log("✅ HP Comparison: Data keys:", Object.keys(actualData || {}));
          console.log("✅ HP Comparison: Has meta:", !!actualData?.meta);
          console.log("✅ HP Comparison: Has totals:", !!actualData?.totals);
          console.log("✅ HP Comparison: Has jobs:", !!actualData?.jobs);
          console.log("✅ HP Comparison: Jobs count:", actualData?.jobs?.length);
          setData(actualData);
        } else {
          console.error("❌ HP Comparison: Failed to load data:", {
            resSuccess: res?.success,
            backendStatus: backendResponse?.status,
            hasBackendData: !!backendResponse?.data,
            hasNestedData: !!backendResponse?.data?.data,
            hasActualData: !!actualData,
            message: res?.message || backendResponse?.message,
            fullResponse: res,
          });
          throw new Error(
            res?.message || backendResponse?.message || "Failed to load HP comparison"
          );
        }
      } catch (err: any) {
        setError(err.message || "Failed to load HP comparison.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.hpRoiPageBackground}>
        <div className={styles.hpRoiLoadingContainer}>
          <p className={styles.hpRoiBodyText}>Loading HP Indigo ROI Comparison...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.hpRoiPageBackground}>
        <div className={styles.hpRoiErrorContainer}>
          <div className={styles.hpRoiErrorBox}>
            <h3 className={styles.hpRoiErrorTitle}>Error Loading Data</h3>
            <p className={styles.hpRoiErrorText}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const totals = data.totals;
  const fullSummary = data.fullWorkflowSummary;
  const printingSummary = data.printingOnlySummary;
  const meta = data.meta;
  const jobs = data.jobs || [];
  const machines = data.printingMachines || [];

  // Extract summary values
  const totalJobs = totals?.totalJobs || 0;
  const hpCheaper = totals?.jobsWhereHpFullFlowCheaper || 0;
  const hpFaster = totals?.jobsWhereHpFullFlowFaster || 0;
  const costSavings = fullSummary?.totalCostSavingsIfHpChosen || 0;
  const timeSavings = fullSummary?.totalTimeSavingsIfHpChosenMinutes || 0;
  const printingCostSavings = printingSummary?.totalPrintingCostSavingsIfHpChosen || 0;
  const printingTimeSavings = printingSummary?.totalPrintingTimeSavingsIfHpChosenMinutes || 0;

  // Format values for the highlight section
  const fullWorkflowCostSavings = formatCurrency(costSavings, meta?.currency || "USD");
  const fullWorkflowTimeSavings = formatMinutesToHours(timeSavings);

  return (
    <div className={styles.hpRoiPageBackground}>
      <div className={styles.hpRoiContainer}>
        <h1 className={styles.hpRoiHeader}>HP Indigo ROI Comparison</h1>

        {/* SECTION 1 - SUMMARY WITH CARDS */}
        <section>
          <h2 className={styles.hpRoiSectionTitle}>Summary</h2>
          
          {/* Summary Cards */}
          <div className={styles.hpRoiSummaryCards}>
            <div className={styles.hpRoiSummaryCard}>
              <div className={styles.hpRoiSummaryCardLabel}>Total Jobs</div>
              <div className={styles.hpRoiSummaryCardValue}>{totalJobs}</div>
            </div>
            <div className={styles.hpRoiSummaryCard}>
              <div className={styles.hpRoiSummaryCardLabel}>HP Cheaper Jobs</div>
              <div className={styles.hpRoiSummaryCardValue}>{hpCheaper}</div>
            </div>
            <div className={styles.hpRoiSummaryCard}>
              <div className={styles.hpRoiSummaryCardLabel}>HP Faster Jobs</div>
              <div className={styles.hpRoiSummaryCardValue}>{hpFaster}</div>
            </div>
            <div className={styles.hpRoiSummaryCard}>
              <div className={styles.hpRoiSummaryCardLabel}>Full Workflow Cost Savings</div>
              <div className={styles.hpRoiSummaryCardValue}>
                {formatCurrency(costSavings, meta?.currency || "USD")}
              </div>
            </div>
            <div className={styles.hpRoiSummaryCard}>
              <div className={styles.hpRoiSummaryCardLabel}>Full Workflow Time Savings</div>
              <div className={styles.hpRoiSummaryCardValue}>
                {formatMinutesToHours(timeSavings)} hours
              </div>
            </div>
            <div className={styles.hpRoiSummaryCard}>
              <div className={styles.hpRoiSummaryCardLabel}>Printing-Only Cost Savings</div>
              <div className={styles.hpRoiSummaryCardValue}>
                {formatCurrency(printingCostSavings, meta?.currency || "USD")}
              </div>
            </div>
            <div className={styles.hpRoiSummaryCard}>
              <div className={styles.hpRoiSummaryCardLabel}>Printing-Only Time Savings</div>
              <div className={styles.hpRoiSummaryCardValue}>
                {formatMinutesToHours(printingTimeSavings)} hours
              </div>
            </div>
          </div>

          {/* Prominent Highlight Section */}
          <section className="mt-6">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 text-white p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-1">
                <h2 className="mt-1 text-2xl md:text-3xl font-bold">
                  HP Indigo delivers strong cost and time savings.
                </h2>
                <p className="mt-3 text-sm md:text-base text-indigo-50">
                  HP Indigo provides a cost-effective or faster alternative in
                  <span className="font-semibold"> {hpCheaper} out of {totalJobs} jobs</span> analyzed.
                  {hpCheaper > 0 && (
                    <>
                      {" "}If HP Indigo workflows were chosen for all applicable jobs, the total cost savings would be
                      <span className="font-semibold"> {fullWorkflowCostSavings}</span>
                      {" "}with a time savings of
                      <span className="font-semibold"> {fullWorkflowTimeSavings} hours</span>.
                    </>
                  )}
                  {hpFaster > 0 && (
                    <>
                      {" "}Additionally, HP Indigo workflows are faster in
                      <span className="font-semibold"> {hpFaster} jobs</span>, providing operational efficiency benefits.
                    </>
                  )}
                  {hpCheaper === 0 && (
                    <> No significant cost or time advantages were found in the analyzed jobs.</>
                  )}
                </p>
              </div>

              <div className="flex flex-col gap-3 min-w-[220px]">
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">
                    Total Cost Savings (Full Workflow)
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {fullWorkflowCostSavings}
                  </p>
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100">
                    Total Time Savings (Full Workflow)
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {fullWorkflowTimeSavings} hours
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>

        {/* SECTION 2 - JOB COMPARISON TABLE */}
        <section>
          <h2 className={styles.hpRoiSectionTitle}>Job Comparison</h2>
          <div className={styles.hpRoiTableContainer}>
            <table className={styles.hpRoiTable}>
              <thead>
                <tr>
                  <th>Job Name</th>
                  <th>Segment</th>
                  <th>Client Machine</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>Client Total Cost</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>Client Total Time</th>
                  <th>HP Machine</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>HP Total Cost</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>HP Total Time</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>Cost Diff</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>Time Diff (hours)</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => {
                  const costDiff = job.fullFlowCostDiff;
                  const timeDiff = job.fullFlowTimeDiffMinutes;
                  
                  // HP is better if costDiff > 0 (HP cheaper) OR timeDiff > 0 (HP faster)
                  // Note: costDiff = client - hp, so positive means HP is cheaper
                  //       timeDiff = client - hp, so positive means HP is faster
                  const isHpBetter = 
                    (costDiff !== null && costDiff !== undefined && costDiff > 0) ||
                    (timeDiff !== null && timeDiff !== undefined && timeDiff > 0);
                  
                  // Color logic per user requirement:
                  // diff < 0: HP is cheaper/faster (green)
                  // diff > 0: HP is more expensive/slower (red)
                  // Note: Assuming diff = client - hp, so negative means HP is cheaper
                  const costDiffClass =
                    costDiff === null || costDiff === undefined
                      ? styles.hpRoiNeutral
                      : costDiff < 0
                      ? styles.hpRoiPositive
                      : costDiff > 0
                      ? styles.hpRoiNegative
                      : styles.hpRoiNeutral;
                  
                  const timeDiffClass =
                    timeDiff === null || timeDiff === undefined
                      ? styles.hpRoiNeutral
                      : timeDiff < 0
                      ? styles.hpRoiPositive
                      : timeDiff > 0
                      ? styles.hpRoiNegative
                      : styles.hpRoiNeutral;

                  return (
                    <tr 
                      key={job.jobId}
                      className={isHpBetter ? "bg-green-50 hover:bg-green-100" : ""}
                    >
                      <td className={styles.hpRoiTableCellBold}>{job.jobName}</td>
                      <td>{job.segment || "-"}</td>
                      <td>{job.clientBest?.printingMachineName || "-"}</td>
                      <td className={styles.hpRoiTableCellNumeric}>
                        {job.clientBest
                          ? formatCurrency(job.clientBest.totalCost, meta?.currency || "USD")
                          : "-"}
                      </td>
                      <td className={styles.hpRoiTableCellNumeric}>
                        {job.clientBest
                          ? formatMinutesToHours(job.clientBest.totalTimeMinutes) + "h"
                          : "-"}
                      </td>
                      <td>{job.hpBest?.printingMachineName || "-"}</td>
                      <td className={styles.hpRoiTableCellNumeric}>
                        {job.hpBest
                          ? formatCurrency(job.hpBest.totalCost, meta?.currency || "USD")
                          : "-"}
                      </td>
                      <td className={styles.hpRoiTableCellNumeric}>
                        {job.hpBest
                          ? formatMinutesToHours(job.hpBest.totalTimeMinutes) + "h"
                          : "-"}
                      </td>
                      <td className={`${styles.hpRoiTableCellNumeric} ${costDiffClass}`}>
                        {costDiff !== null && costDiff !== undefined
                          ? `${costDiff > 0 ? "+" : ""}${formatCurrency(costDiff, meta?.currency || "USD")}`
                          : "-"}
                      </td>
                      <td className={`${styles.hpRoiTableCellNumeric} ${timeDiffClass}`}>
                        {timeDiff !== null && timeDiff !== undefined
                          ? `${timeDiff > 0 ? "+" : ""}${formatMinutesToHours(timeDiff)}h`
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 3 - MACHINE SUMMARY TABLE */}
        <section>
          <h2 className={styles.hpRoiSectionTitle}>Machine Summary</h2>
          <div className={styles.hpRoiTableContainer}>
            <table className={styles.hpRoiTable}>
              <thead>
                <tr>
                  <th>Machine Name</th>
                  <th>Is HP Indigo</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>Jobs Count</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>Total Printing Cost</th>
                  <th className={styles.hpRoiTableHeaderNumeric}>Total Printing Time (minutes)</th>
                </tr>
              </thead>
              <tbody>
                {machines.map((machine) => (
                  <tr key={machine.machineId}>
                    <td className={styles.hpRoiTableCellBold}>{machine.machineName}</td>
                    <td>{machine.isHpIndigo ? "Yes" : "No"}</td>
                    <td className={styles.hpRoiTableCellNumeric}>{machine.jobsCount}</td>
                    <td className={styles.hpRoiTableCellNumeric}>
                      {formatCurrency(machine.totalPrintingCost, meta?.currency || "USD")}
                    </td>
                    <td className={styles.hpRoiTableCellNumeric}>
                      {machine.totalPrintingTimeMinutes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export { HpComparisonWidget };
