import { useGomakeAxios, useSnackBar } from "@/hooks";
import { deleteProductHotFolderRuleApi, getProductHotFolderRulesApi, reOrderProductHotFolderProfitRulesApi } from "@/services/api-service/products/product-endpoints";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DropResult } from "react-beautiful-dnd";
const useHotFolder = () => {
  const router = useRouter();
  const { callApi } = useGomakeAxios();
  const {
    alertFaultUpdate,
    alertFaultAdded,
    alertSuccessAdded,
    alertSuccessUpdate,
    alertSuccessDelete,
    alertFaultDelete,
  } = useSnackBar();
  const [productHotFolderRules, setProductHotFolderRules] = useState([]);
  const [openAddNewRuleModal, setOpenAddNewRuleModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);


  const onClickCloseAddNewRuleModal = () => {
    setOpenAddNewRuleModal(false);
  };
  const onClickOpenAddNewRuleModal = () => {
    setOpenAddNewRuleModal(true);
  };

  const getProductHotFolderRules = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setProductHotFolderRules(res?.data)
      }
    };
    await getProductHotFolderRulesApi(callApi, callBack, { productId: router.query.id });
  };

  useEffect(() => {
    getProductHotFolderRules();
  }, []);

  const deleteProductHotFolderRule = async (selectedAction: any) => {
    const productId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        alertSuccessDelete()
        getProductHotFolderRules();
      }
      else {
        alertFaultDelete()
      }
    }
    await deleteProductHotFolderRuleApi(callApi, callBack, {
      productId: productId,
      productHotFolderRuleId: selectedAction?.id,
    });
  }

  const reOrderProductHotFolderProfitRules = async (data: any) => {
    const productId = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

    const callBack = res => {
      if (res.success) {
        alertSuccessUpdate();
      } else {
        alertFaultUpdate();
      }
    }
    await reOrderProductHotFolderProfitRulesApi(callApi, callBack, { productId, data });
  };


  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(productHotFolderRules);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    const transformedArray = reordered.map((item: any, index: number) => ({
      id: item?.id,
      priority: index + 1,
    }));
    setProductHotFolderRules(reordered);
    reOrderProductHotFolderProfitRules(transformedArray);

  };

  return {
    productHotFolderRules,
    openAddNewRuleModal,
    selectedItem,
    onClickCloseAddNewRuleModal,
    onClickOpenAddNewRuleModal,
    getProductHotFolderRules,
    deleteProductHotFolderRule,
    onDragEnd,
    setSelectedItem
  };
};

export { useHotFolder };
