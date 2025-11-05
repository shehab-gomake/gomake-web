import { useState, useEffect } from "react";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { Checkbox, Stack, Box, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { currenciesState } from "@/widgets/materials-widget/state";
import { CheckboxIcon, CheckboxCheckedIcon } from "@/icons";
import { useExchangeRate } from "@/hooks/use-exchange-rate";

interface CurrencyUpdateModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (currency: string, exchangeRate?: number) => Promise<void>;
  currentCurrency: string;
  currencyLabel: string;
}

const CurrencyUpdateModal: React.FC<CurrencyUpdateModalProps> = ({
  open,
  onClose,
  onUpdate,
  currentCurrency,
  currencyLabel,
}) => {
  const { t } = useTranslation();
  const currencies = useRecoilValue(currenciesState);
  const { getExchangeRate, rate: calculatedRate, setRate: setCalculatedRate } = useExchangeRate();
  const [selectedCurrency, setSelectedCurrency] = useState<any>(null);
  const [checkedPrice, setCheckedPrice] = useState<boolean>(false);
  const [rate, setRate] = useState<string>("");
  const [isCalculatingRate, setIsCalculatingRate] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      // Find current currency in the list
      const currentCurrencyOption = currencies?.find(
        (c) => c.value?.toLowerCase() === currentCurrency?.toLowerCase()
      );
      setSelectedCurrency(currentCurrencyOption || null);
      setCheckedPrice(false);
      setRate("");
      setCalculatedRate(null);
    }
  }, [open, currentCurrency, currencies, setCalculatedRate]);

  useEffect(() => {
    // When exchange rate is calculated, update the rate field and auto-check "Update Prices"
    if (calculatedRate !== null && calculatedRate !== undefined) {
      setRate(calculatedRate.toString());
      setCheckedPrice(true);
    }
  }, [calculatedRate]);

  const handleCurrencyChange = async (event: any, value: any) => {
    setSelectedCurrency(value);
    
    // Reset previous rate
    setRate("");
    setCheckedPrice(false);
    setCalculatedRate(null);
    
    if (!value?.value) {
      return;
    }
    
    // If same currency, set rate to 1
    if (value.value === currentCurrency) {
      setCalculatedRate(1);
      return;
    }
    
    // Calculate exchange rate from current currency to selected currency
    if (currentCurrency && value.value) {
      setIsCalculatingRate(true);
      await getExchangeRate(currentCurrency, value.value);
      setIsCalculatingRate(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedCurrency) {
      return;
    }

    const exchangeRate = checkedPrice && rate ? parseFloat(rate) : undefined;
    await onUpdate(selectedCurrency.value, exchangeRate);
    onClose();
  };

  return (
    <GoMakeDialog
      open={open}
      onClose={onClose}
      title={t("materials.childTable.updateCurrency")}
      maxWidth="sm"
      showFooter={true}
      primaryButtonLabel={t("documentingSettings.update")}
      onPrimaryAction={handleSubmit}
    >
      <Stack spacing={2} sx={{ padding: "20px" }}>
        <Box>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>
            {t("materials.childTable.currency")}
          </div>
          <GoMakeAutoComplate
            style={{ width: "100%" }}
            value={selectedCurrency}
            options={currencies}
            onChange={handleCurrencyChange}
            disableClearable
            placeholder={t("materials.inputs.chooseCurrency")}
          />
        </Box>

        <Box>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Checkbox
              icon={<CheckboxIcon />}
              checkedIcon={<CheckboxCheckedIcon />}
              onChange={() => {
                setCheckedPrice(!checkedPrice);
                if (!checkedPrice && selectedCurrency?.exchangeRate) {
                  setRate(selectedCurrency.exchangeRate.toString());
                } else if (!checkedPrice) {
                  setRate("");
                }
              }}
              checked={checkedPrice}
            />
            <div style={{ fontWeight: 500 }}>{t("materials.inputs.updatePrices")}</div>
          </div>
        </Box>

        {checkedPrice && (
          <Box>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>
              {t("materials.inputs.exchangeRate") || "Exchange Rate"}
            </div>
            <Box sx={{ position: "relative", width: "100%" }}>
              {isCalculatingRate && (
                <Box
                  sx={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                >
                  <CircularProgress size={20} />
                </Box>
              )}
              <GomakeTextInput
                style={{
                  border: "0px",
                  background: "#fff",
                  borderRadius: 4,
                  height: 40,
                  width: "100%",
                }}
                onChange={(e: any) => {
                  setRate(e.target.value);
                }}
                value={rate}
                type="number"
                placeholder={
                  calculatedRate
                    ? calculatedRate.toString()
                    : selectedCurrency?.exchangeRate?.toString() || "1"
                }
                disabled={isCalculatingRate}
              />
            </Box>
          </Box>
        )}
      </Stack>
    </GoMakeDialog>
  );
};

export { CurrencyUpdateModal };

