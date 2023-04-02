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
                maxHeight: 'calc(100vh - 540px)',
            },
            ltr: {
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
                tableCell: {
                    textAlign: 'center' as 'center',
                    ...FONT_FAMILY.Lexend(500, 16),
                    lineHeight: 0,
                    height: '80px',
                    minWidth: '115px',
                    borderLeft: BORDER,
                },
            },

            rtl: {
                scrollTableWrapper: {
                    overflow: 'auto' as 'auto',
                    // border: BORDER,
                    borderLeft: BORDER,
                    borderTop: BORDER,
                    borderBottom: BORDER,
                    borderRight: 'unset' as 'unset',
                    borderTopLeftRadius: BORDER_RADIUS,
                    borderBottomLeftRadius: BORDER_RADIUS,
                    marginRight: '-2px'
                },
                fixedTableWrapper: {
                    minWidth: '305px',
                    // border: BORDER,
                    borderRight: BORDER,
                    borderTop: BORDER,
                    borderBottom: BORDER,
                    borderLeft: 'unset' as 'unset',
                    borderTopRightRadius: BORDER_RADIUS,
                    borderBottomRightRadius: BORDER_RADIUS,
                    overflow: 'hidden' as 'hidden',
                    borderLeftStyle:  'hidden' as 'hidden',
                },
                tableCell: {
                    textAlign: 'center' as 'center',
                    ...FONT_FAMILY.Lexend(500, 16),
                    lineHeight: 0,
                    height: '80px',
                    minWidth: '115px',
                    borderRight: BORDER,
                },
            },
            table: {
                width: '100%',
                borderCollapse: 'collapse' as 'collapse',
            },
            tableHead: {
                backgroundColor: primaryColor(500),
                minHeight: '80px',
                height: '80px',
                maxHeight: '80px',
                color: 'white',
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                padding: '0 10px',
                position: 'sticky' as 'sticky',
                top: 0


            },
            tableRow: {
                borderTop: BORDER,
            },
            fixedTableRow: {
                borderTop: BORDER,
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
                height: '100%',
                maxHeight: '80px',
                ...FONT_FAMILY.Lexend(500, 16)
            }
        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
