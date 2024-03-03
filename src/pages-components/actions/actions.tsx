import {useStyle} from "./style";
import {useActions} from "./use-actions";
import {PrimaryTable} from "@/components/tables/primary-table";
import {HeaderTitleWithSearch} from "@/widgets/header-title-with-search";
import {useEffect} from "react";
import {StepType, useTour} from "@reactour/tour";

const ActionPageWidget = () => {
    const {clasess} = useStyle();
    const {tableHeaders, allActions, materilasSearched, term, setTerm, t} =
        useActions();

    const {setIsOpen, setSteps, setCurrentStep} = useTour();
    const actionsSteps: StepType[] = [
        {
            selector: '[data-tour="actionsTable"]',
            content: 'This is the table displaying all the actions we support.',
            position: 'right',
        },
        {
            selector: '[data-tour="editPrintingAction"]',
            content: 'Let\'s edit the profit in the "Printing" line and see how you control the pricing system.\n',
            position: 'bottom',
        },
    ]

    useEffect(() => {
        setIsOpen(true);
        setSteps(actionsSteps);
        setCurrentStep(0);
    }, [allActions, materilasSearched]);
    return (
        <div style={clasess.mainContainer}>
            <HeaderTitleWithSearch
                title={t("products.actions.admin.title")}
                onChange={(e) => setTerm(e)}
            />
            {term ? (

                <div style={{width: '100%'}} data-tour={'actionsTable'}>
                    <PrimaryTable
                        stickyFirstCol={false}
                        stickyHeader={false}
                        rows={materilasSearched}
                        headers={tableHeaders}
                    />
                </div>
            ) : (
                <div style={{width: '100%'}} data-tour={'actionsTable'}>
                    <PrimaryTable
                        data-tour={'actionsTable'}
                        stickyFirstCol={false}
                        stickyHeader={false}
                        rows={allActions}
                        headers={tableHeaders}
                    />
                </div>)}
        </div>
    );
};

export {ActionPageWidget};
