import { TiraIcon } from "../icons/company-1";
import { MoreMenuWidget } from "./more-circle";
import Box from '@mui/material/Box';
import { useState } from "react";
import React from "react";
import { HeaderTitle } from "@/widgets/header-title";
import { HeaderLeftArrowIcon, HeaderRightArrowIcon } from "../icons/arrow-icon";
import { GeneralCard } from "./components.tsx/general-card";
import { partnerInfoModalState } from "../states";
import { useRecoilState } from "recoil";
import { Stack } from "@mui/material";
import { GeneralSection } from "./components.tsx/section-1";
import { MembersSection } from "./components.tsx/section-2";
import { InfoSection } from "./components.tsx/section-3";
import { SecondaryButton } from "@/components/button/secondary-button";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import Image from "next/image";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
type Anchor = 'top' | 'left' | 'bottom' | 'right';

const useWallTableWidget = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const dir: "rtl" | "ltr" = t("direction");

    function createData(
        id: any,
        partner: any,
        quoteNumber: any,
        response: any,
        view: any,
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
            totalQuotes,
            successRate,
            more
        };
    }

    <Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33772099_8109544.svg"} alt="logo" width={40} height={40} />
    const rows = [
        createData("1", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><TiraIcon />{t("Tira Press")}</span>, "X64654654", <CreateOutlinedIcon />, <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>,  '322', '45%', <MoreMenuWidget />),
        createData("2", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33068038_7979631.jpg"} alt="logo" width={40} height={40} />{t("FREEPRINT")}</span>, "TT1543", <CreateOutlinedIcon />, <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.deniedStyle}>Deny</h2></div>,'4000', '69%', <MoreMenuWidget />),
        createData("3", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/Untitled-1-02.png"} alt="logo" width={40} height={40} />Digital Print</span>, "TT1544", <CreateOutlinedIcon />, <div style={{ display: "flex", justifyContent: "center" }}><h2 style={classes.acceptedStyle}>Accept</h2></div>,  '1600', '30%', <MoreMenuWidget />),
        createData("4", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/34630260_8025507.jpg"} alt="logo" width={40} height={40} />Print Studio</span>, "TT1546", <CreateOutlinedIcon />, <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>,  '2700', '25%', <MoreMenuWidget />),
        createData("5", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33068033_7983307.jpg"} alt="logo" width={40} height={40} />Ok Printer</span>, "TT1548", <CreateOutlinedIcon />, <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.deniedStyle}>Deny</h2></div>,  '1200', '48%', <MoreMenuWidget />),
        createData("6", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33758854_8085381.jpg"} alt="logo" width={40} height={40} />Screenox</span>, "X64654659", <CreateOutlinedIcon />, <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>,  '3500', '70%', <MoreMenuWidget />),
        createData("7", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/33772094_8109564.jpg"} alt="logo" width={40} height={40} />Printing House</span>, "X64654658", <CreateOutlinedIcon />, <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.deniedStyle}>Deny</h2></div>,  '1450', '50%', <MoreMenuWidget />),
        createData("8", <span style={{ display: "flex", justifyContent: "center", alignItems: "center", }}><Image src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/Untitled-1-01.png"} alt="logo" width={40} height={40} />Dubai Printing Press</span>, "TT1568", <CreateOutlinedIcon />, <div style={{ display: "flex", justifyContent: "center" }} ><h2 style={classes.acceptedStyle}>Accept</h2></div>, '2100', '53%', <MoreMenuWidget />),
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
                <HeaderTitle title={t("partners.Drawer.PartnerInfo")} marginTop={"0px"} marginBottom={"0px"} />
                {dir == "ltr" ? <HeaderRightArrowIcon /> : <HeaderLeftArrowIcon />}
            </Stack>
            <Stack direction={'column'} gap={"20px"} >
                <GeneralCard></GeneralCard>
                <GeneralSection title={t("partners.Drawer.Overview")} subTitle={t("partners.Drawer.Aprofessional")}></GeneralSection>
                <GeneralSection title={t("partners.Drawer.Vision")} subTitle={t("partners.Drawer.TransformPrint")}></GeneralSection>
                <MembersSection title={t("partners.Drawer.Team member")}></MembersSection>
                <InfoSection />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Image
                        src={"https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/map.png"}
                        alt="map"
                        width={150}
                        height={150}
                    /></div>
                <SecondaryButton variant="contained" style={{ width: "160px", height: "40px", alignSelf: "center", lineHeight: "15px", position: "fixed" as "fixed", bottom: "15px", }}>{t("partners.Drawer.addPartner")}</SecondaryButton>
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
