/**
 * Template Editor Modal
 * Professional modal for editing message templates with Quill editor
 */

import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { SecondaryButton } from '@/components/button/secondary-button';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { GoMakeAutoComplate } from '@/components';
import { languageOptionsState } from '@/store/languages';
import {
  settingsSelectedTemplateAtom,
  settingsTemplateEditorModalAtom,
  settingsTemplateSubjectAtom,
  settingsTemplateBodyAtom,
  settingsTemplateTypesAtom,
  settingsTemplateGroupsAtom,
  settingsTemplateVariablesAtom,
} from '@/store/frontdesk/atoms/settings.atoms';
import { useMessageTemplates } from '../../hooks/use-message-templates';
import { FrontdeskQuillEditor } from './frontdesk-quill-editor';
import { PdfUploadComponent } from '@/widgets/settings-mailing/messageTemplates/components/upload-file/upload-file';
import { FONT_FAMILY } from '@/utils/font-family';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';

export const TemplateEditorModal: React.FC = () => {
  const { updateTemplate, closeEditorModal } = useMessageTemplates();
  const { t } = useTranslation();
  const { neutralColor } = useGomakeTheme();

  // State
  const [open, setOpen] = useRecoilState(settingsTemplateEditorModalAtom);
  const selectedTemplate = useRecoilValue(settingsSelectedTemplateAtom);
  const [subject, setSubject] = useRecoilState(settingsTemplateSubjectAtom);
  const [body, setBody] = useRecoilState(settingsTemplateBodyAtom);
  const templateTypes = useRecoilValue(settingsTemplateTypesAtom);
  const templateGroups = useRecoilValue(settingsTemplateGroupsAtom);
  const languages = useRecoilValue(languageOptionsState);

  // Local state for form fields
  const [templateType, setTemplateType] = React.useState('');
  const [groupId, setGroupId] = React.useState('');
  const [language, setLanguage] = React.useState('en');

  // Initialize form fields when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      setTemplateType(selectedTemplate.templateType || '');
      setGroupId(selectedTemplate.smsTemplatesGroupId || '');
      setLanguage(selectedTemplate.language || 'en');
    }
  }, [selectedTemplate]);

  // Handle save
  const handleSave = async () => {
    if (!selectedTemplate) return;

    const updatedTemplate = {
      ...selectedTemplate,
      title: subject,
      text: body,
      templateType,
      smsTemplatesGroupId: groupId || undefined,
      language,
    };

    await updateTemplate(updatedTemplate);
  };

  // Handle reset
  const handleReset = () => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.title || '');
      setBody(selectedTemplate.text || '');
      setTemplateType(selectedTemplate.templateType || '');
      setGroupId(selectedTemplate.smsTemplatesGroupId || '');
    }
  };

  // Get template type label
  const getTemplateTypeLabel = () => {
    const type = templateTypes.find((t) => t.value === templateType);
    return type?.text || 'Template';
  };

  // Styles matching original
  const subSectionStyle = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '10px',
    alignItems: 'flex-start',
    width: '100%',
  };

  const subSectionHeaderStyle = {
    ...FONT_FAMILY.Lexend(400, 16),
    color: neutralColor(600),
    lineHeight: '20px',
  };

  if (!selectedTemplate) return null;

  return (
    <Dialog
      open={open}
      onClose={closeEditorModal}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '700px',
          maxWidth: '900px',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h6">Edit Template</Typography>
          <Typography variant="body2" color="text.secondary">
            {getTemplateTypeLabel()}
          </Typography>
        </Box>
        <IconButton onClick={closeEditorModal} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, px: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Language Selector */}
          <Box style={subSectionStyle}>
            <h3 style={subSectionHeaderStyle}>{t('mailingSettings.language')}</h3>
            <GoMakeAutoComplate
              options={languages.map(({ text, value }) => ({
                label: text,
                value,
              }))}
              onChange={(e: any, value: any) => setLanguage(value?.value || 'en')}
              style={{
                width: '200px',
                borderRadius: 4,
                height: 40,
                backgroundColor: '#FFF',
                border: '0px',
                boxShadow: '0px 1px 2px 0px rgba(0, 0, 0, 0.08)',
              }}
              value={languages.find((lang) => lang.value === language)?.text || 'English'}
              disableClearable={true}
              placeholder={t('mailingSettings.selectLanguage')}
            />
          </Box>

          {/* Template Type */}
          <Box style={subSectionStyle}>
            <h3 style={subSectionHeaderStyle}>Template Type</h3>
            <TextField
              select
              value={templateType}
              onChange={(e) => setTemplateType(e.target.value)}
              size="small"
              sx={{ width: '300px' }}
            >
              {templateTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.text}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Template Group */}
          <Box style={subSectionStyle}>
            <h3 style={subSectionHeaderStyle}>Template Group</h3>
            <TextField
              select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              size="small"
              sx={{ width: '300px' }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {templateGroups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Subject - Quill Editor */}
          <Box style={subSectionStyle}>
            <h3 style={subSectionHeaderStyle}>{t('mailingSettings.subject')}</h3>
            <FrontdeskQuillEditor value={subject} setValue={setSubject} />
          </Box>

          {/* Body - Quill Editor */}
          <Box style={subSectionStyle}>
            <h3 style={subSectionHeaderStyle}>{t('mailingSettings.body')}</h3>
            <FrontdeskQuillEditor value={body} setValue={setBody} />
          </Box>

          {/* Attachment */}
          <Box style={subSectionStyle}>
            <h3 style={subSectionHeaderStyle}>{t('mailingSettings.attachment')}</h3>
            <PdfUploadComponent onUpload={true} fileName={selectedTemplate?.attachment} />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          px: 4,
          py: 2,
          gap: 1,
        }}
      >
        <SecondaryButton onClick={handleReset} variant="outlined">
          {t('mailingSettings.reset')}
        </SecondaryButton>
        <SecondaryButton onClick={handleSave} variant="contained">
          {t('mailingSettings.save')}
        </SecondaryButton>
      </DialogActions>
    </Dialog>
  );
};
