import { useGomakeAxios, useSnackBar } from "@/hooks";
import {
  deleteShipmentTypeByIdApi,
  getAllShipmentTypesApi,
} from "@/services/api-service/shipmentTypes/shipment-type-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Permissions } from "@/components/CheckPermission/enum";
import { IconButton, Stack } from "@mui/material";
import { DeleteIcon } from "../settings-mailing/messageTemplates/components/more-circle/icons/delete";
import { useUserPermission } from "@/hooks/use-permission";
import { ProductManagementWidget } from "./widget/product-management";
import { ShipmentsSetting } from "./widget/shipments-setting";
import { ITab } from "@/components/tabs/interface";
import { useRecoilState } from "recoil";
import { selectedProductsTabState } from "./enums";

const useProductsSettings = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, alertFaultDelete, alertSuccessDelete } =
    useSnackBar();
  const [allShipmentTypes, setAllShipmentTypes] = useState([]);
  const [value, setValue] = useRecoilState<number>(selectedProductsTabState);

  const [openModal, setOpenModal] = useState(false);
  const { CheckPermission } = useUserPermission();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const tableHeaders = [
    t("customers.modal.name"),
    t("shipmentTypes.startingPrice"),
    t("shipmentTypes.freeShipping"),
    t("properties.more"),
  ];

  const getAllShipmentTypes = async () => {
    const callBack = (res) => {
      if (res?.success) {
        const mapData = res.data.map((item: any) => [
          item?.title,
          item?.initialPrice,
          item?.freeShipmentStartPrice,
          <IconButton onClick={() => onClickDeleteShipmentType(item.id)}>
            <DeleteIcon />
          </IconButton>,
        ]);
        setAllShipmentTypes(mapData);
      } else {
        alertFaultGetData();
      }
    };

    await getAllShipmentTypesApi(callApi, callBack);
  };

  const tabs: ITab[] = [
    CheckPermission(Permissions.SHOW_PRODUCTS) && {
      title: t("settings.productManagement"),
      component: (
        <Stack>
          <ProductManagementWidget />
        </Stack>
      ),
    },
    CheckPermission(Permissions.SHOW_SHIPMENT_TYPES) && {
      title: t("settings.shipmentsSetting"),
      component: (
        <ShipmentsSetting
          getAllShipmentTypes={getAllShipmentTypes}
          tableHeaders={tableHeaders}
          allShipmentTypes={allShipmentTypes}
        />
      ),
    },
  ].filter(Boolean);

  const onClickDeleteShipmentType = async (id: string) => {
    const callBack = (res) => {
      if (res?.success) {
        getAllShipmentTypes();
        alertSuccessDelete();
      } else {
        alertFaultDelete();
      }
    };

    await deleteShipmentTypeByIdApi(callApi, callBack, { id });
  };

  return {
    t,
    tabs,
    value,
    setValue,
    openModal,
    handleCloseModal,
    handleOpenModal,
    getAllShipmentTypes,
  };
};

export { useProductsSettings };
