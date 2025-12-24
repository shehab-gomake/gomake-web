import { ENotificationType, ISystemNotification } from "@/store/system-notifications";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

const NotificationMessageComponent = ({ message, type, documentId }: ISystemNotification) => {
  const { primaryColor } = useGomakeTheme();
  const style = {
    color: primaryColor(900),
    ...FONT_FAMILY.Lexend(400, 16),
    textDecoration: "none",
  };
  const { t } = useTranslation();
  return type === ENotificationType.QUOTE_APPROVED_STATUS ? (
    <Link style={style} href={`/quotes?finalPatternSearch=${message}`}>
      {t("notifications.approvedQuoteMessage", {
        number: message,
      })}
    </Link>
  ) : type === ENotificationType.QUOTE_APPROVED_BY_MANAGER_STATUS ? (
    <Link style={style} href={`/quotes?finalPatternSearch=${message}`}>
      {t("notifications.adminApprovedQuoteMessage", {
        number: message,
      })}
    </Link>
  ) : type === ENotificationType.QUOTE_REJECTED_BY_MANAGER_STATUS ? (
    <Link style={style} href={`/quotes?finalPatternSearch=${message}`}>
      {t("notifications.adminRejectedQuoteMessage", {
        number: message,
      })}
    </Link>
  ) : type === ENotificationType.QUOTE_REJECTED_STATUS ? (
    <Link style={style} href={`/quotes?finalPatternSearch=${message}`}>
      {t("notifications.rejectedQuoteMessage", {
        number: message,
      })}
    </Link>
  ) : type === ENotificationType.BOARD_MISSIONS_APPROVED_STATUS ? (
    <Link style={style} href={`/production-floor?boardMissionsId=${documentId}&step=stations`}>
      {t("notifications.approvedBoardMissionsMessage", {
        number: message,
      })}
    </Link>
  ) : type === ENotificationType.BOARD_MISSIONS_REJECTED_STATUS ? (
    <Link style={style} href={`/production-floor?boardMissionsId=${documentId}&step=stations`}>
      {t("notifications.rejectedBoardMissionsMessage", {
        number: message,
      })}
    </Link>
  ) : type === ENotificationType.INVOICE_PAYMENT_REQUEST_PAID_BY_CLIENT ? (
    <Link style={style} href={`/invoice?id=${documentId}`}>
      {t("notifications.paymentRequestForInvoiceSuccess", {
        number: message,
      })}
    </Link>
  ) : type === ENotificationType.ORDER_PAYMENT_REQUEST_PAID_BY_CLIENT ? (
    <Link style={style} href={`/order?id=${documentId}`}>
      {t("notifications.paymentRequestForOrderSuccess", {
        number: message,
      })}
    </Link>
  ) : (
    <span>{message}</span>
  );
};

export { NotificationMessageComponent };
