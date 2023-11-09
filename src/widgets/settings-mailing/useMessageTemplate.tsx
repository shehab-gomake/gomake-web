
import { getAllSMSTemplatesApi, updateSMSTemplateApi, addSMSTemplateGroup, getAllSMSTemplatesGroupsApi, getAllTemplateVariablesApi, getAllTemplateTypesApi, getSMSTemplateApi } from "@/services/api-service/mailing/mailing-api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks";
import { allSMSTemplateGroupsState, allSmsTemplateState, editModalState, groupModalState, smsTemplateState, templateGroupState, templateVariablesState } from "./states/state";
import { MoreMenuWidget } from "./messageTemplates/components/more-circle/index";
import { PdfUploadComponent } from "./messageTemplates/components/upload-file/upload-file";
import { ISMSTemplate, SMSTemplateGroup } from "./messageTemplates/interfaces/interface";
import { useRecoilState } from "recoil";

const useMessageTemplate = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded, alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);
  const [editModal, setEditModal] = useRecoilState<boolean>(editModalState);
  const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);
  const [SMSTemplate, setSMSTemplate] = useRecoilState<ISMSTemplate>(smsTemplateState);
  const [types, setTypes] = useState([]);

  const tableHeaders = [
    t("mailingSettings.type"),
    t("mailingSettings.subject"),
    t("mailingSettings.body"),
    t("mailingSettings.attachment"),
    t("mailingSettings.more"),

  ];

  useEffect(() => {
    if (types && types.length > 0) {
      getAllSmsTemplates();
    }
  }, [types, templateGroup]);

  const getSMSTemplateTypes = async () => {
    const callBackFunction = (data) => {
      if (data.success) {
        setTypes(data.data);
      }
    }
    return await getAllTemplateTypesApi(callApi, callBackFunction);
  }

  const [allSmsTemplates, setAllSmsTemplates] = useRecoilState<string[][]>(allSmsTemplateState)
  const getAllSmsTemplates = () => {
    const callBackFunction = (data) => {
      if (data.success) {
        const tableRows = data.data?.map((template) => [
          types.find((option) => option.value == template.templateType)?.text || "Unknown",
          template.title ? new DOMParser().parseFromString(template.title, 'text/html').body.textContent : "",
          template.text ? new DOMParser().parseFromString(template.text, 'text/html').body.textContent : "",
          <PdfUploadComponent onUpload={false} fileName={template.attachment} />,
          <MoreMenuWidget id={template.id} item={template} />,
        ]);
        setAllSmsTemplates(tableRows);
      }
    }
    getAllSMSTemplatesApi(callApi, callBackFunction, { SMSTemplatesGroupId: templateGroup?.id }).then();
  }

  // select group 
  const [allSMSTemplateGroups, setAllSMSTemplateGroups] = useRecoilState<any>(allSMSTemplateGroupsState);
  const getSMSTemplateGroups = () => {
    const callBackFunction = (data) => {
      if (data.success) {
        setAllSMSTemplateGroups(data.data);
      }
    }
    getAllSMSTemplatesGroupsApi(callApi, callBackFunction).then();
  }

  // variables options 
  const [templateVariables, setAllTemplateVariables] = useRecoilState<any>(templateVariablesState);
  const getTemplateVariables = () => {
    const callBackFunction = (data) => {
      if (data.success) {

        setAllTemplateVariables(data.data);
      }
    }
    getAllTemplateVariablesApi(callApi, callBackFunction).then();
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
  const onUpdateSmsTemplate = async (updatedSMSTemplate) => {
    const callBack = (data) => {
      if (data.success) {
        alertSuccessUpdate();
        setEditModal(!editModal);
        getAllSmsTemplates();
      } else {
        alertFaultUpdate();
      }
    }

    await updateSMSTemplateApi(callApi, callBack, updatedSMSTemplate)
  }


  // get by id
  const getSmsTemplateById = async (id) => {
    const callBack = (res) => {
      if (res.success) {
        setSMSTemplate(res.data);
      }
    }
    await getSMSTemplateApi(callApi, callBack, { templateId: id })
  }

  return {
    tableHeaders,
    onAddSMSTemplateGroup,
    onUpdateSmsTemplate,
    getAllSmsTemplates,
    allSmsTemplates,
    getSMSTemplateGroups,
    getTemplateVariables,
    templateVariables,
    getSMSTemplateTypes,
    templateGroup,
    setTemplateGroup,
    types,
    getSmsTemplateById
  };
};

export { useMessageTemplate };