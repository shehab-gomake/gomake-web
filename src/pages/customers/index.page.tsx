import { HeaderTitle } from "@/widgets";
import { useTranslation } from "react-i18next";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";
import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { useCustomers } from "./use-customers";
import { ButtonsWidget } from "@/widgets/add-customer-modal";
import { useMemo } from "react";

export default function Home() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { tabelHeaders, setAllCustomers ,allCustomers , agentsCategores , customersCategores , customerTypes , statuses ,categoryName , onChangeAgent , onChangeCustomer , onChangeSupplier} = useCustomers();
  const customersData = [
    { id: 1, Name: 'First Customer', CustomerType: 'client', Agent: 'no', Email: 'lama@gomake.net', Fax: '1212', Mobile: 'no', Phone1: '0545568623', Phone2: '0545568623', Status: 'active', hashTaG: 'null' },
    { id: 2, Name: 'Second Customer', CustomerType: 'client', Agent: 'no', Email: 'lama@gomake.net', Fax: '1212', Mobile: 'no', Phone1: '0545568623', Phone2: '0545568623', Status: 'active', hashTaG: 'null' },
  ];
  


  return (
    <CustomerAuthLayout>
      <div style ={clasess.sameRow}>
        <HeaderTitle title={t("customers.title")} />
        <ButtonsWidget ></ButtonsWidget>
      </div>
      <HeaderFilter
      agentsCategores={agentsCategores}
      customersCategores={customersCategores}
      customerType = {customerTypes}
      status = {statuses}
      categoryName={categoryName}

      onChangeAgent={onChangeAgent}
      onChangeCustomer={onChangeCustomer}
      

      setAllColors={setAllCustomers}
      onChangeSupplier={onChangeSupplier}
      allColors={allCustomers}

      />
      <div style={clasess.tableContainer}>
        <Table tableHeaders={tabelHeaders} tableRows={allCustomers}></Table>
      </div>
    </CustomerAuthLayout>
  );
}
