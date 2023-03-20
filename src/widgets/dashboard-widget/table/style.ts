import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const BORDER = '0.1px solid #CECECE';
    const BORDER_RADIUS = '16px';
    const classes = useMemo(() => {
        return {
            tableContainer: {
                display: 'flex',
                margin: '0 21px 0 32px',
            },

            scrollTableWrapper: {
                overflow: 'auto' as 'auto',
                border: BORDER,
                borderTopRightRadius: BORDER_RADIUS,
                borderBottomRightRadius: BORDER_RADIUS,
                borderLeft: 0
            },
            fixedTableWrapper: {
                minWidth: '305px',
                border: BORDER,
                borderTopLeftRadius: BORDER_RADIUS,
                borderBottomLeftRadius: BORDER_RADIUS,
                overflow: 'hidden' as 'hidden',
                borderRight: 0,

            },
            table: {
                width: '100%',
                borderCollapse: 'collapse' as 'collapse',
            },
            tableHead: {
                backgroundColor: primaryColor(500),
                height: '80px',
                maxHeight: '80px',
                color: 'white',
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                padding: '0 10px'
            },
            tableRow: {
                borderTop: BORDER,
            },
            fixedTableRow: {
                borderTop: BORDER,
                borderRight: BORDER
            },
            tableCell: {
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: 0,
                height: '80px',
                minWidth: '115px',
                border: BORDER,
                borderTop: 0,
                borderBottom: 0,
                borderRight: 0
            },
            fixedTableCell: {
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: 0,
                height: '80px',

            },
            tdRows: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                justifyContent: 'space-around' as 'space-around',
                alignItems: 'center' as 'center',
                width: '100%',
                height: '100%'
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
