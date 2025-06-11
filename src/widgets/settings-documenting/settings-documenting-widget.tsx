import { useTranslation } from "react-i18next";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { DocumentNumbering } from "./documentNumbering/document-numbering-settings";
import { DocumentDesignSetting } from "./documentDesign/document-design-settings";
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";
import { useResetRecoilState } from "recoil";
import { documentDesignState } from "./state/documents-state";
import Head from "next/head";

const SettingsDocumentingWidget = () => {
  const { t } = useTranslation();
  const { CheckPermission } = useUserPermission();
  const resetDocumentDesign = useResetRecoilState(documentDesignState);

  const onSelectTab = (index: number) => {
    index === 0 && resetDocumentDesign();
  };

  const tabs: ITab[] = [
    CheckPermission(Permissions.SHOW_DOCUMENT_NUMBERING) && {
      title: t("documentingSettings.documentNumbering"),
      component: <DocumentNumbering />,
    },
    CheckPermission(Permissions.SHOW_DOCUMENT_DESIGN) && {
      title: t("documentingSettings.documentDesign"),
      component: <DocumentDesignSetting />,
    },
  ];

  return (
      <>
        <Head>
          <title>{t("settings.documenting")}</title>
        </Head>
        <PrimaryTabsComponent tabs={tabs} onSelectTab={onSelectTab} />
      </>
  );
};

export { SettingsDocumentingWidget };
