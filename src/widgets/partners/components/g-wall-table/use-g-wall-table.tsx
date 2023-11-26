import { TiraIcon } from "../icons/company-1";
import { MoreMenuWidget } from "./more-circle";
import Box from '@mui/material/Box';
import { useState } from "react";
import React from "react";
import { HeaderTitle } from "@/widgets/header-title";
import { HeaderArrowIcon } from "../icons/arrow-icon";
import { GeneralCard } from "./components.tsx/general-card";
import { partnerInfoModalState } from "../states";
import { useRecoilState } from "recoil";
import { Stack } from "@mui/material";
import { GeneralSection } from "./components.tsx/section-1";
import { MembersSection } from "./components.tsx/section-2";
import { InfoSection } from "./components.tsx/section-3";
import { SecondaryButton } from "@/components/button/secondary-button";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Image from "next/image";
import { useStyle } from "./style";
type Anchor = 'top' | 'left' | 'bottom' | 'right';

const useWallTableWidget = () => {
    const { classes } = useStyle();

    function createData(
        id: any,
        partner: any,
        quoteNumber: any,
        response: any,
        view: any,
        totalProducts: any,
        totalQuotes: any,
        successRate: any,
        more: any,

    ) {
        return {
            id,
            partner,
            quoteNumber,
            response,
            view,
            totalProducts,
            totalQuotes,
            successRate,
            more
        };
    }


    const rows = [
        createData("1", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "X64654654", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>, '322', '322', '45%', <MoreMenuWidget />),
        createData("2", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "TT1543", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.deniedStyle}>Deny</h2></div>, '322', '322', '45%', <MoreMenuWidget />),
        createData("3", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "TT1544", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>, '322', '322', '45%', <MoreMenuWidget />),
        createData("4", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "TT1546", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>, '322', '322', '45%', <MoreMenuWidget />),
        createData("5", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "TT1548", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.deniedStyle}>Deny</h2></div>, '322', '322', '45%', <MoreMenuWidget />),
        createData("6", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "X64654659", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>, '322', '322', '45%', <MoreMenuWidget />),
        createData("7", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "X64654658", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.deniedStyle}>Deny</h2></div>, '322', '322', '45%', <MoreMenuWidget />),
        createData("8", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "TT1558", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>, '322', '322', '45%', <MoreMenuWidget />),
        createData("9", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />Company name</span>, "TT1568", "45%", <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>, '322', '322', '45%', <MoreMenuWidget />),


    ];



    const [openPartnerModal, setOpenPartnerModal] = useRecoilState<boolean>(partnerInfoModalState);
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer =
        (anchor: Anchor, open: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }
                setState({ ...state, [anchor]: open });
            };

    const list = (anchor: Anchor) => (
        <Box
            sx={{ width: "780px", padding: "16px" }}
            role="presentation"
            onClick={() => setOpenPartnerModal(false)}
            onKeyDown={() => setOpenPartnerModal(false)}
        >
            <Stack direction={'row'} alignItems={"center"} gap={"10px"} marginBottom={"20px"}>
                <HeaderTitle title={"Partner info"} marginTop={"0px"} marginBottom={"0px"} />
                <HeaderArrowIcon></HeaderArrowIcon>
            </Stack>
            <Stack direction={'column'} gap={"20px"} >

                <GeneralCard></GeneralCard>
                <GeneralSection title="Overview" subTitle="A professional printing house that specializes in provide high-quality printing solutions for a wide range of needs."></GeneralSection>
                <GeneralSection title="Vision" subTitle="Transform print into a transformative experience,Foster strong, enduring relationships built on integrity, transparency, and shared excellence."></GeneralSection>
                <MembersSection title="Team member"></MembersSection>
                <InfoSection />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Image
                        src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/map.png"}
                        alt="map"
                        width={150}
                        height={150}
                    /></div>
                <SecondaryButton variant="contained" style={{ width: "160px", height: "40px", alignSelf: "center" , lineHeight:"15px" }}>Add partner</SecondaryButton>
            </Stack>
        </Box>
    );
    return {
        rows,
        list,
        toggleDrawer,
        state,
        setState
    };
};

export { useWallTableWidget };
