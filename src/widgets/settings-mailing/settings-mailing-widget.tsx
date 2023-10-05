import { useTranslation } from "react-i18next";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { EmptyComponent } from "../settings/empty-component";
import { TemplateSettings } from "./messageTemplates/message-templates";
import { AddButton } from "@/components/button/add-button";
import { GoMakeModal } from "@/components";
import { AddNewSMSTemplateGroup } from "./messageTemplates/components/add-new/add-new";
import { useRecoilState } from "recoil";
import { groupModalState } from "./states/state";

const SettingsMailingWidget = () => {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);
    const tabs: ITab[] = [
        { title: t("mailingSettings.messageTemplates"), component: <TemplateSettings /> },
        { title: t("mailingSettings.whatsappSetting"), component: <EmptyComponent /> }
    ];

    return (
        <div>
            <PrimaryTabsComponent tabs={tabs} >
                <AddButton label={t("mailingSettings.addNew")} onClick={() => setOpenModal(true)} />
            </PrimaryTabsComponent>
            <GoMakeModal
                insideStyle={{ paddingLeft: 20, padding: 20, width: "518px", height: "214px" }}
                headerPadding={20}
                openModal={openModal}
                onClose={() => setOpenModal(false)}
                modalTitle={t("mailingSettings.addNewGroup")}>
                <AddNewSMSTemplateGroup onClickAdd={()=>alert("Test test")}/>
            </GoMakeModal>
        </div>

    );
};

export { SettingsMailingWidget };
