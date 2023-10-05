
import { getAllTemplatesApi, addNewSmsTemplateGroup } from "@/services/api-service/mailing/mailing-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useRecoilState } from "recoil";
import { useSnackBar } from "@/hooks";
import { groupModalState, templateGroupState } from "../states/state";

const useMessageTemplate = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
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
          document.body
        ]);
        setAllTemplates(tableRows);
      }
    }
    getAllTemplatesApi(callApi, callBackFunction).then();
  }


  // add new group
  const onAddDocument = async (templateGroup) => {
    const callback = (data) => {
      if (data.success) {
        alertSuccessUpdate();
        getAllTemplates();
        setOpenModal(!openModal)
      } else {
        alertFaultUpdate();
      }
    }
    await addNewSmsTemplateGroup(callApi, callback, templateGroup);
  }


  return {
    tableHeaders,
    getAllTemplates,
    allTemplates,
    onAddDocument
  };
};

export { useMessageTemplate };