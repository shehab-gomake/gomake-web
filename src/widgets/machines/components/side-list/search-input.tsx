import {styled} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {useGomakeTheme} from "@/hooks/use-gomake-thme";

const SearchInput = styled(TextField)(() => {
    const {primaryColor} = useGomakeTheme()
    return {
        width: "100%",
        input: {
            backgroundColor: "#FFFFFF",
            boxSizing: "border-box",
            borderRadius: 0,
            height: 40,
            fontFamily: "Lexend",
            fontStyle: "normal",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: "15px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            color: primaryColor(500),
            padding: 12
        },

        "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
                border: 0
            },
            "& fieldset": {
                border: 0,
                boxSizing: "border-box",
                borderRadius: 0,
                width: "100%",
            },
            "&.Mui-focused fieldset": {
                borderColor: 0,
                borderRadius: 0,
                width: "100%",
            },
        },
    }
});

export {SearchInput}