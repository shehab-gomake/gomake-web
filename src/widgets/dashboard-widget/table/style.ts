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
                margin: '0 21px 15px 32px',
            },
            scrollTableWrapper: {
                overflow: 'auto' as 'auto',
                // border: BORDER,
                borderRight: BORDER,
                borderTop: BORDER,
                borderBottom: BORDER,
                borderLeft: 'unset' as 'unset',
                borderTopRightRadius: BORDER_RADIUS,
                borderBottomRightRadius: BORDER_RADIUS,
                marginLeft: '-2px'
            },
            fixedTableWrapper: {
                minWidth: '305px',
                // border: BORDER,
                borderLeft: BORDER,
                borderTop: BORDER,
                borderBottom: BORDER,
                borderRight: 'unset' as 'unset',
                borderTopLeftRadius: BORDER_RADIUS,
                borderBottomLeftRadius: BORDER_RADIUS,
                overflow: 'hidden' as 'hidden',
                borderRightStyle:  'hidden' as 'hidden',
            },
            table: {
                width: '100%',
                borderCollapse: 'collapse' as 'collapse',
                border: 'unset' as 'unset',
                borderSpacing: '0px',

            },
            tableHead: {
                backgroundColor: primaryColor(500),
                minHeight: '80px',
                height: '80px',
                maxHeight: '80px',
                color: 'white',
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Heebo(500, 16),
                padding: '0 10px',
            },
            tableRow: {
                borderTop: BORDER,
            },
            fixedTableRow: {
                borderTop: BORDER,
                // borderRight: BORDER
            },
            tableCell: {
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Heebo(500, 16),
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
                ...FONT_FAMILY.Heebo(500, 16),
                lineHeight: 0,
                height: '80px',
            },
            tdRows: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                justifyContent: 'space-around' as 'space-around',
                alignItems: 'center' as 'center',
                width: '100%',
                height: '100%',
                maxHeight: '80px',
                ...FONT_FAMILY.Heebo(500, 16)
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
