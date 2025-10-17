import { ReactNode } from "react";
import { DialogProps } from "@mui/material";

export interface GoMakeDialogProps extends Omit<DialogProps, "onClose" | "title"> {
  /**
   * Controls whether the dialog is open
   */
  open: boolean;

  /**
   * Callback fired when the dialog should be closed
   */
  onClose?: () => void;

  /**
   * Dialog title displayed in the header
   */
  title?: string | ReactNode;

  /**
   * Custom title component (overrides title prop)
   */
  customTitle?: ReactNode;

  /**
   * Whether to show the close button in header
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Content/Body of the dialog
   */
  children: ReactNode;

  /**
   * Whether to show the footer with buttons
   * @default true
   */
  showFooter?: boolean;

  /**
   * Primary action button label
   * @default "Save"
   */
  primaryButtonLabel?: string;

  /**
   * Cancel button label
   * @default "Cancel"
   */
  cancelButtonLabel?: string;

  /**
   * Callback when primary button is clicked
   */
  onPrimaryAction?: () => void;

  /**
   * Callback when cancel button is clicked (defaults to onClose)
   */
  onCancel?: () => void;

  /**
   * Whether primary button is disabled
   * @default false
   */
  primaryButtonDisabled?: boolean;

  /**
   * Whether primary button shows loading state
   * @default false
   */
  primaryButtonLoading?: boolean;

  /**
   * Custom footer component (overrides default footer)
   */
  customFooter?: ReactNode;

  /**
   * Custom styles for different parts of the dialog
   */
  customStyles?: {
    paper?: React.CSSProperties;
    header?: React.CSSProperties;
    title?: React.CSSProperties;
    content?: React.CSSProperties;
    footer?: React.CSSProperties;
  };

  /**
   * Icon to display on the left side of the primary button
   */
  primaryButtonIcon?: ReactNode;

  /**
   * Icon to display on the left side of the cancel button
   */
  cancelButtonIcon?: ReactNode;

  /**
   * Whether to hide the cancel button
   * @default false
   */
  hideCancelButton?: boolean;

  /**
   * Whether to hide the primary button
   * @default false
   */
  hidePrimaryButton?: boolean;

  /**
   * Additional custom buttons to display in footer (left side)
   */
  additionalButtons?: ReactNode;
}

