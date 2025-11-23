/**
 * useMessageSender Hook
 *
 * Advanced message sending hook with:
 * - Validation
 * - Retry logic
 * - Optimistic updates
 * - Error handling
 * - Loading states
 */

import { useState, useCallback, useRef } from "react";
import { validateMessage, sanitizeMessageContent, splitMessage } from "../utils/message-validation.utils";
import type { ChannelFeatures } from "../utils/channel-features.service";
import type { ValidationResult } from "../utils/message-validation.utils";
import { createLogger } from "@/services/frontdesk/utils/logger";

const logger = createLogger("useMessageSender");

export interface SendMessageOptions {
  content: string;
  isPrivate: boolean;
  emailHeader?: {
    to?: string;
    cc?: string;
    bcc?: string;
  };
}

export interface UseMessageSenderOptions {
  channelFeatures: ChannelFeatures;
  onSend: (content: string, isPrivate: boolean, emailHeader?: SendMessageOptions["emailHeader"]) => Promise<void>;
  onValidationError?: (validation: ValidationResult) => void;
  maxRetries?: number;
  retryDelay?: number;
}

export interface UseMessageSenderReturn {
  /** Send a message with validation and retry */
  sendMessage: (options: SendMessageOptions) => Promise<boolean>;
  /** Current sending state */
  isSending: boolean;
  /** Last error that occurred */
  error: Error | null;
  /** Validation result from last attempt */
  validation: ValidationResult | null;
  /** Clear error state */
  clearError: () => void;
  /** Number of retries attempted */
  retryCount: number;
}

/**
 * Hook for sending messages with advanced features
 */
export function useMessageSender({
  channelFeatures,
  onSend,
  onValidationError,
  maxRetries = 3,
  retryDelay = 1000,
}: UseMessageSenderOptions): UseMessageSenderReturn {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearError = useCallback(() => {
    setError(null);
    setValidation(null);
    setRetryCount(0);
  }, []);

  const sendMessage = useCallback(
    async (options: SendMessageOptions): Promise<boolean> => {
      const { content, isPrivate, emailHeader } = options;

      // Clear previous errors
      clearError();

      // Validate message
      const validationResult = validateMessage(
        content,
        channelFeatures,
        isPrivate,
        emailHeader
      );

      setValidation(validationResult);

      if (!validationResult.isValid) {
        logger.warn("Message validation failed", {
          errors: validationResult.errors,
          warnings: validationResult.warnings,
        });
        onValidationError?.(validationResult);
        return false;
      }

      // Log warnings if any
      if (validationResult.warnings.length > 0) {
        logger.info("Message validation warnings", {
          warnings: validationResult.warnings,
        });
      }

      // Sanitize content
      const sanitizedContent = sanitizeMessageContent(content, channelFeatures);

      // Split message if needed
      const messageParts = channelFeatures.shouldSplitMessages
        ? splitMessage(sanitizedContent, channelFeatures.maxMessageLength)
        : [sanitizedContent];

      if (messageParts.length > 1) {
        logger.info(`Message split into ${messageParts.length} parts`);
      }

      // Send with retry logic
      setIsSending(true);
      let attempts = 0;
      let lastError: Error | null = null;

      while (attempts < maxRetries) {
        try {
          abortControllerRef.current = new AbortController();

          // Send all parts
          for (let i = 0; i < messageParts.length; i++) {
            const part = messageParts[i];
            const partLabel = messageParts.length > 1 ? ` (${i + 1}/${messageParts.length})` : "";

            logger.debug(`Sending message${partLabel}`);

            await onSend(part, isPrivate, i === 0 ? emailHeader : undefined);

            // Small delay between parts to avoid rate limiting
            if (i < messageParts.length - 1) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          }

          // Success!
          logger.info("Message sent successfully", {
            parts: messageParts.length,
            attempts: attempts + 1,
            isPrivate,
          });

          setIsSending(false);
          setRetryCount(attempts);
          return true;
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          attempts++;
          setRetryCount(attempts);

          if (attempts < maxRetries) {
            logger.warn(`Send failed, retrying (${attempts}/${maxRetries})`, err);
            await new Promise((resolve) => setTimeout(resolve, retryDelay * attempts));
          } else {
            logger.error("Send failed after all retries", err);
          }
        }
      }

      // All retries failed
      setError(lastError);
      setIsSending(false);
      return false;
    },
    [
      channelFeatures,
      onSend,
      onValidationError,
      maxRetries,
      retryDelay,
      clearError,
    ]
  );

  return {
    sendMessage,
    isSending,
    error,
    validation,
    clearError,
    retryCount,
  };
}
