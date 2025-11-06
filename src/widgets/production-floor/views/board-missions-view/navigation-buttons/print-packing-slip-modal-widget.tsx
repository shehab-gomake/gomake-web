import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "@/pages-components/board-missions/style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect, useMemo, useState } from "react";
import { getDeliveryTickerPdfApi } from "@/services/api-service/board-missions/board-missions-table";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useIsMobile } from "@/hooks/use-responsive";
import { FONT_FAMILY } from "@/utils/font-family";

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
  const isMobile = useIsMobile();
  const { classes } = useStyle();
  const { t } = useTranslation();
  const [totalQuantity, setTotalQuantity] = useState<number>(quantity);
  const [quantityOfPackages, setQuantityOfPackages] = useState<number>(1);
  const [quantityPerPackage, setQuantityPerPackage] =
    useState<number>(quantity);

  useEffect(() => {
    setTotalQuantity(quantity);
    setQuantityPerPackage(quantity);
  }, [quantity]);

  const remainingQuantity =
    totalQuantity - quantityPerPackage * (quantityOfPackages - 1);
  const { alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();

  const handleTotalQuantityChange = (event) => {
    const newTotalQuantity = parseInt(event.target.value, 10);

    // Validate input - only allow positive numbers
    if (isNaN(newTotalQuantity) || newTotalQuantity <= 0) {
      return;
    }

    setTotalQuantity(newTotalQuantity);
    
    // Recalculate quantity per package based on new total quantity
    if (quantityOfPackages > 0) {
      const newQuantityPerPackage = Math.ceil(
        newTotalQuantity / quantityOfPackages
      );
      setQuantityPerPackage(newQuantityPerPackage);
    }
  };

  const handleQuantityOfPackagesChange = (event) => {
    const newQuantityOfPackages = parseInt(event.target.value, 10);

    // Validate input - only allow positive numbers
    if (isNaN(newQuantityOfPackages) || newQuantityOfPackages <= 0) {
      return;
    }

    const newQuantityPerPackage = Math.ceil(
      totalQuantity / newQuantityOfPackages
    );
    setQuantityOfPackages(newQuantityOfPackages);
    setQuantityPerPackage(newQuantityPerPackage);
  };

  const handleQuantityPerPackageChange = (event) => {
    const newQuantityPerPackage = parseInt(event.target.value, 10);

    // Validate input - only allow positive numbers
    if (isNaN(newQuantityPerPackage) || newQuantityPerPackage <= 0) {
      return;
    }

    const newQuantityOfPackages = Math.ceil(
      totalQuantity / newQuantityPerPackage
    );
    setQuantityPerPackage(newQuantityPerPackage);
    setQuantityOfPackages(newQuantityOfPackages);
  };
  const [packageQuantities, setPackageQuantities] = useState<number[]>(() => {
    const initialQuantityPerPackage = totalQuantity
      ? Math.ceil(totalQuantity / quantityOfPackages)
      : 0;
    return Array(quantityOfPackages).fill(initialQuantityPerPackage);
  });

  useEffect(() => {
    if (totalQuantity && quantityPerPackage > 0) {
      const fullPackages = Math.max(
        0,
        Math.floor(totalQuantity / quantityPerPackage)
      );
      const remainingQuantity = totalQuantity % quantityPerPackage;

      let newPackageQuantities = Array(fullPackages).fill(quantityPerPackage);
      if (remainingQuantity > 0) {
        newPackageQuantities = [...newPackageQuantities, remainingQuantity];
      }

      setPackageQuantities(newPackageQuantities);
    } else {
      setPackageQuantities([]);
    }
  }, [totalQuantity, quantityPerPackage]);

  const handlePackageQuantityChange = (index: number, newValue: number) => {
    // Validate input - only allow non-negative numbers
    if (isNaN(newValue) || newValue < 0) {
      return;
    }

    setPackageQuantities((prevQuantities) => {
      const updatedQuantities = [...prevQuantities];
      updatedQuantities[index] = newValue;

      if (index === quantityOfPackages - 1) {
        const sumOfOtherPackages = updatedQuantities
          .slice(0, -1)
          .reduce((acc, val) => acc + val, 0);
        updatedQuantities[index] = totalQuantity - sumOfOtherPackages;
      }

      return updatedQuantities;
    });
  };
  const packageInputs = useMemo(() => {
    if (quantityOfPackages && quantityOfPackages > 0 && !isNaN(quantityOfPackages)) {
      return [...Array(quantityOfPackages)].map((_, index) => (
        <div key={index} style={{ width: "30%" }}>
          <h3 style={classes.packageLabelStyle}>
            {`${t("boardMissions.package")} ${index + 1}`}
          </h3>
          <GomakeTextInput
            type="number"
            value={packageQuantities[index] || 0}
            onChange={(e) => {
              const newValue = parseInt(e.target.value, 10);
              handlePackageQuantityChange(index, newValue);
            }}
          />
        </div>
      ));
    }
  }, [quantityOfPackages, packageQuantities]);

  const onClickPrintPackagingSlip = async () => {
    if (quantityPerPackage > totalQuantity) {
      alertFault("boardMissions.alertQuantity");
      return;
    }
    const callBack = (res) => {
      if (res?.success) {
        const pdfLink = res.data;
        downloadPdf(pdfLink);
        onClose();
      } else {
        alertFault("boardMissions.alertPrintPackingSlip");
      }
    };
    await getDeliveryTickerPdfApi(callApi, callBack, {
      boardMissionId: boardMissionId,
      packageQuantities,
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
      modalTitleStyle={isMobile ? { ...FONT_FAMILY.Inter(500, 18) } : undefined}
      insideStyle={classes.modalStyle}
      style={{ zIndex: 999999 }}
    >
      <Stack direction={"column"} gap={"15px"}>
        <Stack direction={"column"} gap={"15px"}>
          <div style={{ width: "100%" }}>
            <h3 style={classes.filterLabelStyle}>
              {t("boardMissions.totalQuantity")}
            </h3>
            <GomakeTextInput
              style={classes.textInputStyle}
              value={totalQuantity}
              placeholder={t("boardMissions.totalQuantity")}
              onChange={handleTotalQuantityChange}
              type={"number"}
            />
          </div>
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
