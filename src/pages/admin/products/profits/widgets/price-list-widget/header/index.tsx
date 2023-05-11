import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { GoMakeAutoComplate } from "@/components";
import { useStyle } from "./style";

const Header = ({ setAllAdditions }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div style={clasess.mainCointaner}>
      <div style={clasess.listTitle}>{t("pricingList.pricingListTitle")}</div>
      <div style={clasess.filtersCointaner}>
        <div style={clasess.filterContainer}>
          <GoMakeAutoComplate
            options={["prices1", "prices2", "prices3"]}
            style={clasess.autoComplateStyle}
            placeholder={t("pricingList.meterPerPrice")}
            onChange={""}
          />
        </div>
        <div style={clasess.filterContainer}>
          <GoMakeAutoComplate
            options={["prices1", "prices2", "prices3"]}
            style={clasess.autoComplateStyle}
            placeholder={t("pricingList.transition")}
            onChange={""}
          />
        </div>
      </div>
    </div>
  );
};
export default Header;
