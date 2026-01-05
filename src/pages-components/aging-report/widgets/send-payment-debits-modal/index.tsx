import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Stack, Typography, Divider, Box, CircularProgress } from "@mui/material";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { GomakeTextInput } from "@/components/text-input/text-input";
import { PrimaryTable } from "@/components/tables/primary-table";
import { useStyle } from "./style";
import { getDocumentTypeName } from "../../../transaction-journal-report/use-transaction-journal-report";
import { format } from "date-fns";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { getLabelTypography } from "@/utils/typography-utils";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { FONT_FAMILY } from "@/utils/font-family";
import { GoMakeSelect } from "@/components/auto-complete/go-make-select";

interface DebitItem {
  docType: number;
  docNumber: string;
  docDate?: string;
  dueDate?: string;
  total: number;
  [key: string]: any;
}

interface IContactData {
  id: string;
  clientId: string;
  mail: string | null;
  name: string;
  phone: string | null;
  phoneNumber?: string | null;
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
  clientContacts?: IContactData[];
}

const SendPaymentDebitsModal = ({
  openModal,
  onClose,
  customerName = "",
  debits = [],
  onSend,
  isLoading = false,
  clientContacts = [],
}: SendPaymentDebitsModalProps) => {
  const { t } = useTranslation();
  const { secondColor, primaryColor } = useGomakeTheme();
  const classes = useStyle();
  const direction: "rtl" | "ltr" = t("direction");
  const isRTL = direction === "rtl";

  const [selectedDebitIds, setSelectedDebitIds] = useState<Set<string>>(new Set());
  const [customPaymentValues, setCustomPaymentValues] = useState<Map<string, number>>(new Map());
  const [numberOfInstallments, setNumberOfInstallments] = useState<number>(1);
  const [sendByEmail, setSendByEmail] = useState<boolean>(false);
  const [sendBySms, setSendBySms] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [selectedContact, setSelectedContact] = useState<IContactData | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const SELECT_ALL_CHECKBOX_DELAY = 200;

  // Reset all state when modal closes
  const resetAllState = useCallback(() => {
    setSelectedDebitIds(new Set());
    setCustomPaymentValues(new Map());
    setNumberOfInstallments(1);
    setEmail("");
    setPhoneNumber("");
    setSendByEmail(false);
    setSendBySms(false);
    setSelectedContact(null);
  }, []);

  // Initialize and reset state based on modal open/close
  useEffect(() => {
    if (openModal && !isLoading && debits.length > 0) {
      // Initialize state when modal opens and data is loaded
      const allIds = new Set(debits.map((debit) => debit.docNumber));
      setSelectedDebitIds(allIds);

      // Set first contact as default if available and no contact is selected
      if (clientContacts.length > 0) {
        setSelectedContact((prev) => {
          if (!prev) {
            const firstContact = clientContacts[0];
            if (firstContact.mail) setEmail(firstContact.mail);
            if (firstContact.phone || firstContact.phoneNumber) {
              setPhoneNumber(firstContact.phone || firstContact.phoneNumber || "");
            }
            return firstContact;
          }
          return prev;
        });
      }

      // Programmatically click the select-all checkbox after table renders
      const timeoutId = setTimeout(() => {
        const selectAllCheckbox = tableContainerRef.current?.querySelector(
          'thead input[type="checkbox"][aria-label="select all"]'
        ) as HTMLInputElement;

        if (selectAllCheckbox && !selectAllCheckbox.checked) {
          selectAllCheckbox.click();
        }
      }, SELECT_ALL_CHECKBOX_DELAY);

      return () => clearTimeout(timeoutId);
    } else if (!openModal) {
      // Reset all state when modal closes
      resetAllState();
    }
  }, [openModal, isLoading, debits, clientContacts, resetAllState]);

  // Handle contact selection change
  const handleContactChange = useCallback((event: any, value: IContactData | null) => {
    setSelectedContact(value);
    if (value) {
      if (value.mail) setEmail(value.mail);
      if (value.phone || value.phoneNumber) {
        setPhoneNumber(value.phone || value.phoneNumber || "");
      }
    } else {
      setEmail("");
      setPhoneNumber("");
    }
  }, []);

  const selectedDebits = useMemo(() => {
    return debits.filter((debit) => selectedDebitIds.has(debit.docNumber));
  }, [debits, selectedDebitIds]);

  const totalPayment = useMemo(() => {
    return selectedDebits.reduce((sum, debit) => {
      const customValue = customPaymentValues.get(debit.docNumber);
      const paymentValue = customValue !== undefined ? customValue : (debit.total || 0);
      return sum + paymentValue;
    }, 0);
  }, [selectedDebits, customPaymentValues]);

  // Handle payment value change with validation
  const handlePaymentValueChange = useCallback((docNumber: string, value: string, originalTotal: number) => {
    // Allow empty value for better UX
    if (value === "" || value === "-") {
      return;
    }

    const numValue = parseFloat(value);
    
    // Check if value is a valid number
    if (isNaN(numValue)) {
      return; // Don't update if invalid
    }

    // Validation: If original is positive, new value must be between 0 and original
    // If original is negative, new value must be between original and 0
    let isValid = false;
    if (originalTotal >= 0) {
      isValid = numValue >= 0 && numValue <= originalTotal;
    } else {
      isValid = numValue >= originalTotal && numValue <= 0;
    }

    if (isValid) {
      setCustomPaymentValues((prev) => {
        const newMap = new Map(prev);
        newMap.set(docNumber, numValue);
        return newMap;
      });
    }
  }, []);

  // Handle blur to validate and reset if invalid
  const handlePaymentValueBlur = useCallback((docNumber: string, value: string, originalTotal: number) => {
    const numValue = parseFloat(value);
    
    // If empty or invalid, reset to original
    if (value === "" || isNaN(numValue)) {
      setCustomPaymentValues((prev) => {
        const newMap = new Map(prev);
        newMap.delete(docNumber);
        return newMap;
      });
      return;
    }

    // Validation: If original is positive, new value must be between 0 and original
    // If original is negative, new value must be between original and 0
    let isValid = false;
    if (originalTotal >= 0) {
      isValid = numValue >= 0 && numValue <= originalTotal;
    } else {
      isValid = numValue >= originalTotal && numValue <= 0;
    }

    // If invalid, reset to original
    if (!isValid) {
      setCustomPaymentValues((prev) => {
        const newMap = new Map(prev);
        newMap.delete(docNumber);
        return newMap;
      });
    }
  }, []);


  // Transform debits data for PrimaryTable
  const tableHeaders = useMemo(() => {
    return [
      t("reports.documentType"),
      t("reports.documentNumber"),
      t("reports.documentDate"),
      t("reports.dueDate"),
      t("reports.balanceDue"),
    ];
  }, [t]);

  const formatDate = useCallback((dateStr?: string): string => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "dd-MM-yyyy");
    } catch {
      return dateStr;
    }
  }, []);

  const tableRows = useMemo(() => {
    return debits.map((debit) => {
      const isSelected = selectedDebitIds.has(debit.docNumber);
      const customValue = customPaymentValues.get(debit.docNumber);
      const displayValue = customValue !== undefined ? customValue : (debit.total || 0);
      
      return [
        getDocumentTypeName(t, debit.docType),
        debit.docNumber,
        formatDate(debit?.docDate),
        formatDate(debit?.dueDate),
        isSelected ? (
          <Box key={`total-input-${debit.docNumber}`} sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <GomakeTextInput
              type="number"
              value={displayValue.toString()}
              onChange={(e) => handlePaymentValueChange(debit.docNumber, e.target.value, debit.total || 0)}
              onBlur={(e) => handlePaymentValueBlur(debit.docNumber, e.target.value, debit.total || 0)}
              style={{
                width: "120px",
                textAlign: "center",
                direction: isRTL ? "rtl" : "ltr",
              }}
            />
          </Box>
        ) : (
          <span key={`total-${debit.docNumber}`} style={{ textAlign: "center", display: "block", width: "100%" }}>
            {debit.total?.toLocaleString() || "0"}
          </span>
        ),
      ];
    });
  }, [debits, t, formatDate, selectedDebitIds, customPaymentValues, handlePaymentValueChange, handlePaymentValueBlur, isRTL]);


  const handleSend = useCallback(() => {
    if (selectedDebits.length === 0) {
      return;
    }
    if (!sendByEmail && !sendBySms) {
      return;
    }

    // Map selected debits with custom payment values
    const selectedDebitsWithPayment = selectedDebits.map((debit) => {
      const customValue = customPaymentValues.get(debit.docNumber);
      return {
        ...debit,
        totalPayment: customValue !== undefined ? customValue : (debit.total || 0),
      };
    });

    onSend({
      selectedDebits: selectedDebitsWithPayment,
      numberOfInstallments,
      sendBySms,
      sendByEmail,
      sendByWhatsApp: false,
      email,
      phoneNumber,
    });
  }, [selectedDebits, customPaymentValues, numberOfInstallments, sendBySms, sendByEmail, email, phoneNumber, onSend]);

  const handleEmailCheckboxChange = useCallback((checked: boolean) => {
    setSendByEmail(checked);
  }, []);

  const handlePhoneCheckboxChange = useCallback((checked: boolean) => {
    setSendBySms(checked);
  }, []);



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
        (!sendByEmail && !sendBySms) ||
        isLoading
      }
      primaryButtonLoading={isLoading}
      customStyles={{
        primaryButton: {
          backgroundColor: selectedDebits.length === 0 || (!sendByEmail && !sendBySms) || isLoading ? "#cccccc" : primaryColor(500),
          color: selectedDebits.length === 0 || (!sendByEmail && !sendBySms) || isLoading ? "#666666" : "#FFFFFF",
          cursor: selectedDebits.length === 0 || (!sendByEmail && !sendBySms) || isLoading ? "not-allowed" : "pointer",
        },
      }}
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
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <Stack direction="column" alignItems="center" gap="16px">
              <CircularProgress size={40} />
              <Typography style={getLabelTypography()}>
                {t("tickets.loading")}
              </Typography>
            </Stack>
          </Box>
        ) : (
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
        )}

        {/* Contact Selector */}
        {!isLoading && clientContacts.length > 0 && (
          <Stack direction="row" alignItems="center" gap="16px">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Typography style={getLabelTypography()} >
                {t("customers.modal.contacts") || "Contact"}
              </Typography>
              <Box sx={{ width: "300px" }}>
                <GoMakeSelect
                  value={selectedContact}
                  onChange={handleContactChange}
                  options={clientContacts}
                  getOptionLabel={(option) => option?.name || ""}
                  placeholder={t("prePayment.selectContact") || "Select contact"}
                  style={{ direction: isRTL ? "rtl" : "ltr" }}
                />
              </Box>
            </div>
            {sendByEmail && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography style={getLabelTypography()} >
                  {t("sales.quote.email") || "Email"}
                </Typography>
                <Box sx={{ width: "300px" }}>
                  <GomakeTextInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("sales.quote.email") || "Email"}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  />
                </Box>
              </div>
            )}

            {/* Phone Number Field - Show when phone checkbox is selected */}
            {sendBySms && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Typography style={getLabelTypography()} >
                  {t("customers.phone") || "Phone Number"}
                </Typography>
                <Box sx={{ width: "300px" }}>
                  <GomakeTextInput
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t("customers.phone") || "Phone Number"}
                    style={{ direction: isRTL ? "rtl" : "ltr" }}
                  />
                </Box>
              </div>
            )}
          </Stack>
        )}

        {/* Number of Installments */}
        {!isLoading && (
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
        )}

        {/* Sending Methods */}
        {!isLoading && (
          <Stack direction="row" gap="24px" alignItems="center">
            <Typography style={getLabelTypography()}>
              {t("reports.sendingMethod") || "Sending method"}
            </Typography>
            <Stack direction="row" gap="16px">
              <Stack direction="row" alignItems="center" gap="8px">
                <PrimaryCheckbox
                  checked={sendBySms}
                  onChange={(e) => handlePhoneCheckboxChange(e.target.checked)}
                />
                <Typography>{t("customers.phone") || "Phone"}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap="8px">
                <PrimaryCheckbox
                  checked={sendByEmail}
                  onChange={(e) => handleEmailCheckboxChange(e.target.checked)}
                />
                <Typography>{t("sales.quote.email")}</Typography>
              </Stack>
            </Stack>
          </Stack>
        )}


        {/* Total Payment */}
        {!isLoading && (
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
        )}
      </Stack>
    </GoMakeDialog>
  );
};

export { SendPaymentDebitsModal };
export type { DebitItem };

