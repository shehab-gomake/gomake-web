import { useTranslation } from "react-i18next";
import {
  GoMakeModal, GomakePrimaryButton, GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useGomakeAxios, useGomakeRouter, useSnackBar } from "@/hooks";
import { useRecoilState } from "recoil";
import { quoteItemState } from "@/store";
import { useState } from "react";
import { addCustomerContactApi } from "@/services/api-service/generic-doc/documents-api";

const AddNewContactModal = ({ openModal, onClose, getQuote, getAllClientContacts }) => {
  const { callApi } = useGomakeAxios();
  const { navigate } = useGomakeRouter();
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [state, setState] = useState({
    contactMail: "",
    contactName: "",
    contactPhone: ""
  });
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const [errors, setErrors] = useState<any>({});
  const validateInput = () => {
    let tempErrors: any = {};
    if (!state.contactMail) {
      tempErrors.contactMail = t("validation.emailRequired");
    } else if (!/\S+@\S+\.\S+/.test(state.contactMail)) {
      tempErrors.contactMail = t("validation.invalidEmail");
    }
    if (!state.contactName) {
      tempErrors.contactName = t("validation.nameRequired");
    }
    if (!state.contactPhone) {
      tempErrors.contactPhone = t("validation.phoneRequired");
    } else if (!/^\+?([0-9]{1,3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4,5})$/.test(state.contactPhone)) {
      tempErrors.contactPhone = t("validation.invalidPhone");
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };
  const handleChange = (field, value) => {
    setState(prevState => ({
      ...prevState,
      [field]: value
    }));
  };
  const onClickAddContact = () => {
    if (validateInput()) {
      createNewContactNew()
      onClose()
    }
    else {
      alertFaultAdded()
    }
  };

  const createNewContactNew = async () => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        getQuote();
        getAllClientContacts()
        // addNewContactNew(res?.data?.data?.data)
      } else {
        alertFaultAdded();
      }
    }
    await addCustomerContactApi(callApi, callBack, {
      contactName: state.contactName,
      contactMail: state.contactMail,
      contactPhone: state.contactPhone,
      clientId: quoteItemValue?.customerID,
    })
  }

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.addNewContact")}
        onClose={onClose}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.inputsStyle}>
          <GomakeTextInput
            type="email"
            value={state.contactMail}
            onChange={(e) => handleChange('contactMail', e.target.value)}
            placeholder={t("sales.quote.contactEmail")}
            error={errors.contactMail}
          />
          <GomakeTextInput
            type="text"
            value={state.contactName}
            onChange={(e) => handleChange('contactName', e.target.value)}
            placeholder={t("sales.quote.contactName")}
            error={errors.contactName}
          />
          <GomakeTextInput
            type="tel"
            value={state.contactPhone}
            onChange={(e) => handleChange('contactPhone', e.target.value)}
            placeholder={t("sales.quote.mobileContact")}
            error={errors.contactPhone}
          />
          <GomakePrimaryButton style={clasess.sendBtn} onClick={onClickAddContact}>
            {t("sales.quote.addNewContact")}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewContactModal };
