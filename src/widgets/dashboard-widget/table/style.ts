import {CSSProperties, useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = (): {classes: Record<string,  CSSProperties | undefined>} => {
    const {theme, primaryColor} = useGomakeTheme();
    const BORDER = '0.1px solid #CECECE';
    const BORDER_RADIUS = '16px';
    const classes = useMemo(() => {
        return {
            tableContainer: {
                display: 'flex',
                padding: '0 21px 0 32px',
            },
            tableHead: {
                backgroundColor: primaryColor(500),
                height: '80px',
                maxHeight: '80px',
                color: 'white',
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                boxSizing: 'border-box' as 'border-box',
            },
            tableCell: {
                border: BORDER,
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: 0,
                height: '80px',
                minWidth: '115px',

            },
            fixedTable: {
                minWidth: '305px',
                borderCollapse: 'collapse' as 'collapse',
                position: 'relative' as 'relative'
            },
            scrollableTable: {
                borderCollapse: 'collapse' as 'collapse',
                width: '100%'
            },
            scrollTableWrapper: {
                overflow: 'auto' as 'auto'
            },
            topLeftCell: {
                borderTopLeftRadius: BORDER_RADIUS,
                marginLeft: '-10px'
            },
            topRightCell: {
                borderTopRightRadius: BORDER_RADIUS
            },
            fixedTableCell: {
                borderBottom: BORDER,
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: 0,
                height: '80px',
            },
            firstColumn: {
                borderLeft: BORDER,
            },
            machineName: {
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
