import {useTranslation} from "react-i18next";
import {InputAdornment} from "@mui/material";
import {GoMakeAutoComplate, GoMakeTextInputIcon} from "@/components";
import {AddPlusIcon, SearchIcon} from "@/icons";
import {useGomakeRouter} from "@/hooks";
import {HeaderTitle} from "@/widgets";
import {useSettings} from "./use-settings";
import {Row} from "./widget/row";
import {useStyle} from "./style";

const ProductsSettingsWidget = () => {
    const {t} = useTranslation();
    const {clasess} = useStyle();
    const {navigate} = useGomakeRouter();
    const {tableHeaders, allProducts, term, productSearched, setTerm} =
        useSettings();

    return (
        <>
            <div style={clasess.mainContainer}>
                <div style={clasess.mainHeadecontainer}>
                    <HeaderTitle title={t("products.productManagement.admin.title")}/>
                    <div
                        style={clasess.addProductBtnStyle}
                        onClick={() => navigate("/products/add-product")}
                    >
                        <AddPlusIcon stroke="#101020"/>
                        <div style={clasess.addProductBtnText}>
                            {t("products.productManagement.admin.addProduct")}
                        </div>
                    </div>
                </div>
                <div style={clasess.subHeaderContainer}>
                    <div style={clasess.subHeaderLeftSide}>
                        <div style={clasess.selectProductContainer}>
                            <div style={clasess.selectProductTextStyle}>
                                {t("products.productManagement.admin.selectProduct")}
                            </div>
                            <div style={{width: "100%"}}>
                                <GoMakeAutoComplate
                                    options={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
                                    placeholder={"Product SKU"}
                                    style={clasess.dropDownListStyle}
                                />
                            </div>
                        </div>
                        <div style={clasess.cleanUpContainer}>
                            {t("products.productManagement.admin.cleanUp")}
                        </div>
                        <div style={clasess.searchContainer}>
                            {t("products.productManagement.admin.search")}
                        </div>
                    </div>
                    <div style={clasess.subHeaderRightSide}>
                        <GoMakeTextInputIcon
                            style={clasess.searchInputContainer}
                            placeholder={t("header.search")}
                            onChange={(e) => {
                                setTerm(e.target.value);
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <div style={clasess.iconStyle}>
                                        <SearchIcon/>
                                    </div>
                                </InputAdornment>
                            }
                        />
                    </div>
                </div>
                <div style={clasess.tableHeaderStyle}>
                    {tableHeaders?.map((item) => {
                        return <div style={clasess.headerNameStyle}>{item}</div>;
                    })}
                </div>
                {term ? (
                    <div style={clasess.row}>
                        {productSearched?.map((row: any, index: number) => {
                            return (
                                <div key={`body_row${index}`} style={{width: "100%"}}>
                                    <Row row={row} index={index}/>
                                    {index != allProducts?.length - 1 ? (
                                        <div style={clasess.line}/>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={clasess.row}>
                        {allProducts?.map((row: any, index: number) => {
                            return (
                                <div key={`body_row${index}`} style={{width: "100%"}}>
                                    <Row row={row} index={index}/>
                                    {index != allProducts?.length - 1 ? (
                                        <div style={clasess.line}/>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export {ProductsSettingsWidget}