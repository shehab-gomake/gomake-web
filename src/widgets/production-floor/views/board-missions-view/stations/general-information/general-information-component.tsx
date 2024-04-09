import Stack from "@mui/material/Stack";
import {useTranslation} from "react-i18next";
import {useRecoilValue} from "recoil";
import {stationGeneralInformationState} from "@/widgets/production-floor/views/board-missions-view/stations/state";
import {Divider} from "@mui/material";
import {useStyle} from "@/widgets/production-floor/views/board-missions-view/stations/style";

const GeneralInformationComponent = () => {
    const {t} = useTranslation();
    const data = useRecoilValue(stationGeneralInformationState);
    const {classes} = useStyle();
    return (
        <Stack gap={'10px'}>
            <h3>{t("pricingWidget.generalInformation")}</h3>
            <Stack direction={'row'} gap={'16px'}>
                {
                    data?.flatMap((parameter, index, array) => {
                        return index < array.length - 1 ? [<Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                            <span style={classes.detailTitle}>{parameter.name}</span>
                            {
                                parameter.values?.map(value => <span style={classes.detailValue}>{value}</span>)
                            }

                        </Stack>,
                            <Divider orientation={'vertical'} flexItem/>] : [
                            <Stack direction={'row'} gap={'10px'} alignItems={'center'}>
                                <span style={classes.detailTitle}>{parameter.name}</span>
                                {
                                    parameter?.values?.map(value => <span style={classes.detailValue}>{value}</span>)
                                }

                            </Stack>]
                    })
                }
            </Stack>
        </Stack>
    );
}

export {GeneralInformationComponent}