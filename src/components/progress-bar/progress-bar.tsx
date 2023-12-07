import {styled} from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";
import {linearProgressClasses} from "@mui/material";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";
import Stack from "@mui/material/Stack";
import {useStyle} from "@/pages-components/products/digital-offset-price/style";

interface IProgressBarProps{
    progress:number,
    topLeftText?:string,
    topRightText?:string,
    bottomLeftText?:string,
    bottomRightText?:string,
}
const GomakeLinearProgress = styled(LinearProgress)(({ datatype }) => {
    const {primaryColor,secondColor} = useGomakeTheme();
  return {
      height: 6,
      borderRadius: 5,
      [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: primaryColor(100),
      },
      [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor:secondColor(500)
      },
  }  
});
const ProgressBar = (props:IProgressBarProps)=>{
    const { clasess } = useStyle();
    return(
        <div style={{width:'100%'}}>
            <Stack justifyContent="space-between" direction={"row"}>
                <Stack>
                    <div style={clasess.labelStyle}>{props.topLeftText}</div>
                </Stack>
                <Stack>
                    <div style={clasess.labelStyle}>{props.topRightText}</div>
                </Stack>
            </Stack>
            <GomakeLinearProgress style={{width:'100%',borderRadius:5,height: 7,}} variant="determinate" value={props.progress} />
            <Stack justifyContent="space-between" direction={"row"}>
                <Stack>
                    <div style={clasess.labelStyle}>{props.bottomLeftText}</div>
                </Stack>
                <Stack>
                    <div style={clasess.labelStyle}>{props.bottomRightText}</div>
                </Stack>
            </Stack>
        </div>
    )
}
export {ProgressBar}