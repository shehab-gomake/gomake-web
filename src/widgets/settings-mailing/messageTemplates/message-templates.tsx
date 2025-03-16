import { ApiResponse } from "@/services/api-service/interface";
import { TableFilter } from "./components/table-filter/table-filter";
import { TemplateTable } from "./components/template-table/template-table";

interface IProps {
  getSMSTemplateTypes: () => Promise<ApiResponse>;
  tableHeaders?: string[];
}

const MessageTemplates = ({ tableHeaders, getSMSTemplateTypes }: IProps) => {
  return (
    <div style={{ position: "relative" }}>
      <TableFilter />
      <TemplateTable
        tableHeaders={tableHeaders}
        getSMSTemplateTypes={getSMSTemplateTypes}
      />
    </div>
  );
};

export { MessageTemplates };
