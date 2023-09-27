import { useTranslation } from "react-i18next";
import { PrimaryTabsComponent } from "@/components/tabs/primary-tabs";
import { ITab } from "@/components/tabs/interface";
import { DocumentNumbering } from "./documentNumbering/document-numbering-settings";
import { EmptyComponent } from "@/widgets/settings/empty-component";
import { GoMakeModal } from "@/components";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { editDocumentInputs } from "./documentNumbering/inputs/edit-modal-inputs";
import { useDocuments } from "./documentNumbering/use-documents-numbers";

const SettingsDocumentingWidget = () => {
    const { t } = useTranslation();
    const {classes} = useStyle();
    const { openModal , setOpenModal , document , setDocument} = useDocuments();

    const tabs: ITab[] = [
        { title: t("documentingSettings.documentNumbering"), component: <DocumentNumbering/> },
        { title: t("documentingSettings.documentDesign"), component: <EmptyComponent/> }
    ];

    const onChangeInputs = (key, value) => {
        setDocument({ ...document, [key]: value })
      }

    return (
        <div>
            <PrimaryTabsComponent tabs={tabs} />
            <GoMakeModal
                insideStyle={classes.insideStyle}
                headerPadding={20}
                openModal={openModal}
                onClose={() => setOpenModal(false)}
                modalTitle={t("documentingSettings.editDefinition")}
            >
        <Stack direction={'row'} gap={"19px"} padding={2}>
          {
            editDocumentInputs(document).map(item =><FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
          }
        </Stack>
            </GoMakeModal>
        </div>
    );
};


export { SettingsDocumentingWidget };
