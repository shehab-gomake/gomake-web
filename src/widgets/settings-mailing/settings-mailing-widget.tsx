import { useTranslation } from "react-i18next";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { MessageTemplates } from "./messageTemplates/message-templates";
import { AddButton } from "@/components/button/add-button";
import { GoMakeModal } from "@/components";
import { AddNewSMSTemplateGroup } from "./messageTemplates/components/add-new/add-new";
import { editModalState, groupModalState, smsBodyState, smsSubjectState, smsTemplateState, templateGroupStateNew } from "./states/state";
import { useMessageTemplate } from "./useMessageTemplate";
import { useEffect  } from "react";
import { EmailSettings } from "./messageTemplates/components/mail-editor/mail-editor";
import { ISMSTemplate, SMSTemplateGroup } from "./messageTemplates/interfaces/interface";
import { useRecoilState , useSetRecoilState} from "recoil";

const SettingsMailingWidget = () => {
    const { t } = useTranslation();
    const {onAddSMSTemplateGroup , onUpdateSmsTemplate , getSMSTemplateGroups , getTemplateVariables , setTemplateGroup , types , getSMSTemplateTypes } = useMessageTemplate();
    const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);
    const [openEditModal, setOpenEditModal] = useRecoilState<boolean>(editModalState);
    const [state, setState] = useRecoilState<ISMSTemplate>(smsTemplateState);
    const setSubject = useSetRecoilState<string>(smsSubjectState);
    const setBody = useSetRecoilState<string>(smsBodyState)
    const setNewTemplateGroup = useSetRecoilState<SMSTemplateGroup>(templateGroupStateNew);

    const tabs: ITab[] = [
        { title: t("mailingSettings.messageTemplates"), component: <MessageTemplates/> },
    ];

    useEffect( () => {
        setTemplateGroup(null);
        getSMSTemplateGroups();
        getTemplateVariables();
        getSMSTemplateTypes();
    }, [])

    const templateTitle = types.find((option) => option.value == state?.templateType)?.text || " ";

    return (
        <div >
            <PrimaryTabsComponent tabs={tabs} >
                     <AddButton label={t("mailingSettings.addNew")} onClick={() => setOpenModal(true)} />
            </PrimaryTabsComponent>
            <GoMakeModal
                insideStyle={{ paddingLeft: 20, padding: 20, width: "518px", height: "214px" }}
                openModal={openModal}
                onClose={() => {setOpenModal(false), setNewTemplateGroup(null)}}
                modalTitle={t("mailingSettings.addNewGroup")}>
                <AddNewSMSTemplateGroup onClickAdd={onAddSMSTemplateGroup} />
            </GoMakeModal>
            <GoMakeModal
                insideStyle={{paddingLeft: 20, padding: 20, gap: "15px" ,width: "852px"}}
                openModal={openEditModal}
                onClose={() => {setOpenEditModal(false); setState(null); setSubject(""); setBody("")}}
                modalTitle={t("mailingSettings.emailType") + " / " + templateTitle}>
                <EmailSettings onClickSave={onUpdateSmsTemplate}/>
            </GoMakeModal>
        </div>

    );
};

export { SettingsMailingWidget };
