import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useQuote } from "./use-quote";

import { useStyle } from "./style";
import { UploadIcon } from "@/icons";

export default function Quote() {
  const { clasess } = useStyle();
  const { t } = useQuote();

  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <div style={clasess.headerContainer}>
          <HeaderTitle title={t("sales.quote.title")} />
          <div style={clasess.rightSideHeaderContainer}>
            <div style={clasess.deleverdDate}>Deliver on 3/5/2023</div>
            <div style={clasess.uploadContainer}>
              <UploadIcon />
              <div style={clasess.uploadTextStyle}>upload</div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthLayout>
  );
}
