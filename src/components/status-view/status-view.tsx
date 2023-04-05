import {IStatusView} from "@/components/status-view/interface";
import {useStyle} from "@/components/status-view/style";
import {useTranslation} from "react-i18next";

const StatusView = ({status, style = {}, label}: IStatusView) => {
    const {classes} = useStyle();
    const {t} = useTranslation();
    const styles = {...classes[label ? 'label' : 'circle'], ...classes[status], ...style}
    return (
        <div style={styles}>{label && t(label)}</div>
    );
}

export {StatusView}