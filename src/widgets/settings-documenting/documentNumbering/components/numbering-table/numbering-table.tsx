import { useEffect } from "react";
import { useDocumentNumbers } from "../../use-documents-numbers";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";

const NumberingTable = () => {
  const { tabs, getAllDocumentsNumbers } = useDocumentNumbers();

  useEffect(() => {
    getAllDocumentsNumbers();
  }, []);

  return <PrimaryTabsComponent tabs={tabs} selectedColor={"secondary"} />;
};

export { NumberingTable };
