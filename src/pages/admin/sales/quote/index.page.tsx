import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useQuote } from "./use-quote";

import { useStyle } from "./style";
import { UploadIcon } from "@/icons";
import { BusinessWidget } from "./widget/business-widget";
import { ContactWidget } from "./widget/contact-widget";
import { AddressWidget } from "./widget/address-widget";
import { CustomTableWidget } from "./widget/custom-table-widget";

export default function Quote() {
  const { clasess } = useStyle();
  const { t } = useQuote();

  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <div style={clasess.headerContainer}>
          <HeaderTitle
            title={t("sales.quote.title")}
            marginBottom={1}
            marginTop={1}
          />
          <div style={clasess.rightSideHeaderContainer}>
            <div style={clasess.deleverdDate}>
              {t("sales.quote.deliverOn")} 3/5/2023
            </div>
            <div style={clasess.uploadContainer}>
              <UploadIcon />
              <div style={clasess.uploadTextStyle}>
                {t("sales.quote.upload")}
              </div>
            </div>
          </div>
        </div>
        <BusinessWidget />
        <ContactWidget />
        <AddressWidget />
        <div style={clasess.tableContainer}>
          <CustomTableWidget
            headerTitle={"Order review"}
            tableHeaders={[
              "ID",
              "Item name",
              "Details",
              "Amount",
              "Unit price",
              "Discount",
              "Final price",
              "More",
            ]}
          />
        </div>
      </div>
    </AdminAuthLayout>
  );
}
