import * as React from "react";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import Switch from "./Switch";
import { HeaderFilter } from "../../header-filter";



const PriceListForm = () => {

    const { clasess } = useStyle();
    const { t } = useTranslation();
    const DocumentsOptions = React.useMemo(
        () => [t("option1"),
        t("option2"),
        t("option3"), ,],
        []
    );

    return (
        <div style={{ display: "flex", width: "960px", height: "227", flexDirection: "column", alignItems: "flex-start", gap: "24px", marginTop: "24px" }}>
            <h3 style={clasess.headerStyle} >{t("customers.modal.priceListHeader")}</h3>
            <div style={{ display: "flex", width: "882px", height: "15px", justifyContent: "center", alignItems: "center", gap: "60px" }} >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "176px", height: "15px" }}>
                    <div style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </div>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.notebooksPriceList")}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "209px", height: "15px", paddingLeft: "43px" }}>
                    <div style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </div>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.digitalPriceList")}</h3>
                </div >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "137px", height: "15px" }}>
                    <div style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </div>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.envelopesPriceList")}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "180px", height: "15px" }}>
                    <div style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </div>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.scodexPriceList")}</h3>
                </div >
            </div>
            <div style={{ display: "flex", width: "960px", height: "15px", justifyContent: "center", alignItems: "center", gap: "60px" }} >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "221px", height: "15px" }}>
                    <div style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </div>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.booksPriceList")}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "126px", height: "15px" }}>
                    <div style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </div>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.cupsPriceList")}</h3>
                </div >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "178px", height: "15px", paddingLeft: "36px" }}>
                    <div style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </div>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.bidPriceList")}</h3>
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "255px", height: "15px" }}>
                    <div style={{ width: "23px", height: "18px" }}>
                        <Switch checked={false} ></Switch>
                    </div>
                    <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.printingPriceList")}</h3>
                </div >
            </div>

            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: "176px", height: "15px" }}>
                <div style={{ width: "23px", height: "18px" }}>
                    <Switch checked={false} ></Switch>
                </div>
                <h3 style={clasess.switchHeaderStyle} >{t("customers.modal.shelfPriceList")}</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", }}>
                <h3 style={clasess.headerStyle1} >{t("customers.modal.selectProducts")}</h3>
                <HeaderFilter setAllOptions={DocumentsOptions} style={clasess.autoComplateStyle} setPlaceholder="placeholder"></HeaderFilter>
            </div>
        </div>
    );
};

export { PriceListForm };

