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
  const [openAddNewEnvelopeModal, setOpenAddNewEnvelopeModal] = useState(false);
  const [openUpdateEnvelopeModal, setOpenUpdateEnvelopeModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [allEnvelops, setAllEnvelops] = useState([]);
  const [selectedEditItem, setSelectedEditItem] = useState();
  const [categoryName, setCategoryName] = useState("");
  const [isAddNewEnvelopeWights, setIsAddNewEnvelopeWights] = useState(false);
  const [selectedEnvelopeWeight, setSelectedEnvelopeWeight] = useState({});
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
  const onChangeUpdateStateEnvelopeSize = useCallback(
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
  const initialStateEnvelopeWeights = (item: any) => {
    let temp = [...item?.envelopeSizes];
    let final: any = [];
    temp.map((envelopeSize) => {
      final[envelopeSize?.id] = {
        ...envelopeSize,
      };
    });

    setUpdateState(final);
  };

  const getEnvelopes = useCallback(async () => {
    await getAndSetGetAllEnvelope(callApi, setAllEnvelops);
  }, []);
  const onCloseAddNewEnvelopeModal = () => {
    setOpenAddNewEnvelopeModal(false);
  };
  const onOpnModalAdded = () => {
    setOpenAddNewEnvelopeModal(true);
  };
  const onCloseUpdateModal = async () => {
    getEnvelopes();
    setOpenUpdateEnvelopeModal(false);
    setIsAddNewEnvelopeWights(false);
  };
  const onOpnUpdateModal = (item) => {
    initialStateEnvelopeWeights(item);
    setSelectedEditItem(item);
    setOpenUpdateEnvelopeModal(true);
  };
  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };
  const onOpenDeleteModal = (item: any) => {
    setOpenDeleteModal(true);
    setSelectedEnvelopeWeight(item);
  };

  const addNewEnvelopesSize = useCallback(async () => {
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
      await getEnvelopes();
      onCloseAddNewEnvelopeModal();
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.addedfailed"),
        type: "error",
      });
    }
  }, [categoryName, items]);
  const addNewEnvelopeSizeByCategoryName = useCallback(
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
        getEnvelopes();
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
  const deleteEnvelopeSize = useCallback(
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
        getEnvelopes();
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

  const updateEnvelopeSize = useCallback(
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
    getEnvelopes();
  }, []);
  return {
    headerTable,
    allEnvelops,
    openAddNewEnvelopeModal,
    items,
    categoryName,
    openUpdateEnvelopeModal,
    selectedEditItem,
    isAddNewEnvelopeWights,
    openDeleteModal,
    selectedEnvelopeWeight,
    updateState,
    onChangeUpdateStateEnvelopeSize,
    onCloseAddNewEnvelopeModal,
    onOpnModalAdded,
    changeItems,
    setItems,
    setCategoryName,
    addNewEnvelopesSize,
    setOpenUpdateEnvelopeModal,
    onCloseUpdateModal,
    onOpnUpdateModal,
    setIsAddNewEnvelopeWights,
    addNewEnvelopeSizeByCategoryName,
    deleteEnvelopeSize,
    setOpenDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    updateEnvelopeSize,
  };
};

export { useAllEnvelops };
