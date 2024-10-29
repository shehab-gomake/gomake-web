import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "@/pages-components/board-missions/style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect, useMemo, useState } from "react";
import { getDeliveryTickerPdfApi } from "@/services/api-service/board-missions/board-missions-table";
import { useGomakeAxios, useSnackBar } from "@/hooks";

interface IProps {
  boardMissionId: string;
  quantity: number;
  openModal: boolean;
  onClose: () => void;
}
const PrintPackingSlipModalWidget = ({
  boardMissionId,
  quantity,
  openModal,
  onClose,
}: IProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [quantityOfPackages, setQuantityOfPackages] = useState<number>(1);
  const [quantityPerPackage, setQuantityPerPackage] =
    useState<number>(quantity);

  useEffect(() => {
    setQuantityPerPackage(quantity);
  }, [quantity]);

  const remainingQuantity =
    quantity - quantityPerPackage * (quantityOfPackages - 1);
  const { alertFaultGetData, alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();

  const handleQuantityOfPackagesChange = (event) => {
    const newQuantityOfPackages = parseInt(event.target.value, 10);
    const totalQuantity = quantity || 0;
    const newQuantityPerPackage = Math.ceil(
      totalQuantity / newQuantityOfPackages
    );
    setQuantityOfPackages(newQuantityOfPackages);
    setQuantityPerPackage(newQuantityPerPackage);
  };

  const handleQuantityPerPackageChange = (event) => {
    const newQuantityPerPackage = parseInt(event.target.value, 10);
    const totalQuantity = quantity;
    const newQuantityOfPackages = Math.ceil(
      totalQuantity / newQuantityPerPackage
    );
    setQuantityPerPackage(
      isNaN(newQuantityPerPackage) ? 0 : newQuantityPerPackage
    );
    setQuantityOfPackages(
      isNaN(newQuantityOfPackages) ? 1 : newQuantityOfPackages
    );
  };

  const packageInputs = useMemo(() => {
    return [...Array(isNaN(quantityOfPackages) ? 1 : quantityOfPackages)].map(
      (_, index) => (
        <div key={index} style={{ width: "40%" }}>
          <h3 style={classes.packageLabelStyle}>
            {`${t("boardMissions.package")} ${index + 1}`}
          </h3>
          <div style={classes.inputValueStyle}>
            {index === quantityOfPackages - 1
              ? remainingQuantity
              : quantityPerPackage}
          </div>
        </div>
      )
    );
  }, [quantityOfPackages, quantityPerPackage, remainingQuantity]);

  const onClickPrintPackagingSlip = async () => {
    if (quantityPerPackage > quantity) {
      alertFault("boardMissions.alertQuantity");
      return;
    }
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
        onClose();
      } else {
        alertFaultGetData();
      }
    };
    await getDeliveryTickerPdfApi(callApi, callBack, {
      boardMissionId: boardMissionId,
      quantityOnPackages: quantityPerPackage,
    });
  };

  const downloadPdf = (url) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.addEventListener("click", () => {
      setTimeout(() => {
        anchor.remove();
      }, 100);
    });
    anchor.click();
  };

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={t("boardMissions.packagesTitle")}
      insideStyle={classes.modalStyle}
      style={{ zIndex: 999999 }}
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
          <SecondaryButton
            variant={"contained"}
            onClick={onClickPrintPackagingSlip}
          >
            {t("modal.confirm")}
          </SecondaryButton>
          <SecondaryButton variant={"outlined"} onClick={onClose}>
            {t("modal.cancel")}
          </SecondaryButton>
        </Stack>
      </Stack>
    </GoMakeModal>
  );
};

export { PrintPackingSlipModalWidget };
