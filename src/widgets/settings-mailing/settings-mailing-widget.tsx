import { useTranslation } from "react-i18next";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { EmptyComponent } from "../settings/empty-component";
import { TemplateSettings } from "./messageTemplates/message-templates";
import { AddButton } from "@/components/button/add-button";
import { GoMakeModal } from "@/components";
import { AddNewSMSTemplateGroup } from "./messageTemplates/components/add-new/add-new";
import { useRecoilState } from "recoil";
import { groupModalState, templateGroupState } from "./states/state";
import { useMessageTemplate } from "./messageTemplates/useMessageTemplate";
import { SMSTemplateGroup } from "./messageTemplates/interfaces/interface";
import { useEffect } from "react";

const SettingsMailingWidget = () => {
    const { t } = useTranslation();
    const {onAddDocument , getSMSTemplateGroups } = useMessageTemplate();
    const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);
    const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);

    const tabs: ITab[] = [
        { title: t("mailingSettings.messageTemplates"), component: <TemplateSettings /> },
        { title: t("mailingSettings.whatsappSetting"), component: <EmptyComponent /> }
    ];

    useEffect(() => {
        // SMS Group select
        getSMSTemplateGroups();
    }, [])

    return (
        <div>
            <PrimaryTabsComponent tabs={tabs} >
                <AddButton label={t("mailingSettings.addNew")} onClick={() => setOpenModal(true)} />
            </PrimaryTabsComponent>
            <GoMakeModal
                insideStyle={{ paddingLeft: 20, padding: 20, width: "518px", height: "214px" }}
                headerPadding={20}
                openModal={openModal}
                onClose={() => {setOpenModal(false) , setTemplateGroup(null)}}
                modalTitle={t("mailingSettings.addNewGroup")}>
                <AddNewSMSTemplateGroup onClickAdd={onAddDocument}/>
            </GoMakeModal>
        </div>

    );
};

export { SettingsMailingWidget };
