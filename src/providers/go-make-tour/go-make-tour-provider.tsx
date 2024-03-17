import {TourProvider} from "@reactour/tour";
import {FONT_FAMILY} from "@/utils/font-family";
import {useEffect} from "react";
import {useGomakeAxios} from "@/hooks";
import {inactiveUserFirstLogin} from "@/services/api-service/users/users-api";


interface IProps {
    children: JSX.Element;
}

const GoMakeTourProvider = ({children}: IProps) => {
    const {callApi} = useGomakeAxios();
    useEffect(() => {}, [children])

    const onCloseTour = async () => {
        await inactiveUserFirstLogin(callApi, () =>{});
    }
    return <TourProvider steps={[]}
                         styles={{
                             popover: (base) => ({
                                 ...base,
                                 '--reactour-accent': '#ef5a3d',
                                 borderRadius: 20,
                                 ...FONT_FAMILY.Outfit(600, 18)
                             }),
                             maskArea: (base) => ({...base, rx: 10, padding: '10px'}),
                             maskWrapper: (base) => ({...base}),
                             badge: (base) => ({...base, left: 'auto', right: '-0.8125em', backgroundColor: '#2E3092'}),
                             controls: (base) => ({...base, marginTop: 100}),
                             close: (base) => ({...base, right: 'auto', left: 8, top: 10}),
                         }}

                         onClickMask={() => {}}
                         onClickClose={(clickProps) => {
                             clickProps.setCurrentStep(0);
                             clickProps.setIsOpen(false);
                             onCloseTour().then();
                         }}
                         defaultOpen={false}
                         scrollSmooth={true}>
        {children}
    </TourProvider>
}

export {GoMakeTourProvider}