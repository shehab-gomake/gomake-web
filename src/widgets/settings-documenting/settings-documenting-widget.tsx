import { useTranslation } from "react-i18next";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { DocumentNumbering } from "./documentNumbering/document-numbering-settings";
import { EmptyComponent } from "@/widgets/settings/empty-component";
import { DocumentDesign } from "./documentDesign/document-design-settings";

const SettingsDocumentingWidget = () => {
    const { t } = useTranslation();
    const tabs: ITab[] = [
        { title: t("documentingSettings.documentNumbering"), component: <DocumentNumbering/> },
        { title: t("documentingSettings.documentDesign"), component: <DocumentDesign/> }
    ];
    return (
        <div>
            <PrimaryTabsComponent tabs={tabs} />
        </div>
    );
};

export { SettingsDocumentingWidget };
