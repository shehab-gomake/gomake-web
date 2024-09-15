import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {adaptRight, convertWidthToVW} from "@/utils/adapter";
import {SCREEN_WIDTH} from "@/utils/layout-config";

const useStyle = (dir: string) => {
    const {theme, primaryColor, warningColor} = useGomakeTheme();
    const BORDER = '0.1px solid #CECECE';
    const BORDER_RADIUS = '16px';
    const classes = useMemo(() => {
        return {
            tableWrapper: {
                border: BORDER,
                borderRadius: BORDER_RADIUS,
                borderRight: 0,
                padding: 0,
                margin: '10px 0px 15px 0px',
                overflow: 'auto' as 'auto',
                maxWidth: convertWidthToVW(SCREEN_WIDTH - 150),
                maxHeight: '75vh',
            },
            table: {
                borderCollapse: 'collapse' as 'collapse',
                position: 'relative' as 'relative',
            },

            tableHead: {
                backgroundColor: primaryColor(500),
                // minHeight: '80px',
                // height: '80px',
                maxHeight: '80px',
                color: 'white',
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(400, 16),
                padding: '20px',
                position: 'sticky' as 'sticky',
                top: '0px',
                cursor: 'pointer' as 'pointer',
            },

            selectedMachine: {
                backgroundColor: primaryColor(300),
            },

            tableCell: {
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: 0,
                height: '40px',
                minWidth: '115px',
                border: BORDER,
                borderTop: 0,
                borderLeft: 0
            },
            tdRows: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                alignItems: 'center' as 'center',
                justifyContent: 'center' as 'center',
                width: '100%',
                height: '100%',
                maxHeight: '80px',
                // gap: '10px',
                ...FONT_FAMILY.Lexend(400, 14)
            },

            firstColHead: {
                minWidth: '650px',
                zIndex: 1,
                padding: '0 5px',
                ...adaptRight(dir,0)

            },
            firstColHeadContent: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRight: 0,
            },
            firstColCell: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minWidth: '350px',
                padding: ' 5px',
            },
            splitBoardsStatuses: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                alignItems: 'center' as 'center',
            },
            splitBoardsStatusesRow: {
                height: 40,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                width: 200,
                border: 0,
                paddingLeft: 5
            },
            firstColCellSplitBoards: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minWidth: '405px',
                padding: '0 5px 0 0',
            },
            lateMission: {
                backgroundColor: warningColor(100)
            }

        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
