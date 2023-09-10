import Stack from "@mui/material/Stack";
import {Avatar} from "@mui/material";
import {useState} from "react";
import {GomakeTextInput} from "@/components";
import {useTranslation} from "react-i18next";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const EditInitialsComponent = () => {
    const [label, setLabel] = useState();
    const {t} = useTranslation();
    const {primaryColor, secondColor, successColor, errorColor, neutralColor} = useGomakeTheme();
    const colors = [primaryColor(500), successColor(500), secondColor(500), errorColor(500), neutralColor(500)];
    const [selectedColor, setSelectedColor] = useState<string>(colors[0]);
    return (
        <Stack direction={'row'} gap={'20px'} justifyContent={'center'} padding={'20px'}>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: "center", width: '100%'}}>
                <Avatar sx={{height: 120, width: 120, backgroundColor: selectedColor, fontSize: 40}}>{label ? label : ' '}</Avatar>
            </div>
            <Stack direction={'column'} gap={'20px'} width={'100%'}>
                <Stack direction={"row"} gap={'5px'}>
                    {
                        colors.map(color => <div onClick={() => setSelectedColor(color)}
                                                 style={{
                                                     height: '20px',
                                                     width: '20px',
                                                     borderRadius: '5px',
                                                     cursor: 'pointer',
                                                     backgroundColor: color,
                                                 }}/>)
                    }
                </Stack>
                <Stack direction={'column'} gap={'5px'}>
                    <span>{t('initials')}</span>
                    <GomakeTextInput value={label} onChange={(e)=> setLabel(e.target.value.toUpperCase())} style={{height: '30px'}}/>
                </Stack>
            </Stack>
        </Stack>
    );
};

export {EditInitialsComponent};