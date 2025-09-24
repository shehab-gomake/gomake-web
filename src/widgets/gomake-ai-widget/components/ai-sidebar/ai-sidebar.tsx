import React from "react";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { convertHeightToVH, convertWidthToVW } from "@/utils/adapter";
import { GoMakeIcon } from "@/icons/side-list-icons/gomake";
import { JobHistoryItem } from "../job-history-item/job-history-item";
import { useStyle } from "./style";

interface AISidebarProps {
  selectedTab: "new-job";
  onTabChange: (tab: "new-job") => void;
  onNewJobClick: () => void;
  onJobHistoryClick: () => void;
  jobHistory: any[];
}

const AISidebar = ({
  selectedTab,
  onTabChange,
  onNewJobClick,
  onJobHistoryClick,
  jobHistory,
}: AISidebarProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <div style={classes.sidebarContainer}>
      {/* Header */}
      <div style={classes.header}>
        <div style={classes.logoContainer}>
          <GoMakeIcon />
        </div>
        <div style={classes.title}>GoMake AI</div>
      </div>

      {/* Navigation Buttons */}
      <div style={classes.navigationContainer}>
        <div
          style={{
            ...classes.navItem,
            ...classes.activeNavItem,
          }}
          onClick={onNewJobClick}
        >
          <div style={classes.navIcon}>+</div>
          <div style={classes.navText}>New Job</div>
        </div>

        <div style={classes.navItem} onClick={onJobHistoryClick}>
          <div style={classes.navIcon}>📋</div>
          <div style={classes.navText}>Job History</div>
        </div>
      </div>

      {/* Content Area */}
      <div style={classes.contentContainer}>
        <div style={classes.jobHistorySection}>
          <div style={classes.sectionTitle}>Recent Jobs</div>
          {jobHistory.length === 0 ? (
            <div style={classes.emptyState}>
              <div style={classes.emptyStateIcon}>📋</div>
              <div style={classes.emptyStateText}>No jobs yet</div>
              <div style={classes.emptyStateSubtext}>
                Create your first AI job to see it here
              </div>
            </div>
          ) : (
            <div style={classes.jobHistoryList}>
              {jobHistory.map((job, index) => (
                <JobHistoryItem
                  key={index}
                  job={job}
                  onClick={() => {
                    /* Handle job selection */
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={classes.footer}>
        <div style={classes.poweredByLbl}>Powered by</div>
        <GoMakeIcon />
      </div>
    </div>
  );
};

export { AISidebar };
