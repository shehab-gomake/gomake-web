import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderFilter } from "./header-filter";
import { useEmployees } from "./use-employees";
import { Switch } from "@mui/material";
import { useStyle } from "./style";
import { AddEmployeeButton } from "./add-employee";
import Pagination from '@mui/material/Pagination';
import { useState } from "react";



export default function Home() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [pageNumber, setPageNumber] = useState(1);
  const { tabelHeaders , onChangeName , onChangStatus , allEmployees , isActive , pagesCount } = useEmployees(pageNumber);


  return (
    <CustomerAuthLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",}}>
        <HeaderTitle title={t("employees.title")}/>
        <AddEmployeeButton></AddEmployeeButton>
      </div>
      <HeaderFilter onChangeName={onChangeName} />
      <div style={{ display: "flex", alignItems: "center" }}>
      <Switch  style={{alignSelf: "center"}}  checked={isActive} onChange={onChangStatus}/> 
      <h3 style={clasess.headersStyle} >{t("employees.onlyInactiveEmployee")}</h3>
      </div>
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allEmployees} ></Table>
      </div>
      <Pagination style={{ position: "absolute", bottom: 10}} count={pagesCount} variant="outlined" color="primary"  page={pageNumber}
        onChange={(event, value) => setPageNumber(value)} />
    </CustomerAuthLayout>
  );
}
