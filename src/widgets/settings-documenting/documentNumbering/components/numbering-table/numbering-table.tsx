import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect } from "react";
import { useDocumentNumbers } from "../../use-documents-numbers";

const NumberingTable = () => {
    const { getAllDocumentsNumbers , documentsNumbers , tableHeaders} = useDocumentNumbers();
    
    useEffect(() => {
        getAllDocumentsNumbers()
      }, []);

    return (
        <>
        <PrimaryTable stickyFirstCol={false} stickyHeader={true} rows={documentsNumbers} headers={tableHeaders} maxHeight={700}
        ></PrimaryTable>
        </>
    );
}

export {NumberingTable}