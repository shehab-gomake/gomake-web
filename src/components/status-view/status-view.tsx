import {IStatusView} from "@/components/status-view/interface";
import {useStyle} from "@/components/status-view/style";

const StatusView = ({status, style = {}, label}: IStatusView) => {
    const {classes} = useStyle();
    const styles = {...classes[label ? 'label' : 'circle'], ...classes[status], ...style}
    return (
        <div style={styles}>{label && label.slice(0,10)}</div>
    );
}

export {StatusView}