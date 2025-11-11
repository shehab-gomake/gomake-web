import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakeTextInput, ThreeOptionsModal } from "@/components";
import { Stack } from "@mui/material";
import { useStyle } from "../style";
import { SecondaryButton } from "@/components/button/secondary-button";
import { FONT_FAMILY } from "@/utils/font-family";
import { ModalType } from "@/enums";
import { useIsMobile } from "@/hooks/use-responsive";

const PrintPackingSlipModal = ({
  openPackagesModal,
  onClosePackagesModal,
  packageInputs,
  quantityOfPackages,
  quantityPerPackage,
  handleQuantityOfPackagesChange,
  handleQuantityPerPackageChange,
  onClickConfirm,
  openPrintExportModal,
  setOpenPrintExportModal,
  exportPdf,
  printPackingSlip,
  isPrintHouseUsePrintNode,
}: any) => {
  // Note: prop name kept as isPrintHouseUsePrintNode for backward compatibility, but it now receives isPrintHouseHasPackagingSlipPrinter value
  const { classes } = useStyle();
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  return (
    <GoMakeModal
      openModal={openPackagesModal}
      onClose={onClosePackagesModal}
      modalTitle={t("boardMissions.packagesTitle")}
      insideStyle={classes.modalStyle}
      style={{ zIndex: 999999 }}
      modalTitleStyle={{ ...FONT_FAMILY.Inter(500, 20), marginBottom: "10px" }}
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
            {packageInputs}
          </div>
        </Stack>
        <Stack direction={"row"} gap={"15px"} justifyContent={"flex-end"}>
          <SecondaryButton variant={"contained"} onClick={onClickConfirm}>
            {t("modal.confirm")}
          </SecondaryButton>
          <SecondaryButton variant={"outlined"} onClick={onClosePackagesModal}>
            {t("modal.cancel")}
          </SecondaryButton>
        </Stack>
      </Stack>
      
      {/* Print/Export Selection Modal */}
      {isPrintHouseUsePrintNode && (
        <ThreeOptionsModal
          modalType={ModalType.WARNING}
          title="boardMissions.selectPackingSlipAction"
          subTitle="boardMissions.selectPackingSlipActionSubtitle"
          yesBtn="boardMissions.exportPdf"
          noBtn="boardMissions.print"
          openModal={openPrintExportModal}
          onClose={() => setOpenPrintExportModal(false)}
          onClickYes={() => {
            setOpenPrintExportModal(false);
            exportPdf();
          }}
          onClickNo={() => {
            setOpenPrintExportModal(false);
            printPackingSlip();
          }}
          style={
            isMobile
              ? {
                  width: "95vw",
                  maxWidth: 600,
                  minWidth: "unset",
                }
              : undefined
          }
        />
      )}
    </GoMakeModal>
  );
};

export { PrintPackingSlipModal };
