import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useParameters } from "./use-parameters";

import { useStyle } from "./style";
import { Row } from "./widget/row";

export default function Profits() {
  const { clasess } = useStyle();
  const { tableHeaders, parameters, t } = useParameters();

  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.parameters.admin.title")} />
        <div style={clasess.tableHeaderStyle}>
          {tableHeaders?.map((item) => {
            return <div style={clasess.headerNameStyle}>{item}</div>;
          })}
        </div>
        <div style={clasess.row}>
          {parameters?.map((row: any, index: number) => {
            return (
              <div key={`body_row${index}`} style={{ width: "100%" }}>
                <Row row={row} index={index} />
                {index != parameters?.length - 1 ? (
                  <div style={clasess.line} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </AdminAuthLayout>
  );
}
