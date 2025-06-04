import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { quoteConfirmationState } from "@/store";
import { InputUpdatedValues } from "@/widgets/quote-new/input-updated-values";

const BusinessWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const quoteConfirm = useRecoilValue<any>(quoteConfirmationState);
  const [isConfirmation, setIsConfirmation] = useState();

  return (
    <>
      <div style={classes.businessContainerStyle}>
        <InputUpdatedValues
          value={quoteConfirm?.client?.name}
          label={t("sales.quote.businessName")}
          setIsUpdate={setIsConfirmation}
          inputMainContainerStyle={classes.inputMainContainer}
          specialStyle={{ padding: "0px" }}
        />
        {/* <InputUpdatedValues
          value={`${quoteConfirm?.client?.code}`}
          label={t("sales.quote.businessCode")}
          setIsUpdate={setIsConfirmation}
          inputMainContainerStyle={classes.inputMainContainer}
          specialStyle={{ padding: "0px" }}
        /> */}
      </div>
    </>
  );
};

export { BusinessWidget };
