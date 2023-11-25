import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { Stack } from "@mui/material";
import { discoverInputs } from "./inputs";
import { FormInput } from "@/components/form-inputs/form-input";
import { IInput } from "@/components/form-inputs/interfaces";
import { useState } from "react";
import { PrimaryButton } from "@/components/button/primary-button";

const DiscoverWidget = () => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [state, setState] = useState<any>();
    const [termSearch, setTermSearch] = useState<any>("");

    const onChangeInputs = (key, value) => {
        setState({ ...state, [key]: value })
    }

    return (
        <div style={classes.mainContainer} >
            <Stack direction={'column'} gap={"10px"} padding={"10px"}>
                <h3 style={classes.headerStyle}>What are you looking for?</h3>
                <Stack direction={'row'} gap={"16px"} width={"100%"} alignItems={"end"} >
                    <SearchInputComponent searchInputStyle={classes.searchInputStyle} onChange={(e) => setTermSearch(e)} placeHolder="Search for company, product, machine, etc.." />
                    <Stack direction={'row'} gap={"16px"}>
                    {
                        discoverInputs(state).map(item => <FormInput input={item as IInput} changeState={onChangeInputs} error={false} readonly={false} />)
                    }
                    </Stack>
                    <PrimaryButton variant="contained" style={{ width: "128px", height: "40px" }}>Search</PrimaryButton>
                </Stack>
            </Stack>
        </div>
    )
};
export { DiscoverWidget };