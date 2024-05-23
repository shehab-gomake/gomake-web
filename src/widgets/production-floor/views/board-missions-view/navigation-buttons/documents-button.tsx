import {PrimaryButton} from "@/components/button/primary-button";
import { MenuItem, Paper} from "@mui/material";
import {useState} from "react";
import {ArrowDownIcon} from "@/icons";

import {getBoardMissionPDF} from "@/services/api-service/generic-doc/documents-api";
import {useGomakeAxios} from "@/hooks";
import {useTranslation} from "react-i18next";
import {useRecoilState} from "recoil";
import {boardMissionsDetailsState} from "@/widgets/production-floor/state/boards";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {PDFIcon} from "@/pages-components/quotes/more-circle/icons/pdf";
import {ClickOutside} from "@/components/click-out-side/click-out-side";

const DocumentsButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const {callApi} = useGomakeAxios();
    const {t} = useTranslation();
    const dir = t('direction');
    const [boardMissions] = useRecoilState(boardMissionsDetailsState);
    const {primaryColor} = useGomakeTheme();
    const menuList = [
        {
            condition: true,
            name: "boardMissions.pdfWorkMission",
            icon: <PDFIcon />,
            onclick: () => onClickPrint(boardMissions),
        },
        {
            condition: true,
            name: "boardMissions.pdfProductionOrderSummary",
            icon: <PDFIcon />,
            onclick: () => null,
        },
    ];
    const downloadPdf = (url) => {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.target = "_blank";
        anchor.addEventListener("click", () => {
            setTimeout(() => {
                anchor.remove();
            }, 100);
        });
        anchor.click();
    };

    const onClickPrint = async (mission) => {
        const callBack = (res) => {
            if (res?.success) {
                const pdfLink = res.data;
                downloadPdf(pdfLink)
            } else {
            }
        };
        await getBoardMissionPDF(callApi, callBack, { boardMissionId: mission?.boardMissionId });
    };

    return (
        <div style={{position: 'relative'}}>
            <PrimaryButton style={{backgroundColor: primaryColor(300), borderRadius: '12px'}} onClick={()=>setOpen(!open)} variant={'contained'}
                           startIcon={dir === 'rtl' ? <ArrowDownIcon fill={'#FFF'}/> : undefined}
                           endIcon={dir === 'ltr' ? <ArrowDownIcon fill={'#FFF'}/> : undefined}>
                {t('productionFloor.documents')}
            </PrimaryButton>
            {
                !!open && <ClickOutside onClick={()=>setOpen(false)}>
                    <Paper sx={{position: 'absolute', right: 0, top: '110%'}}>
                    {menuList.map((item, index) => (
                        item.condition && (
                            <MenuItem
                                style={{
                                    display: "flex",
                                    flexDirection: "row" as "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    gap: 8,
                                    paddingLeft: 15,
                                    color: primaryColor(300),
                                }}
                                key={index}
                                onClick={item?.onclick}
                            >
                                {item?.icon}
                                {t(item?.name)}
                            </MenuItem>
                        )
                    ))}
                </Paper>
                </ClickOutside>
            }
        </div>
    );
}

export {DocumentsButton}