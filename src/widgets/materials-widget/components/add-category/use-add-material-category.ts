import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  activeFilterState,
  flagState,
  isDuplicateCategoryModalState,
  isEditCategoryModalState,
  materialCategoriesState,
  materialTypeTableState,
  openAddCategoryModalState,
  selectedCategoryModalState,
} from "@/widgets/materials-widget/state";
import { useMaterials } from "../../use-materials";
import { useEffect, useState } from "react";
import { EMaterialActiveFilter } from "../../enums";
import { useTranslation } from "react-i18next";
import {
  addPrintHouseMaterialCategoryApi,
  duplicatePrintHouseMaterialDisplayNameApi,
  updatePrintHouseMaterialCategoryNameApi,
} from "@/services/api-service/materials/printhouse-materials-endpoints";
import {
  addMaterialCategoryApi,
  uploadPrintHouseMaterialApi,
} from "@/services/api-service/materials/materials-endpoints";

const useAddMaterialCategory = (isAdmin: boolean) => {
  const { callApi } = useGomakeAxios();
  const { query,push } = useRouter();
  const { materialType } = query;
  const materialCategories = useRecoilValue(materialCategoriesState);
  const materialTypeTable = useRecoilValue(materialTypeTableState);
  const { alertSuccessAdded, alertFaultAdded, alertFault } = useSnackBar();
  const [openModal, setOpenModal] = useRecoilState(openAddCategoryModalState);
  const [editCategoryModalState, setEditCategoryModalState] = useRecoilState(
    isEditCategoryModalState
  );
  const [duplicateCategoryModalState, setDuplicateCategoryModalState] =
    useRecoilState(isDuplicateCategoryModalState);
  const [selectedCategoryModal, setSelectedCategoryModal] = useRecoilState<any>(
    selectedCategoryModalState
  );
  const { getMaterialCategories } = useMaterials(isAdmin);
  const [newCategory, setNewCategory] = useState<string>(null);
  const [newCategoryKey, setNewCategoryKey] = useState<string>(null);
  const [imgUrl, setImgUrl] = useState<any>("");
  const [selectedImgForAdded, setSelectedImgForAdded] = useState();
  const setActiveFilter = useSetRecoilState(activeFilterState);
  const setFlagState = useSetRecoilState(flagState);
  const { t } = useTranslation();
  const [attributeValues, setAttributeValues] = useState<Record<string, any>>(
    {}
  );
  const additionalAttributes =
    selectedCategoryModal?.additionalAttributes ??
    materialCategories?.[0]?.additionalAttributes ??
    [];

  useEffect(() => {
    if (selectedCategoryModal) {
      setNewCategory(selectedCategoryModal?.categoryName);
      setNewCategoryKey(selectedCategoryModal?.categoryKey);
      setImgUrl(selectedCategoryModal?.imageURL);
    }
  }, [selectedCategoryModal]);

  const onSetCategory = (e) => {
    setNewCategory(e.target.value);
  };

  const onAddCategory = async () => {
    if (newCategory) {
      const categoryDefaultAttributeValues = Object.entries(
        attributeValues
      ).map(([attributeName, value]) => ({
        attributeName,
        value: typeof value === "boolean" ? value.toString() : String(value),
      }));

      const callBack = (res) => {
        if (res.success) {
          const path = isAdmin ? "/materials-admin" : "/materials";
          push(path + `/${materialType}?materialCategory=${encodeURIComponent(newCategory)}`);
          alertSuccessAdded();
          setActiveFilter(EMaterialActiveFilter.ALL);
          getMaterialCategories(materialType).then();
          setOpenModal(false);
          setFlagState(false);
          setAttributeValues({});
          setNewCategory("")
         
        } else {
          if(res.statusCode ===102){
            alertFault("login.thisCategoryAlreadyExists")
          }
          else{
            alertFaultAdded();

          }
        }
      };
      if (isAdmin) {
        await addMaterialCategoryApi(callApi, callBack, {
          materialTypeKey: materialType.toString(),
          categoryKey: newCategory,
          imageBase64: selectedImgForAdded,
          categoryDefaultAttributeValues,
        });
      } else {
        await addPrintHouseMaterialCategoryApi(callApi, callBack, {
          materialTypeKey: materialType.toString(),
          categoryKey: newCategory,
          imageBase64: selectedImgForAdded,
          categoryDefaultAttributeValues,
        });
      }
    } else {
      alertFault("login.thisFieldRequired");
    }
  };

  const updatePrintHouseMaterialCategoryName = async () => {
    const defaultAttributeValues = Object.entries(attributeValues).map(
      ([attributeName, value]) => ({
        attributeName,
        value: typeof value === "boolean" ? value.toString() : String(value),
      })
    );

    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        setActiveFilter(EMaterialActiveFilter.ALL);
        getMaterialCategories(materialType).then();
        setOpenModal(false);
        setFlagState(false);
        setAttributeValues({});
        setNewCategory("")
      } else {
        alertFaultAdded();
      }
    };
    await updatePrintHouseMaterialCategoryNameApi(callApi, callBack, {
      materialTypeKey: materialType.toString(),
      categoryKey: selectedCategoryModal?.categoryKey,
      displayName: newCategory,
      newCategoryKey:newCategory,
      defaultAttributeValues,
    });
  };

  const duplicatePrintHouseMaterialCategoryName = async () => {
    const callBack = (res) => {
      if (res.success) {
        const path = isAdmin ? "/materials-admin" : "/materials";
        push(path + `/${materialType}?materialCategory=${encodeURIComponent(newCategory)}`);
        alertSuccessAdded();
        setActiveFilter(EMaterialActiveFilter.ALL);
        getMaterialCategories(materialType).then();
        setOpenModal(false);
        setFlagState(false);
        setNewCategory("")
      } else {
        alertFaultAdded();
      }
    };
    await duplicatePrintHouseMaterialDisplayNameApi(callApi, callBack, {
      materialTypeKey: materialType.toString(),
      categoryKey: selectedCategoryModal?.categoryKey,
      newCategoryKey: newCategory,
    });
  };

  const uploadPrintHouseMaterialImage = async (data) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccessAdded();
        setActiveFilter(EMaterialActiveFilter.ALL);
        getMaterialCategories(materialType).then();
        setOpenModal(false);
        setFlagState(false);
      } else {
        alertFaultAdded();
      }
    };
    await uploadPrintHouseMaterialApi(callApi, callBack, {
      materialTypeKey: materialType.toString(),
      categoryKey: selectedCategoryModal?.categoryKey,
      imageBase64: data,
    });
  };

  const handleAttributeChange = (name: string, value: any) => {
    setAttributeValues((prev) => ({ ...prev, [name]: value }));
  };

  return {
    openModal,
    editCategoryModalState,
    duplicateCategoryModalState,
    selectedCategoryModal,
    newCategory,
    setOpenModal,
    onAddCategory,
    onSetCategory,
    setEditCategoryModalState,
    setDuplicateCategoryModalState,
    setSelectedCategoryModal,
    uploadPrintHouseMaterialImage,
    t,
    imgUrl,
    setSelectedImgForAdded,
    materialTypeTable,
    updatePrintHouseMaterialCategoryName,
    duplicatePrintHouseMaterialCategoryName,
    handleAttributeChange,
    setAttributeValues,
    attributeValues,
    additionalAttributes,
  };
};

export { useAddMaterialCategory };
