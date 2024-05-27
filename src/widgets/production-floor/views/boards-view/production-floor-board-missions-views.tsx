import {useRecoilState} from "recoil";
import {EProductionFloorView, productionFloorViewState} from "@/widgets/production-floor/state/production-floor-view";
import {ProductionFloorTableView} from "@/widgets/production-floor/table-view/production-floor-table-view";
import {ProductionFloorKanbanBoard} from "@/widgets/production-floor/kanban-view/production-floor-kanban-board";
import {useProductionFloorData} from "@/widgets/production-floor/use-production-floor-data";
import {useEffect, useState} from "react";
import {useBoardMissionsSignalr} from "@/hooks/signalr/use-board-missions-signalr";
import Stack from "@mui/material/Stack";
import {Skeleton} from "@mui/material";
import {productionFloorFiltersState} from "@/widgets/production-floor/state/production-floor-filters";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {useTranslation} from "react-i18next";

const ProductionFloorBoardMissionsViews = () => {
    const [view] = useRecoilState(productionFloorViewState);
    const {getData} = useProductionFloorData();
    const {connectionId} = useBoardMissionsSignalr();
    const [loading, setLoading] = useState<boolean>(false);
    const [filter] = useRecoilState(productionFloorFiltersState);
    const {secondColor} = useGomakeTheme();
    const {t} = useTranslation();
    useEffect(() => {
        if (!!connectionId) {
            setLoading(true);
            getData(connectionId).then(() => setLoading(false));
        }
    }, [connectionId])
    return (
        <>
            {
                loading ? <Stack gap={'10px'}>
                        {
                            [...new Array(5)].map(_ => <Skeleton variant="rounded" width={'100%'} height={60}/>)
                        }
                    </Stack> :
                    filter.stations.length === 0 ?
                            <span style={ {
                                width: "100%",
                                alignItems: "center",
                                color: secondColor(500),
                                textAlign: "center" as "center",
                                marginTop: 20,
                                height: 42,
                                lineHeight: "17.5px",
                                ...FONT_FAMILY.Lexend(500, 14),
                            }}>{t('productionFloor.noStationsSelected')}</span> :
                        view === EProductionFloorView.TABLE ? <ProductionFloorTableView/> :
                            view === EProductionFloorView.KANBAN ? <ProductionFloorKanbanBoard/> :
                                <div/>

            }
        </>
    )
};

export {ProductionFloorBoardMissionsViews}