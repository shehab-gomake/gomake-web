import React from "react";
import { useStyle } from "./style";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import HomeIcon from "@mui/icons-material/Home";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { GoMakeIcon } from "@/components/icons/go-make-icon";
import CachedRoundedIcon from "@mui/icons-material/CachedRounded";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import InventoryIcon from "@mui/icons-material/Inventory";
import BoltIcon from "@mui/icons-material/Bolt";
import { useIsMobile } from "@/hooks/use-responsive";
import { useRecoilValue } from "recoil";
import { userState } from "@/store";
import { getUserToken } from "@/services/storage-data";
import {
  printHouseHasCustomizeAIFeature,
  printHouseHasMISFeature,
} from "@/store/print-house-profile";

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
  const isMobile = useIsMobile();
  const { classes } = useStyle({ isCollapsed, isMobile });
  const user = useRecoilValue<any>(userState);
  // const hasToken = !!getUserToken();
  const hasCustomizeAIFeature = useRecoilValue(printHouseHasCustomizeAIFeature);
  const hasMISFeature = useRecoilValue(printHouseHasMISFeature);

  const showConversationCounter =
    user?.isGoAiUser &&
    conversationLimit &&
    currentConversationCount !== undefined;

  const showNavButtons = hasCustomizeAIFeature;
  const showHomeButton = hasMISFeature;

  // Collapsed button styles
  const collapsedButtonBase = {
    width: isMobile ? 32 : 40,
    height: isMobile ? 32 : 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.25s ease",
    border: "none",
  };

  const collapsedGradientButton = {
    ...collapsedButtonBase,
  };

  const collapsedHomeButton = {
    ...collapsedButtonBase,
    border: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
  };

  // Expanded button styles
  const expandedButtonBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: isMobile ? 6 : 8,
    padding: isMobile ? "8px 12px" : "10px 16px",
    borderRadius: 9999,
    fontFamily: "Inter, sans-serif",
    fontSize: isMobile ? 12 : 13,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.25s ease",
  };

  const expandedGradientButton = {
    ...expandedButtonBase,
    border: "none",
    color: "#FFF",
  };

  const expandedHomeButton = {
    ...expandedButtonBase,
    border: "1px solid #E5E7EB",
    backgroundColor: "#F9FAFB",
    color: "#374151",
  };

  // Hover handlers
  const handleGradientHover = (
    e: React.MouseEvent<HTMLButtonElement>,
    isPrimary: boolean
  ) => {
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const handleGradientLeave = // e.currentTarget.style.boxShadow = "0 4px 10px rgba(236, 72, 153, 0.25)";
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.currentTarget.style.transform = "translateY(0)";
    };

  const handleHomeHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#F3F4F6";
    e.currentTarget.style.transform = "translateY(-2px)";
  };

  const handleHomeLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#F9FAFB";
    e.currentTarget.style.transform = "translateY(0)";
  };

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
              <div style={classes.scrollableList}>
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
                      padding: "6px 12px",
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
          <CollapsedFooter
            showNavButtons={showNavButtons}
            showHomeButton={showHomeButton}
            collapsedGradientButton={collapsedGradientButton}
            collapsedHomeButton={collapsedHomeButton}
            handleGradientHover={handleGradientHover}
            handleGradientLeave={handleGradientLeave}
            handleHomeHover={handleHomeHover}
            handleHomeLeave={handleHomeLeave}
            collapsedPoweredBy={classes.collapsedPoweredBy}
          />
        ) : (
          <ExpandedFooter
            showNavButtons={showNavButtons}
            showHomeButton={showHomeButton}
            expandedGradientButton={expandedGradientButton}
            expandedHomeButton={expandedHomeButton}
            handleGradientHover={handleGradientHover}
            handleGradientLeave={handleGradientLeave}
            handleHomeHover={handleHomeHover}
            handleHomeLeave={handleHomeLeave}
            poweredByContainer={(classes as any).poweredByContainer}
            poweredByLbl={classes.poweredByLbl}
          />
        )}
      </div>
    </div>
  );
};

// Collapsed Footer Component
interface CollapsedFooterProps {
  showNavButtons: boolean;
  showHomeButton: boolean;
  collapsedGradientButton: React.CSSProperties;
  collapsedHomeButton: React.CSSProperties;
  handleGradientHover: (
    e: React.MouseEvent<HTMLButtonElement>,
    isPrimary: boolean
  ) => void;
  handleGradientLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleHomeHover: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleHomeLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  collapsedPoweredBy: React.CSSProperties;
}

