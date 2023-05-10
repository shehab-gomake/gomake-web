import {Box, Modal} from "@mui/material";
import {useStyle} from "@/components/modal/style";
import {GomakeTextInput} from "@/components";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import {usePrintHouseId} from "@/hooks/use-printhouse-id";
import {FormEvent, useState} from "react";
import {styled} from "@mui/material/styles";
import {FONT_FAMILY} from "@/utils/font-family";

const GoMakeModal = ({show, onSubmit}: { show: boolean; onSubmit: () => void; }) => {
    const [code, setCode] = useState<string>('');
    const {classes} = useStyle();
    const {t} = useTranslation();
    const {getPrintHouseId} = usePrintHouseId();
    const handleChange = (event: FormEvent<HTMLInputElement>) => {
        setCode(event.currentTarget.value);
    }

    const onClickSubmit = async () => {
        const res = await getPrintHouseId(code);
        if (res) {
            onSubmit();
        }
    }
    return (
        <Modal
            open={show}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"

        >
            <Box sx={classes.container}>
                <div style={classes.modal}>
                    <h6 style={classes.header}>{t('dashboard-page.insertCode')}</h6>
                    <GomakeTextInput value={code} onChange={handleChange}/>
                    <div></div>
                    <SubmitButton style={classes.submitBtn} onClick={onClickSubmit}>{t('dashboard-page.submit')}</SubmitButton>
                </div>
            </Box>
        </Modal>
    );
}

export {GoMakeModal};

const SubmitButton = styled(Button)((props: any) => ({
    boxShadow: "none",
    textTransform: "none",
    padding: "10px 32px",
    lineHeight: "1.5px",
    height: 40,
    width: 99,
    backgroundColor: '#ED028C',
    borderRadius: 4,
    gap: 7,
    color: "#FFFFFF",
    "&:hover": {
        letterSpacing: "0.1em",
        backgroundColor: '#ED028C',
    },
    transition: "0.25s",
    ...FONT_FAMILY.Lexend(500, 16),
}));