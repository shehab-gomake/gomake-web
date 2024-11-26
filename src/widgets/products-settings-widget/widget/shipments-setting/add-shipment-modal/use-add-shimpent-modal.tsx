import { useTranslation } from "react-i18next";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useState } from "react";
import { addShipmentTypeApi } from "@/services/api-service/shipmentTypes/shipment-type-api";

const useAddShipmentModal = ({ onClose, getAllShipmentTypes }) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertRequiredFields } = useSnackBar();

  const initialState = {
    title: "",
    initialPrice: null,
    freeShipmentStartPrice: 0,
    isInternal: null,
  };

  const [shipmentState, setShipmentState] = useState<{
    title: string;
    initialPrice: number;
    freeShipmentStartPrice: number;
    isInternal: any;
  }>(initialState);

  const onChangeInputs = (key, value) => {
    setShipmentState({ ...shipmentState, [key]: value });
  };

  const handleClose = () => {
    setShipmentState(initialState);
    onClose();
  };

  const handleAddShipment = async () => {
    if (!shipmentState.title || shipmentState.initialPrice === null) {
      alertRequiredFields();
      return;
    }

    const updatedShipmentState = {
      ...shipmentState,
      isInternal: shipmentState.isInternal ?? true,
    };

    const callBack = (res) => {
      if (res?.success) {
        getAllShipmentTypes();
        handleClose();
      } else {
        alertFaultAdded();
      }
    };

    await addShipmentTypeApi(callApi, callBack, updatedShipmentState);
  };

  return {
    t,
    handleClose,
    onChangeInputs,
    shipmentState,
    setShipmentState,
    handleAddShipment,
  };
};

export { useAddShipmentModal };
