import {Button} from "@mui/material";
import {useTranslation} from "react-i18next";
import {FONT_FAMILY} from "@/utils/font-family";
import {useState} from "react";

interface ISelectedMachineComponentProps {
    machineName: string;
    bgColor: string;
    selected: boolean;
    onClick: () => void;
}

const SelectedMachineComponent = ({machineName, bgColor, selected, onClick}: ISelectedMachineComponentProps) => {
    const {t} = useTranslation();
    return (
        <Button onClick={onClick}
                sx={{
                    border: selected ? '1px solid black' : '0',
                    backgroundColor: bgColor,
                    borderRadius: '30px',
                    width: 'fit-content',
                    color: '#FFF',
                    padding: '2px 20px',
                    ...FONT_FAMILY.Outfit(500, 12),
                    '&:hover': {
                        backgroundColor: bgColor,
                        opacity: selected ? 1 : 0.8
                    }
                }}>
            {t(machineName)}
        </Button>
    )
}

export {SelectedMachineComponent}