import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useQuote } from "./use-quote";

import { useStyle } from "./style";
import { AddPlusIcon, UploadIcon } from "@/icons";
import { BusinessWidget } from "./widget/business-widget";
import { ContactWidget } from "./widget/contact-widget";
import { AddressWidget } from "./widget/address-widget";
import { CustomTableWidget } from "./widget/custom-table-widget";
import { TotalPriceAndVatWidit } from "./widget/total-price-and-vat";

export default function Quote() {
  const { clasess } = useStyle();
  const { data, tableHeaders, tableRowPercent, t } = useQuote();

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
        <div
          style={{
            width: "100%",
            height: 390,
            overflow: "scroll",
            boxShadow: "0px 4px 20px rgba(103, 103, 103, 0.08)",
            marginTop: 20,
          }}
        >
          <ContactWidget />
          <AddressWidget />
          <div style={clasess.tableContainer}>
            <CustomTableWidget
              headerTitle={"Order review"}
              tableHeaders={tableHeaders}
              headerWidth={tableRowPercent}
              tableRowPercent={tableRowPercent}
              data={data}
            />
          </div>
        </div>
        <div style={clasess.btnsContainer}>
          <div style={clasess.btnContainer}>
            <AddPlusIcon />
            <div style={clasess.btnTitle}>add new item</div>
          </div>
          <div style={clasess.btnContainer}>
            <AddPlusIcon />
            <div style={clasess.btnTitle}>add exist item</div>
          </div>
          <div style={clasess.btnContainer}>
            <AddPlusIcon />
            <div style={clasess.btnTitle}>add delivery</div>
          </div>
        </div>
        <TotalPriceAndVatWidit />
      </div>
    </AdminAuthLayout>
  );
}
