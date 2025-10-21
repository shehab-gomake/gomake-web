import { useStyle } from "./style";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import { useIsMobile } from "@/hooks/use-responsive";
import { useRecoilValue } from "recoil";
import { userState } from "@/store";
import { getUserToken } from "@/services/storage-data";

interface AISidebarProps {
  onNewJobClick: () => void;
  conversationsHistory?: any[];
  onConversationSelect?: (sessionId: string) => void;
  onRefreshHistory?: () => void;
  selectedConversation?: any;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
  conversationLimit?: number;
  currentConversationCount?: number;
}

const AISidebar = ({
  onNewJobClick,
  conversationsHistory = [],
  onConversationSelect,
  onRefreshHistory,
  selectedConversation,
  isCollapsed = false,
  onToggleCollapse,
  onClose,
  conversationLimit,
  currentConversationCount,
}: AISidebarProps) => {
  const { classes } = useStyle({ isCollapsed });
  const isMobile = useIsMobile();
  const user = useRecoilValue<any>(userState);
  const hasToken = !!getUserToken();

  // Show counter for Go AI users (trial/limited users)
  const showConversationCounter =
    !user?.isGoAiUser &&
    conversationLimit &&
    currentConversationCount !== undefined;

  return (
    <div style={classes.sidebarContainer}>
      {/* Header */}
      <div style={classes.header}>
        <div style={classes.brandingContainer}>
          <div style={classes.logoContainer}>
            <ChatBubbleOutlineOutlinedIcon style={classes.chatIcon} />
          </div>
          {!isCollapsed && (
            <div style={classes.brandingText}>
              <div style={classes.brandTitle}>Go AI</div>
              <div style={classes.brandSubtitle}>Light Edition</div>
            </div>
          )}
        </div>
        {/* Arrow back button on mobile, toggle button on desktop */}
        {isMobile ? (
          <div
            style={{
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: "50%",
              backgroundColor: "transparent",
              transition: "background-color 0.2s",
            }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3F4F6";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <ArrowForwardRoundedIcon
              style={{ fontSize: 24, color: "#6B7280" }}
            />
          </div>
        ) : (
          <div style={(classes as any).toggleButton} onClick={onToggleCollapse}>
            {isCollapsed ? (
              <ChevronRightIcon style={(classes as any).toggleIcon} />
            ) : (
              <ChevronLeftIcon style={(classes as any).toggleIcon} />
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {!isCollapsed && (
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
      )}

      {/* Content Area */}
      {!isCollapsed && (
        <div style={classes.contentContainer}>
          {/* Jobs History Section */}
          <div style={classes.jobHistorySection}>
            <div style={classes.sectionTitle}>
              <HistoryRoundedIcon style={classes.sectionIcon} />
              <span>Jobs History</span>
              {onRefreshHistory && (
                <button
                  onClick={onRefreshHistory}
                  style={classes.refreshButton}
                >
                  <CachedRoundedIcon
                    style={{ fontSize: 16, color: "#ec4899" }}
                  />
                  <span style={{ fontSize: 12, color: "#666" }}>Refresh</span>
                </button>
              )}
            </div>
            {showConversationCounter && (
              <div style={classes.conversationCounter}>
                {currentConversationCount}/{conversationLimit}
              </div>
            )}
            {conversationsHistory.length === 0 ? (
              <div className="ai-empty-state" style={classes.emptyState}>
                <div style={classes.emptyStateIcon}>💬</div>
                <div style={classes.emptyStateText}>No jobs yet</div>
                <div style={classes.emptyStateSubtext}>
                  Start chatting to see your job history
                </div>
              </div>
            ) : (
              <div
                style={{
                  ...classes.jobHistoryList,
                  ...classes.scrollableList,
                }}
              >
                {conversationsHistory.map((conversation, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      onConversationSelect?.(conversation.sessionId)
                    }
                    style={{
                      ...classes.navItem,
                      backgroundColor:
                        selectedConversation?.sessionId ===
                        conversation.sessionId
                          ? "#FDF2F8"
                          : "transparent",
                      cursor: "pointer",
                      marginBottom: "4px",
                      padding: "12px",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: "500" }}>
                      {conversation.conversationName || `Job ${index + 1}`}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={classes.footer}>
        {isCollapsed ? (
          // Collapsed footer - simplified version
          <div style={classes.collapsedFooter}>
            {!user?.isGoAiUser && hasToken && (
              <button
                style={classes.collapsedBackButton}
                onClick={() => {
                  window.location.href = "/";
                }}
                title="Back to GoMake"
              >
                <HomeIcon style={classes.collapsedBackButtonIcon} />
              </button>
            )}
            <div style={classes.collapsedPoweredBy}>
              <GoMakeIcon
                color="linear-gradient(135deg, #9333ea, #ec4899)"
                height={16}
                width={56}
              />
            </div>
          </div>
        ) : (
          // Expanded footer - full version
          <>
            {!user?.isGoAiUser && hasToken && (
              <button
                style={(classes as any).backButton}
                onClick={() => {
                  window.location.href = "/";
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#FDF2F8";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#FDF2F8";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <HomeIcon style={(classes as any).backButtonIcon} />
                <span style={(classes as any).backButtonText}>
                  Back to GoMake
                </span>
              </button>
            )}
            <div style={(classes as any).poweredByContainer}>
              <div style={classes.poweredByLbl}>Powered by</div>
              <GoMakeIcon
                color="linear-gradient(135deg, #9333ea, #ec4899)"
                //color="#2E3092"
                height={20}
                width={100}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export { AISidebar };
