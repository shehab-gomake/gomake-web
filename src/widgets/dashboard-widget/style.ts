import {useMemo} from "react";

const useStyle = () => {
    const classes = useMemo(() => {
        return {
            container: {
                display: 'flex',
                flexDirection: 'column' as 'column',
                gap: '30px',
            },
            SkeletonCardsContainer:{
                display: 'flex',
                flexDirection: "row" as 'row',
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 15,
                padding: '24px 21px 24px 32px',
                backgroundColor: '#fff',
                boxShadow: '0px 4px 20px rgba(238, 238, 238, 0.501967)',
                borderRadius: '20px',
                border: '1px solid #F8F9FA'
            }
        };
    }, []);
    return {
        classes,
    };
};
export {useStyle};
