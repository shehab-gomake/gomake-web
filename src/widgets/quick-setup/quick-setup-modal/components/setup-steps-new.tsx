import { Box, Typography } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "../style";
import { useSetupSteps, renderOptions } from "./use-setup-steps";
import { ProductsSetupData } from "../../compoennets/interfaces";
import { ModalControls } from "@/hooks/use-modal";
import { GoMakeDeleteModal } from "@/components";
import { ModalType } from "@/enums";

interface SetupStepsProps {
  initialSetupData: ProductsSetupData;
  ActionsModal: ModalControls;
}

export const NewSetupSteps = ({
  initialSetupData,
  ActionsModal,
}: SetupStepsProps) => {
  const { classes } = useStyle();

  const {
    t,
    selectedMethods,
    handleMethodToggle,
    onSave,
    setupStepsConfig,
    confirmSetupProducts,
  } = useSetupSteps(initialSetupData, ActionsModal);

  const firstStep = setupStepsConfig.find((s) => s.type === "methods");

  const buttonsDisabled = selectedMethods.length === 0;

  return (
    <Box sx={classes.mainBox}>
      {/* Single Step Content */}
      <Box sx={{ padding: 2, overflowY: "auto", flex: 1 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          {t(`quickSetup.${firstStep?.label}`)}
        </Typography>
        {renderOptions(
          t,
          firstStep?.options || [],
          selectedMethods,
          handleMethodToggle
        )}
      </Box>

      {/* Sticky Footer with Save and Confirm Buttons */}
      <Box
        sx={{
          padding: 1,
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          backgroundColor: "#fff",
        }}
      >
        <PrimaryButton
          variant="outlined"
          onClick={() => onSave()}
          disabled={buttonsDisabled}
        >
          {t(`quickSetup.save`)}
        </PrimaryButton>
        <PrimaryButton
          variant="contained"
          onClick={confirmSetupProducts.open}
          disabled={buttonsDisabled}
        >
          {t("modal.confirm")}
        </PrimaryButton>
      </Box>

      {/* Confirm Modal */}
      <GoMakeDeleteModal
        modalType={ModalType.WARNING}
        title={t("quickSetup.confirmProductSetupTitle")}
        subTitle={t("quickSetup.confirmProductSetupSubTitle")}
        yesBtn={t("modal.confirm")}
        cancelBtn={t("modal.cancel")}
        openModal={confirmSetupProducts.isOpen}
        onClose={confirmSetupProducts.close}
        onClickDelete={() => onSave(true)}
      />
    </Box>
  );
};