const CollapsedFooter = ({
  showNavButtons,
  showHomeButton,
  collapsedGradientButton,
  collapsedHomeButton,
  handleGradientHover,
  handleGradientLeave,
  handleHomeHover,
  handleHomeLeave,
  collapsedPoweredBy,
}: CollapsedFooterProps) => {
  const isMobile = useIsMobile();
  const iconSize = isMobile ? 16 : 18;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isMobile ? 6 : 8,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: isMobile ? 8 : 10,
          width: "100%",
        }}
      >
        {/* Machines and Materials Buttons - only show if hasCustomizeAIFeature */}
        {showNavButtons && (
          <>
            {/* Machines Button */}
            <button
              style={{
                ...collapsedGradientButton,
                background: "linear-gradient(135deg, #9333EA, #EC4899)",
              }}
              onMouseEnter={(e) => handleGradientHover(e, true)}
              onMouseLeave={handleGradientLeave}
              onClick={() => (window.location.href = "/machines")}
              title="Machines"
            >
              <PrecisionManufacturingIcon
                style={{ fontSize: iconSize, color: "#FFF" }}
              />
            </button>

            {/* Materials Button */}
            <button
              style={{
                ...collapsedGradientButton,
                background: "linear-gradient(135deg, #EC4899, #9333EA)",
              }}
              onMouseEnter={(e) => handleGradientHover(e, false)}
              onMouseLeave={handleGradientLeave}
              onClick={() => (window.location.href = "/materials")}
              title="Materials"
            >
              <InventoryIcon style={{ fontSize: iconSize, color: "#FFF" }} />
            </button>

            {/* Actions Button */}
            <button
              style={{
                ...collapsedGradientButton,
                //  background: "linear-gradient(135deg, #F59E0B, #EF4444)",
                background: "linear-gradient(135deg, #9333EA, #EC4899)",
              }}
              onMouseEnter={(e) => handleGradientHover(e, false)}
              onMouseLeave={handleGradientLeave}
              onClick={() => (window.location.href = "/actions")}
              title="Actions"
            >
              <BoltIcon style={{ fontSize: iconSize, color: "#FFF" }} />
            </button>
          </>
        )}

        {/* Home Button - show separately based on showHomeButton */}
        {showHomeButton && (
          <button
            style={collapsedHomeButton}
            onMouseEnter={handleHomeHover}
            onMouseLeave={handleHomeLeave}
            onClick={() => (window.location.href = "/")}
            title="Back to Home"
          >
            <HomeIcon style={{ fontSize: iconSize, color: "#374151" }} />
          </button>
        )}
      </div>

      {/* Powered By */}
      <div style={collapsedPoweredBy}>
        <GoMakeIcon
          color="linear-gradient(135deg, #9333ea, #ec4899)"
          height={isMobile ? 12 : 16}
          width={isMobile ? 42 : 56}
        />
      </div>
    </div>
  );
};

// Expanded Footer Component
interface ExpandedFooterProps {
  showNavButtons: boolean;
  showHomeButton: boolean;
  expandedGradientButton: React.CSSProperties;
  expandedHomeButton: React.CSSProperties;
  handleGradientHover: (
    e: React.MouseEvent<HTMLButtonElement>,
    isPrimary: boolean
  ) => void;
  handleGradientLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleHomeHover: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleHomeLeave: (e: React.MouseEvent<HTMLButtonElement>) => void;
  poweredByContainer: React.CSSProperties;
  poweredByLbl: React.CSSProperties;
}

const ExpandedFooter = ({
  showNavButtons,
  showHomeButton,
  expandedGradientButton,
  expandedHomeButton,
  handleGradientHover,
  handleGradientLeave,
  handleHomeHover,
  handleHomeLeave,
  poweredByContainer,
  poweredByLbl,
}: ExpandedFooterProps) => {
  const isMobile = useIsMobile();
  const iconSize = isMobile ? 16 : 18;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 8 : 10,
          width: "100%",
          // marginTop: isMobile ? 6 : 8,
        }}
      >
        {/* Machines and Materials Buttons - only show if hasCustomizeAIFeature */}
        {showNavButtons && (
          <>
            {/* Machines Button */}
            <button
              style={{
                ...expandedGradientButton,
                background: "linear-gradient(135deg, #9333EA, #EC4899)",
              }}
              onMouseEnter={(e) => handleGradientHover(e, true)}
              onMouseLeave={handleGradientLeave}
              onClick={() => (window.location.href = "/machines")}
            >
              <PrecisionManufacturingIcon
                style={{ fontSize: iconSize, color: "#FFF" }}
              />
              Machines
            </button>

            {/* Materials Button */}
            <button
              style={{
                ...expandedGradientButton,
                background: "linear-gradient(135deg, #EC4899, #9333EA)",
              }}
              onMouseEnter={(e) => handleGradientHover(e, false)}
              onMouseLeave={handleGradientLeave}
              onClick={() => (window.location.href = "/materials")}
            >
              <InventoryIcon style={{ fontSize: iconSize, color: "#FFF" }} />
              Materials
            </button>

            {/* Actions Button */}
            <button
              style={{
                ...expandedGradientButton,
                background: "linear-gradient(135deg, #9333EA, #EC4899)",
              }}
              onMouseEnter={(e) => handleGradientHover(e, false)}
              onMouseLeave={handleGradientLeave}
              onClick={() => (window.location.href = "/actions")}
            >
              <BoltIcon style={{ fontSize: iconSize, color: "#FFF" }} />
              Actions
            </button>
          </>
        )}

        {/* Home Button - show separately based on showHomeButton */}
        {showHomeButton && (
          <button
            style={expandedHomeButton}
            onMouseEnter={handleHomeHover}
            onMouseLeave={handleHomeLeave}
            onClick={() => (window.location.href = "/")}
          >
            <HomeIcon style={{ fontSize: iconSize, color: "#374151" }} />
            Back to Home
          </button>
        )}
      </div>

      {/* Powered By */}
      <div style={poweredByContainer}>
        <div style={poweredByLbl}>Powered by</div>
        <GoMakeIcon
          color="linear-gradient(135deg, #9333ea, #ec4899)"
          height={isMobile ? 16 : 20}
          width={isMobile ? 80 : 100}
        />
      </div>
    </>
  );
};

export { AISidebar };
