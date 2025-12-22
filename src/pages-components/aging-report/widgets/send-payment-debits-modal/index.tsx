import { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Typography, Divider, Box } from "@mui/material";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { SecondaryCheckBox } from "@/components/check-box/secondary-check-box";
import { GomakeTextInput } from "@/components/text-input/text-input";
import { SecondaryButton } from "@/components/button/secondary-button";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useStyle } from "./style";
import { getDocumentTypeName } from "../../../transaction-journal-report/use-transaction-journal-report";
import { format } from "date-fns";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { getLabelTypography } from "@/utils/typography-utils";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { FONT_FAMILY } from "@/utils/font-family";
import { SendIcon } from "@/pages-components/quotes/widgets/delivery-status-button/utils/icons";

interface DebitItem {
  docType: number;
  docNumber: string;
  docDate?: string;
  dueDate?: string;
  total: number;
  [key: string]: any;
}

interface SendPaymentDebitsModalProps {
  openModal: boolean;
  onClose: () => void;
  customerName?: string;
  debits: DebitItem[];
  onSend: (data: {
    selectedDebits: DebitItem[];
    numberOfInstallments: number;
    sendBySms: boolean;
    sendByEmail: boolean;
    sendByWhatsApp: boolean;
    email: string;
    phoneNumber: string;
  }) => void;
  isLoading?: boolean;
  initialEmail?: string;
  initialPhoneNumber?: string;
}

