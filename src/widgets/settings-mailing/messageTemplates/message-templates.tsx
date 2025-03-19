import { ApiResponse } from "@/services/api-service/interface";
import { TableFilter } from "./components/table-filter/table-filter";
import { TemplateTable } from "./components/template-table/template-table";
import { Stack } from "@mui/material";

interface IProps {
  getSMSTemplateTypes: () => Promise<ApiResponse>;
  tableHeaders?: string[];
}

const MessageTemplates = ({ tableHeaders, getSMSTemplateTypes }: IProps) => {
  return (
    <Stack direction={"column"} gap={"8px"} style={{ position: "relative" }}>
      <TableFilter />
      <TemplateTable
        tableHeaders={tableHeaders}
        getSMSTemplateTypes={getSMSTemplateTypes}
      />
    </Stack>
  );
};

export { MessageTemplates };
