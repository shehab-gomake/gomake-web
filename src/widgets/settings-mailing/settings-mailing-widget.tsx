import { useTranslation } from "react-i18next";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { EmptyComponent } from "../settings/empty-component";
import { MessageTemplates } from "./messageTemplates/message-templates";
import { AddButton } from "@/components/button/add-button";
import { GoMakeModal } from "@/components";
import { AddNewSMSTemplateGroup } from "./messageTemplates/components/add-new/add-new";
import { useRecoilState } from "recoil";
import { editModalState, groupModalState, smsTemplateState, templateGroupState } from "./states/state";
import { useMessageTemplate } from "./useMessageTemplate";
import { SMSTemplateGroup } from "./messageTemplates/interfaces/interface";
import { useEffect  } from "react";
import { EmailSettings } from "./messageTemplates/components/mail-editor/mail-editor";

const SettingsMailingWidget = () => {
    const { t } = useTranslation();
    const {onAddSMSTemplateGroup , onUpdateSmsTemplate , getSMSTemplateGroups , getTemplateVariables} = useMessageTemplate();
    const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);
    const [openEditModal, setOpenEditModal] = useRecoilState<boolean>(editModalState);
    const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);
    const [state, setState] = useRecoilState<any>(smsTemplateState);

    const tabs: ITab[] = [
        { title: t("mailingSettings.messageTemplates"), component: <MessageTemplates/> },
    ];

    useEffect(() => {
        // SMS Group select
        setTemplateGroup(null);
        getSMSTemplateGroups();
        getTemplateVariables();

    }, [])

    return (
        <div>
            <PrimaryTabsComponent tabs={tabs} >
                     <AddButton label={t("mailingSettings.addNew")} onClick={() => setOpenModal(true)} />
            </PrimaryTabsComponent>
            <GoMakeModal
                insideStyle={{ paddingLeft: 20, padding: 20, width: "518px", height: "214px" }}
                openModal={openModal}
                onClose={() => {setOpenModal(false), setTemplateGroup(null)}}
                modalTitle={t("mailingSettings.addNewGroup")}>
                <AddNewSMSTemplateGroup onClickAdd={onAddSMSTemplateGroup} />
            </GoMakeModal>
            <GoMakeModal
                insideStyle={{paddingLeft: 20, paddingRight: 20}}
                openModal={openEditModal}
                onClose={() => {setOpenEditModal(false); setState(null)}}
                modalTitle={t("mailingSettings.emailType") + " " + (state?.templateTypeId || "")}>
                <EmailSettings onClickSave={onUpdateSmsTemplate}/>
            </GoMakeModal>
        </div>

    );
};

export { SettingsMailingWidget };
