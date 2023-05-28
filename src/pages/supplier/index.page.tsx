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

export default function Home() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [open, setOpen] = useState(false);
  const { tabelHeaders, allSuppliers,
    statuses, valStatus, handleClean, onChangeStatus,
  } = useSuppliers("S");

  return (
    <CustomerAuthLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <HeaderTitle title={t("Suppliers")} />
        <GomakePrimaryButton variant="contained" onClick={() => setOpen(!open)} style={clasess.buttonStyle}>
          Add Supplier
        </GomakePrimaryButton>
      </div>
      <CustomerCardWidget openModal={open} modalTitle="Add Supplier" onClose={() => setOpen(false)} showAddButton={true} >
      </CustomerCardWidget>
      <HeaderFilter
        onChangeStatus={onChangeStatus}
        status={statuses}
        valStatus={valStatus}
        handleClean={handleClean}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allSuppliers}></Table>
      </div>
    </CustomerAuthLayout>
  );
}
