import { useTranslation } from "react-i18next";
import {
  GoMakeModal, GomakePrimaryButton, GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useRecoilState } from "recoil";
import { quoteItemState } from "@/store";
import { useState } from "react";
import { addCustomerContactApi, addDocumentContactApi } from "@/services/api-service/generic-doc/documents-api";
import { PhoneInputComponent } from "@/components/form-inputs/phone-input";
import { useRouter } from "next/router";
import { v4 as uuid } from "uuid";

const AddNewContactModal = ({ openModal, onClose, getQuote, getAllClientContacts, documentType }) => {
  const { callApi } = useGomakeAxios();
  const router = useRouter();
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [state, setState] = useState({
    contactMail: "",
    contactName: "",
    contactPhone: ""
  });

  const { alertSuccessAdded, alertFaultAdded, alertFault } = useSnackBar();
  const [errors, setErrors] = useState<any>({});
  const validateInput = () => {
    let tempErrors: any = {};

    // Validate that either contactMail or contactPhone is provided
    if (!state.contactMail && !state.contactPhone) {
      tempErrors.contactPhone = t("validation.phoneOrEmailReq");
      tempErrors.contactMail = t("validation.phoneOrEmailReq");
    } else if (state.contactMail && !/\S+@\S+\.\S+/.test(state.contactMail)) {
      tempErrors.contactMail = t("validation.invalidEmail");
    }

    // Validate contactName
    if (!state.contactName) {
      tempErrors.contactName = t("validation.nameRequired");
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
      setState({
        contactMail: "",
        contactName: "",
        contactPhone: ""
      })
      setErrors({})
      onClose()
    }
    else {
      alertFault(t("products.offsetPrice.admin.errorReq"))
      // alertFaultAdded()
    }
  };

  const addNewContactNew = async (contactID) => {
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        getQuote();
      } else {
        alertFaultAdded();
      }
    }
    await addDocumentContactApi(callApi, callBack, {
      documentType: documentType,
      contact:
      {
        contactID: contactID,
        contactName: state.contactName,
        contactMail: state.contactMail,
        contactPhone: state.contactPhone,
        documentID: quoteItemValue?.id,
      }
    })
  }

  const createNewContactNew = async () => {
    const callBack = (res) => {
      if (res?.success) {
        if (!router.query.isNewCreation) {
          getQuote();
          addNewContactNew(res?.data)
          getAllClientContacts()
          alertSuccessAdded();
        }
        else {
          getAllClientContacts()
          const newContact = {
            id: uuid(),
            contactName: state.contactName,
            contactMail: state.contactMail,
            contactPhone: state.contactPhone,
          };
          setQuoteItemValue(prevValue => ({
            ...prevValue,
            documentContacts: [...prevValue.documentContacts, newContact]
          }));
          alertSuccessAdded();
        }

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
        onClose={() => {
          setState({
            contactMail: "",
            contactName: "",
            contactPhone: ""
          })
          setErrors({})
          onClose()
        }}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.inputsStyle}>
          <GomakeTextInput
            type="text"
            value={state.contactName}
            onChange={(e) => handleChange('contactName', e.target.value)}
            placeholder={t("sales.quote.contactName")}
            error={errors.contactName}
            labelText={t("sales.quote.contactName")}
          />
          {
            errors?.contactName && <div style={{ fontSize: 12, color: "red" }}>{errors?.contactName}</div>
          }
          <GomakeTextInput
            type="email"
            value={state.contactMail}
            onChange={(e) => handleChange('contactMail', e.target.value)}
            placeholder={t("sales.quote.contactEmail")}
            error={errors.contactMail}
            labelText={t("sales.quote.contactEmail")}
          />
          {
            errors?.contactMail && <div style={{ fontSize: 12, color: "red" }}>{errors?.contactMail}</div>
          }

          <PhoneInputComponent
            onChange={(e) => handleChange('contactPhone', e)}
            value={state.contactPhone}
            placeholder={t("sales.quote.contactPhone")}
            customStyle={{ width: '100%', minWidth: 515 }}
            autoFocus={true}
            labelText={t("sales.quote.contactPhone")}

          />
          {
            errors?.contactPhone && <div style={{ fontSize: 12, color: "red" }}>{errors?.contactPhone}</div>
          }
          <GomakePrimaryButton style={clasess.sendBtn} onClick={onClickAddContact}>
            {t("sales.quote.addNewContact")}
          </GomakePrimaryButton>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddNewContactModal };
