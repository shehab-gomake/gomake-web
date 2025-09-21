import { EmailRecipient } from "../types/email.types";

/**
 * Parses a comma-separated email string into EmailRecipient objects
 */
export const parseEmails = (emailString: string): EmailRecipient[] => {
  if (!emailString.trim()) return [];
  return emailString
    .split(",")
    .map((email) => ({ email: email.trim(), name: "" }))
    .filter((recipient) => recipient.email);
};

/**
 * Formats email recipients for display
 */
export const formatRecipients = (recipients: EmailRecipient[]): string => {
  return recipients.map((r) => r.email).join(", ");
};

/**
 * Formats a reply subject by removing existing "Re:" prefixes
 */
export const formatReplySubject = (originalSubject: string): string => {
  return `Re: ${originalSubject.replace(/^Re:\s*/i, "")}`;
};

/**
 * Formats email address for display with optional name
 */
export const formatEmailDisplay = (email: string, name?: string): string => {
  return name ? `${name} <${email}>` : email;
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Extracts domain from email address
 */
export const getEmailDomain = (email: string): string => {
  return email.split("@")[1] || "";
};
