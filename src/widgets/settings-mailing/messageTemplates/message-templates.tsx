import {useEffect} from "react";
import { TableFilter } from "./components/table-filter/table-filter";
import { TemplateTable } from "./components/template-table/template-table";

const TemplateSettings = () => {

    return (
        <div style={{position: "relative" , gap: "70px"}}>
          <TableFilter/>
          <TemplateTable/>
        </div>
    );
};

export {TemplateSettings};
