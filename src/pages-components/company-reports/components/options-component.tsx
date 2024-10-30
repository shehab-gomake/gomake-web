import { OptionsButton } from "@/components/options-button/options-button";
import { MenuItem } from "@mui/material";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { useState } from "react";
import { PrimaryButton } from "@/components/button/primary-button";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  importDocumentsApi,
  importMachinesApi,
  importMaterialsApi,
  importOutputsApi,
  importProductsApi,
  importProfitsApi,
  importSMSTemplatesApi,
} from "@/services/api-service/import-data/import-data-endpoints";
import Stack from "@mui/material/Stack";
import { PaymentHistoryComponent } from "@/pages-components/company-reports/payment-history/payment-history";
import { IPrintHouse } from "@/pages-components/company-reports/components/types/interfaces";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { printHousesState } from "@/pages-components/company-reports/components/types/state";
import { useStyle } from "@/pages-components/company-reports/style";

interface IProps {
  printHouse: IPrintHouse;
  handleOpenModal: (item: IPrintHouse) => void;
  handleClickMakePayment: (printHouseId: string) => void;
  handleOpenSendPaymentModal: (printHouseId: string) => void;
}

enum EAction {
  MACHINES,
  PROFITS,
  MATERIALS,
  PRODUCTS,
  OUTPUTS,
  SMS_TEMPLATE,
}

