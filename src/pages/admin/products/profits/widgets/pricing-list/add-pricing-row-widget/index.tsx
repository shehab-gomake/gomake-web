import { GomakeTextInput } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import SaveIcon from "@mui/icons-material/Save";
import { IconButton, Tooltip } from "@mui/material";

const AddPricingListRowWidget = ({ pricingBy, profitsStateValue }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <div key={`key${pricingBy}`} style={clasess.bodyRow}>
      {pricingBy == 0 && (
        <GomakeTextInput
          placeholder={t("products.profits.pricingListWidget.quantity")}
          style={clasess.textInputStyle}
          value={profitsStateValue?.pricingListRowState?.quantity}
          type={"number"}
          onChange={(e: any) => {
            profitsStateValue?.onChangeAddPricingListRow(
              "quantity",
              e.target.value
            );
          }}
        />
      )}
      {pricingBy == 1 && (
        <GomakeTextInput
          placeholder={t("products.profits.pricingListWidget.width")}
          style={clasess.textInputStyle}
          value={profitsStateValue?.pricingListRowState?.width}
          type={"number"}
          onChange={(e: any) => {
            profitsStateValue?.onChangeAddPricingListRow(
              "width",
              e.target.value
            );
          }}
        />
      )}
      {pricingBy == 1 && (
        <GomakeTextInput
          placeholder={t("products.profits.pricingListWidget.height")}
          style={clasess.textInputStyle}
          value={profitsStateValue?.pricingListRowState?.height}
          type={"number"}
          onChange={(e: any) => {
            profitsStateValue?.onChangeAddPricingListRow(
              "height",
              e.target.value
            );
          }}
        />
      )}
      <GomakeTextInput
        placeholder={t("products.profits.pricingListWidget.profit")}
        style={clasess.textInputStyle}
        value={profitsStateValue?.pricingListRowState?.profit}
        type={"number"}
        onChange={(e: any) => {
          profitsStateValue?.onChangeAddPricingListRow(
            "profit",
            e.target.value
          );
        }}
      />

      <Tooltip title={t("products.profits.pricingListWidget.saveStep")}>
        <IconButton onClick={profitsStateValue?.onClickSaveNewPricingListRow}>
          <SaveIcon style={clasess.saveBotton} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export { AddPricingListRowWidget };
