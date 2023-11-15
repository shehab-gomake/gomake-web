import { TableFilter } from "./components/table-filter/table-filter";
import { TemplateTable } from "./components/template-table/template-table";

const MessageTemplates = () => {

    return (
        <div style={{position: "relative"}}>
          <TableFilter/>
          <TemplateTable />
        </div>
    );
};

export {MessageTemplates};
