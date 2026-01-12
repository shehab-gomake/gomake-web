import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { FONT_FAMILY } from "@/utils/font-family";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ModalType } from "@/enums";
import { useIsMobile } from "@/hooks/use-responsive";
import { adaptMarginLeft } from "@/utils/adapter";

const useStyle = ({ modalType }: { modalType: ModalType }) => {
  const { t } = useTranslation();
  const { theme, errorColor, primaryColor } = useGomakeTheme();
  const dir: "rtl" | "ltr" = t("direction");
  const RTL = dir === "rtl";
  const isMobile = useIsMobile();

  const classes = useMemo(() => {
    return {
      container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: isMobile ? "90vw" : "-webkit-fill-available",
        minWidth: isMobile ? "unset" : 600,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
        position: "absolute" as "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)",
        padding: 24,
        zIndex: 9999999999,
      },
      content: {
        display: "flex",
        flexDirection: "column" as "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        position: "relative" as "relative",
      },
      icon: {
        display: "flex",
        flexDirection: "column" as "column",
        marginBottom: 16,
      },
      title: {
        ...FONT_FAMILY.Lexend(600, 18),
        color: "#101828",
        marginBottom: 4,
        textAlign: "center" as "center",
        width: "85%",
      },
      closeIcon: {
        display: "flex",
        cursor: "pointer" as "pointer",
        alignSelf: "flex-end",
        width: "fit-content",
        position: "absolute" as "absolute",
        top: 0,
        right: 0,
      },
      subTitle: {
        ...FONT_FAMILY.Lexend(400, 14),
        color: "#475467",
        textAlign: "center" as "center",
        marginBottom: 33,
        width: "89%",
      },
      btnsContainer: {
        display: "flex",
        flexDirection: "row-reverse" as "row-reverse",
        justifyContent: "center",
        alignItems: "center",
        gap: 11,
        width: "100%",
        ...(isMobile && { flexWrap: "wrap" as "wrap" }),
      },
      confirmBtn: {
        height: 44,
        lineHeight: "10px",
        borderRadius: "15px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor:
          modalType === ModalType.DELETE ? errorColor(500) : primaryColor(500),
        border: `1px solid ${
          modalType === ModalType.DELETE ? errorColor(500) : primaryColor(500)
        }`,
        color: "#FFF",
      },
      cancelBtn: {
        height: 44,
        borderRadius: "15px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor: "#FFF",
        color: "#344054",
        border: `1px solid #D0D5DD`,
      },
      iconStyle: {
        width: 60,
        height: 60,
        color: errorColor(300),
      },
      children: {
        marginBottom: 20,
      },
      yesBtn: {
        height: 44,
        lineHeight: "18px",
        borderRadius: "15px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor: primaryColor(500),
        border: `1px solid ${primaryColor(500)}`,
        color: "#FFF",
      },
      noBtn: {
        textAlign: "center",
        height: 44,
        borderRadius: "15px",
        lineHeight: "18px",
        ...FONT_FAMILY.Lexend(600, 16),
        backgroundColor: "#FFF",
        color: "#272977",
        border: `1px solid #7375CD`,
      },
      bottomActionContainer: {
        width: "100%",
        display: "flex",
        justifyContent: "flex-end",
        marginTop: "8px",
        paddingTop: "8px",
        ...adaptMarginLeft(dir, 16),
      },
      bottomActionButton: {
        background: "none",
        border: "none",
        cursor: "pointer",
        textDecoration: "underline",
        color: primaryColor(500),
        ...FONT_FAMILY.Lexend(500, 14),
        padding: 0,
      },
    };
  }, [theme, RTL, modalType, isMobile]);

  return {
    classes,
  };
};
export { useStyle };
