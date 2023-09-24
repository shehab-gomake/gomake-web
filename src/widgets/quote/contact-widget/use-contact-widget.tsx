import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { clientContactsState, quoteItemState } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { quoteState } from "@/pages-components/quote/store/quote";

const useContactWidget = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { setSnackbarStateValue } = useSnackBar();

  const quoteStateValue = useRecoilValue<any>(quoteState);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [clientContactsValue] = useRecoilState<any>(clientContactsState);
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
    setItems(quoteItemValue?.quoteContacts);
  }, [quoteItemValue]);

  const updateClientContact = useCallback(async (item: any) => {
    const res = await callApi(
      "PUT",
      `/v1/erp-service/quote/update-quote-contact`,
      {
        id: item?.id,
        contactID: item?.contactID,
        contactName: item?.contactName,
        contactMail: item?.contactMail,
        contactPhone: item?.contactPhone,
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
    clientContactsValue,
    items,
    setItems,
    changeItems,
    updateClientContact,
    t,
  };
};

export { useContactWidget };
