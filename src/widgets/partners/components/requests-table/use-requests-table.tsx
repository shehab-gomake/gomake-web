import { TiraIcon } from "../icons/company-1";
import { MoreMenuWidget } from "./more-circle";
import { useStyle } from "./style";

const useRequestsTableWidget = () => {
    const {classes} = useStyle()

    function createData(
        id: any,
        name: any,
        logo: any,
        country: any,
        city: any,
        partnerType: any,
        status: any,
        more: any,

    ) {
        return {
        id,
        name,
        logo,
        country,
        city,
        partnerType,
        status,
        more
        };
    }

    
    const rows = [
        createData( "1", "partner name",<span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "2", "partner name",<span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,"Palestine","Tira",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),
        createData( "3", "partner name",<span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "4", "partner name",<span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "5", "partner name",<span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,"Palestine","Tira",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),
        createData( "6", "partner name",<span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "7", "partner name",<span style={{display: "flex",justifyContent: "center",alignItems: "center",}}><TiraIcon/>Company name</span>,"Palestine","Tira",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),

    ];

    return {rows};
};

export { useRequestsTableWidget };
