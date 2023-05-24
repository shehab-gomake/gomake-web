import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { useCustomers } from "./use-customers";
import { AddCustomerButton } from "./add-customer";


export default function Home() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { tabelHeaders, setAllCustomers, allCustomers, agentsCategores, customerTypes, statuses, onChangeAgent, onChangeCustomer, onChangeStatus, handleClean, valAgent, valName,customerType,onChangeCustomerType } = useCustomers("C");


  return (
    <CustomerAuthLayout>
      <div style={clasess.sameRow}>
        <HeaderTitle title={t("Customers")} />
        <AddCustomerButton></AddCustomerButton>
      </div>
      <HeaderFilter
        agentsCategores={agentsCategores}
        customerTypes={customerTypes}
        status={statuses}
        onChangeAgent={onChangeAgent}
        onChangeCustomer={onChangeCustomer}
        onChangeCustomerType={onChangeCustomerType}
        onChangeStatus={onChangeStatus}
        
        setAllCustomers={setAllCustomers}
        allCustomers={allCustomers}
        handleClean={handleClean}
        valAgent={valAgent}
        valName={valName}
        customerType={customerType}

      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allCustomers}></Table>
      </div>
    </CustomerAuthLayout>
  );
}
