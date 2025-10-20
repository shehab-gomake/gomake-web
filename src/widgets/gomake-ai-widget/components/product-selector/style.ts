import { useMemo } from "react";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

export const useStyle = () => {
  const { primaryColor, secondColor } = useGomakeTheme();

  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        flexDirection: "column" as const,
        height: "100%",
        padding: "32px",
        gap: "24px",
        paddingTop: "16px",
        alignItems: "center",
      },
      header: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        gap: "16px",
        textAlign: "center" as const,
        maxWidth: "600px",
      },
      headerIcon: {
        width: "54px",
        height: "54px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #f3e7ff 0%, #fce7f3 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "8px",
      },
      headerIconMobile: {
        width: "44px",
        height: "44px",
        marginBottom: "6px",
      },
      headerTitle: {
        fontSize: "32px",
        fontWeight: "700",
        background: "linear-gradient(135deg, #9333ea 0%, #ec4899 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      },
      headerTitleMobile: {
        fontSize: "20px",
      },
      headerSubtitle: {
        fontSize: "16px",
        color: "#6b7280",
        lineHeight: "1.6",
      },
      headerSubtitleMobile: {
        fontSize: "13px",
      },
      // Dropdown styles
      dropdownWrapper: {
        position: "relative" as const,
        width: "100%",
        maxWidth: "600px",
      },
      dropdownTrigger: {
        width: "100%",
        padding: "16px 20px",
        border: "2px solid",
        borderRadius: "12px",
        backgroundColor: "#fff",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        transition: "all 0.2s ease",
        fontSize: "15px",
      } as React.CSSProperties,
      dropdownTriggerMobile: {
        padding: "8px 14px",
        fontSize: "13px",
      },
      dropdownTriggerOpen: {
        boxShadow: "0 0 0 3px rgba(147, 51, 234, 0.1)",
      },
      dropdownTriggerText: {
        flex: 1,
        color: "#111827",
        fontWeight: "500",
      },
      dropdownActions: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
      },
      clearButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        backgroundColor: "#f3f4f6",
        color: "#6b7280",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.2s ease",
      } as React.CSSProperties,
      dropdownArrow: {
        color: "#9ca3af",
        fontSize: "24px",
        transition: "transform 0.2s ease",
      },
      dropdownArrowOpen: {
        transform: "rotate(180deg)",
      },
      dropdownMenu: {
        position: "absolute" as const,
        top: "calc(100% + 8px)",
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        border: "2px solid #e5e7eb",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
        maxHeight: "42vh",
        display: "flex",
        flexDirection: "column" as const,
      },
      dropdownMenuMobile: {
        maxHeight: "300px",
      },
      dropdownSearch: {
        padding: "12px",
        borderBottom: "1px solid #e5e7eb",
      },
      dropdownSearchInput: {
        width: "100%",
        padding: "10px 14px",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        fontSize: "15px",
        outline: "none",
        transition: "all 0.2s ease",
      } as React.CSSProperties,
      dropdownSearchInputMobile: {
        padding: "8px 12px",
        fontSize: "13px",
      },
      dropdownList: {
        flex: 1,
        overflowY: "auto" as const,
        padding: "8px",
      },
      dropdownItem: {
        padding: "8px 14px",
        borderRadius: "8px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        marginBottom: "4px",
      } as React.CSSProperties,
      dropdownItemSelected: {
        backgroundColor: "#faf5ff",
        borderLeft: "3px solid #9333ea",
      },
      dropdownItemName: {
        fontSize: "15px",
        fontWeight: "500",
        color: "#111827",
        marginBottom: "4px",
      },
      dropdownItemNameMobile: {
        fontSize: "13px",
      },
      dropdownItemCode: {
        fontSize: "13px",
        color: "#6b7280",
      },
      dropdownEmpty: {
        padding: "32px 16px",
        textAlign: "center" as const,
        color: "#9ca3af",
        fontSize: "15px",
      },
      // Continue button
      continueButtonContainer: {
        display: "flex",
        justifyContent: "center",
        paddingTop: "8px",
        width: "100%",
        maxWidth: "600px",
      },
      continueButton: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 32px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#fff",
        background: "linear-gradient(135deg, #9333ea 0%, #a855f7 100%)",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 12px rgba(147, 51, 234, 0.3)",
        width: "100%",
      } as React.CSSProperties,
      continueButtonMobile: {
        fontSize: "15px",
        padding: "14px 24px",
      },
      continueButtonDisabled: {
        opacity: 0.6,
        cursor: "not-allowed",
        transform: "none",
      },
      continueButtonIcon: {
        fontSize: "20px",
      },
      buttonSpinner: {
        width: "16px",
        height: "16px",
        border: "2px solid #fff",
        borderTopColor: "transparent",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      },
      // Loading state
      loadingContainer: {
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: "16px",
      },
      loadingSpinner: {
        width: "48px",
        height: "48px",
        border: "4px solid #e5e7eb",
        borderTopColor: "#9333ea",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      },
      loadingText: {
        fontSize: "16px",
        color: "#6b7280",
        fontWeight: "500",
      },
    };
  }, [primaryColor, secondColor]);

  return { classes };
};
