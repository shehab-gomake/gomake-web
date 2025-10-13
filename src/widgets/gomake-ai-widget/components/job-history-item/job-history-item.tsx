import { useStyle } from "./style";

interface JobHistoryItemProps {
  job: {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    status: "completed" | "processing" | "failed";
  };
  onClick: () => void;
}

const JobHistoryItem = ({ job, onClick }: JobHistoryItemProps) => {
  const { classes } = useStyle();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#10B981";
      case "processing":
        return "#F59E0B";
      case "failed":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✅";
      case "processing":
        return "⏳";
      case "failed":
        return "❌";
      default:
        return "⭕";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={classes.container} onClick={onClick}>
      <div style={classes.header}>
        <div style={classes.title}>{job.title}</div>
        <div style={classes.statusContainer}>
          <div style={classes.statusIcon}>{getStatusIcon(job.status)}</div>
          <div
            style={{
              ...classes.statusText,
              color: getStatusColor(job.status),
            }}
          >
            {job.status}
          </div>
        </div>
      </div>

      <div style={classes.description}>
        {job.description.length > 80
          ? `${job.description.substring(0, 80)}...`
          : job.description}
      </div>

      <div style={classes.footer}>
        <div style={classes.date}>{formatDate(job.createdAt)}</div>
      </div>
    </div>
  );
};

export { JobHistoryItem };
