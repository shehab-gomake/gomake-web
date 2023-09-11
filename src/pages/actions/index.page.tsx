import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useActions } from "./use-actions";

import { useStyle } from "./style";
import { Row } from "./widget/row";

export default function Profits() {
  const { clasess } = useStyle();
  const { tableHeaders, allActions, t } = useActions();

  return (
    <CustomerAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle
          title={t("products.actions.admin.title")}
          marginTop={1}
          marginBottom={20}
        />
        <div style={clasess.tableHeaderStyle}>
          {tableHeaders?.map((item) => {
            return <div style={clasess.headerNameStyle}>{item}</div>;
          })}
        </div>
        <div style={clasess.row}>
          {allActions?.map((row: any, index: number) => {
            return (
              <div key={`body_row${index}`} style={{ width: "100%" }}>
                <Row row={row} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </CustomerAuthLayout>
  );
}
