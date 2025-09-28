import { JobHistoryItem } from "../job-history-item/job-history-item";
import { useStyle } from "./style";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import HomeIcon from "@mui/icons-material/Home";
import { GoMakeIcon } from "@/components/icons/go-make-icon";

interface AISidebarProps {
  onNewJobClick: () => void;
  jobHistory: any[];
}

//!HERE
const AISidebar = ({ onNewJobClick, jobHistory }: AISidebarProps) => {
  const { classes } = useStyle();

  return (
    <div style={classes.sidebarContainer}>
      {/* Header */}
      <div style={classes.header}>
        <div style={classes.brandingContainer}>
          <div style={classes.logoContainer}>
            <ChatBubbleOutlineOutlinedIcon style={classes.chatIcon} />
          </div>
          <div style={classes.brandingText}>
            <div style={classes.brandTitle}>Go AI</div>
            <div style={classes.brandSubtitle}>Light Edition</div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={classes.navigationContainer}>
        <div
          className="ai-sidebar-nav-item"
          style={{
            ...classes.navItem,
            ...classes.activeNavItem,
          }}
          onClick={onNewJobClick}
        >
          <div style={classes.navIcon}>+</div>
          <div style={classes.navText}>New Job</div>
        </div>
      </div>

      {/* Content Area */}
      <div style={classes.contentContainer}>
        <div style={classes.jobHistorySection}>
          <div style={classes.sectionTitle}>
            <HistoryRoundedIcon style={classes.sectionIcon} />
            Job History
          </div>
          {jobHistory.length === 0 ? (
            <div className="ai-empty-state" style={classes.emptyState}>
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
        <button
          style={(classes as any).backButton}
          onClick={() => {
            // Navigate back to home or GoMake dashboard
            window.location.href = "/";
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#E0E7FF";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#EFF6FF";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <HomeIcon style={(classes as any).backButtonIcon} />
          <span style={(classes as any).backButtonText}>Back to GoMake</span>
        </button>
        <div style={(classes as any).poweredByContainer}>
          <div style={classes.poweredByLbl}>Powered by</div>
          <GoMakeIcon
            color="linear-gradient(135deg, #2E54E7 0%, #4C8CFF 100%)"
            height={20}
            width={100}
          />
        </div>
      </div>
    </div>
  );
};

export { AISidebar };
