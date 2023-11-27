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
        createData( "1", "Yousef",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Tira Press</span>,"Palestine","Tira",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "2", "Andre",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Cana Press</span>,"Palestine","Cana",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),
        createData( "3", "Mohamed",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33068038_7979631.jpg"} alt="logo" width={40} height={40}/>FREEPRINT</span>,"Emirates","Dubai",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "4", "Sami",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33068033_7983307.jpg"} alt="logo" width={40} height={40}/>Ok Printer</span>,"Emirates","Abu Dhabi",'full partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accepted</h2></div>, <MoreMenuWidget/>),
        createData( "5", "Lore",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon/>Super Printing</span>,"UK","London",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),
        createData( "6", "Mansor",<span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/Untitled-1-05.png"} alt="logo" width={40} height={40} />Al Gurair</span>,"Emirates","Dubai",'Partial partner', <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.pendingStyle}>Pending</h2></div>, <MoreMenuWidget/>),

    ];

    return {rows};
};

export { useRequestsTableWidget };
