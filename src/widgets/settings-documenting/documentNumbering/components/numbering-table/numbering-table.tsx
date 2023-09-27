import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect } from "react";
import { useDocuments } from "../../use-documents-numbers";

const NumberingTable = () => {
    const { getAllDocumentsNumbers , documentsNumbers , tableHeaders} = useDocuments();
    useEffect(() => {
        getAllDocumentsNumbers()
      }, []);

    return (
        <>
        <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={documentsNumbers} headers={tableHeaders}></PrimaryTable>
        </>
    );
}

export {NumberingTable}