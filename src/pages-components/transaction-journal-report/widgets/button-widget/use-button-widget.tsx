import { EReportType } from "@/enums";
import { useTranslation } from "react-i18next";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SettingsIcon from "@mui/icons-material/Settings";
// import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import { PrintIcon } from "@/icons";

export interface LedgerReportButtonWidgetProps {
  onClickPrintCard: () => void;
  onClickShowCard: () => void;
  onClickCreateNewTransaction?: () => void;
  onClickOpenAdjustmentsModal?: () => void;
  onClickExportAccountingReportExcel?: () => void;
  onClickExportJournalExcelReport?: () => void;
  onClickDownloadMovingFiles?: () => void;
  onClickExportJournalPDFReport?: () => void;
  reportType: EReportType;
}

const useLedgerReportHeader = ({
  onClickPrintCard,
  onClickShowCard,
  onClickCreateNewTransaction,
  onClickOpenAdjustmentsModal,
  onClickExportAccountingReportExcel,
  onClickExportJournalExcelReport,
  onClickDownloadMovingFiles,
  onClickExportJournalPDFReport,
  reportType,
}: LedgerReportButtonWidgetProps) => {
  const { primaryColor } = useGomakeTheme();

  const { t } = useTranslation();
  const isAccountingTransaction =
    reportType === EReportType.AccountingTransaction;
  const isAdjustmentsReport = reportType === EReportType.AdjustmentsReport;
  const isDailyPaymentsReport = reportType === EReportType.DailyPayments;

  const primaryActions = [
    {
      name: t("reports.showCard"),
      onclick: onClickShowCard,
      // icon: <VisibilityIcon />,
    },
    ...(isAccountingTransaction || isAdjustmentsReport
      ? [
          {
            name: t("reports.createNewTransaction"),
            onclick: onClickCreateNewTransaction,
            // icon: <AddCircleOutlineIcon />,
          },
        ]
      : []),
    ...(isAdjustmentsReport
      ? [
          {
            name: t("reports.createNewAdjustment"),
            onclick: onClickOpenAdjustmentsModal,
            // icon: <SettingsIcon />,
          },
        ]
      : []),
  ];

  const menuActions = [
    ...(isAccountingTransaction
      ? [
          {
            name: t("reports.excelReport"),
            onclick: onClickExportAccountingReportExcel,
            icon: (
              <FileDownloadOutlinedIcon style={{ color: primaryColor(300) }} />
            ),
          },
          {
            name: t("reports.downloadAccountingFiles"),
            onclick: onClickDownloadMovingFiles,
            icon: (
              <CloudDownloadOutlinedIcon style={{ color: primaryColor(300) }} />
            ),
          },
        ]
      : []),
    ...(isDailyPaymentsReport
      ? [
          {
            name: t("reports.excelReport"),
            onclick: onClickExportJournalExcelReport,
            icon: (
              <FileDownloadOutlinedIcon style={{ color: primaryColor(300) }} />
            ),
          },
          {
            name: t("reports.printCard"),
            onclick: onClickExportJournalPDFReport,
            icon: <PrintIcon stroke={primaryColor(300)} />,
          },
        ]
      : []),
    ...(!isAccountingTransaction &&
    !isAdjustmentsReport &&
    !isDailyPaymentsReport
      ? [
          {
            name: t("reports.printCard"),
            onclick: onClickPrintCard,
            icon: <PrintIcon stroke={primaryColor(300)} />,
          },
        ]
      : []),
  ];

  return {
    primaryActions,
    menuActions,
  };
};

export { useLedgerReportHeader };
