import {EFileStatus} from "@/widgets/messenger/enums";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";
import {useTranslation} from "react-i18next";

interface IProps {
    status: EFileStatus
}

const FileStatusNameComponent = ({status}: IProps) => {
    const {successColor, errorColor, primaryColor} = useGomakeTheme();
    const {t} = useTranslation();
    return <span
        style={{
            ...FONT_FAMILY.Inter(600, 14),
            color: status === EFileStatus.PENDING ? primaryColor(200) : status === EFileStatus.APPROVED ? successColor(400) : errorColor(600),
        }}>
        {status === EFileStatus.APPROVED ? t('messenger.approvalFileStatus.approved') : status === EFileStatus.REJECTED ? t('messenger.approvalFileStatus.denied') : t('messenger.approvalFileStatus.pending')}
    </span>
};

export {FileStatusNameComponent}