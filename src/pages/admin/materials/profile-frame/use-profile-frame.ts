import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { getAndSetGetAllProfileFrame } from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";

const useProfileFrames = () => {
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
  const [openAddNewProfileFrameModal, setOpenAddNewProfileFrameModal] =
    useState(false);
  const [openUpdateProfileFrameModal, setOpenUpdateProfileFrameModal] =
    useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allProfileFrame, setAllProfileFrame] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewProfileFrameWights, setIsAddNewProfileFrameWights] =
    useState(false);
  const [selectedProfileFrameWeight, setSelectedProfileFrameWeight] = useState(
    {}
  );
  const [updateState, setUpdateState] = useState([]);

  const [items, setItems] = useState([
    {
      code: "",
      name: "",
      width: "",
      height: "",
      length: "",
      stock: "",
      defaultPricePerMeter: "",
      defaultPricePerUnit: "",
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
  const onChangeUpdateStateProfileFrameSize = useCallback(
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
  const initialStateProfileFrameWeights = (item: any) => {
    let temp = [...item?.profileFrameSizes];
    let final: any = [];
    temp.map((profileFrameSize) => {
      final[profileFrameSize?.id] = {
        ...profileFrameSize,
      };
    });

    setUpdateState(final);
  };

  const getProfileFrame = useCallback(async () => {
    await getAndSetGetAllProfileFrame(callApi, setAllProfileFrame);
  }, []);
  const onCloseAddNewProfileFrameModal = () => {
    setOpenAddNewProfileFrameModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewProfileFrameModal(true);
  };
  const onCloseUpdateModal = async () => {
    getProfileFrame();
    setOpenUpdateProfileFrameModal(false);
    setIsAddNewProfileFrameWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateProfileFrameWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateProfileFrameModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item) => {
    setOpenDeleteModal(true);
    setSelectedProfileFrameWeight(item);
  };

  const addNewProfileFrameSize = useCallback(async () => {
    const res = await callApi(
      "POST",
      `/v1/administrator/profile-frame/add-profile-frame`,
      {
        categoryName,
        profileFrameSizes: items,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedSusuccessfully"),
        type: "sucess",
      });
      await getProfileFrame();
      onCloseAddNewProfileFrameModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewProfileFrameSizeByCategoryName = useCallback(
    async (selectedItem: any) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/profile-frame/add-profile-frame-size?categoryName=${selectedItem?.categoryName}`,
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
        getProfileFrame();
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
  const deleteProfileFrameSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/profile-frame/delete-profile-frame-size?categoryName=${categoryName}&sizeId=${sizeId}`
      );
      if (res?.success) {
        setSnackbarStateValue({
          state: true,
          message: t("modal.addedSusuccessfully"),
          type: "sucess",
        });
        getProfileFrame();
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

  const updateProfileFrameSize = useCallback(
    async (sizeId: string, categoryName: string) => {
      const res = await callApi(
        "POST",
        `/v1/administrator/profile-frame/update-profile-frame-size?categoryName=${categoryName}&sizeId=${sizeId}`,
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
    getProfileFrame();
  }, []);
  return {
    headerTable,
    allProfileFrame,
    openAddNewProfileFrameModal,
    items,
    categoryName,
    openUpdateProfileFrameModal,
    selectedEditItem,
    isAddNewProfileFrameWights,
    openDeleteModal,
    selectedProfileFrameWeight,
    updateState,
    onChangeUpdateStateProfileFrameSize,
    onCloseAddNewProfileFrameModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewProfileFrameSize,
    setOpenUpdateProfileFrameModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewProfileFrameWights,
    addNewProfileFrameSizeByCategoryName,
    deleteProfileFrameSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateProfileFrameSize,
  };
};

export { useProfileFrames };
