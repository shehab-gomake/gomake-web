import{ useState } from "react";
import { CircularProgress, MenuItem, Paper, Stack } from "@mui/material";
import { FormInput } from "@/components/form-inputs/form-input";
import { PrimaryButton } from "@/components/button/primary-button";
import { GoMakeModal, GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { FONT_FAMILY } from "@/utils/font-family";

const contactDetailsInputs = (state: IContact) => {
    return [
        {
            name: "email",
            label: "usersSettings.email",
            type: "text",
            placeholder: "usersSettings.email",
            required: true,
            parameterKey: "contactMail",
            options: [],
            value: state.contactMail ? state.contactMail : ''
        },
        {
            name: "phone",
            label: "usersSettings.phone",
            type: "phone",
            placeholder: "usersSettings.phone",
            required: true,
            parameterKey: "contactPhone",
            options: [],
            value: state.contactPhone ? state.contactPhone : ''
        },
    ]
}

export interface IContact {
    id: string;
    contactID: string;
    contactName: string;
    contactMail: string;
    contactPhone: string;

}
interface IProps {
    openModal: boolean;
    onClose: () => void;
    contacts: IContact[];
    onSend: (contact, setLoading)=>void;
}

const SelectContactComponent = ({ openModal, onClose, contacts, onSend }: IProps) => {
    const [selectedContact, setSelectedContacts] = useState<IContact>({} as IContact);
    const [open, setOpen] = useState<boolean>(false);
    const [contactsFilter, setContactsFilter] = useState<string>('');
    const { t } = useTranslation();
    const [loading, setLoading] = useState<boolean>(false);
    const onChange = (key, value) => {
        setSelectedContacts({
            ...selectedContact,
            [key]: value
        })
    }

    const onContactsInputChange = (e) => {
        setOpen(true)
        setContactsFilter(e.target.value);
    }

    const onContactClick = (contact: IContact) => {
        setSelectedContacts(contact);
        setContactsFilter(contact.contactName);
        setOpen(false)
    }
    const handelCloseModal = () => {
        setSelectedContacts({} as IContact);
        setContactsFilter('');
        onClose();
    }
    return (
        <GoMakeModal style={{ zIndex: 999999 }} insideStyle={{ width: '440px', height: '350px' }}
            openModal={openModal}
            onClose={handelCloseModal} modalTitle={t('prePayment.selectContact')}>
            <Stack zIndex={2} height={'100%'} justifyContent={"space-between"} padding={'10px 0px'}>
                <Stack gap={'7px'}>
                    <span style={{ ...FONT_FAMILY.Inter(500, 14), color: '#344054' }}>{t('customers.modal.contacts')}</span>
                    <div style={{ position: 'relative' }}>
                        <GomakeTextInput placeholder={t('prePayment.selectContact')} style={{ height: '40px' }} value={contactsFilter}
                            onChange={onContactsInputChange}
                            onClick={() => setOpen(!open)} />
                        {
                            !!open && <ClickOutside onClick={() => setOpen(false)}>
                                <Paper sx={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
                                    {
                                        (!!contactsFilter ? contacts?.filter(c => c.contactName?.toLowerCase()?.includes(contactsFilter?.toLowerCase())) : contacts).map(contact =>
                                            <MenuItem onClick={() => onContactClick(contact)}>
                                                {contact.contactName}
                                            </MenuItem>)
                                    }
                                </Paper>
                            </ClickOutside>
                        }
                    </div>
                </Stack>
                <Stack direction={"row"} gap={'10px'}>
                    {
                        contactDetailsInputs(selectedContact).map((property: any) => {
                            return <FormInput key={property.parameterKey} input={property}
                                changeState={onChange}
                                error={false} />
                        })
                    }
                </Stack>
                <Stack direction={'row'} justifyContent={"space-between"} gap={'10px'}>
                    <PrimaryButton onClick={onClose} disabled={loading} variant={'outlined'}>{t('modal.cancel')}</PrimaryButton>
                    <PrimaryButton onClick={()=>onSend(selectedContact, setLoading)} disabled={loading}
                        variant={'contained'}>{loading ?
                            <CircularProgress size={'20px'} /> : t('login.send')}</PrimaryButton>
                </Stack>
            </Stack>
        </GoMakeModal>
    )
}

export { SelectContactComponent };