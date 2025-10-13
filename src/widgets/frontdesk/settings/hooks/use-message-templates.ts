/**
 * useMessageTemplates Hook
 * Handles message template CRUD operations and state management
 */

import { useCallback, useEffect } from 'react';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useGomakeAxios } from '@/hooks/use-gomake-axios';
import { useSnackBar } from '@/hooks';
import {
  getAllSMSTemplatesApi,
  updateSMSTemplateApi,
  getAllSMSTemplatesGroupsApi,
  getAllTemplateVariablesApi,
  getAllTemplateTypesApi,
  getSMSTemplateApi,
  addSMSTemplateGroup,
} from '@/services/api-service/mailing/mailing-api';
import {
  settingsTemplatesAtom,
  settingsSelectedTemplateAtom,
  settingsTemplateGroupsAtom,
  settingsTemplateTypesAtom,
  settingsTemplateVariablesAtom,
  settingsTemplateFiltersAtom,
  settingsLoadingAtom,
  settingsErrorAtom,
  settingsTemplateEditorModalAtom,
  settingsAddGroupModalAtom,
  settingsTemplateSubjectAtom,
  settingsTemplateBodyAtom,
} from '@/store/frontdesk/atoms/settings.atoms';
import { MessageTemplate, TemplateGroup } from '../types/settings.types';

