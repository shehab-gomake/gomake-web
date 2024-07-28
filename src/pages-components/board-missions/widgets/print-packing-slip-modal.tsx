import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "../style";
import { SecondaryButton } from "@/components/button/secondary-button";


const PrintPackingSlipModal = ({ openPackagesModal, onClosePackagesModal, packageInputs, quantityOfPackages, quantityPerPackage, handleQuantityOfPackagesChange, handleQuantityPerPackageChange , onClickConfirm}: any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeModal
      openModal={openPackagesModal}
      onClose={onClosePackagesModal}
      modalTitle={t("boardMissions.packagesTitle")}
      insideStyle={classes.modalStyle}
    >
      <Stack direction={"column"} gap={"15px"}>
        <Stack direction={"column"} gap={"15px"}>
          <Stack direction={"row"} gap={"15px"}>

            <div style={{ width: "40%" }}>
              <h3 style={classes.filterLabelStyle}>
                {t("boardMissions.quantityOfPackages")}
              </h3>
              <GomakeTextInput
                style={classes.textInputStyle}
                value={quantityOfPackages}
                placeholder={t("boardMissions.quantityOfPackages")}
                onChange={handleQuantityOfPackagesChange}
                type={"number"}
              />
            </div>
            <div style={{ width: "40%" }}>
              <h3 style={classes.filterLabelStyle}>
                {t("boardMissions.quantityPerPackage")}
              </h3>
              <GomakeTextInput
                style={classes.textInputStyle}
                value={quantityPerPackage}
                placeholder={t("boardMissions.quantityPerPackage")}
                onChange={handleQuantityPerPackageChange}
                type={"number"}
              />
            </div>
          </Stack>

          {packageInputs}
        </Stack>
        <Stack direction={"row"} gap={"15px"}>
          <SecondaryButton variant={'contained'} onClick={onClickConfirm} >{t('modal.confirm')}</SecondaryButton>
          <SecondaryButton variant={'outlined'} onClick={onClosePackagesModal} >{t('modal.cancel')}</SecondaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { PrintPackingSlipModal };