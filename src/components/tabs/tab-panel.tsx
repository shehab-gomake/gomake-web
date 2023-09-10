import {Box, Typography} from "@mui/material";
import {ReactNode} from "react";

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div hidden={value !== index} {...other} style={{ width: "100%" }}>
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export {CustomTabPanel}