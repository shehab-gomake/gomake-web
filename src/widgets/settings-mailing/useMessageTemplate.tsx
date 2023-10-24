
import { getAllSMSTemplatesApi,  updateSMSTemplateApi, addSMSTemplateGroup, getAllSMSTemplatesGroupsApi } from "@/services/api-service/mailing/mailing-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useRecoilState } from "recoil";
import { useSnackBar } from "@/hooks";
import { allSMSTemplateGroupsState, editModalState, groupIdState, groupModalState, templateGroupState } from "./states/state";
import { MoreMenuWidget } from "./messageTemplates/components/more-circle/index";
import { PdfUploadComponent } from "./messageTemplates/components/upload-file/upload-file";

const useMessageTemplate = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded, alertFaultDelete, alertSuccessDelete, alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);
  const [openEditorModal, setOpenEditorModal] = useRecoilState<boolean>(editModalState);
  const [smsTemplatesGroupId, setSmsTemplatesGroupId] = useRecoilState<any>(groupIdState)

  const tableHeaders = [
    t("mailingSettings.type"),
    t("mailingSettings.subject"),
    t("mailingSettings.body"),
    t("mailingSettings.attachment"),
    t("mailingSettings.more"),
  ];

  // data table need fix
  const [allSmsTemplates, setAllSmsTemplates] = useState<any>();
  const getAllSmsTemplates = () => {
    const callBackFunction = (data) => {
      if (data.success) {
        const tableRows = data.data?.map((template) => [
          template.templateTypeId,
          template.title,
          template.text,
          // <UploadFileInput selectedNameFile={document.file}/>,
          <PdfUploadComponent />,
          <MoreMenuWidget item={template} onClickDelete={null} />
        ]);
        setAllSmsTemplates(tableRows);
      }
    }
    getAllSMSTemplatesApi(callApi, callBackFunction , { SMSTemplatesGroupId: smsTemplatesGroupId}).then();
  }

  // select options 
  const [allSMSTemplateGroups, setAllSMSTemplateGroups] = useRecoilState<any>(allSMSTemplateGroupsState);
  const getSMSTemplateGroups = () => {
    const callBackFunction = (data) => {
      if (data.success) {
        setAllSMSTemplateGroups(data.data);
      }
    }
    getAllSMSTemplatesGroupsApi(callApi, callBackFunction).then();
  }

  // add new group
 const onAddSMSTemplateGroup = async (templateGroup) => {
  const callback = (data) => {
    if (data.success) {
      alertSuccessAdded();
      setOpenModal(!openModal);
      getSMSTemplateGroups();
    } else {
      alertFaultAdded();
    }
  }
  await addSMSTemplateGroup(callApi, callback, templateGroup);
}


  // save changes
  const onUpdateSmsTemplate = async (smsTemplate) => {
    const callback = (data) => {
      if (data.success) {
        alertSuccessUpdate();
        setOpenModal(!openModal);
       // getAllSmsTemplates();
      } else {
        alertFaultUpdate();
      }
    }
    await updateSMSTemplateApi(callApi, callback, smsTemplate);
  }

  return {
    tableHeaders,
    onAddSMSTemplateGroup,
    onUpdateSmsTemplate,
    getAllSmsTemplates,
    allSmsTemplates,
    getSMSTemplateGroups
  };
};

export { useMessageTemplate };