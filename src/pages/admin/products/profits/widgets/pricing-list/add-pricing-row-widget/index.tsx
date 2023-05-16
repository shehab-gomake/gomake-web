import { GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import SaveIcon from "@mui/icons-material/Save";
import { IconButton, Tooltip } from "@mui/material";

const AddPricingListRowWidget = ({ pricingBy }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div key={`key${pricingBy}`} style={clasess.bodyRow}>
      {pricingBy == 0 && (
        <GomakeTextInput
          placeholder={t("products.profits.pricingListWidget.quantity")}
          style={clasess.textInputStyle}
          // value={""}
          // onChange={(e: any) => {}}
        />
      )}
      {pricingBy == 1 && (
        <GomakeTextInput
          placeholder={t("products.profits.pricingListWidget.width")}
          style={clasess.textInputStyle}
        />
      )}
      {pricingBy == 1 && (
        <GomakeTextInput
          placeholder={t("products.profits.pricingListWidget.height")}
          style={clasess.textInputStyle}
        />
      )}
      <GomakeTextInput
        placeholder={t("products.profits.pricingListWidget.profit")}
        style={clasess.textInputStyle}
      />

      <Tooltip title={t("products.profits.pricingListWidget.saveStep")}>
        <IconButton>
          <SaveIcon style={clasess.saveBotton} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export { AddPricingListRowWidget };
