import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { useCustomers } from "./use-customers";
import { ButtonsWidget } from "@/widgets/add-customer-modal";


export default function Home() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { tabelHeaders, setAllCustomers, allCustomers,agentsCategores, customerTypes, statuses, categoryName, onChangeAgent, onChangeCustomer , onChangeStatus , handleClean , valAgent , valName ,valStatus} = useCustomers("C");

  return (
    <CustomerAuthLayout>
      <div style={clasess.sameRow}>
        <HeaderTitle title={t("customers.title")} />
        <ButtonsWidget></ButtonsWidget>
      </div>
      <HeaderFilter
        agentsCategores={agentsCategores}
        customerType={customerTypes}
        status={statuses}
        categoryName={categoryName}
        onChangeAgent={onChangeAgent}
        onChangeCustomer={onChangeCustomer}
        onChangeStatus={onChangeStatus}
        setAllCustomers={setAllCustomers}
        allCustomers={allCustomers}
        handleClean={handleClean}
        valAgent={valAgent}
        valName={valName}
        valStatus={valStatus}
      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allCustomers}></Table>
      </div>
    </CustomerAuthLayout>
  );
}
