import React, { useState } from "react";
import { Popover } from "@mui/material";
import { useRouter } from "next/router";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { OrderJobsCard } from "./order-jobs-card";
import { OrderJob } from "./types";

interface OrderJobsCellProps {
  jobs: number | string;
  orderJobs: OrderJob[];
  quoteNumber?: string;
  hasPermission: boolean;
}

const OrderJobsCell: React.FC<OrderJobsCellProps> = ({
  jobs,
  orderJobs,
  quoteNumber,
  hasPermission,
}) => {
  const { primaryColor } = useGomakeTheme();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const hasOrderJobs =
    orderJobs && Array.isArray(orderJobs) && orderJobs.length > 0;
  const shouldNavigate = !hasOrderJobs && quoteNumber;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (hasOrderJobs) {
      setAnchorEl(event.currentTarget);
    } else if (quoteNumber) {
      router.push(`/jobs?pageNumber=1&finalPatternSearch=${quoteNumber}`);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!hasPermission) {
    return <>{jobs}</>;
  }

  return (
    <>
      <span
        style={{
          cursor: hasOrderJobs || shouldNavigate ? "pointer" : "default",
          color: "inherit",
          textDecoration: "unset",
          display: "inline-block",
          padding: "2px 4px",
          borderRadius: "4px",
          transition: "background-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (hasOrderJobs || shouldNavigate) {
            e.currentTarget.style.backgroundColor = primaryColor(100);
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
        onClick={handleClick}
      >
        {jobs}
      </span>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          sx: {
            marginTop: "2px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
        disableRestoreFocus
      >
        <OrderJobsCard
          orderJobs={orderJobs || []}
          quoteNumber={quoteNumber}
          onClose={handleClose}
        />
      </Popover>
    </>
  );
};

export { OrderJobsCell };
