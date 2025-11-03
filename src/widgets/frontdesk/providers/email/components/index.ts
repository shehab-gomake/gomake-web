// Main email components
export { EmailComposer } from "./email-composer";
export { EmailConversationList } from "./email-conversation-list";
export { EmailMessageViewer } from "./email-message-viewer";
export { EmailSidebar } from "./email-sidebar";
export { EmailLabels } from "./email-labels";
export { EmailAuthModal } from "./email-auth-modal";
export { EmailConnectionStatus } from "./email-connection-status";
export { EmailHoverProfile } from "./email-hover-profile";
export { EmailAccountMenu } from "./email-account-menu";
export { DisconnectAccountDialog } from "./disconnect-account-dialog";

// New iframe-based email viewer components
export { EmailMessageBody } from './EmailMessageBody';
export type { EmailMessageBodyProps } from './EmailMessageBody';
export { EmailFrame } from './EmailFrame';
export type { EmailFrameProps } from './EmailFrame';
export { EmailHeader } from './EmailHeader';
export type { EmailHeaderProps } from './EmailHeader';

// Re-export UI components
export * from "./ui";

// Re-export sub-components
export * from "./composer";
export * from "./conversation";
export * from "./message-viewer";
export * from "./sidebar";
