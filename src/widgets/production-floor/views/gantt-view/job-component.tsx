import { styled } from '@mui/material/styles';
import {useRouter} from "next/router";
import { Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import Stack from "@mui/material/Stack";
import {IGanttJob} from "@/widgets/production-floor/views/gantt-view/interface";
import {Instance} from "@popperjs/core";
import {useRef} from "react";
import {toRgba} from "@/utils/helpers";
import {OrderJObNumbersComponent} from "@/widgets/production-floor/kanban-view/kanban-card/order-job-num-coponent";
import {useTranslation} from "react-i18next";
import {useStyle} from "@/widgets/production-floor/kanban-view/kanban-card/style";

const JobComponent = ({item, getItemProps}: { item: IGanttJob; getItemProps: any }) => {
    const isEditable = item.isEditable;
    const positionRef = useRef<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });
    const popperRef = useRef<Instance>(null);
    const areaRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: React.MouseEvent) => {
        positionRef.current = {x: event.clientX, y: event.clientY};

        if (popperRef.current != null) {
            popperRef.current.update();
        }
    };
    return (
        <div
            {...getItemProps({
                style: {
                    background: isEditable ? item.bgColor : "#2E3091",
                    pointerEvents: isEditable ? "auto" : "none",
                    color: "white",
                    borderRadius: 0,
                    border: '1px solid #F6F6F6',
                    display: "flex",
                    alignItems: "center",
                    justifyContent: 'center',
                    gap: '10px',
                    opacity: isEditable && item.isHasSelected && !item.selected ? 0.3 : 1,
                },
            })}
        >
            <HtmlTooltip  slotProps={{
                popper: {
                    popperRef,
                    anchorEl: {
                        getBoundingClientRect: () => {
                            return new DOMRect(
                                positionRef.current.x,
                                areaRef.current!?.getBoundingClientRect().y,
                            );
                        },
                    },
                },
            }} arrow placement="top" title={<JobTooltipComponent {...item}/>}>
                <div ref={areaRef}
                     onMouseMove={handleMouseMove} className="rct-item-content"
                     style={{textAlign: "center", width: '100%'}}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '5px',
                        maxHeight: '100%',
                        overflow: 'hidden'
                    }}>
                        <div/>
                        <span style={{
                            display: 'inline-block',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',}}>{item.title}</span>
                        <div>
                            {
                                isEditable && <div style={{
                                    width: '14px',
                                    height: '14px',
                                    borderRadius: '50%',
                                    border: '2px solid #FFF',
                                    backgroundColor: item.statusColor,
                                    marginLeft: 'auto'
                                }}/>
                            }
                        </div>
                    </div>
                </div>
            </HtmlTooltip>
        </div>
    );
};

const JobTooltipComponent = ({
                                 clientName, productName,
                                 title,
                                 bgColor,
                                 boardMissionNumber,
                                 orderNumber,
                                 numberOfJobsInOrder,
    boardMissionId,
    productType
                             }: IGanttJob) => {
    const {t} = useTranslation();
    const {classes} = useStyle();
    const {push} = useRouter();
    const handleOpenMission = () => {
        push(
            `/production-floor?boardMissionsId=${boardMissionId}&productType=${productType}&step=stations`
        );
    }
    return (
        <Stack direction={"column"} gap={"15px"} padding={"10px"} borderRadius={"12px"} width={"100%"}
               onClick={handleOpenMission}
               style={{
                   borderRadius: "8px",
                   border: `1px solid var(--Colors-Yellow-600,${bgColor})`,
                   background: toRgba(bgColor, 0.1),
                   boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.08)",
               }}>
            <Stack direction={"row"} justifyContent={"space-between"} display={"flex"} flexWrap={"wrap"}>
                <span style={classes.jobTitle}>{title || t("boardMissions.jobName")}</span>
                <OrderJObNumbersComponent
                    boardMission={{boardMissionNumber, orderNumber}}
                    textColor={bgColor}
                    bgColor={toRgba(bgColor, 0.2)}/>
            </Stack>
            <Stack>
                <Stack direction={"row"} justifyContent={"space-between"} gap={"5px"}>
                    <span style={classes.productTitle}>{productName || 'Product name'}</span>
                    <span style={classes.productTitle}>{clientName || 'Client name'}</span>
                </Stack>
                <Stack direction={"row"} justifyContent={"space-between"} display={"flex"} flexWrap={"wrap"}>
                    <span style={classes.secondLabel}>
                        {`${numberOfJobsInOrder || 0} ${t("boardMissions.numberOfBoardMissionsInOrder")}`}
                    </span>
                    {/*<span style={classes.secondLabel}>{end_time.format('DD-MM-YYYY')}</span>*/}
                    <span style={classes.secondLabel}>"clientName"</span>
                </Stack>
            </Stack>
        </Stack>
    )
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} >{props.children}</Tooltip>
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#FFF',
        fontSize: theme.typography.pxToRem(12),
        borderRadius: '8px',
        minWidth: '350px',
        padding: '12px'
    },
    [`& .${tooltipClasses.tooltipArrow} .${tooltipClasses.arrow}`]: {
        color: '#FFF'
    },
}));

export {JobComponent}