const OptionsComponent = ({
  printHouse,
  handleOpenModal,
  handleClickMakePayment,
  handleOpenSendPaymentModal,
}: IProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { callApi } = useGomakeAxios();
  const { alertFault } = useSnackBar();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [actionState, setActionState] = useState<EAction>();
  const [sourcePrintHouseId, setSourcePrintHouseId] = useState<string>("");
  const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
  const [openUploadModal, setOpenUploadModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const printHouses =
    useRecoilValue<{ id: string; name: string }[]>(printHousesState);

  const handleOptionClick = (action: EAction) => {
    setActionState(action);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setActionState(null);
    setOpenModal(false);
  };

  const callBack = (res) => {
    if (res.success) {
      handleModalClose();
    } else {
    }
  };

  const handelImportClick = async () => {
    if (actionState === EAction.PROFITS) {
      await handelImportProfits();
    } else if (actionState === EAction.MACHINES) {
      await handelImportMachines();
    } else if (actionState === EAction.MATERIALS) {
      await handelImportMaterials();
    } else if (actionState === EAction.PRODUCTS) {
      await handelImportProducts();
    } else if (actionState === EAction.OUTPUTS) {
      await handelImportOutputs();
    } else if (actionState === EAction.SMS_TEMPLATE) {
      await handelImportSmsTemplates();
    }
  };

  const handelImportMachines = async () => {
    await importMachinesApi(callApi, callBack, {
      source: sourcePrintHouseId,
      destination: printHouse?.id,
    });
  };
  const handelImportProfits = async () => {
    await importProfitsApi(callApi, callBack, {
      source: sourcePrintHouseId,
      destination: printHouse?.id,
    });
  };
  const handelImportMaterials = async () => {
    await importMaterialsApi(callApi, callBack, {
      source: sourcePrintHouseId,
      destination: printHouse?.id,
    });
  };
  const handelImportProducts = async () => {
    await importProductsApi(callApi, callBack, {
      source: sourcePrintHouseId,
      destination: printHouse?.id,
    });
  };
  const handelImportOutputs = async () => {
    await importOutputsApi(callApi, callBack, {
      source: sourcePrintHouseId,
      destination: printHouse?.id,
    });
  };

  const handelImportSmsTemplates = async () => {
    await importSMSTemplatesApi(callApi, callBack, {
      sourcePrintHouseId,
      distPrintHouseId: printHouse?.id,
    });
  };

  const handleUploadModalClose = () => {
    setOpenUploadModal(false);
    setSelectedFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      alertFault("importData.noFileSelected");
      return;
    }
    setIsUploading(true);
    const fileBase64 = await convertFileToBase64(selectedFile);

    const callBack = (res) => {
      if (res.success) {
        alertFault("importData.fileUploadedSuccessfully");
        handleUploadModalClose();
      } else {
        alertFault("importData.fileUploadFailed");
      }
    };

    await importDocumentsApi(callApi, callBack, {
      fileBase64,
      printHouseId: printHouse?.id,
    });

    setIsUploading(false);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <OptionsButton>
        <MenuItem onClick={() => handleOpenModal(printHouse)}>
          <div style={classes.rowTextStyle}>
            {printHouse?.printHouseCreditCardDetails
              ? t("importData.editPaymentDetails")
              : t("importData.addPaymentDetails")}
          </div>
        </MenuItem>
        {printHouse?.printHouseCreditCardDetails && (
          <MenuItem onClick={() => handleClickMakePayment(printHouse?.id)}>
            <div style={classes.rowTextStyle}>{t("payment.makePayment")}</div>
          </MenuItem>
        )}
        <MenuItem onClick={() => handleOpenSendPaymentModal(printHouse?.id)}>
          <div style={classes.rowTextStyle}>
            {t("prePayment.sendPaymentPage")}
          </div>
        </MenuItem>

        <MenuItem onClick={() => handleOptionClick(EAction.PROFITS)}>
          <div style={classes.rowTextStyle}>
            {t("importData.importProfits")}
          </div>
        </MenuItem>
        <MenuItem onClick={() => handleOptionClick(EAction.MATERIALS)}>
          <div style={classes.rowTextStyle}>
            {t("importData.importMaterials")}
          </div>
        </MenuItem>
        <MenuItem onClick={() => handleOptionClick(EAction.MACHINES)}>
          <div style={classes.rowTextStyle}>
            {t("importData.importMachines")}
          </div>
        </MenuItem>
        <MenuItem onClick={() => handleOptionClick(EAction.PRODUCTS)}>
          <div style={classes.rowTextStyle}>
            {t("importData.importProducts")}
          </div>
        </MenuItem>
        <MenuItem onClick={() => handleOptionClick(EAction.PRODUCTS)}>
          <div style={classes.rowTextStyle}>
            {t("importData.importOutputs")}
          </div>
        </MenuItem>
        <MenuItem onClick={() => setOpenUploadModal(true)}>
          <div style={classes.rowTextStyle}>
            {t("importData.uploadDocument")}
          </div>
        </MenuItem>
        <MenuItem onClick={() => handleOptionClick(EAction.SMS_TEMPLATE)}>
          <div style={classes.rowTextStyle}>
            {t("importData.importSmsTemplate")}
          </div>
        </MenuItem>
        <MenuItem onClick={() => setOpenPaymentModal(true)}>
          <div style={classes.rowTextStyle}>
            {t("importData.paymentHistory")}
          </div>
        </MenuItem>
      </OptionsButton>
      <GoMakeModal
        modalTitle={t("importData.selectPrintHouse")}
        insideStyle={{ width: "400px", height: "fit-content" }}
        openModal={openModal}
        onClose={handleModalClose}
      >
        <Stack gap={"10px"}>
          <h5>{t("importData.printHouses")}</h5>
          <GoMakeAutoComplate
            placeholder={t("importData.selectPrintHouse")}
            options={printHouses.map((p) => ({ label: p.name, ...p }))}
            onChange={(e, v) => setSourcePrintHouseId(v.id)}
          />
          <PrimaryButton variant={"contained"} onClick={handelImportClick}>
            {t("importData.import")}
          </PrimaryButton>
        </Stack>
      </GoMakeModal>
      <GoMakeModal
        modalTitle={t("importData.paymentHistory")}
        insideStyle={{ width: "70%", height: "fit-content" }}
        openModal={openPaymentModal}
        onClose={() => setOpenPaymentModal(false)}
      >
        <PaymentHistoryComponent printHouseId={printHouse?.id} />
      </GoMakeModal>
      <GoMakeModal
        modalTitle={t("importData.uploadDocument")}
        insideStyle={{ width: "400px", height: "fit-content" }}
        openModal={openUploadModal}
        onClose={handleUploadModalClose}
      >
        <Stack gap={"10px"}>
          <h5>{t("importData.uploadYourDocument")}</h5>
          <input onChange={handleFileUpload} type="file" accept=".xlsx" />
          <PrimaryButton
            variant={"contained"}
            onClick={handleUploadClick}
            disabled={isUploading}
          >
            {isUploading ? t("sales.uploading") : t("sales.quote.upload")}
          </PrimaryButton>
        </Stack>
      </GoMakeModal>
    </>
  );
};

export { OptionsComponent };
