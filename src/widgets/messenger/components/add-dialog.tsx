import Stack from "@mui/material/Stack";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { useEffect, useState } from "react";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { PrimaryButton } from "@/components/button/primary-button";
import { useTranslation } from "react-i18next";
import {
  getAndSetAllCustomers,
  getAndSetClientContacts,
} from "@/services/hooks";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { createChatRoomApi } from "@/services/api-service/chat/quick-blox-chat-endpoints";
import { IChatDialog } from "@/widgets/messenger/interfaces/dialog";
import {
  IContact,
  SelectContactComponent,
} from "@/widgets/production-floor/views/board-missions-view/navigation-buttons/select-contact-component";

interface IProps {
  onAddDialog: (dialog: IChatDialog) => void;
  openModal: boolean;
  onCloseModal: () => void;
}

enum EUserType {
  Employee = "1",
  Customer = "2",
}

interface IData {
  userType: EUserType;
  id: string;
  name: string;
  type: number;
}

const INIT_STATE = {
  userType: EUserType.Employee,
  id: "",
  name: "",
  type: 2,
};
const AddDialog = ({ onAddDialog, onCloseModal, openModal }: IProps) => {
  const [state, setState] = useState<IData>(INIT_STATE);
  const [customers, setCustomers] = useState<{ label: string; id: string }[]>(
    []
  );
  const [customerSearch, setCustomerSearch] = useState<string>("");
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertSuccessAdded, alertFaultAdded } = useSnackBar();
  const [customerId] = useState<string>("");
  const [openContactsModal, setOpenModalContacts] = useState<boolean>(false);
  const [contacts, setContacts] = useState<
    {
      id: string;
      clientId: string;
      mail: string;
      name: string;
      phone: string;
    }[]
  >([]);

  const inputs = () => {
    const { t } = useTranslation();
    return [
      {
        name: "messenger.groupName",
        label: "messenger.groupName",
        type: "text",
        placeholder: "messenger.groupName",
        required: true,
        parameterKey: "name",
        value: state.name ? state.name : "",
        options: [],
        isValid: true,
      },
      {
        name: "userType",
        label: "messenger.userType",
        type: "select",
        placeholder: "messenger.userType",
        required: true,
        parameterKey: "userType",
        value: state.userType ? state.userType : "",
        options: [
          { text: t("messenger.customer"), value: EUserType.Customer },
          {
            text: t("messenger.employee"),
            value: EUserType.Employee,
          },
        ],
        isValid: true,
      },
      {
        name: "employees",
        label: "messenger.employees",
        type: "select",
        placeholder: "messenger.employees",
        required: true,
        parameterKey: "id",
        value: state.id ? state.id : "",
        options: [],
        isValid: true,
        optionsUrl: "/v1/crm-service/employee/get-all-employees",
        disabled: state.userType !== EUserType.Employee,
      },
    ];
  };

  const onCloseAddDialogModal = () => {
    setCustomers([]);
    setCustomerSearch("");
    setState(INIT_STATE);
    setContacts([]);
    onCloseModal();
  };
  const onCloseContactModal = () => {
    setCustomers([]);
    setCustomerSearch("");
    setState(INIT_STATE);
    setContacts([]);
    setOpenModalContacts(false);
  };

  const addDialog = async () => {
    if (state.userType === EUserType.Customer) {
      await getAndSetClientContacts(callApi, setContacts, {
        ClientId: state.id,
      });
      onCloseModal();
      setOpenModalContacts(true);
      return;
    }
    const data = {
      name: state.name,
      type: 2,
      receivers: [
        {
          clientId: state.id,
          clientType: +state.userType,
        },
      ],
    };
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        onAddDialog(res?.data);
        onCloseAddDialogModal();
      } else {
        alertFaultAdded();
      }
    };

    await createChatRoomApi(callApi, callBack, data);
  };

  const addCustomerDialog = async (contact: IContact) => {
    const data = {
      name: state.name,
      type: 2,
      receivers: [
        {
          clientId: state.id,
          clientType: +state.userType,
          phone: contact.contactPhone,
          email: contact.contactMail,
        },
      ],
    };
    const callBack = (res) => {
      if (res?.success) {
        alertSuccessAdded();
        setOpenModalContacts(false);
        onAddDialog(res?.data);
      } else {
        alertFaultAdded();
      }
    };

    await createChatRoomApi(callApi, callBack, data);
  };

  const onChange = (key, value) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const checkWhatRenderArray = (e) => {
    if (e.target.value) {
      setCustomerSearch(e.target.value);
    }
  };

  useEffect(() => {
    if (customerSearch) {
      getAndSetAllCustomers(callApi, setCustomers, {
        clientType: "C",
        onlyCreateOrderClients: false,
        searchTerm: customerSearch,
        isOccasionalCustomer: true,
      }).then();
    } else {
      setCustomers([]);
    }
  }, [customerSearch]);
  return (
    <>
      <GoMakeModal
        insideStyle={{ width: "600px", height: "fit-content" }}
        openModal={openModal}
        onClose={onCloseAddDialogModal}
        modalTitle={t("messenger.addDialogModalTitle")}
      >
        <Stack gap={"25px"}>
          {inputs()?.map((value) => (
            <FormInput
              input={value as IInput}
              changeState={onChange}
              error={false}
            />
          ))}
          {state.userType === EUserType.Customer && (
            <Stack>
              <GoMakeAutoComplate
                key={customerId}
                options={customers}
                getOptionLabel={(option: any) => `${option.name}`}
                onChangeTextField={checkWhatRenderArray}
                placeholder={t("sales.quote.chooseCustomer")}
                onChange={(e: any, value: any) => {
                  setState((prevState) => ({ ...prevState, id: value?.id }));
                }}
                value={state.id ? state.id : ""}
                withArrow={true}
              />
            </Stack>
          )}
          <PrimaryButton variant={"contained"} onClick={addDialog}>
            {t("messenger.add")}
          </PrimaryButton>
        </Stack>
      </GoMakeModal>

      <SelectContactComponent
        onSend={addCustomerDialog}
        contacts={contacts.map((c) => ({
          id: c.id,
          contactID: c.clientId,
          contactName: c.name,
          contactMail: c.mail,
          contactPhone: c.phone,
        }))}
        openModal={openContactsModal}
        onClose={onCloseContactModal}
      />
    </>
  );
};

export { AddDialog };
