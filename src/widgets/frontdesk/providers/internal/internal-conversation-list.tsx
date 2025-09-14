import React, { useMemo } from "react";
import { PrimaryTable } from "@/components/tables/primary-table";

type MailItem = {
  id: string;
  from: string;
  subject: string;
  receivedAt: string; // ISO or human-readable; mock only
  assignedTo?: string;
};

const FrontdeskInternalInboxTable: React.FC = () => {
  const headers = ["From", "Subject", "Received", "Assigned To"];

  const mockData: MailItem[] = useMemo(
    () => [
      {
        id: "1",
        from: "John Doe",
        subject: "Order status inquiry",
        receivedAt: "2025-09-14 09:42",
        assignedTo: "Me",
      },
      {
        id: "2",
        from: "Acme Corp",
        subject: "Invoice #4532",
        receivedAt: "2025-09-14 09:21",
        assignedTo: "Support Team",
      },
      {
        id: "3",
        from: "Jane Smith",
        subject: "Quote follow-up",
        receivedAt: "2025-09-14 08:55",
        assignedTo: "Me",
      },
      {
        id: "4",
        from: "Support Bot",
        subject: "Daily summary",
        receivedAt: "2025-09-14 08:01",
      },
      {
        id: "5",
        from: "Widgets Inc.",
        subject: "PO Confirmation",
        receivedAt: "2025-09-14 07:45",
        assignedTo: "Ops",
      },
      {
        id: "6",
        from: "Mary Johnson",
        subject: "Artwork approval",
        receivedAt: "2025-09-14 07:12",
        assignedTo: "Design",
      },
      {
        id: "7",
        from: "No-Reply",
        subject: "Password reset",
        receivedAt: "2025-09-14 06:38",
      },
      {
        id: "8",
        from: "Sales Team",
        subject: "New lead assigned",
        receivedAt: "2025-09-14 06:10",
        assignedTo: "Me",
      },
      {
        id: "9",
        from: "Printing House",
        subject: "Material update",
        receivedAt: "2025-09-14 05:55",
      },
      {
        id: "10",
        from: "Billing",
        subject: "Payment received",
        receivedAt: "2025-09-14 05:30",
        assignedTo: "Finance",
      },
    ],
    []
  );

  const rows = useMemo(
    () =>
      mockData.map((m) => [
        m.from,
        m.subject,
        m.receivedAt,
        m.assignedTo || "-",
      ]),
    [mockData]
  );

  return (
    <div style={{ height: "100%" }}>
      <PrimaryTable
        headers={headers}
        rows={rows}
        stickyHeader
        withoutShadow
      />
    </div>
  );
};

export { FrontdeskInternalInboxTable };

