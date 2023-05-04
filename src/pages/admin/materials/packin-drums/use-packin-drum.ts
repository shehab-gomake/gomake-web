import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllPackinDrums } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const usePackinDrum = () => {
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
  const [openAddNewPackinDrumModal, setOpenAddNewPackinDrumModal] =
    useState(false);
  const [openUpdatePackinDrumModal, setOpenUpdatePackinDrumModal] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allPackinDrum, setAllPackinDrum] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewPackinDrumWights, setIsAddNewPackinDrumWights] =
    useState(false);
  const [selectedPackinDrumWeight, setSelectedPackinDrumWeight] = useState({});
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      material: "",
      size: "",
      sizeName: "",
      drumRingNumber: "",
      weight: "",
      defaultPricePerDrum: "",
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
  const onChangeUpdateStatePackinDrumSize = useCallback(
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
  const initialStatePackinDrumWeights = (item: any) => {
    let temp = [...item?.packinDrumSizes];
    let final: any = [];
    temp.map((packinDrumSize) => {
      final[packinDrumSize?.id] = {
        ...packinDrumSize,
      };
    });

    setUpdateState(final);
  };

  const getPackinDrum = useCallback(async () => {
    await getAndSetGetAllPackinDrums(callApi, setAllPackinDrum);
  }, []);
  const onCloseAddNewPackinDrumModal = () => {
    setOpenAddNewPackinDrumModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewPackinDrumModal(true);
  };
  const onCloseUpdateModal = async () => {
    getPackinDrum();
    setOpenUpdatePackinDrumModal(false);
    setIsAddNewPackinDrumWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStatePackinDrumWeights(item);
    setSelectedEditItem(item);
    setOpenUpdatePackinDrumModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedPackinDrumWeight(item);
  };

  const addNewPackinDrumSize = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/packin-drums/add-packin-drums`,
      {
        categoryName,
        packinDrumSizes: items,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getPackinDrum();
      onCloseAddNewPackinDrumModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewPackinDrumSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/packin-drums/add-packin-drums-size?categoryName=${selectedItem?.categoryName}`,
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
        getPackinDrum();
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
  const deletePackinDrumSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/packin-drums/delete-packin-drums-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getPackinDrum();
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

  const updatePackinDrumSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/packin-drums/update-packin-drums-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
    getPackinDrum();
  }, []);
  return {
    headerTable,
    allPackinDrum,
    openAddNewPackinDrumModal,
    items,
    categoryName,
    openUpdatePackinDrumModal,
    selectedEditItem,
    isAddNewPackinDrumWights,
    openDeleteModal,
    selectedPackinDrumWeight,
    updateState,
    onChangeUpdateStatePackinDrumSize,
    onCloseAddNewPackinDrumModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewPackinDrumSize,
    setOpenUpdatePackinDrumModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewPackinDrumWights,
    addNewPackinDrumSizeByCategoryName,
    deletePackinDrumSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updatePackinDrumSize,
  };
};

export { usePackinDrum };
