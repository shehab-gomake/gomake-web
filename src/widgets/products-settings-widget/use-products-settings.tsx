import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import {
  deleteShipmentTypeByIdApi,
  getAllShipmentTypesApi,
} from "@/services/api-service/shipmentTypes/shipment-type-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Permissions } from "@/components/CheckPermission/enum";
import { IconButton } from "@mui/material";
import { DeleteIcon } from "../settings-mailing/messageTemplates/components/more-circle/icons/delete";

const useProductsSettings = () => {
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultGetData, alertFaultDelete, alertSuccessDelete } =
    useSnackBar();
  const [allShipmentTypes, setAllShipmentTypes] = useState([]);
  const [value, setValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const tabs = [
    {
      name: t("settings.productManagement"),
      permission: Permissions.SHOW_PRODUCTS,
    },
    {
      name: t("settings.shipmentsSetting"),
      permission: Permissions.SHOW_SHIPMENT_TYPES,
    },
    {
      name: t("settings.pricingSetting"),
    },
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

  const tableHeaders = [
    t("customers.modal.name"),
    t("shipmentTypes.startingPrice"),
    t("shipmentTypes.freeShipping"),
    t("properties.more"),
  ];

  return {
    t,
    tabs,
    value,
    navigate,
    handleChange,
    setValue,
    openModal,
    handleCloseModal,
    handleOpenModal,
    tableHeaders,
    allShipmentTypes,
    getAllShipmentTypes,
  };
};

export { useProductsSettings };
