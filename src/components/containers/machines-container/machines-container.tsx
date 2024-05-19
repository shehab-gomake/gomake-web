import {ISideBarContainer} from "@/components/containers/interface";
import {useStyle} from "@/components/containers/machines-container/style";
import {PrimaryButton} from "@/components/button/primary-button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";
import {useTranslation} from "react-i18next";
import Stack from "@mui/material/Stack";

const MachinesContainer = ({side, children, subHeader, header, actions, sideAction, sideDataTour, bodyDataTour}: ISideBarContainer) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const dir = t('direction');
    return (
        <div style={classes.gridContainer}>
            {
                header && <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                    <PrimaryButton
                        variant={"text"}
                        href={'/machines'}
                        startIcon={dir === "ltr" ? <ArrowBackIcon /> : <ArrowForwardIcon />}
                        style={{  height: 30,
                            marginRight: 5,
                            background: "#CBCBE5",
                            width: 90,
                            borderRadius: 8,
                        }}
                    >
                        {t("materials.buttons.back")}
                    </PrimaryButton>
                    <h1 style={classes.header}>{header}</h1></Stack>
            }
            <div data-tour={sideDataTour} style={classes.sideList}>
                {side}
            </div>
            {subHeader && <h2 style={classes.subHeader}>{subHeader}</h2>}
            <div data-tour={bodyDataTour} style={classes.main}>
                {children}
            </div>
            <div style={classes.sideActionFooter}>
                <div style={{backgroundColor: '#FFF', width: '100%', padding: 1, display: 'flex', height: '100%'}}>
                    {sideAction && sideAction}
                </div>
            </div>
            <div style={classes.footer}>
                {actions && actions}
            </div>
        </div>
    )
}

export {MachinesContainer};