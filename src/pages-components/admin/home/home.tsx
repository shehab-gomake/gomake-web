import {QuoteWidget} from "./widgets/quote-widget/quote-widget";
import {useStyle} from "./style";
import {HomeTableWidget} from "./widgets/home-table-widget/home-table-widget";
import {useHome} from "./use-home";
import {useEffect} from "react";
import {CardsWidget} from "./widgets/cards-widget/cards-widget";
import {Skeleton} from "@mui/material";
import {useRecoilValue} from "recoil";
import {homeReportsState} from "@/pages-components/quote/store/quote";
import {StepType, useTour} from "@reactour/tour";
import Stack from "@mui/material/Stack";

const HomePageComponentForAdmin = ({isAdmin}) => {
    const {classes} = useStyle();
    const {Title, setIsDisplay, isDisplay, flag, selectedClient, t} = useHome();
    const allReports = useRecoilValue<any>(homeReportsState);

    const {setIsOpen, setSteps, setCurrentStep} = useTour();
    const homeSteps: StepType[] = [
        {
            selector: '[data-tour="quote-widget"]',
            content: 'Let\'s dive into our first price and product production demo together!',
            position: 'bottom'
        },
        {
            selector: '[data-tour="select-customer"]',
            content: <Stack textAlign={'center'} justifyContent={'center'} alignItems={'center'} gap={'5px'}>
                <span>Please select a customer.</span>
                <span>We've already added a customer named</span>
                <span>New Quote</span>
                <span>for your convenience.</span>
            </Stack>,
            position: 'right',
            styles: {
                maskWrapper: (base) => ({...base, zIndex: 1}),
            }
        },
        {
            selector: '[data-tour="select-type"]',
            content: 'select customer type',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({...base, zIndex: 1}),
            }
        },
        {
            selector: '[data-tour="select-product"]',
            content: 'Now, please select a product from the list.',
            position: 'right',
            styles: {
                maskWrapper: (base) => ({...base, zIndex: 1}),
            }
        },
        {
            selector: '[data-tour="create-quote"]',
            content: <Stack justifyContent={'center'} alignItems={'center'} gap={'5px'}>
                <span>Let's begin our quote.</span>
                <span>Click on 'Create quote' to get started.</span>
                <span>Please ensure that the paper product is added to the quote.</span>
                <span>This step is necessary to proceed with the process.</span>
            </Stack>,
            position: 'bottom',
        },
    ]

    useEffect(() => {
        setSteps(homeSteps);
        setIsOpen(true);
        setCurrentStep(0);
    }, []);

    useEffect(() => {
        setIsDisplay(flag);
    }, [selectedClient]);
    return (
        <div style={classes.mainContainer}>
            <div style={classes.firstRowContainer}>
                <div style={classes.titleStyle}>{Title}</div>
                <div style={classes.containerStyle}>
                    <div style={classes.widgetStyle}>
                        <QuoteWidget isAdmin={isAdmin}/>
                    </div>
                    <div style={classes.widgetStyle}>
                        {
                            allReports ? (
                                    <CardsWidget/>
                                ) :
                                (
                                    <Skeleton variant="rectangular" sx={classes.skeltonStyle}/>
                                )
                        }
                    </div>
                </div>
            </div>
            {isDisplay && (
                <div style={classes.secondRowContainer}>
                    <div style={classes.titleStyle}>
                        {t("sales.quote.documents")}{" "}
                        <span style={{color: "rgb(213, 214, 233)"}}>
              / {selectedClient?.name}
            </span>
                    </div>
                    <HomeTableWidget/>
                </div>
            )}
        </div>
    );
};

export {HomePageComponentForAdmin};
