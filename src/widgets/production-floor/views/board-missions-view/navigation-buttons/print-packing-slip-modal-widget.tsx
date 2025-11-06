import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "@/pages-components/board-missions/style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useEffect, useMemo, useState, useRef } from "react";
import { getDeliveryTickerPdfApi, checkIfProductIsLabelInRollsApi } from "@/services/api-service/board-missions/board-missions-table";
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
  const { alertFault } = useSnackBar();
  const { callApi } = useGomakeAxios();
  const [totalQuantity, setTotalQuantity] = useState<number>(quantity);
  const [quantityOfPackages, setQuantityOfPackages] = useState<number>(1);
  const [quantityPerPackage, setQuantityPerPackage] =
    useState<number>(quantity);
  const [isLabelInRolls, setIsLabelInRolls] = useState<boolean>(false);
  const [packageRollsAmounts, setPackageRollsAmounts] = useState<number[]>([]);
  const [packageStickersPerRoll, setPackageStickersPerRoll] = useState<number[]>([]);
  const [lastChangedField, setLastChangedField] = useState<{ index: number; field: 'quantity' | 'rolls' | 'stickers' } | null>(null);
  const isCalculatingRef = useRef<boolean>(false);
  const [packageQuantities, setPackageQuantities] = useState<number[]>(() => {
    const initialQuantityPerPackage = totalQuantity
      ? Math.ceil(totalQuantity / quantityOfPackages)
      : 0;
    return Array(quantityOfPackages).fill(initialQuantityPerPackage);
  });

  useEffect(() => {
    setTotalQuantity(quantity);
    setQuantityPerPackage(quantity);
  }, [quantity]);

  // Clear all states when modal opens
  useEffect(() => {
    if (openModal) {
      // Reset all states to initial values
      setTotalQuantity(quantity);
      setQuantityOfPackages(1);
      setQuantityPerPackage(quantity);
      setIsLabelInRolls(false);
      setPackageRollsAmounts([]);
      setPackageStickersPerRoll([]);
      setLastChangedField(null);
      isCalculatingRef.current = false;
      
      // Reset packageQuantities based on initial values
      const initialQuantityPerPackage = quantity ? Math.ceil(quantity / 1) : 0;
      setPackageQuantities([initialQuantityPerPackage]);
    }
  }, [openModal, quantity]);

  useEffect(() => {
    if (openModal && boardMissionId) {
      const callBack = (res) => {
        if (res?.success) {
          setIsLabelInRolls(res.data?.isLabelInRolls || false);
        }
      };
      checkIfProductIsLabelInRollsApi(callApi, callBack, boardMissionId);
    } else {
      setIsLabelInRolls(false);
    }
  }, [openModal, boardMissionId, callApi]);

  useEffect(() => {
    if (isLabelInRolls && quantityOfPackages > 0) {
      // Only initialize if arrays are empty or have different length
      if (packageRollsAmounts.length !== quantityOfPackages) {
        setPackageRollsAmounts(Array(quantityOfPackages).fill(1));
      }
      // Initialize stickersPerRoll based on packageQuantities only if needed
      if (packageStickersPerRoll.length !== quantityOfPackages) {
        setPackageStickersPerRoll((prev) => {
          const newStickers = [...Array(quantityOfPackages)];
          return newStickers.map((_, index) => {
            return packageQuantities[index] || 0;
          });
        });
      }
      setLastChangedField(null);
    } else {
      setPackageRollsAmounts([]);
      setPackageStickersPerRoll([]);
      setLastChangedField(null);
    }
  }, [isLabelInRolls, quantityOfPackages]);

  const remainingQuantity =
    totalQuantity - quantityPerPackage * (quantityOfPackages - 1);

  // Reset packages when total quantity, quantity of packages, or quantity per package changes
  useEffect(() => {
    if (isLabelInRolls && quantityOfPackages > 0) {
      // Reset and reinitialize rollsAmounts and stickersPerRoll arrays
      setPackageRollsAmounts(Array(quantityOfPackages).fill(1));
      setPackageStickersPerRoll((prev) => {
        const newStickers = [...Array(quantityOfPackages)];
        return newStickers.map((_, index) => {
          return packageQuantities[index] || 0;
        });
      });
      setLastChangedField(null);
    }
  }, [totalQuantity, quantityOfPackages, quantityPerPackage, isLabelInRolls, packageQuantities]);

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

  // Calculate stickersPerRoll when packageQuantity or rollsAmount changes
  useEffect(() => {
    if (!isLabelInRolls || !lastChangedField || isCalculatingRef.current) return;
    
    const { index, field } = lastChangedField;
    isCalculatingRef.current = true;
    
    if (field === 'quantity') {
      // When quantity changes, prefer rollsAmount if it exists, otherwise use stickersPerRoll
      // But only calculate if the quantity was changed by user input, not programmatically
      const quantity = packageQuantities[index] || 0;
      const rollsAmount = packageRollsAmounts[index] || 0;
      const stickersPerRoll = packageStickersPerRoll[index] || 0;
      
      if (quantity > 0) {
        if (rollsAmount > 0) {
          // Calculate stickersPerRoll based on quantity and rollsAmount
          const calculatedStickersPerRoll = Math.round(quantity / rollsAmount);
          setPackageStickersPerRoll((prev) => {
            const updated = [...prev];
            updated[index] = calculatedStickersPerRoll;
            return updated;
          });
        } else if (stickersPerRoll > 0) {
          // Calculate rollsAmount based on quantity and stickersPerRoll
          const calculatedRollsAmount = Math.round(quantity / stickersPerRoll);
          setPackageRollsAmounts((prev) => {
            const updated = [...prev];
            updated[index] = calculatedRollsAmount;
            return updated;
          });
        }
      }
    } else if (field === 'rolls') {
      // When rollsAmount changes, calculate packageQuantity
      const rollsAmount = packageRollsAmounts[index] || 0;
      const stickersPerRoll = packageStickersPerRoll[index] || 0;
      
      if (rollsAmount > 0 && stickersPerRoll > 0) {
        const calculatedQuantity = rollsAmount * stickersPerRoll;
        setPackageQuantities((prev) => {
          const updated = [...prev];
          updated[index] = calculatedQuantity;
          return updated;
        });
        // Clear lastChangedField to prevent quantity field calculation from running
        setLastChangedField(null);
      }
    } else if (field === 'stickers') {
      // When stickersPerRoll changes, calculate packageQuantity
      const rollsAmount = packageRollsAmounts[index] || 0;
      const stickersPerRoll = packageStickersPerRoll[index] || 0;
      
      if (rollsAmount > 0 && stickersPerRoll > 0) {
        const calculatedQuantity = rollsAmount * stickersPerRoll;
        setPackageQuantities((prev) => {
          const updated = [...prev];
          updated[index] = calculatedQuantity;
          return updated;
        });
        // Clear lastChangedField to prevent quantity field calculation from running
        setLastChangedField(null);
      }
    }

    // Reset the flag after calculation
    setTimeout(() => {
      isCalculatingRef.current = false;
      if (lastChangedField?.field !== 'rolls' && lastChangedField?.field !== 'stickers') {
        setLastChangedField(null);
      }
    }, 0);
  }, [packageQuantities, packageRollsAmounts, packageStickersPerRoll, isLabelInRolls, lastChangedField]);

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

    // Track that quantity was changed
    if (isLabelInRolls) {
      setLastChangedField({ index, field: 'quantity' });
    }
  };

  const handleRollsAmountChange = (index: number, value: number) => {
    if (isNaN(value) || value < 0) {
      return;
    }
    setPackageRollsAmounts((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    // Track that rollsAmount was changed
    setLastChangedField({ index, field: 'rolls' });
  };

  const handleStickersPerRollChange = (index: number, value: number) => {
    if (isNaN(value) || value < 0) {
      return;
    }
    setPackageStickersPerRoll((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    // Track that stickersPerRoll was changed
    setLastChangedField({ index, field: 'stickers' });
  };

  const packageInputs = useMemo(() => {
    if (quantityOfPackages && quantityOfPackages > 0 && !isNaN(quantityOfPackages)) {
      return [...Array(quantityOfPackages)].map((_, index) => (
        <div key={index} style={{ width: isLabelInRolls ? "100%" : "30%" }}>
          <h3 style={classes.packageLabelStyle}>
            {`${t("boardMissions.package")} ${index + 1}`}
          </h3>
          <Stack direction="row" gap={"15px"}>
            <div style={{ width: isLabelInRolls ? "33%" : "auto", flex: isLabelInRolls ? "none" : 1 }}>
              {isLabelInRolls && (
                <h3 style={classes.filterLabelStyle}>
                  {t("boardMissions.quantity")}
                </h3>
              )}
              <GomakeTextInput
                type="number"
                value={packageQuantities[index] || 0}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10);
                  handlePackageQuantityChange(index, newValue);
                }}
                placeholder={t("boardMissions.quantity")}
              />
            </div>
            {isLabelInRolls && (
              <>
                <div style={{ width: "33%" }}>
                  <h3 style={classes.filterLabelStyle}>
                    {t("boardMissions.rollsAmount")}
                  </h3>
                  <GomakeTextInput
                    style={classes.textInputStyle}
                    type="number"
                    value={packageRollsAmounts[index] || 0}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10);
                      handleRollsAmountChange(index, newValue);
                    }}
                    placeholder={t("boardMissions.rollsAmount")}
                  />
                </div>
                <div style={{ width: "33%" }}>
                  <h3 style={classes.filterLabelStyle}>
                    {t("boardMissions.stickersPerRoll")}
                  </h3>
                  <GomakeTextInput
                    style={classes.textInputStyle}
                    type="number"
                    value={packageStickersPerRoll[index] || 0}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value, 10);
                      handleStickersPerRollChange(index, newValue);
                    }}
                    placeholder={t("boardMissions.stickersPerRoll")}
                  />
                </div>
              </>
            )}
          </Stack>
        </div>
      ));
    }
  }, [quantityOfPackages, packageQuantities, isLabelInRolls, packageRollsAmounts, packageStickersPerRoll]);

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
    
    // Build packages array with combined data
    const packages = packageQuantities.map((quantity, index) => ({
      packageQuantity: quantity,
      rollsAmount: isLabelInRolls ? (packageRollsAmounts[index] || 0) : 0,
      stickersPerRoll: isLabelInRolls ? (packageStickersPerRoll[index] || 0) : 0,
    }));
    
    await getDeliveryTickerPdfApi(callApi, callBack, {
      boardMissionId: boardMissionId,
      packages,
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
          <Stack direction={"row"} gap={"15px"}>
            <div style={{ width: "33%" }}>
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
            <div style={{ width: "33%" }}>
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
            <div style={{ width: "33%" }}>
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
