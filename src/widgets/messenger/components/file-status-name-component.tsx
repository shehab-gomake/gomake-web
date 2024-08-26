import {EFileStatus} from "@/widgets/messenger/enums";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";
import {useTranslation} from "react-i18next";
import Button from "@mui/material/Button";

interface IProps {
    status: EFileStatus
}

const FileStatusNameComponent = ({status}: IProps) => {
    const {successColor, errorColor, primaryColor, secondColor} = useGomakeTheme();
    const {t} = useTranslation();
    return <Button disabled={true}
        style={{
            width: '100%',
            textAlign: 'center',
            height: '40px',
            backgroundColor: status === EFileStatus.PENDING ? primaryColor(400) : status === EFileStatus.APPROVED ? '#504FA1' : secondColor(400),
            ...FONT_FAMILY.Inter(600, 14),
            color: '#FFF',
            cursor: 'none'
        }}>
        {status === EFileStatus.APPROVED ? t('messenger.approvalFileStatus.approved') : status === EFileStatus.REJECTED ? t('messenger.approvalFileStatus.denied') : t('messenger.approvalFileStatus.pending')}
    </Button>
};

export {FileStatusNameComponent}