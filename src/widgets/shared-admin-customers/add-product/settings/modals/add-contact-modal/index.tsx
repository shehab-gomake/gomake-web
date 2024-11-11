import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeDeleteModal,
  GoMakeModal,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { AddNewIcon } from "@/icons";
import { IconButton, Paper, Tooltip } from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import { usePrintNodePrinters } from "@/hooks/use-print-node-printers";
import ProductItem from "./sku-components/product-item-row";

interface AddProductSkuModalProps {
  openModal: boolean;
  modalTitle: string;
  onClose: () => void;
  onChangeStateProductSKU: (field: string, value: any) => void;
  createNewProductSKU: () => void;
  errorName: boolean;
  errorCode: boolean;
  allProductSKU: any;
  openDeleteRowModal: boolean;
  onClickOpenDeleteRowModal: (id: string) => void;
  onClickCloseDeleteRowModal: () => void;
  deleteProductSKURow: () => void;
  updateProductSKURow?: (item: any) => void;
  productSKUState: {
    name: string;
    code: string;
    printerId?: number;
    printerBin?: string;
    productionFloorJobColor?: string;
  };
}

const PaPerComponent = (props) => (
  <Paper elevation={0} {...props} style={{ width: "300px" }}>
    {props.children}
  </Paper>
);

const AddProductSkuModal = ({
  openModal,
  modalTitle,
  onClose,
  onChangeStateProductSKU,
  createNewProductSKU,
  errorName,
  errorCode,
  allProductSKU,
  openDeleteRowModal,
  onClickOpenDeleteRowModal,
  onClickCloseDeleteRowModal,
  deleteProductSKURow,
  productSKUState,
  updateProductSKURow,
}: AddProductSkuModalProps) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  const {
    printers,
    getPrinterBins,
    getPrinterNameByPrinterId,
    isPrintHouseUsePrintNode,
  } = usePrintNodePrinters();

  const handleSaveEdit = async (updatedData) => {
    updateProductSKURow(updatedData);
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={modalTitle}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.modalMainContainer}>
          <div style={clasess.productMappingContainer}>
            <div>
              <GomakeTextInput
                value={productSKUState?.name}
                style={clasess.textInputStyle}
                placeholder={t("products.addProduct.admin.enterName")}
                onChange={(e: any) => {
                  onChangeStateProductSKU("name", e.target.value);
                }}
              />
              {errorName && (
                <div style={clasess.errorlabelStyle}>
                  {t("login.thisFieldRequired")}
                </div>
              )}
            </div>
            <div>
              <GomakeTextInput
                value={productSKUState?.code}
                style={clasess.textInputStyle}
                placeholder={t("products.addProduct.admin.enterCode")}
                onChange={(e: any) => {
                  onChangeStateProductSKU("code", e.target.value);
                }}
              />
              {errorCode && (
                <div style={clasess.errorlabelStyle}>
                  {t("login.thisFieldRequired")}
                </div>
              )}
            </div>
            <div style={clasess.colorInputStyle}>
              <MuiColorInput
                value={productSKUState?.productionFloorJobColor}
                format="hex"
                onChange={(value: any) => {
                  onChangeStateProductSKU("productionFloorJobColor", value);
                }}
              />
            </div>
            {isPrintHouseUsePrintNode && (
              <div style={{ width: "calc(20% - 5px)" }}>
                <GoMakeAutoComplate
                  placeholder={t("products.addProduct.admin.printer")}
                  PaperComponent={PaPerComponent}
                  onChange={(e, v) =>
                    onChangeStateProductSKU("printerId", v?.printerId)
                  }
                  value={
                    productSKUState.printerId ? productSKUState.printerId : ""
                  }
                  options={printers}
                />
              </div>
            )}
            {isPrintHouseUsePrintNode && (
              <div style={{ width: "calc(20% - 5px)" }}>
                <GoMakeAutoComplate
                  value={productSKUState.printerBin}
                  placeholder={t("products.addProduct.admin.printerBin")}
                  PaperComponent={PaPerComponent}
                  onChange={(e, v) => onChangeStateProductSKU("printerBin", v)}
                  options={getPrinterBins(productSKUState.printerId)}
                />
              </div>
            )}
            <Tooltip
              title={t("products.addProduct.admin.modalProductSKUTitle")}
            >
              <IconButton onClick={() => createNewProductSKU()}>
                <AddNewIcon />
              </IconButton>
            </Tooltip>
          </div>
          {allProductSKU?.map((item, index) => (
            <ProductItem
              t={t}
              clasess={clasess}
              key={item.id}
              item={item}
              onClickOpenDeleteRowModal={onClickOpenDeleteRowModal}
              onSaveEdit={handleSaveEdit}
              isPrintHouseUsePrintNode={isPrintHouseUsePrintNode}
              getPrinterNameByPrinterId={getPrinterNameByPrinterId}
              getPrinterBins={getPrinterBins}
              printers={printers}
            />
          ))}
        </div>
      </GoMakeModal>
      <GoMakeDeleteModal
        openModal={openDeleteRowModal}
        onClose={onClickCloseDeleteRowModal}
        onClickDelete={deleteProductSKURow}
      />
    </>
  );
};
export { AddProductSkuModal };
