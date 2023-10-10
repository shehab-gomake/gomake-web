
import { getAllTemplatesApi, addNewSmsTemplateGroup , getAllGroupTemplatesApi } from "@/services/api-service/mailing/mailing-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useRecoilState } from "recoil";
import { useSnackBar } from "@/hooks";
import { allSMSTemplateGroupsState, groupModalState, templateGroupState } from "../states/state";
import { MoreMenuWidget } from "./components/more-circle/index";
import { UploadFileInput } from "./components/upload-file/upload-file";




const useMessageTemplate = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded , alertSuccessAdded } = useSnackBar();
  const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);

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
         <UploadFileInput selectedNameFile={"order summary.pdf"}/>,
          <MoreMenuWidget/>
        ]);
        setAllTemplates(tableRows);
      }
    }
    getAllTemplatesApi(callApi, callBackFunction).then();
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
  const onAddDocument = async (templateGroup) => {
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

  return {
    tableHeaders,
    getAllTemplates,
    allTemplates,
    onAddDocument,
    getSMSTemplateGroups
  };
};

export { useMessageTemplate };