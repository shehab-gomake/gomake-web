import React from "react";
import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import { PrimaryButton } from "@/components/button/primary-button";
import { TicketPriority } from "../types/api.types";
import { FONT_FAMILY } from "@/utils/font-family";

interface CreateTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    customerId: string;
    assigneeId?: string;
    priority: TicketPriority;
  }) => Promise<void>;
  // Client search
  clients: Array<{ id: string; label: string }>;
  onClientSearch: (query: string) => void;
  clientsLoading: boolean;
  // Assignee search
  assignees: Array<{ id: string; label: string }>;
  onAssigneeSearch: (query: string) => void;
  assigneesLoading: boolean;
  // State
  isSubmitting: boolean;
  error?: string | null;
}

const PRIORITY_OPTIONS: Array<{ id: TicketPriority; label: string }> = [
  { id: "LOW", label: "Low" },
  { id: "MEDIUM", label: "Medium" },
  { id: "HIGH", label: "High" },
  { id: "URGENT", label: "Urgent" },
];

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  open,
  onClose,
  onSubmit,
  clients,
  onClientSearch,
  clientsLoading,
  assignees,
  onAssigneeSearch,
  assigneesLoading,
  isSubmitting,
  error,
}) => {
  const [selectedClient, setSelectedClient] = React.useState<{ id: string; label: string } | null>(null);
  const [selectedAssignee, setSelectedAssignee] = React.useState<{ id: string; label: string } | null>(null);
  const [selectedPriority, setSelectedPriority] = React.useState<{ id: TicketPriority; label: string }>(
    PRIORITY_OPTIONS[1] // Default to MEDIUM
  );

  const handleSubmit = async () => {
    if (!selectedClient) {
      return;
    }

    await onSubmit({
      customerId: selectedClient.id,
      assigneeId: selectedAssignee?.id,
      priority: selectedPriority.id,
    });

    // Reset form on success
    if (!error) {
      setSelectedClient(null);
      setSelectedAssignee(null);
      setSelectedPriority(PRIORITY_OPTIONS[1]);
    }
  };

  const handleClose = () => {
    // Reset form
    setSelectedClient(null);
    setSelectedAssignee(null);
    setSelectedPriority(PRIORITY_OPTIONS[1]);
    onClose();
  };

  const styles = {
    mainContainer: {
      display: "flex",
      flexDirection: "column" as "column",
      gap: "20px",
      width: "100%",
    },
    errorMessage: {
      padding: "12px 16px",
      backgroundColor: "#FEE2E2",
      color: "#DC2626",
      borderRadius: "8px",
      ...FONT_FAMILY.Lexend(400, 14),
    },
    label: {
      marginBottom: "8px",
      color: "#374151",
      ...FONT_FAMILY.Lexend(500, 14),
    },
    selectStyle: {
      height: 40,
      borderRadius: "8px",
      border: "1px solid #D1D5DB",
      backgroundColor: "#FFFFFF",
    },
    requiredStar: {
      color: "#DC2626",
      marginLeft: "4px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    button: {
      minWidth: "140px",
      height: "40px",
      borderRadius: "8px",
      ...FONT_FAMILY.Lexend(500, 14),
    },
  };

  return (
    <GoMakeModal
      openModal={open}
      onClose={handleClose}
      modalTitle="Create New Ticket"
      withRoundedCloseIcon={false}
      insideStyle={{
        width: "40%",
        height: "auto",
        maxHeight: "85%",
      }}
    >
      <div style={styles.mainContainer}>
        {error && <div style={styles.errorMessage}>{error}</div>}

        {/* Client Selection */}
        <div>
          <div style={styles.label}>
            Client
            <span style={styles.requiredStar}>*</span>
          </div>
          <GoMakeAutoComplate
            options={clients}
            value={selectedClient}
            onChange={(e: any, value: any) => setSelectedClient(value)}
            onInputChange={(e: any, value: string) => onClientSearch(value)}
            getOptionLabel={(option: any) => option?.label || ""}
            placeholder="Search for a client..."
            loading={clientsLoading}
            withArrow
            style={styles.selectStyle}
          />
        </div>

        {/* Assignee Selection */}
        <div>
          <div style={styles.label}>Assign to (Optional)</div>
          <GoMakeAutoComplate
            options={assignees}
            value={selectedAssignee}
            onChange={(e: any, value: any) => setSelectedAssignee(value)}
            onInputChange={(e: any, value: string) => onAssigneeSearch(value)}
            getOptionLabel={(option: any) => option?.label || ""}
            placeholder="Search for an employee..."
            loading={assigneesLoading}
            withArrow
            style={styles.selectStyle}
          />
        </div>

        {/* Priority Selection */}
        <div>
          <div style={styles.label}>Priority</div>
          <GoMakeAutoComplate
            options={PRIORITY_OPTIONS}
            value={selectedPriority}
            onChange={(e: any, value: any) => setSelectedPriority(value || PRIORITY_OPTIONS[1])}
            getOptionLabel={(option: any) => option?.label || ""}
            placeholder="Select priority..."
            disableClearable
            withArrow
            style={styles.selectStyle}
          />
        </div>

        {/* Submit Button */}
        <div style={styles.buttonContainer}>
          <PrimaryButton
            variant="contained"
            style={styles.button}
            onClick={handleSubmit}
            disabled={!selectedClient || isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Ticket"}
          </PrimaryButton>
        </div>
      </div>
    </GoMakeModal>
  );
};
