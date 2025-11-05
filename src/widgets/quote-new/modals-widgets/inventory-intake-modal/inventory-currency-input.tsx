import { useState } from "react";
import { Stack } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "@/widgets/materials-widget/style";
import { useRecoilValue } from "recoil";
import { currenciesState } from "@/widgets/materials-widget/state";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { CurrencyUpdateModal } from "./currency-update-modal";

interface InventoryCurrencyInputProps {
  value: string;
  isEditable: boolean;
  onUpdate: (newValue: string, exchangeRate?: number) => Promise<void>;
  isLoading?: boolean;
  currencyLabel: string;
}

const InventoryCurrencyInput: React.FC<InventoryCurrencyInputProps> = ({
  value,
  isEditable,
  onUpdate,
  isLoading = false,
  currencyLabel,
}) => {
  const { classes } = useStyle();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const currencies = useRecoilValue(currenciesState);

  const currencyName = () => {
    return currencies?.find(
      (c) => c?.value?.toLowerCase() === value?.toLowerCase()
    )?.label || value;
  };

  const handleModalUpdate = async (newCurrency: string, exchangeRate?: number) => {
    await onUpdate(newCurrency, exchangeRate);
  };

  return (
    <>
      <Stack direction="row" spacing={1} alignItems="center">
        {isLoading && <DotsLoader />}
        <PrimaryButton
          sx={classes.clickableData}
          onClick={() => isEditable && setOpenModal(true)}
          variant={"text"}
          style={{ minWidth: "max-content", width: "100%" }}
          disabled={!isEditable}
        >
          {currencyName()}
        </PrimaryButton>
      </Stack>
      <CurrencyUpdateModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onUpdate={handleModalUpdate}
        currentCurrency={value}
        currencyLabel={currencyLabel}
      />
    </>
  );
};

export { InventoryCurrencyInput };

