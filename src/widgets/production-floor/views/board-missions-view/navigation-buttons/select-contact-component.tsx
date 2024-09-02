import {useStyle} from "@/widgets/machines/components/forms/style";
import {IStepFormProps} from "@/widgets/machines/components/forms/interface";
import {InputContainer} from "@/widgets/machines/components/inputs/input-container";
import React, {useEffect, useState} from "react";
import {Autocomplete, MenuItem, Paper, Popper, Stack} from "@mui/material";
import {FormInput} from "@/components/form-inputs/form-input";
import {PrimaryButton} from "@/components/button/primary-button";
import {getDocumentContactsApi} from "@/services/api-service/documents/documents-service-api";
import {useGomakeAxios} from "@/hooks";
import {useRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {GoMakeAutoComplate} from "@/components";
import TextField from "@mui/material/TextField";
import {useTranslation} from "react-i18next";
import {styled} from "@mui/material/styles";

const StyledPopper = styled(Popper)({
    zIndex: 999999999999999999999999999999999999, // Set your desired zIndex value here
});
// const contactIdInput = (state: IContact, contacts: IContact[]) => {
//     return [
//         {
//             name: "contactId",
//             label: "productionFloor.selectContact",
//             type: "select",
//             placeholder: "productionFloor.selectContact",
//             required: true,
//             parameterKey: "contactID",
//             value: '',
//             options: [{value: 'pph', text: 'PPH'}, {value: 'cellsSetsPH', text: 'Cells sets PH'}],
//             machineInputType: 'input',
//             isValid: true,
//         },
//     ]
// }
// const contactDetailsInputs = (state) => {
//     return [
//         {
//             name: "email",
//             label: "productionFloor.email",
//             type: "text",
//             placeholder: "productionFloor.email",
//             required: true,
//             parameterKey: "email",
//             options: [],
//             value: state.email ? state.email : ''
//         },
//         {
//             name: "phone",
//             label: "productionFloor.phone",
//             type: "phone",
//             placeholder: "productionFloor.phone",
//             required: true,
//             parameterKey: "phone",
//             options: [],
//             value: state.email ? state.email : ''
//         },
//     ]
// }
//
interface IContact {
    id: string;
    contactID: string;
    contactName: string;
    contactMail: string;
    contactPhone: string;
    label: string;
}

const SelectContactComponent = () => {
    const [selectedContact, setSelectedContacts] = useState<IContact>({} as IContact);
    const [contacts, setContacts] = useState<IContact[]>([]);
    const {callApi} = useGomakeAxios();
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const {t} = useTranslation();
    const onChange = (key, value) => {
        setSelectedContacts({
            ...selectedContact,
            [key]: value
        })
    }

    const getDocumentContacts = async () => {
        const callBack = (res) => {
            if (res.success) {
                setContacts(res.data);
            }
        }
        await getDocumentContactsApi(callApi, callBack, boardMissions.orderId);
    }

    useEffect(() => {
        getDocumentContacts().then();
    }, [])

    return (
        <Stack zIndex={2} height={'100%'} justifyContent={"space-between"} marginTop={'10px'} paddingBottom={'10px'}>
            <Stack gap={'100px'}>
                <GoMakeAutoComplate
                    options={contacts?.map(o => ({...o, label: o.contactName}))}
                    getOptionLabel={(option: any) => `${option.contactName}`}
                    placeholder={t("")}
                    onChange={(e: any, value: any) => {
                        setSelectedContacts(value)
                    }}
                    value={selectedContact.contactID ? selectedContact.contactID : ''}
                    withArrow={true}

                />
                {/*<GoMakeAutoComplate options={['sss', 'ssss']}/>*/}
                {/*{*/}
                {/*    contacts.map(c => <span>{c.contactName}</span>)*/}
                {/*}*/}
            </Stack>
            <Stack direction={"row"} gap={'10px'}>
                {/*{*/}
                {/*    contactDetailsInputs(selectedContact).map((property: any) => {*/}
                {/*        return <FormInput key={property.parameterKey} input={property}*/}
                {/*                               changeState={onChange}*/}
                {/*                               error={false}/>*/}
                {/*    })*/}
                {/*}*/}
            </Stack>
            <Stack direction={'row'} justifyContent={"space-between"} gap={'10px'}>
                <PrimaryButton variant={'outlined'}>cancel</PrimaryButton>
                <PrimaryButton variant={'contained'}>send</PrimaryButton>
            </Stack>

        </Stack>
    )
}

export {SelectContactComponent};