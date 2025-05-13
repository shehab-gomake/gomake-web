import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import {
  GoMakeAutoComplate,
  GoMakeMenu,
  GomakePrimaryButton,
} from "@/components";
import { ArrowDownNewIcon, PrintIcon, SettingNewIcon } from "@/icons";
import { Box, MenuItem } from "@mui/material";
import { ReStoreIcon } from "../table/icons/restore-icon";
import { ResetIcon } from "../table/icons/reser-icon";
import { UpdatedPriceIcon2 } from "../table/icons/update-price-icon";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { ChartIcon } from "@/icons/chart-icon";

const PriceProfitHeaderWidget = ({
  handleClose,
  anchorEl,
  open,
  handleOpen,
  handlePrintClose,
  anchorElPrint,
  openPrint,
  handleOpenPrint,
  pricingProfileSetting,
  selectedPricingProfileSetting,
  setSelectedPricingProfileSetting,
  updateSelectedPrintHousePrices,
  onClickPrint,
  resetPrintHousePrice,
  handleOpenChartModal,
}) => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (router.query.productId) {
      const selectedPricingProfileSetting = pricingProfileSetting
        ?.map((item) => ({
          ...item,
          label: item?.productName,
          value: item?.productId,
        }))
        ?.find((item) => item?.productId === router.query.productId);
      setSelectedPricingProfileSetting(selectedPricingProfileSetting);
    }
  }, [router, pricingProfileSetting]);

  return (
    <div style={classes.mainContainer}>
      <div style={classes.title}>{t("settings.priceProfit")}</div>
      <div style={classes.buttonContainer}>
        <Box onClick={handleOpenChartModal} sx={classes.chartBtn}>
          <ChartIcon color="#182230" />
        </Box>
        <GoMakeAutoComplate
          options={pricingProfileSetting?.map((item) => ({
            ...item,
            label: item?.productName,
            value: item?.productId,
          }))}
          value={selectedPricingProfileSetting}
          key={selectedPricingProfileSetting?.productId}
          onChange={(e, value) => {
            setSelectedPricingProfileSetting(value);
            if (value?.value) {
              router.push({
                pathname: window.location.pathname,
                query: { ...router.query, productId: value.value },
              });
            }
          }}
          style={classes.autoCompleteStyle}
          placeholder={t("priceProfit.selectProduct")}
          withArrow={true}
          popupIcon={<ArrowDownNewIcon />}
        />
        <GomakePrimaryButton
          style={classes.settingBtn}
          leftIcon={<SettingNewIcon color="#182230" />}
          rightIcon={<ArrowDownNewIcon />}
          onClick={handleOpen}
        />

        <GomakePrimaryButton
          style={classes.printBtn}
          leftIcon={<PrintIcon />}
          rightIcon={<ArrowDownNewIcon color="#fff" />}
          onClick={handleOpenPrint}
        >
          {t("priceProfit.print")}
        </GomakePrimaryButton>
      </div>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <div style={classes.menuContainer}>
          <MenuItem onClick={() => updateSelectedPrintHousePrices(false)}>
            <div style={classes.menuItemReviewContainer}>
              <ReStoreIcon stroke={"#667085"} />
              <div style={classes.menuItemReviewText}>
                {t("priceProfit.restoreOriginalPrices")}
              </div>
            </div>
          </MenuItem>
          <MenuItem onClick={resetPrintHousePrice}>
            <div style={classes.menuItemReviewContainer}>
              <ResetIcon />
              <div style={classes.menuItemReviewText}>
                {t("priceProfit.resetOldVersion")}
              </div>
            </div>
          </MenuItem>
          <MenuItem onClick={() => updateSelectedPrintHousePrices(true)}>
            <div style={classes.menuItemReviewContainer}>
              <UpdatedPriceIcon2 />
              <div style={classes.menuItemReviewText}>
                {t("priceProfit.updateAllNewPrices")}
              </div>
            </div>
          </MenuItem>
        </div>
      </GoMakeMenu>

      <GoMakeMenu
        handleClose={handlePrintClose}
        open={openPrint}
        anchorEl={anchorElPrint}
      >
        <div style={classes.menuContainer}>
          <MenuItem onClick={() => onClickPrint(false)}>
            <div style={classes.menuItemReviewText}>
              {t("priceProfit.printAll")}
            </div>
          </MenuItem>
          <MenuItem onClick={() => onClickPrint(true)}>
            <div style={classes.menuItemReviewText}>
              {t("priceProfit.onlySelected")}
            </div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </div>
  );
};
export { PriceProfitHeaderWidget };
