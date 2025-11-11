import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { Skeleton, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import Stack from "@mui/material/Stack";
import { IGanttJob } from "@/widgets/production-floor/views/gantt-view/interfaces";
import { Instance } from "@popperjs/core";
import { useRef } from "react";
import { toRgba } from "@/utils/helpers";
import { OrderJObNumbersComponent } from "@/widgets/production-floor/kanban-view/kanban-card/order-job-num-coponent";
import { useTranslation } from "react-i18next";
import { useStyle } from "@/widgets/production-floor/kanban-view/kanban-card/style";
import { useRecoilState } from "recoil";
import { loadingGanttItemId } from "@/widgets/production-floor/views/gantt-view/state";
import moment from "moment";

const JobComponent = ({
  item,
  getItemProps,
  toggleGroup,
}: {
  item: IGanttJob;
  getItemProps: any;
  toggleGroup: any;
}) => {
  const isEditable = item.isEditable;
  const [loadingItemId] = useRecoilState<string>(loadingGanttItemId);
  const positionRef = useRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const popperRef = useRef<Instance>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: React.MouseEvent) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };

  const defaultColor = "#6C757D";
  const bgColor = item.bgColor || defaultColor;

  const {
    onMouseDown: originalMouseDown,
    onClick: originalClick,
    ...restProps
  } = getItemProps({
    style: {
      background: isEditable ? toRgba(bgColor, 0.6) : defaultColor,
      color: "white",
      borderRadius: "8px",
      border: `2px solid ${isEditable ? bgColor : defaultColor}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      opacity: isEditable && item.isHasSelected && !item.selected ? 0.4 : 1,
      minHeight: "28px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      fontWeight: 600,
      fontSize: "12px",
      textShadow: "0 1px 2px rgba(0,0,0,0.3)",
      position: "relative",
      overflow: "hidden",
    },
  });

  const renderJobContent = () => (
    <div
      className="rct-item-content"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "5px",
        maxHeight: "100%",
        overflow: "hidden",
      }}
    >
      <div />
      <span
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {item.title}
      </span>
      <div>
        {isEditable && (
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              border: "2px solid #FFF",
              backgroundColor: item.statusColor,
              marginLeft: "auto",
            }}
          />
        )}
      </div>
    </div>
  );

  return (
    <div
      {...restProps}
      onMouseDown={(e) => {
        if (!isEditable) {
          e.stopPropagation();
        }
        originalMouseDown?.(e);
      }}
      onClick={(e) => {
        if (!isEditable && item?.group) {
          toggleGroup(item.group);
        }
        originalClick?.(e);
      }}
    >
      {loadingItemId === item.id ? (
        <Skeleton width={"100%"} height={"100%"} />
      ) : isEditable ? (
        <HtmlTooltip
          slotProps={{
            popper: {
              popperRef,
              anchorEl: {
                getBoundingClientRect: () => {
                  return new DOMRect(
                    positionRef.current.x,
                    areaRef.current!?.getBoundingClientRect().y
                  );
                },
              },
            },
          }}
          arrow
          placement="top"
          title={<JobTooltipComponent {...item} />}
        >
          <div
            ref={areaRef}
            onMouseMove={handleMouseMove}
            style={{ textAlign: "center", width: "100%" }}
          >
            {renderJobContent()}
          </div>
        </HtmlTooltip>
      ) : (
        <div
          ref={areaRef}
          onMouseMove={handleMouseMove}
          style={{ textAlign: "center", width: "100%" }}
        >
          {renderJobContent()}
        </div>
      )}
    </div>
  );
};

const JobTooltipComponent = ({
  clientName,
  productName,
  title,
  bgColor,
  jobNumber,
  jobName,
  orderNumber,
  numberOfJobsInOrder,
  boardMissionId,
  productType,
  start_time,
  end_time,
}: IGanttJob) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { push } = useRouter();

  const defaultColor = "#6C757D";
  const safeColor = bgColor || defaultColor;

  const handleOpenMission = () => {
    push(
      `/production-floor?boardMissionsId=${boardMissionId}&productType=${
        productType ?? ""
      }&step=stations`
    );
  };

  const formattedStartTime = moment(start_time).format("HH:mm");
  const formattedStartDate = moment(start_time).format("MMM DD");
  const formattedEndTime = moment(end_time).format("HH:mm");
  const formattedEndDate = moment(end_time).format("MMM DD");

  const getStatusInfo = (statusColor: string) => {
    const statusMap: {
      [key: string]: { label: string; color: string; bgColor: string };
    } = {
      "#28A745": { label: "Completed", color: "#28A745", bgColor: "#D4EDDA" },
      "#FD7E14": { label: "In Progress", color: "#FD7E14", bgColor: "#FFF3CD" },
      "#DC3545": { label: "Pending", color: "#DC3545", bgColor: "#F8D7DA" },
      "#007BFF": { label: "Scheduled", color: "#007BFF", bgColor: "#D1ECF1" },
      "#6F42C1": { label: "Design", color: "#6F42C1", bgColor: "#E2D9F3" },
    };
    return (
      statusMap[statusColor] || {
        label: "Unknown",
        color: statusColor,
        bgColor: "#F8F9FA",
      }
    );
  };

  const statusInfo = getStatusInfo(safeColor);

  return (
    <Stack
      direction={"column"}
      gap={"15px"}
      padding={"16px"}
      width={"100%"}
      onClick={handleOpenMission}
      style={{
        borderRadius: "12px",
        border: `2px solid ${safeColor}`,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
        backgroundColor: "#FFFFFF",
        cursor: "pointer",
        minWidth: "380px",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        display={"flex"}
        flexWrap={"wrap"}
        alignItems="center"
      >
        <Stack direction="row" alignItems="center" gap="12px">
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              backgroundColor: safeColor,
              boxShadow: `0 2px 8px ${toRgba(safeColor, 0.3)}`,
            }}
          />
          <span
            style={{ ...classes.jobTitle, fontSize: "16px", fontWeight: 600 }}
          >
            {title}
          </span>
        </Stack>
        <OrderJObNumbersComponent
          boardMission={{ boardMissionNumber: jobNumber, orderNumber }}
          textColor={safeColor}
          bgColor={toRgba(safeColor, 0.15)}
        />
      </Stack>

      <Stack gap="10px">
        {jobName && (
          <Stack
            direction={"row"}
            alignItems="center"
            gap="6px"
            sx={{
              padding: "6px 10px",
              backgroundColor: toRgba(safeColor, 0.08),
              borderRadius: "6px",
              border: `1px solid ${toRgba(safeColor, 0.15)}`,
            }}
          >
            <div
              style={{
                width: "3px",
                height: "16px",
                backgroundColor: safeColor,
                borderRadius: "2px",
              }}
            />
            <span
              style={{
                ...classes.jobTitle,
                fontSize: "13px",
                fontWeight: 600,
                color: safeColor,
                flex: 1,
              }}
            >
              {jobName}
            </span>
          </Stack>
        )}
        <Stack direction={"row"} justifyContent={"space-between"} gap={"8px"}>
          <span
            style={{
              ...classes.productTitle,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {productName || "Product name"}
          </span>
          <span
            style={{
              ...classes.productTitle,
              fontSize: "14px",
              fontWeight: 500,
            }}
          >
            {clientName || "Client name"}
          </span>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          display={"flex"}
          flexWrap={"wrap"}
        >
          <span
            style={{
              ...classes.secondLabel,
              fontSize: "12px",
              color: "#6C757D",
            }}
          >
            {`${numberOfJobsInOrder || 0} ${t(
              "boardMissions.numberOfBoardMissionsInOrder"
            )}`}
          </span>
        </Stack>
      </Stack>

      {/* Time Row */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap="12px"
        sx={{
          padding: "12px",
          backgroundColor: toRgba(safeColor, 0.05),
          borderRadius: "8px",
          border: `1px solid ${toRgba(safeColor, 0.2)}`,
        }}
      >
        <Stack alignItems="center" gap="4px">
          <span
            style={{ fontSize: "28px", fontWeight: "700", color: safeColor }}
          >
            {formattedStartTime}
          </span>
          <span
            style={{ fontSize: "12px", fontWeight: "500", color: "#6C757D" }}
          >
            {formattedStartDate}
          </span>
        </Stack>

        <div
          style={{
            width: "40px",
            height: "2px",
            backgroundColor: safeColor,
            borderRadius: "1px",
          }}
        />

        <Stack alignItems="center" gap="4px">
          <span
            style={{ fontSize: "28px", fontWeight: "700", color: safeColor }}
          >
            {formattedEndTime}
          </span>
          <span
            style={{ fontSize: "12px", fontWeight: "500", color: "#6C757D" }}
          >
            {formattedEndDate}
          </span>
        </Stack>
      </Stack>
    </Stack>
  );
};

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}>
    {props.children}
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#FFF",
    fontSize: theme.typography.pxToRem(12),
    borderRadius: "8px",
    minWidth: "350px",
    // padding: "12px",
    padding: "0px",
  },
  [`& .${tooltipClasses.tooltipArrow} .${tooltipClasses.arrow}`]: {
    color: "#FFF",
  },
}));

export { JobComponent };
