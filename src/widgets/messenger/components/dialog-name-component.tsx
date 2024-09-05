import {FONT_FAMILY} from "@/utils/font-family";

interface IProps {
    dialogName: string
}
const DialogNameComponent = ({dialogName}: IProps) => {
    return <span style={{...FONT_FAMILY.Inter(600, 16)}}>{dialogName}</span>

}

export {DialogNameComponent}