export const useMessageTemplates = () => {
  const { callApi } = useGomakeAxios();
  const {
    alertSuccessAdded,
    alertFaultAdded,
    alertSuccessUpdate,
    alertFaultUpdate,
  } = useSnackBar();

  // State
  const [templates, setTemplates] = useRecoilState(settingsTemplatesAtom);
  const [selectedTemplate, setSelectedTemplate] = useRecoilState(settingsSelectedTemplateAtom);
  const [templateGroups, setTemplateGroups] = useRecoilState(settingsTemplateGroupsAtom);
  const [templateTypes, setTemplateTypes] = useRecoilState(settingsTemplateTypesAtom);
  const [templateVariables, setTemplateVariables] = useRecoilState(settingsTemplateVariablesAtom);
  const [filters, setFilters] = useRecoilState(settingsTemplateFiltersAtom);
  const [isLoading, setIsLoading] = useRecoilState(settingsLoadingAtom);
  const [error, setError] = useRecoilState(settingsErrorAtom);
  const [editorModalOpen, setEditorModalOpen] = useRecoilState(settingsTemplateEditorModalAtom);
  const [addGroupModalOpen, setAddGroupModalOpen] = useRecoilState(settingsAddGroupModalAtom);
  const setTemplateSubject = useSetRecoilState(settingsTemplateSubjectAtom);
  const setTemplateBody = useSetRecoilState(settingsTemplateBodyAtom);

  // Fetch all templates
  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const callbackFunction = (data: any) => {
        if (data.success) {
          setTemplates(data.data || []);
        } else {
          setError('Failed to fetch templates');
        }
      };

      await getAllSMSTemplatesApi(callApi, callbackFunction, {
        SMSTemplatesGroupId: filters.groupId || null,
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [callApi, filters.groupId, setTemplates, setIsLoading, setError]);

  // Fetch template by ID
  const fetchTemplateById = useCallback(async (id: string, language?: string) => {
    try {
      const callBack = (res: any) => {
        if (res.success) {
          setSelectedTemplate(res.data);
          setTemplateBody(res.data?.text || '');
          setTemplateSubject(res.data?.title || '');
        }
      };

      await getSMSTemplateApi(callApi, callBack, {
        templateId: id,
        lang: language || null,
        ...(filters.groupId && { SMSTemplatesGroupId: filters.groupId }),
      });
    } catch (err: any) {
      console.error('Error fetching template:', err);
    }
  }, [callApi, filters.groupId, setSelectedTemplate, setTemplateBody, setTemplateSubject]);

  // Fetch template groups
  const fetchTemplateGroups = useCallback(async () => {
    try {
      const callbackFunction = (data: any) => {
        if (data.success) {
          setTemplateGroups(data?.data || []);
        }
      };

      await getAllSMSTemplatesGroupsApi(callApi, callbackFunction);
    } catch (err: any) {
      console.error('Error fetching template groups:', err);
    }
  }, [callApi, setTemplateGroups]);

  // Fetch template types
  const fetchTemplateTypes = useCallback(async () => {
    try {
      const callbackFunction = (data: any) => {
        if (data.success) {
          setTemplateTypes(data.data || []);
        }
      };

      await getAllTemplateTypesApi(callApi, callbackFunction);
    } catch (err: any) {
      console.error('Error fetching template types:', err);
    }
  }, [callApi, setTemplateTypes]);

  // Fetch template variables
  const fetchTemplateVariables = useCallback(async () => {
    try {
      const callbackFunction = (data: any) => {
        if (data.success) {
          // Transform API response to match expected format (value + label)
          const transformedVariables = (data.data || []).map((variable: any) => ({
            ...variable,
            value: variable.value || variable.name,
            label: variable.label || variable.name || variable.value,
          }));
          setTemplateVariables(transformedVariables);
        }
      };

      await getAllTemplateVariablesApi(callApi, callbackFunction);
    } catch (err: any) {
      console.error('Error fetching template variables:', err);
    }
  }, [callApi, setTemplateVariables]);

  // Update template
  const updateTemplate = useCallback(async (updatedTemplate: MessageTemplate) => {
    try {
      const callBack = (data: any) => {
        if (data.success) {
          alertSuccessUpdate();
          setEditorModalOpen(false);
          fetchTemplates();
        } else {
          alertFaultUpdate();
        }
      };

      // Add group ID if selected
      if (filters.groupId) {
        updatedTemplate.smsTemplatesGroupId = filters.groupId;
      }

      await updateSMSTemplateApi(callApi, callBack, updatedTemplate);
    } catch (err: any) {
      alertFaultUpdate();
      console.error('Error updating template:', err);
    }
  }, [callApi, filters.groupId, alertSuccessUpdate, alertFaultUpdate, setEditorModalOpen, fetchTemplates]);

  // Add template group
  const addTemplateGroup = useCallback(async (group: TemplateGroup) => {
    try {
      const callback = (data: any) => {
        if (data.success) {
          alertSuccessAdded();
          setAddGroupModalOpen(false);
          fetchTemplateGroups();
        } else {
          alertFaultAdded();
        }
      };

      await addSMSTemplateGroup(callApi, callback, group);
    } catch (err: any) {
      alertFaultAdded();
      console.error('Error adding template group:', err);
    }
  }, [callApi, alertSuccessAdded, alertFaultAdded, setAddGroupModalOpen, fetchTemplateGroups]);

  // Open editor modal with template
  const openEditorModal = useCallback(async (templateId: string) => {
    await fetchTemplateById(templateId);
    setEditorModalOpen(true);
  }, [fetchTemplateById, setEditorModalOpen]);

  // Close editor modal
  const closeEditorModal = useCallback(() => {
    setEditorModalOpen(false);
    setSelectedTemplate(null);
    setTemplateSubject('');
    setTemplateBody('');
  }, [setEditorModalOpen, setSelectedTemplate, setTemplateSubject, setTemplateBody]);

  // Initialize data on mount
  useEffect(() => {
    fetchTemplateTypes();
    fetchTemplateGroups();
    fetchTemplateVariables();
  }, [fetchTemplateTypes, fetchTemplateGroups, fetchTemplateVariables]);

  // Fetch templates when filters or types change
  useEffect(() => {
    if (templateTypes.length > 0) {
      fetchTemplates();
    }
  }, [templateTypes, filters, fetchTemplates]);

  return {
    // State
    templates,
    selectedTemplate,
    templateGroups,
    templateTypes,
    templateVariables,
    filters,
    isLoading,
    error,
    editorModalOpen,
    addGroupModalOpen,

    // Actions
    fetchTemplates,
    fetchTemplateById,
    fetchTemplateGroups,
    fetchTemplateTypes,
    fetchTemplateVariables,
    updateTemplate,
    addTemplateGroup,
    openEditorModal,
    closeEditorModal,
    setFilters,
    setAddGroupModalOpen,
  };
};
