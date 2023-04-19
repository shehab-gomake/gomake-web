import {useMemo} from "react";
import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const useStyle = () => {
    const {theme, primaryColor} = useGomakeTheme();
    const BORDER = '0.1px solid #CECECE';
    const BORDER_RADIUS = '16px';
    const classes = useMemo(() => {
        return {
            tableWrapper: {
                border: BORDER,
                borderRadius: BORDER_RADIUS,
                borderRight: 0,
                padding: 0,
                margin: '10px 21px 15px 21px',
                overflow: 'auto' as 'auto',
                width: 'fit-content',
                maxHeight: '80vh',
                maxWidth: '96vw',
            },
            table: {
                borderCollapse: 'collapse' as 'collapse',
                position: 'relative' as 'relative',
            },

            tableHead: {
                backgroundColor: primaryColor(500),
                minHeight: '80px',
                height: '80px',
                maxHeight: '80px',
                color: 'white',
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                padding: '10px',
                position: 'sticky' as 'sticky',
                top: '0px',
            },

            tableCell: {
                textAlign: 'center' as 'center',
                ...FONT_FAMILY.Lexend(500, 16),
                lineHeight: 0,
                height: '60px',
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
                gap: '20px',
                ...FONT_FAMILY.Lexend(500, 16)
            },

            firstColHead: {
                minWidth: '350px',
                right: 0,
                zIndex: 1,
                padding: '0 5px'

            },
            firstColHeadContent: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRight: 0
            },
            firstColCell: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                minWidth: '350px',
                position: 'sticky' as 'sticky',
                right: 0,
                backgroundColor: '#ffffff',
                borderLeft: 0,
                padding: '0 5px'

            },

        };
    }, [theme]);
    return {
        classes,
    };
};
export {useStyle};
