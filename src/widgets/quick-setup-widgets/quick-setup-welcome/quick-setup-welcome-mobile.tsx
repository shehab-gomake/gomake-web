import { HandQuickSetupIcon } from "@/icons";

import { useQuickSetupWelcome } from "./use-quick-setup-welcome";
import { useStyle } from "./style";

const QuickSetupWelcomeMobileWidget = () => {
    const { classes } = useStyle();
    const { data } = useQuickSetupWelcome()


    return (
        <div style={classes.mainMobileContainer}>
            <div style={classes.firstContainer}>
                <HandQuickSetupIcon width="109" height="111" />
                <div style={classes.welcomeTextStyleMobile}>Welcome to Gomake </div>
                <div style={classes.subTitleTextStyleMobile}>Congratulations on Starting Your Journey with Us!</div>
            </div>
            <div style={classes.secondContainer}>
                {
                    data?.map((item, index) => {
                        return (
                            <div style={classes.mainItemContainer} key={`index-${index}-${item.title}`}>
                                <div>
                                    {item.icon}
                                </div>
                                <div style={classes.itemColumnContainer}>
                                    <div style={classes.titleListStyleMobile}> {item.title}</div>
                                    <div style={classes.descriptionListStyleMobile}> {item.description}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            {/* <GomakePrimaryButton style={classes.btnContainerMobile}>
                Get started
            </GomakePrimaryButton> */}
        </div>
    )
}

export { QuickSetupWelcomeMobileWidget }