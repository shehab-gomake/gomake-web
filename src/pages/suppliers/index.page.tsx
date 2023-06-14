import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";
import { useSuppliers } from "./use-suppliers";
import { HeaderFilter } from "./header-filter";
import { useState } from "react";
import { GomakePrimaryButton } from "@/components";
import { CustomerCardWidget } from "@/widgets/customer-card-modal";
import { useStyle } from "./style";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function Home() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [open, setOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const { tabelHeaders, allSuppliers,
    statuses, valStatus, handleClean, onChangeStatus,
  } = useSuppliers("S", pageNumber);


  return (
    <CustomerAuthLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <HeaderTitle title={t("suppliers.title")} />
        <GomakePrimaryButton variant="contained" onClick={() => setOpen(!open)} style={clasess.buttonStyle}>
          {t("suppliers.buttons.addSupplier")}</GomakePrimaryButton>
      </div>
      <CustomerCardWidget openModal={open} modalTitle={t("suppliers.addModalTitle")} onClose={() => setOpen(false)} showAddButton={true} >
      </CustomerCardWidget>
      <HeaderFilter
        onChangeStatus={onChangeStatus}
        status={statuses}
        valStatus={valStatus}
        handleClean={handleClean}
      />
      <Stack spacing={3}>
        <div style={clasess.tableContainer}>
          <Table tableHeaders={tabelHeaders} tableRows={allSuppliers}></Table>
        </div>
        <Pagination count={5} variant="outlined" color="primary" page={pageNumber}
          onChange={(event, value) => setPageNumber(value)} />
      </Stack>
    </CustomerAuthLayout>
  );
}
