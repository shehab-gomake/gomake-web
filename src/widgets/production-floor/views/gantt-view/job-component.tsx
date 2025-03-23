import { styled } from "@mui/material/styles";
import { useRouter } from "next/router";
import { Skeleton, Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import Stack from "@mui/material/Stack";
import { IGanttJob } from "@/widgets/production-floor/views/gantt-view/interface";
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
}: {
  item: IGanttJob;
  getItemProps: any;
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
  return (
    <div
      {...getItemProps({
        style: {
          background:
            loadingItemId === item.id
              ? "inherit"
              : isEditable
              ? item.bgColor
              : "#2E3091",
          pointerEvents: isEditable ? "auto" : "none",
          color: "white",
          borderRadius: "14px",
          border: "1px solid #F6F6F6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          opacity: isEditable && item.isHasSelected && !item.selected ? 0.3 : 1,
          minHeight: "22px",
        },
      })}
    >
      {loadingItemId === item.id ? (
        <Skeleton width={"100%"} height={"100%"} />
      ) : (
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
            // className="rct-item-content"
            style={{ textAlign: "center", width: "100%" }}
          >
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
          </div>
        </HtmlTooltip>
      )}
    </div>
  );
};

const JobTooltipComponent = ({
  clientName,
  productName,
  title,
  bgColor,
  // boardMissionNumber,
  jobNumber,
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

  return (
    <Stack
      direction={"column"}
      gap={"15px"}
      padding={"10px"}
      width={"100%"}
      onClick={handleOpenMission}
      style={{
        borderRadius: "4px",
        // border: `1px solid var(--Colors-Yellow-600,${bgColor})`,
        boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        display={"flex"}
        flexWrap={"wrap"}
      >
        <Stack direction="row" alignItems="center" gap="10px">
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: bgColor,
            }}
          />
          <span style={{ ...classes.jobTitle }}>{title}</span>
        </Stack>
        <OrderJObNumbersComponent
          boardMission={{ boardMissionNumber: jobNumber, orderNumber }}
          textColor={bgColor}
          bgColor={toRgba(bgColor, 0.2)}
        />
      </Stack>
      <Stack>
        <Stack direction={"row"} justifyContent={"space-between"} gap={"5px"}>
          <span style={classes.productTitle}>
            {productName || "Product name"}
          </span>
          <span style={classes.productTitle}>
            {clientName || "Client name"}
          </span>
        </Stack>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          display={"flex"}
          flexWrap={"wrap"}
        >
          <span style={classes.secondLabel}>
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
        gap="5px"
      >
        <span style={{ fontSize: "24px", fontWeight: "600", color: bgColor }}>
          {formattedStartTime}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "400", color: "#797C80" }}>
          {formattedStartDate}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "600", color: "#797C80" }}>
          {" "}
          -{" "}
        </span>
        <span style={{ fontSize: "24px", fontWeight: "600", color: bgColor }}>
          {formattedEndTime}
        </span>
        <span style={{ fontSize: "12px", fontWeight: "400", color: "#797C80" }}>
          {formattedEndDate}
        </span>
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
