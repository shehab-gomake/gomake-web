import { TiraIcon } from "../icons/company-1";
import { MoreMenuWidget } from "./more-circle";
import { useStyle } from "./style";
import Image from "next/image";

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
        createData( "1", "partner name",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Tira Press</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "2", "partner name",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Tira Press</span>,"Palestine","Tira",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),
        createData( "3", "partner name",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33068038_7979631.jpg"} alt="logo" width={40} height={40}/>FREEPRINT</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "4", "partner name",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33068033_7983307.jpg"} alt="logo" width={40} height={40}/>Ok Printer</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "5", "partner name",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Tira Press</span>,"Palestine","Tira",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),
        createData( "6", "partner name",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/34630260_8025507.jpg"} alt="logo" width={40} height={40}/>Print Studio</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "7", "partner name",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Tira Press</span>,"Palestine","Tira",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),

    ];

    return {rows};
};

export { useRequestsTableWidget };
