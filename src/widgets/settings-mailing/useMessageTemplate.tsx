
import { getAllSMSTemplatesApi, updateSMSTemplateApi, addSMSTemplateGroup, getAllSMSTemplatesGroupsApi, getAllTemplateVariablesApi, getAllTemplateTypesApi, getSMSTemplateApi } from "@/services/api-service/mailing/mailing-api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGomakeAxios } from "@/hooks/use-gomake-axios";
import { useSnackBar } from "@/hooks";
import { allSMSTemplateGroupsState, allSmsTemplateState, changeLanguageModalState, editModalState, groupModalState, languageTemplateState, smsBodyState, smsSubjectState, smsTemplateState, templateGroupState, templateGroupStateNew, templateVariablesState } from "./states/state";
import { MoreMenuWidget } from "./messageTemplates/components/more-circle/index";
import { PdfUploadComponent } from "./messageTemplates/components/upload-file/upload-file";
import { ISMSTemplate, SMSTemplateGroup } from "./messageTemplates/interfaces/interface";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

const useMessageTemplate = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const { alertFaultAdded, alertSuccessAdded, alertFaultUpdate, alertSuccessUpdate } = useSnackBar();
  const [openModal, setOpenModal] = useRecoilState<boolean>(groupModalState);
  const [editModal, setEditModal] = useRecoilState<boolean>(editModalState);
  const [templateGroup, setTemplateGroup] = useRecoilState<SMSTemplateGroup>(templateGroupState);
  const setNewTemplateGroup = useSetRecoilState<SMSTemplateGroup>(templateGroupStateNew);
  const [types, setTypes] = useState([]);


  //////////////////////////////////////////////////

  const [SMSTemplate, setSMSTemplate] = useRecoilState<ISMSTemplate>(smsTemplateState);
  const [openDeleteModal, setOpenDeleteModal] = useRecoilState<boolean>(changeLanguageModalState);
  const setSubject = useSetRecoilState<string>(smsSubjectState);
  const setBody = useSetRecoilState<string>(smsBodyState);
  const [languageState, setLanguageState] = useRecoilState<string>(languageTemplateState);

  const onCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const onOpenDeleteModal = () => {
    setOpenDeleteModal(true);
  };

  const onClickYes = async () => {
    await getSmsTemplateById(SMSTemplate?.id  , languageState);
    setOpenDeleteModal(false);
  };

  /////////////////////////////////////////////////

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

  // group select 
  const setAllSMSTemplateGroups = useSetRecoilState<any>(allSMSTemplateGroupsState);
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
  const onAddSMSTemplateGroup = async (templateGroupNew) => {
    const callback = (data) => {
      if (data.success) {
        alertSuccessAdded();
        setOpenModal(!openModal);
        setNewTemplateGroup(null);
        getSMSTemplateGroups();
      } else {
        alertFaultAdded();
      }
    }
    await addSMSTemplateGroup(callApi, callback, templateGroupNew);
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
  const getSmsTemplateById = async (id , language=null) => {
    const callBack = (res) => {
      if (res.success) {
        setSMSTemplate(res.data);
        setBody(res.data?.text);
        setSubject(res.data?.title);
      }
    }
    await getSMSTemplateApi(callApi, callBack, { templateId: id , lang: language })
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
    getSmsTemplateById,
    openDeleteModal,
    onOpenDeleteModal,
    onCloseDeleteModal,
    onClickYes
  };
};

export { useMessageTemplate };