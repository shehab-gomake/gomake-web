import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllFoils } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useFoil = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.inputs.categoryName"),
      t("materials.sheetPaper.settings"),
    ],
    []
  );
  const [openAddNewFoilModal, setOpenAddNewFoilModal] = useState(false);
  const [openUpdateFoilModal, setOpenUpdateFoilModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allFoil, setAllFoil] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewFoilWights, setIsAddNewFoilWights] = useState(false);
  const [selectedFoilWeight, setSelectedFoilWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      thickness: "",
      width: "",
      height: "",
      weightPerSquareMeter: "",
      defaultPricePerSquareMeter: "",
      defaultPricePerRoll: "",
    },
  ]);
  const changeItems = (index: number, filedName: string, value: any) => {
    let temp = [...items];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setItems(temp);
  };
  const onChangeUpdateStateFoilSize = useCallback(
    (index: string, filedName: string, value: any) => {
      let temp: any = { ...updateState };
      temp[`${index}`] = {
        ...temp[`${index}`],
        [filedName]: value,
      };
      setUpdateState(temp);
    },
    [updateState]
  );
  const initialStateFoilWeights = (item: any) => {
    let temp = [...item?.foilSizes];
    let final: any = [];
    temp.map((foilSize) => {
      final[foilSize?.id] = {
        ...foilSize,
      };
    });

    setUpdateState(final);
  };

  const getFoil = useCallback(async () => {
    await getAndSetGetAllFoils(callApi, setAllFoil);
  }, []);
  const onCloseAddNewFoilModal = () => {
    setOpenAddNewFoilModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewFoilModal(true);
  };
  const onCloseUpdateModal = async () => {
    getFoil();
    setOpenUpdateFoilModal(false);
    setIsAddNewFoilWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateFoilWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateFoilModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedFoilWeight(item);
  };

  const addNewFoilSize = useCallback(async () => {
    const res = await callApi("POST", `/v1/administrator/foil/add-foil`, {
      categoryName,
      foilSizes: items,
    });
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getFoil();
      onCloseAddNewFoilModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewFoilSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/foil/add-foil-size?categoryName=${selectedItem?.categoryName}`,
        {
          ...items[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getFoil();
        onCloseUpdateModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [items]
  );
  const deleteFoilSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/foil/delete-foil-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getFoil();
        onCloseDeleteModal();
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    []
  );

  const updateFoilSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/foil/update-foil-size?categoryName=${categoryName}&sizeId=${sizeId}`,
        {
          ...updateState[sizeId],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
      } else {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedfailed"),
          type: "error",
        });
      }
    },
    [updateState]
  );
  useEffect(() => {
    getFoil();
  }, []);
  return {
    headerTable,
    allFoil,
    openAddNewFoilModal,
    items,
    categoryName,
    openUpdateFoilModal,
    selectedEditItem,
    isAddNewFoilWights,
    openDeleteModal,
    selectedFoilWeight,
    updateState,
    onChangeUpdateStateFoilSize,
    onCloseAddNewFoilModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewFoilSize,
    setOpenUpdateFoilModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewFoilWights,
    addNewFoilSizeByCategoryName,
    deleteFoilSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateFoilSize,
  };
};

export { useFoil };
