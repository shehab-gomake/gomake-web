import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "../style";


const PrintPackingSlipModal = ({openPackagesModal , onClosePackagesModal , packageInputs ,  quantityOfPackages , quantityPerPackage , handleQuantityOfPackagesChange , handleQuantityPerPackageChange }:any) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  return (
    <GoMakeModal
    openModal={openPackagesModal}
    onClose={onClosePackagesModal}
    modalTitle={t("boardMissions.packagesTitle")}
    insideStyle={{
      width: "25%",
      borderRadius: "8px",
      height: "auto",
      maxHeight: 600,
      gap: "10px"
    }}

  >
    <Stack direction={"column"} gap={"15px"}>
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
      {packageInputs}
    </Stack>
  </GoMakeModal>
  );
};

export { PrintPackingSlipModal };