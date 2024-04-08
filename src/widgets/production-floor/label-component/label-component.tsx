import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import {FONT_FAMILY} from "@/utils/font-family";

interface ITaskCategoryLabelProps {
    label?: string;
}

const LabelComponent = ({label}: ITaskCategoryLabelProps) => {
    const {primaryColor} = useGomakeTheme();
    return (
        <span style={{
            ...FONT_FAMILY.Lexend(600, 12),
            color: primaryColor(500),
            padding: '2px 12px',
            backgroundColor: primaryColor(50),
            borderRadius: 17,
            textAlign: 'center'
        }}>
          {label}
      </span>
    )
}

export {LabelComponent}