import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GoMakeMenu, GomakePrimaryButton } from "@/components";
import { ArrowDownNewIcon, PrintIcon, SettingNewIcon } from "@/icons";
import { MenuItem } from "@mui/material";
import { ReviewIcon } from "../table/icons/review-icon";
import { UpdatedPriceIcon } from "../table/icons/update-icon";

const PriceProfitHeaderWidget = ({ handleClose, anchorEl, open, handleOpen }) => {
  const { classes } = useStyle();
  const { t } = useTranslation();


  return (
    <div style={classes.mainContainer}>
      <div style={classes.title}>{t("settings.priceProfit")}</div>
      <div style={classes.buttonContainer}>
        <GomakePrimaryButton
          style={classes.settingBtn}
          leftIcon={<SettingNewIcon color="#182230" />}
          rightIcon={<ArrowDownNewIcon />}
          onClick={handleOpen}
        />
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
        <GomakePrimaryButton
          style={classes.printBtn}
          leftIcon={<PrintIcon />}
        >{t("Print")}</GomakePrimaryButton>

      </div>

    </div>
  );
};
export { PriceProfitHeaderWidget };