const SendPaymentDebitsModal = ({
  openModal,
  onClose,
  customerName = "",
  debits = [],
  onSend,
  isLoading = false,
  initialEmail = "",
  initialPhoneNumber = "",
}: SendPaymentDebitsModalProps) => {
  const { t } = useTranslation();
  const { secondColor } = useGomakeTheme();
  const classes = useStyle();
  const direction: "rtl" | "ltr" = t("direction");
  const isRTL = direction === "rtl";

  const [selectedDebitIds, setSelectedDebitIds] = useState<Set<string>>(new Set());
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(1);
  const [sendBySms, setSendBySms] = useState<boolean>(false);
  const [sendByEmail, setSendByEmail] = useState<boolean>(false);
  const [sendByWhatsApp, setSendByWhatsApp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Select all debits by default when modal opens
  useEffect(() => {
    if (openModal && debits.length > 0) {
      const allIds = new Set(debits.map((debit) => debit.docNumber));
      setSelectedDebitIds(allIds);

      // Programmatically click the select-all checkbox after table renders
      // This will trigger PrimaryTable's internal selection mechanism
      const timeoutId = setTimeout(() => {
        if (tableContainerRef.current) {
          // Find the select-all checkbox in the table header
          // PrimaryTable uses PrimaryCheckbox which renders an input inside
          const selectAllCheckbox = tableContainerRef.current.querySelector(
            'thead input[type="checkbox"][aria-label="select all"]'
          ) as HTMLInputElement;

          if (selectAllCheckbox && !selectAllCheckbox.checked) {
            // Click the select-all checkbox to select all rows
            selectAllCheckbox.click();
          }
        }
      }, 200);

      return () => clearTimeout(timeoutId);
    } else if (!openModal) {
      // Reset selection when modal closes
      setSelectedDebitIds(new Set());
    }
  }, [openModal, debits]);

  const handleToggleDebit = (docNumber: string) => {
    setSelectedDebitIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(docNumber)) {
        newSet.delete(docNumber);
      } else {
        newSet.add(docNumber);
      }
      return newSet;
    });
  };

  const selectedDebits = useMemo(() => {
    return debits.filter((debit) => selectedDebitIds.has(debit.docNumber));
  }, [debits, selectedDebitIds]);

  const totalPayment = useMemo(() => {
    return selectedDebits.reduce((sum, debit) => sum + (debit.total || 0), 0);
  }, [selectedDebits]);

  const allSelected = useMemo(() => {
    return debits.length > 0 && selectedDebitIds.size === debits.length;
  }, [debits.length, selectedDebitIds.size]);

  const someSelected = useMemo(() => {
    return selectedDebitIds.size > 0 && selectedDebitIds.size < debits.length;
  }, [selectedDebitIds.size, debits.length]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(debits.map((debit) => debit.docNumber));
      setSelectedDebitIds(allIds);
    } else {
      setSelectedDebitIds(new Set());
    }
  };

  // Transform debits data for PrimaryTable
  const tableHeaders = useMemo(() => {
    return [
      t("reports.documentType"),
      t("reports.documentNumber"),
      t("reports.documentDate"),
      t("reports.dueDate"),
      t("reports.total"),
    ];
  }, [t]);

  const formatDate = (dateStr?: string) => {

    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd-MM-yyyy");
    } catch {
      return dateStr;
    }
  };

  const tableRows = useMemo(() => {
    return debits.map((debit) => {
      return [
        getDocumentTypeName(t, debit.docType),
        debit.docNumber,
        formatDate(debit?.docDate),
        formatDate(debit?.dueDate),
        <span style={{ textAlign: "center", display: "block", width: "100%" }}>
          {debit.total?.toLocaleString() || "0"}
        </span>,
      ];
    });
  }, [debits, t]);


  const handleSend = () => {
    if (selectedDebits.length === 0) {
      return;
    }
    if (!sendBySms && !sendByEmail && !sendByWhatsApp) {
      return;
    }

    onSend({
      selectedDebits,
      numberOfInstallments,
      sendBySms,
      sendByEmail,
      sendByWhatsApp,
      email,
      phoneNumber,
    });
  };



  return (
    <GoMakeDialog
      open={openModal}
      onClose={onClose}
      title={t("sales.quote.sendPayment")}
      maxWidth="lg"
      onPrimaryAction={handleSend}
      primaryButtonLabel={t("login.send")}
      primaryButtonDisabled={
        selectedDebits.length === 0 ||
        (!sendBySms && !sendByEmail && !sendByWhatsApp) ||
        isLoading
      }
      primaryButtonLoading={isLoading}
    // customFooter={
    //   <Stack
    //     direction="row"
    //     gap="10px"
    //     width="100%"
    //     justifyContent="flex-end"
    //     sx={{ padding: "16px 24px" }}
    //   >
    //     <SecondaryButton
    //       variant="outlined"
    //       onClick={onClose}
    //       style={{ minWidth: "100px" }}
    //     >
    //       {t("modal.cancel")}
    //     </SecondaryButton>
    //     <SecondaryButton
    //       variant="contained"
    //       onClick={handleSend}
    //       disabled={
    //         selectedDebits.length === 0 ||
    //         (!sendBySms && !sendByEmail && !sendByWhatsApp) ||
    //         isLoading
    //       }
    //       style={{ minWidth: "100px" }}
    //     >
    //       {t("login.send")}
    //     </SecondaryButton>
    //   </Stack>
    // }
    // showFooter={false}
    >
      <Stack direction="column" gap="20px" sx={{ padding: "20px" }}>
        <Stack direction="row" alignItems="center" gap="8px">
          <Typography style={getLabelTypography()}>
            {t("customers.modal.customerName")}:
          </Typography>
          <Typography style={{ ...getLabelTypography(), fontWeight: 600 }}>
            {customerName}
          </Typography>
        </Stack>

        <Divider />

        {/* Debits Table */}
        <Box ref={tableContainerRef} sx={{ maxHeight: "300px", ...classes.tableContainer }}>
          <PrimaryTable
            rows={tableRows}
            headers={tableHeaders}
            maxHeight="300px"
            stickyHeader={true}
            enableCheckboxes={true}
            onSelectionChange={(selectedIndices: Set<number>) => {
              // Update selected debit IDs based on PrimaryTable's selection
              const newSelectedIds = new Set<string>();
              selectedIndices.forEach((index) => {
                if (debits[index]) {
                  newSelectedIds.add(debits[index].docNumber);
                }
              });
              setSelectedDebitIds(newSelectedIds);
            }}
            rowCheckboxCondition={() => true}
          />
        </Box>

        {/* Number of Installments */}
        <Stack direction="row" alignItems="center" gap="16px">
          <Typography style={getLabelTypography()} sx={{ minWidth: "150px" }}>
            {t("prePayment.numberOfInstallments") || "Number of installments"}
          </Typography>
          <Box sx={{ width: "200px" }}>
            <GomakeTextInput
              type="number"
              value={numberOfInstallments.toString()}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setNumberOfInstallments(Math.max(1, value));
              }}
              placeholder={t("prePayment.numberOfInstallments") || "Number of installments"}
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            />
          </Box>
        </Stack>

        {/* Email Field */}
        <Stack direction="row" alignItems="center" gap="16px">
          <Typography style={getLabelTypography()} sx={{ minWidth: "150px" }}>
            {t("sales.quote.email") || "Email"}
          </Typography>
          <Box sx={{ width: "200px" }}>
            <GomakeTextInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("sales.quote.email") || "Email"}
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            />
          </Box>
        </Stack>

        {/* Phone Number Field */}
        <Stack direction="row" alignItems="center" gap="16px">
          <Typography style={getLabelTypography()} sx={{ minWidth: "150px" }}>
            {t("customers.phone") || "Phone Number"}
          </Typography>
          <Box sx={{ width: "200px" }}>
            <GomakeTextInput
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t("customers.phone") || "Phone Number"}
              style={{ direction: isRTL ? "rtl" : "ltr" }}
            />
          </Box>
        </Stack>

        {/* Sending Methods */}
        <Stack direction="row" gap="24px" alignItems="center">
          <Typography style={getLabelTypography()}>
            {t("reports.sendingMethod") || "Sending method"}
          </Typography>
          <Stack direction="row" gap="16px">
            <Stack direction="row" alignItems="center" gap="8px">
              <PrimaryCheckbox
                checked={sendBySms}
                onChange={(e) => setSendBySms(e.target.checked)}
              />
              <Typography>SMS</Typography>
            </Stack>
            <Stack direction="row" alignItems="center" gap="8px">
              <PrimaryCheckbox
                checked={sendByEmail}
                onChange={(e) => setSendByEmail(e.target.checked)}
              />
              <Typography>{t("sales.quote.email")}</Typography>
            </Stack>
            {/* <Stack direction="row" alignItems="center" gap="8px">
              <PrimaryCheckbox
                checked={sendByWhatsApp}
                onChange={(e) => setSendByWhatsApp(e.target.checked)}
              />
              <Typography>{t("sales.quote.whatsApp")}</Typography>
            </Stack> */}
          </Stack>
        </Stack>

        {/* Total Payment */}
        <Stack
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          sx={{
            backgroundColor: secondColor(50),
            gap: "10px",
          }}
        >
          <Typography
            style={{
              ...FONT_FAMILY.Lexend(500, 16),
            }} >
            {t("prePayment.totalToPay") || "Total payment"}:
          </Typography>
          <Typography
            style={{
              ...FONT_FAMILY.Lexend(700, 16),
            }}
          >
            {totalPayment.toLocaleString()}
          </Typography>
        </Stack>
      </Stack>
    </GoMakeDialog>
  );
};

export { SendPaymentDebitsModal };
export type { DebitItem };

