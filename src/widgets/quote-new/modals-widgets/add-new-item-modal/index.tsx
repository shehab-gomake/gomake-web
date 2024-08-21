import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { useStyle } from "./style";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useAddNewItem } from "./use-add-new-item";
import { Popover } from "@mui/material";

const AddNewItemModal = ({ openModal, onClose, documentType, getQuote }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const {
    handleProductChange, 
    combinedData, 
    selectedProduct, 
    onClickCreateQuoteForCustomer,
    handleClose,
    handleClick,
    open,
    id,
    isDisabled,
    anchorEl,
   _renderErrorMessage } = useAddNewItem({ onClose, getQuote, documentType });

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.addNewItem")}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.autoComplateRowContainer}>
            <div style={{ width: "93%", marginTop: 15 }}>
              <GoMakeTreeSelect
                value={selectedProduct}
                options={combinedData}
                onChange={handleProductChange}
                placeholder={t("home.admin.selectProductOrMaterial")}
              />
            </div>
          </div>
          <div style={classes.btnContainer}>
            <GomakePrimaryButton
              style={classes.sendBtn}
              onClick={
                isDisabled
                  ? handleClick
                  : onClickCreateQuoteForCustomer
              }
            >
              {t("sales.quote.add")}
            </GomakePrimaryButton>

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <div style={classes.errorMsgStyle}>{_renderErrorMessage()}</div>
            </Popover>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewItemModal };
