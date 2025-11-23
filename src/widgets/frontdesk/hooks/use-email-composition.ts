/**
 * useEmailComposition Hook
 *
 * Shared email composition logic for modals.
 * Handles form state, validation, and basic email composition operations.
 *
 * This hook provides a lightweight abstraction over email form state management,
 * allowing different UIs to customize the presentation while sharing core logic.
 */

import { useState, useCallback, useMemo } from "react";
import {
  validateEmail,
  validateEmails,
  validateEmailField,
  validateEmailsField,
} from "@/services/frontdesk";

/**
 * Email composition form state
 */
export interface EmailCompositionState {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  message?: string;
  attachments?: File[];
}

/**
 * Email composition validation errors
 */
export interface EmailCompositionErrors {
  to?: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  message?: string;
}

/**
 * Email composition validation rules
 */
export interface EmailCompositionValidationRules {
  toRequired?: boolean;
  subjectRequired?: boolean;
  messageRequired?: boolean;
}

/**
 * Options for useEmailComposition hook
 */
export interface UseEmailCompositionOptions {
  /** Initial form state */
  initialState?: Partial<EmailCompositionState>;

  /** Validation rules */
  validationRules?: EmailCompositionValidationRules;

  /** Callback when form state changes */
  onChange?: (state: EmailCompositionState) => void;
}

/**
 * useEmailComposition Hook
 *
 * Provides email composition form state management and validation.
 */
export function useEmailComposition(options: UseEmailCompositionOptions = {}) {
  const {
    initialState = {},
    validationRules = {
      toRequired: false, // Optional by default (contact may be pre-selected)
      subjectRequired: false, // Optional by default (some channels don't need subject)
      messageRequired: false, // Optional by default (can send empty with attachments)
    },
    onChange,
  } = options;

  // Form state
  const [formState, setFormState] = useState<EmailCompositionState>({
    to: initialState.to || "",
    cc: initialState.cc || "",
    bcc: initialState.bcc || "",
    subject: initialState.subject || "",
    message: initialState.message || "",
    attachments: initialState.attachments || [],
  });

  // Validation errors
  const [errors, setErrors] = useState<EmailCompositionErrors>({});

  // Update field
  const updateField = useCallback(
    <K extends keyof EmailCompositionState>(
      field: K,
      value: EmailCompositionState[K]
    ) => {
      setFormState((prev) => {
        const next = { ...prev, [field]: value };
        onChange?.(next);
        return next;
      });

      // Clear error for this field
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [onChange]
  );

  // Validate form
  const validate = useCallback((): boolean => {
    const newErrors: EmailCompositionErrors = {};

    // Validate TO field
    if (validationRules.toRequired && !formState.to?.trim()) {
      newErrors.to = "Recipient email is required";
    } else if (formState.to?.trim()) {
      const toError = validateEmailField(formState.to, "Recipient email");
      if (toError) newErrors.to = toError;
    }

    // Validate CC field (optional, but must be valid if provided)
    if (formState.cc?.trim()) {
      const ccError = validateEmailsField(formState.cc, "CC");
      if (ccError) newErrors.cc = ccError;
    }

    // Validate BCC field (optional, but must be valid if provided)
    if (formState.bcc?.trim()) {
      const bccError = validateEmailsField(formState.bcc, "BCC");
      if (bccError) newErrors.bcc = bccError;
    }

    // Validate subject
    if (validationRules.subjectRequired && !formState.subject?.trim()) {
      newErrors.subject = "Subject is required";
    }

    // Validate message
    if (validationRules.messageRequired && !formState.message?.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState, validationRules]);

  // Check if form has content
  const hasContent = useMemo(() => {
    return !!(
      formState.to?.trim() ||
      formState.cc?.trim() ||
      formState.bcc?.trim() ||
      formState.subject?.trim() ||
      formState.message?.trim() ||
      (formState.attachments && formState.attachments.length > 0)
    );
  }, [formState]);

  // Check if form is ready to send
  const canSend = useMemo(() => {
    // Must have either a message or attachments
    const hasMessageOrAttachments =
      formState.message?.trim() ||
      (formState.attachments && formState.attachments.length > 0);

    // Must have TO if required
    const hasTo = validationRules.toRequired ? !!formState.to?.trim() : true;

    // Must have subject if required
    const hasSubject = validationRules.subjectRequired
      ? !!formState.subject?.trim()
      : true;

    return hasMessageOrAttachments && hasTo && hasSubject;
  }, [formState, validationRules]);

  // Reset form
  const reset = useCallback(() => {
    setFormState({
      to: initialState.to || "",
      cc: initialState.cc || "",
      bcc: initialState.bcc || "",
      subject: initialState.subject || "",
      message: initialState.message || "",
      attachments: initialState.attachments || [],
    });
    setErrors({});
  }, [initialState]);

  // Set multiple fields at once
  const setFields = useCallback(
    (fields: Partial<EmailCompositionState>) => {
      setFormState((prev) => {
        const next = { ...prev, ...fields };
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  return {
    // Form state
    formState,
    setFormState,
    updateField,
    setFields,

    // Individual field setters (for convenience)
    setTo: useCallback((to: string) => updateField("to", to), [updateField]),
    setCc: useCallback((cc: string) => updateField("cc", cc), [updateField]),
    setBcc: useCallback((bcc: string) => updateField("bcc", bcc), [updateField]),
    setSubject: useCallback((subject: string) => updateField("subject", subject), [updateField]),
    setMessage: useCallback((message: string) => updateField("message", message), [updateField]),
    setAttachments: useCallback(
      (attachments: File[]) => updateField("attachments", attachments),
      [updateField]
    ),

    // Validation
    errors,
    validate,
    hasContent,
    canSend,

    // Actions
    reset,
  };
}
