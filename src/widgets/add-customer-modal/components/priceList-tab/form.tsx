import * as React from "react";
import { useStyle } from "./style";
import { Switch } from "@mui/material";



const PriceListForm = () => {

    const { clasess } = useStyle();


    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" , paddingTop : "15px"}}>

            <div style={{ display: "flex", flexDirection: "column" ,alignItems: "flex-start" ,paddingLeft: "10%" }} >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Scodex price list</h3>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Digital price list</h3>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Cups price list</h3>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" , alignItems: "flex-start" }} >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Cutting price list</h3>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Notebooks price list</h3>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Books price list</h3>
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" , alignItems: "flex-start" ,paddingRight: "10%"}} >
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Silk and printing on products price list</h3>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >shelf products</h3>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <Switch style={clasess.switchStyle} />
                    <h3 style={clasess.headersStyle} >Bid price list</h3>
                </div>
            </div>
        </div>
    );
};

export { PriceListForm };

