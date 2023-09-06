import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { clientAddressState, quoteItemState } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { quoteState } from "@/pages/quote/store/quote";

const useAddressWidget = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();

  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const [clientAddressValue] = useRecoilState<any>(clientAddressState);
  const [items, setItems] = useState([]);
  const changeItems = (index: number, filedName: string, value: any) => {
    let temp = [...items];
    temp[index] = {
      ...temp[index],
      [filedName]: value,
    };
    setItems(temp);
  };

  useEffect(() => {
    setItems(quoteItemValue?.quoteAddresses);
  }, [quoteItemValue]);

  const updateClientAddress = useCallback(async (item: any) => {
    const res = await callApi(
      "PUT",
      `/v1/erp-service/quote/update-quote-address`,
      {
        id: item?.id,
        addressID: item?.addressID,
        street: item?.street,
        city: item?.city,
        entry: item?.entry,
        apartment: item?.apartment,
        notes: item?.notes,
        quoteID: item?.quoteID,
      }
    );
    if (res?.success) {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedSusuccessfully"),
        type: "sucess",
      });
    } else {
      setSnackbarStateValue({
        state: true,
        message: t("modal.updatedfailed"),
        type: "error",
      });
    }
  }, []);
  return {
    quoteStateValue,
    quoteItemValue,
    clientAddressValue,
    items,
    setItems,
    changeItems,
    updateClientAddress,
    t,
  };
};

export { useAddressWidget };
