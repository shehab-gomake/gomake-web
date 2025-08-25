import { useTranslation } from "react-i18next";
import { selectedAgentIdsState } from "./states/selected-agent-id";
import { useRecoilState } from "recoil";
import { useAllProductsDropDownList } from "@/hooks/use-products-drop-down-list";
import { useAgentsList } from "@/hooks/use-agent-list";
import { selectedProductTypesIdsState } from "./states/selected-product-type-id";
import { selectedProductsIdsState } from "./states/selected-product-id";
import { useAllProductTypesDropDownList } from "@/hooks/use-product-types-drop-down-list";
import { useClientTypesList } from "@/hooks/use-client-types";
import { selectedClientTypesIdsState } from "./states/selected-client-types-ids";
import {
  selectedJobTypesIdsState,
  SourceTypeEnum,
} from "./states/selected-job-types-ids";
import { selectedDocumentTypeState } from "./states/selected-document-type";
import { selectedDocumentStatusesState } from "./states/selected-document-statuses";
import { DocumentTypeEnums } from "@/enums/document-type-enum";

const useSalesDashboardFilters = () => {
  const { t } = useTranslation();
  const { agentsCategories } = useAgentsList();
  const { productList } = useAllProductsDropDownList();
  const { allProductTypes } = useAllProductTypesDropDownList();

  const { clientTypesCategories } = useClientTypesList(true);

  const productItems = productList.map((product) => ({
    id: product.id,
    label: product.name,
  }));

  const [selectedAgentIds, setSelectedAgentIds] = useRecoilState(
    selectedAgentIdsState
  );

  const [selectedProductIds, setSelectedProductIds] = useRecoilState(
    selectedProductsIdsState
  );
  const [selectedProductTypesIds, setSelectedProductTypesIds] = useRecoilState(
    selectedProductTypesIdsState
  );

  const [selectedClientTypesIds, setSelectedClientTypesIds] = useRecoilState(
    selectedClientTypesIdsState
  );

  const [selectedJobTypesIds, setSelectedJobTypesIds] = useRecoilState(
    selectedJobTypesIdsState
  );

  const [selectedDocumentType] = useRecoilState(selectedDocumentTypeState);
  const [selectedDocumentStatuses, setSelectedDocumentStatuses] =
    useRecoilState(selectedDocumentStatusesState);

  const toggleAgent = (id: string) => {
    setSelectedAgentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllAgents = () => {
    const allIds = agentsCategories.map((a) => a.id);
    const isAllSelected = allIds.every((id) => selectedAgentIds.includes(id));
    setSelectedAgentIds(isAllSelected ? [] : allIds);
  };

  const toggleProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllProducts = () => {
    const allIds = productList.map((a) => a.id);
    const isAllSelected = allIds.every((id) => selectedProductIds.includes(id));
    setSelectedProductIds(isAllSelected ? [] : allIds);
  };

  const toggleProductType = (id: string) => {
    setSelectedProductTypesIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllProductTypes = () => {
    const allIds = allProductTypes.map((a) => a.id);
    const isAllSelected = allIds.every((id) =>
      selectedProductTypesIds.includes(id)
    );
    setSelectedProductTypesIds(isAllSelected ? [] : allIds);
  };

  const toggleClientType = (id: string) => {
    setSelectedClientTypesIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllClientTypes = () => {
    const allIds = clientTypesCategories.map((a) => a.id);
    const isAllSelected = allIds.every((id) =>
      selectedClientTypesIds.includes(id)
    );
    setSelectedClientTypesIds(isAllSelected ? [] : allIds);
  };

  const jobTypesCategories = [
    { id: SourceTypeEnum.Internally, label: t("dashboard.internal") },
    { id: SourceTypeEnum.partially, label: t("dashboard.partialOutSource") },
    { id: SourceTypeEnum.Fully, label: t("dashboard.outSource") },
  ];

  const toggleJobType = (id: number) => {
    setSelectedJobTypesIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllJobTypes = () => {
    const allIds = jobTypesCategories.map((a) => a.id);
    const isAllSelected = allIds.every((id) =>
      selectedJobTypesIds.includes(id)
    );
    setSelectedJobTypesIds(isAllSelected ? [] : allIds);
  };

  // Document status values aligned with backend enum: Open=1, Closed=2, PartialClosed=3
  const documentStatusCategories = [
    { id: 1, label: t("sales.quote.open") },
    { id: 2, label: t("sales.quote.closed") },
    { id: 3, label: t("sales.quote.partialClosed") },
  ];

  const showDocumentStatusFilter =
    selectedDocumentType === DocumentTypeEnums.Invoice ||
    selectedDocumentType === DocumentTypeEnums.DeliveryNote;

  const toggleDocumentStatus = (id: number) => {
    setSelectedDocumentStatuses((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAllDocumentStatuses = () => {
    const allIds = documentStatusCategories.map((a) => a.id);
    const isAllSelected = allIds.every((id) =>
      selectedDocumentStatuses.includes(id)
    );
    setSelectedDocumentStatuses(isAllSelected ? [] : allIds);
  };

  return {
    t,
    agentsCategories,
    productItems,
    toggleAllProducts,
    toggleProduct,
    toggleAllAgents,
    toggleAgent,
    selectedProductIds,
    selectedAgentIds,
    allProductTypes,
    toggleAllProductTypes,
    toggleProductType,
    selectedProductTypesIds,

    toggleAllClientTypes,
    toggleClientType,
    selectedClientTypesIds,
    clientTypesCategories,
    toggleAllJobTypes,
    toggleJobType,
    selectedJobTypesIds,
    jobTypesCategories,
    // document statuses
    documentStatusCategories,
    selectedDocumentStatuses,
    toggleDocumentStatus,
    toggleAllDocumentStatuses,
    showDocumentStatusFilter,
  };
};

export { useSalesDashboardFilters };
