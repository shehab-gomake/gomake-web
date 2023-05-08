import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllRollEncapsulation } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useRollEncapsulation = () => {
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
  const [openAddRollEncapsulationModal, setOpenAddRollEncapsulationModal] =
    useState(false);
  const [
    openUpdateRollEncapsulationModal,
    setOpenUpdateRollEncapsulationModal,
  ] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allRollEncapsulation, setAllRollEncapsulation] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [
    isAddNewRollEncapsulationThickness,
    setIsAddNewRollEncapsulationThickness,
  ] = useState(false);
  const [
    isAddNewRollEncapsulationWightSize,
    setIsAddNewRollEncapsulationWightSize,
  ] = useState(false);
  const [
    selectedRollEncapsulationThickness,
    setSelectedRollEncapsulationThickness,
  ] = useState({});
  const [
    selectedRollEncapsulationThicknessSize,
    setSelectedRollEncapsulationThicknessSize,
  ] = useState({});
  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      thickness: "",
      weightPerSquareMeter: "",
      rollEncapsulationSizes: [
        {
          code: "",
          width: "",
          height: "",
          name: "",
          defaultPricePerSquareMeter: "",
          fitToPrintType: [],
        },
      ],
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

  const changeItemsRollEncapsulationSize = (
    sheetThicknessIndex: number,
    sheetSizeIndex: number,
    filedName: string,
    value: any
  ) => {
    let temp = [...items[sheetThicknessIndex]["rollEncapsulationSizes"]];
    temp[sheetSizeIndex] = {
      ...temp[sheetSizeIndex],
      [filedName]: value,
    };
    changeItems(sheetThicknessIndex, "rollEncapsulationSizes", temp);
  };
  const [updateState, setUpdateState] = useState([]);
  const onClickOpenRollEncapsulationThicknessSizeWidget = (item) => {
    setSelectedRollEncapsulationThicknessSize(item);
    setIsAddNewRollEncapsulationWightSize(true);
    setItems([
      {
        code: "",
        name: "",
        thickness: "",
        weightPerSquareMeter: "",
        rollEncapsulationSizes: [
          {
            code: "",
            width: "",
            height: "",
            name: "",
            defaultPricePerSquareMeter: "",
            fitToPrintType: [],
          },
        ],
      },
    ]);
  };
  const onChangeUpdateStateRollEncapsulationThicknesss = useCallback(
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
  const initialStateRollEncapsulationThicknesss = (item: any) => {
    let temp = [...item?.rollEncapsulationThicknesses];
    let final: any = [];
    temp.map((rollEncapsulationThicknesse) => {
      final[rollEncapsulationThicknesse?.id] = {
        ...rollEncapsulationThicknesse,
      };
      rollEncapsulationThicknesse?.rollEncapsulationSizes?.map(
        (rollEncapsulationSize) => {
          final[rollEncapsulationSize?.id] = {
            ...rollEncapsulationSize,
          };
        }
      );
    });

    setUpdateState(final);
  };

  const getRollEncapsulation = useCallback(async () => {
    await getAndSetGetAllRollEncapsulation(callApi, setAllRollEncapsulation);
  }, []);
  const onCloseModalAdded = () => {
    setOpenAddRollEncapsulationModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddRollEncapsulationModal(true);
  };
  const onCloseUpdateModal = async () => {
    getRollEncapsulation();
    setOpenUpdateRollEncapsulationModal(false);
    setIsAddNewRollEncapsulationThickness(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateRollEncapsulationThicknesss(item);
    setSelectedEditItem(item);
    setOpenUpdateRollEncapsulationModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedRollEncapsulationThickness(item);
  };

  const addNewSupplierRollEncapsulation = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/roll-encapsulation/add-roll-encapsulation`,
      {
        categoryName,
        rollEncapsulationThicknesses: items,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getRollEncapsulation();
      onCloseModalAdded();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewSheeThicknessByCategoryName = useCallback(
    async (selectedItem) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/roll-encapsulation/add-roll-encapsulation-thickness?categoryName=${selectedItem?.categoryName}`,
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
        getRollEncapsulation();
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
  const deleteRollEncapsulationweight = useCallback(
    async (thicknessId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/roll-encapsulation/delete-roll-encapsulation-thickness?categoryName=${categoryName}&thicknessId=${thicknessId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getRollEncapsulation();
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
  const deleteRollEncapsulationweightSize = useCallback(
    async (categoryName: string, thicknessId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/roll-encapsulation/delete-roll-encapsulation-thickness-size?categoryName=${categoryName}&thicknessId=${thicknessId}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getRollEncapsulation();
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
  const updateRollEncapsulationweight = useCallback(
    async (thicknessId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/roll-encapsulation/update-roll-encapsulation-thickness?categoryName=${categoryName}&thicknessId=${thicknessId}`,
        {
          ...updateState[thicknessId],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        // getRollEncapsulation();
        // onCloseUpdateModal();
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
  const updateRollEncapsulationThicknessSizes = useCallback(
    async (categoryName: string, thicknessId: string, sizeId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/roll-encapsulation/update-roll-encapsulation-thickness-size?categoryName=${categoryName}&thicknessId=${thicknessId}&sizeId=${sizeId}`,
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
        // getRollEncapsulation();
        // onCloseUpdateModal();
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
  const addNewSheeThicknessSizeByCategoryName = useCallback(
    async (categoryName: string, thicknessId: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/roll-encapsulation/add-roll-encapsulation-thickness-size?categoryName=${categoryName}&thicknessId=${thicknessId}`,
        {
          ...items[0]?.rollEncapsulationSizes[0],
        }
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getRollEncapsulation();
        setIsAddNewRollEncapsulationWightSize(false);
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
  useEffect(() => {
    getRollEncapsulation();
  }, []);
  return {
    headerTable,
    allRollEncapsulation,
    openAddRollEncapsulationModal,
    items,
    categoryName,
    openUpdateRollEncapsulationModal,
    selectedEditItem,
    isAddNewRollEncapsulationThickness,
    openDeleteModal,
    selectedRollEncapsulationThickness,
    updateState,
    isAddNewRollEncapsulationWightSize,
    selectedRollEncapsulationThicknessSize,
    onChangeUpdateStateRollEncapsulationThicknesss,
    onCloseModalAdded,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewSupplierRollEncapsulation,
    changeItemsRollEncapsulationSize,
    setOpenUpdateRollEncapsulationModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewRollEncapsulationThickness,
    addNewSheeThicknessByCategoryName,
    deleteRollEncapsulationweight,
    deleteRollEncapsulationweightSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateRollEncapsulationweight,
    updateRollEncapsulationThicknessSizes,
    setIsAddNewRollEncapsulationWightSize,
    onClickOpenRollEncapsulationThicknessSizeWidget,
    addNewSheeThicknessSizeByCategoryName,
  };
};

export { useRollEncapsulation };
