import { TiraIcon } from "../icons/company-1";
import { MoreMenuWidget } from "./more-circle";

const useWallTableWidget = () => {
    
    function createData(
        id: any,
        partner: any,
        address: any,
        lastOrder: any,
        successRate: any,
        totalProducts: any,
        totalQuotes: any,
        balance: any,
        more: any,

    ) {
        return {
        id,
        partner,
        address,
        lastOrder,
        successRate,
        totalProducts,
        totalQuotes,
        balance,
        more
        };
    }

    
    const rows = [
        createData( "1", <span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,   "Tira, Palestine",'322', '45%', '322', '322', '45%', <MoreMenuWidget/>),
        createData( "2", <span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,  "Tira, Palestine",'322', '45%', '322', '322', '45%', <MoreMenuWidget/>),
        createData( "3", <span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,  "Tira, Palestine",'322', '45%', '322', '322', '45%', <MoreMenuWidget/>),
        createData( "4", <span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,  "Tira, Palestine",'322', '45%', '322', '322', '45%', <MoreMenuWidget/>),
        createData( "5", <span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,  "Tira, Palestine",'322', '45%', '322', '322', '45%', <MoreMenuWidget/>),
        createData( "6", <span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,  "Tira, Palestine",'322', '45%', '322', '322', '45%', <MoreMenuWidget/>),
        createData( "7", <span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,  "Tira, Palestine",'322', '45%', '322', '322', '45%', <MoreMenuWidget/>),
        createData( "8", <span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,  "Tira, Palestine",'322', '45%', '322', '322', '45%', <MoreMenuWidget/>),

    ];

    return {rows};
};

export { useWallTableWidget };
