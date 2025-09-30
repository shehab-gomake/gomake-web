import { useStyle } from "./style";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import HomeIcon from "@mui/icons-material/Home";
import { GoMakeIcon } from "@/components/icons/go-make-icon";

interface AISidebarProps {
  onNewJobClick: () => void;
  conversationsHistory?: any[];
  onConversationSelect?: (sessionId: string) => void;
  onRefreshHistory?: () => void;
  selectedConversation?: any;
}

const AISidebar = ({
  onNewJobClick,
  conversationsHistory = [],
  onConversationSelect,
  onRefreshHistory,
  selectedConversation,
}: AISidebarProps) => {
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
        {/* Jobs History Section */}
        <div style={classes.jobHistorySection}>
          <div style={classes.sectionTitle}>
            <HistoryRoundedIcon style={classes.sectionIcon} />
            Jobs History
            {onRefreshHistory && (
              <button
                onClick={onRefreshHistory}
                style={{
                  marginLeft: "auto",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "#666",
                }}
              >
                🔄 Refresh
              </button>
            )}
          </div>
          {conversationsHistory.length === 0 ? (
            <div className="ai-empty-state" style={classes.emptyState}>
              <div style={classes.emptyStateIcon}>💬</div>
              <div style={classes.emptyStateText}>No jobs yet</div>
              <div style={classes.emptyStateSubtext}>
                Start chatting to see your job history
              </div>
            </div>
          ) : (
            <div style={classes.jobHistoryList}>
              {conversationsHistory.map((conversation, index) => (
                <div
                  key={index}
                  onClick={() => onConversationSelect?.(conversation.sessionId)}
                  style={{
                    ...classes.navItem,
                    backgroundColor:
                      selectedConversation?.sessionId === conversation.sessionId
                        ? "#E0E7FF"
                        : "transparent",
                    cursor: "pointer",
                    marginBottom: "4px",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "1px solid #E5E7EB",
                  }}
                >
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>
                    {conversation.conversationName || `Job ${index + 1}`}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "2px",
                    }}
                  >
                    Session: {conversation.sessionId?.substring(0, 8)}...
                  </div>
                </div>
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
