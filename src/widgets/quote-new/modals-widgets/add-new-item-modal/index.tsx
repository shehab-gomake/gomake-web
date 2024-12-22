import { useTranslation } from "react-i18next";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { GoMakeTreeSelect } from "@/components/auto-complete/tree-select";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { useAddNewItem } from "./use-add-new-item";
import { Popover } from "@mui/material";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { Stack, RadioGroup, FormControlLabel, Radio } from "@mui/material";

//!here
const AddNewItemModal = ({ openModal, onClose, documentType, getQuote }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { primaryColor } = useGomakeTheme();
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
    _renderErrorMessage,
    handleChange,
    active,
    productName,
    setProductName,
    productCode,
    setProductCode,
    handleCloseModal,
  } = useAddNewItem({ onClose, getQuote, documentType });

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.addNewItem")}
        onClose={handleCloseModal}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <RadioGroup row value={active} onChange={handleChange}>
            <FormControlLabel
              value={true}
              control={<Radio style={{ color: primaryColor(500) }} />}
              label={t("Exist product")}
            />
            <FormControlLabel
              value={false}
              control={<Radio style={{ color: primaryColor(500) }} />}
              label={t("Generic product")}
            />
          </RadioGroup>
          {active === true ? (
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
          ) : (
            <Stack direction={"row"} gap={"20px"}>
              <div>
                {/* <h3 style={classes.filterLabelStyle}>{t("Product Name")}</h3> */}
                <GomakeTextInput
                  style={classes.textInput}
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder={t("products.addProduct.admin.enterName")}
                />
              </div>
              <div>
                {/* <h3 style={classes.filterLabelStyle}>{t("Product Code")}</h3> */}
                <GomakeTextInput
                  style={classes.textInput}
                  value={productCode}
                  placeholder={t("products.addProduct.admin.enterCode")}
                  onChange={(e) => setProductCode(e.target.value)}
                />
              </div>
            </Stack>
          )}
          <div style={classes.btnContainer}>
            <GomakePrimaryButton
              style={classes.sendBtn}
              onClick={isDisabled ? handleClick : onClickCreateQuoteForCustomer}
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
