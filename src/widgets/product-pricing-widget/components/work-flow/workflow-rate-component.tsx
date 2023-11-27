import {FONT_FAMILY} from "@/utils/font-family";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

interface Interface {
    label: string;
    value: number;
}
const WorkflowRateComponent = ({label, value}: Interface) => {
    const {successColor, warningColor, neutralColor} = useGomakeTheme()
  return(
      <span style={{
          width: 'fit-content',
          padding: '5px 10px',
          textAlign: "center",
          verticalAlign: 'middle',
          ...FONT_FAMILY.Lexend(500, 14),
          borderRadius: 16,
          backgroundColor: value === 1 ? successColor(100) : value === 2 ? warningColor(100) : value === 3 ? '#F4F3FF' : neutralColor(100),
          color: value === 1 ? successColor(700) : value === 2 ? warningColor(700) : value === 3 ? '#3F3F3F' : neutralColor(700)
      }}>
          {`${label} #${value}`}
      </span>
  );
}
export {WorkflowRateComponent}