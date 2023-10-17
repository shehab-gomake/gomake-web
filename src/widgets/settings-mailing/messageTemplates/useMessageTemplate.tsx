
import { getAllTemplatesApi, addNewSmsTemplateGroup, getAllGroupTemplatesApi, deleteSmsTemplateApi, updateSmsTemplateApi } from "@/services/api-service/mailing/mailing-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useRecoilState } from "recoil";
import { useSnackBar } from "@/hooks";
import { allSMSTemplateGroupsState, editModalState, groupModalState, templateGroupState } from "../states/state";
import { MoreMenuWidget } from "./components/more-circle/index";
import { UploadFileInput } from "./components/upload-file/upload-file";

const useMessageTemplate = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded, alertFaultDelete, alertSuccessDelete, alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);
  const [openEditorModal, setOpenEditorModal] = useRecoilState<boolean>(editModalState);


  const tableHeaders = [
    t("mailingSettings.type"),
    t("mailingSettings.subject"),
    t("mailingSettings.body"),
    t("mailingSettings.attachment"),
    t("mailingSettings.more"),
  ];

  // data table 
  const [allTemplates, setAllTemplates] = useState<any>();
  const getAllTemplates = () => {
    const callBackFunction = (data) => {
      if (data.success) {
        const tableRows = data.data?.map((document) => [
          document.type,
          document.subject,
          document.body,
          // <UploadFileInput selectedNameFile={document.file}/>,
          <UploadFileInput />,
          <MoreMenuWidget item={document} onClickDelete={onDeleteDocument} />
        ]);
        setAllTemplates(tableRows);
      }
    }
    getAllTemplatesApi(callApi, callBackFunction).then();
  }



  // onDeleteFunction
  const onDeleteDocument = async (smsTemplate) => {
    const callback = (data) => {
      if (data.success) {
        alertSuccessDelete();
        getAllTemplates();
      } else {
        alertFaultDelete();
      }
    }
    await deleteSmsTemplateApi(callApi, callback, smsTemplate);
  }



  // select options 
  const [allSMSTemplateGroups, setAllSMSTemplateGroups] = useRecoilState<any>(allSMSTemplateGroupsState);
  const getSMSTemplateGroups = () => {
    const callBackFunction = (data) => {
      if (data.success) {
        setAllSMSTemplateGroups(data.data);
      }
    }
    getAllGroupTemplatesApi(callApi, callBackFunction).then();
  }

  // add new group
  const onAddSmsTemplateGroup = async (templateGroup) => {
    const callback = (data) => {
      if (data.success) {
        alertSuccessAdded();
        setOpenModal(!openModal);
        getSMSTemplateGroups();
      } else {
        alertFaultAdded();
      }
    }
    await addNewSmsTemplateGroup(callApi, callback, templateGroup);
  }


  // save button or edit template
  const onUpdateSmsTemplate = async (smsTemplate) => {
    const callback = (data) => {
      if (data.success) {
        alertSuccessUpdate();
        setOpenModal(!openModal);
        getSMSTemplateGroups();
      } else {
        alertFaultUpdate();
      }
    }
    await updateSmsTemplateApi(callApi, callback, smsTemplate);
  }

  return {
    tableHeaders,
    getAllTemplates,
    allTemplates,
    onAddSmsTemplateGroup,
    getSMSTemplateGroups,
    onUpdateSmsTemplate
  };
};

export { useMessageTemplate };