import Stack from "@mui/material/Stack";
import {GoMakeAutoComplate} from "@/components";
import {useEffect, useState} from "react";
import {FormInput} from "@/components/form-inputs/form-input";
import {IInput} from "@/components/form-inputs/interfaces";
import {PrimaryButton} from "@/components/button/primary-button";
import {useTranslation} from "react-i18next";
import {getAndSetAllCustomers} from "@/services/hooks";
import {useGomakeAxios, useSnackBar} from "@/hooks";
import {createChatRoomApi} from "@/services/api-service/chat/quick-blox-chat-endpoints";
import {IChatDialog} from "@/widgets/messenger/interfaces/dialog";


interface IProps {
    onAddDialog: (dialog: IChatDialog)=>void;
}

enum EUserType {
    Employee = '1',
    Customer = '2'
}

interface IData {
    userType: EUserType;
    id: string;
    name: string;
    type: number;
}

const INIT_STATE = {
    userType: EUserType.Employee,
    id: '',
    name: '',
    type: 2
};
const AddDialog = ({onAddDialog}: IProps) => {
    const [state, setState] = useState<IData>(INIT_STATE);
    const [customers, setCustomers] = useState<{ label: string; id: string }[]>([]);
    const [customerSearch, setCustomerSearch] = useState<string>('');
    const {t} = useTranslation();
    const {callApi} = useGomakeAxios();
    const {alertSuccessAdded, alertFaultAdded} = useSnackBar();
    const inputs = () => {
        const {t} = useTranslation();
        return [
            {
                name: "messenger.groupName",
                label: "messenger.groupName",
                type: "text",
                placeholder: "messenger.groupName",
                required: true,
                parameterKey: "name",
                value: state.name,
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
                value: state.userType,
                options: [{text: t('messenger.customer'), value: EUserType.Customer}, {text: t('messenger.employee'), value: EUserType.Employee}],
                isValid: true,
            },
            {
                name: "employees",
                label: "messenger.employees",
                type: "select",
                placeholder: "messenger.employees",
                required: true,
                parameterKey: "id",
                value: state.id,
                options: [],
                isValid: true,
                optionsUrl: '/v1/crm-service/employee/get-all-employees',
                disabled: state.userType !== EUserType.Employee
            },
        ]
    };

    const addDialog = async () => {

        const data = {
            name: state.name,
            type: 2,
            receivers: [
                {
                    clientId: state.id,
                    clientType: +state.userType
                }
            ]
        }
        const callBack = res => {
            if (res?.success) {
                alertSuccessAdded();
                onAddDialog(res?.data);
            } else {
                alertFaultAdded();
            }
        };

        await createChatRoomApi(callApi, callBack, data)
    }

    const onChange = (key, value) => {
        setState(prevState => ({
            ...prevState,
            [key]: value
        }))
    }
    const checkWhatRenderArray = (e) => {
        if (e.target.value) {
            setCustomerSearch(e.target.value);
        }
    };
    const [customerId, setCustomerId] = useState<any>();

    useEffect(() => {
        if (customerSearch) {
            getAndSetAllCustomers(callApi, setCustomers, {
                ClientType: "C",
                onlyCreateOrderClients: false,
                searchTerm: customerSearch,
                isOccasionalCustomer: true
            }).then();
        } else {
            setCustomers([])
        }
    }, [customerSearch])
    return (
        <Stack gap={'25px'}>
            {
                inputs()?.map(value => <FormInput input={value as IInput} changeState={onChange} error={false}/>)
            }
            {
                state.userType === EUserType.Customer &&
                <Stack>
                    <GoMakeAutoComplate
                        key={customerId?.id}
                        options={customers}
                        getOptionLabel={(option: any) => `${option.name}`}
                        onChangeTextField={checkWhatRenderArray}
                        placeholder={t("sales.quote.chooseCustomer")}
                        onChange={(e: any, value: any) => {
                            setState(prevState => ({...prevState, id: value.id}))
                        }}
                        value={customerId}
                        withArrow={true}
                    />
                </Stack>
            }
            <PrimaryButton variant={'contained'} onClick={addDialog}>{t('messenger.add')}</PrimaryButton>
        </Stack>
    );
};

export {AddDialog};
