import { HandQuickSetupIcon } from "@/icons";

import { useQuickSetupWelcome } from "./use-quick-setup-welcome";
import { useStyle } from "./style";

const QuickSetupWelcomeWidget = () => {
    const { classes } = useStyle();
    const { data } = useQuickSetupWelcome()

    return (
        <div style={classes.mainContainer}>
            <div style={classes.leftSide}>
                {
                    data?.map((item, index) => {
                        return (
                            <div style={classes.mainItemContainer} key={`index-${index}-${item.title}`}>
                                <div>
                                    {item.icon}
                                </div>
                                <div style={classes.itemColumnContainer}>
                                    <div style={classes.titleListStyle}> {item.title}</div>
                                    <div style={classes.descriptionListStyle}> {item.description}</div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div style={classes.rightSide}>
                <HandQuickSetupIcon />
                <div style={classes.welcomeTextStyle}>Welcome to Gomake </div>
                <div style={classes.subTitleTextStyle}>Congratulations on Starting Your Journey with Us!</div>
                <div style={classes.descriptionTextStyle}>
                    Your GoMake account is set up, and we're excited to welcome you to our community of printing professionals. You're just a few steps away from harnessing the full power of our platform.
                </div>
                {/* <GomakePrimaryButton style={classes.btnContainer}>
                    Get started
                </GomakePrimaryButton> */}

            </div>
        </div>
    )
}

export { QuickSetupWelcomeWidget }