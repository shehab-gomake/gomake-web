import { useState, useEffect, useMemo } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useStyle } from "./style";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import {
  HpComparisonResponseDto,
  HpJobComparisonDto,
  HpPrintingMachineAggregateDto,
  HpWorkflowDto,
} from "./interfaces";
import {
  formatCurrency,
  formatMinutesToHours,
  formatDate,
  classNames,
} from "./utils";
import { PrimaryTable } from "@/components/tables/primary-table";

type TabType = "overview" | "jobs" | "machines" | "workflows";

const HpComparisonWidget = () => {
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const [data, setData] = useState<HpComparisonResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [jobSearchTerm, setJobSearchTerm] = useState("");
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [workflowFilter, setWorkflowFilter] = useState<"all" | "hp" | "client">("all");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await callApi(
          "POST",
          "/ui/hp-comparison/run",
          {},
          true
        );
        if (res?.success && res?.data) {
          setData(res.data);
        } else {
          throw new Error(
            res?.message || res?.msg || "Failed to load HP comparison"
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

  // Get unique segments for filter
  const uniqueSegments = useMemo(() => {
    if (!data?.jobs) return [];
    const segments = new Set(
      data.jobs.map((j) => j.segment).filter((s): s is string => s !== null)
    );
    return Array.from(segments).sort();
  }, [data]);

  // Filter jobs
  const filteredJobs = useMemo(() => {
    if (!data?.jobs) return [];
    return data.jobs.filter((job) => {
      const matchesSearch =
        job.jobName.toLowerCase().includes(jobSearchTerm.toLowerCase()) ||
        job.jobId.toLowerCase().includes(jobSearchTerm.toLowerCase());
      const matchesSegment =
        selectedSegment === "all" || job.segment === selectedSegment;
      return matchesSearch && matchesSegment;
    });
  }, [data, jobSearchTerm, selectedSegment]);

  // Filter workflows
  const filteredWorkflows = useMemo(() => {
    if (!data?.workflows) return [];
    return data.workflows.filter((wf) => {
      if (workflowFilter === "all") return true;
      if (workflowFilter === "hp") return wf.isHpIndigo;
      return !wf.isHpIndigo;
    });
  }, [data, workflowFilter]);

  // Machine summary
  const machineSummary = useMemo(() => {
    if (!data?.printingMachines) return { hp: { jobs: 0, cost: 0, time: 0 }, nonHp: { jobs: 0, cost: 0, time: 0 } };
    const hp = data.printingMachines.filter((m) => m.isHpIndigo);
    const nonHp = data.printingMachines.filter((m) => !m.isHpIndigo);
    return {
      hp: {
        jobs: hp.reduce((sum, m) => sum + m.jobsCount, 0),
        cost: hp.reduce((sum, m) => sum + m.totalPrintingCost, 0),
        time: hp.reduce((sum, m) => sum + m.totalPrintingTimeMinutes, 0),
      },
      nonHp: {
        jobs: nonHp.reduce((sum, m) => sum + m.jobsCount, 0),
        cost: nonHp.reduce((sum, m) => sum + m.totalPrintingCost, 0),
        time: nonHp.reduce((sum, m) => sum + m.totalPrintingTimeMinutes, 0),
      },
    };
  }, [data]);

  if (loading) {
    return (
      <Box sx={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={classes.errorContainer}>
        <Typography sx={classes.errorText}>Error: {error}</Typography>
      </Box>
    );
  }

  if (!data) {
    return null;
  }

  const renderHeader = () => (
    <Box sx={classes.header}>
      <Typography sx={classes.title}>HP Indigo ROI Comparison</Typography>
      <Typography sx={classes.subtitle}>
        Based on real production data from {data.meta.printHouseName}
      </Typography>
      <Box sx={classes.metaInfo}>
        <Typography sx={classes.pill}>
          Generated: {formatDate(data.meta.generatedAtUtc)}
        </Typography>
        <Typography sx={classes.pill}>
          {data.meta.jobsSource} • Last {data.meta.lastMonths} months
        </Typography>
      </Box>
    </Box>
  );

  const renderSummaryCards = () => (
    <Box sx={classes.cardsGrid}>
      <Box sx={classes.card}>
        <Typography sx={classes.cardLabel}>Total Jobs</Typography>
        <Typography sx={classes.cardValue}>{data.totals.totalJobs}</Typography>
      </Box>
      <Box sx={classes.card}>
        <Typography sx={classes.cardLabel}>Jobs with HP Alternative</Typography>
        <Typography sx={classes.cardValue}>
          {data.totals.jobsWithHpAlternative}
        </Typography>
        <Typography sx={classes.cardSubtext}>
          {((data.totals.jobsWithHpAlternative / data.totals.totalJobs) * 100).toFixed(1)}% of total
        </Typography>
      </Box>
      <Box sx={[classes.card, classes.cardPositive]}>
        <Typography sx={[classes.cardLabel, classes.cardPositiveLabel]}>
          Jobs Where HP is Cheaper (Full Workflow)
        </Typography>
        <Typography sx={[classes.cardValue, classes.cardPositiveValue]}>
          {data.totals.jobsWhereHpFullFlowCheaper}
        </Typography>
        <Typography sx={classes.cardSubtext}>
          {((data.totals.jobsWhereHpFullFlowCheaper / data.totals.totalJobs) * 100).toFixed(1)}% of total
        </Typography>
      </Box>
      <Box sx={[classes.card, classes.cardPositive]}>
        <Typography sx={[classes.cardLabel, classes.cardPositiveLabel]}>
          Jobs Where HP is Faster (Full Workflow)
        </Typography>
        <Typography sx={[classes.cardValue, classes.cardPositiveValue]}>
          {data.totals.jobsWhereHpFullFlowFaster}
        </Typography>
        <Typography sx={classes.cardSubtext}>
          {((data.totals.jobsWhereHpFullFlowFaster / data.totals.totalJobs) * 100).toFixed(1)}% of total
        </Typography>
      </Box>
      <Box sx={[classes.card, classes.cardPositive]}>
        <Typography sx={[classes.cardLabel, classes.cardPositiveLabel]}>
          Total Cost Savings (Full Workflow)
        </Typography>
        <Typography sx={[classes.cardValue, classes.cardPositiveValue]}>
          {formatCurrency(
            data.fullWorkflowSummary.totalCostSavingsIfHpChosen,
            data.meta.currency
          )}
        </Typography>
        <Typography sx={classes.cardSubtext}>
          If HP was chosen for all applicable jobs
        </Typography>
      </Box>
      <Box sx={[classes.card, classes.cardPositive]}>
        <Typography sx={[classes.cardLabel, classes.cardPositiveLabel]}>
          Total Time Savings (Full Workflow)
        </Typography>
        <Typography sx={[classes.cardValue, classes.cardPositiveValue]}>
          {formatMinutesToHours(
            data.fullWorkflowSummary.totalTimeSavingsIfHpChosenMinutes
          )} hours
        </Typography>
        <Typography sx={classes.cardSubtext}>
          If HP was chosen for all applicable jobs
        </Typography>
      </Box>
    </Box>
  );

  const renderWasteComparison = () => (
    <Box sx={classes.wastePanel}>
      <Typography sx={classes.wasteLabel}>Waste Comparison</Typography>
      <Box sx={classes.wasteRow}>
        <Typography sx={classes.wasteLabel}>
          Avg waste – Current machines:
        </Typography>
        <Box sx={classes.wasteBarContainer}>
          <Box
            sx={[classes.wasteBar, classes.wasteBarClient]}
            style={{
              width: `${Math.min(data.fullWorkflowSummary.averageWastePercentClient, 100)}%`,
            }}
          />
        </Box>
        <Typography sx={classes.wastePercent}>
          {data.fullWorkflowSummary.averageWastePercentClient.toFixed(1)}%
        </Typography>
      </Box>
      <Box sx={classes.wasteRow}>
        <Typography sx={classes.wasteLabel}>Avg waste – HP Indigo:</Typography>
        <Box sx={classes.wasteBarContainer}>
          <Box
            sx={[classes.wasteBar, classes.wasteBarHp]}
            style={{
              width: `${Math.min(data.fullWorkflowSummary.averageWastePercentHp, 100)}%`,
            }}
          />
        </Box>
        <Typography sx={classes.wastePercent}>
          {data.fullWorkflowSummary.averageWastePercentHp.toFixed(1)}%
        </Typography>
      </Box>
    </Box>
  );

  const renderPrintingOnlySummary = () => (
    <Box sx={classes.cardsGrid} style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
      <Box sx={classes.card}>
        <Typography sx={classes.cardLabel}>
          Total Printing Cost Savings
        </Typography>
        <Typography sx={[classes.cardValue, classes.badgePositive]}>
          {formatCurrency(
            data.printingOnlySummary.totalPrintingCostSavingsIfHpChosen,
            data.meta.currency
          )}
        </Typography>
      </Box>
      <Box sx={classes.card}>
        <Typography sx={classes.cardLabel}>
          Total Printing Time Savings
        </Typography>
        <Typography sx={[classes.cardValue, classes.badgePositive]}>
          {formatMinutesToHours(
            data.printingOnlySummary.totalPrintingTimeSavingsIfHpChosenMinutes
          )} hours
        </Typography>
      </Box>
    </Box>
  );

  const renderTabs = () => (
    <Box sx={{ width: "100%" }}>
      <Box sx={classes.tabsContainer}>
        <Box
          sx={[classes.tab, activeTab === "overview" && classes.tabActive]}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </Box>
        <Box
          sx={[classes.tab, activeTab === "jobs" && classes.tabActive]}
          onClick={() => setActiveTab("jobs")}
        >
          By Job
        </Box>
        <Box
          sx={[classes.tab, activeTab === "machines" && classes.tabActive]}
          onClick={() => setActiveTab("machines")}
        >
          By Machine
        </Box>
        {data.workflows && data.workflows.length > 0 && (
          <Box
            sx={[classes.tab, activeTab === "workflows" && classes.tabActive]}
            onClick={() => setActiveTab("workflows")}
          >
            Raw Workflows
          </Box>
        )}
      </Box>
      <Box sx={classes.tabContent}>
        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "jobs" && renderJobsTab()}
        {activeTab === "machines" && renderMachinesTab()}
        {activeTab === "workflows" && renderWorkflowsTab()}
      </Box>
    </Box>
  );

  const renderOverviewTab = () => (
    <Box>
      <Typography sx={classes.summaryText}>
        HP Indigo provides a cheaper or faster alternative on{" "}
        {data.totals.jobsWhereHpFullFlowCheaper} of {data.totals.totalJobs} jobs
        analyzed.
      </Typography>
      <Box sx={classes.chartContainer}>
        <Box sx={classes.chartBar}>
          <Typography sx={classes.chartLabel}>
            Jobs where HP is cheaper (full workflow)
          </Typography>
          <Box sx={classes.chartBarContainer}>
            <Box
              sx={classes.chartBarFill}
              style={{
                width: `${
                  (data.totals.jobsWhereHpFullFlowCheaper / data.totals.totalJobs) * 100
                }%`,
              }}
            >
              <Typography sx={classes.chartPercent}>
                {((data.totals.jobsWhereHpFullFlowCheaper / data.totals.totalJobs) * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={classes.chartBar}>
          <Typography sx={classes.chartLabel}>
            Jobs where HP is cheaper (printing only)
          </Typography>
          <Box sx={classes.chartBarContainer}>
            <Box
              sx={classes.chartBarFill}
              style={{
                width: `${
                  (data.totals.jobsWhereHpPrintingCheaper / data.totals.totalJobs) * 100
                }%`,
              }}
            >
              <Typography sx={classes.chartPercent}>
                {((data.totals.jobsWhereHpPrintingCheaper / data.totals.totalJobs) * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const renderJobsTab = () => {
    const headers = [
      { name: "Job Name", id: "jobName" },
      { name: "Segment", id: "segment" },
      { name: "Client Machine", id: "clientMachine" },
      { name: "HP Machine", id: "hpMachine" },
      { name: "Full-Flow Cost Client", id: "clientCost" },
      { name: "Full-Flow Cost HP", id: "hpCost" },
      { name: "Cost Diff", id: "costDiff" },
      { name: "Time Diff (hours)", id: "timeDiff" },
    ];

    const rows = filteredJobs.map((job) => ({
      jobName: job.jobName,
      segment: job.segment || "-",
      clientMachine: job.clientBest?.printingMachineName || "-",
      hpMachine: job.hpBest?.printingMachineName || "-",
      clientCost: job.clientBest
        ? formatCurrency(job.clientBest.totalCost, data.meta.currency)
        : "-",
      hpCost: job.hpBest
        ? formatCurrency(job.hpBest.totalCost, data.meta.currency)
        : "-",
      costDiff: job.fullFlowCostDiff !== null && job.fullFlowCostDiff !== undefined
        ? (
            <Typography
              sx={
                job.fullFlowCostDiff > 0
                  ? classes.badgePositive
                  : classes.badgeNegative
              }
            >
              {job.fullFlowCostDiff > 0 ? "+" : ""}
              {formatCurrency(job.fullFlowCostDiff, data.meta.currency)}
            </Typography>
          )
        : "-",
      timeDiff: job.fullFlowTimeDiffMinutes !== null && job.fullFlowTimeDiffMinutes !== undefined
        ? (
            <Typography
              sx={
                job.fullFlowTimeDiffMinutes > 0
                  ? classes.badgePositive
                  : classes.badgeNegative
              }
            >
              {job.fullFlowTimeDiffMinutes > 0 ? "+" : ""}
              {formatMinutesToHours(job.fullFlowTimeDiffMinutes)}h
            </Typography>
          )
        : "-",
    }));

    return (
      <Box>
        <Box sx={classes.filtersContainer}>
          <input
            type="text"
            placeholder="Search by job name or ID..."
            value={jobSearchTerm}
            onChange={(e) => setJobSearchTerm(e.target.value)}
            style={classes.filterInput}
          />
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            style={classes.filterSelect}
          >
            <option value="all">All Segments</option>
            {uniqueSegments.map((seg) => (
              <option key={seg} value={seg}>
                {seg}
              </option>
            ))}
          </select>
        </Box>
        <Box sx={classes.tableContainer}>
          <PrimaryTable rows={rows} headers={headers} />
        </Box>
      </Box>
    );
  };

  const renderMachinesTab = () => {
    const headers = [
      { name: "Machine Name", id: "machineName" },
      { name: "Type", id: "type" },
      { name: "Jobs Count", id: "jobsCount" },
      { name: "Total Printing Cost", id: "totalCost" },
      { name: "Total Printing Time (hours)", id: "totalTime" },
    ];

    const rows = data.printingMachines.map((machine) => ({
      machineName: machine.machineName,
      type: machine.isHpIndigo ? (
        <Typography sx={[classes.badge, classes.badgeHp]}>HP Indigo</Typography>
      ) : (
        "Client Machine"
      ),
      jobsCount: machine.jobsCount,
      totalCost: formatCurrency(machine.totalPrintingCost, data.meta.currency),
      totalTime: formatMinutesToHours(machine.totalPrintingTimeMinutes),
    }));

    return (
      <Box>
        <Box sx={classes.cardsGrid} style={{ gridTemplateColumns: "repeat(2, 1fr)", marginBottom: 24 }}>
          <Box sx={classes.card}>
            <Typography sx={classes.cardLabel}>HP Indigo Machines</Typography>
            <Typography sx={classes.cardValue}>{machineSummary.hp.jobs}</Typography>
            <Typography sx={classes.cardSubtext}>
              {formatCurrency(machineSummary.hp.cost, data.meta.currency)} •{" "}
              {formatMinutesToHours(machineSummary.hp.time)}h
            </Typography>
          </Box>
          <Box sx={classes.card}>
            <Typography sx={classes.cardLabel}>Client Machines</Typography>
            <Typography sx={classes.cardValue}>{machineSummary.nonHp.jobs}</Typography>
            <Typography sx={classes.cardSubtext}>
              {formatCurrency(machineSummary.nonHp.cost, data.meta.currency)} •{" "}
              {formatMinutesToHours(machineSummary.nonHp.time)}h
            </Typography>
          </Box>
        </Box>
        <Box sx={classes.tableContainer}>
          <PrimaryTable rows={rows} headers={headers} />
        </Box>
      </Box>
    );
  };

  const renderWorkflowsTab = () => {
    if (!data.workflows || data.workflows.length === 0) {
      return <Typography>No workflow data available.</Typography>;
    }

    const headers = [
      { name: "Job Name", id: "jobName" },
      { name: "Workflow ID", id: "workflowId" },
      { name: "Printing Machine", id: "machine" },
      { name: "Type", id: "type" },
      { name: "Total Cost", id: "totalCost" },
      { name: "Total Time (hours)", id: "totalTime" },
      { name: "Waste %", id: "waste" },
    ];

    const rows = filteredWorkflows.map((wf) => ({
      jobName: wf.jobName,
      workflowId: wf.workflowId,
      machine: wf.printingMachineName,
      type: wf.isHpIndigo ? (
        <Typography sx={[classes.badge, classes.badgeHp]}>HP Indigo</Typography>
      ) : (
        "Client"
      ),
      totalCost: formatCurrency(wf.totalCost, data.meta.currency),
      totalTime: formatMinutesToHours(wf.totalTimeMinutes),
      waste: `${wf.wastePercent.toFixed(1)}%`,
    }));

    return (
      <Box>
        <Box sx={classes.filtersContainer}>
          <label>
            <input
              type="radio"
              value="all"
              checked={workflowFilter === "all"}
              onChange={(e) => setWorkflowFilter(e.target.value as any)}
              style={{ marginRight: 8 }}
            />
            All
          </label>
          <label>
            <input
              type="radio"
              value="hp"
              checked={workflowFilter === "hp"}
              onChange={(e) => setWorkflowFilter(e.target.value as any)}
              style={{ marginRight: 8 }}
            />
            HP Indigo Only
          </label>
          <label>
            <input
              type="radio"
              value="client"
              checked={workflowFilter === "client"}
              onChange={(e) => setWorkflowFilter(e.target.value as any)}
              style={{ marginRight: 8 }}
            />
            Client Machines Only
          </label>
        </Box>
        <Box sx={classes.tableContainer}>
          <PrimaryTable rows={rows} headers={headers} />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={classes.mainContainer}>
      {renderHeader()}
      {renderSummaryCards()}
      {renderWasteComparison()}
      {renderPrintingOnlySummary()}
      {renderTabs()}
    </Box>
  );
};

export { HpComparisonWidget };

