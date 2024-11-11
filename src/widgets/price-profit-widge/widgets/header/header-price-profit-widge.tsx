import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GoMakeAutoComplate, GoMakeMenu, GomakePrimaryButton } from "@/components";
import { ArrowDownNewIcon, PrintIcon, SettingNewIcon } from "@/icons";
import { MenuItem } from "@mui/material";
import { ReviewIcon } from "../table/icons/review-icon";
import { UpdatedPriceIcon } from "../table/icons/update-icon";

const PriceProfitHeaderWidget = ({ handleClose, anchorEl, open, handleOpen, handlePrintClose, anchorElPrint, openPrint, handleOpenPrint }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();


  return (
    <div style={classes.mainContainer}>
      <div style={classes.title}>{t("settings.priceProfit")}</div>
      <div style={classes.buttonContainer}>
        <GoMakeAutoComplate
          options={[]}
          style={classes.autoCompleteStyle}
          placeholder={t("Select Product")}
          withArrow={true}
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
          onClick={handleOpenPrint}
        >{t("Print")}
        </GomakePrimaryButton>

      </div>
      <GoMakeMenu
        handleClose={handleClose}
        open={open}
        anchorEl={anchorEl}
      >
        <div style={classes.menuContainer}>
          <MenuItem>
            <div style={classes.menuItemReviewContainer}>
              <ReviewIcon />
              <div style={classes.menuItemReviewText}>Restore original prices</div>
            </div>
          </MenuItem>
          <MenuItem>
            <div style={classes.menuItemReviewContainer}>
              <ReviewIcon />
              <div style={classes.menuItemReviewText}>Reset old version</div>
            </div>
          </MenuItem>
          <MenuItem>
            <div style={classes.menuItemReviewContainer}>
              <UpdatedPriceIcon stroke="#667085" />
              <div style={classes.menuItemReviewText}>Update all new prices</div>
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
          <MenuItem>
            <div style={classes.menuItemReviewText}>Print all</div>
          </MenuItem>
          <MenuItem>
            <div style={classes.menuItemReviewText}>Only selected</div>
          </MenuItem>
        </div>
      </GoMakeMenu>
    </div>
  );
};
export { PriceProfitHeaderWidget };
