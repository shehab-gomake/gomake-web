import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAndSetGetAllEnvelope } from "@/services/hooks/admin-side/get-set-envelope";

const useAllEnvelops = () => {
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();
  const { t } = useTranslation();
  const headerTable = useMemo(
    () => [
      t("materials.sheetPaper.admin.categoryName"),
      t("materials.sheetPaper.settings"),
    ],
    []
  );
  const [openAddNewPlatModal, setOpenAddNewPlatModal] = useState(false);
  const [openUpdateSheetModal, setOpenUpdateSheetModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allEnvelops, setAllEnvelops] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewSheetWights, setIsAddNewSheetWights] = useState(false);
  const [selectedSheetWeight, setSelectedSheetWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      width: "",
      height: "",
      stock: "",
      quantityInPackage: "",
      isWithWindow: false,
      defaultPrice: "",
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
  const onChangeUpdateStatePlatSize = useCallback(
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
  const initialStateSheetWeights = (item: any) => {
    let temp = [...item?.envelopeSizes];
    let final: any = [];
    temp.map((envelopeSize) => {
      final[envelopeSize?.id] = {
        ...envelopeSize,
      };
    });

    setUpdateState(final);
  };

  const getPlats = useCallback(async () => {
    await getAndSetGetAllEnvelope(callApi, setAllEnvelops);
  }, []);
  const onCloseAddNewPlatModal = () => {
    setOpenAddNewPlatModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewPlatModal(true);
  };
  const onCloseUpdateModal = async () => {
    getPlats();
    setOpenUpdateSheetModal(false);
    setIsAddNewSheetWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateSheetWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateSheetModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedSheetWeight(item);
  };

  const addNewPlatsSize = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/envelope/add-envelope`,
      {
        categoryName,
        envelopeSizes: items,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getPlats();
      onCloseAddNewPlatModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewPlatSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/envelope/add-envelope-size?categoryName=${selectedItem?.categoryName}`,
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
        getPlats();
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
  const deletePlatSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/envelope/delete-envelope-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getPlats();
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

  const updatePlatSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/envelope/update-envelope-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
    getPlats();
  }, []);
  return {
    headerTable,
    allEnvelops,
    openAddNewPlatModal,
    items,
    categoryName,
    openUpdateSheetModal,
    selectedEditItem,
    isAddNewSheetWights,
    openDeleteModal,
    selectedSheetWeight,
    updateState,
    onChangeUpdateStatePlatSize,
    onCloseAddNewPlatModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPlatsSize,
    setOpenUpdateSheetModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewSheetWights,
    addNewPlatSizeByCategoryName,
    deletePlatSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePlatSize,
  };
};

export { useAllEnvelops };
