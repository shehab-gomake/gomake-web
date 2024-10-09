import { useStyle } from "./style";
import { useActions } from "./use-actions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { StepType } from "@reactour/tour";
import { useGoMakeTour } from "@/hooks/use-go-make-tour";
import { Divider, IconButton, Menu, MenuItem } from "@mui/material";
import { SettingsIcon } from "@/icons/settings";
import { useState } from "react";
import { UpdateMinPrice } from "../products/profits/widgets/exceptions/update-min-price";
import { PercentageMaterial } from "@/icons";
import { GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";

const ActionPageWidget = () => {
    const { clasess } = useStyle();
    const { tableHeaders, allActions, materilasSearched, term, setTerm, t } =
        useActions();
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
    const { } = useGoMakeTour(actionsSteps, [allActions, materilasSearched])

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [openModal, setOpenModal] = useState(false);
    const [percentageProfit, setPercentageProfit] = useState("");

    const handleMoreOptionIconClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const onCloseModal = () => {
        setOpenModal(false);
    };
    const onOpenModal = () => {
        setOpenModal(true);
    };

    return (
        <div style={clasess.mainContainer}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", width: "100%" }}>
                <HeaderTitleWithSearch
                    title={t("products.actions.admin.title")}
                    onChange={(e) => setTerm(e)}
                />
                <IconButton onClick={handleMoreOptionIconClick} >
                    <SettingsIcon stroke={"#000000"} />
                </IconButton>
            </div>
            {term ? (

                <div style={{ width: '100%' }} data-tour={'actionsTable'}>
                    <PrimaryTable
                        stickyFirstCol={false}
                        stickyHeader={false}
                        rows={materilasSearched}
                        headers={tableHeaders}
                    />
                </div>
            ) : (
                <div style={{ width: '100%' }} data-tour={'actionsTable'}>
                    <PrimaryTable
                        data-tour={'actionsTable'}
                        stickyFirstCol={false}
                        stickyHeader={false}
                        rows={allActions}
                        headers={tableHeaders}
                    />
                </div>)}

            <Menu
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleCloseMenu}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                onClick={handleCloseMenu}
            >
                <MenuItem style={clasess.menuContainer} onClick={onOpenModal}>
                    <PercentageMaterial />
                    <div style={clasess.rowTextStyle}>
                        update profit by percentage
                    </div>
                </MenuItem>
                {/* <Divider /> */}

            </Menu>
            <GoMakeModal modalTitle="update profit by percentage" insideStyle={{ height: 'fit-content', width: "30%" }} openModal={openModal} onClose={onCloseModal}>
                <div style={clasess.modalMainContainer}>
                    <GomakeTextInput
                        style={clasess.multiLineTextInputStyle}
                        onChange={(e) => setPercentageProfit(e.target.value)}
                        value={percentageProfit}
                        placeholder="profit by percentage"
                    />
                    <GomakePrimaryButton
                        style={clasess.btnContainer}
                    // onClick={onClickOpenOrderNowModal}
                    >
                        {t("documentingSettings.update")}
                    </GomakePrimaryButton>
                </div>
            </GoMakeModal>
        </div>
    );
};

export { ActionPageWidget };
